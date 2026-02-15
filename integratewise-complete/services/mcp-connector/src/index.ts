/**
 * IntegrateWise MCP Tool Server
 * 
 * Standalone Cloudflare Worker for MCP-style tool discovery and invocation.
 * Provides Knowledge Bank operations via 7 tools.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { structuredLog, getRequestId } from './lib/logging';
import { toolsHandler, invokeHandler } from './handlers/tools';

type Bindings = {
  KB_BUCKET?: string;
  GCS_PROJECT_ID?: string;
  FIRESTORE_PROJECT_ID?: string;
  VERTEX_AI_SEARCH_ENGINE_ID?: string;
  VERTEX_AI_LOCATION?: string;
  DATABASE_URL?: string; // Legacy
  DB: D1Database; // Day 2: D1 Database
  KNOWLEDGE_SERVICE_URL?: string; // Day 2: Knowledge service for embedding
  ENVIRONMENT: string;
  MCP_CONNECTOR_API_KEY?: string;
  MCP_IDEMPOTENCY?: KVNamespace;
};

type Variables = {
  requestId: string;
  log: ReturnType<typeof structuredLog>;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// CORS for preflight
app.use('*', cors());

// Request ID and logging middleware
app.use('*', async (c, next) => {
  const requestId = getRequestId(c.req.header('x-request-id'));
  c.set('requestId', requestId);
  c.set('log', structuredLog(requestId, c.env.ENVIRONMENT));

  const log = c.get('log');
  const start = Date.now();

  log.info('Request started', {
    method: c.req.method,
    path: c.req.path,
  });

  await next();

  log.info('Request completed', {
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    durationMs: Date.now() - start,
  });

  c.res.headers.set('x-request-id', requestId);
});

// ============================================================================
// ROOT & HEALTH ENDPOINTS
// ============================================================================

// Root endpoint
app.get('/', (c) => {
  return c.json({
    name: 'IntegrateWise MCP Tool Server',
    version: '1.0.0',
    status: 'ok',
    protocol: 'mcp-like',
    endpoints: {
      tools: '/tools',
      invoke: '/invoke',
      health: '/health',
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    worker: 'integratewise-mcp-tool-server',
    version: '2.0.0-semantic',
    environment: c.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
    features: [
      'session-capture',
      'auto-embedding',
      'entity-linking',
      'correlation-tracing'
    ],
    tools: {
      count: 7,
      names: [
        'kb.write_session_summary',
        'kb.write_article',
        'kb.get_artifact',
        'kb.list_recent',
        'kb.search',
        'kb.topic_upsert',
        'kb.topic_list',
      ],
    },
  });
});

// ============================================================================
// MCP TOOL SERVER ENDPOINTS
// ============================================================================

// Tool discovery
app.get('/tools', toolsHandler);

// Tool invocation
app.post('/invoke', invokeHandler);

// ============================================================================
// AI SESSION MEMORY CAPTURE (Part 1)
// ============================================================================
import { SaveSessionMemorySchema } from './lib/schema';
import { updateFirestoreDocument } from './lib/firestore';

// Day 2: Helper to trigger session embedding via Knowledge service
async function triggerSessionEmbedding(
  knowledgeServiceUrl: string,
  tenantId: string,
  sessionId: string,
  summary: string,
  memories: string[],
  correlationId: string
): Promise<{ session_id: string; chunks_created: number; total_tokens: number } | null> {
  try {
    const response = await fetch(`${knowledgeServiceUrl}/knowledge/embed/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
        'x-correlation-id': correlationId,
      },
      body: JSON.stringify({
        session_id: sessionId,
        tenant_id: tenantId,
        summary: summary,
        memories: memories,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Knowledge service error: ${errorText}`);
    }

    const result = await response.json() as { data: { session_id: string; chunks_created: number; total_tokens: number } };
    return result.data;
  } catch (error) {
    console.error('Session embedding failed:', error);
    return null;
  }
}

app.post('/v1/mcp/save_session_memory', async (c) => {
  const log = c.get('log');
  const apiKey = c.req.header('Authorization')?.replace('Bearer ', '') || c.req.header('X-MCP-Key');

  if (!apiKey || apiKey !== c.env.MCP_CONNECTOR_API_KEY) {
    log.warn('Unauthorized session memory capture attempt');
    return c.json({ status: 'error', error: 'unauthorized' }, 401);
  }

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ status: 'error', error: 'invalid_json' }, 400);
  }

  const result = SaveSessionMemorySchema.safeParse(body);
  if (!result.success) {
    log.warn('Validation failed for session memory capture', { details: result.error.flatten() });
    return c.json({
      status: 'error',
      error: 'validation_failed',
      details: result.error.flatten()
    }, 400);
  }

  const { tenant_id, session_id, tool_source, user_label, summary, memories } = result.data;
  const projectId = c.env.FIRESTORE_PROJECT_ID || 'integratewise-default';
  const now = new Date();

  try {
    // 1. Write the main session document
    const sessionDocId = `${tenant_id}::${session_id}`;
    await updateFirestoreDocument(projectId, `ai_sessions/${sessionDocId}`, {
      tenant_id,
      session_id,
      tool_source,
      user_label,
      summary,
      started_at: now.toISOString(), // Simplified: assuming current time if not provided
      ended_at: now.toISOString(),
      created_at: now.toISOString(),
      scoring_source_trust_level: 'model_inferred',
      version: 'v1'
    });

    // 2. Write each memory
    await Promise.all(memories.map((memory, index) => {
      const memoryDocId = `${tenant_id}::${session_id}::${index}`;
      return updateFirestoreDocument(projectId, `ai_session_memories/${memoryDocId}`, {
        tenant_id,
        session_id,
        ...memory,
        confidence_score: memory.confidence_score ?? 0.7,
        created_at: now.toISOString(),
        scoring_source_trust_level: 'model_inferred'
      });
    }));

    log.info('Successfully stored AI session memories', {
      tenant_id,
      session_id,
      tool_source,
      memories_count: memories.length
    });

    // Day 2: Trigger auto-embedding for semantic search
    let embeddingResult = null;
    if (c.env.KNOWLEDGE_SERVICE_URL) {
      try {
        embeddingResult = await triggerSessionEmbedding(
          c.env.KNOWLEDGE_SERVICE_URL,
          tenant_id,
          session_id,
          summary,
          memories.map(m => m.text),
          c.get('requestId')
        );
        log.info('Auto-embedding triggered', {
          session_id,
          chunks_created: embeddingResult?.chunks_created,
        });
      } catch (embedError: any) {
        log.warn('Auto-embedding failed (non-blocking)', { error: embedError.message });
      }
    }

    return c.json({
      status: 'success',
      stored_memories: memories.length,
      tenant_id,
      session_id,
      embedding_status: embeddingResult ? 'completed' : 'skipped',
      timestamp: now.toISOString()
    });

  } catch (error: any) {
    log.error('Failed to store AI session memories in Firestore', { error: error.message });
    return c.json({ status: 'error', error: 'internal_storage_error' }, 500);
  }
});

// ============================================================================
// Day 2: ENHANCED SESSION CAPTURE WITH ENTITY LINKING
// ============================================================================

import { z } from 'zod';

const EnhancedSessionSchema = z.object({
  tenant_id: z.string().uuid(),
  session_id: z.string().uuid(),
  tool_source: z.string().default('unknown'),
  user_label: z.string().optional(),

  // Session content
  summary: z.string().min(1),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'tool']),
    content: z.string(),
    timestamp: z.string().optional(),
  })).optional(),

  // Tool calls made during session
  tool_calls: z.array(z.object({
    tool_name: z.string(),
    tool_input: z.any().optional(),
    tool_output: z.any().optional(),
  })).optional(),

  // Entity linking
  entity_type: z.string().optional(), // e.g., 'account', 'opportunity'
  entity_id: z.string().optional(),
  related_entities: z.array(z.object({
    entity_type: z.string(),
    entity_id: z.string(),
    relationship: z.string().optional(), // e.g., 'mentioned', 'primary', 'related'
  })).optional(),

  // Extracted memories
  memories: z.array(z.object({
    memory_type: z.string(),
    memory_key: z.string(),
    memory_value: z.string(),
    confidence_score: z.number().min(0).max(1).optional(),
    entity_type: z.string().optional(),
    entity_id: z.string().optional(),
  })).optional(),

  // Auto-embedding control
  auto_embed: z.boolean().optional().default(true),
});

app.post('/v1/mcp/capture_session', async (c) => {
  const log = c.get('log');
  const correlationId = c.get('requestId');

  const apiKey = c.req.header('Authorization')?.replace('Bearer ', '') || c.req.header('X-MCP-Key');

  if (!apiKey || apiKey !== c.env.MCP_CONNECTOR_API_KEY) {
    log.warn('Unauthorized enhanced session capture attempt');
    return c.json({ status: 'error', error: 'unauthorized', correlation_id: correlationId }, 401);
  }

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ status: 'error', error: 'invalid_json', correlation_id: correlationId }, 400);
  }

  const result = EnhancedSessionSchema.safeParse(body);
  if (!result.success) {
    log.warn('Validation failed for enhanced session capture', { details: result.error.flatten() });
    return c.json({
      status: 'error',
      error: 'validation_failed',
      details: result.error.flatten(),
      correlation_id: correlationId
    }, 400);
  }

  const {
    tenant_id, session_id, tool_source, user_label, summary,
    messages, tool_calls, entity_type, entity_id, related_entities,
    memories, auto_embed
  } = result.data;

  const projectId = c.env.FIRESTORE_PROJECT_ID || 'integratewise-default';
  const now = new Date();

  try {
    // 1. Write the main session document with enhanced metadata
    const sessionDocId = `${tenant_id}::${session_id}`;
    await updateFirestoreDocument(projectId, `ai_sessions/${sessionDocId}`, {
      tenant_id,
      session_id,
      tool_source,
      user_label,
      summary,
      entity_type,
      entity_id,
      related_entities: related_entities || [],
      tool_names: tool_calls?.map(tc => tc.tool_name) || [],
      message_count: messages?.length || 0,
      started_at: now.toISOString(),
      ended_at: now.toISOString(),
      created_at: now.toISOString(),
      scoring_source_trust_level: 'model_inferred',
      version: 'v2' // Enhanced version
    });

    // 2. Write each memory with entity linking
    if (memories && memories.length > 0) {
      await Promise.all(memories.map((memory, index) => {
        const memoryDocId = `${tenant_id}::${session_id}::${index}`;
        return updateFirestoreDocument(projectId, `ai_session_memories/${memoryDocId}`, {
          tenant_id,
          session_id,
          ...memory,
          // Entity linking: inherit from memory or fall back to session entity
          entity_type: memory.entity_type || entity_type,
          entity_id: memory.entity_id || entity_id,
          confidence_score: memory.confidence_score ?? 0.7,
          created_at: now.toISOString(),
          scoring_source_trust_level: 'model_inferred'
        });
      }));
    }

    // 3. Write entity links to Spine (if database URL is available)
    // 3. Write entity links to Spine (using D1)
    if (c.env.DB && entity_type && entity_id) {
      try {
        // Link session to primary entity
        await c.env.DB.prepare(`
          INSERT INTO session_entity_links (session_id, tenant_id, entity_type, entity_id, link_type)
          VALUES (?, ?, ?, ?, 'primary')
          ON CONFLICT (session_id, entity_type, entity_id) DO UPDATE SET updated_at = datetime('now')
        `).bind(session_id, tenant_id, entity_type, entity_id).run();

        // Link related entities
        if (related_entities && related_entities.length > 0) {
          for (const re of related_entities) {
            await c.env.DB.prepare(`
              INSERT INTO session_entity_links (session_id, tenant_id, entity_type, entity_id, link_type)
              VALUES (?, ?, ?, ?, ?)
              ON CONFLICT (session_id, entity_type, entity_id) DO UPDATE SET updated_at = datetime('now')
            `).bind(session_id, tenant_id, re.entity_type, re.entity_id, re.relationship || 'related').run();
          }
        }
      } catch (dbError: any) {
        log.warn('Entity linking to Spine failed (non-blocking)', { error: dbError.message });
      }
    }

    log.info('Successfully captured enhanced AI session', {
      tenant_id,
      session_id,
      tool_source,
      entity_type,
      entity_id,
      memories_count: memories?.length || 0,
      tool_calls_count: tool_calls?.length || 0,
    });

    // 4. Trigger auto-embedding if enabled
    let embeddingResult = null;
    if (auto_embed && c.env.KNOWLEDGE_SERVICE_URL) {
      try {
        embeddingResult = await triggerSessionEmbedding(
          c.env.KNOWLEDGE_SERVICE_URL,
          tenant_id,
          session_id,
          summary,
          memories?.map(m => m.memory_value) || [],
          correlationId
        );
        log.info('Auto-embedding completed', {
          session_id,
          chunks_created: embeddingResult?.chunks_created,
        });
      } catch (embedError: any) {
        log.warn('Auto-embedding failed (non-blocking)', { error: embedError.message });
      }
    }

    return c.json({
      status: 'success',
      session_id,
      tenant_id,
      entity_linked: !!(entity_type && entity_id),
      related_entities_linked: related_entities?.length || 0,
      memories_stored: memories?.length || 0,
      embedding_status: embeddingResult ? 'completed' : (auto_embed ? 'skipped' : 'disabled'),
      chunks_created: embeddingResult?.chunks_created || 0,
      correlation_id: correlationId,
      timestamp: now.toISOString()
    });

  } catch (error: any) {
    log.error('Failed to capture enhanced AI session', { error: error.message });
    return c.json({
      status: 'error',
      error: 'internal_storage_error',
      correlation_id: correlationId
    }, 500);
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// Catch-all for unknown routes
app.all('*', (c) => {
  const log = c.get('log');
  log.warn('Unknown endpoint', { path: c.req.path });
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  const log = c.get('log');
  log.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
  });

  return c.json(
    {
      error: 'Internal server error',
      requestId: c.get('requestId'),
    },
    500,
  );
});

export default app;
