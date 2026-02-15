import { NextResponse } from "next/server"

export async function GET() {
  const models = [
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI", tier: "pro" as const },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", tier: "pro" as const },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", tier: "free" as const },
    { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", tier: "enterprise" as const },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic", tier: "pro" as const },
    { id: "mixtral", name: "Mixtral 8x7B", provider: "Groq", tier: "free" as const },
  ]

  return NextResponse.json({ models, total: models.length })
}
