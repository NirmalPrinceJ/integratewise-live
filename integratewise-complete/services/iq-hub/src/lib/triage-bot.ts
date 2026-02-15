import { SupabaseClient } from '@supabase/supabase-js';
import { AppEnv, getSupabaseClient, getApiKey } from './config';

export type TriagePriority = "low" | "medium" | "high" | "urgent";
export type TriageCategory =
  | "question"
  | "bug_report"
  | "feature_request"
  | "support"
  | "feedback"
  | "urgent"
  | "general"
  | "spam";

export interface TriageResult {
  priority: TriagePriority;
  category: TriageCategory;
  confidence: number;
  reasoning: string;
  suggested_actions: string[];
  sentiment: "positive" | "neutral" | "negative";
  keywords: string[];
  assignee_suggestion?: string;
  requires_immediate_attention: boolean;
}

export interface TriageConfig {
  aiProvider?: "claude" | "deepseek";
  apiKey?: string;
  enableAutoAssignment?: boolean;
  enableAutoResponse?: boolean;
}

/**
 * Analyze message content using AI to determine triage classification
 */
async function analyzeWithAI(
  env: AppEnv,
  content: string,
  context: Record<string, unknown>,
  config: TriageConfig
): Promise<TriageResult> {
  const provider = config.aiProvider || "claude";
  const apiKey = config.apiKey || getApiKey(env, provider);

  const prompt = `You are a triage bot for IntegrateWise OS. Analyze the message and provide triage classification.
Message: "${content}"
Context: ${JSON.stringify(context)}

Respond ONLY with valid JSON containing: priority, category, confidence, reasoning, suggested_actions, sentiment, keywords, requires_immediate_attention.`;

  if (!apiKey) {
    return analyzeWithRules(content, context);
  }

  try {
    if (provider === "claude") {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) throw new Error(`Claude error: ${response.status}`);
      const data: any = await response.json();
      return JSON.parse(data.content[0].text.match(/\{[\s\S]*\}/)[0]);
    } else {
      // DeepSeek
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) throw new Error(`DeepSeek error: ${response.status}`);
      const data: any = await response.json();
      return JSON.parse(data.choices[0].message.content);
    }
  } catch (error) {
    console.error("[Triage] AI failed, falling back to rules:", error);
    return analyzeWithRules(content, context);
  }
}

/**
 * Rule-based triage analysis (fallback)
 */
function analyzeWithRules(content: string, context: Record<string, unknown>): TriageResult {
  const lower = content.toLowerCase();
  const result: TriageResult = {
    priority: "medium",
    category: "general",
    confidence: 0.5,
    reasoning: "Rule-based fallback",
    suggested_actions: ["Review manually"],
    sentiment: "neutral",
    keywords: [],
    requires_immediate_attention: false,
  };

  if (lower.includes("urgent") || lower.includes("break") || lower.includes("down")) {
    result.priority = "urgent";
    result.category = "urgent";
    result.requires_immediate_attention = true;
  }

  return result;
}

/**
 * Triage a message
 */
export async function triageMessage(
  env: AppEnv,
  messageId: string,
  content: string,
  context: any,
  config: TriageConfig = {}
): Promise<TriageResult> {
  const result = await analyzeWithAI(env, content, context, config);

  // 1. D1 Logging (Spine)
  try {
    await env.DB.prepare(`
      INSERT INTO ai_session_memories (
        id, session_id, memory_type, memory_key, memory_value, confidence, trust_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      messageId,
      'triage_result',
      result.category,
      JSON.stringify(result),
      result.confidence,
      'model_inferred'
    ).run();
  } catch (err) {
    console.error("[Triage] D1 storage failed:", err);
  }

  // 2. Supabase Integration (Legacy)
  const supabase = getSupabaseClient(env);
  if (supabase) {
    await supabase.from("triage_results").insert({
      message_id: messageId,
      content,
      ...result,
      metadata: context,
    });
  }

  return result;
}
