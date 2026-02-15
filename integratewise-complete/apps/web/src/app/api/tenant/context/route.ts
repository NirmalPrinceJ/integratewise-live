import { NextResponse } from "next/server"
import type { EntitlementTier, Role } from "@/config/os-shell-registry"
import { getTenantContext } from "@/lib/tenant-context"

// Cloudflare-friendly: pure Request/Response (no Node-only APIs).
// This is the canonical place where auth/tenant routing will eventually resolve:
// - tenantId (subdomain/JWT/header)
// - plan (billing)
// - role (RBAC)
// - feature flags (rollouts)

const DEFAULT: {
  tenantId: string
  tenantName: string
  plan: EntitlementTier
  role: Role
  featureFlags: string[]
  limits: Record<string, number | "unlimited">
  usage: Record<string, number>
} = {
  tenantId: "ten_demo",
  tenantName: "Acme Corp",
  plan: "team",
  role: "admin",
  featureFlags: ["all"],
  limits: {
    "connectors.count": 15,
    "ai.sessions": 10000,
    storageGb: 50,
  },
  usage: {
    "ai.sessions": 123,
    "connectors.count": 3,
  },
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const planParam = (url.searchParams.get("plan") as EntitlementTier | null) ?? null
  const roleParam = (url.searchParams.get("role") as Role | null) ?? null

  // Try to resolve real tenant context from database
  if (process.env.DATABASE_URL) {
    try {
      const tenantContext = await getTenantContext(request, {
        DATABASE_URL: process.env.DATABASE_URL,
      });

      if (tenantContext) {
        return NextResponse.json({
          tenantId: tenantContext.tenantId,
          tenantName: "Tenant", // TODO: Fetch from database
          plan: tenantContext.plan as EntitlementTier,
          role: roleParam || "admin", // TODO: Resolve from RBAC
          featureFlags: tenantContext.features,
          limits: {
            "connectors.count": tenantContext.limits.connectors === Infinity ? "unlimited" : tenantContext.limits.connectors,
            "ai.sessions": tenantContext.limits.aiSessions === Infinity ? "unlimited" : tenantContext.limits.aiSessions,
            storageGb: tenantContext.limits.storageGb === Infinity ? "unlimited" : tenantContext.limits.storageGb,
          },
          usage: {}, // TODO: Fetch from usage table
        });
      }
    } catch (error) {
      console.error("Error resolving tenant context:", error);
      // Fall through to default
    }
  }

  // Fallback to default
  return NextResponse.json({
    ...DEFAULT,
    ...(planParam ? { plan: planParam } : null),
    ...(roleParam ? { role: roleParam } : null),
  })
}
