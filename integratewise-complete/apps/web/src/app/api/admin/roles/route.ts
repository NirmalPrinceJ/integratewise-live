import { NextResponse } from "next/server"

type Role = {
  id: string
  name: string
  permissions: string[]
}

type RolesResponse = {
  roles: Role[]
}

export async function GET() {
  const payload: RolesResponse = {
    roles: [
      { id: "role_admin", name: "Admin", permissions: ["manage_users", "manage_policies", "view_audit"] },
      { id: "role_manager", name: "Manager", permissions: ["view_ops", "manage_tasks"] },
    ],
  }

  return NextResponse.json(payload)
}

export async function POST(request: Request) {
  const body = await request.json()

  const auditId = `audit_${Math.random().toString(16).slice(2)}`

  if (body?.operation === "update") {
    return NextResponse.json({ success: true, updated: true, auditId, role: body?.after ?? body })
  }

  return NextResponse.json({ success: true, created: true, auditId, role: { id: "role_new", ...body } })
}
