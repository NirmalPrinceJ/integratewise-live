import { useState, useEffect } from "react"

export interface Signal {
  id: string
  source: string
  sourceIcon: string
  event: string
  entity: string
  entityType: string
  entityLink?: string
  timestamp: string
  severity: "info" | "warning" | "critical"
  metadata?: Record<string, any>
  rawPayload?: any
}

export function useSignals(scope: string = "operations") {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchSignals() {
      try {
        setLoading(true)
        const response = await fetch(`/api/signals?scope=${scope}`)
        if (!response.ok) throw new Error("Failed to fetch signals")
        const data = await response.json()
        setSignals(data.signals || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchSignals()
    
    // Poll for new signals every 10 seconds
    const interval = setInterval(fetchSignals, 10000)
    return () => clearInterval(interval)
  }, [scope])

  return { signals, loading, error, refetch: () => {} }
}
