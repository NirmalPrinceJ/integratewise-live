import { NextResponse } from "next/server"

// Mock adapter - replace with real Think/Spine integration
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const scope = searchParams.get("scope") || "operations"

  // Mock signals data matching final contract
  const signals = [
    {
      id: "sig_001",
      source: "Stripe",
      sourceIcon: "💳",
      event: "Payment failed",
      entity: "Acme Corp",
      entityType: "customer",
      entityLink: "/entities/customer/acme-corp",
      timestamp: "2m ago",
      severity: "critical",
      metadata: {
        amount: "$2,499",
        reason: "Insufficient funds",
        invoice_id: "inv_12345",
      },
      rawPayload: {
        type: "payment_intent.payment_failed",
        customer: "cus_acme",
      },
    },
    {
      id: "sig_002",
      source: "HubSpot",
      sourceIcon: "🎯",
      event: "Deal stage changed",
      entity: "Acme Q1 Expansion",
      entityType: "deal",
      entityLink: "/entities/deal/acme-q1",
      timestamp: "5m ago",
      severity: "info",
      metadata: {
        from: "Proposal",
        to: "Negotiation",
        value: "$50,000",
      },
    },
    {
      id: "sig_003",
      source: "Calendar",
      sourceIcon: "📅",
      event: "Meeting completed",
      entity: "Weekly Sync - Engineering",
      entityType: "meeting",
      timestamp: "12m ago",
      severity: "info",
      metadata: {
        duration: "45 min",
        attendees: "8",
      },
    },
    {
      id: "sig_004",
      source: "Slack",
      sourceIcon: "💬",
      event: "Urgent message",
      entity: "#customer-success",
      entityType: "channel",
      timestamp: "18m ago",
      severity: "warning",
      metadata: {
        from: "Sarah Chen",
        topic: "Client escalation",
      },
    },
  ]

  // Filter by scope in real implementation
  const filteredSignals = scope === "sales" 
    ? signals.filter(s => s.source === "HubSpot" || s.entityType === "deal")
    : signals

  return NextResponse.json({
    signals: filteredSignals,
    meta: {
      scope,
      total: filteredSignals.length,
      lastUpdated: new Date().toISOString(),
    },
  })
}
