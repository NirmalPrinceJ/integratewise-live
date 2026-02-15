/**
 * Memory Extraction Service
 * 
 * Extracts insights, decisions, and action items from AI conversations
 * using Cloudflare Workers AI or OpenRouter
 */

import { AppEnv } from './config.js';

interface Message {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

interface ExtractedMemory {
  memory_type: 'insight' | 'preference' | 'fact' | 'decision' | 'action_item' | 'relationship';
  content: string;
  importance: number;
}

const EXTRACTION_PROMPT = `You are an AI assistant that extracts key memories from conversations.

Analyze the following conversation and extract:
1. **Insights** - Key learnings or realizations
2. **Decisions** - Choices or determinations made
3. **Action Items** - Tasks or next steps mentioned
4. **Facts** - Important factual information shared
5. **Preferences** - User preferences or opinions expressed

For each memory, assess its importance on a scale of 0.0 to 1.0 where:
- 0.0-0.3: Low importance, general context
- 0.4-0.6: Medium importance, useful to remember
- 0.7-1.0: High importance, critical information

Return a JSON array of objects with these fields:
- memory_type: one of "insight", "decision", "action_item", "fact", "preference"
- content: the extracted memory (concise, one sentence)
- importance: number between 0 and 1

Only extract meaningful memories. If nothing significant, return an empty array [].

Conversation:
`;

/**
 * Extract memories from a conversation using OpenRouter or Workers AI
 */
export async function extractMemories(
  env: AppEnv,
  messages: Message[]
): Promise<ExtractedMemory[]> {
  if (!messages || messages.length === 0) {
    return [];
  }

  // Format conversation for analysis
  const conversationText = messages
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  const prompt = EXTRACTION_PROMPT + conversationText + '\n\nExtracted memories (JSON array):';

  try {
    let responseText = '';

    // Try OpenRouter first (has more capable models)
    if (env.OPENROUTER_API_KEY) {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://integratewise.ai',
          'X-Title': 'IntegrateWise Memory Extraction'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024,
          temperature: 0.3
        })
      });

      const data = await response.json() as any;
      responseText = data.choices?.[0]?.message?.content || '';
    }
    // Fallback to Workers AI
    else if (env.AI) {
      const response = await env.AI.run('@cf/meta/llama-3-8b-instruct' as any, {
        prompt,
        max_tokens: 1024,
        temperature: 0.3
      }) as any;
      responseText = response.response || '';
    }
    // Fallback to OpenAI
    else if (env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024,
          temperature: 0.3
        })
      });

      const data = await response.json() as any;
      responseText = data.choices?.[0]?.message?.content || '';
    } else {
      console.warn('No AI provider available for memory extraction');
      return [];
    }

    // Parse the JSON response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('No JSON array found in response');
      return [];
    }

    const memories = JSON.parse(jsonMatch[0]) as ExtractedMemory[];
    
    // Validate and sanitize
    return memories
      .filter(m => 
        ['insight', 'preference', 'fact', 'decision', 'action_item', 'relationship'].includes(m.memory_type) &&
        typeof m.content === 'string' &&
        m.content.length > 0
      )
      .map(m => ({
        memory_type: m.memory_type,
        content: m.content.substring(0, 500), // Limit length
        importance: Math.max(0, Math.min(1, Number(m.importance) || 0.5))
      }));

  } catch (error) {
    console.error('Memory extraction failed:', error);
    return [];
  }
}

/**
 * Save extracted memories to D1
 */
export async function saveExtractedMemories(
  db: D1Database,
  tenantId: string,
  userId: string,
  conversationId: string,
  memories: ExtractedMemory[],
  contextType?: string,
  contextId?: string
): Promise<string[]> {
  const savedIds: string[] = [];
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  for (const memory of memories) {
    const id = crypto.randomUUID();
    
    try {
      await db.prepare(`
        INSERT INTO ai_memories (
          id, tenant_id, user_id, conversation_id, memory_type, content,
          context_type, context_id, importance, source, metadata,
          expires_at, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'auto_extracted', '{}', ?, ?, ?)
      `).bind(
        id, tenantId, userId, conversationId,
        memory.memory_type, memory.content,
        contextType || null, contextId || null, memory.importance,
        expiresAt, now, now
      ).run();

      savedIds.push(id);
    } catch (error) {
      console.error(`Failed to save memory: ${error}`);
    }
  }

  return savedIds;
}

/**
 * Process a conversation for memory extraction
 * Called when a conversation is archived or ends
 */
export async function processConversationForMemories(
  env: AppEnv,
  tenantId: string,
  userId: string,
  conversationId: string
): Promise<{ extracted: number; saved: string[] }> {
  // Get conversation messages
  const { results: messages } = await env.DB.prepare(`
    SELECT id, role, content, created_at FROM ai_messages 
    WHERE conversation_id = ? 
    ORDER BY created_at ASC
  `).bind(conversationId).all() as { results: Message[] };

  if (messages.length < 2) {
    return { extracted: 0, saved: [] };
  }

  // Get conversation context
  const { results: conversations } = await env.DB.prepare(`
    SELECT context_type, context_id FROM ai_conversations WHERE id = ?
  `).bind(conversationId).all() as { results: { context_type?: string; context_id?: string }[] };

  const conversation = conversations[0];

  // Extract memories
  const extractedMemories = await extractMemories(env, messages);

  if (extractedMemories.length === 0) {
    return { extracted: 0, saved: [] };
  }

  // Save to D1
  const savedIds = await saveExtractedMemories(
    env.DB,
    tenantId,
    userId,
    conversationId,
    extractedMemories,
    conversation?.context_type,
    conversation?.context_id
  );

  return { extracted: extractedMemories.length, saved: savedIds };
}
