import { NextResponse } from "next/server"

type FeatureFlag = {
  key: string
  enabled: boolean
}

type FeaturesResponse = {
  features: FeatureFlag[]
}

export async function GET() {
  const payload: FeaturesResponse = {
    features: [
      { key: "core-shell", enabled: true },
      { key: "spine", enabled: true },
      { key: "iq-hub", enabled: false },
    ],
  }

  return NextResponse.json(payload)
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ updated: true, feature: body })
}
