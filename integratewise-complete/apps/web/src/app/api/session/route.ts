import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json(null, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    return NextResponse.json(session)
  } catch (error) {
    return NextResponse.json(null, { status: 401 })
  }
}
