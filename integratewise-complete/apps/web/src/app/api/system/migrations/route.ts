import { NextResponse } from "next/server"

type Migration = {
  id: string
  name: string
  status: "applied" | "pending"
}

type MigrationsResponse = {
  migrations: Migration[]
}

export async function GET() {
  const payload: MigrationsResponse = {
    migrations: [
      { id: "mig_001", name: "add_governance_tables", status: "applied" },
      { id: "mig_002", name: "add_usage_counters", status: "pending" },
    ],
  }

  return NextResponse.json(payload)
}
