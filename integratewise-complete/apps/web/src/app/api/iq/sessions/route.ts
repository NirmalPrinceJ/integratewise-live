import { NextResponse } from "next/server"

type Session = {
  id: string
  title: string
  status: "active" | "closed"
  updatedAt: string
}

type SessionsResponse = {
  sessions: Session[]
}

export async function GET() {
  const payload: SessionsResponse = {
    sessions: [
      { id: "iq_001", title: "Exec Sync", status: "active", updatedAt: new Date().toISOString() },
      { id: "iq_002", title: "Legal Review", status: "closed", updatedAt: new Date().toISOString() },
    ],
  }

  return NextResponse.json(payload)
}
