/**
 * Knowledge Search Service
 * 
 * Implements semantic, keyword, and hybrid search across document chunks
 * and AI sessions using pgvector for vector similarity.
 */

import { neon } from '@neondatabase/serverless';
import { EmbeddingService, formatForPgVector } from '../embedding';

// ============================================================================
// Types
// ============================================================================

export type SearchType = 'vector' | 'keyword' | 'hybrid';

export interface SearchOptions {
  type?: SearchType;
  topK?: number;
  minScore?: number;
  entityType?: string;
  entityId?: string;
  sourceTypes?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  includeMetadata?: boolean;
}

export interface SearchResult {
  chunkId: string;
  content: string;
  similarityScore: number;
  keywordScore: number;
  combinedScore: number;
  sourceType: string;
  sourceName?: string;
  entityType?: string;
  entityId?: string;
  fileId?: string;
  sessionId?: string;
  metadata?: {
    chunkIndex: number;
    chunkType: string;
    tokenCount?: number;
  };
}

export interface SessionSearchResult {
  sessionId: string;
  summary: string;
  similarityScore: number;
  embeddingType: string;
  sessionStart?: Date;
  toolNames?: string[];
  entityType?: string;
  entityId?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  searchType: SearchType;
  totalResults: number;
  processingTimeMs: number;
}

// ============================================================================
// Search Service Class
// ============================================================================

export class SearchService {
  private dbUrl: string;
  private embedder: EmbeddingService;
  
  constructor(dbUrl: string, embedder: EmbeddingService) {
    this.dbUrl = dbUrl;
    this.embedder = embedder;
  }
  
  /**
   * Semantic search across document chunks
   */
  async search(
    tenantId: string,
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResponse> {
    const startTime = Date.now();
    const searchType = options.type || 'hybrid';
    const topK = options.topK || 10;
    const minScore = options.minScore || 0.5;
    
    let results: SearchResult[];
    
    switch (searchType) {
      case 'vector':
        results = await this.vectorSearch(tenantId, query, topK, minScore, options);
        break;
      case 'keyword':
        results = await this.keywordSearch(tenantId, query, topK, options);
        break;
      case 'hybrid':
      default:
        results = await this.hybridSearch(tenantId, query, topK, minScore, options);
        break;
    }
    
    return {
      results,
      query,
      searchType,
      totalResults: results.length,
      processingTimeMs: Date.now() - startTime,
    };
  }
  
  /**
   * Pure vector similarity search
   */
  private async vectorSearch(
    tenantId: string,
    query: string,
    topK: number,
    minScore: number,
    options: SearchOptions
  ): Promise<SearchResult[]> {
    const sql = neon(this.dbUrl);
    
    // Get query embedding
    const embeddingResult = await this.embedder.embed(query);
    const queryVector = formatForPgVector(embeddingResult.embedding);
    
    // Build filter conditions
    const entityTypeFilter = options.entityType ? `AND dc.entity_type = '${options.entityType}'` : '';
    const entityIdFilter = options.entityId ? `AND dc.entity_id = '${options.entityId}'` : '';
    const sourceTypesFilter = options.sourceTypes?.length 
      ? `AND dc.source_type = ANY(ARRAY['${options.sourceTypes.join("','")}'])` 
      : '';
    
    const results = await sql`
      SELECT 
        dc.id AS chunk_id,
        dc.content,
        1 - (ce.embedding <=> ${queryVector}::vector) AS similarity_score,
        0 AS keyword_score,
        1 - (ce.embedding <=> ${queryVector}::vector) AS combined_score,
        dc.source_type,
        dc.source_name,
        dc.entity_type,
        dc.entity_id,
        dc.file_id,
        dc.session_id,
        dc.chunk_index,
        dc.chunk_type,
        dc.token_count
      FROM chunk_embeddings ce
      JOIN document_chunks dc ON dc.id = ce.chunk_id
      WHERE ce.tenant_id = ${tenantId}::uuid
      AND 1 - (ce.embedding <=> ${queryVector}::vector) >= ${minScore}
      ORDER BY ce.embedding <=> ${queryVector}::vector
      LIMIT ${topK}
    `;
    
    return results.map(r => this.mapToSearchResult(r, options.includeMetadata));
  }
  
  /**
   * Full-text keyword search
   */
  private async keywordSearch(
    tenantId: string,
    query: string,
    topK: number,
    options: SearchOptions
  ): Promise<SearchResult[]> {
    const sql = neon(this.dbUrl);
    
    const results = await sql`
      SELECT 
        dc.id AS chunk_id,
        dc.content,
        0 AS similarity_score,
        ts_rank(to_tsvector('english', dc.content), plainto_tsquery('english', ${query})) AS keyword_score,
        ts_rank(to_tsvector('english', dc.content), plainto_tsquery('english', ${query})) AS combined_score,
        dc.source_type,
        dc.source_name,
        dc.entity_type,
        dc.entity_id,
        dc.file_id,
        dc.session_id,
        dc.chunk_index,
        dc.chunk_type,
        dc.token_count
      FROM document_chunks dc
      WHERE dc.tenant_id = ${tenantId}::uuid
      AND to_tsvector('english', dc.content) @@ plainto_tsquery('english', ${query})
      ORDER BY ts_rank(to_tsvector('english', dc.content), plainto_tsquery('english', ${query})) DESC
      LIMIT ${topK}
    `;
    
    return results.map(r => this.mapToSearchResult(r, options.includeMetadata));
  }
  
  /**
   * Hybrid search combining vector and keyword
   */
  private async hybridSearch(
    tenantId: string,
    query: string,
    topK: number,
    minScore: number,
    options: SearchOptions
  ): Promise<SearchResult[]> {
    const sql = neon(this.dbUrl);
    
    // Get query embedding
    const embeddingResult = await this.embedder.embed(query);
    const queryVector = formatForPgVector(embeddingResult.embedding);
    
    // Use the database function for hybrid search
    const results = await sql`
      SELECT * FROM semantic_search(
        ${tenantId}::uuid,
        ${queryVector}::vector,
        ${query},
        ${topK},
        ${options.entityType || null},
        ${options.entityId || null},
        ${options.sourceTypes || null}::text[],
        ${minScore}
      )
    `;
    
    return results.map(r => this.mapToSearchResult(r, options.includeMetadata));
  }
  
  /**
   * Search across AI sessions
   */
  async searchSessions(
    tenantId: string,
    query: string,
    options: SearchOptions = {}
  ): Promise<SessionSearchResult[]> {
    const sql = neon(this.dbUrl);
    const topK = options.topK || 10;
    const minScore = options.minScore || 0.5;
    
    // Get query embedding
    const embeddingResult = await this.embedder.embed(query);
    const queryVector = formatForPgVector(embeddingResult.embedding);
    
    // Use the database function for session search
    const results = await sql`
      SELECT * FROM session_search(
        ${tenantId}::uuid,
        ${queryVector}::vector,
        ${topK},
        ${options.entityType || null},
        ${options.entityId || null},
        ${minScore}
      )
    `;
    
    return results.map(r => ({
      sessionId: r.session_id,
      summary: r.session_summary,
      similarityScore: parseFloat(r.similarity_score),
      embeddingType: r.embedding_type,
      sessionStart: r.session_start,
      toolNames: r.tool_names,
      entityType: r.entity_type,
      entityId: r.entity_id,
    }));
  }
  
  /**
   * Find similar chunks to a given chunk
   */
  async findSimilar(
    tenantId: string,
    chunkId: string,
    topK: number = 5
  ): Promise<SearchResult[]> {
    const sql = neon(this.dbUrl);
    
    const results = await sql`
      SELECT 
        dc.id AS chunk_id,
        dc.content,
        1 - (ce.embedding <=> source_ce.embedding) AS similarity_score,
        0 AS keyword_score,
        1 - (ce.embedding <=> source_ce.embedding) AS combined_score,
        dc.source_type,
        dc.source_name,
        dc.entity_type,
        dc.entity_id,
        dc.file_id,
        dc.session_id,
        dc.chunk_index,
        dc.chunk_type,
        dc.token_count
      FROM chunk_embeddings source_ce
      CROSS JOIN LATERAL (
        SELECT ce.*, dc.*
        FROM chunk_embeddings ce
        JOIN document_chunks dc ON dc.id = ce.chunk_id
        WHERE ce.tenant_id = ${tenantId}::uuid
        AND ce.chunk_id != ${chunkId}::uuid
        ORDER BY ce.embedding <=> source_ce.embedding
        LIMIT ${topK}
      ) AS ce
      JOIN document_chunks dc ON dc.id = ce.chunk_id
      WHERE source_ce.chunk_id = ${chunkId}::uuid
    `;
    
    return results.map(r => this.mapToSearchResult(r, true));
  }
  
  /**
   * Log search for analytics
   */
  async logSearch(
    tenantId: string,
    query: string,
    queryEmbedding: number[],
    searchType: SearchType,
    results: SearchResult[],
    durationMs: number,
    userId?: string,
    correlationId?: string
  ): Promise<void> {
    const sql = neon(this.dbUrl);
    const vectorStr = formatForPgVector(queryEmbedding);
    
    await sql`
      INSERT INTO search_history (
        tenant_id,
        user_id,
        query_text,
        query_embedding,
        search_type,
        top_k,
        result_count,
        result_ids,
        relevance_scores,
        duration_ms,
        correlation_id
      ) VALUES (
        ${tenantId}::uuid,
        ${userId || null},
        ${query},
        ${vectorStr}::vector,
        ${searchType},
        ${results.length},
        ${results.length},
        ${results.map(r => r.chunkId)}::uuid[],
        ${results.map(r => r.combinedScore)}::numeric[],
        ${durationMs},
        ${correlationId || null}
      )
    `;
  }
  
  /**
   * Map database row to SearchResult
   */
  private mapToSearchResult(row: any, includeMetadata?: boolean): SearchResult {
    const result: SearchResult = {
      chunkId: row.chunk_id,
      content: row.content,
      similarityScore: parseFloat(row.similarity_score) || 0,
      keywordScore: parseFloat(row.keyword_score) || 0,
      combinedScore: parseFloat(row.combined_score) || 0,
      sourceType: row.source_type,
      sourceName: row.source_name,
      entityType: row.entity_type,
      entityId: row.entity_id,
      fileId: row.file_id,
      sessionId: row.session_id,
    };
    
    if (includeMetadata) {
      result.metadata = {
        chunkIndex: row.chunk_index,
        chunkType: row.chunk_type,
        tokenCount: row.token_count,
      };
    }
    
    return result;
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export function createSearchService(
  dbUrl: string,
  embedder: EmbeddingService
): SearchService {
  return new SearchService(dbUrl, embedder);
}
