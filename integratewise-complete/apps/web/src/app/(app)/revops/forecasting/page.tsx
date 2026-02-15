"use client"

/**
 * Forecasting — Scenario-based revenue forecasting with commit/best-case/worst-case
 * Ported from Figma Design domains/revops/revops-views.tsx (ForecastingView)
 */

import { TrendingUp, Target, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const forecast = {
  commit: 520000,
  bestCase: 780000,
  worstCase: 380000,
  quota: 1200000,
  closed: 645000,
  period: "Q1 2026",
}

const monthlyForecast = [
  { month: "Jan", closed: 210000, forecast: 180000, target: 400000 },
  { month: "Feb", closed: 280000, forecast: 320000, target: 400000 },
  { month: "Mar", closed: 155000, forecast: 280000, target: 400000 },
]

const riskFactors = [
  { label: "2 deals slipping past quarter-end", impact: -85000, severity: "high" as const },
  { label: "Competitor displacement at RetailNest", impact: -28000, severity: "medium" as const },
  { label: "Budget freeze at FinanceFlow", impact: -52000, severity: "high" as const },
]

const upsideOpportunities = [
  { label: "TechServe expansion (upsell identified)", impact: 45000, probability: 70 },
  { label: "HealthTech multi-year commitment", impact: 30000, probability: 60 },
  { label: "Partner referral — new APAC deal", impact: 65000, probability: 35 },
]

const commitAttainment = Math.round(((forecast.closed + forecast.commit) / forecast.quota) * 100)
const bestAttainment = Math.round(((forecast.closed + forecast.bestCase) / forecast.quota) * 100)

export default function ForecastingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Forecasting</h1>
        <p className="text-sm text-muted-foreground">{forecast.period} — Scenario-based revenue forecasting</p>
      </div>

      {/* Forecast Scenarios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Worst Case</p>
            <p className="text-2xl font-bold text-red-500">${(forecast.worstCase / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-muted-foreground mt-1">{Math.round(((forecast.closed + forecast.worstCase) / forecast.quota) * 100)}% of quota</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800 ring-2 ring-blue-200 dark:ring-blue-800">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Commit</p>
            <p className="text-2xl font-bold text-blue-500">${(forecast.commit / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-muted-foreground mt-1">{commitAttainment}% of quota</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Best Case</p>
            <p className="text-2xl font-bold text-green-500">${(forecast.bestCase / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-muted-foreground mt-1">{bestAttainment}% of quota</p>
          </CardContent>
        </Card>
      </div>

      {/* Quota Progress */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Quota Progress</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Closed Won</span>
              <span className="font-mono font-medium">${(forecast.closed / 1000).toFixed(0)}K / ${(forecast.quota / 1000).toFixed(0)}K</span>
            </div>
            <Progress value={Math.round((forecast.closed / forecast.quota) * 100)} className="h-3" />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{Math.round((forecast.closed / forecast.quota) * 100)}% attained</span>
              <span>${((forecast.quota - forecast.closed) / 1000).toFixed(0)}K remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Monthly Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {monthlyForecast.map((m) => (
            <div key={m.month}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{m.month}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-green-600">Closed: ${(m.closed / 1000).toFixed(0)}K</span>
                  <span className="text-blue-600">Forecast: ${(m.forecast / 1000).toFixed(0)}K</span>
                  <span className="text-muted-foreground">Target: ${(m.target / 1000).toFixed(0)}K</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                <div className="h-full bg-green-500 rounded-l-full" style={{ width: `${(m.closed / m.target) * 100}%` }} />
                <div className="h-full bg-blue-400" style={{ width: `${(m.forecast / m.target) * 100}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Factors */}
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> Risk Factors</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {riskFactors.map((risk) => (
              <div key={risk.label} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${risk.severity === "high" ? "bg-red-500" : "bg-amber-500"}`} />
                <div className="flex-1">
                  <p className="text-sm">{risk.label}</p>
                  <p className="text-xs text-red-500 font-mono">-${(Math.abs(risk.impact) / 1000).toFixed(0)}K impact</p>
                </div>
                <Badge variant={risk.severity === "high" ? "destructive" : "secondary"} className="text-[10px]">{risk.severity}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upside Opportunities */}
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Upside Opportunities</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {upsideOpportunities.map((opp) => (
              <div key={opp.label} className="flex items-start gap-3">
                <ArrowUpRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{opp.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-green-600 font-mono">+${(opp.impact / 1000).toFixed(0)}K</span>
                    <Progress value={opp.probability} className="h-1 flex-1 max-w-20" />
                    <span className="text-[10px] text-muted-foreground">{opp.probability}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
