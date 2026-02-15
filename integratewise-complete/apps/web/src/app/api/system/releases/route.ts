import { NextResponse } from "next/server"

type Release = {
  id: string
  version: string
  status: "deployed" | "pending"
  deployedAt?: string
}

type ReleasesResponse = {
  releases: Release[]
}

export async function GET() {
  const payload: ReleasesResponse = {
    releases: [
      { id: "rel_001", version: "v0.9.1", status: "deployed", deployedAt: new Date().toISOString() },
      { id: "rel_002", version: "v0.9.2", status: "pending" },
    ],
  }

  return NextResponse.json(payload)
}
