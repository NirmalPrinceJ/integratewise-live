import type { EntitlementTier } from "@/config/os-shell-registry"

export interface PlanTier {
  id: EntitlementTier
  name: string
  tagline: string
  priceMonthly: number | null  // null = "Custom"
  priceAnnual: number | null
  limits: {
    users: number | null        // null = unlimited
    integrations: number | null
    aiSessions: number | null
    storageGb: number | null
    retentionDays: number | null
  }
  features: Record<string, boolean | string>
  stripePriceIdMonthly?: string
  stripePriceIdAnnual?: string
  highlighted?: boolean
}

/**
 * Single-source-of-truth for all plan tiers.
 * Drives pricing page, upgrade prompts, and feature comparison.
 */
export const PLAN_TIERS: PlanTier[] = [
  {
    id: "personal",
    name: "Personal",
    tagline: "For individuals getting started",
    priceMonthly: 0,
    priceAnnual: 0,
    limits: {
      users: 1,
      integrations: 3,
      aiSessions: 1000,
      storageGb: 5,
      retentionDays: 7,
    },
    features: {
      // Worlds
      "worlds.personal": true,
      "worlds.work": false,
      "worlds.accounts": false,
      // Surfaces
      "surfaces.spine": false,
      "surfaces.context": false,
      "surfaces.knowledge.team": false,
      "surfaces.iq_hub": false,
      "surfaces.actions": false,
      "surfaces.audit": false,
      // AI
      "ai.chat": true,
      "ai.situation_detection": false,
      "ai.action_proposals": false,
      "ai.auto_execution": false,
      "ai.summarization": "basic",
      "ai.root_cause": false,
      "ai.impact_prediction": false,
      // Governance
      "governance.basic_approvals": false,
      "governance.workflows": false,
      "governance.risk_scoring": false,
      "governance.separation_of_duties": false,
      "compliance.frameworks": false,
      // Admin
      "admin.user_management": false,
      "admin.role_preset": false,
      "admin.custom_roles": false,
      "admin.department_permissions": false,
      "admin.sso": false,
      "admin.scim": false,
      // Integrations
      "integrations.standard": true,
      "integrations.premium": false,
      "integrations.custom": false,
      "integrations.webhooks": false,
      "integrations.api": false,
    },
  },
  {
    id: "team",
    name: "Team",
    tagline: "For growing teams that need collaboration",
    priceMonthly: 39,
    priceAnnual: 29,
    limits: {
      users: 25,
      integrations: 15,
      aiSessions: 10000,
      storageGb: 50,
      retentionDays: 30,
    },
    features: {
      // Worlds
      "worlds.personal": true,
      "worlds.work": true,
      "worlds.accounts": false,
      // Surfaces
      "surfaces.spine": true,
      "surfaces.context": true,
      "surfaces.knowledge.team": true,
      "surfaces.iq_hub": false,
      "surfaces.actions": true,
      "surfaces.audit": true,
      // AI
      "ai.chat": true,
      "ai.situation_detection": true,
      "ai.action_proposals": true,
      "ai.auto_execution": false,
      "ai.summarization": true,
      "ai.root_cause": "basic",
      "ai.impact_prediction": false,
      // Governance
      "governance.basic_approvals": true,
      "governance.workflows": false,
      "governance.risk_scoring": false,
      "governance.separation_of_duties": false,
      "compliance.frameworks": false,
      // Admin
      "admin.user_management": true,
      "admin.role_preset": true,
      "admin.custom_roles": false,
      "admin.department_permissions": false,
      "admin.sso": false,
      "admin.scim": false,
      // Integrations
      "integrations.standard": true,
      "integrations.premium": true,
      "integrations.webhooks": true,
      "integrations.custom": false,
      "integrations.api": false,
    },
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_MONTHLY,
    stripePriceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_ANNUAL,
  },
  {
    id: "org",
    name: "Organization",
    tagline: "For scaling organizations with advanced needs",
    priceMonthly: 99,
    priceAnnual: 79,
    limits: {
      users: 250,
      integrations: null, // unlimited
      aiSessions: 50000,
      storageGb: 500,
      retentionDays: 90,
    },
    features: {
      // Worlds
      "worlds.personal": true,
      "worlds.work": true,
      "worlds.accounts": true,
      // Surfaces
      "surfaces.spine": true,
      "surfaces.context": true,
      "surfaces.knowledge.team": true,
      "surfaces.iq_hub": true,
      "surfaces.actions": true,
      "surfaces.audit": true,
      // AI
      "ai.chat": true,
      "ai.situation_detection": true,
      "ai.action_proposals": true,
      "ai.auto_execution": "governed",
      "ai.summarization": true,
      "ai.root_cause": true,
      "ai.impact_prediction": true,
      // Governance
      "governance.basic_approvals": true,
      "governance.workflows": true,
      "governance.risk_scoring": true,
      "governance.separation_of_duties": false,
      "compliance.frameworks": false,
      // Admin
      "admin.user_management": true,
      "admin.role_preset": true,
      "admin.custom_roles": true,
      "admin.department_permissions": true,
      "admin.sso": true,
      "admin.scim": false,
      // Integrations
      "integrations.standard": true,
      "integrations.premium": true,
      "integrations.webhooks": true,
      "integrations.custom": true,
      "integrations.api": true,
    },
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ORG_MONTHLY,
    stripePriceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ORG_ANNUAL,
    highlighted: true, // "Most Popular"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Custom solutions for large organizations",
    priceMonthly: null, // Custom
    priceAnnual: null,
    limits: {
      users: null, // unlimited
      integrations: null,
      aiSessions: null,
      storageGb: null,
      retentionDays: null,
    },
    features: {
      // Worlds
      "worlds.personal": true,
      "worlds.work": true,
      "worlds.accounts": true,
      // Surfaces
      "surfaces.spine": true,
      "surfaces.context": true,
      "surfaces.knowledge.team": true,
      "surfaces.iq_hub": true,
      "surfaces.actions": true,
      "surfaces.audit": true,
      // AI
      "ai.chat": true,
      "ai.situation_detection": true,
      "ai.action_proposals": true,
      "ai.auto_execution": true,
      "ai.summarization": true,
      "ai.root_cause": true,
      "ai.impact_prediction": true,
      // Governance
      "governance.basic_approvals": true,
      "governance.workflows": true,
      "governance.risk_scoring": true,
      "governance.separation_of_duties": true,
      "compliance.frameworks": true,
      // Admin
      "admin.user_management": true,
      "admin.role_preset": true,
      "admin.custom_roles": true,
      "admin.department_permissions": true,
      "admin.sso": true,
      "admin.scim": true,
      // Integrations
      "integrations.standard": true,
      "integrations.premium": true,
      "integrations.webhooks": true,
      "integrations.custom": true,
      "integrations.api": true,
    },
  },
]

/**
 * Get a plan tier by ID
 */
export function getPlanTier(planId: EntitlementTier): PlanTier | undefined {
  return PLAN_TIERS.find((p) => p.id === planId)
}

/**
 * Get the next plan tier (for upgrade prompts)
 */
export function getNextPlanTier(currentPlan: EntitlementTier): PlanTier | undefined {
  const currentIndex = PLAN_TIERS.findIndex((p) => p.id === currentPlan)
  if (currentIndex === -1 || currentIndex >= PLAN_TIERS.length - 1) return undefined
  return PLAN_TIERS[currentIndex + 1]
}

/**
 * Feature descriptions for display
 */
export const FEATURE_DESCRIPTIONS: Record<string, string> = {
  "worlds.personal": "Personal workspace",
  "worlds.work": "Work world with team views",
  "worlds.accounts": "Accounts world with CRM views",
  "surfaces.spine": "Spine view (account timeline)",
  "surfaces.context": "Context view (360° account view)",
  "surfaces.knowledge.team": "Team knowledge base",
  "surfaces.iq_hub": "IQ Hub AI assistant",
  "surfaces.actions": "Actions & workflows",
  "surfaces.audit": "Audit logs",
  "ai.chat": "AI chat",
  "ai.situation_detection": "AI situation detection",
  "ai.action_proposals": "AI action proposals",
  "ai.auto_execution": "AI auto-execution",
  "ai.summarization": "AI summarization",
  "ai.root_cause": "Root cause analysis",
  "ai.impact_prediction": "Impact prediction",
  "governance.basic_approvals": "Basic approvals",
  "governance.workflows": "Advanced workflows",
  "governance.risk_scoring": "Risk scoring",
  "governance.separation_of_duties": "Separation of duties",
  "compliance.frameworks": "Compliance frameworks (SOC2, HIPAA, GDPR)",
  "admin.user_management": "User management",
  "admin.role_preset": "Role presets",
  "admin.custom_roles": "Custom roles",
  "admin.department_permissions": "Department permissions",
  "admin.sso": "SSO/SAML",
  "admin.scim": "SCIM provisioning",
  "integrations.standard": "Standard integrations",
  "integrations.premium": "Premium integrations",
  "integrations.webhooks": "Webhooks",
  "integrations.custom": "Custom integrations",
  "integrations.api": "API access",
}

/**
 * Feature categories for grouping in comparison table
 */
export const FEATURE_CATEGORIES = [
  { key: "worlds", label: "Worlds", features: ["worlds.personal", "worlds.work", "worlds.accounts"] },
  { key: "surfaces", label: "Surfaces", features: ["surfaces.spine", "surfaces.context", "surfaces.knowledge.team", "surfaces.iq_hub", "surfaces.actions", "surfaces.audit"] },
  { key: "ai", label: "AI", features: ["ai.chat", "ai.situation_detection", "ai.action_proposals", "ai.auto_execution", "ai.summarization", "ai.root_cause", "ai.impact_prediction"] },
  { key: "governance", label: "Governance", features: ["governance.basic_approvals", "governance.workflows", "governance.risk_scoring", "governance.separation_of_duties", "compliance.frameworks"] },
  { key: "admin", label: "Admin", features: ["admin.user_management", "admin.role_preset", "admin.custom_roles", "admin.department_permissions", "admin.sso", "admin.scim"] },
  { key: "integrations", label: "Integrations", features: ["integrations.standard", "integrations.premium", "integrations.webhooks", "integrations.custom", "integrations.api"] },
]
