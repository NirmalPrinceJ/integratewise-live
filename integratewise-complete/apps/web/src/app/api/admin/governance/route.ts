import { ok, updated } from "@/app/api/admin/_mock"
import type { GovernanceRequest } from "@/types/admin"

const requests: GovernanceRequest[] = [
  {
    id: "gov_001",
    tenantId: "ten_001",
    riskScore: 87,
    blastRadius: 4,
    requestedBy: "user_001",
    actionKey: "connectors.pause",
    status: "pending",
    dueAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: "gov_002",
    tenantId: "ten_001",
    riskScore: 22,
    blastRadius: 1,
    requestedBy: "user_002",
    actionKey: "billing.apply_credit",
    status: "approved",
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
]

export async function GET() {
  return ok({ requests, total: requests.length })
}

export async function POST(request: Request) {
  const body = await request.json()
  return updated({ requestId: body?.id, decision: body?.decision ?? "ack" })
}
