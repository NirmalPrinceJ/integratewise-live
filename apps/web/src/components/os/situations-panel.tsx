"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2, ChevronRight, Zap } from "lucide-react"

interface SituationAction {
  id: string
  title: string
  requiresApproval: boolean
  status: string
}

interface Situation {
  id: string
  title: string
  severity: "low" | "medium" | "high"
  narrative: string
  proposedActions: SituationAction[]
}

interface SituationsResponse {
  situations: Situation[]
}

export function SituationsPanel({
  scope,
  onOpenEvidence,
  onSelectAction,
}: {
  scope: string
  onOpenEvidence: (situationId: string) => void
  onSelectAction: (actionId: string) => void
}) {
  const [situations, setSituations] = useState<Situation[]>([])

  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/situations?scope=${scope}`)
      const data = (await response.json()) as SituationsResponse
      setSituations(data.situations ?? [])
    }

    load()
  }, [scope])

  const visible = situations.slice(0, 3)

  return (
    <section>
      <div className="rounded-lg border border-slate-200/60 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Active Situations</h2>
            <p className="text-xs text-slate-500 mt-0.5">AI-detected situations requiring attention</p>
          </div>
          <a
            href="/think"
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900">
            <Zap className="w-4 h-4 text-amber-500" />
            Situations Requiring Action
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
            {situations.length}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {visible.length === 0 ? (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              No active situations right now.
            </div>
          ) : (
            visible.map((situation) => (
              <div
                key={situation.id}
                className="rounded-md border border-slate-200 bg-white p-3 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          situation.severity === "high"
                            ? "bg-red-100 text-red-700"
                            : situation.severity === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {situation.severity.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {scope.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-1.5 text-sm font-medium text-slate-900 line-clamp-1">
                      {situation.title}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-600 line-clamp-2">{situation.narrative}</div>
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={() => onOpenEvidence(situation.id)}
                      className="text-[11px] font-medium px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Evidence
                    </button>
                  </div>
                </div>

                {situation.proposedActions.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {situation.proposedActions.slice(0, 2).map((action) => (
                      <button
                        key={action.id}
                        onClick={() => onSelectAction(action.id)}
                        className="text-[11px] font-medium px-2.5 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                      >
                        {action.requiresApproval ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {action.title}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
