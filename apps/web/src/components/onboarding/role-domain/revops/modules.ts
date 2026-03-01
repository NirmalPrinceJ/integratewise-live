/**
 * Revenue Operations — Role-Domain Module Registry
 * 
 * Folder: /components/onboarding/role-domain/revops/
 * Domain: REVOPS
 */

// ─── Core RevOps Views ──────────────────────────────────────────────────────
export const dashboard = () => import("../../../domains/revops/dashboard");
export const revopsViews = () => import("../../../domains/revops/revops-views");
export const shell = () => import("../../../domains/revops/shell");
