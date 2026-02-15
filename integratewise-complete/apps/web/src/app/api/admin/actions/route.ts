import { created, ok, updated } from "@/app/api/admin/_mock"
import type { ActionTemplate } from "@/types/admin"

const templates: ActionTemplate[] = [
  {
    id: "act_001",
    key: "connectors.pause",
    category: "connectors",
    riskLevel: 80,
    connectors: ["HubSpot"],
    approvalRequired: true,
    simulationSupported: true,
    rollbackSupported: true,
    requiredEvidenceTypes: ["signals", "spine"],
    outcomeWritebackRules: { emits: ["connector_paused"], linksTo: ["audit"] },
  },
  {
    id: "act_002",
    key: "billing.apply_credit",
    category: "billing",
    riskLevel: 40,
    connectors: ["Stripe"],
    approvalRequired: true,
    simulationSupported: false,
    rollbackSupported: false,
    requiredEvidenceTypes: ["context"],
    outcomeWritebackRules: { emits: ["credit_applied"], linksTo: ["audit"] },
  },
]

export async function GET() {
  return ok({ templates, total: templates.length })
}

export async function POST(request: Request) {
  const body = await request.json()
  if (body?.operation === "update") return updated({ template: body.after })
  return created({ template: { id: `act_${Math.random().toString(16).slice(2)}`, ...body } })
}
