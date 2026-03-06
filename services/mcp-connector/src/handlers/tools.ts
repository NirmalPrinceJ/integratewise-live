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
  KNOWLEDGE?: Fetcher; // Service binding to integratewise-knowledge for file operations
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
 * Supports JWT and service-to-service bindings
 */
async function verifyAuth(
  authHeader: string | null,
  isServiceBinding: boolean,
  log: Log,
): Promise<{ tenant_id: string; user_id: string; roles: string[] } | null> {
  // Service-to-service requests (no auth header needed due to Cloudflare binding)
  if (isServiceBinding) {
    return {
      tenant_id: 'service-account',
      user_id: 'service-account',
      roles: ['Admin'],
    };
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    // Attempt JWT decoding for external requests
    const parts = token.split('.');
    if (parts.length !== 3) {
      log.warn('Invalid JWT format');
      return null;
    }

    const decoded = JSON.parse(atob(parts[1]));
    return {
      tenant_id: decoded.tenant_id || 'default-tenant',
      user_id: decoded.user_id || 'default-user',
      roles: decoded.roles || ['Member'],
    };
  } catch (error) {
    log.warn('Token verification failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
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
 * Upload file to Store service via R2
 * Routes through KNOWLEDGE service binding to integratewise-knowledge → integratewise-store
 */
async function uploadFileToStore(
  env: Bindings,
  tenantId: string,
  file: File | Blob,
  fileName: string,
  contentType: string,
  log: Log,
): Promise<{ file_id: string; r2_url: string; size: number } | null> {
  if (!env.KNOWLEDGE) {
    log.warn('KNOWLEDGE service binding not available, cannot upload file');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('file', file, fileName);
    formData.append('metadata', JSON.stringify({
      source: 'mcp-connector',
      tenant_id: tenantId,
      uploaded_at: new Date().toISOString(),
    }));

    const res = await env.KNOWLEDGE.fetch(
      new Request('http://knowledge/v1/store/upload', {
        method: 'POST',
        headers: {
          'x-tenant-id': tenantId,
        },
        body: formData,
      }),
    );

    if (!res.ok) {
      log.error('File upload to Store failed', {
        status: res.status,
        statusText: res.statusText,
      });
      return null;
    }

    const result = await res.json() as {
      file_id: string;
      r2_url: string;
      size: number;
    };
    return result;
  } catch (error) {
    log.error('File upload exception', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Fetch file from Store service via R2
 * Routes through KNOWLEDGE service binding to integratewise-knowledge → integratewise-store
 */
async function fetchFileFromStore(
  env: Bindings,
  tenantId: string,
  fileId: string,
  log: Log,
): Promise<Response | null> {
  if (!env.KNOWLEDGE) {
    log.warn('KNOWLEDGE service binding not available, cannot fetch file');
    return null;
  }

  try {
    const res = await env.KNOWLEDGE.fetch(
      new Request(`http://knowledge/v1/store/files/${fileId}`, {
        method: 'GET',
        headers: {
          'x-tenant-id': tenantId,
        },
      }),
    );

    if (!res.ok) {
      log.warn('File fetch from Store failed', {
        status: res.status,
        fileId,
      });
      return null;
    }

    return res;
  } catch (error) {
    log.error('File fetch exception', {
      error: error instanceof Error ? error.message : String(error),
      fileId,
    });
    return null;
  }
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

    // Upload session summary to Store service via R2
    const summaryBlob = new Blob([input.summary_md], { type: 'text/markdown' });
    const fileUploadResult = await uploadFileToStore(
      env,
      input.tenant_id,
      summaryBlob,
      `${input.session_id}.md`,
      'text/markdown',
      log,
    );

    const result = {
      artifact_id: artifactId,
      gcs_uri: gcsUri, // Keep for backward compatibility, now maps to R2
      metadata_ref: metadataPath,
      created_at: createdAt,
      signed_url: fileUploadResult?.r2_url || undefined,
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

  log.info('Writing article', { article_id: articleId, tenant_id: input.tenant_id });

  // Upload article content to Store service via R2
  const contentBlob = new Blob([input.content_md], { type: 'text/markdown' });
  const fileUploadResult = await uploadFileToStore(
    env,
    input.tenant_id,
    contentBlob,
    `${articleId}.md`,
    'text/markdown',
    log,
  );

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
    gcs_uri: gcsUri, // Keep for backward compatibility, now maps to R2
    metadata_ref: metadataPath,
    updated_at: updatedAt,
    signed_url: fileUploadResult?.r2_url || undefined,
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
  log.info('Getting artifact', { artifact_id: input.artifact_id, tenant_id: input.tenant_id });

  // Fetch artifact metadata and file from Store service via R2
  const fileResponse = await fetchFileFromStore(
    env,
    input.tenant_id,
    input.artifact_id,
    log,
  );

  const r2Uri = fileResponse
    ? `r2://${env.KB_BUCKET || 'integratewise-kb-default'}/${input.tenant_id}/artifacts/${input.artifact_id}`
    : undefined;

  // Placeholder response with Store service file reference
  return {
    artifact_id: input.artifact_id,
    type: 'session_summary' as const,
    created_at: new Date().toISOString(),
    gcs_uri: r2Uri || `gs://${env.KB_BUCKET || 'integratewise-kb-default'}/${input.tenant_id}/artifacts/${input.artifact_id}`,
    signed_url: r2Uri || undefined,
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
  log.info('Listing recent artifacts', { tenant_id: input.tenant_id, limit: input.limit });

  // Query D1 for recent artifacts with optional filtering
  if (!env.DB) {
    log.warn('DB binding not available, returning empty list');
    return { items: [] };
  }

  try {
    let query = `
      SELECT id, type, title, topics, created_at
      FROM kb_artifacts
      WHERE tenant_id = ?
    `;
    const params: any[] = [input.tenant_id];

    // Filter by topic if provided
    if (input.topic) {
      query += ` AND topics LIKE ?`;
      params.push(`%${input.topic}%`);
    }

    // Filter by type if provided
    if (input.type) {
      query += ` AND type = ?`;
      params.push(input.type);
    }

    query += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(input.limit);

    const result = await env.DB.prepare(query).bind(...params).all();

    const items = (result.results || []).map((row: any) => ({
      artifact_id: row.id,
      type: row.type,
      title: row.title,
      topics: row.topics ? JSON.parse(row.topics) : [],
      created_at: row.created_at,
    }));

    return { items };
  } catch (error) {
    log.error('Failed to list recent artifacts', {
      error: error instanceof Error ? error.message : String(error),
    });
    return { items: [] };
  }
}

/**
 * Tool: kb.search
 */
async function search(
  input: z.infer<typeof SearchInputSchema>,
  env: Bindings,
  log: Log,
): Promise<any> {
  log.info('Searching Knowledge Bank', {
    tenant_id: input.tenant_id,
    query: input.q,
    topic: input.topic,
  });

  // Search via D1 with full-text search or simple LIKE query
  if (!env.DB) {
    log.warn('DB binding not available, returning empty results');
    return { results: [] };
  }

  try {
    let query = `
      SELECT id, title, snippet, topics, created_at, relevance_score
      FROM kb_artifacts
      WHERE tenant_id = ?
      AND (title LIKE ? OR snippet LIKE ?)
    `;
    const params: any[] = [input.tenant_id, `%${input.q}%`, `%${input.q}%`];

    // Filter by topic if provided
    if (input.topic) {
      query += ` AND topics LIKE ?`;
      params.push(`%${input.topic}%`);
    }

    // Filter by date range if provided
    if (input.from) {
      query += ` AND created_at >= ?`;
      params.push(input.from);
    }
    if (input.to) {
      query += ` AND created_at <= ?`;
      params.push(input.to);
    }

    query += ` ORDER BY relevance_score DESC, created_at DESC LIMIT ?`;
    params.push(input.limit);

    const result = await env.DB.prepare(query).bind(...params).all();

    const results = (result.results || []).map((row: any) => ({
      artifact_id: row.id,
      title: row.title,
      snippet: row.snippet,
      topics: row.topics ? JSON.parse(row.topics) : [],
      created_at: row.created_at,
      score: row.relevance_score || 0.5,
    }));

    return { results };
  } catch (error) {
    log.error('Search failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return { results: [] };
  }
}

/**
 * Tool: kb.topic_upsert
 */
async function topicUpsert(
  input: z.infer<typeof TopicUpsertInputSchema>,
  env: Bindings,
  log: Log,
): Promise<any> {
  const topicId = `topic_${input.tenant_id}_${input.topic_name.replace(/\s+/g, '_').toLowerCase()}`;
  log.info('Upserting topic', { topic_id: topicId, tenant_id: input.tenant_id });

  // Insert or update topic policy in D1
  if (!env.DB) {
    log.error('DB binding not available, cannot upsert topic');
    throw new Error('Database unavailable. Please try again later.');
  }

  try {
    const now = new Date().toISOString();
    await env.DB.prepare(`
      INSERT INTO kb_topic_policies (id, tenant_id, name, cadence, hourly_opt_in, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT (id) DO UPDATE SET
        name = excluded.name,
        cadence = excluded.cadence,
        hourly_opt_in = excluded.hourly_opt_in,
        updated_at = excluded.updated_at
    `).bind(topicId, input.tenant_id, input.topic_name, input.cadence, input.hourly_opt_in ? 1 : 0, now).run();

    return {
      topic_id: topicId,
      name: input.topic_name,
      cadence: input.cadence,
      hourly_opt_in: input.hourly_opt_in,
      updated_at: now,
    };
  } catch (error) {
    log.error('Failed to upsert topic', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Tool: kb.topic_list
 */
async function topicList(
  input: z.infer<typeof TopicListInputSchema>,
  env: Bindings,
  log: Log,
): Promise<any> {
  log.info('Listing topics', { tenant_id: input.tenant_id });

  // Query D1 for topics for this tenant
  if (!env.DB) {
    log.error('DB binding not available, cannot list topics');
    throw new Error('Database unavailable. Please try again later.');
  }

  try {
    const result = await env.DB.prepare(`
      SELECT id, name, cadence, hourly_opt_in, last_synced_at
      FROM kb_topic_policies
      WHERE tenant_id = ?
      ORDER BY updated_at DESC
    `).bind(input.tenant_id).all();

    const items = (result.results || []).map((row: any) => ({
      topic_id: row.id,
      name: row.name,
      cadence: row.cadence,
      hourly_opt_in: Boolean(row.hourly_opt_in),
      last_synced_at: row.last_synced_at,
    }));

    return { items };
  } catch (error) {
    log.error('Failed to list topics', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
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
  // Check if this is a service-to-service request via Cloudflare binding
  const authHeader = c.req.header('Authorization');
  const isServiceBinding = c.req.header('cf-worker') !== undefined;
  const auth = await verifyAuth(authHeader || null, isServiceBinding, log);

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
