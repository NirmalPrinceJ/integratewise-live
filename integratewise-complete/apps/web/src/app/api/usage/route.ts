import { NextResponse } from "next/server"

type UsageResponse = {
  tenant: string
  period: string
  apiCalls: number
  storageGB: number
}

export async function GET() {
  const payload: UsageResponse = {
    tenant: "Acme Corp",
    period: "2026-01",
    apiCalls: 12450,
    storageGB: 18.4,
  }

  return NextResponse.json(payload)
}
