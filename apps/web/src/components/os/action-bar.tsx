"use client"

import { useState } from "react"
import { Zap } from "lucide-react"

interface ActionBarProps {
  selectedActionId: string | null
}

export function ActionBar({ selectedActionId }: ActionBarProps) {
  const [status, setStatus] = useState<string>("idle")

  const handleExecute = async () => {
    if (!selectedActionId) return
    setStatus("running")
    const response = await fetch("/api/act/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposed_action_id: selectedActionId }),
    })
    const data = await response.json()
    setStatus(data.status ?? "running")
  }

  return (
    <div className="h-12 border-t border-slate-200/60 bg-white flex items-center justify-between px-6">
      <div className="text-xs text-slate-500 font-medium">
        {selectedActionId ? `Selected Action: ${selectedActionId}` : "No action selected"}
      </div>
      <button
        onClick={handleExecute}
        disabled={!selectedActionId}
        className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
          selectedActionId ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        <Zap className="w-3.5 h-3.5" />
        {status === "running" ? "Executing..." : "Run Action"}
      </button>
    </div>
  )
}
