import { created, ok, updated } from "@/app/api/admin/_mock"
import type { RegistryObject } from "@/types/admin"

const now = () => new Date().toISOString()

const registry: RegistryObject[] = [
  {
    id: "reg_001",
    type: "view",
    registryKey: "work.ops.today",
    displayName: "Work / Ops / Today",
    description: "Ops cockpit composition",
    worldScope: "work",
    department: "ops",
    accountRole: null,
    enabled: true,
    version: 3,
    modules: ["signals_stream", "situations_board", "action_proposals", "execution_monitor"],
    kpiCards: ["queue_lag", "sync_lag", "policy_breaches"],
    situationTemplates: ["ops_incident", "connector_failure"],
    actionLibrary: ["pause_connector", "trigger_backfill"],
    governanceRules: { evidenceMin: 2, approvals: ["admin"] },
    rbacRules: { roles: ["admin", "manager", "practitioner"] },
    planGates: { minPlan: "team" },
    updatedAt: now(),
    updatedBy: "system",
  },
  {
    id: "reg_002",
    type: "view",
    registryKey: "admin.control_plane",
    displayName: "Admin Control Plane",
    description: "Admin surface catalog",
    worldScope: "admin",
    department: null,
    accountRole: null,
    enabled: true,
    version: 1,
    modules: ["admin_today", "iam", "registry", "connectors", "billing", "audit"],
    kpiCards: ["service_health", "governance_backlog"],
    situationTemplates: ["security_anomaly"],
    actionLibrary: ["emergency_stop"],
    governanceRules: { approvals: ["owner"] },
    rbacRules: { roles: ["owner", "admin"] },
    planGates: { minPlan: "enterprise" },
    updatedAt: now(),
    updatedBy: "system",
  },
]

export async function GET() {
  return ok({ objects: registry, total: registry.length })
}

export async function POST(request: Request) {
  const body = await request.json()
  if (body?.operation === "update") {
    return updated({ object: body.after })
  }
  return created({ object: { id: `reg_${Math.random().toString(16).slice(2)}`, ...body } })
}
