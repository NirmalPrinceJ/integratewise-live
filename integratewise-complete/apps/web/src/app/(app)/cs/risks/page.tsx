"use client"

/**
 * Risk Register — Risk tracking with impact/probability assessment
 * Ported from Figma Design account-success/views/risk-register-view.tsx
 */

import { useState } from "react"
import { Search, ShieldAlert, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Risk {
  id: string
  title: string
  account: string
  category: string
  level: "Critical" | "High" | "Medium" | "Low"
  score: number
  status: "Open" | "Mitigating" | "Monitoring" | "Closed"
  impact: number
  probability: number
  description: string
  owner: string
  mitigationPlan: string
}

const riskData: Risk[] = [
  { id: "RSK-001", title: "Single Point of Failure - Champion Departure", account: "TechFlow Solutions", category: "Stakeholder", level: "Critical", score: 92, status: "Open", impact: 5, probability: 4, description: "Primary champion has announced departure. No successor identified.", owner: "CS Lead", mitigationPlan: "Schedule multi-threading meetings with VP Engineering" },
  { id: "RSK-002", title: "Contract Renewal Risk - Low Adoption", account: "HealthPlus Corp", category: "Adoption", level: "High", score: 78, status: "Mitigating", impact: 4, probability: 4, description: "Only 35% feature adoption after 6 months. Renewal in 45 days.", owner: "CSM", mitigationPlan: "Deploy adoption playbook + executive sponsor engagement" },
  { id: "RSK-003", title: "Technical Debt - API Integration Failures", account: "RetailMax India", category: "Technical", level: "High", score: 72, status: "Open", impact: 4, probability: 3, description: "API integration failures averaging 12% error rate over last 30 days.", owner: "TAM", mitigationPlan: "Technical review session + dedicated engineering sprint" },
  { id: "RSK-004", title: "Budget Freeze - Expansion at Risk", account: "CloudNine Analytics", category: "Commercial", level: "Medium", score: 55, status: "Monitoring", impact: 3, probability: 3, description: "CFO announced Q1 budget freeze. Planned expansion on hold.", owner: "AE", mitigationPlan: "Prepare ROI deck + schedule CFO presentation" },
  { id: "RSK-005", title: "Competitor Evaluation", account: "DataFlow Systems", category: "Competitive", level: "High", score: 80, status: "Mitigating", impact: 5, probability: 3, description: "Customer evaluating competitor product. RFP issued last week.", owner: "CS Director", mitigationPlan: "Executive engagement + value demonstration session" },
]

function riskColor(level: string): string {
  switch (level) {
    case "Critical": return "#F44336"
    case "High": return "#FF9800"
    case "Medium": return "#FFC107"
    case "Low": return "#4CAF50"
    default: return "#9E9E9E"
  }
}

function statusColor(status: string): string {
  switch (status) {
    case "Open": return "#F44336"
    case "Mitigating": return "#FF9800"
    case "Monitoring": return "#2196F3"
    case "Closed": return "#4CAF50"
    default: return "#9E9E9E"
  }
}

export default function RiskRegisterPage() {
  const [search, setSearch] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")

  const filtered = riskData
    .filter((r) => {
      if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.account.toLowerCase().includes(search.toLowerCase())) return false
      if (levelFilter !== "all" && r.level !== levelFilter) return false
      return true
    })
    .sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Risk Register</h1>
          <p className="text-sm text-muted-foreground">{riskData.length} risks tracked · Sorted by risk score</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search risks..." className="pl-9 w-48" />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Risk Level Summary */}
      <div className="flex items-center gap-3 flex-wrap">
        {(["Critical", "High", "Medium", "Low"] as const).map((level) => {
          const count = riskData.filter((r) => r.level === level).length
          if (count === 0) return null
          return (
            <div key={level} className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-card" style={{ borderColor: `${riskColor(level)}40` }}>
              <div className="w-3 h-3 rounded-full" style={{ background: riskColor(level) }} />
              <span className="text-xs font-semibold" style={{ color: riskColor(level) }}>{count}</span>
              <span className="text-[10px] text-muted-foreground">{level}</span>
            </div>
          )
        })}
      </div>

      {/* Risk Cards */}
      <div className="space-y-3">
        {filtered.map((r) => (
          <Card key={r.id} className="border" style={{ borderColor: `${riskColor(r.level)}30` }}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${riskColor(r.level)}15` }}>
                    <ShieldAlert className="w-4 h-4" style={{ color: riskColor(r.level) }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{r.title}</p>
                    <p className="text-[10px] text-muted-foreground">{r.account} · {r.category} · {r.id}</p>
                    <p className="text-xs text-muted-foreground mt-1">{r.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge variant="outline" style={{ color: riskColor(r.level), borderColor: riskColor(r.level) }}>
                    Score: {r.score}
                  </Badge>
                  <Badge variant="outline" style={{ color: statusColor(r.status), borderColor: statusColor(r.status) }}>
                    {r.status}
                  </Badge>
                </div>
              </div>

              {/* Impact × Probability */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-2 rounded-lg bg-secondary/30">
                  <span className="text-muted-foreground">Impact</span>
                  <p className="font-bold mt-0.5">{r.impact}/5</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/30">
                  <span className="text-muted-foreground">Probability</span>
                  <p className="font-bold mt-0.5">{r.probability}/5</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/30">
                  <span className="text-muted-foreground">Owner</span>
                  <p className="font-bold mt-0.5">{r.owner}</p>
                </div>
              </div>

              {/* Mitigation */}
              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3 h-3 text-blue-500" />
                  <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">Mitigation Plan</span>
                </div>
                <p className="text-xs text-foreground">{r.mitigationPlan}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
