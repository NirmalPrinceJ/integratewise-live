import { ok, updated } from "@/app/api/admin/_mock"
import type { BillingPlan } from "@/types/admin"

const plans: BillingPlan[] = [
  {
    tenantId: "ten_001",
    plan: "org",
    seats: 50,
    seatsUsed: 17,
    usage: { aiTokens: 182331, actionRuns: 412, connectorSyncs: 10933, storageGb: 38 },
    alerts: ["Overage forecast: AI tokens"],
  },
  {
    tenantId: "ten_002",
    plan: "team",
    seats: 10,
    seatsUsed: 9,
    usage: { aiTokens: 12330, actionRuns: 22, connectorSyncs: 1233, storageGb: 4 },
    alerts: ["Trial ends in 7 days"],
  },
]

export async function GET() {
  return ok({ plans, total: plans.length })
}

export async function POST(request: Request) {
  const body = await request.json()
  return updated({ billing: true, operation: body?.operation ?? "update" })
}
