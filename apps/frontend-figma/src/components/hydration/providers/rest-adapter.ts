/**
 * REST Adapter — Generic REST API Provider
 *
 * Connects to ANY REST API. Fully configurable via SlotBinding:
 *   - baseUrl from ProviderConfig
 *   - endpoint, method, params, headers from SlotBinding
 *
 * "Any system in backend can wire data to UI" — just point the slot at the REST URL.
 *
 * Endpoint format: Full path or relative to baseUrl
 *   e.g. "/api/v1/accounts", "https://external.api.com/data"
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

class RestAdapter implements DataProvider {
  readonly type = "rest" as const;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(private config: ProviderConfig) {
    this.baseUrl = config.baseUrl || "";
    this.timeout = config.timeout || 15000;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...(config.authHeader ? { Authorization: config.authHeader } : {}),
      ...(config.defaultHeaders || {}),
    };
  }

  async fetch<T = any>(
    binding: SlotBinding,
    context: HydrationContext
  ): Promise<ProviderResult<T>> {
    const startMs = performance.now();
    const url = this.resolveUrl(binding, context);
    const method = binding.method || "GET";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const fetchOpts: RequestInit = {
        method,
        headers: {
          ...this.defaultHeaders,
          ...(binding.headers || {}),
        },
        signal: controller.signal,
      };

      if (method === "POST" && binding.params) {
        fetchOpts.body = JSON.stringify({
          ...binding.params,
          // Inject context if the API expects it
          ...(binding.params._injectContext
            ? {
                domain: context.domain,
                role: context.role,
                tenantId: context.tenantId,
              }
            : {}),
        });
      }

      const res = await fetch(url, fetchOpts);
      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(
          `[RestAdapter] ${method} ${url} returned ${res.status}: ${errBody}`
        );
      }

      const data = await res.json();

      return {
        data: data as T,
        provenance: {
          provider: "rest",
          endpoint: binding.endpoint,
          fetchedAt: new Date().toISOString(),
          sourceSystem: new URL(url).hostname,
          confidence: 0.9,
          transformApplied: binding.transform,
        },
        freshness: 1.0,
        cached: false,
        partial: false,
        fetchDuration: performance.now() - startMs,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async healthCheck(): Promise<HealthStatus> {
    const start = performance.now();
    if (!this.baseUrl) {
      return {
        provider: "rest",
        healthy: true,
        latencyMs: 0,
        lastChecked: new Date().toISOString(),
        errorMessage: "No baseUrl configured — endpoint-specific mode",
      };
    }

    try {
      const res = await fetch(this.baseUrl, {
        method: "HEAD",
        headers: this.defaultHeaders,
      });
      return {
        provider: "rest",
        healthy: res.ok,
        latencyMs: performance.now() - start,
        lastChecked: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        provider: "rest",
        healthy: false,
        latencyMs: performance.now() - start,
        lastChecked: new Date().toISOString(),
        errorMessage: err.message,
      };
    }
  }

  private resolveUrl(binding: SlotBinding, context: HydrationContext): string {
    let ep = binding.endpoint;

    // Replace placeholders
    ep = ep.replace(/\{domain\}/g, context.domain.toLowerCase());
    ep = ep.replace(/\{tenantId\}/g, context.tenantId);
    ep = ep.replace(/\{role\}/g, context.role);
    ep = ep.replace(/\{userName\}/g, encodeURIComponent(context.userName));

    // If endpoint is a full URL, use it directly
    if (ep.startsWith("http://") || ep.startsWith("https://")) {
      return ep;
    }

    // Otherwise, prepend baseUrl
    const base = this.baseUrl.endsWith("/") ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const path = ep.startsWith("/") ? ep : `/${ep}`;
    return `${base}${path}`;
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

export const createRestAdapter: ProviderFactory = (config: ProviderConfig) => {
  return new RestAdapter(config);
};
