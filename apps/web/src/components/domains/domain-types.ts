/**
 * Domain Types — Each domain is a completely independent workspace.
 *
 * Domains are projections of the same Spine SSOT, but with
 * different sidebar nav, dashboards, and views per team context.
 */

export type DomainId =
  | "integratewise-apac"
  | "personal"
  | "account-success"
  | "revops"
  | "salesops"
  | "sales"
  | "marketing"
  | "finance"
  | "service"
  | "product-engineering"
  | "procurement"
  | "it-admin"
  | "bizops";

export interface DomainConfig {
  id: DomainId;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  gradient: string;
  accentColor: string;
  spineProjection: string; // which Spine projection to use
  suggestedConnectors: string[];
  defaultRole: string;
}

export const domainConfigs: Record<DomainId, DomainConfig> = {
  "integratewise-apac": {
    id: "integratewise-apac",
    label: "IntegrateWise APAC",
    shortLabel: "IW Console",
    description:
      "Full platform console — manage integrations, workflows, users, and all modules across your organization",
    icon: "🌏",
    gradient: "from-blue-500 to-indigo-600",
    accentColor: "var(--iw-blue)",
    spineProjection: "bizops",
    suggestedConnectors: ["salesforce", "slack", "jira", "stripe", "google-workspace"],
    defaultRole: "admin",
  },
  personal: {
    id: "personal",
    label: "Personal Workspace",
    shortLabel: "Personal",
    description:
      "Your individual productivity hub — tasks, calendar, notes, goals, and personal knowledge base",
    icon: "👤",
    gradient: "from-violet-500 to-purple-600",
    accentColor: "var(--iw-purple)",
    spineProjection: "bizops",
    suggestedConnectors: ["google-workspace", "slack", "calendly", "github"],
    defaultRole: "developer",
  },
  "account-success": {
    id: "account-success",
    label: "Account Success",
    shortLabel: "CS",
    description:
      "Customer health monitoring — account health scores, renewals, ticket tracking, and risk management",
    icon: "💚",
    gradient: "from-emerald-500 to-green-600",
    accentColor: "var(--iw-success)",
    spineProjection: "bizops",
    suggestedConnectors: ["salesforce", "zendesk", "intercom", "slack", "hubspot"],
    defaultRole: "business-ops",
  },
  revops: {
    id: "revops",
    label: "Revenue Operations",
    shortLabel: "RevOps",
    description:
      "Revenue intelligence — pipeline visibility, forecasting, quota tracking, and revenue analytics across the org",
    icon: "📈",
    gradient: "from-cyan-500 to-blue-600",
    accentColor: "var(--iw-blue)",
    spineProjection: "sales",
    suggestedConnectors: ["salesforce", "hubspot", "stripe", "quickbooks", "linkedin"],
    defaultRole: "business-ops",
  },
  salesops: {
    id: "salesops",
    label: "Sales Operations",
    shortLabel: "SalesOps",
    description:
      "Sales execution hub — pipeline management, deal rooms, activity tracking, lead management, and rep performance",
    icon: "🎯",
    gradient: "from-green-500 to-emerald-600",
    accentColor: "var(--iw-sales)",
    spineProjection: "sales",
    suggestedConnectors: ["salesforce", "linkedin", "calendly", "slack", "hubspot"],
    defaultRole: "sales",
  },
  sales: {
    id: "sales",
    label: "Sales",
    shortLabel: "Sales",
    description:
      "Sales execution — pipeline visibility, deal management, forecasting, and win rate tracking",
    icon: "🎯",
    gradient: "from-sky-500 to-blue-600",
    accentColor: "#0EA5E9",
    spineProjection: "sales",
    suggestedConnectors: ["salesforce", "hubspot", "linkedin", "calendly"],
    defaultRole: "sales",
  },
  marketing: {
    id: "marketing",
    label: "Marketing",
    shortLabel: "Marketing",
    description:
      "Campaign management, lead generation, content, and attribution tracking",
    icon: "📣",
    gradient: "from-pink-500 to-rose-600",
    accentColor: "#EC4899",
    spineProjection: "marketing",
    suggestedConnectors: ["marketo", "mailchimp", "hubspot", "slack"],
    defaultRole: "marketing",
  },
  finance: {
    id: "finance",
    label: "Finance",
    shortLabel: "Finance",
    description:
      "Revenue tracking, expense management, forecasting, and financial reporting",
    icon: "💰",
    gradient: "from-teal-500 to-cyan-600",
    accentColor: "#14B8A6",
    spineProjection: "finance",
    suggestedConnectors: ["quickbooks", "stripe", "xero", "netsuite"],
    defaultRole: "finance",
  },
  service: {
    id: "service",
    label: "Customer Service",
    shortLabel: "Service",
    description:
      "Ticket management, CSAT tracking, knowledge base, and support analytics",
    icon: "🎧",
    gradient: "from-amber-500 to-orange-600",
    accentColor: "#F59E0B",
    spineProjection: "service",
    suggestedConnectors: ["zendesk", "intercom", "freshdesk", "slack"],
    defaultRole: "support",
  },
  "product-engineering": {
    id: "product-engineering",
    label: "Product & Engineering",
    shortLabel: "Product",
    description:
      "Product roadmap, feature tracking, bug management, sprint planning, and deployment tracking",
    icon: "💻",
    gradient: "from-indigo-500 to-purple-600",
    accentColor: "#6366F1",
    spineProjection: "engineering",
    suggestedConnectors: ["jira", "linear", "github", "asana"],
    defaultRole: "engineering",
  },
  procurement: {
    id: "procurement",
    label: "Procurement",
    shortLabel: "Procurement",
    description:
      "Vendor management, purchase orders, contract tracking, and spend analysis",
    icon: "🛒",
    gradient: "from-lime-500 to-green-600",
    accentColor: "#84CC16",
    spineProjection: "procurement",
    suggestedConnectors: ["coupa", "ariba", "sap", "workday"],
    defaultRole: "procurement",
  },
  "it-admin": {
    id: "it-admin",
    label: "IT & Admin",
    shortLabel: "IT & Admin",
    description:
      "User management, security, integrations, compliance, and infrastructure monitoring",
    icon: "🔧",
    gradient: "from-slate-500 to-gray-600",
    accentColor: "#64748B",
    spineProjection: "it-admin",
    suggestedConnectors: ["okta", "azure-ad", "datadog", "splunk"],
    defaultRole: "admin",
  },
  bizops: {
    id: "bizops",
    label: "Business Operations",
    shortLabel: "BizOps",
    description:
      "Project management, workflow automation, analytics, and cross-functional collaboration",
    icon: "🌏",
    gradient: "from-slate-900 to-slate-700",
    accentColor: "#0C1222",
    spineProjection: "bizops",
    suggestedConnectors: ["asana", "monday", "airtable", "notion"],
    defaultRole: "operations",
  },
};

export const domainOrder: DomainId[] = [
  "integratewise-apac",
  "personal",
  "account-success",
  "sales",
  "marketing",
  "finance",
  "service",
  "product-engineering",
  "procurement",
  "it-admin",
  "bizops",
  "revops",
  "salesops",
];

export interface DomainNavItem {
  id: string;
  label: string;
  icon: string; // lucide icon name or emoji
  badge?: string;
}
