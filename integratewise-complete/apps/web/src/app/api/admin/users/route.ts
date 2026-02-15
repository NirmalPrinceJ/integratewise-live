import { NextResponse } from "next/server"

type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "invited" | "suspended"
}

type UsersResponse = {
  users: AdminUser[]
  total: number
}

export async function GET() {
  const payload: UsersResponse = {
    users: [
      { id: "user_001", name: "Nirmal Prince J", email: "nirmal@integratewise.io", role: "admin", status: "active" },
      { id: "user_002", name: "Operator One", email: "ops@integratewise.io", role: "manager", status: "invited" },
    ],
    total: 2,
  }

  return NextResponse.json(payload)
}

export async function POST(request: Request) {
  const body = await request.json()

  const auditId = `audit_${Math.random().toString(16).slice(2)}`

  if (body?.operation === "update") {
    return NextResponse.json({
      success: true,
      updated: true,
      auditId,
      user: body?.after ?? body,
    })
  }

  return NextResponse.json({
    success: true,
    created: true,
    auditId,
    user: { id: "user_new", ...body },
  })
}
