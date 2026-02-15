import { useState } from "react"
import type { Evidence } from "./use-situations"

export function useEvidence() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function resolveEvidence(situationId: string): Promise<{
    truth: Evidence[]
    context: Evidence[]
    aiChats: Evidence[]
  }> {
    try {
      setLoading(true)
      const response = await fetch("/api/evidence/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation_id: situationId }),
      })
      
      if (!response.ok) throw new Error("Failed to resolve evidence")
      
      const data = await response.json()
      return {
        truth: data.truth || [],
        context: data.context || [],
        aiChats: data.ai_chats || [],
      }
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { resolveEvidence, loading, error }
}
