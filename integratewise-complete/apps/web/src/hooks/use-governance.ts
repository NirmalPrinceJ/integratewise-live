import { useState } from "react"
import useSWR from "swr"

export interface ApprovalRequest {
  id: string
  title: string
  description: string
  requestor: string
  amount: string
  priority: "low" | "medium" | "high"
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  type: string
}

export function useGovernance() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { data: queue, mutate } = useSWR<{ data: ApprovalRequest[] }>(
    "/api/govern/queue",
    (url) => fetch(url).then(r => r.json())
  )

  async function makeDecision(
    proposedActionId: string,
    decision: "approve" | "reject",
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      setLoading(true)
      const response = await fetch("/api/govern/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposed_action_id: proposedActionId,
          decision,
          reason,
        }),
      })

      if (!response.ok) throw new Error("Failed to record decision")

      const data = await response.json()
      mutate() // Refresh queue
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    makeDecision,
    loading,
    error,
    queue: queue?.data || [],
    refresh: mutate
  }
}
