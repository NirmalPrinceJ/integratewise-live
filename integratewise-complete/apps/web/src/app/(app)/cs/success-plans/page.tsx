"use client"

/**
 * Success Plans — Executive success plan tracker with QBR dates
 * Ported from Figma Design account-success/views/success-plans-view.tsx
 */

import { useState } from "react"
import { Search, FileText, Calendar, AlertTriangle, CheckCircle2, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

interface SuccessPlan {
  id: string
  account: string
  planPeriod: string
  status: "Active" | "Draft" | "Completed"
  nextQbrDate: string
  creationDate: string
  executiveSummary: string
  keyInitiatives: string[]
  top3Risks: string[]
  kpis: { name: string; target: string; actual: string; progress: number }[]
}

const successPlanData: SuccessPlan[] = [
  {
    id: "SP-001",
    account: "TechFlow Solutions",
    planPeriod: "Q1-Q2 2026",
    status: "Active",
    nextQbrDate: "Mar 15, 2026",
    creationDate: "Jan 8, 2026",
    executiveSummary: "Drive 40% increase in platform adoption across engineering teams while reducing mean time to resolution by 25%.",
    keyInitiatives: ["API integration expansion", "Self-service analytics rollout", "Executive alignment program"],
    top3Risks: ["Champion departure risk", "Budget constraints Q2", "Competitive evaluation"],
    kpis: [
      { name: "Adoption Rate", target: "75%", actual: "52%", progress: 69 },
      { name: "NPS Score", target: "50+", actual: "42", progress: 84 },
      { name: "Time to Value", target: "< 30 days", actual: "38 days", progress: 65 },
    ],
  },
  {
    id: "SP-002",
    account: "HealthPlus Corp",
    planPeriod: "Q1-Q2 2026",
    status: "Active",
    nextQbrDate: "Feb 28, 2026",
    creationDate: "Jan 5, 2026",
    executiveSummary: "Achieve compliance certification readiness and expand to 3 additional departments by end of Q2.",
    keyInitiatives: ["Compliance module deployment", "Multi-department expansion", "Training program"],
    top3Risks: ["Regulatory changes", "Internal resource constraints", "Data migration complexity"],
    kpis: [
      { name: "Compliance Score", target: "95%", actual: "78%", progress: 82 },
      { name: "Department Adoption", target: "5 depts", actual: "2 depts", progress: 40 },
      { name: "Support Tickets", target: "< 10/week", actual: "15/week", progress: 60 },
    ],
  },
  {
    id: "SP-003",
    account: "RetailMax India",
    planPeriod: "Q1-Q3 2026",
    status: "Active",
    nextQbrDate: "Apr 10, 2026",
    creationDate: "Jan 12, 2026",
    executiveSummary: "Consolidate 4 legacy systems onto unified platform and achieve 60% cost reduction in operations tooling.",
    keyInitiatives: ["Legacy migration Phase 2", "Unified dashboard deployment", "Cost optimization audit"],
    top3Risks: ["Migration downtime", "Data integrity during migration", "User resistance to change"],
    kpis: [
      { name: "Migration Progress", target: "100%", actual: "45%", progress: 45 },
      { name: "Cost Savings", target: "$120K", actual: "$52K", progress: 43 },
      { name: "User Satisfaction", target: "4.0+", actual: "3.6", progress: 72 },
    ],
  },
]

export default function SuccessPlansPage() {
  const [search, setSearch] = useState("")

  const filtered = successPlanData.filter(
    (s) => !search || s.account.toLowerCase().includes(search.toLowerCase()) || s.executiveSummary.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Success Plans</h1>
          <p className="text-sm text-muted-foreground">{successPlanData.length} active success plans</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search plans..." className="pl-9 w-48" />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((s) => (
          <Card key={s.id} className="overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border/50 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{s.account}</p>
                  <p className="text-[10px] text-muted-foreground">{s.id} · {s.planPeriod} · Created: {s.creationDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={s.status === "Active" ? "default" : "outline"}>{s.status}</Badge>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  QBR: {s.nextQbrDate}
                </div>
              </div>
            </div>

            <CardContent className="p-4 space-y-4">
              {/* Executive Summary */}
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Executive Summary</p>
                <p className="text-xs leading-relaxed">{s.executiveSummary}</p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-secondary/20 border border-border/50">
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                    <Target className="w-3 h-3 inline mr-1" />Key Initiatives ({s.keyInitiatives.length})
                  </p>
                  <div className="space-y-1">
                    {s.keyInitiatives.map((k, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        {k}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <p className="text-[9px] uppercase tracking-wider text-red-500 mb-1.5 font-semibold">Top 3 Risks</p>
                  <div className="space-y-1">
                    {s.top3Risks.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
                        {r}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <p className="text-[9px] uppercase tracking-wider text-green-500 mb-1.5 font-semibold">KPI Progress</p>
                  <div className="space-y-2">
                    {s.kpis.map((kpi, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-muted-foreground">{kpi.name}</span>
                          <span className="font-medium">{kpi.actual} / {kpi.target}</span>
                        </div>
                        <Progress value={kpi.progress} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
