/**
 * Spine Adapter — Wraps the existing SpineProvider / spine-client.ts API
 *
 * This adapter makes the existing Spine architecture available as one
 * provider in the Hydration Fabric. Components using useHydrate() can
 * seamlessly get Spine data without knowing it comes from Spine.
 *
 * Endpoint format: "spine/<api-path>"
 *   e.g. "spine/projection/sales", "spine/entities/accounts", "spine/readiness"
 *   Also: "domain/<domain>/<table>" for the unified domain API
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

// ─── Supabase disconnected — SpineAdapter returns mock/empty data ────────────

class SpineAdapter implements DataProvider {
  readonly type = "spine" as const;

  constructor(private config: ProviderConfig) {}

  async fetch<T = any>(
    binding: SlotBinding,
    context: HydrationContext
  ): Promise<ProviderResult<T>> {
    const startMs = performance.now();
    console.warn(`[SpineAdapter] Supabase disconnected — returning empty data for ${binding.endpoint}`);

    return {
      data: {} as T,
      provenance: {
        provider: "spine",
        endpoint: binding.endpoint,
        fetchedAt: new Date().toISOString(),
        sourceSystem: "local-mock",
        confidence: 0,
        transformApplied: binding.transform,
      },
      freshness: 0,
      cached: false,
      partial: true,
      fetchDuration: performance.now() - startMs,
    };
  }

  async healthCheck(): Promise<HealthStatus> {
    return {
      provider: "spine",
      healthy: false,
      latencyMs: 0,
      lastChecked: new Date().toISOString(),
      errorMessage: "Supabase disconnected — running in local mock mode",
    };
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

export const createSpineAdapter: ProviderFactory = (config: ProviderConfig) => {
  return new SpineAdapter(config);
};