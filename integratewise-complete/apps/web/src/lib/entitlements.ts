import type { EntitlementTier } from "@/config/os-shell-registry"

export const PLAN_ORDER: EntitlementTier[] = ["personal", "team", "org", "enterprise"]

export function isPlanAtLeast(current: EntitlementTier, required: EntitlementTier): boolean {
  return PLAN_ORDER.indexOf(current) >= PLAN_ORDER.indexOf(required)
}

export function planLabel(plan: EntitlementTier): string {
  if (plan === "personal") return "Personal"
  if (plan === "team") return "Team"
  if (plan === "org") return "Organization"
  return "Enterprise"
}

export type FeatureAccessResult = {
  hasAccess: boolean
  reason?: "plan_required" | "feature_disabled" | "unknown_feature"
  requiredPlan?: EntitlementTier
}

// Minimal but extensible feature flag + plan gate map.
// Kept in code (not DB) for now; can later be backed by `plan_features` + `view_registry`.
export const FEATURE_GATES: Record<
  string,
  {
    minPlan: EntitlementTier
    // Optional feature flag key when not on "all"
    featureFlag?: string
  }
> = {
  // Worlds
  "worlds.personal": { minPlan: "personal" },
  "worlds.work": { minPlan: "team" },
  "worlds.accounts": { minPlan: "org" },

  // OS Surfaces
  "surfaces.spine": { minPlan: "team" },
  "surfaces.context": { minPlan: "team" },
  "surfaces.knowledge.team": { minPlan: "team" },
  "surfaces.iq_hub": { minPlan: "org" },
  "surfaces.actions": { minPlan: "team" },
  "surfaces.audit": { minPlan: "team" },
  "surfaces.agent": { minPlan: "org" },
  "surfaces.brainstorming": { minPlan: "team" },

  // Governance
  "governance.workflows": { minPlan: "org" },
  "admin.custom_roles": { minPlan: "org" },
  "admin.sso": { minPlan: "org" },
  "compliance.frameworks": { minPlan: "enterprise" },

  // Admin - Control Plane (org+)
  "admin.iq_hub": { minPlan: "org" },
  "admin.policies": { minPlan: "org" },
  "admin.features": { minPlan: "org" },
  "admin.releases": { minPlan: "org" },
  "admin.settings": { minPlan: "org" },

  // Admin - Identity & Access (team+)
  "admin.users": { minPlan: "team" },
  "admin.roles": { minPlan: "team" },
  "admin.permissions": { minPlan: "team" },

  // Admin - Tenant & Billing (team+)
  "admin.billing": { minPlan: "team" },
  "admin.usage": { minPlan: "team" },
  "admin.tenancy": { minPlan: "org" },

  // Admin - Integrations (org+)
  "admin.data_sources": { minPlan: "org" },
  "admin.webhooks": { minPlan: "org" },
  "admin.connectors": { minPlan: "org" },

  // Admin - Audit (enterprise)
  "admin.audit": { minPlan: "enterprise" },
  "admin.executions": { minPlan: "enterprise" },
  "admin.migrations": { minPlan: "enterprise" },
}

export function featureAccess(args: {
  plan: EntitlementTier
  featureFlags: string[]
  featureKey: string
}): FeatureAccessResult {
  const gate = FEATURE_GATES[args.featureKey]
  if (!gate) return { hasAccess: false, reason: "unknown_feature" }

  if (!isPlanAtLeast(args.plan, gate.minPlan)) {
    return { hasAccess: false, reason: "plan_required", requiredPlan: gate.minPlan }
  }

  if (gate.featureFlag && !args.featureFlags.includes("all") && !args.featureFlags.includes(gate.featureFlag)) {
    return { hasAccess: false, reason: "feature_disabled" }
  }

  return { hasAccess: true }
}
