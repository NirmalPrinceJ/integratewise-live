"use client"

/**
 * RevOps Dashboard — Revenue intelligence: pipeline, forecast, quota, waterfall
 * Ported from Figma Design domains/revops/dashboard.tsx
 */

import { DollarSign, TrendingUp, Target, Activity, ArrowUpRight, ArrowDownRight, BarChart3, Users, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/* ---- Seed Data ---- */
const kpis = {
  totalPipeline: 2450000,
  weightedForecast: 820000,
  quotaQ1: 1200000,
  closedWonQ1: 645000,
  winRate: 34,
  avgDealSize: 72000,
  avgCycle: 42,
  pipelineCoverage: 3.2,
}

const pipelineByStage = [
  { stage: "Discovery", count: 18, value: 520000, color: "bg-blue-500" },
  { stage: "Qualification", count: 12, value: 410000, color: "bg-indigo-500" },
  { stage: "Proposal", count: 8, value: 680000, color: "bg-purple-500" },
  { stage: "Negotiation", count: 5, value: 490000, color: "bg-amber-500" },
  { stage: "Closed Won", count: 9, value: 645000, color: "bg-green-500" },
  { stage: "Closed Lost", count: 4, value: 180000, color: "bg-red-500" },
]

const waterfall = [
  { name: "Start ARR", value: 1480000, type: "neutral" as const },
  { name: "Expansion", value: 245000, type: "positive" as const },
  { name: "New Biz", value: 163000, type: "positive" as const },
  { name: "Contraction", value: -42000, type: "negative" as const },
  { name: "Churn", value: -65000, type: "negative" as const },
  { name: "End ARR", value: 1781000, type: "neutral" as const },
]

const leaderboard = [
  { name: "Vikram R.", closed: 245000, quota: 300000, deals: 4 },
  { name: "Anjali P.", closed: 180000, quota: 300000, deals: 3 },
  { name: "Arun K.", closed: 120000, quota: 250000, deals: 2 },
  { name: "Priya S.", closed: 100000, quota: 200000, deals: 3 },
]

const topDeals = [
  { name: "TechServe Enterprise Suite", company: "TechServe India", value: 120000, stage: "Negotiation", probability: 75, owner: "Vikram R." },
  { name: "APAC Regional Deployment", company: "CloudBridge APAC", value: 95000, stage: "Proposal", probability: 60, owner: "Arun K." },
  { name: "Data Integration Platform", company: "DataVault Australia", value: 85000, stage: "Qualification", probability: 40, owner: "Anjali P." },
  { name: "RevOps Automation", company: "HealthTech Innovations", value: 65000, stage: "Closed Won", probability: 100, owner: "Priya S." },
  { name: "API Access Expansion", company: "FinanceFlow Solutions", value: 52000, stage: "Proposal", probability: 55, owner: "Rajesh M." },
]

const quotaAttainment = Math.round((kpis.closedWonQ1 / kpis.quotaQ1) * 100)
const forecastAttainment = Math.round(((kpis.closedWonQ1 + kpis.weightedForecast) / kpis.quotaQ1) * 100)

function KPICard({ title, value, subtitle, icon, positive }: { title: string; value: string; subtitle: string; icon: React.ReactNode; positive?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className="text-xs text-muted-foreground">{title}</span>
        </div>
        <p className="text-xl font-bold">{value}</p>
        <div className="flex items-center gap-1 mt-1">
          {positive !== undefined && (
            positive ? <ArrowUpRight className="w-3 h-3 text-green-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />
          )}
          <span className="text-[10px] text-muted-foreground">{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function RevOpsDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">RevOps Dashboard</h1>
        <p className="text-sm text-muted-foreground">Revenue intelligence — pipeline, forecast, quota, and performance</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard title="Total Pipeline" value={`$${(kpis.totalPipeline / 1000000).toFixed(2)}M`} subtitle={`${pipelineByStage.length} stages`} icon={<DollarSign className="w-4 h-4 text-blue-500" />} positive />
        <KPICard title="Weighted Forecast" value={`$${(kpis.weightedForecast / 1000).toFixed(0)}K`} subtitle={`${forecastAttainment}% of quota`} icon={<TrendingUp className="w-4 h-4 text-green-500" />} positive={forecastAttainment >= 80} />
        <KPICard title="Quota Attainment" value={`${quotaAttainment}%`} subtitle={`$${(kpis.closedWonQ1 / 1000).toFixed(0)}K closed`} icon={<Target className="w-4 h-4 text-purple-500" />} positive={quotaAttainment >= 50} />
        <KPICard title="Win Rate" value={`${kpis.winRate}%`} subtitle="+5% vs last Q" icon={<Activity className="w-4 h-4 text-amber-500" />} positive />
      </div>

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="waterfall">Revenue Waterfall</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="deals">Top Deals</TabsTrigger>
        </TabsList>

        {/* Pipeline by Stage */}
        <TabsContent value="pipeline" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Pipeline by Stage</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {pipelineByStage.map((stage) => {
                const totalPipeline = pipelineByStage.reduce((s, st) => s + st.value, 0)
                const pct = Math.round((stage.value / totalPipeline) * 100)
                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                        <span className="text-sm font-medium">{stage.stage}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">${(stage.value / 1000).toFixed(0)}K ({stage.count})</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Waterfall */}
        <TabsContent value="waterfall" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Revenue Waterfall (Q1)</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {waterfall.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="text-sm w-28 flex-shrink-0 font-medium">{item.name}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden flex items-center">
                        <div
                          className={`h-full rounded-md ${item.type === "negative" ? "bg-red-500" : item.type === "positive" ? "bg-green-500" : "bg-blue-500"}`}
                          style={{ width: `${Math.min(Math.abs(item.value) / 20000, 100)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-mono w-20 text-right ${item.type === "negative" ? "text-red-500" : ""}`}>
                        {item.value < 0 ? "-" : ""}${(Math.abs(item.value) / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Sales Leaderboard</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {leaderboard.map((rep, i) => {
                const attainment = Math.round((rep.closed / rep.quota) * 100)
                return (
                  <div key={rep.name} className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{rep.name}</span>
                        <span className="text-xs text-muted-foreground">{rep.deals} deals · ${(rep.closed / 1000).toFixed(0)}K / ${(rep.quota / 1000).toFixed(0)}K</span>
                      </div>
                      <Progress value={attainment} className="h-2" />
                    </div>
                    <Badge variant={attainment >= 80 ? "default" : attainment >= 50 ? "secondary" : "outline"} className="text-xs w-14 justify-center">
                      {attainment}%
                    </Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Deals */}
        <TabsContent value="deals" className="mt-4 space-y-2">
          {topDeals.map((deal) => (
            <Card key={deal.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{deal.name}</p>
                    <p className="text-[10px] text-muted-foreground">{deal.company} · {deal.owner}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={deal.stage === "Closed Won" ? "default" : "secondary"} className="text-[10px]">{deal.stage}</Badge>
                    <span className="text-sm font-mono font-semibold">${(deal.value / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={deal.probability} className="h-1.5 flex-1" />
                  <span className="text-[10px] text-muted-foreground w-8 text-right">{deal.probability}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
