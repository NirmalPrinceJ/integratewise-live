import { NextResponse } from "next/server"

type Permission = {
  key: string
  description: string
}

type PermissionsResponse = {
  permissions: Permission[]
}

export async function GET() {
  const payload: PermissionsResponse = {
    permissions: [
      { key: "manage_users", description: "Manage user accounts" },
      { key: "manage_policies", description: "Edit governance policies" },
      { key: "view_audit", description: "View audit logs" },
    ],
  }

  return NextResponse.json(payload)
}
