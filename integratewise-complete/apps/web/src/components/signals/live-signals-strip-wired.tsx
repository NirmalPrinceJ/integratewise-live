"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import { useSignals } from "@/hooks/use-signals"
import { useView } from "@/components/layouts/os-shell"

export function LiveSignalsStripWired({ onSignalClick }: { onSignalClick?: (signal: any) => void }) {
  const { currentView } = useView()
  const { signals, loading } = useSignals(currentView)

  if (loading) {
    return (
      <div className="border-b border-zinc-800 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-6 py-3">
          <div className="text-xs text-zinc-500">Loading signals...</div>
        </div>
      </div>
    )
  }

  const severityStyles = {
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
  }

  return (
    <div className="border-b border-zinc-800 bg-black/40 backdrop-blur-sm">
      <div className="flex items-center gap-2 overflow-x-auto px-6 py-3 scrollbar-thin scrollbar-thumb-zinc-700">
        {signals.map((signal) => (
          <button
            key={signal.id}
            onClick={() => onSignalClick?.(signal)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${severityStyles[signal.severity]} hover:bg-opacity-20 transition-colors whitespace-nowrap`}
          >
            <span>{signal.sourceIcon}</span>
            <span className="text-xs font-medium">{signal.source}</span>
            <span className="text-xs opacity-60">→</span>
            <span className="text-xs">{signal.event}</span>
            <span className="text-xs opacity-60">•</span>
            <span className="text-xs font-medium">{signal.entity}</span>
            <span className="text-xs opacity-40">{signal.timestamp}</span>
          </button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 text-zinc-400 hover:text-white whitespace-nowrap"
        >
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
