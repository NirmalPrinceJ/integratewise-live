/**
 * Doppler Adapter — Reads data directly from Doppler via server proxy
 *
 * Doppler serves as BOTH a config store AND a data bus:
 *   - External systems push data TO Doppler variables
 *   - This adapter reads those variables and feeds them to UI slots
 *   - The server proxies requests to the Doppler API (to keep the token server-side)
 *
 * Endpoint format: "doppler/<variable-name-or-prefix>"
 *   e.g. "doppler/SALES_PIPELINE_DATA", "doppler/ROLE_SALES_*"
 *
 * The server route `/fabric/doppler-proxy` handles the actual Doppler API call.
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

// ─── Supabase disconnected — DopplerAdapter returns mock/empty data ──────────

class DopplerAdapter implements DataProvider {
  readonly type = "doppler" as const;

  constructor(private config: ProviderConfig) {}

  async fetch<T = any>(
    binding: SlotBinding,
    context: HydrationContext
  ): Promise<ProviderResult<T>> {
    const startMs = performance.now();
    console.warn(`[DopplerAdapter] Supabase disconnected — returning empty data for ${binding.endpoint}`);

    return {
      data: {} as T,
      provenance: {
        provider: "doppler",
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
      provider: "doppler",
      healthy: false,
      latencyMs: 0,
      lastChecked: new Date().toISOString(),
      errorMessage: "Supabase disconnected — Doppler proxy unavailable",
    };
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

export const createDopplerAdapter: ProviderFactory = (config: ProviderConfig) => {
  return new DopplerAdapter(config);
};