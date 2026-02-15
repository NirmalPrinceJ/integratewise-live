/**
 * Marketing — Role-Domain Module Registry
 * 
 * Folder: /components/onboarding/role-domain/marketing/
 * Domain: MARKETING
 */

// ─── Core Marketing Views ───────────────────────────────────────────────────
export const dashboard = () => import("../../../marketing/dashboard");
export const campaigns = () => import("../../../marketing/campaigns");
export const attribution = () => import("../../../marketing/attribution");
export const emailStudio = () => import("../../../marketing/email-studio");
export const forms = () => import("../../../marketing/forms");
export const social = () => import("../../../marketing/social");

// ─── Website/CMS Views ──────────────────────────────────────────────────────
export const blog = () => import("../../../website/blog");
export const websiteDashboard = () => import("../../../website/dashboard");
export const media = () => import("../../../website/media");
export const pages = () => import("../../../website/pages");
export const seo = () => import("../../../website/seo");
export const theme = () => import("../../../website/theme");