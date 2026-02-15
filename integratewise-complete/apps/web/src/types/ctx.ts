/**
 * CTX (Context) Types — Domain-aware navigation
 * Ported from Figma Design spine/types.ts
 * 
 * CTX defines the user's active domain context (CS, Sales, BizOps, etc.)
 * Each CTX maps to a specific set of L1 modules shown in the sidebar.
 */

export type CTXEnum =
  | "CTX_CS"
  | "CTX_SALES"
  | "CTX_SUPPORT"
  | "CTX_PM"
  | "CTX_MARKETING"
  | "CTX_BIZOPS"
  | "CTX_TECH"
  | "CTX_HR"
  | "CTX_FINANCE"
  | "CTX_LEGAL";

export type L1Module =
  | "Home"
  | "Projects"
  | "Accounts"
  | "Contacts"
  | "Meetings"
  | "Docs"
  | "Tasks"
  | "Calendar"
  | "Notes"
  | "Knowledge Space"
  | "Team"
  | "Pipeline"
  | "Risks"
  | "Expansion"
  | "Analytics"
  | "Success Plans"
  | "Activities"
  | "Quotes"
  | "Deals"
  | "Forecasting"
  | "Email Studio"
  | "Forms"
  | "Social"
  | "Attribution"
  | "RevOps"
  | "Quota"
  | "Website";

export type L2Component =
  | "SpineUI"
  | "ContextUI"
  | "KnowledgeUI"
  | "Evidence Drawer"
  | "Signals"
  | "Think"
  | "Act"
  | "HITL"
  | "Govern"
  | "Adjust"
  | "Repeat"
  | "Audit Trail"
  | "Agent Config"
  | "Digital Twin";

/** Which L1 modules are available for each CTX */
export const CTX_MODULES: Record<CTXEnum, L1Module[]> = {
  CTX_CS: ["Home", "Accounts", "Contacts", "Meetings", "Docs", "Tasks", "Calendar", "Risks", "Success Plans", "Expansion", "Analytics"],
  CTX_SALES: ["Home", "Pipeline", "Deals", "Accounts", "Contacts", "Activities", "Quotes", "Meetings", "Tasks", "Calendar", "Forecasting", "Analytics"],
  CTX_SUPPORT: ["Home", "Accounts", "Contacts", "Tasks", "Calendar", "Knowledge Space", "Analytics"],
  CTX_PM: ["Home", "Projects", "Tasks", "Docs", "Meetings", "Calendar", "Knowledge Space", "Analytics"],
  CTX_MARKETING: ["Home", "Email Studio", "Forms", "Social", "Attribution", "Analytics", "Contacts", "Docs"],
  CTX_BIZOPS: ["Home", "RevOps", "Projects", "Accounts", "Contacts", "Meetings", "Docs", "Tasks", "Calendar", "Notes", "Knowledge Space", "Team", "Pipeline", "Quota", "Forecasting", "Analytics"],
  CTX_TECH: ["Home", "Projects", "Tasks", "Docs", "Knowledge Space", "Analytics", "Website"],
  CTX_HR: ["Home", "Team", "Tasks", "Docs", "Meetings", "Analytics"],
  CTX_FINANCE: ["Home", "Accounts", "Docs", "Analytics"],
  CTX_LEGAL: ["Home", "Docs", "Tasks", "Analytics"],
};

/** Display configuration for each CTX */
export const CTX_CONFIG: Record<CTXEnum, { label: string; icon: string; color: string }> = {
  CTX_CS: { label: "Customer Success", icon: "💚", color: "bg-emerald-500" },
  CTX_SALES: { label: "Sales Operations", icon: "🎯", color: "bg-blue-500" },
  CTX_SUPPORT: { label: "Customer Support", icon: "🎧", color: "bg-cyan-500" },
  CTX_PM: { label: "Project Management", icon: "📁", color: "bg-purple-500" },
  CTX_MARKETING: { label: "Marketing", icon: "📣", color: "bg-pink-500" },
  CTX_BIZOPS: { label: "Business Operations", icon: "🌏", color: "bg-indigo-500" },
  CTX_TECH: { label: "Engineering", icon: "💻", color: "bg-slate-500" },
  CTX_HR: { label: "People & Culture", icon: "👥", color: "bg-orange-500" },
  CTX_FINANCE: { label: "Finance", icon: "💰", color: "bg-green-600" },
  CTX_LEGAL: { label: "Legal", icon: "⚖️", color: "bg-slate-700" },
};

/** Map L1 modules to their Next.js route paths */
export const MODULE_ROUTES: Record<L1Module, string> = {
  Home: "/today",
  Projects: "/projects",
  Accounts: "/accounts",
  Contacts: "/sales/contacts",
  Meetings: "/personal/meetings",
  Docs: "/knowledge",
  Tasks: "/tasks",
  Calendar: "/personal/calendar",
  Notes: "/personal/notes",
  "Knowledge Space": "/knowledge",
  Team: "/people",
  Pipeline: "/sales/pipeline",
  Deals: "/sales/deals",
  Risks: "/cs/risks",
  "Success Plans": "/cs/success-plans",
  Expansion: "/cs/expansion",
  Activities: "/sales/activities",
  Quotes: "/sales/quotes",
  Forecasting: "/revops/forecasting",
  "Email Studio": "/marketing/email-studio",
  Forms: "/marketing/forms",
  Social: "/marketing/social",
  Attribution: "/marketing/attribution",
  RevOps: "/revops",
  Quota: "/revops/quota",
  Website: "/website",
  Analytics: "/analytics",
};
