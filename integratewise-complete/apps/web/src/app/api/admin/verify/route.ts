import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin-auth"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ isAdmin: false, error: "Email required" }, { status: 400 })
    }

    const adminCheck = await isAdmin(email)

    return NextResponse.json({ 
      isAdmin: adminCheck,
      message: adminCheck ? "Admin access granted" : "Access denied"
    })
  } catch (error) {
    return NextResponse.json(
      { isAdmin: false, error: "Verification failed" },
      { status: 500 }
    )
  }
}
