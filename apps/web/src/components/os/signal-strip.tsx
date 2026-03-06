"use client"

import { useEffect, useState } from "react"
import { Dot, Search } from "lucide-react"
import type { SignalId } from "@/types/uuid"

interface Signal {
  /** UUID of the signal */
  id: SignalId
  source: string
  event: string
  entity: string
  timestamp: string
}

const sourceDotClass = (source: string) => {
  const s = source.toLowerCase()
  if (s.includes("think") || s.includes("ai")) return "text-violet-500 animate-pulse"
  if (s.includes("stripe") || s.includes("payment")) return "text-red-500"
  if (s.includes("datadog") || s.includes("engineering")) return "text-orange-500"
  if (s.includes("hubspot")) return "text-amber-500"
  if (s.includes("calendar")) return "text-emerald-500"
  if (s.includes("slack")) return "text-violet-500"
  if (s.includes("product") || s.includes("analytics")) return "text-blue-500"
  return "text-slate-400"
}

const isHighPriority = (signal: Signal): boolean => {
  const eventLower = signal.event.toLowerCase()
  return eventLower.includes("churn") || 
         eventLower.includes("risk") || 
         eventLower.includes("critical") ||
         signal.event.includes("🚨")
}

export function SignalStrip({ scope }: { scope: string }) {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/signals?scope=${scope}`)
        if (response.ok) {
          const data = await response.json()
          setSignals(data.signals ?? [])
        } else {
          // Demo mode: Show churn risk scenario
          setSignals([
            {
              id: "sig-001" as SignalId,
              source: "Stripe",
              event: "Payment delay detected",
              entity: "Customer X: $45K invoice, 15 days overdue",
              timestamp: "11:15 AM"
            },
            {
              id: "sig-002" as SignalId,
              source: "DataDog",
              event: "API error spike",
              entity: "Customer X: 12 incidents in 7 days",
              timestamp: "11:17 AM"
            },
            {
              id: "sig-003" as SignalId,
              source: "Product Analytics",
              event: "Usage decline",
              entity: "Customer X: MAU -30% (450→315)",
              timestamp: "11:18 AM"
            },
            {
              id: "sig-004" as SignalId,
              source: "Think Layer",
              event: "🚨 Churn risk: 87%",
              entity: "Customer X: $450K ARR at risk",
              timestamp: "11:20 AM"
            },
          ])
        }
      } catch (error) {
        // Demo mode on error
        setSignals([
          {
            id: "sig-001" as SignalId,
            source: "Stripe",
            event: "Payment delay detected",
            entity: "Customer X: $45K invoice, 15 days overdue",
            timestamp: "11:15 AM"
          },
          {
            id: "sig-002" as SignalId,
            source: "DataDog",
            event: "API error spike",
            entity: "Customer X: 12 incidents in 7 days",
            timestamp: "11:17 AM"
          },
          {
            id: "sig-003" as SignalId,
            source: "Product Analytics",
            event: "Usage decline",
            entity: "Customer X: MAU -30% (450→315)",
            timestamp: "11:18 AM"
          },
          {
            id: "sig-004" as SignalId,
            source: "Think Layer",
            event: "🚨 Churn risk: 87%",
            entity: "Customer X: $450K ARR at risk",
            timestamp: "11:20 AM"
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [scope])

  const newCount = signals.length

  return (
    <div className="border-b border-slate-200/60 bg-white">
      <div className="h-10 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">
            Live Signals
          </span>
          {newCount > 0 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
              {newCount}
            </span>
          )}
        </div>
        <a
          href="/signals"
          className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          View All
        </a>
      </div>

      <div className="px-6 pb-3">
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
          {signals.length === 0 ? (
            <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              No live signals available
            </div>
          ) : (
            signals.map((signal) => {
              const highPriority = isHighPriority(signal)
              return (
                <div
                  key={signal.id}
                  className={`min-w-[280px] max-w-[360px] flex items-center gap-2.5 rounded-md border px-3 py-2.5 transition-all cursor-pointer ${
                    highPriority 
                      ? "border-rose-300 bg-rose-50 hover:border-rose-400 hover:shadow-md ring-2 ring-rose-200" 
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <Dot className={`w-5 h-5 ${sourceDotClass(signal.source)} flex-shrink-0`} />
                  <div className="min-w-0">
                    <div className={`text-xs truncate font-medium ${highPriority ? "text-rose-900" : "text-slate-900"}`}>
                      <span className="font-semibold">{signal.source}:</span> {signal.event}{" "}
                      <span className="font-semibold">{signal.entity}</span>
                    </div>
                    <div className={`text-[11px] mt-0.5 truncate ${highPriority ? "text-rose-700" : "text-slate-500"}`}>
                      {signal.timestamp}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
