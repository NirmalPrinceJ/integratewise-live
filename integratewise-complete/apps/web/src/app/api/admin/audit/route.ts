import { ok } from "@/app/api/admin/_mock"
import type { AuditLogEntry } from "@/types/admin"

const entries: AuditLogEntry[] = [
  {
    id: "audit_001",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    actor: "user_001",
    action: "REGISTRY_UPDATED",
    target: "view_registry",
    objectType: "registry",
    objectId: "reg_001",
    justification: "Enable additional module pack",
    before: { enabled: true, version: 2 },
    after: { enabled: true, version: 3 },
  },
  {
    id: "audit_002",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    actor: "user_001",
    action: "ROLE_UPDATED",
    target: "roles",
    objectType: "role",
    objectId: "role_admin",
    justification: "Grant registry management",
    before: { permissions: ["view_audit"] },
    after: { permissions: ["view_audit", "manage_registry"] },
  },
]

export async function GET() {
  return ok({ entries, total: entries.length })
}
