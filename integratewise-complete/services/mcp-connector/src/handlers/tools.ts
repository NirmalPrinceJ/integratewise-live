/**
 * IntegrateWise Custom Connector - MCP Tool Server
 * 
 * Implements MCP-style tool discovery and invocation interface for Knowledge Bank operations.
 * Provides 7 tools: write_session_summary, write_article, get_artifact, list_recent, search, topic_upsert, topic_list
 */

import type { Context } from 'hono';
import { z } from 'zod';
import { getTraceId } from '../lib/logging';

type Log = {
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, data?: Record<string, unknown>) => void;
};

type Bindings = {
  KB_BUCKET?: string;
  GCS_PROJECT_ID?: string;
  FIRESTORE_PROJECT_ID?: string;
  VERTEX_AI_SEARCH_ENGINE_ID?: string;
  VERTEX_AI_LOCATION?: string;
  ENVIRONMENT: string;
  MCP_IDEMPOTENCY?: KVNamespace;
  DB?: D1Database;
};

// ============================================================================
// TOOL DEFINITIONS (JSON Schema)
// ============================================================================

const TOOL_DEFINITIONS = [
  {
    name: 'kb.write_session_summary',
    description: 'Write a session-end summary artifact into the Knowledge Bank (GCS content + Firestore metadata) and return the artifact reference. Idempotent by session_id.',
    permissions: ['Admin', 'Member'],
    input_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['tenant_id', 'user_id', 'provider', 'session_id', 'started_at', 'ended_at', 'summary_md'],
      properties: {
        tenant_id: { type: 'string', minLength: 1 },
        user_id: { type: 'string', minLength: 1 },
        provider: {
          type: 'string',
          enum: ['chatgpt', 'claude', 'grok', 'gemini', 'other'],
        },
        session_id: { type: 'string', minLength: 1 },
        started_at: { type: 'string', format: 'date-time' },
        ended_at: { type: 'string', format: 'date-time' },
        summary_md: { type: 'string', minLength: 1 },
        topics: {
          type: 'array',
          items: { type: 'string', minLength: 1 },
          default: [],
        },
        project: { type: 'string' },
      },
    },
    output_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['artifact_id', 'gcs_uri', 'created_at'],
      properties: {
        artifact_id: { type: 'string' },
        gcs_uri: { type: 'string' },
        metadata_ref: { type: 'string', description: 'Firestore document path' },
        created_at: { type: 'string', format: 'date-time' },
        signed_url: { type: 'string', description: 'Optional signed URL for direct retrieval' },
      },
    },
  },
  {
    name: 'kb.write_article',
    description: 'Create or update a Knowledge Bank article (promoted artifact) and return references.',
    permissions: ['Admin', 'Member'],
    input_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['tenant_id', 'title', 'content_md'],
      properties: {
        tenant_id: { type: 'string', minLength: 1 },
        article_id: { type: 'string', description: 'If omitted, server generates.' },
        title: { type: 'string', minLength: 1, maxLength: 200 },
        content_md: { type: 'string', minLength: 1 },
        topics: {
          type: 'array',
          items: { type: 'string', minLength: 1 },
          default: [],
        },
        visibility: {
          type: 'string',
          enum: ['private', 'team', 'org'],
          default: 'team',
        },
        tags: {
          type: 'array',
          items: { type: 'string', minLength: 1 },
          default: [],
        },
      },
    },
    output_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['article_id', 'artifact_id', 'gcs_uri', 'updated_at'],
      properties: {
        article_id: { type: 'string' },
        artifact_id: { type: 'string' },
        gcs_uri: { type: 'string' },
        metadata_ref: { type: 'string' },
        updated_at: { type: 'string', format: 'date-time' },
        signed_url: { type: 'string' },
      },
    },
  },
  {
    name: 'kb.get_artifact',
    description: 'Fetch artifact metadata and access pointers (GCS URI and optional signed URL).',
    permissions: ['Admin', 'Member', 'Viewer'],
    input_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['tenant_id', 'artifact_id'],
      properties: {
        tenant_id: { type: 'string', minLength: 1 },
        artifact_id: { type: 'string', minLength: 1 },
      },
    },
    output_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['artifact_id', 'type', 'created_at', 'gcs_uri'],
      properties: {
        artifact_id: { type: 'string' },
        type: { type: 'string', enum: ['session_summary', 'kb_article', 'thread_rollup', 'project_rollup'] },
        title: { type: 'string' },
        topics: { type: 'array', items: { type: 'string' } },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        gcs_uri: { type: 'string' },
        signed_url: { type: 'string' },
        source: { type: 'string', description: 'ai_relay|manual|workflow' },
      },
    },
  },
  {
    name: 'kb.list_recent',
    description: 'List recent Knowledge Bank artifacts, optionally filtered by topic or type.',
    permissions: ['Admin', 'Member', 'Viewer'],
    input_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['tenant_id'],
      properties: {
        tenant_id: { type: 'string', minLength: 1 },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        topic: { type: 'string' },
        type: {
          type: 'string',
          enum: ['session_summary', 'kb_article', 'thread_rollup', 'project_rollup'],
        },
      },
    },
    output_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['artifact_id', 'type', 'created_at'],
            properties: {
              artifact_id: { type: 'string' },
              type: { type: 'string' },
              title: { type: 'string' },
              topics: { type: 'array', items: { type: 'string' } },
              created_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  },
  {
    name: 'kb.search',
    description: 'Search Knowledge Bank using Vertex AI Search with tenant/topic/date filters. Enforces tenant isolation server-side.',
    permissions: ['Admin', 'Member', 'Viewer'],
    input_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['tenant_id', 'q'],
      properties: {
        tenant_id: { type: 'string', minLength: 1 },
        q: { type: 'string', minLength: 1 },
        topic: { type: 'string' },
        from: { type: 'string', format: 'date-time' },
        to: { type: 'string', format: 'date-time' },
        limit: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
      },
    },
    output_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['results'],
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['artifact_id', 'title', 'snippet', 'created_at'],
            properties: {
              artifact_id: { type: 'string' },
              title: { type: 'string' },
              snippet: { type: 'string' },
              topics: { type: 'array', items: { type: 'string' } },
              created_at: { type: 'string', format: 'date-time' },
              score: { type: 'number' },
            },
          },
        },
      },
    },
  },
  {
    name: 'kb.topic_upsert',
    description: 'Create or update a topic sync policy. cadence supports weekly/biweekly; hourly_opt_in is a flag only.',
    permissions: ['Admin'],
    input_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['tenant_id', 'topic_name', 'cadence'],
      properties: {
        tenant_id: { type: 'string', minLength: 1 },
        topic_name: { type: 'string', minLength: 1, maxLength: 120 },
        cadence: { type: 'string', enum: ['weekly', 'biweekly'] },
        hourly_opt_in: { type: 'boolean', default: false },
      },
    },
    output_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['topic_id', 'name', 'cadence', 'updated_at'],
      properties: {
        topic_id: { type: 'string' },
        name: { type: 'string' },
        cadence: { type: 'string' },
        hourly_opt_in: { type: 'boolean' },
        last_synced_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  },
  {
    name: 'kb.topic_list',
    description: 'List topics and sync policies for a tenant.',
    permissions: ['Admin', 'Member', 'Viewer'],
    input_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['tenant_id'],
      properties: {
        tenant_id: { type: 'string', minLength: 1 },
      },
    },
    output_schema: {
      type: 'object',
      additionalProperties: false,
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['topic_id', 'name', 'cadence'],
            properties: {
              topic_id: { type: 'string' },
              name: { type: 'string' },
              cadence: { type: 'string' },
              hourly_opt_in: { type: 'boolean' },
              last_synced_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  },
] as const;

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

const ProviderSchema = z.enum(['chatgpt', 'claude', 'grok', 'gemini', 'other']);
const CadenceSchema = z.enum(['weekly', 'biweekly']);
const VisibilitySchema = z.enum(['private', 'team', 'org']);
const ArtifactTypeSchema = z.enum(['session_summary', 'kb_article', 'thread_rollup', 'project_rollup']);

const WriteSessionSummaryInputSchema = z.object({
  tenant_id: z.string().min(1),
  user_id: z.string().min(1),
  provider: ProviderSchema,
  session_id: z.string().min(1),
  started_at: z.string().datetime(),
  ended_at: z.string().datetime(),
  summary_md: z.string().min(1),
  topics: z.array(z.string().min(1)).default([]),
  project: z.string().optional(),
});

const WriteArticleInputSchema = z.object({
  tenant_id: z.string().min(1),
  article_id: z.string().optional(),
  title: z.string().min(1).max(200),
  content_md: z.string().min(1),
  topics: z.array(z.string().min(1)).default([]),
  visibility: VisibilitySchema.default('team'),
  tags: z.array(z.string().min(1)).default([]),
});

const GetArtifactInputSchema = z.object({
  tenant_id: z.string().min(1),
  artifact_id: z.string().min(1),
});

const ListRecentInputSchema = z.object({
  tenant_id: z.string().min(1),
  limit: z.number().int().min(1).max(100).default(20),
  topic: z.string().optional(),
  type: ArtifactTypeSchema.optional(),
});

const SearchInputSchema = z.object({
  tenant_id: z.string().min(1),
  q: z.string().min(1),
  topic: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(50).default(10),
});

const TopicUpsertInputSchema = z.object({
  tenant_id: z.string().min(1),
  topic_name: z.string().min(1).max(120),
  cadence: CadenceSchema,
  hourly_opt_in: z.boolean().default(false),
});

const TopicListInputSchema = z.object({
  tenant_id: z.string().min(1),
});

// ============================================================================
// REQUEST/RESPONSE ENVELOPES
// ============================================================================

const InvokeRequestSchema = z.object({
  request_id: z.string(),
  actor: z.object({
    tenant_id: z.string(),
    user_id: z.string(),
    roles: z.array(z.enum(['Admin', 'Member', 'Viewer'])),
  }),
  tool: z.object({
    name: z.string(),
    arguments: z.record(z.unknown()),
  }),
});

type InvokeRequest = z.infer<typeof InvokeRequestSchema>;

type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL';

// ============================================================================
// AUTHENTICATION & AUTHORIZATION
// ============================================================================

/**
 * Verify Bearer token and extract tenant/user info
 * In production, this would verify JWT or API key
 */
async function verifyAuth(
  authHeader: string | null,
  log: Log,
): Promise<{ tenant_id: string; user_id: string; roles: string[] } | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);

  // TODO: Implement actual JWT/API key verification
  // For now, return a placeholder structure
  // In production, decode JWT or lookup API key in KV/database
  try {
    // Placeholder: parse token as JSON for development
    // In production, use proper JWT verification
    const decoded = JSON.parse(atob(token.split('.')[1] || '{}'));
    return {
      tenant_id: decoded.tenant_id || 'default-tenant',
      user_id: decoded.user_id || 'default-user',
      roles: decoded.roles || ['Member'],
    };
  } catch {
    // Fallback: treat as API key
    // In production, lookup API key in KV store
    log.warn('Token verification not implemented, using default');
    return {
      tenant_id: 'default-tenant',
      user_id: 'default-user',
      roles: ['Member'],
    };
  }
}

/**
 * Check if user has required permission for tool
 */
function checkPermission(toolName: string, userRoles: string[]): boolean {
  const tool = TOOL_DEFINITIONS.find(t => t.name === toolName);
  if (!tool) {
    return false;
  }

  return tool.permissions.some(perm => userRoles.includes(perm));
}

/**
 * Validate tenant isolation - ensure tenant_id in request matches authenticated tenant
 */
function validateTenantIsolation(
  requestTenantId: string,
  authenticatedTenantId: string,
): boolean {
  return requestTenantId === authenticatedTenantId;
}

// ============================================================================
// TOOL IMPLEMENTATIONS (Placeholder - integrate with GCS/Firestore/Vertex AI)
// ============================================================================

/**
 * Generate artifact ID
 */
function generateArtifactId(): string {
  return `art_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Generate GCS URI for session summary
 */
function getSessionSummaryGcsUri(tenantId: string, sessionId: string, bucket: string): string {
  return `gs://${bucket}/${tenantId}/sessions/${sessionId}/summary.md`;
}

/**
 * Generate GCS URI for article
 */
function getArticleGcsUri(tenantId: string, articleId: string, bucket: string): string {
  return `gs://${bucket}/${tenantId}/kb/${articleId}/content.md`;
}

/**
 * Generate Firestore document path
 */
function getSessionMetadataPath(tenantId: string, sessionId: string): string {
  return `tenants/${tenantId}/sessions/${sessionId}`;
}

function getArticleMetadataPath(tenantId: string, articleId: string): string {
  return `tenants/${tenantId}/kb/${articleId}`;
}

/**
 * Tool: kb.write_session_summary
 */
async function writeSessionSummary(
  input: z.infer<typeof WriteSessionSummaryInputSchema>,
  env: Bindings,
  log: Log,
  idempotencyKey?: string,
): Promise<any> {
  const bucket = env.KB_BUCKET || 'integratewise-kb-default';
  const artifactId = generateArtifactId();
  const gcsUri = getSessionSummaryGcsUri(input.tenant_id, input.session_id, bucket);
  const metadataPath = getSessionMetadataPath(input.tenant_id, input.session_id);
  const createdAt = new Date().toISOString();

  // Check idempotency by session_id
  if (env.MCP_IDEMPOTENCY) {
    const idempotencyKey = `kb_session:${input.tenant_id}:${input.session_id}`;
    const existing = await env.MCP_IDEMPOTENCY.get(idempotencyKey);

    if (existing) {
      const existingData = JSON.parse(existing);
      log.info('Idempotent write_session_summary call', { session_id: input.session_id });
      return {
        artifact_id: existingData.artifact_id,
        gcs_uri: existingData.gcs_uri,
        metadata_ref: existingData.metadata_ref,
        created_at: existingData.created_at,
        signed_url: existingData.signed_url,
      };
    }

    // TODO: Upload to GCS and write to Firestore
    // For now, return placeholder
    const result = {
      artifact_id: artifactId,
      gcs_uri: gcsUri,
      metadata_ref: metadataPath,
      created_at: createdAt,
      signed_url: undefined as string | undefined,
    };

    // Store for idempotency
    await env.MCP_IDEMPOTENCY.put(
      idempotencyKey,
      JSON.stringify(result),
      { expirationTtl: 60 * 60 * 24 * 7 }, // 7 days
    );

    // Spine Integration: Log event to D1
    if (env.DB) {
      try {
        await env.DB.prepare(`
           INSERT INTO spine_events (id, tenant_id, event_type, source, payload, created_at)
           VALUES (?, ?, 'session.summary.created', 'mcp-connector', ?, ?)
         `).bind(
          artifactId,
          input.tenant_id,
          JSON.stringify({ session_id: input.session_id, summary: input.summary_md, gcs_uri: gcsUri }),
          createdAt
        ).run();
      } catch (e: any) {
        log.warn('Failed to write to Spine DB', { error: e.message });
      }
    }

    return result;
  }

  // Fallback without idempotency
  return {
    artifact_id: artifactId,
    gcs_uri: gcsUri,
    metadata_ref: metadataPath,
    created_at: createdAt,
  };
}

/**
 * Tool: kb.write_article
 */
async function writeArticle(
  input: z.infer<typeof WriteArticleInputSchema>,
  env: Bindings,
  log: Log,
): Promise<any> {
  const bucket = env.KB_BUCKET || 'integratewise-kb-default';
  const articleId = input.article_id || `article_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  const artifactId = generateArtifactId();
  const gcsUri = getArticleGcsUri(input.tenant_id, articleId, bucket);
  const metadataPath = getArticleMetadataPath(input.tenant_id, articleId);
  const updatedAt = new Date().toISOString();

  // TODO: Upload to GCS and write/update Firestore
  log.info('Writing article', { article_id: articleId, tenant_id: input.tenant_id });

  // Spine Integration: Log event to D1
  if (env.DB) {
    try {
      await env.DB.prepare(`
          INSERT INTO spine_events (id, tenant_id, event_type, source, payload, created_at)
          VALUES (?, ?, 'kb.article.created', 'mcp-connector', ?, ?)
        `).bind(
        artifactId,
        input.tenant_id,
        JSON.stringify({ article_id: articleId, title: input.title, tags: input.tags }),
        updatedAt
      ).run();
    } catch (e: any) {
      log.warn('Failed to write to Spine DB', { error: e.message });
    }
  }

  return {
    article_id: articleId,
    artifact_id: artifactId,
    gcs_uri: gcsUri,
    metadata_ref: metadataPath,
    updated_at: updatedAt,
  };
}

/**
 * Tool: kb.get_artifact
 */
async function getArtifact(
  input: z.infer<typeof GetArtifactInputSchema>,
  env: Bindings,
  log: Log,
): Promise<any> {
  // TODO: Fetch from Firestore and generate signed URL from GCS
  log.info('Getting artifact', { artifact_id: input.artifact_id, tenant_id: input.tenant_id });

  // Placeholder response
  return {
    artifact_id: input.artifact_id,
    type: 'session_summary' as const,
    created_at: new Date().toISOString(),
    gcs_uri: `gs://${env.KB_BUCKET || 'integratewise-kb-default'}/${input.tenant_id}/artifacts/${input.artifact_id}`,
  };
}

/**
 * Tool: kb.list_recent
 */
async function listRecent(
  input: z.infer<typeof ListRecentInputSchema>,
  env: Bindings,
  log: Log,
): Promise<any> {
  // TODO: Query Firestore with filters
  log.info('Listing recent artifacts', { tenant_id: input.tenant_id, limit: input.limit });

  // Placeholder response
  return {
    items: [],
  };
}

/**
 * Tool: kb.search
 */
async function search(
  input: z.infer<typeof SearchInputSchema>,
  env: Bindings,
  log: Log,
): Promise<any> {
  // TODO: Call Vertex AI Search API with tenant filter
  log.info('Searching Knowledge Bank', {
    tenant_id: input.tenant_id,
    query: input.q,
    topic: input.topic,
  });

  // Placeholder response
  return {
    results: [],
  };
}

/**
 * Tool: kb.topic_upsert
 */
async function topicUpsert(
  input: z.infer<typeof TopicUpsertInputSchema>,
  env: Bindings,
  log: Log,
): Promise<any> {
  // TODO: Write/update topic policy in Firestore
  const topicId = `topic_${input.tenant_id}_${input.topic_name.replace(/\s+/g, '_').toLowerCase()}`;
  log.info('Upserting topic', { topic_id: topicId, tenant_id: input.tenant_id });

  return {
    topic_id: topicId,
    name: input.topic_name,
    cadence: input.cadence,
    hourly_opt_in: input.hourly_opt_in,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Tool: kb.topic_list
 */
async function topicList(
  input: z.infer<typeof TopicListInputSchema>,
  env: Bindings,
  log: Log,
): Promise<any> {
  // TODO: Query Firestore for topics
  log.info('Listing topics', { tenant_id: input.tenant_id });

  return {
    items: [],
  };
}

// ============================================================================
// HANDLERS
// ============================================================================

/**
 * GET /tools - Tool discovery endpoint
 */
export async function toolsHandler(c: Context) {
  return c.json({
    name: 'integratewise-custom-connector',
    version: '1.0.0',
    protocol: 'mcp-like',
    tools: TOOL_DEFINITIONS,
  });
}

/**
 * POST /invoke - Tool invocation endpoint
 */
export async function invokeHandler(c: Context) {
  const log = c.get('log') as Log;
  const traceId = getTraceId();
  const requestId = c.get('requestId');

  // Parse request body
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      {
        request_id: requestId,
        status: 'error',
        tool: { name: 'unknown' },
        error: {
          code: 'VALIDATION_ERROR' as ErrorCode,
          message: 'Invalid JSON payload',
        },
        meta: {
          server_time: new Date().toISOString(),
          trace_id: traceId,
        },
      },
      400,
    );
  }

  // Validate request envelope
  const parsedRequest = InvokeRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return c.json(
      {
        request_id: requestId,
        status: 'error',
        tool: { name: 'unknown' },
        error: {
          code: 'VALIDATION_ERROR' as ErrorCode,
          message: 'Invalid request envelope',
          details: parsedRequest.error.flatten(),
        },
        meta: {
          server_time: new Date().toISOString(),
          trace_id: traceId,
        },
      },
      400,
    );
  }

  const request = parsedRequest.data;

  // Verify authentication
  const authHeader = c.req.header('Authorization');
  const auth = await verifyAuth(authHeader || null, log);

  if (!auth) {
    return c.json(
      {
        request_id: request.request_id,
        status: 'error',
        tool: { name: request.tool.name },
        error: {
          code: 'UNAUTHORIZED' as ErrorCode,
          message: 'Missing or invalid Authorization header',
        },
        meta: {
          server_time: new Date().toISOString(),
          trace_id: traceId,
        },
      },
      401,
    );
  }

  // Validate tenant isolation
  if (request.tool.arguments.tenant_id && !validateTenantIsolation(request.tool.arguments.tenant_id as string, auth.tenant_id)) {
    return c.json(
      {
        request_id: request.request_id,
        status: 'error',
        tool: { name: request.tool.name },
        error: {
          code: 'FORBIDDEN' as ErrorCode,
          message: 'Tenant ID mismatch',
        },
        meta: {
          server_time: new Date().toISOString(),
          trace_id: traceId,
        },
      },
      403,
    );
  }

  // Check permissions
  if (!checkPermission(request.tool.name, auth.roles)) {
    return c.json(
      {
        request_id: request.request_id,
        status: 'error',
        tool: { name: request.tool.name },
        error: {
          code: 'FORBIDDEN' as ErrorCode,
          message: 'Insufficient permissions',
        },
        meta: {
          server_time: new Date().toISOString(),
          trace_id: traceId,
        },
      },
      403,
    );
  }

  // Get idempotency key if provided
  const idempotencyKey = c.req.header('Idempotency-Key');

  // Route to appropriate tool handler
  try {
    let result: unknown;

    switch (request.tool.name) {
      case 'kb.write_session_summary': {
        const input = WriteSessionSummaryInputSchema.parse(request.tool.arguments);
        result = await writeSessionSummary(input, c.env as Bindings, log, idempotencyKey || undefined);
        break;
      }
      case 'kb.write_article': {
        const input = WriteArticleInputSchema.parse(request.tool.arguments);
        result = await writeArticle(input, c.env as Bindings, log);
        break;
      }
      case 'kb.get_artifact': {
        const input = GetArtifactInputSchema.parse(request.tool.arguments);
        result = await getArtifact(input, c.env as Bindings, log);
        break;
      }
      case 'kb.list_recent': {
        const input = ListRecentInputSchema.parse(request.tool.arguments);
        result = await listRecent(input, c.env as Bindings, log);
        break;
      }
      case 'kb.search': {
        const input = SearchInputSchema.parse(request.tool.arguments);
        result = await search(input, c.env as Bindings, log);
        break;
      }
      case 'kb.topic_upsert': {
        const input = TopicUpsertInputSchema.parse(request.tool.arguments);
        result = await topicUpsert(input, c.env as Bindings, log);
        break;
      }
      case 'kb.topic_list': {
        const input = TopicListInputSchema.parse(request.tool.arguments);
        result = await topicList(input, c.env as Bindings, log);
        break;
      }
      default:
        return c.json(
          {
            request_id: request.request_id,
            status: 'error',
            tool: { name: request.tool.name },
            error: {
              code: 'NOT_FOUND' as ErrorCode,
              message: `Unknown tool: ${request.tool.name}`,
            },
            meta: {
              server_time: new Date().toISOString(),
              trace_id: traceId,
            },
          },
          404,
        );
    }

    // Success response
    return c.json({
      request_id: request.request_id,
      status: 'ok',
      tool: { name: request.tool.name },
      result,
      meta: {
        server_time: new Date().toISOString(),
        trace_id: traceId,
      },
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return c.json(
        {
          request_id: request.request_id,
          status: 'error',
          tool: { name: request.tool.name },
          error: {
            code: 'VALIDATION_ERROR' as ErrorCode,
            message: 'Invalid tool arguments',
            details: error.flatten(),
          },
          meta: {
            server_time: new Date().toISOString(),
            trace_id: traceId,
          },
        },
        400,
      );
    }

    // Handle other errors
    log.error('Tool invocation error', {
      tool: request.tool.name,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return c.json(
      {
        request_id: request.request_id,
        status: 'error',
        tool: { name: request.tool.name },
        error: {
          code: 'INTERNAL' as ErrorCode,
          message: 'Internal server error',
        },
        meta: {
          server_time: new Date().toISOString(),
          trace_id: traceId,
        },
      },
      500,
    );
  }
}
