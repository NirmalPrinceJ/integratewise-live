/**
 * Store Service (D1 + R2 Implementation)
 * 
 * Handles file uploads, R2 storage, processing pipeline, and version management.
 * Part of the "Ingestion" Layer of IntegrateWise OS.
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';

type Bindings = {
    DB: D1Database;
    // v3.6: D1 is edge cache only. Supabase PostgreSQL is SINGLE SOURCE OF TRUTH
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;
    R2_BUCKET: R2Bucket;
    KNOWLEDGE: Fetcher;        // Service Binding → integratewise-knowledge
    KNOWLEDGE_SERVICE_URL?: string; // Fallback (deprecated)
    ENVIRONMENT: string;
    SERVICE_SECRET?: string;
};

type Variables = {
    requestId: string;
    tenantId: string;
};

// ============================================================================
// v3.6: Supabase REST API Helpers
// ============================================================================

async function supabaseQuery(
  url: string,
  key: string,
  table: string,
  query: string
): Promise<any[]> {
  try {
    const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function supabaseMutate(
  url: string,
  key: string,
  table: string,
  method: string,
  body?: any,
  query?: string
): Promise<any> {
  try {
    const endpoint = query
      ? `${url}/rest/v1/${table}?${query}`
      : `${url}/rest/v1/${table}`
    const res = await fetch(endpoint, {
      method,
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

app.use('*', cors());
app.use('*', secureHeaders());

// Middleware for Request ID and Tenant ID
app.use('*', async (c, next) => {
    const requestId = c.req.header('x-request-id') || crypto.randomUUID();
    const correlationId = c.req.header('x-correlation-id') || requestId;
    const tenantId = c.req.header('x-tenant-id');
    c.set('requestId', requestId);
    c.res.headers.set('x-correlation-id', correlationId);
    if (tenantId) c.set('tenantId', tenantId);
    await next();
});

// ============================================================================
// Schemas
// ============================================================================

const UploadMetadataSchema = z.object({
    entity_type: z.string().optional(),
    entity_id: z.string().optional(),
    doc_type: z.enum(['contract', 'runbook', 'icp', 'meeting_notes', 'qbr', 'technical_manual', 'other']).default('other'),
    tags: z.array(z.string()).optional(),
});

const CreateFileSchema = z.object({
    name: z.string().min(1),
    content_type: z.string().optional(),
    size: z.number().int().positive().optional(),
    metadata: UploadMetadataSchema.optional(),
});

// ============================================================================
// Endpoints
// ============================================================================

app.get('/', (c) => c.json({ service: 'Store Service', status: 'operational', database: 'D1', storage: 'R2' }));

/**
 * Initiate file upload
 */
app.post('/store/files', async (c) => {
    const tenantId = c.get('tenantId');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const body = await c.req.json();
    const parsed = CreateFileSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: 'Invalid parameters', details: parsed.error.format() }, 400);

    const { name, content_type, size, metadata } = parsed.data;
    const fileId = crypto.randomUUID();

    try {
        // v3.6: Insert to Supabase (SINGLE SOURCE OF TRUTH)
        await supabaseMutate(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_SERVICE_KEY,
            'files',
            'POST',
            {
                id: fileId,
                tenant_id: tenantId,
                name,
                content_type: content_type || 'application/octet-stream',
                size_bytes: size || 0,
                entity_type: metadata?.entity_type || null,
                entity_id: metadata?.entity_id || null,
                metadata: metadata || {},
                status: 'pending_upload',
            }
        );

        return c.json({
            success: true,
            data: {
                file_id: fileId,
                upload_url: `/store/files/${fileId}/upload`,
            }
        });
    } catch (err: any) {
        return c.json({ error: 'Database error', message: err.message }, 500);
    }
});

/**
 * Upload file content to R2
 */
app.put('/store/files/:id/upload', async (c) => {
    const tenantId = c.get('tenantId');
    const fileId = c.req.param('id');
    const content = await c.req.arrayBuffer();

    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    try {
        // 1. Check if file record exists (v3.6: Query Supabase - SINGLE SOURCE OF TRUTH)
        const files = await supabaseQuery(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_SERVICE_KEY,
            'files',
            `id=eq.${fileId}&tenant_id=eq.${tenantId}&limit=1`
        );

        const file = files?.[0] as { name: string, content_type: string } | undefined;
        if (!file) return c.json({ error: 'File not found' }, 404);

        // 2. Upload to R2
        const r2Key = `${tenantId}/${fileId}/${file.name}`;
        await c.env.R2_BUCKET.put(r2Key, content, {
            httpMetadata: { contentType: file.content_type }
        });

        // 3. Update status to ready (v3.6: Update Supabase - SINGLE SOURCE OF TRUTH)
        await supabaseMutate(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_SERVICE_KEY,
            'files',
            'PATCH',
            {
                status: 'ready',
                updated_at: new Date().toISOString(),
            },
            `id=eq.${fileId}`
        );

        // 4. Trigger Knowledge Ingestion (Async)
        c.executionCtx.waitUntil(triggerKnowledgeIngest(c.env, tenantId, fileId, file.name, content));

        return c.json({ success: true, file_id: fileId, status: 'ready' });
    } catch (err: any) {
        return c.json({ error: 'Upload failed', message: err.message }, 500);
    }
});

/**
 * Get file details
 */
app.get('/store/files/:id', async (c) => {
    const tenantId = c.get('tenantId');
    const fileId = c.req.param('id');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    // v3.6: Query Supabase (SINGLE SOURCE OF TRUTH)
    const files = await supabaseQuery(
        c.env.SUPABASE_URL,
        c.env.SUPABASE_SERVICE_KEY,
        'files',
        `id=eq.${fileId}&tenant_id=eq.${tenantId}&limit=1`
    );

    const file = files?.[0];
    if (!file) return c.json({ error: 'File not found' }, 404);
    return c.json({ success: true, data: file });
});

/**
 * List files
 */
app.get('/store/files', async (c) => {
    const tenantId = c.get('tenantId');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    // v3.6: Query Supabase (SINGLE SOURCE OF TRUTH)
    const files = await supabaseQuery(
        c.env.SUPABASE_URL,
        c.env.SUPABASE_SERVICE_KEY,
        'files',
        `tenant_id=eq.${tenantId}&order=created_at.desc`
    );

    return c.json({ success: true, data: files });
});

/**
 * Gateway-facing upload route: POST /v1/store/upload
 * Handles multipart file upload in a single request.
 */
app.post('/v1/store/upload', async (c) => {
    const tenantId = c.get('tenantId');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    try {
        const formData = await c.req.formData();
        const file = formData.get('file') as File | null;
        const metadataStr = formData.get('metadata') as string | null;

        if (!file) return c.json({ error: 'No file provided' }, 400);

        const metadata = metadataStr ? JSON.parse(metadataStr) : {};
        const fileId = crypto.randomUUID();

        // 1. Record in Supabase (v3.6: SINGLE SOURCE OF TRUTH)
        await supabaseMutate(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_SERVICE_KEY,
            'files',
            'POST',
            {
                id: fileId,
                tenant_id: tenantId,
                name: file.name,
                content_type: file.type || 'application/octet-stream',
                size_bytes: file.size,
                entity_type: metadata.entity_type || null,
                entity_id: metadata.entity_id || null,
                metadata,
                status: 'ready',
            }
        );

        // 2. Upload to R2
        const r2Key = `${tenantId}/${fileId}/${file.name}`;
        const content = await file.arrayBuffer();
        await c.env.R2_BUCKET.put(r2Key, content, {
            httpMetadata: { contentType: file.type || 'application/octet-stream' }
        });

        // 3. Trigger async Knowledge ingest
        c.executionCtx.waitUntil(triggerKnowledgeIngest(c.env, tenantId, fileId, file.name, content));

        return c.json({
            success: true,
            data: { file_id: fileId, name: file.name, size: file.size, status: 'ready' }
        });
    } catch (err: any) {
        return c.json({ error: 'Upload failed', message: err.message }, 500);
    }
});

/**
 * Trigger Knowledge service for document ingestion (via Service Binding or HTTP fallback)
 */
async function triggerKnowledgeIngest(env: Bindings, tenantId: string, fileId: string, fileName: string, content: ArrayBuffer) {
    const payload = JSON.stringify({
        tenant_id: tenantId,
        file_id: fileId,
        source_name: fileName,
        content: new TextDecoder().decode(content).substring(0, 10000),
    });

    try {
        if (env.KNOWLEDGE) {
            // Zero-latency Service Binding
            await env.KNOWLEDGE.fetch(new Request('https://internal/knowledge/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-tenant-id': tenantId },
                body: payload,
            }));
        } else if (env.KNOWLEDGE_SERVICE_URL) {
            // HTTP fallback (deprecated)
            await fetch(`${env.KNOWLEDGE_SERVICE_URL}/knowledge/ingest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-tenant-id': tenantId },
                body: payload,
            });
        }
    } catch (err) {
        console.error('Knowledge ingest trigger failed (non-blocking)', err);
    }
}

export default app;
