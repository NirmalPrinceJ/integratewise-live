import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    console.log("[v0] Running daily insights cron")
    // TODO: Add your daily insights generation logic here

    return NextResponse.json({ success: true, message: "Daily insights generated" })
  } catch (error) {
    console.error("[v0] Daily insights cron error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
