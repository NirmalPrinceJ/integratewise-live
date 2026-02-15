"use client"

import { Circle, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Signal {
  id: string
  source: string
  sourceIcon: string
  event: string
  entity: string
  entityLink?: string
  timestamp: string
  severity: "info" | "warning" | "critical"
}

interface LiveSignalsStripProps {
  signals: Signal[]
  onSignalClick?: (signal: Signal) => void
}

export function LiveSignalsStrip({ signals, onSignalClick }: LiveSignalsStripProps) {
  const severityStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    critical: "bg-red-50 border-red-200 text-red-700",
  }

  const severityDots = {
    info: "bg-blue-500",
    warning: "bg-amber-500",
    critical: "bg-red-500",
  }

  // Sample signals if none provided
  const displaySignals = signals.length > 0 ? signals : [
    {
      id: "1",
      source: "Stripe",
      sourceIcon: "💳",
      event: "Payment failed",
      entity: "Acme Corp",
      entityLink: "/entities/acme-corp",
      timestamp: "2m ago",
      severity: "critical" as const,
    },
    {
      id: "2",
      source: "HubSpot",
      sourceIcon: "🎯",
      event: "Deal stage changed",
      entity: "Acme Q1 Expansion",
      entityLink: "/deals/acme-q1",
      timestamp: "5m ago",
      severity: "info" as const,
    },
    {
      id: "3",
      source: "Calendar",
      sourceIcon: "📅",
      event: "Meeting completed",
      entity: "Weekly Sync - Engineering",
      timestamp: "12m ago",
      severity: "info" as const,
    },
    {
      id: "4",
      source: "Slack",
      sourceIcon: "💬",
      event: "Urgent message",
      entity: "#customer-success",
      timestamp: "18m ago",
      severity: "warning" as const,
    },
  ]

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Circle className="w-3 h-3 text-green-500 fill-green-500 animate-pulse" />
          <span className="text-xs font-medium text-gray-600">Live Signals</span>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex items-center gap-2">
            {displaySignals.map((signal) => (
              <button
                key={signal.id}
                onClick={() => onSignalClick?.(signal)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border flex-shrink-0 transition-all hover:shadow-sm ${
                  severityStyles[signal.severity]
                }`}
              >
                <span className="text-sm">{signal.sourceIcon}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${severityDots[signal.severity]}`}></span>
                <span className="text-xs font-medium whitespace-nowrap">
                  {signal.event}
                </span>
                <span className="text-xs whitespace-nowrap">•</span>
                <span className="text-xs font-medium whitespace-nowrap underline">
                  {signal.entity}
                </span>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {signal.timestamp}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/signals"
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#2D7A3E] hover:bg-[#E8F5E9] rounded-lg transition-colors flex-shrink-0"
        >
          View All
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
