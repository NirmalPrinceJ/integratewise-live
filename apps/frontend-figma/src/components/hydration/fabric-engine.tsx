/**
 * Hydration Fabric Engine — Core React Context
 *
 * The single provider that wraps the entire workspace. On mount:
 *   1. Fetches the FabricManifest from the server
 *   2. Registers all providers dynamically (spine, rest, doppler, static, kv)
 *   3. Resolves slot bindings per role/domain
 *   4. Exposes useHydrate() and friends via context
 *
 * "Normalize Once, Hydrate Anywhere" — provider-agnostic, config-driven.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import type {
  FabricContextValue,
  FabricStatus,
  FabricManifest,
  HydrationContext,
  HydrationPhase,
  SlotState,
  SlotBinding,
  ProviderType,
  ProviderFactory,
  ProviderConfig,
  ProviderResult,
  HealthStatus,
  RoleBinding,
} from "./types";

import { ProviderBus, getProviderBus, resetProviderBus } from "./provider-bus";
import { createSpineAdapter } from "./providers/spine-adapter";
import { createRestAdapter } from "./providers/rest-adapter";
import { createDopplerAdapter } from "./providers/doppler-adapter";
import { createStaticAdapter } from "./providers/static-adapter";
import { createKVAdapter } from "./providers/kv-adapter";

// ─── Supabase disconnected — all data is served locally ──────────────────────

// ─── Default Context ─────────────────────────────────────────────────────────

const defaultStatus: FabricStatus = {
  initialized: false,
  initializing: false,
  manifestLoaded: false,
  configSource: null,
  activeProviders: [],
  slotCount: 0,
  healthyProviders: 0,
  totalProviders: 0,
  lastManifestFetch: null,
  error: null,
};

const defaultContext: HydrationContext = {
  domain: "BIZOPS",
  role: "business-ops",
  tenantId: "t1",
  userName: "User",
  connectedApps: [],
};

const noopContextValue: FabricContextValue = {
  status: defaultStatus,
  manifest: null,
  context: defaultContext,
  getSlotState: () => ({
    slotId: "",
    phase: "idle",
    data: null,
    error: null,
    fetchedAt: null,
    staleAt: null,
    retryCount: 0,
    provenance: null,
  }),
  hydrate: async () => null,
  invalidate: () => {},
  invalidatePattern: () => {},
  refreshManifest: async () => {},
  updateContext: () => {},
  registerProvider: () => {},
  getProviderHealth: async () => ({}),
};

const FabricContext = createContext<FabricContextValue>(noopContextValue);

// ─── Role Gate ───────────────────────────────────────────────────────────────

function resolveRoleBinding(
  manifest: FabricManifest,
  domain: string,
  role: string
): RoleBinding | null {
  // Try exact match first
  const exact = manifest.roleBindings[`${domain}:${role}`]
    || manifest.roleBindings[domain]
    || manifest.roleBindings[role];
  if (exact) return exact;

  // Try wildcard/default
  return manifest.roleBindings["*"] || null;
}

function isSlotAllowed(
  slotId: string,
  roleBinding: RoleBinding | null
): boolean {
  if (!roleBinding) return true; // No role config = allow all

  // Check denied first (takes precedence)
  if (roleBinding.deniedSlots?.some((p) => matchPattern(slotId, p))) {
    return false;
  }

  // Check allowed
  return roleBinding.allowedSlots.some((p) => matchPattern(slotId, p));
}

function matchPattern(value: string, pattern: string): boolean {
  if (pattern === "*") return true;
  const regex = new RegExp("^" + pattern.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$");
  return regex.test(value);
}

function resolveSlotBinding(
  manifest: FabricManifest,
  slotId: string,
  roleBinding: RoleBinding | null
): SlotBinding | null {
  const base = manifest.slots[slotId];
  if (!base) return null;

  // Apply role-specific overrides
  if (roleBinding?.overrides) {
    const override = roleBinding.overrides.find((o) => o.slotId === slotId);
    if (override) {
      return {
        ...base,
        ...(override.provider !== undefined && { provider: override.provider }),
        ...(override.endpoint !== undefined && { endpoint: override.endpoint }),
        ...(override.ttl !== undefined && { ttl: override.ttl }),
        ...(override.transform !== undefined && { transform: override.transform }),
        ...(override.priority !== undefined && { priority: override.priority }),
      };
    }
  }

  return base;
}

// ─── Provider Registration ───────────────────────────────────────────────────

function registerDefaultProviders(
  bus: ProviderBus,
  manifest: FabricManifest
): void {
  const providerMap: Record<ProviderType, ProviderFactory> = {
    spine: createSpineAdapter,
    rest: createRestAdapter,
    doppler: createDopplerAdapter,
    static: createStaticAdapter,
    kv: createKVAdapter,
    graphql: createRestAdapter, // GraphQL uses REST adapter with POST
  };

  for (const [type, config] of Object.entries(manifest.providers)) {
    const factory = providerMap[type as ProviderType];
    if (factory && config.enabled) {
      bus.register(type as ProviderType, factory, config);
    }
  }
}

// ─── Fabric Provider Component ──────────────────────────────────────────────

export interface HydrationFabricProps {
  children: ReactNode;
  /** Initial hydration context (domain, role, etc.) */
  initialContext?: Partial<HydrationContext>;
  /** Override manifest URL (for testing) */
  manifestUrl?: string;
  /** Skip manifest fetch and use this manifest directly */
  staticManifest?: FabricManifest;
}

export function HydrationFabric({
  children,
  initialContext,
  manifestUrl,
  staticManifest,
}: HydrationFabricProps) {
  const [status, setStatus] = useState<FabricStatus>(defaultStatus);
  const [manifest, setManifest] = useState<FabricManifest | null>(
    staticManifest || null
  );
  const [hydrationCtx, setHydrationCtx] = useState<HydrationContext>({
    ...defaultContext,
    ...initialContext,
  });

  // Per-slot state tracking
  const slotStates = useRef<Map<string, SlotState>>(new Map());
  const slotListeners = useRef<Map<string, Set<() => void>>>(new Map());
  const busRef = useRef<ProviderBus>(getProviderBus());

  // ── Notify slot listeners ──────────────────────────────────────────────

  const notifySlot = useCallback((slotId: string) => {
    const listeners = slotListeners.current.get(slotId);
    if (listeners) {
      listeners.forEach((fn) => fn());
    }
  }, []);

  // ── Slot State Management ──────────────────────────────────────────────

  const updateSlotState = useCallback(
    (slotId: string, patch: Partial<SlotState>) => {
      const current = slotStates.current.get(slotId) || {
        slotId,
        phase: "idle" as HydrationPhase,
        data: null,
        error: null,
        fetchedAt: null,
        staleAt: null,
        retryCount: 0,
        provenance: null,
      };
      slotStates.current.set(slotId, { ...current, ...patch });
      notifySlot(slotId);
    },
    [notifySlot]
  );

  const getSlotState = useCallback(<T = any>(slotId: string): SlotState<T> => {
    return (
      slotStates.current.get(slotId) || {
        slotId,
        phase: "idle" as HydrationPhase,
        data: null,
        error: null,
        fetchedAt: null,
        staleAt: null,
        retryCount: 0,
        provenance: null,
      }
    );
  }, []);

  // ── Manifest Fetch ─────────────────────────────────────────────────────

  const fetchManifest = useCallback(async () => {
    if (staticManifest) {
      setManifest(staticManifest);
      return staticManifest;
    }

    // Supabase disconnected — always use inline fallback manifest
    console.log("[HydrationFabric] Using inline manifest (Supabase disconnected)");
    const fallback = buildInlineManifest(hydrationCtx);
    setManifest(fallback);
    return fallback;
  }, [staticManifest, hydrationCtx]);

  // ── Initialization ─────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setStatus((s) => ({ ...s, initializing: true, error: null }));

      try {
        const m = await fetchManifest();
        if (cancelled || !m) return;

        // Register providers dynamically
        const bus = busRef.current;
        registerDefaultProviders(bus, m);

        // Eagerly hydrate preload slots for the current role
        const roleBinding = resolveRoleBinding(
          m,
          hydrationCtx.domain,
          hydrationCtx.role
        );
        if (roleBinding?.preloadSlots) {
          // Fire and forget — don't block initialization
          for (const slotId of roleBinding.preloadSlots) {
            hydrateSlot(slotId, m, bus, roleBinding).catch(() => {});
          }
        }

        setStatus({
          initialized: true,
          initializing: false,
          manifestLoaded: true,
          configSource: m.configSource,
          activeProviders: bus.getRegisteredProviders(),
          slotCount: Object.keys(m.slots).length,
          healthyProviders: bus.getRegisteredProviders().length,
          totalProviders: Object.keys(m.providers).length,
          lastManifestFetch: new Date().toISOString(),
          error: null,
        });
      } catch (err: any) {
        console.error("[HydrationFabric] Init failed:", err);
        setStatus((s) => ({
          ...s,
          initializing: false,
          error: err.message,
        }));
      }
    }

    init();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrationCtx.domain, hydrationCtx.role]);

  // ── Core Hydrate Function ──────────────────────────────────────────────

  async function hydrateSlot<T = any>(
    slotId: string,
    m: FabricManifest,
    bus: ProviderBus,
    roleBinding: RoleBinding | null,
    extraParams?: Record<string, any>
  ): Promise<T | null> {
    // Role gate
    if (!isSlotAllowed(slotId, roleBinding)) {
      updateSlotState(slotId, {
        phase: "error",
        error: `Access denied: role '${hydrationCtx.role}' cannot access slot '${slotId}'`,
      });
      return null;
    }

    // Resolve binding
    const binding = resolveSlotBinding(m, slotId, roleBinding);
    if (!binding) {
      updateSlotState(slotId, {
        phase: "error",
        error: `No binding found for slot '${slotId}' in manifest`,
      });
      return null;
    }

    // Merge extra params
    const finalBinding: SlotBinding = extraParams
      ? { ...binding, params: { ...binding.params, ...extraParams } }
      : binding;

    // Update phase → skeleton
    updateSlotState(slotId, { phase: "skeleton", error: null });

    try {
      // Attempt stale-while-revalidate
      const result = await bus.fetchWithSWR<T>(
        finalBinding,
        hydrationCtx,
        (refreshed) => {
          // Background refresh completed
          updateSlotState(slotId, {
            phase: "complete",
            data: refreshed.data,
            fetchedAt: Date.now(),
            staleAt: finalBinding.ttl > 0 ? Date.now() + finalBinding.ttl : null,
            provenance: refreshed.provenance,
          });
        }
      );

      if (result) {
        const phase: HydrationPhase = result.partial ? "partial" : "complete";
        updateSlotState(slotId, {
          phase,
          data: result.data,
          fetchedAt: Date.now(),
          staleAt: finalBinding.ttl > 0 ? Date.now() + finalBinding.ttl : null,
          provenance: result.provenance,
          retryCount: 0,
        });
        return result.data;
      }

      return null;
    } catch (err: any) {
      const current = slotStates.current.get(slotId);
      updateSlotState(slotId, {
        phase: "error",
        error: err.message,
        retryCount: (current?.retryCount || 0) + 1,
      });
      console.error(`[HydrationFabric] Hydrate failed for ${slotId}:`, err.message);
      return null;
    }
  }

  // ── Context Value ──────────────────────────────────────────────────────

  const hydrate = useCallback(
    async <T = any>(
      slotId: string,
      extraParams?: Record<string, any>
    ): Promise<T | null> => {
      if (!manifest) {
        console.warn("[HydrationFabric] Cannot hydrate — manifest not loaded");
        return null;
      }
      const roleBinding = resolveRoleBinding(
        manifest,
        hydrationCtx.domain,
        hydrationCtx.role
      );
      return hydrateSlot<T>(
        slotId,
        manifest,
        busRef.current,
        roleBinding,
        extraParams
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [manifest, hydrationCtx]
  );

  const invalidate = useCallback(
    (slotId: string) => {
      busRef.current.cache.invalidate(slotId);
      updateSlotState(slotId, { phase: "stale" });
    },
    [updateSlotState]
  );

  const invalidatePattern = useCallback(
    (pattern: string) => {
      busRef.current.cache.invalidatePattern(pattern);
      // Mark all matching slots as stale
      for (const [id] of slotStates.current) {
        if (matchPattern(id, pattern)) {
          updateSlotState(id, { phase: "stale" });
        }
      }
    },
    [updateSlotState]
  );

  const refreshManifest = useCallback(async () => {
    setStatus((s) => ({ ...s, initializing: true }));
    await fetchManifest();
    setStatus((s) => ({ ...s, initializing: false }));
  }, [fetchManifest]);

  const updateContext = useCallback((patch: Partial<HydrationContext>) => {
    setHydrationCtx((prev) => ({ ...prev, ...patch }));
  }, []);

  const registerProvider = useCallback(
    (type: ProviderType, factory: ProviderFactory, config: ProviderConfig) => {
      busRef.current.register(type, factory, config);
      setStatus((s) => ({
        ...s,
        activeProviders: busRef.current.getRegisteredProviders(),
      }));
    },
    []
  );

  const getProviderHealth = useCallback(async () => {
    return busRef.current.healthCheck();
  }, []);

  // ── Subscribe mechanism for hooks ──────────────────────────────────────

  // Exposed via a second context so hooks can subscribe to slot changes
  const subscribeToSlot = useCallback(
    (slotId: string, listener: () => void): (() => void) => {
      if (!slotListeners.current.has(slotId)) {
        slotListeners.current.set(slotId, new Set());
      }
      slotListeners.current.get(slotId)!.add(listener);
      return () => {
        slotListeners.current.get(slotId)?.delete(listener);
      };
    },
    []
  );

  const contextValue: FabricContextValue = {
    status,
    manifest,
    context: hydrationCtx,
    getSlotState,
    hydrate,
    invalidate,
    invalidatePattern,
    refreshManifest,
    updateContext,
    registerProvider,
    getProviderHealth,
  };

  return (
    <FabricContext.Provider value={contextValue}>
      <FabricSubscribeContext.Provider value={subscribeToSlot}>
        {children}
      </FabricSubscribeContext.Provider>
    </FabricContext.Provider>
  );
}

// ── Internal subscribe context (used by hooks) ──────────────────────────────

type SubscribeFn = (slotId: string, listener: () => void) => () => void;

const FabricSubscribeContext = createContext<SubscribeFn>(() => () => {});

export function useFabricSubscribe() {
  return useContext(FabricSubscribeContext);
}

// ── Public hook to access the fabric context ────────────────────────────────

export function useFabric(): FabricContextValue {
  return useContext(FabricContext);
}

// ─── Inline Fallback Manifest ────────────────────────────────────────────────
// Used when the server is unreachable — defines a minimal set of slots
// backed by the Spine adapter so the app still works.

function buildInlineManifest(ctx: HydrationContext): FabricManifest {
  const domain = ctx.domain.toLowerCase();

  return {
    version: "1.0.0-inline",
    generatedAt: new Date().toISOString(),
    configSource: "inline",

    providers: {
      spine: { type: "spine", enabled: true },
      rest: { type: "rest", enabled: true, baseUrl: "" },
      doppler: { type: "doppler", enabled: false },
      static: { type: "static", enabled: true, meta: { datasets: {} } },
      kv: { type: "kv", enabled: true },
      graphql: { type: "graphql", enabled: false },
    },

    slots: {
      // Universal slots (all domains)
      "global.readiness": {
        slotId: "global.readiness",
        provider: "spine",
        endpoint: "spine/readiness",
        ttl: 60000,
        priority: 1,
        fallbackProvider: "static",
      },
      "global.metadata": {
        slotId: "global.metadata",
        provider: "spine",
        endpoint: "spine/metadata",
        ttl: 120000,
        priority: 2,
      },
      // Domain-specific entity slots
      [`${domain}.accounts`]: {
        slotId: `${domain}.accounts`,
        provider: "spine",
        endpoint: `domain/{domain}/accounts`,
        ttl: 30000,
        priority: 3,
      },
      [`${domain}.contacts`]: {
        slotId: `${domain}.contacts`,
        provider: "spine",
        endpoint: `domain/{domain}/contacts`,
        ttl: 30000,
        priority: 3,
      },
      [`${domain}.deals`]: {
        slotId: `${domain}.deals`,
        provider: "spine",
        endpoint: `domain/{domain}/deals`,
        ttl: 30000,
        priority: 3,
      },
      [`${domain}.tasks`]: {
        slotId: `${domain}.tasks`,
        provider: "spine",
        endpoint: `domain/{domain}/tasks`,
        ttl: 15000,
        priority: 4,
      },
      [`${domain}.activities`]: {
        slotId: `${domain}.activities`,
        provider: "spine",
        endpoint: `domain/{domain}/activities`,
        ttl: 15000,
        priority: 4,
      },
      [`${domain}.documents`]: {
        slotId: `${domain}.documents`,
        provider: "spine",
        endpoint: `domain/{domain}/documents`,
        ttl: 30000,
        priority: 5,
      },
      [`${domain}.dashboard`]: {
        slotId: `${domain}.dashboard`,
        provider: "spine",
        endpoint: `spine/projection/{domain}`,
        ttl: 30000,
        priority: 1,
      },
      // Cross-domain: website projection (always available)
      "website.dashboard": {
        slotId: "website.dashboard",
        provider: "spine",
        endpoint: "spine/projection/website",
        ttl: 30000,
        priority: 2,
      },
      // Cross-domain: salesops/revops read from sales projection
      ...(domain === "salesops" || domain === "revops" ? {
        [`${domain}.dashboard`]: {
          slotId: `${domain}.dashboard`,
          provider: "spine",
          endpoint: "spine/projection/sales",
          ttl: 30000,
          priority: 1,
        },
      } : {}),
    },

    roleBindings: {
      "*": {
        roleId: "*",
        domain: ctx.domain,
        allowedSlots: ["*"],
        hydrationStrategy: "lazy",
        maxConcurrent: 4,
        preloadSlots: [`${domain}.dashboard`, "global.readiness"],
      },
    },

    transforms: {
      identity: { id: "identity", description: "Pass through", type: "map" },
      "extract-data": {
        id: "extract-data",
        description: "Extract .data from response",
        type: "map",
        spec: { root: "data" },
      },
    },
  };
}