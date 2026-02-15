import { NextResponse } from "next/server"

type ActRun = {
  id: string
  status: "pending" | "running" | "completed" | "failed"
  startedAt: string
}

type RunsResponse = {
  runs: ActRun[]
}

export async function GET() {
  const payload: RunsResponse = {
    runs: [
      { id: "run_001", status: "running", startedAt: new Date().toISOString() },
      { id: "run_002", status: "completed", startedAt: new Date().toISOString() },
    ],
  }

  return NextResponse.json(payload)
}
