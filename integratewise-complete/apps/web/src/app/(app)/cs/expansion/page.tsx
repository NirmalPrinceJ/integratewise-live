"use client"

/**
 * Expansion Opportunities — Revenue expansion tracking & upsell/cross-sell pipeline
 * Ported from Figma Design patterns
 */

import { useState } from "react"
import { Search, TrendingUp, DollarSign, ArrowUpRight, Calendar, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

interface Expansion {
  id: string
  account: string
  type: "Upsell" | "Cross-sell" | "Expansion" | "Add-on"
  opportunity: string
  value: number
  probability: number
  stage: "Identified" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won"
  expectedClose: string
  champion: string
  signals: string[]
}

const expansionData: Expansion[] = [
  { id: "EXP-001", account: "TechFlow Solutions", type: "Upsell", opportunity: "Enterprise Tier Upgrade", value: 180000, probability: 75, stage: "Proposal", expectedClose: "Mar 30, 2026", champion: "VP Engineering", signals: ["Usage at 92% of current tier", "3 feature requests for enterprise features", "Champion verbally committed"] },
  { id: "EXP-002", account: "HealthPlus Corp", type: "Cross-sell", opportunity: "Compliance Module", value: 95000, probability: 60, stage: "Qualified", expectedClose: "Apr 15, 2026", champion: "CISO", signals: ["Regulatory audit upcoming", "Evaluated competitor compliance tool", "Budget approved for Q2"] },
  { id: "EXP-003", account: "RetailMax India", type: "Expansion", opportunity: "3 Additional Departments", value: 240000, probability: 45, stage: "Identified", expectedClose: "Jun 30, 2026", champion: "COO", signals: ["Positive pilot results", "CEO mentioned in QBR", "Budget discussions started"] },
  { id: "EXP-004", account: "CloudNine Analytics", type: "Add-on", opportunity: "Premium Support Package", value: 48000, probability: 85, stage: "Negotiation", expectedClose: "Feb 28, 2026", champion: "VP Support", signals: ["High ticket volume", "SLA breaches last quarter", "Direct request from VP"] },
  { id: "EXP-005", account: "DataFlow Systems", type: "Upsell", opportunity: "API Pro Tier", value: 72000, probability: 55, stage: "Qualified", expectedClose: "May 15, 2026", champion: "CTO", signals: ["API usage growing 40% MoM", "Integration roadmap shared", "Positive executive sentiment"] },
]

function stageColor(stage: string): string {
  switch (stage) {
    case "Identified": return "#9E9E9E"
    case "Qualified": return "#2196F3"
    case "Proposal": return "#FF9800"
    case "Negotiation": return "#7C4DFF"
    case "Closed Won": return "#4CAF50"
    default: return "#9E9E9E"
  }
}

function formatCurrency(v: number): string {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`
  return `$${v.toLocaleString()}`
}

export default function ExpansionPage() {
  const [search, setSearch] = useState("")

  const filtered = expansionData.filter(
    (e) => !search || e.account.toLowerCase().includes(search.toLowerCase()) || e.opportunity.toLowerCase().includes(search.toLowerCase())
  )

  const totalPipeline = expansionData.reduce((s, e) => s + e.value, 0)
  const weightedPipeline = expansionData.reduce((s, e) => s + (e.value * e.probability) / 100, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Expansion Opportunities</h1>
          <p className="text-sm text-muted-foreground">{expansionData.length} active opportunities</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-9 w-48" />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Pipeline</p>
            <p className="text-xl font-bold mt-1 text-primary">{formatCurrency(totalPipeline)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Weighted Pipeline</p>
            <p className="text-xl font-bold mt-1 text-green-500">{formatCurrency(weightedPipeline)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg Deal Size</p>
            <p className="text-xl font-bold mt-1">{formatCurrency(totalPipeline / expansionData.length)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg Probability</p>
            <p className="text-xl font-bold mt-1">{Math.round(expansionData.reduce((s, e) => s + e.probability, 0) / expansionData.length)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Opportunity Cards */}
      <div className="space-y-3">
        {filtered.map((e) => (
          <Card key={e.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{e.opportunity}</p>
                    <p className="text-[10px] text-muted-foreground">{e.account} · {e.id} · Champion: {e.champion}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-lg font-bold text-green-500">{formatCurrency(e.value)}</span>
                  <Badge variant="outline" style={{ color: stageColor(e.stage), borderColor: stageColor(e.stage) }}>
                    {e.stage}
                  </Badge>
                </div>
              </div>

              {/* Progress */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Probability</span>
                    <span className="font-medium">{e.probability}%</span>
                  </div>
                  <Progress value={e.probability} className="h-1.5" />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Close: {e.expectedClose}
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-[10px]">{e.type}</Badge>
                </div>
              </div>

              {/* Signals */}
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <p className="text-[9px] uppercase tracking-wider text-green-600 mb-1.5 font-semibold">
                  <ArrowUpRight className="w-3 h-3 inline mr-1" />Expansion Signals
                </p>
                <div className="space-y-1">
                  {e.signals.map((sig, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                      <Target className="w-3 h-3 text-green-500 flex-shrink-0" />
                      {sig}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
