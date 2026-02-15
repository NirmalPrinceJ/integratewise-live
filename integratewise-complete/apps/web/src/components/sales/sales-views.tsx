"use client"

/**
 * Sales domain-specific views: Deals, Forecasting.
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowUpRight, Calendar, ChevronRight, DollarSign,
  Filter, Plus, Target, TrendingUp,
} from "lucide-react"

/* ─── Deals View ─── */
const deals = [
  { name: "Acme Corp — Enterprise", value: 120_000, stage: "Negotiation", probability: 80, owner: "Mike R.", closeDate: "Feb 28", daysInStage: 12 },
  { name: "TechNova — Scale Plan", value: 45_000, stage: "Proposal", probability: 60, owner: "Jake L.", closeDate: "Mar 15", daysInStage: 5 },
  { name: "DataFlow — Renewal", value: 38_000, stage: "Closed Won", probability: 100, owner: "Sarah K.", closeDate: "Feb 10", daysInStage: 0 },
  { name: "CloudServ — Expansion", value: 65_000, stage: "Discovery", probability: 30, owner: "Mike R.", closeDate: "Apr 1", daysInStage: 8 },
  { name: "Enterprise Global — POC", value: 250_000, stage: "Qualification", probability: 20, owner: "Jake L.", closeDate: "May 30", daysInStage: 3 },
  { name: "FinScale — Add-on", value: 22_000, stage: "Proposal", probability: 70, owner: "Sarah K.", closeDate: "Feb 20", daysInStage: 7 },
]
const stageColors: Record<string, string> = {
  Discovery: "text-muted-foreground",
  Qualification: "text-blue-600",
  Proposal: "text-purple-600",
  Negotiation: "text-amber-600",
  "Closed Won": "text-green-600",
}

export function DealsView() {
  const pipeline = deals.filter((d) => d.stage !== "Closed Won").reduce((s, d) => s + d.value, 0)
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Deals</h2>
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="text-[10px]">Pipeline: ${(pipeline / 1000).toFixed(0)}K</Badge>
          <Button size="sm"><Plus className="w-3.5 h-3.5 mr-1.5" /> New Deal</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {deals.map((d) => (
              <div key={d.name} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                <DollarSign className={`w-4 h-4 flex-shrink-0 ${stageColors[d.stage] || "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium">{d.name}</div>
                  <div className="text-[10px] text-muted-foreground">{d.owner} · Close: {d.closeDate} · {d.daysInStage}d in stage</div>
                </div>
                <span className="text-sm font-bold">${(d.value / 1000).toFixed(0)}K</span>
                <span className={`text-[10px] font-medium ${stageColors[d.stage]}`}>{d.stage}</span>
                <Badge variant="outline" className="text-[9px]">{d.probability}%</Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Forecasting View ─── */
const forecast = {
  quarter: "Q1 2026",
  quota: 2_400_000,
  committed: 1_680_000,
  bestCase: 2_100_000,
  pipeline: 3_200_000,
}
const repForecast = [
  { rep: "Mike Rodriguez", quota: 600_000, committed: 480_000, bestCase: 580_000, closed: 320_000 },
  { rep: "Jake Liu", quota: 500_000, committed: 350_000, bestCase: 420_000, closed: 210_000 },
  { rep: "Sarah Kim", quota: 550_000, committed: 420_000, bestCase: 520_000, closed: 380_000 },
  { rep: "Anna Petrov", quota: 450_000, committed: 280_000, bestCase: 380_000, closed: 180_000 },
  { rep: "Tom Bradley", quota: 300_000, committed: 150_000, bestCase: 200_000, closed: 90_000 },
]
const monthlyTrend = [
  { month: "Oct", actual: 780 },
  { month: "Nov", actual: 820 },
  { month: "Dec", actual: 950 },
  { month: "Jan", actual: 680 },
  { month: "Feb", actual: 540 },
  { month: "Mar", actual: 0 },
]

export function ForecastingView() {
  const fmt = (n: number) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`
  const pctCommitted = Math.round((forecast.committed / forecast.quota) * 100)
  const maxActual = Math.max(...monthlyTrend.map((m) => m.actual))

  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Revenue Forecast — {forecast.quarter}</h2>
        <Badge variant="outline" className="text-[10px]"><Calendar className="w-3 h-3 mr-1" /> 48 days left</Badge>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Quota</div><div className="text-xl font-bold">{fmt(forecast.quota)}</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Committed</div><div className="text-xl font-bold text-blue-600">{fmt(forecast.committed)}</div><div className="text-[10px] text-muted-foreground">{pctCommitted}% of quota</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Best Case</div><div className="text-xl font-bold text-green-600">{fmt(forecast.bestCase)}</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Pipeline</div><div className="text-xl font-bold text-purple-600">{fmt(forecast.pipeline)}</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rep Forecast */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">By Rep</h3>
            <div className="space-y-3">
              {repForecast.map((r) => {
                const pct = Math.round((r.closed / r.quota) * 100)
                return (
                  <div key={r.rep}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium">{r.rep}</span>
                      <span className="text-muted-foreground">{fmt(r.closed)} / {fmt(r.quota)}</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                      <span>{pct}% closed</span>
                      <span>Committed: {fmt(r.committed)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Bookings */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Monthly Bookings ($K)</h3>
            <div className="flex items-end gap-2 h-32">
              {monthlyTrend.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5">
                  {m.actual > 0 && <span className="text-[9px] font-medium">{m.actual}</span>}
                  <div className={`w-full rounded-t ${m.actual > 0 ? "bg-green-500" : "bg-muted"}`} style={{ height: m.actual > 0 ? `${(m.actual / maxActual) * 100}%` : "5%" }} />
                  <span className="text-[9px] text-muted-foreground">{m.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
