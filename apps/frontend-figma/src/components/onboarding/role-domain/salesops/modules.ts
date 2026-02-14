/**
 * Sales Operations — Role-Domain Module Registry
 * 
 * COMBINED from:
 *   - /components/sales/ (7 files: activities, contacts, dashboard, deals, forecasting, pipeline, quotes)
 *   - /components/domains/salesops/ (3 files: dashboard, salesops-views, shell)
 * 
 * Folder: /components/onboarding/role-domain/salesops/
 * Domain: SALES
 */

// ─── Core Sales Views (from /components/sales/) ─────────────────────────────
export const dashboard = () => import("../../../sales/dashboard");
export const pipeline = () => import("../../../sales/pipeline");
export const deals = () => import("../../../sales/deals");
export const contacts = () => import("../../../sales/contacts");
export const activities = () => import("../../../sales/activities");
export const forecasting = () => import("../../../sales/forecasting");
export const quotes = () => import("../../../sales/quotes");

// ─── SalesOps Domain Views (from /components/domains/salesops/) ─────────────
export const salesopsDashboard = () => import("../../../domains/salesops/dashboard");
export const salesopsViews = () => import("../../../domains/salesops/salesops-views");
export const salesopsShell = () => import("../../../domains/salesops/shell");
