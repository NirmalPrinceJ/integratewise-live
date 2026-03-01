import { SupabaseClient } from '@supabase/supabase-js';
import { AppEnv, getSupabaseClient, getApiKey } from './config';

export interface EmbeddingRecord {
  id: string;
  source_type: string;
  source_id: string;
  content: string;
  embedding?: number[];
  model?: string;
  token_count?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

export interface SearchResult {
  id: string;
  source_type: string;
  source_id: string;
  content: string;
  similarity: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface EmbeddingConfig {
  model?: string;
  apiKey?: string;
  provider?: "openai" | "deepseek";
}

/**
 * Generate embedding using OpenAI or DeepSeek
 */
export async function generateEmbedding(
  env: AppEnv,
  text: string,
  config: EmbeddingConfig = {}
): Promise<{ embedding: number[]; model: string; tokenCount: number }> {
  const model = config.model || "text-embedding-ada-002";
  const provider = config.provider || "openai";
  const apiKey = config.apiKey || getApiKey(env, provider === "openai" ? "openai" : "deepseek");

  if (!apiKey) {
    throw new Error(`${provider} API key not configured`);
  }

  if (provider === "openai") {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: text,
        model: model,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data: any = await response.json();
    return {
      embedding: data.data[0].embedding,
      model: model,
      tokenCount: data.usage.total_tokens,
    };
  } else {
    // DeepSeek implementation
    const response = await fetch("https://api.deepseek.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: text,
        model: model || "deepseek-embed",
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data: any = await response.json();
    return {
      embedding: data.data[0].embedding,
      model: model || "deepseek-embed",
      tokenCount: data.usage.total_tokens,
    };
  }
}

/**
 * Store embedding in Supabase (Legacy) with D1 metadata sync
 */
export async function storeEmbedding(
  env: AppEnv,
  sourceType: string,
  sourceId: string,
  content: string,
  embedding: number[],
  options: {
    model?: string;
    tokenCount?: number;
    metadata?: Record<string, unknown>;
  } = {}
): Promise<EmbeddingRecord | null> {
  const supabase = getSupabaseClient(env);

  // 1. D1 Metadata Storage (Primary / Spine)
  try {
    await env.DB.prepare(`
      INSERT INTO ai_session_memories (
        id, session_id, memory_type, memory_key, memory_value, confidence, trust_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      sourceId, // Mapping sourceId to session_id for now
      sourceType,
      'content_summary',
      content.substring(0, 1000),
      0.9,
      'model_inferred'
    ).run();
  } catch (d1Error) {
    console.warn("[Embeddings] D1 sync failed:", d1Error);
  }

  // 2. Supabase / Vector Store (Search Layer)
  if (!supabase) {
    console.warn("[Embeddings] Supabase not configured for vector search");
    return null;
  }

  const { data, error } = await supabase
    .from("embeddings")
    .insert({
      source_type: sourceType,
      source_id: sourceId,
      content,
      embedding: embedding, // Supabase-js handles array to vector casting
      model: options.model || "text-embedding-ada-002",
      token_count: options.tokenCount,
      metadata: options.metadata || {},
    })
    .select()
    .single();

  if (error) {
    console.error("[Embeddings] Failed to store embedding:", error);
    return null;
  }

  return data as EmbeddingRecord;
}

/**
 * Search embeddings by similarity
 */
export async function searchEmbeddings(
  env: AppEnv,
  queryEmbedding: number[],
  options: {
    threshold?: number;
    limit?: number;
    sourceType?: string;
  } = {}
): Promise<SearchResult[]> {
  const supabase = getSupabaseClient(env);

  if (!supabase) {
    console.error("[Embeddings] Supabase client not available");
    return [];
  }

  const threshold = options.threshold || 0.7;
  const limit = options.limit || 10;
  const sourceType = options.sourceType || null;

  const { data, error } = await supabase.rpc("search_embeddings", {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit,
    filter_source_type: sourceType,
  });

  if (error) {
    console.error("[Embeddings] Search failed:", error);
    return [];
  }

  return (data as SearchResult[]) || [];
}

/**
 * Search by text (generates embedding first)
 */
export async function searchByText(
  env: AppEnv,
  queryText: string,
  options: {
    threshold?: number;
    limit?: number;
    sourceType?: string;
    config?: EmbeddingConfig;
  } = {}
): Promise<SearchResult[]> {
  try {
    const { embedding } = await generateEmbedding(env, queryText, options.config);
    return await searchEmbeddings(env, embedding, {
      threshold: options.threshold,
      limit: options.limit,
      sourceType: options.sourceType,
    });
  } catch (error) {
    console.error("[Embeddings] Text search failed:", error);
    return [];
  }
}
