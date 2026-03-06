/**
 * useHydrateProjection — Migration Bridge Hook
 *
 * Drop-in replacement for useSpineProjection() that routes through
 * the Hydration Fabric. Returns the same { data, loading, error } shape
 * so components can migrate one at a time without API changes.
 *
 * Migration:
 *   BEFORE:  const { data: projection, loading, error } = useSpineProjection<T>("sales");
 *   AFTER:   const { data: projection, loading, error } = useHydrateProjection<T>("sales");
 *
 * The bridge automatically maps department names to Fabric slot IDs:
 *   "sales"     → "sales.dashboard"
 *   "ops"       → "bizops.dashboard"
 *   "marketing" → "marketing.dashboard"
 *   "website"   → "website.dashboard"
 *   etc.
 */

import { useHydrate } from "./hooks";

// ─── Department → Slot ID Mapping ────────────────────────────────────────────

const DEPARTMENT_SLOT_MAP: Record<string, string> = {
  // Direct mappings (useSpineProjection department → Fabric slot)
  ops: "bizops.dashboard",
  "business-ops": "bizops.dashboard",
  bizops: "bizops.dashboard",
  sales: "sales.dashboard",
  salesops: "sales.dashboard",    // salesops reads from sales projection
  "sales-ops": "sales.dashboard",
  marketing: "marketing.dashboard",
  website: "website.dashboard",   // website has its own projection endpoint
  cs: "customer_success.dashboard",
  "customer-success": "customer_success.dashboard",
  "customer_success": "customer_success.dashboard",
  revops: "revops.dashboard",
  "rev-ops": "revops.dashboard",
  finance: "finance.dashboard",
  service: "service.dashboard",
  procurement: "procurement.dashboard",
  it: "it_admin.dashboard",
  "it-admin": "it_admin.dashboard",
  it_admin: "it_admin.dashboard",
  education: "student_teacher.dashboard",
  "student-teacher": "student_teacher.dashboard",
  student_teacher: "student_teacher.dashboard",
  personal: "personal.dashboard",
  product: "product_engineering.dashboard",
  "product-engineering": "product_engineering.dashboard",
  product_engineering: "product_engineering.dashboard",
};

/**
 * Resolves a department string to a Fabric slot ID.
 * Falls back to `{department}.dashboard` if no explicit mapping exists.
 */
function resolveSlotId(department: string): string {
  const normalized = department.toLowerCase().trim();
  return DEPARTMENT_SLOT_MAP[normalized] || `${normalized}.dashboard`;
}

// ─── Bridge Hook ─────────────────────────────────────────────────────────────

export interface HydrateProjectionResult<T> {
  /** The projection data (null while loading) */
  data: T | null;
  /** True while the initial fetch is in progress */
  loading: boolean;
  /** Error message if the fetch failed */
  error: string | null;
  /** Refetch the projection data */
  refetch: () => void;
  /** Which provider delivered this data */
  source: string | null;
}

/**
 * Drop-in replacement for useSpineProjection().
 *
 * @param department  The department/domain name (e.g. "sales", "ops", "marketing")
 * @returns           { data, loading, error, refetch, source }
 */
export function useHydrateProjection<T = any>(
  department: string
): HydrateProjectionResult<T> {
  const slotId = resolveSlotId(department);

  const {
    data,
    phase,
    error,
    refetch,
    provenance,
    isLoading,
  } = useHydrate<T>(slotId);

  return {
    data: data ?? null,
    loading: isLoading || phase === "idle",
    error,
    refetch,
    source: provenance?.provider ?? null,
  };
}

/**
 * Bridge for entity-level data (replaces useDomainTable).
 *
 * @param domain  Domain name (e.g. "sales", "customer_success")
 * @param table   Entity table (e.g. "accounts", "contacts", "deals")
 * @returns       { data, loading, error, refetch, source }
 */
export function useHydrateDomainTable<T = any>(
  domain: string,
  table: string
): HydrateProjectionResult<T> {
  const slotId = `${domain.toLowerCase()}.${table.toLowerCase()}`;

  const {
    data,
    phase,
    error,
    refetch,
    provenance,
    isLoading,
  } = useHydrate<T>(slotId);

  return {
    data: data ?? null,
    loading: isLoading || phase === "idle",
    error,
    refetch,
    source: provenance?.provider ?? null,
  };
}