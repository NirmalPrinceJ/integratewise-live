/**
 * Embedding Storage
 * 
 * Handles persistence of embeddings to the database with pgvector.
 */

import { neon } from '@neondatabase/serverless';
import type { Chunk } from '../chunking';
import { formatForPgVector } from './service';

// ============================================================================
// Types
// ============================================================================

export interface StoredChunk {
  id: string;
  tenantId: string;
  content: string;
  contentHash: string;
  chunkIndex: number;
  chunkType: string;
  charStart?: number;
  charEnd?: number;
  tokenCount?: number;
  sourceType: string;
  sourceName?: string;
  entityType?: string;
  entityId?: string;
  fileId?: string;
  sessionId?: string;
}

export interface StoredEmbedding {
  id: string;
  chunkId: string;
  embedding: number[];
  model: string;
  dimensions: number;
}

export interface StoreChunkOptions {
  tenantId: string;
  sourceType: string;
  sourceName?: string;
  entityType?: string;
  entityId?: string;
  fileId?: string;
  sessionId?: string;
  versionId?: string;
}

// ============================================================================
// Chunk Storage
// ============================================================================

/**
 * Store chunks in the database
 */
export async function storeChunks(
  dbUrl: string,
  chunks: Chunk[],
  options: StoreChunkOptions
): Promise<string[]> {
  const sql = neon(dbUrl);
  const chunkIds: string[] = [];
  
  for (const chunk of chunks) {
    try {
      const result = await sql`
        INSERT INTO document_chunks (
          tenant_id,
          chunk_index,
          chunk_type,
          content,
          content_hash,
          char_start,
          char_end,
          token_count,
          source_type,
          source_name,
          entity_type,
          entity_id,
          file_id,
          session_id
        ) VALUES (
          ${options.tenantId}::uuid,
          ${chunk.metadata.chunkIndex},
          ${chunk.metadata.chunkType},
          ${chunk.content},
          ${chunk.contentHash},
          ${chunk.metadata.charStart || null},
          ${chunk.metadata.charEnd || null},
          ${chunk.metadata.tokenCount || null},
          ${options.sourceType},
          ${options.sourceName || null},
          ${options.entityType || null},
          ${options.entityId || null},
          ${options.fileId ? options.fileId : null}::uuid,
          ${options.sessionId ? options.sessionId : null}::uuid
        )
        ON CONFLICT (tenant_id, content_hash) DO UPDATE SET
          updated_at = NOW()
        RETURNING id
      `;
      
      chunkIds.push(result[0].id);
    } catch (error: any) {
      console.error(`Failed to store chunk ${chunk.metadata.chunkIndex}:`, error.message);
      throw error;
    }
  }
  
  return chunkIds;
}

/**
 * Get chunks by IDs
 */
export async function getChunksByIds(
  dbUrl: string,
  chunkIds: string[]
): Promise<StoredChunk[]> {
  const sql = neon(dbUrl);
  
  const results = await sql`
    SELECT 
      id, tenant_id, content, content_hash,
      chunk_index, chunk_type, char_start, char_end, token_count,
      source_type, source_name, entity_type, entity_id,
      file_id, session_id
    FROM document_chunks
    WHERE id = ANY(${chunkIds}::uuid[])
  `;
  
  return results.map(r => ({
    id: r.id,
    tenantId: r.tenant_id,
    content: r.content,
    contentHash: r.content_hash,
    chunkIndex: r.chunk_index,
    chunkType: r.chunk_type,
    charStart: r.char_start,
    charEnd: r.char_end,
    tokenCount: r.token_count,
    sourceType: r.source_type,
    sourceName: r.source_name,
    entityType: r.entity_type,
    entityId: r.entity_id,
    fileId: r.file_id,
    sessionId: r.session_id,
  }));
}

/**
 * Get chunks without embeddings (for backfill)
 */
export async function getChunksWithoutEmbeddings(
  dbUrl: string,
  tenantId: string,
  limit: number = 100
): Promise<StoredChunk[]> {
  const sql = neon(dbUrl);
  
  const results = await sql`
    SELECT 
      dc.id, dc.tenant_id, dc.content, dc.content_hash,
      dc.chunk_index, dc.chunk_type, dc.char_start, dc.char_end, dc.token_count,
      dc.source_type, dc.source_name, dc.entity_type, dc.entity_id,
      dc.file_id, dc.session_id
    FROM document_chunks dc
    LEFT JOIN chunk_embeddings ce ON ce.chunk_id = dc.id
    WHERE dc.tenant_id = ${tenantId}::uuid
    AND ce.id IS NULL
    ORDER BY dc.created_at DESC
    LIMIT ${limit}
  `;
  
  return results.map(r => ({
    id: r.id,
    tenantId: r.tenant_id,
    content: r.content,
    contentHash: r.content_hash,
    chunkIndex: r.chunk_index,
    chunkType: r.chunk_type,
    charStart: r.char_start,
    charEnd: r.char_end,
    tokenCount: r.token_count,
    sourceType: r.source_type,
    sourceName: r.source_name,
    entityType: r.entity_type,
    entityId: r.entity_id,
    fileId: r.file_id,
    sessionId: r.session_id,
  }));
}

// ============================================================================
// Embedding Storage
// ============================================================================

/**
 * Store embeddings in the database
 */
export async function storeEmbeddings(
  dbUrl: string,
  tenantId: string,
  embeddings: Array<{
    chunkId: string;
    embedding: number[];
    model: string;
  }>
): Promise<string[]> {
  const sql = neon(dbUrl);
  const embeddingIds: string[] = [];
  
  for (const emb of embeddings) {
    const vectorStr = formatForPgVector(emb.embedding);
    
    const result = await sql`
      INSERT INTO chunk_embeddings (
        tenant_id,
        chunk_id,
        embedding,
        model_name,
        dimensions
      ) VALUES (
        ${tenantId}::uuid,
        ${emb.chunkId}::uuid,
        ${vectorStr}::vector,
        ${emb.model},
        ${emb.embedding.length}
      )
      ON CONFLICT (chunk_id, model_name) DO UPDATE SET
        embedding = EXCLUDED.embedding
      RETURNING id
    `;
    
    embeddingIds.push(result[0].id);
  }
  
  return embeddingIds;
}

/**
 * Store session embeddings
 */
export async function storeSessionEmbedding(
  dbUrl: string,
  tenantId: string,
  sessionId: string,
  embeddingType: 'summary' | 'memory' | 'tool_call' | 'full_session',
  contentEmbedded: string,
  embedding: number[],
  model: string = 'text-embedding-3-small'
): Promise<string> {
  const sql = neon(dbUrl);
  const vectorStr = formatForPgVector(embedding);
  
  const result = await sql`
    INSERT INTO session_embeddings (
      tenant_id,
      session_id,
      embedding_type,
      content_embedded,
      embedding,
      model_name
    ) VALUES (
      ${tenantId}::uuid,
      ${sessionId}::uuid,
      ${embeddingType},
      ${contentEmbedded},
      ${vectorStr}::vector,
      ${model}
    )
    ON CONFLICT (session_id, embedding_type) DO UPDATE SET
      content_embedded = EXCLUDED.content_embedded,
      embedding = EXCLUDED.embedding
    RETURNING id
  `;
  
  return result[0].id;
}

// ============================================================================
// Bulk Operations
// ============================================================================

/**
 * Process and store document: chunk + embed + store
 */
export async function processAndStoreDocument(
  dbUrl: string,
  content: string,
  options: StoreChunkOptions & {
    embedder: {
      embedBatch: (texts: string[]) => Promise<{
        embeddings: Array<{ index: number; embedding: number[]; tokenCount: number }>;
        model: string;
      }>;
    };
    fileType?: string;
  }
): Promise<{
  chunkIds: string[];
  embeddingIds: string[];
  totalChunks: number;
  totalTokens: number;
}> {
  // Import chunker dynamically to avoid circular deps
  const { chunkDocument } = await import('../chunking');
  
  // 1. Chunk the document
  const chunkResult = await chunkDocument(content, {
    sourceType: options.sourceType,
    fileType: options.fileType,
  });
  
  // 2. Store chunks
  const chunkIds = await storeChunks(dbUrl, chunkResult.chunks, options);
  
  // 3. Generate embeddings
  const texts = chunkResult.chunks.map(c => c.content);
  const embeddingResult = await options.embedder.embedBatch(texts);
  
  // 4. Store embeddings
  const embeddingsToStore = embeddingResult.embeddings.map((e, i) => ({
    chunkId: chunkIds[i],
    embedding: e.embedding,
    model: embeddingResult.model,
  }));
  
  const embeddingIds = await storeEmbeddings(dbUrl, options.tenantId, embeddingsToStore);
  
  return {
    chunkIds,
    embeddingIds,
    totalChunks: chunkResult.chunks.length,
    totalTokens: chunkResult.totalTokens,
  };
}

/**
 * Backfill embeddings for chunks that don't have them
 */
export async function backfillEmbeddings(
  dbUrl: string,
  tenantId: string,
  embedder: {
    embedBatch: (texts: string[]) => Promise<{
      embeddings: Array<{ index: number; embedding: number[]; tokenCount: number }>;
      model: string;
    }>;
  },
  batchSize: number = 50
): Promise<{ processed: number; failed: number }> {
  let processed = 0;
  let failed = 0;
  
  while (true) {
    const chunks = await getChunksWithoutEmbeddings(dbUrl, tenantId, batchSize);
    
    if (chunks.length === 0) break;
    
    try {
      const texts = chunks.map(c => c.content);
      const result = await embedder.embedBatch(texts);
      
      const embeddingsToStore = result.embeddings.map((e, i) => ({
        chunkId: chunks[i].id,
        embedding: e.embedding,
        model: result.model,
      }));
      
      await storeEmbeddings(dbUrl, tenantId, embeddingsToStore);
      processed += chunks.length;
    } catch (error) {
      console.error('Backfill batch failed:', error);
      failed += chunks.length;
    }
  }
  
  return { processed, failed };
}
