import { NextResponse } from "next/server"

type RetryRequest = {
  runId: string
}

type RetryResponse = {
  ok: boolean
  runId: string
  retriedAt: string
}

export async function POST(request: Request) {
  const body = (await request.json()) as RetryRequest
  const payload: RetryResponse = {
    ok: true,
    runId: body.runId,
    retriedAt: new Date().toISOString(),
  }

  return NextResponse.json(payload)
}
