/**
 * Business Operations — Role-Domain Module Registry
 * 
 * Generic operations modules used as fallback for domains without
 * custom components (Finance, Service, Procurement, IT, Education, BizOps).
 * 
 * Folder: /components/onboarding/role-domain/business-ops/
 * Domain: BIZOPS (+ fallback for FINANCE, SERVICE, PROCUREMENT, IT_ADMIN, STUDENT_TEACHER, PRODUCT_ENGINEERING)
 */

// ─── Core Views ─────────────────────────────────────────────────────────────
export const dashboard = () => import("../../../business-ops/dashboard");
export const accounts = () => import("../../../business-ops/accounts");
export const tasks = () => import("../../../business-ops/tasks");
export const workflows = () => import("../../../business-ops/workflows");
export const documents = () => import("../../../business-ops/documents");
export const analyticsView = () => import("../../../business-ops/analytics-view");
export const calendarView = () => import("../../../business-ops/calendar-view");
export const integrations = () => import("../../../business-ops/integrations");
export const workflowCanvas = () => import("../../../business-ops/workflow-canvas");

// ─── Admin / IT Views (used by IT_ADMIN domain) ────────────────────────────
export const userManagement = () => import("../../../admin/user-management");
export const rbacManager = () => import("../../../admin/rbac-manager");
export const approvalWorkflows = () => import("../../../admin/approval-workflows");
export const integrationsHub = () => import("../../../integrations-hub");

// ─── Personal / Workspace Views (used by PERSONAL domain) ───────────────────
export const personalDashboard = () => import("../../../domains/personal/dashboard");
export const documentStorage = () => import("../../../document-storage/document-storage");

// ─── Hydration Fabric Admin (system-wide) ───────────────────────────────────
export const fabricAdmin = () => import("../../../hydration/fabric-admin-panel");