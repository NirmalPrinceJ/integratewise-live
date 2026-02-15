import { NextResponse } from "next/server"

import { created, ok, updated } from "@/app/api/admin/_mock"
import type { Tenant } from "@/types/admin"

const tenants: Tenant[] = [
  {
    id: "ten_001",
    name: "Acme Corp",
    domains: ["acme.com"],
    plan: "enterprise",
    status: "active",
    createdAt: new Date(Date.now() - 86400 * 1000 * 120).toISOString(),
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "ten_002",
    name: "Beta Industries",
    domains: ["beta.io"],
    plan: "team",
    status: "trial",
    createdAt: new Date(Date.now() - 86400 * 1000 * 30).toISOString(),
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
]

export async function GET() {
  return ok({ tenants, total: tenants.length })
}

export async function POST(request: Request) {
  const body = await request.json()

  if (body?.operation === "update") {
    return updated({ tenant: body?.after ?? body })
  }

  return created({ tenant: { id: `ten_${Math.random().toString(16).slice(2)}`, ...body } })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  return updated({ tenant: body?.after ?? body })
}
