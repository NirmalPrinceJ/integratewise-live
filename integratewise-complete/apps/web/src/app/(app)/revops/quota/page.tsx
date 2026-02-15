"use client"

/**
 * Quota Tracking — Individual and team quota attainment
 * Ported from Figma Design domains/revops/revops-views.tsx (QuotaView)
 */

import { Target, Users, Award, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RepQuota {
  name: string
  role: string
  quota: number
  closed: number
  pipeline: number
  forecast: number
  deals: number
  avgDealSize: number
}

const reps: RepQuota[] = [
  { name: "Vikram R.", role: "Enterprise AE", quota: 300000, closed: 245000, pipeline: 198000, forecast: 85000, deals: 4, avgDealSize: 61250 },
  { name: "Anjali P.", role: "Mid-Market AE", quota: 300000, closed: 180000, pipeline: 150000, forecast: 70000, deals: 3, avgDealSize: 60000 },
  { name: "Arun K.", role: "Enterprise AE", quota: 250000, closed: 120000, pipeline: 173000, forecast: 62000, deals: 2, avgDealSize: 60000 },
  { name: "Priya S.", role: "Mid-Market AE", quota: 200000, closed: 100000, pipeline: 95000, forecast: 45000, deals: 3, avgDealSize: 33333 },
  { name: "Rajesh M.", role: "SMB AE", quota: 150000, closed: 85000, pipeline: 78000, forecast: 35000, deals: 5, avgDealSize: 17000 },
]

const teamQuota = reps.reduce((s, r) => s + r.quota, 0)
const teamClosed = reps.reduce((s, r) => s + r.closed, 0)
const teamPipeline = reps.reduce((s, r) => s + r.pipeline, 0)
const teamForecast = reps.reduce((s, r) => s + r.forecast, 0)
const teamAttainment = Math.round((teamClosed / teamQuota) * 100)
const pipelineCoverage = (teamPipeline / (teamQuota - teamClosed)).toFixed(1)

function getColor(attainment: number) {
  if (attainment >= 80) return "text-green-600"
  if (attainment >= 50) return "text-amber-500"
  return "text-red-500"
}

export default function QuotaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quota Tracking</h1>
        <p className="text-sm text-muted-foreground">Individual and team quota attainment for Q1 2026</p>
      </div>

      {/* Team Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Target className="w-4 h-4 text-purple-500" /><span className="text-xs text-muted-foreground">Team Attainment</span></div><p className={`text-xl font-bold ${getColor(teamAttainment)}`}>{teamAttainment}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-green-500" /><span className="text-xs text-muted-foreground">Team Closed</span></div><p className="text-lg font-semibold">${(teamClosed / 1000).toFixed(0)}K</p><p className="text-[10px] text-muted-foreground">of ${(teamQuota / 1000).toFixed(0)}K</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-blue-500" /><span className="text-xs text-muted-foreground">Team Forecast</span></div><p className="text-lg font-semibold">${(teamForecast / 1000).toFixed(0)}K</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Award className="w-4 h-4 text-amber-500" /><span className="text-xs text-muted-foreground">Coverage</span></div><p className="text-lg font-semibold">{pipelineCoverage}x</p></CardContent></Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Team Quota Progress</CardTitle></CardHeader>
        <CardContent>
          <div className="h-4 bg-muted rounded-full overflow-hidden flex mb-2">
            <div className="h-full bg-green-500" style={{ width: `${(teamClosed / teamQuota) * 100}%` }} title="Closed" />
            <div className="h-full bg-blue-400" style={{ width: `${(teamForecast / teamQuota) * 100}%` }} title="Forecast" />
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Closed: ${(teamClosed / 1000).toFixed(0)}K</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400" /> Forecast: ${(teamForecast / 1000).toFixed(0)}K</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-muted" /> Remaining: ${((teamQuota - teamClosed - teamForecast) / 1000).toFixed(0)}K</span>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reps */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Individual Quota</h2>
        {reps
          .sort((a, b) => (b.closed / b.quota) - (a.closed / a.quota))
          .map((rep) => {
            const attainment = Math.round((rep.closed / rep.quota) * 100)
            const forecastAttainment = Math.round(((rep.closed + rep.forecast) / rep.quota) * 100)
            return (
              <Card key={rep.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {rep.name.split(" ").map((w) => w[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{rep.name}</p>
                        <p className="text-[10px] text-muted-foreground">{rep.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getColor(attainment)}`}>{attainment}%</p>
                      <p className="text-[10px] text-muted-foreground">{forecastAttainment}% w/ forecast</p>
                    </div>
                  </div>

                  <div className="h-2.5 bg-muted rounded-full overflow-hidden flex mb-2">
                    <div className="h-full bg-green-500 rounded-l-full" style={{ width: `${Math.min(attainment, 100)}%` }} />
                    <div className="h-full bg-blue-400" style={{ width: `${Math.min(forecastAttainment - attainment, 100 - attainment)}%` }} />
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div><p className="text-muted-foreground text-[10px]">Closed</p><p className="font-mono font-medium">${(rep.closed / 1000).toFixed(0)}K</p></div>
                    <div><p className="text-muted-foreground text-[10px]">Pipeline</p><p className="font-mono font-medium">${(rep.pipeline / 1000).toFixed(0)}K</p></div>
                    <div><p className="text-muted-foreground text-[10px]">Deals</p><p className="font-mono font-medium">{rep.deals}</p></div>
                    <div><p className="text-muted-foreground text-[10px]">Avg Deal</p><p className="font-mono font-medium">${(rep.avgDealSize / 1000).toFixed(0)}K</p></div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>
    </div>
  )
}
