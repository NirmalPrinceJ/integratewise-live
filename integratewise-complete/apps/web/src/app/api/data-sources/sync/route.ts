import { NextResponse } from "next/server"

type SyncRequest = {
  source: string
}

type SyncResponse = {
  ok: boolean
  source: string
  syncId: string
}

export async function POST(request: Request) {
  const body = (await request.json()) as SyncRequest
  const payload: SyncResponse = {
    ok: true,
    source: body.source ?? "unknown",
    syncId: `sync_${Date.now()}`,
  }

  return NextResponse.json(payload)
}

export async function GET() {
  return NextResponse.json({ ok: true, sources: ["HubSpot", "Stripe", "Slack"] })
}
