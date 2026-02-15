/**
 * Semantic Lookup (D1)
 * 
 * NOTE: Cloudflare D1 does not natively support pgvector-style search.
 * This implementation provides a stub for semantic discovery on D1.
 * For production semantic search, use Cloudflare Vectorize.
 */

import type { EvidenceRef } from './fusion';

// ============================================================================
// Types
// ============================================================================

export interface SemanticSearchResult {
    chunk_id: string;
    content: string;
    similarity_score: number;
    source_type: string;
    source_name?: string;
    entity_type?: string;
    entity_id?: string;
    chunk_type: string;
}

export interface SessionSearchResult {
    session_id: string;
    summary: string;
    similarity_score: number;
    embedding_type: string;
    session_start?: string;
    tool_names?: string[];
    entity_type?: string;
    entity_id?: string;
}

export interface SemanticLookupOptions {
    topK?: number;
    minScore?: number;
    sourceTypes?: string[];
    includeRelatedEntities?: boolean;
    correlationId?: string;
}

export interface SemanticLookupResult {
    chunks: SemanticSearchResult[];
    sessions: SessionSearchResult[];
    evidence_refs: EvidenceRef[];
    query_embedding_time_ms?: number;
    search_time_ms?: number;
}

interface EmbeddingConfig {
    apiKey: string;
    provider?: 'openai' | 'openrouter';
    model?: string;
    dimensions?: number;
}

async function generateEmbedding(text: string, config: EmbeddingConfig): Promise<number[]> {
    const provider = config.provider || 'openai';
    const model = config.model || 'text-embedding-3-small';
    const baseUrl = provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : 'https://api.openai.com/v1';

    const response = await fetch(`${baseUrl}/embeddings`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text, model: provider === 'openrouter' ? `openai/${model}` : model })
    });

    if (!response.ok) throw new Error(`Embedding error: ${await response.text()}`);
    const data = await response.json() as any;
    return data.data[0].embedding;
}

/**
 * Partial Semantic Search for D1 (Exact Match Fallback)
 */
export async function searchChunks(
    db: D1Database,
    tenantId: string,
    queryEmbedding: number[],
    options: SemanticLookupOptions = {}
): Promise<SemanticSearchResult[]> {
    // SQLite/D1 does not support vector similarity natively.
    // Fetching relevant matches by tenant as a fallback.
    const results = await db.prepare(`
        SELECT id as chunk_id, content, source_type, entity_type, entity_id 
        FROM document_chunks 
        WHERE tenant_id = ? 
        LIMIT ?
    `).bind(tenantId, options.topK || 5).all();

    return (results.results || []).map((r: any) => ({
        ...r,
        similarity_score: 0.5,
        chunk_type: 'text'
    }));
}

export async function searchSessions(
    db: D1Database,
    tenantId: string,
    queryEmbedding: number[],
    options: SemanticLookupOptions = {}
): Promise<SessionSearchResult[]> {
    const results = await db.prepare(`
        SELECT id as session_id, summary, created_at as session_start 
        FROM brainstorm_sessions 
        WHERE tenant_id = ? 
        LIMIT ?
    `).bind(tenantId, options.topK || 3).all();

    return (results.results || []).map((r: any) => ({
        ...r,
        similarity_score: 0.5,
        embedding_type: 'summary'
    }));
}

export async function performEntitySemanticLookup(
    db: D1Database,
    aiConfig: { apiKey: string; provider: 'openai' | 'openrouter' },
    tenantId: string,
    entityType: string,
    entityId: string,
    contextQuery?: string,
    options: SemanticLookupOptions = {}
): Promise<SemanticLookupResult> {
    const startTime = Date.now();
    const query = contextQuery || `Information about ${entityType} ${entityId}`;

    // 1. Generate Embedding (Optional for fallback)
    const embeddingStartTime = Date.now();
    let queryEmbedding: number[] = [];
    try {
        queryEmbedding = await generateEmbedding(query, aiConfig);
    } catch (e) { console.error("Embedding generation failed", e); }
    const embeddingTime = Date.now() - embeddingStartTime;

    // 2. Search linked context (Direct relational lookup as D1 fallback)
    const [chunks, sessions] = await Promise.all([
        searchChunks(db, tenantId, queryEmbedding, options),
        searchSessions(db, tenantId, queryEmbedding, options)
    ]);

    return {
        chunks,
        sessions,
        evidence_refs: [],
        query_embedding_time_ms: embeddingTime,
        search_time_ms: Date.now() - startTime - embeddingTime
    };
}
