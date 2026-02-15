import { ok } from "@/app/api/admin/_mock"

export async function GET() {
  return ok({
    tiles: [
      { key: "services", label: "Services", value: "9 healthy / 1 degraded" },
      { key: "queues", label: "Queue Lag", value: "3m" },
      { key: "connectors", label: "Connector Lag", value: "4h" },
      { key: "governance", label: "Governance Backlog", value: "7 pending" },
      { key: "billing", label: "Billing Alerts", value: "1" },
      { key: "security", label: "Security Alerts", value: "0" },
    ],
    feed: [
      { id: "evt_001", type: "registry", title: "Registry published", detail: "work.ops.today v3", ts: new Date(Date.now() - 1000 * 60 * 7).toISOString() },
      { id: "evt_002", type: "connector", title: "HubSpot sync warning", detail: "rate limit approaching", ts: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
    ],
  })
}
