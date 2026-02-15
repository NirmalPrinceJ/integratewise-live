import { ok, updated } from "@/app/api/admin/_mock"
import type { ConnectorInstance } from "@/types/admin"

const connectors: ConnectorInstance[] = [
  {
    id: "conn_001",
    tenantId: "ten_001",
    system: "Stripe",
    status: "healthy",
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    errorRate: 0.01,
    tokenExpiresAt: new Date(Date.now() + 86400 * 1000 * 30).toISOString(),
  },
  {
    id: "conn_002",
    tenantId: "ten_001",
    system: "HubSpot",
    status: "warning",
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    errorRate: 0.12,
    tokenExpiresAt: new Date(Date.now() + 86400 * 1000 * 5).toISOString(),
  },
]

export async function GET() {
  return ok({ connectors, total: connectors.length })
}

export async function POST(request: Request) {
  const body = await request.json()
  return updated({ result: true, operation: body?.operation ?? "test", target: body?.id ?? null })
}
