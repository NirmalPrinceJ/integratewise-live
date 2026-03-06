/**
 * KV Adapter — Reads data directly from the Supabase KV store via server proxy
 *
 * Provides direct access to the KV store for slots that need raw key-value
 * data without going through the Spine normalization layer.
 *
 * Endpoint format: "kv/<key-or-prefix>"
 *   e.g. "kv/spine:t1:readiness", "kv/fabric:*"
 */

import type {
  DataProvider,
  ProviderConfig,
  ProviderResult,
  ProviderFactory,
  SlotBinding,
  HydrationContext,
  HealthStatus,
} from "../types";

// ─── Supabase disconnected — KVAdapter returns mock/empty data ───────────────

const memoryStore = new Map<string, any>();

class KVAdapter implements DataProvider {
  readonly type = "kv" as const;

  constructor(private config: ProviderConfig) {}

  async fetch<T = any>(
    binding: SlotBinding,
    context: HydrationContext
  ): Promise<ProviderResult<T>> {
    const startMs = performance.now();
    const key = this.resolveKey(binding, context);
    console.warn(
      `[KVAdapter] Supabase disconnected — returning empty data for key '${key}'`
    );

    // Return from in-memory store if available
    const value = memoryStore.get(key);

    return {
      data: (value ?? {}) as T,
      provenance: {
        provider: "kv",
        endpoint: key,
        fetchedAt: new Date().toISOString(),
        sourceSystem: "local-memory",
        confidence: value ? 1.0 : 0,
        transformApplied: binding.transform,
      },
      freshness: value ? 1.0 : 0,
      cached: false,
      partial: !value,
      fetchDuration: performance.now() - startMs,
    };
  }

  async healthCheck(): Promise<HealthStatus> {
    return {
      provider: "kv",
      healthy: false,
      latencyMs: 0,
      lastChecked: new Date().toISOString(),
      errorMessage: "Supabase disconnected — running in local memory mode",
    };
  }

  private resolveKey(binding: SlotBinding, context: HydrationContext): string {
    let key = binding.endpoint;
    if (key.startsWith("kv/")) key = key.slice(3);

    key = key.replace(/\{domain\}/g, context.domain.toLowerCase());
    key = key.replace(/\{tenantId\}/g, context.tenantId);
    key = key.replace(/\{role\}/g, context.role);

    return key;
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

export const createKVAdapter: ProviderFactory = (config: ProviderConfig) => {
  return new KVAdapter(config);
};