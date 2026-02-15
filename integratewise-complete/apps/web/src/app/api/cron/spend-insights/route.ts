import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    console.log("[v0] Running spend insights cron")
    // TODO: Add your spend insights generation logic here

    return NextResponse.json({ success: true, message: "Spend insights generated" })
  } catch (error) {
    console.error("[v0] Spend insights cron error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
