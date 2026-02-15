import { NextResponse } from "next/server"

type WebhookTestRequest = {
  provider: string
}

type WebhookTestResponse = {
  ok: boolean
  provider: string
  deliveredAt: string
}

export async function POST(request: Request) {
  const body = (await request.json()) as WebhookTestRequest
  const payload: WebhookTestResponse = {
    ok: true,
    provider: body.provider ?? "unknown",
    deliveredAt: new Date().toISOString(),
  }

  return NextResponse.json(payload)
}
