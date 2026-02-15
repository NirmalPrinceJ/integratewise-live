import { useState, useEffect } from "react"

export interface Evidence {
  type: "truth" | "context" | "ai-chat"
  title: string
  source: string
  date: string
  link?: string
  preview?: string
  confidence?: number
}

export interface ProposedAction {
  id: string
  title: string
  description: string
  requiresApproval: boolean
  status: "pending" | "approved" | "rejected" | "running" | "completed"
  proposedBy: string
  proposedAt: string
  policies: Array<{
    type: "approval" | "review" | "compliance"
    description: string
    satisfied: boolean
  }>
  estimatedImpact?: string
  riskLevel?: "low" | "medium" | "high"
}

export interface Situation {
  id: string
  severity: "low" | "medium" | "high" | "critical"
  domain: string
  confidence: number
  title: string
  narrative: string
  whyItMatters: string
  evidence: Evidence[]
  proposedActions: ProposedAction[]
  status: "pending" | "approved" | "rejected" | "completed"
  createdAt: string
}

export function useSituations(scope: string = "operations") {
  const [situations, setSituations] = useState<Situation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchSituations() {
      try {
        setLoading(true)
        const response = await fetch(`/api/situations?scope=${scope}`)
        if (!response.ok) throw new Error("Failed to fetch situations")
        const data = await response.json()
        setSituations(data.situations || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchSituations()
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchSituations, 30000)
    return () => clearInterval(interval)
  }, [scope])

  return { situations, loading, error, refetch: () => {} }
}
