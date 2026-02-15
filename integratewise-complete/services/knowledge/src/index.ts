/**
 * Knowledge Service - Day 2 Implementation
 * 
 * Provides semantic search, document chunking, and embedding management
 * for the IntegrateWise Knowledge Pipeline.
 * 
 * Best Practice: All endpoints include correlation_id for request tracing.
 */

import { Hono } from 'hono';
import { neon } from '@neondatabase/serverless';
import { z } from 'zod';
import { cors } from 'hono/cors';
import { enforceTenantLimits } from '@integratewise/connector-utils';

// Import knowledge modules
import { chunkDocument, chunkSession } from './chunking';
import { EmbeddingService, createOpenAIEmbedder, createOpenRouterEmbedder, storeChunks, storeEmbeddings, storeSessionEmbedding, processAndStoreDocument } from './embedding';
import { SearchService, createSearchService, type SearchType } from './search';

// ============================================================================
// Types
// ============================================================================

type Bindings = {
    DATABASE_URL: string;
    OPENROUTER_API_KEY?: string;  // Preferred: Use OpenRouter for all AI
    OPENAI_API_KEY?: string;       // Fallback: Direct OpenAI API
    ENVIRONMENT: string;
};

// ============================================================================
// App Setup
// ============================================================================

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

// ============================================================================
// Best Practice: Correlation ID + Structured Error Envelope (Guardrail #4)
// ============================================================================

const CORRELATION_ID_HEADER = 'x-correlation-id';

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function getCorrelationId(c: any): string {
    return c.req.header(CORRELATION_ID_HEADER) || generateUUID();
}

function logWithContext(
    correlationId: string,
    level: 'info' | 'warn' | 'error',
    message: string,
    data?: Record<string, unknown>
): void {
    const log = {
        timestamp: new Date().toISOString(),
        level,
        correlation_id: correlationId,
        service: 'knowledge',
        message,
        ...data,
    };
    console[level](JSON.stringify(log));
}

// Best Practice #4: Structured Error Envelope
interface ErrorEnvelope {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
    correlation_id: string;
}

function errorResponse(
    c: any,
    correlationId: string,
    code: string,
    message: string,
    status: number,
    details?: unknown
): Response {
    const envelope: ErrorEnvelope = {
        success: false,
        error: { code, message, details },
        correlation_id: correlationId,
    };
    return c.json(envelope, status);
}

// ============================================================================
// Helper: Get Services
// ============================================================================

function getEmbedder(env: Bindings): EmbeddingService {
    // Prefer OpenRouter if API key is available
    if (env.OPENROUTER_API_KEY) {
        return createOpenRouterEmbedder(env.OPENROUTER_API_KEY);
    }
    // Fallback to direct OpenAI API
    if (env.OPENAI_API_KEY) {
        return createOpenAIEmbedder(env.OPENAI_API_KEY);
    }
    throw new Error('No AI API key configured. Set OPENROUTER_API_KEY or OPENAI_API_KEY.');
}

function getSearchService(env: Bindings): SearchService {
    const embedder = getEmbedder(env);
    return createSearchService(env.DATABASE_URL, embedder);
}

// ============================================================================
// Health Check
// ============================================================================

app.get('/health', (c) => c.json({
    status: 'ok',
    service: 'knowledge',
    v: '2.0.0-semantic',
    features: [
        'chunking',
        'embedding',
        'vector-search',
        'hybrid-search',
        'session-search',
        'correlation-tracing'
    ],
}));

// ============================================================================
// Schema Definitions
// ============================================================================

const SearchSchema = z.object({
    query: z.string().min(1).max(1000),
    type: z.enum(['vector', 'keyword', 'hybrid']).optional().default('hybrid'),
    top_k: z.number().int().min(1).max(100).optional().default(10),
    min_score: z.number().min(0).max(1).optional().default(0.5),
    entity_type: z.string().optional(),
    entity_id: z.string().optional(),
    source_types: z.array(z.string()).optional(),
    include_metadata: z.boolean().optional().default(true),
});

const IngestSchema = z.object({
    tenant_id: z.string().uuid(),
    file_id: z.string().uuid().optional(),
    entity_type: z.string().optional(),
    entity_id: z.string().optional(),
    source_type: z.enum(['file', 'session', 'url', 'api']).default('file'),
    source_name: z.string().optional(),
    file_type: z.string().optional(),
    content: z.string().min(1),
});

const SessionEmbedSchema = z.object({
    session_id: z.string().uuid(),
    tenant_id: z.string().uuid(),
    summary: z.string().min(1),
    tool_calls: z.array(z.string()).optional(),
    memories: z.array(z.string()).optional(),
    entity_type: z.string().optional(),
    entity_id: z.string().optional(),
});

// ============================================================================
// POST /knowledge/search - Semantic Search
// ============================================================================

app.post('/knowledge/search', async (c) => {
    const correlationId = getCorrelationId(c);
    
    try {
        const tenantId = c.req.header('x-tenant-id');
        if (!tenantId) {
            return errorResponse(c, correlationId, 'MISSING_TENANT', 'x-tenant-id header required', 400);
        }
        
        const body = await c.req.json();
        const parsed = SearchSchema.safeParse(body);
        
        if (!parsed.success) {
            return errorResponse(c, correlationId, 'VALIDATION_ERROR', 'Invalid search parameters', 400, parsed.error.flatten());
        }
        
        logWithContext(correlationId, 'info', 'Search request', {
            query_length: parsed.data.query.length,
            search_type: parsed.data.type,
            top_k: parsed.data.top_k,
        });
        
        const searchService = getSearchService(c.env);
        
        const result = await searchService.search(tenantId, parsed.data.query, {
            type: parsed.data.type as SearchType,
            topK: parsed.data.top_k,
            minScore: parsed.data.min_score,
            entityType: parsed.data.entity_type,
            entityId: parsed.data.entity_id,
            sourceTypes: parsed.data.source_types,
            includeMetadata: parsed.data.include_metadata,
        });
        
        logWithContext(correlationId, 'info', 'Search completed', {
            result_count: result.totalResults,
            duration_ms: result.processingTimeMs,
        });
        
        return c.json({
            success: true,
            data: result,
            correlation_id: correlationId,
        });
        
    } catch (error: any) {
        logWithContext(correlationId, 'error', 'Search failed', { error: error.message });
        return errorResponse(c, correlationId, 'SEARCH_ERROR', error.message, 500);
    }
});

// ============================================================================
// POST /knowledge/search/sessions - Session Search
// ============================================================================

app.post('/knowledge/search/sessions', async (c) => {
    const correlationId = getCorrelationId(c);
    
    try {
        const tenantId = c.req.header('x-tenant-id');
        if (!tenantId) {
            return errorResponse(c, correlationId, 'MISSING_TENANT', 'x-tenant-id header required', 400);
        }
        
        const body = await c.req.json();
        const parsed = SearchSchema.safeParse(body);
        
        if (!parsed.success) {
            return errorResponse(c, correlationId, 'VALIDATION_ERROR', 'Invalid search parameters', 400, parsed.error.flatten());
        }
        
        logWithContext(correlationId, 'info', 'Session search request', {
            query_length: parsed.data.query.length,
            top_k: parsed.data.top_k,
        });
        
        const searchService = getSearchService(c.env);
        
        const results = await searchService.searchSessions(tenantId, parsed.data.query, {
            topK: parsed.data.top_k,
            minScore: parsed.data.min_score,
            entityType: parsed.data.entity_type,
            entityId: parsed.data.entity_id,
        });
        
        return c.json({
            success: true,
            data: {
                results,
                query: parsed.data.query,
                totalResults: results.length,
            },
            correlation_id: correlationId,
        });
        
    } catch (error: any) {
        logWithContext(correlationId, 'error', 'Session search failed', { error: error.message });
        return errorResponse(c, correlationId, 'SEARCH_ERROR', error.message, 500);
    }
});

// ============================================================================
// POST /knowledge/ingest - Ingest and Embed Document
// ============================================================================

app.post('/knowledge/ingest', async (c) => {
    const correlationId = getCorrelationId(c);
    
    try {
        const body = await c.req.json();
        const parsed = IngestSchema.safeParse(body);
        
        if (!parsed.success) {
            return errorResponse(c, correlationId, 'VALIDATION_ERROR', 'Invalid ingest parameters', 400, parsed.error.flatten());
        }
        
        const { tenant_id, content, source_type, source_name, entity_type, entity_id, file_id, file_type } = parsed.data;
        
        logWithContext(correlationId, 'info', 'Ingest request', {
            source_type,
            content_length: content.length,
            file_type,
        });
        
        // Check tenant limits
        const limitCheck = await enforceTenantLimits(c.env.DATABASE_URL, tenant_id, 'docs_ingested');
        if (!limitCheck.allowed) {
            return errorResponse(c, correlationId, 'LIMIT_EXCEEDED', limitCheck.reason || 'Document limit exceeded', 429);
        }
        
        // Process and store document
        const embedder = getEmbedder(c.env);
        
        const result = await processAndStoreDocument(c.env.DATABASE_URL, content, {
            tenantId: tenant_id,
            sourceType: source_type,
            sourceName: source_name,
            entityType: entity_type,
            entityId: entity_id,
            fileId: file_id,
            fileType: file_type,
            embedder,
        });
        
        logWithContext(correlationId, 'info', 'Ingest completed', {
            chunks: result.totalChunks,
            tokens: result.totalTokens,
        });
        
        return c.json({
            success: true,
            data: {
                chunk_ids: result.chunkIds,
                embedding_ids: result.embeddingIds,
                total_chunks: result.totalChunks,
                total_tokens: result.totalTokens,
            },
            correlation_id: correlationId,
        });
        
    } catch (error: any) {
        logWithContext(correlationId, 'error', 'Ingest failed', { error: error.message });
        return errorResponse(c, correlationId, 'INGEST_ERROR', error.message, 500);
    }
});

// ============================================================================
// POST /knowledge/embed/session - Embed AI Session
// ============================================================================

app.post('/knowledge/embed/session', async (c) => {
    const correlationId = getCorrelationId(c);
    
    try {
        const body = await c.req.json();
        const parsed = SessionEmbedSchema.safeParse(body);
        
        if (!parsed.success) {
            return errorResponse(c, correlationId, 'VALIDATION_ERROR', 'Invalid session parameters', 400, parsed.error.flatten());
        }
        
        const { session_id, tenant_id, summary, tool_calls, memories, entity_type, entity_id } = parsed.data;
        
        logWithContext(correlationId, 'info', 'Session embed request', {
            session_id,
            summary_length: summary.length,
        });
        
        const embedder = getEmbedder(c.env);
        
        // Chunk the session
        const chunkResult = await chunkSession(summary, tool_calls, memories);
        
        // Store chunks
        const chunkIds = await storeChunks(c.env.DATABASE_URL, chunkResult.chunks, {
            tenantId: tenant_id,
            sourceType: 'session',
            sourceName: `Session ${session_id}`,
            entityType: entity_type,
            entityId: entity_id,
            sessionId: session_id,
        });
        
        // Generate embeddings
        const texts = chunkResult.chunks.map(chunk => chunk.content);
        const embeddingResult = await embedder.embedBatch(texts);
        
        // Store chunk embeddings
        const embeddingsToStore = embeddingResult.embeddings.map((e, i) => ({
            chunkId: chunkIds[i],
            embedding: e.embedding,
            model: embeddingResult.model,
        }));
        
        await storeEmbeddings(c.env.DATABASE_URL, tenant_id, embeddingsToStore);
        
        // Store session-level embedding (summary)
        const summaryEmbedding = await embedder.embed(summary);
        await storeSessionEmbedding(
            c.env.DATABASE_URL,
            tenant_id,
            session_id,
            'summary',
            summary,
            summaryEmbedding.embedding,
            embeddingResult.model
        );
        
        logWithContext(correlationId, 'info', 'Session embedded', {
            chunks: chunkResult.chunks.length,
            tokens: chunkResult.totalTokens,
        });
        
        return c.json({
            success: true,
            data: {
                session_id,
                chunks_created: chunkResult.chunks.length,
                total_tokens: chunkResult.totalTokens,
            },
            correlation_id: correlationId,
        });
        
    } catch (error: any) {
        logWithContext(correlationId, 'error', 'Session embed failed', { error: error.message });
        return errorResponse(c, correlationId, 'EMBED_ERROR', error.message, 500);
    }
});

// ============================================================================
// POST /knowledge/chunk - Chunk Document (Preview)
// ============================================================================

app.post('/knowledge/chunk', async (c) => {
    const correlationId = getCorrelationId(c);
    
    try {
        const body = await c.req.json();
        const { content, source_type, file_type, config } = body;
        
        if (!content) {
            return errorResponse(c, correlationId, 'VALIDATION_ERROR', 'content is required', 400);
        }
        
        const result = await chunkDocument(content, {
            sourceType: source_type || 'file',
            fileType: file_type,
            config,
        });
        
        return c.json({
            success: true,
            data: {
                chunks: result.chunks.map(chunk => ({
                    content: chunk.content.substring(0, 200) + (chunk.content.length > 200 ? '...' : ''),
                    content_hash: chunk.contentHash,
                    metadata: chunk.metadata,
                })),
                total_chunks: result.chunks.length,
                total_tokens: result.totalTokens,
                processing_time_ms: result.processingTimeMs,
            },
            correlation_id: correlationId,
        });
        
    } catch (error: any) {
        logWithContext(correlationId, 'error', 'Chunk preview failed', { error: error.message });
        return errorResponse(c, correlationId, 'CHUNK_ERROR', error.message, 500);
    }
});

// ============================================================================
// GET /knowledge/similar/:chunk_id - Find Similar Chunks
// ============================================================================

app.get('/knowledge/similar/:chunk_id', async (c) => {
    const correlationId = getCorrelationId(c);
    
    try {
        const tenantId = c.req.header('x-tenant-id');
        if (!tenantId) {
            return errorResponse(c, correlationId, 'MISSING_TENANT', 'x-tenant-id header required', 400);
        }
        
        const chunkId = c.req.param('chunk_id');
        const topK = parseInt(c.req.query('top_k') || '5');
        
        const searchService = getSearchService(c.env);
        const results = await searchService.findSimilar(tenantId, chunkId, topK);
        
        return c.json({
            success: true,
            data: { results },
            correlation_id: correlationId,
        });
        
    } catch (error: any) {
        logWithContext(correlationId, 'error', 'Find similar failed', { error: error.message });
        return errorResponse(c, correlationId, 'SEARCH_ERROR', error.message, 500);
    }
});

// ============================================================================
// Legacy /v1 Endpoints (Backward Compatibility)
// ============================================================================

const LegacyIngestSchema = z.object({
    tenant_id: z.string().uuid(),
    file_id: z.string().uuid(),
    entity_type: z.string().optional(),
    entity_id: z.string().optional(),
    doc_type: z.enum(['contract', 'runbook', 'icp', 'meeting_notes', 'qbr', 'technical_manual']).default('technical_manual'),
    name: z.string(),
    content: z.string(),
});

app.post('/v1/knowledge/ingest', async (c) => {
    const correlationId = getCorrelationId(c);
    const sql = neon(c.env.DATABASE_URL);
    try {
        const body = await c.req.json();
        const result = LegacyIngestSchema.safeParse(body);
        if (!result.success) return c.json({ error: result.error.flatten() }, 400);

        const { tenant_id, file_id, entity_type, entity_id, doc_type, name, content } = result.data;

        logWithContext(correlationId, 'info', 'Legacy ingest request', { file_id, doc_type });

        // 1. Enforce Guardrails
        const limitCheck = await enforceTenantLimits(c.env.DATABASE_URL, tenant_id, 'docs_ingested');
        if (!limitCheck.allowed) {
            return c.json({ error: limitCheck.reason, correlation_id: correlationId }, 429);
        }

        // 2. Logic to track file and versions
        const [file] = await sql`
            INSERT INTO files (id, tenant_id, name, entity_type, entity_id, metadata)
            VALUES (${file_id}, ${tenant_id}::uuid, ${name}, ${entity_type}, ${entity_id}, ${JSON.stringify({ doc_type })})
            ON CONFLICT (id) DO UPDATE SET updated_at = NOW()
            RETURNING id
        `;

        const [version] = await sql`
            INSERT INTO file_versions (file_id, status)
            VALUES (${file.id}, 'processing')
            RETURNING id
        `;

        // 3. Chunks & Embeddings (Simulated for Worker context)
        const chunks = content.split('\n\n').filter(Boolean);

        // Check embedding limits before loop
        const chunkLimitCheck = await enforceTenantLimits(c.env.DATABASE_URL, tenant_id, 'chunks_embedded', chunks.length);
        if (!chunkLimitCheck.allowed) {
            await sql`UPDATE file_versions SET status = 'limit_exceeded' WHERE id = ${version.id}`;
            return c.json({ error: chunkLimitCheck.reason }, 429);
        }

        for (let i = 0; i < chunks.length; i++) {
            const mockEmbedding = Array(1536).fill(0).map(() => (Math.random() * 2 - 1).toFixed(4));
            await sql`
                INSERT INTO file_embeddings (version_id, chunk_index, chunk_content, embedding, metadata)
                VALUES (
                    ${version.id}, 
                    ${i}, 
                    ${chunks[i]}, 
                    ${'[' + mockEmbedding.join(',') + ']'}::vector,
                    ${JSON.stringify({ tenant_id, entity_type, entity_id, doc_type })}
                )
            `;
        }

        await sql`UPDATE file_versions SET status = 'ready' WHERE id = ${version.id}`;

        return c.json({
            success: true,
            file_id: file.id,
            version_id: version.id,
            chunks_embedded: chunks.length
        });

    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

app.post('/v1/store/upload', async (c) => {
    const tenant_id = c.req.header('x-tenant-id');
    if (!tenant_id) return c.json({ error: 'x-tenant-id header required' }, 400);

    // SPEC: Use /v1/store/upload as single entry point
    const file_id = crypto.randomUUID();
    return c.json({
        success: true,
        file_id,
        instructions: 'Send result to /v1/knowledge/ingest to complete pipeline'
    });
});

export default app;
