import { NextResponse } from "next/server"

type Policy = {
  id: string
  name: string
  status: "active" | "draft"
}

type PoliciesResponse = {
  policies: Policy[]
}

export async function GET() {
  const payload: PoliciesResponse = {
    policies: [
      { id: "policy_001", name: "Approval Thresholds", status: "active" },
      { id: "policy_002", name: "Data Retention", status: "draft" },
    ],
  }

  return NextResponse.json(payload)
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ created: true, policy: body })
}
