import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { webhookUrl, status } = body

    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL required" }, { status: 400 })
    }

    // In a real implementation, validate the webhook
    return NextResponse.json({ success: true, status: "connected", validated: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Integration failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "connected",
    lastSync: new Date().toISOString(),
    messageCount: 1234,
  })
}
