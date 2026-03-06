/**
 * Spine Client — Frontend SSOT Consumer
 *
 * All L1 workspace pages read data exclusively through this client.
 * Tool-specific schemas never leak to UI. Everything speaks Spine language.
 *
 * Architecture v3.5: Routes through Gateway Worker (Service ①) via unified API client.
 * Flow: L1 Component → useSpineProjection() → API Client → Gateway → BFF/Pipeline → Spine SSOT
 */

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { apiFetch as _apiFetch, legacySpine, pipeline, workspace, connector } from "../../lib/api-client";

// ─── Readiness Types (mirror of server) ──────────────────────────────────────

export type ReadinessState = "off" | "adding" | "seeded" | "live";

export interface ReadinessBucket {
  capability: string;
  state: ReadinessState;
  label: string;
  description: string;
  coverage: number;
  completeness: number;
  freshness: number;
  confidence: number;
  score: number;
}

export interface DepartmentReadiness {
  department: string;
  label: string;
  overallState: ReadinessState;
  overallScore: number;
  buckets: ReadinessBucket[];
}

// ─── Provenance (for showing data lineage in UI) ─────────────────────────────

export interface Provenance {
  sourceToolId: string;
  sourceToolName: string;
  rawId: string;
  syncedAt: string;
  confidence: number;
}

// Re-export apiFetch for components that import directly from spine-client
const apiFetch = _apiFetch;

/**
 * Generic hook: fetch data with loading/error/refetch state.
 * `fetchFn` is called on mount and whenever deps change.
 */
function useApiFetch<T>(fetchFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchFn());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}

// ─── API Functions (v3.5 routes via Gateway Worker) ──────────────────────────

export const initializeSpine = (params: {
  connectedApps: string[]; userName: string; role: string; orgType?: string; activeCtx?: string;
}) => legacySpine.initialize(params);

export const fetchProjection = <T = any,>(department: string, _tenantId = "t1") =>
  legacySpine.projection(department) as Promise<T>;

export const fetchReadiness = (_tenantId = "t1") =>
  legacySpine.readiness() as Promise<Record<string, DepartmentReadiness>>;

export const fetchEntities = <T = any,>(type: string, _tenantId = "t1") =>
  pipeline.entities({ type }) as Promise<{ type: string; count: number; entities: T[]; provenance: any }>;

export const fetchSpineMetadata = (_tenantId = "t1") =>
  pipeline.schema();

export const addConnector = (connectorId: string, _tenantId = "t1") =>
  connector.connect(connectorId);

// ─── CSM Intelligence API (routed through Pipeline/Workspace BFF) ───────────

export const initializeCSM = (tables: Record<string, any[]>, _tenantId = "t1") =>
  apiFetch("/api/v1/workspace/csm/initialize", { method: "POST", body: { tables } }, "CSM Init");

export const fetchCSMTable = <T = any,>(table: string, _tenantId = "t1") =>
  apiFetch<{ table: string; count: number; data: T[] }>(`/api/v1/workspace/csm/${table}`, {}, `CSM(${table})`);

export const fetchCSMRecord = <T = any,>(table: string, id: string, _tenantId = "t1") =>
  apiFetch<T>(`/api/v1/workspace/csm/${table}/${id}`, {}, `CSM(${table}/${id})`);

export const fetchCSMSchema = (_tenantId = "t1") =>
  apiFetch(`/api/v1/workspace/csm/schema`, {}, "CSM Schema");

// ─── Universal Domain API (routed through Pipeline) ─────────────────────────

export const fetchDomainRegistry = () =>
  apiFetch("/api/v1/pipeline/registry", {}, "Domain Registry");

export const initializeAllDomains = (domains: Record<string, Record<string, any[]>>, _tenantId = "t1") =>
  apiFetch("/api/v1/pipeline/initialize", { method: "POST", body: { domains } }, "Bulk Domain Init");

export const initializeDomain = (domain: string, tables: Record<string, any[]>, _tenantId = "t1") =>
  apiFetch(`/api/v1/pipeline/initialize/${domain}`, { method: "POST", body: { tables } }, `Domain Init(${domain})`);

export const fetchDomainSchema = (domain: string, _tenantId = "t1") =>
  pipeline.schema(domain);

export const fetchDomainTable = <T = any,>(domain: string, table: string, _tenantId = "t1") =>
  pipeline.entities({ type: table }) as Promise<{ domain: string; table: string; count: number; data: T[] }>;

export const fetchDomainRecord = <T = any,>(_domain: string, _table: string, id: string, _tenantId = "t1") =>
  pipeline.entity(id) as Promise<T>;

export const createDomainRecord = (domain: string, table: string, record: Record<string, any>, _tenantId = "t1") =>
  apiFetch(`/api/v1/pipeline/entities`, { method: "POST", body: { ...record, entity_type: table, domain } }, `Create(${domain}/${table})`);

export const updateDomainRecord = (_domain: string, _table: string, id: string, fields: Record<string, any>, _tenantId = "t1") =>
  apiFetch(`/api/v1/pipeline/entity/${id}`, { method: "PUT", body: fields }, `Update(${id})`);

export const deleteDomainRecord = (_domain: string, _table: string, id: string, _tenantId = "t1") =>
  apiFetch(`/api/v1/pipeline/entity/${id}`, { method: "DELETE" }, `Delete(${id})`);

// ─── React Hooks (built on generic useApiFetch) ──────────────────────────────

export function useDomainTable<T = any>(domain: string, table: string) {
  const result = useApiFetch<{ domain: string; table: string; count: number; data: T[] }>(
    () => fetchDomainTable<T>(domain, table), [domain, table]
  );
  return { ...result, data: result.data?.data ?? null };
}

export function useDomainRegistry() {
  return useApiFetch(() => fetchDomainRegistry(), []);
}

export function useSpineProjection<T = any>(department: string) {
  return useApiFetch<T>(() => fetchProjection<T>(department), [department]);
}

export function useSpineReadiness() {
  return useApiFetch(() => fetchReadiness(), []);
}

export function useSpineEntities<T = any>(type: string) {
  const result = useApiFetch<{ type: string; count: number; entities: T[]; provenance: any }>(
    () => fetchEntities<T>(type), [type]
  );
  return { data: result.data?.entities ?? null, provenance: result.data?.provenance ?? null, loading: result.loading, error: result.error, refetch: result.refetch };
}

// ─── Spine Context (global state for spine initialization status) ─────────────

interface SpineContextValue {
  initialized: boolean;
  initializing: boolean;
  connectedApps: string[];
  readiness: Record<string, DepartmentReadiness> | null;
  userName: string;
  role: string;
  initialize: (params: { connectedApps: string[]; userName: string; role: string; orgType?: string; activeCtx?: string }) => Promise<void>;
  addNewConnector: (connectorId: string) => Promise<void>;
  refreshReadiness: () => Promise<void>;
}

const SpineContext = createContext<SpineContextValue>({
  initialized: false,
  initializing: false,
  connectedApps: [],
  readiness: null,
  userName: "User",
  role: "business-ops",
  initialize: async () => {},
  addNewConnector: async () => {},
  refreshReadiness: async () => {},
});

export function useSpine() {
  return useContext(SpineContext);
}

export function SpineProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [readiness, setReadiness] = useState<Record<string, DepartmentReadiness> | null>(null);
  const [userName, setUserName] = useState("User");
  const [role, setRole] = useState("business-ops");

  const initialize = useCallback(async (params: { connectedApps: string[]; userName: string; role: string; orgType?: string; activeCtx?: string }) => {
    setInitializing(true);
    try {
      setConnectedApps(params.connectedApps);
      setUserName(params.userName);
      setRole(params.role);

      // Call the actual Spine initialization API via Gateway Worker
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      if (apiBase) {
        await initializeSpine(params);
        const rd = await fetchReadiness();
        setReadiness(rd);
        console.log("[SpineProvider] Initialized via Gateway Worker");
      } else {
        setReadiness(null);
        console.log("[SpineProvider] Initialized locally (no VITE_API_BASE_URL)");
      }

      setInitialized(true);
    } catch (err) {
      console.error("[SpineProvider] Initialization error:", err);
      // Still mark as initialized so UI doesn't hang — degraded mode
      setInitialized(true);
    } finally {
      setInitializing(false);
    }
  }, []);

  const addNewConnector = useCallback(async (connectorId: string) => {
    setConnectedApps(prev => [...prev, connectorId]);
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (apiBase) {
      try {
        await addConnector(connectorId);
        const rd = await fetchReadiness();
        setReadiness(rd);
      } catch (err) {
        console.error(`[SpineProvider] addConnector(${connectorId}) failed:`, err);
      }
    }
  }, []);

  const refreshReadiness = useCallback(async () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (apiBase) {
      try {
        const rd = await fetchReadiness();
        setReadiness(rd);
      } catch (err) {
        console.error("[SpineProvider] Readiness refresh failed:", err);
      }
    }
  }, []);

  return (
    <SpineContext.Provider value={{ initialized, initializing, connectedApps, readiness, userName, role, initialize, addNewConnector, refreshReadiness }}>
      {children}
    </SpineContext.Provider>
  );
}