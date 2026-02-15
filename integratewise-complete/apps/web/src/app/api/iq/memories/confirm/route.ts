import { NextResponse } from "next/server"

type ConfirmRequest = {
  memoryId: string
  confirmed: boolean
}

type ConfirmResponse = {
  ok: boolean
  memoryId: string
  confirmed: boolean
}

export async function POST(request: Request) {
  const body = (await request.json()) as ConfirmRequest

  const payload: ConfirmResponse = {
    ok: true,
    memoryId: body.memoryId,
    confirmed: body.confirmed,
  }

  return NextResponse.json(payload)
}
