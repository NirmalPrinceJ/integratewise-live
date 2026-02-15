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
    R2_BUCKET: R2Bucket;
    KNOWLEDGE_SERVICE_URL: string;
    ENVIRONMENT: string;
    SERVICE_SECRET?: string;
};

type Variables = {
    requestId: string;
    tenantId: string;
};

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
        await c.env.DB.prepare(`
            INSERT INTO files (id, tenant_id, name, content_type, size_bytes, entity_type, entity_id, metadata, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            fileId,
            tenantId,
            name,
            content_type || 'application/octet-stream',
            size || 0,
            metadata?.entity_type || null,
            metadata?.entity_id || null,
            JSON.stringify(metadata || {}),
            'pending_upload'
        ).run();

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
        // 1. Check if file record exists
        const file = await c.env.DB.prepare(`SELECT name, content_type FROM files WHERE id = ? AND tenant_id = ?`)
            .bind(fileId, tenantId)
            .first<{ name: string, content_type: string }>();

        if (!file) return c.json({ error: 'File not found' }, 404);

        // 2. Upload to R2
        const r2Key = `${tenantId}/${fileId}/${file.name}`;
        await c.env.R2_BUCKET.put(r2Key, content, {
            httpMetadata: { contentType: file.content_type }
        });

        // 3. Update status to ready
        await c.env.DB.prepare(`UPDATE files SET status = 'ready', updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
            .bind(fileId)
            .run();

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

    const file = await c.env.DB.prepare(`SELECT * FROM files WHERE id = ? AND tenant_id = ?`)
        .bind(fileId, tenantId)
        .first();

    if (!file) return c.json({ error: 'File not found' }, 404);
    return c.json({ success: true, data: file });
});

/**
 * List files
 */
app.get('/store/files', async (c) => {
    const tenantId = c.get('tenantId');
    if (!tenantId) return c.json({ error: 'x-tenant-id required' }, 400);

    const { results } = await c.env.DB.prepare(`SELECT * FROM files WHERE tenant_id = ? ORDER BY created_at DESC`)
        .bind(tenantId)
        .all();

    return c.json({ success: true, data: results });
});

async function triggerKnowledgeIngest(env: Bindings, tenantId: string, fileId: string, fileName: string, content: ArrayBuffer) {
    const knowledgeUrl = env.KNOWLEDGE_SERVICE_URL;
    try {
        await fetch(`${knowledgeUrl}/knowledge/ingest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-tenant-id': tenantId },
            body: JSON.stringify({
                tenant_id: tenantId,
                file_id: fileId,
                source_name: fileName,
                content: new TextDecoder().decode(content).substring(0, 10000), // Sample for first pass
            })
        });
    } catch (err) {
        console.error("Knowledge ingest trigger failed", err);
    }
}

export default app;
