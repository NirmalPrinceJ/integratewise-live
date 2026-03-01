/**
 * Account Success / Customer Success — Role-Domain Module Registry
 * 
 * Maps module IDs to lazy-loadable component imports.
 * All components originate from the account-success domain vertical.
 * 
 * Folder: /components/onboarding/role-domain/account-success/
 * Domain: CUSTOMER_SUCCESS
 */

// ─── Core Views ─────────────────────────────────────────────────────────────
export const dashboard = () => import("../../../domains/account-success/dashboard");
export const accounts = () => import("../../../domains/account-success/accounts-view");
export const contacts = () => import("../../../domains/account-success/contacts-view");
export const meetings = () => import("../../../domains/account-success/meetings-view");
export const tasks = () => import("../../../domains/account-success/tasks-view");
export const documents = () => import("../../../domains/account-success/documents-view");
export const projects = () => import("../../../domains/account-success/projects-view");

// ─── Deep Intelligence Views ────────────────────────────────────────────────
export const healthScores = () => import("../../../domains/account-success/views/platform-health-view");
export const engagementLog = () => import("../../../domains/account-success/views/engagement-log-view");
export const valueStreams = () => import("../../../domains/account-success/views/value-streams-view");
export const successPlans = () => import("../../../domains/account-success/views/success-plans-view");
export const riskRegister = () => import("../../../domains/account-success/views/risk-register-view");
export const accountMaster = () => import("../../../domains/account-success/views/account-master-view");
export const apiPortfolio = () => import("../../../domains/account-success/views/api-portfolio-view");
export const businessContext = () => import("../../../domains/account-success/views/business-context-view");
export const capabilities = () => import("../../../domains/account-success/views/capabilities-view");
export const companyGrowth = () => import("../../../domains/account-success/views/company-growth-view");
export const initiatives = () => import("../../../domains/account-success/views/initiatives-view");
export const insights = () => import("../../../domains/account-success/views/insights-view");
export const peopleTeam = () => import("../../../domains/account-success/views/people-team-view");
export const productClient = () => import("../../../domains/account-success/views/product-client-view");
export const stakeholderOutcomes = () => import("../../../domains/account-success/views/stakeholder-outcomes-view");
export const strategicObjectives = () => import("../../../domains/account-success/views/strategic-objectives-view");
export const taskManager = () => import("../../../domains/account-success/views/task-manager-view");

// ─── Shell & Support ────────────────────────────────────────────────────────
export const shell = () => import("../../../domains/account-success/shell");
export const intelligenceOverlay = () => import("../../../domains/account-success/intelligence-overlay");
