/**
 * Spine Client — Frontend SSOT Consumer
 *
 * All L1 workspace pages read data exclusively through this client.
 * Tool-specific schemas never leak to UI. Everything speaks Spine language.
 *
 * Flow: L1 Component → useSpineProjection() → Spine API → KV (SSOT) → Projection
 */

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e3b03387`;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
};

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

// ─── Generic API Helpers ─────────────────────────────────────────────────────

async function apiFetch<T = any>(
  path: string,
  options?: { method?: string; body?: any },
  label = "API"
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: options?.method || "GET",
    headers,
    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error(`[SpineClient] ${label} failed:`, err);
    throw new Error(err.error || `${label} failed`);
  }
  return res.json();
}

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

// ─── API Functions ───────────────────────────────────────────────────────────

export const initializeSpine = (params: {
  connectedApps: string[]; userName: string; role: string; orgType?: string; activeCtx?: string;
}) => apiFetch("/spine/initialize", { method: "POST", body: params }, "Initialize");

export const fetchProjection = <T = any,>(department: string, tenantId = "t1") =>
  apiFetch<T>(`/spine/projection/${department}?tenantId=${tenantId}`, undefined, `Projection(${department})`);

export const fetchReadiness = (tenantId = "t1") =>
  apiFetch<Record<string, DepartmentReadiness>>(`/spine/readiness?tenantId=${tenantId}`, undefined, "Readiness");

export const fetchEntities = <T = any,>(type: string, tenantId = "t1") =>
  apiFetch<{ type: string; count: number; entities: T[]; provenance: any }>(
    `/spine/entities/${type}?tenantId=${tenantId}`, undefined, `Entities(${type})`
  );

export const fetchSpineMetadata = (tenantId = "t1") =>
  apiFetch(`/spine/metadata?tenantId=${tenantId}`, undefined, "Metadata");

export const addConnector = (connectorId: string, tenantId = "t1") =>
  apiFetch(`/spine/connector/add`, { method: "POST", body: { connectorId, tenantId } }, `AddConnector(${connectorId})`);

// ─── CSM Intelligence API ───────────────────────────────────────────────────

export const initializeCSM = (tables: Record<string, any[]>, tenantId = "t1") =>
  apiFetch("/csm/initialize", { method: "POST", body: { tenantId, tables } }, "CSM Init");

export const fetchCSMTable = <T = any,>(table: string, tenantId = "t1") =>
  apiFetch<{ table: string; count: number; data: T[] }>(`/csm/${table}?tenantId=${tenantId}`, undefined, `CSM(${table})`);

export const fetchCSMRecord = <T = any,>(table: string, id: string, tenantId = "t1") =>
  apiFetch<T>(`/csm/${table}/${id}?tenantId=${tenantId}`, undefined, `CSM(${table}/${id})`);

export const fetchCSMSchema = (tenantId = "t1") =>
  apiFetch(`/csm/schema?tenantId=${tenantId}`, undefined, "CSM Schema");

// ─── Universal Domain API ───────────────────────────────────────────────────

export const fetchDomainRegistry = () =>
  apiFetch("/domain/registry", undefined, "Domain Registry");

export const initializeAllDomains = (domains: Record<string, Record<string, any[]>>, tenantId = "t1") =>
  apiFetch("/domain/initialize-all", { method: "POST", body: { tenantId, domains } }, "Bulk Domain Init");

export const initializeDomain = (domain: string, tables: Record<string, any[]>, tenantId = "t1") =>
  apiFetch(`/domain/${domain}/initialize`, { method: "POST", body: { tenantId, tables } }, `Domain Init(${domain})`);

export const fetchDomainSchema = (domain: string, tenantId = "t1") =>
  apiFetch(`/domain/${domain}/schema?tenantId=${tenantId}`, undefined, `Domain Schema(${domain})`);

export const fetchDomainTable = <T = any,>(domain: string, table: string, tenantId = "t1") =>
  apiFetch<{ domain: string; table: string; count: number; data: T[] }>(
    `/domain/${domain}/${table}?tenantId=${tenantId}`, undefined, `Domain(${domain}/${table})`
  );

export const fetchDomainRecord = <T = any,>(domain: string, table: string, id: string, tenantId = "t1") =>
  apiFetch<T>(`/domain/${domain}/${table}/${id}?tenantId=${tenantId}`, undefined, `Domain(${domain}/${table}/${id})`);

export const createDomainRecord = (domain: string, table: string, record: Record<string, any>, tenantId = "t1") =>
  apiFetch(`/domain/${domain}/${table}?tenantId=${tenantId}`, { method: "POST", body: record }, `Create(${domain}/${table})`);

export const updateDomainRecord = (domain: string, table: string, id: string, fields: Record<string, any>, tenantId = "t1") =>
  apiFetch(`/domain/${domain}/${table}/${id}?tenantId=${tenantId}`, { method: "PUT", body: fields }, `Update(${domain}/${table}/${id})`);

export const deleteDomainRecord = (domain: string, table: string, id: string, tenantId = "t1") =>
  apiFetch(`/domain/${domain}/${table}/${id}?tenantId=${tenantId}`, { method: "DELETE" }, `Delete(${domain}/${table}/${id})`);

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
      const result = await initializeSpine(params);
      setConnectedApps(params.connectedApps);
      setUserName(params.userName);
      setRole(params.role);
      setReadiness(result.readiness);
      setInitialized(true);
      console.log("[SpineProvider] SSOT initialized successfully", result.entityCounts);
    } catch (err) {
      console.error("[SpineProvider] Initialization failed:", err);
      // Still mark as initialized so the app doesn't hang — data just won't be there
      setConnectedApps(params.connectedApps);
      setUserName(params.userName);
      setRole(params.role);
      setInitialized(true);
    } finally {
      setInitializing(false);
    }
  }, []);

  const addNewConnector = useCallback(async (connectorId: string) => {
    try {
      const result = await addConnector(connectorId);
      setConnectedApps(prev => [...prev, connectorId]);
      setReadiness(result.readiness);
      console.log(`[SpineProvider] Connector ${connectorId} added, SSOT re-normalized`);
    } catch (err) {
      console.error(`[SpineProvider] Failed to add connector ${connectorId}:`, err);
    }
  }, []);

  const refreshReadiness = useCallback(async () => {
    try {
      const result = await fetchReadiness();
      setReadiness(result);
    } catch (err) {
      console.error("[SpineProvider] Failed to refresh readiness:", err);
    }
  }, []);

  return (
    <SpineContext.Provider value={{ initialized, initializing, connectedApps, readiness, userName, role, initialize, addNewConnector, refreshReadiness }}>
      {children}
    </SpineContext.Provider>
  );
}