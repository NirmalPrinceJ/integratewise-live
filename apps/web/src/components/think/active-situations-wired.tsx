"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, AlertTriangle, Info, TrendingUp } from "lucide-react"
import { useSituations } from "@/hooks/use-situations"
import { useView } from "@/components/layouts/os-shell"

interface Situation {
  id: string
  title: string
  narrative: string
  severity: string
  domain: string
  confidence: number
  whyItMatters: string
  evidence?: Array<{ type: string }>
  proposedActions?: Array<{ id: string; title: string; status: string; requiresApproval?: boolean }>
  createdAt: string
  status?: string
}

export function ActiveSituationsWired({ onEvidenceClick, onActionSelect }: {
  onEvidenceClick?: (situation: Situation) => void
  onActionSelect?: (action: any) => void
}) {
  const [expandedSituations, setExpandedSituations] = useState<string[]>(["sit_001"])
  const { currentView } = useView()
  const { situations, loading } = useSituations(currentView)

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Active Situations</h2>
          <div className="text-xs text-slate-500">Loading...</div>
        </div>
        <div className="text-xs text-slate-600">Analyzing signals...</div>
      </div>
    )
  }

  const toggleSituation = (id: string) => {
    setExpandedSituations(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    )
  }

  const countEvidence = (situation: Situation) => {
    const evidence = situation.evidence || []
    return {
      truth: evidence.filter((e) => e.type === "truth").length,
      context: evidence.filter((e) => e.type === "context").length,
      ai_chats: evidence.filter((e) => e.type === "ai-chat").length,
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "high":
        return <TrendingUp className="w-5 h-5 text-orange-500" />
      case "medium":
        return <Info className="w-5 h-5 text-amber-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-rose-50 text-rose-700 border-rose-200"
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-blue-50 text-blue-700 border-blue-200"
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Active Situations</h2>
        <Badge variant="outline" className="text-slate-600 border-slate-200">
          {situations.length} active
        </Badge>
      </div>

      <div className="space-y-2">
        {(situations as Situation[]).map((sit) => (
          <Card
            key={sit.id}
            className="bg-white border-slate-200/60 hover:shadow-sm transition-all"
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1">
                  {getSeverityIcon(sit.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge className={getSeverityColor(sit.severity) + " text-xs"}>
                        {sit.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-slate-600 border-slate-200">
                        {sit.domain}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {sit.confidence}% confident
                      </span>
                    </div>
                    <CardTitle className="text-slate-900 text-xs font-medium">
                      {sit.title}
                    </CardTitle>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSituation(sit.id)}
                  className="text-slate-500 hover:text-slate-900 h-6 w-6 p-0"
                >
                  {expandedSituations.includes(sit.id) ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </CardHeader>

            {expandedSituations.includes(sit.id) && (
              <CardContent className="space-y-3 pt-0">
                <div>
                  <p className="text-xs text-slate-700">{sit.narrative}</p>
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs text-blue-700">
                      <strong className="font-medium">Why it matters:</strong> {sit.whyItMatters}
                    </p>
                  </div>
                </div>

                {/* Evidence Summary */}
                <div className="border-t border-slate-200 pt-3">
                  <div className="text-xs font-medium text-slate-600 mb-1.5">Evidence grounding</div>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <button
                      onClick={() => onEvidenceClick?.(sit)}
                      className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Truth: {countEvidence(sit).truth}
                    </button>
                    <button
                      onClick={() => onEvidenceClick?.(sit)}
                      className="flex items-center gap-1 hover:text-orange-600 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      Context: {countEvidence(sit).context}
                    </button>
                    <button
                      onClick={() => onEvidenceClick?.(sit)}
                      className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      AI Chats: {countEvidence(sit).ai_chats}
                    </button>
                  </div>
                </div>

                {/* Proposed Actions */}
                {sit.proposedActions && sit.proposedActions.length > 0 && (
                  <div className="border-t border-slate-200 pt-3">
                    <div className="text-xs font-medium text-slate-600 mb-1.5">Proposed actions</div>
                    <div className="space-y-1.5">
                      {sit.proposedActions.map((action: any) => (
                        <button
                          key={action.id}
                          onClick={() => onActionSelect?.(action)}
                          className="w-full text-left p-2 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-900">{action.title}</span>
                            <Badge 
                              variant="outline" 
                              className={
                                action.status === "pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 text-xs"
                                  : action.status === "approved"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                                  : "bg-slate-100 text-slate-600 border-slate-200 text-xs"
                              }
                            >
                              {action.status}
                            </Badge>
                          </div>
                          {action.requiresApproval && (
                            <div className="text-xs text-slate-500 mt-0.5">
                              Requires approval
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-500">
                  Detected {sit.createdAt}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
