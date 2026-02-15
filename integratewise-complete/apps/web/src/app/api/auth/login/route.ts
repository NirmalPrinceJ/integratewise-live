import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Mock user database
const MOCK_USERS = {
  "demo@example.com": {
    password: "demo123",
    id: "user-1",
    email: "demo@example.com",
    role: "admin",
    name: "Demo User",
  },
  "user@example.com": {
    password: "user123",
    id: "user-2",
    email: "user@example.com",
    role: "user",
    name: "Regular User",
  },
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = MOCK_USERS[email as keyof typeof MOCK_USERS]

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    const sessionData = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    }

    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true, user: sessionData })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}
