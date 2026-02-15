import { useState } from "react"

export function useExecution() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function executeAction(
    proposedActionId: string
  ): Promise<{ run_id: string; status: string }> {
    try {
      setLoading(true)
      const response = await fetch("/api/act/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposed_action_id: proposedActionId }),
      })
      
      if (!response.ok) throw new Error("Failed to execute action")
      
      const data = await response.json()
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { executeAction, loading, error }
}
