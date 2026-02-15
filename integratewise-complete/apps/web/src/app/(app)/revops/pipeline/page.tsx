"use client"

/**
 * Pipeline Visibility — Real-time pipeline health across all stages
 * Ported from Figma Design domains/revops/revops-views.tsx (PipelineView)
 */

import { useState } from "react"
import { DollarSign, Layers, Filter, Search, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Deal {
  id: string
  name: string
  company: string
  value: number
  stage: string
  probability: number
  owner: string
  daysInStage: number
  lastActivity: string
  nextStep: string
}

const deals: Deal[] = [
  { id: "d1", name: "Enterprise Integration Suite", company: "TechServe India", value: 120000, stage: "negotiation", probability: 75, owner: "Vikram R.", daysInStage: 8, lastActivity: "2h ago", nextStep: "Final pricing review" },
  { id: "d2", name: "APAC Regional Deployment", company: "CloudBridge APAC", value: 95000, stage: "proposal", probability: 60, owner: "Arun K.", daysInStage: 12, lastActivity: "1d ago", nextStep: "Technical deep dive" },
  { id: "d3", name: "Data Integration Platform", company: "DataVault Australia", value: 85000, stage: "qualification", probability: 40, owner: "Anjali P.", daysInStage: 5, lastActivity: "3h ago", nextStep: "Security questionnaire" },
  { id: "d4", name: "RevOps Automation", company: "HealthTech Innovations", value: 65000, stage: "discovery", probability: 25, owner: "Priya S.", daysInStage: 3, lastActivity: "5h ago", nextStep: "Needs assessment call" },
  { id: "d5", name: "API Access Expansion", company: "FinanceFlow Solutions", value: 52000, stage: "proposal", probability: 55, owner: "Rajesh M.", daysInStage: 18, lastActivity: "2d ago", nextStep: "Follow up on pricing" },
  { id: "d6", name: "Starter Integration Package", company: "RetailNest Pte Ltd", value: 28000, stage: "discovery", probability: 20, owner: "Vikram R.", daysInStage: 1, lastActivity: "1h ago", nextStep: "Initial demo scheduled" },
  { id: "d7", name: "Multi-Region Sync", company: "LogiPrime Corp", value: 78000, stage: "negotiation", probability: 70, owner: "Arun K.", daysInStage: 6, lastActivity: "4h ago", nextStep: "Legal review" },
]

const stageConfig: Record<string, { label: string; color: string }> = {
  discovery: { label: "Discovery", color: "bg-blue-500" },
  qualification: { label: "Qualification", color: "bg-indigo-500" },
  proposal: { label: "Proposal", color: "bg-purple-500" },
  negotiation: { label: "Negotiation", color: "bg-amber-500" },
}

export default function PipelinePage() {
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [view, setView] = useState<"funnel" | "table">("funnel")

  const filtered = deals.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.company.toLowerCase().includes(search.toLowerCase())
    const matchStage = stageFilter === "all" || d.stage === stageFilter
    return matchSearch && matchStage
  })

  const openDeals = deals.filter((d) => d.stage !== "closed-won" && d.stage !== "closed-lost")
  const totalPipeline = openDeals.reduce((s, d) => s + d.value, 0)
  const weighted = openDeals.reduce((s, d) => s + d.value * (d.probability / 100), 0)

  const stages = Object.entries(stageConfig).map(([key, cfg]) => {
    const stageDeals = deals.filter((d) => d.stage === key)
    return { key, ...cfg, count: stageDeals.length, value: stageDeals.reduce((s, d) => s + d.value, 0) }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline Visibility</h1>
          <p className="text-sm text-muted-foreground">Real-time pipeline health across all stages</p>
        </div>
        <div className="flex items-center gap-2">
          {(["funnel", "table"] as const).map((v) => (
            <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => setView(v)}>
              {v === "funnel" ? "Funnel" : "Table"}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-blue-500" /><span className="text-xs text-muted-foreground">Total Pipeline</span></div><p className="text-lg font-semibold">${(totalPipeline / 1000000).toFixed(2)}M</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><ArrowUpRight className="w-4 h-4 text-green-500" /><span className="text-xs text-muted-foreground">Weighted</span></div><p className="text-lg font-semibold">${(weighted / 1000).toFixed(0)}K</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Layers className="w-4 h-4 text-purple-500" /><span className="text-xs text-muted-foreground">Open Deals</span></div><p className="text-lg font-semibold">{openDeals.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Eye className="w-4 h-4 text-amber-500" /><span className="text-xs text-muted-foreground">Avg Deal</span></div><p className="text-lg font-semibold">${(totalPipeline / openDeals.length / 1000).toFixed(0)}K</p></CardContent></Card>
      </div>

      {/* Funnel View */}
      {view === "funnel" && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Pipeline Funnel</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {stages.map((stage) => {
              const pct = totalPipeline > 0 ? Math.round((stage.value / totalPipeline) * 100) : 0
              return (
                <div key={stage.key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      <span className="text-sm font-medium">{stage.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">${(stage.value / 1000).toFixed(0)}K ({stage.count})</span>
                  </div>
                  <Progress value={pct} className="h-2.5" />
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Table View */}
      {view === "table" && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search deals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            {filtered.map((deal) => {
              const cfg = stageConfig[deal.stage]
              return (
                <Card key={deal.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{deal.name}</p>
                        <p className="text-[10px] text-muted-foreground">{deal.company} · {deal.owner}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`text-[10px]`}>{cfg?.label}</Badge>
                        <span className="text-sm font-mono font-semibold">${(deal.value / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Progress value={deal.probability} className="h-1.5 flex-1" />
                      <span className="text-[10px] w-8 text-right">{deal.probability}%</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                      <span>{deal.daysInStage}d in stage</span>
                      <span>Last: {deal.lastActivity}</span>
                      <span>Next: {deal.nextStep}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
