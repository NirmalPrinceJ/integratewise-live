"use client"

/**
 * Engineering Dashboard — Sprints, velocity, incidents, releases, tech-debt.
 */

import {
  GitBranch, Bug, Rocket, AlertTriangle, Code, Timer,
  ArrowUpRight, CheckCircle2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const sprint = { name: "Sprint 14", daysLeft: 5, totalPoints: 42, completedPoints: 28, inProgress: 10, todo: 4 }

const velocity = [
  { sprint: "S10", planned: 38, completed: 35 },
  { sprint: "S11", planned: 40, completed: 38 },
  { sprint: "S12", planned: 42, completed: 36 },
  { sprint: "S13", planned: 40, completed: 40 },
  { sprint: "S14", planned: 42, completed: 28 },
]

const incidents = [
  { id: "INC-042", title: "API gateway 502 errors spike", severity: "P1", status: "investigating", assignee: "Ravi K.", time: "2h ago" },
  { id: "INC-041", title: "Slow webhook delivery to Slack", severity: "P2", status: "monitoring", assignee: "Priya M.", time: "1d ago" },
  { id: "INC-040", title: "Data sync lag >60s for Salesforce", severity: "P3", status: "resolved", assignee: "Dev Team", time: "3d ago" },
]

const releases = [
  { version: "v2.14.0", status: "deploying", date: "Feb 11", changes: 12, hotfixes: 0 },
  { version: "v2.13.2", status: "live", date: "Feb 8", changes: 4, hotfixes: 1 },
  { version: "v2.13.1", status: "live", date: "Feb 5", changes: 2, hotfixes: 2 },
]

const techDebt = [
  { area: "Legacy Auth Module", severity: "high", effort: "5d", impact: "Security + performance", age: "6mo" },
  { area: "Monolith API routes", severity: "medium", effort: "10d", impact: "Maintainability", age: "1yr" },
  { area: "Test coverage for ingestion", severity: "medium", effort: "3d", impact: "Reliability", age: "3mo" },
  { area: "Deprecated Webpack config", severity: "low", effort: "2d", impact: "DX", age: "8mo" },
]

const sevColors: Record<string, string> = { P1: "bg-red-500/10 text-red-600", P2: "bg-orange-500/10 text-orange-600", P3: "bg-amber-500/10 text-amber-600" }
const debtColors: Record<string, string> = { high: "bg-red-500/10 text-red-600", medium: "bg-amber-500/10 text-amber-600", low: "bg-muted text-muted-foreground" }

export function EngineeringDashboard() {
  const sprintPct = Math.round((sprint.completedPoints / sprint.totalPoints) * 100)
  const maxVelocity = Math.max(...velocity.flatMap((v) => [v.planned, v.completed]))

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI title="Sprint Progress" value={`${sprintPct}%`} sub={`${sprint.completedPoints}/${sprint.totalPoints} pts`} icon={<Timer className="w-4 h-4" />} accent="text-blue-600" />
        <KPI title="Days Left" value={sprint.daysLeft.toString()} sub={sprint.name} icon={<Code className="w-4 h-4" />} accent="text-purple-600" />
        <KPI title="Open Incidents" value={incidents.filter((i) => i.status !== "resolved").length.toString()} sub={`${incidents.filter((i) => i.severity === "P1").length} P1`} icon={<Bug className="w-4 h-4" />} accent="text-red-600" />
        <KPI title="Last Release" value={releases[0].version} sub={releases[0].date} icon={<Rocket className="w-4 h-4" />} accent="text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Board Summary */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">{sprint.name}</h3>
            <Progress value={sprintPct} className="h-2 mb-3" />
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-muted/50"><div className="text-lg font-bold text-muted-foreground">{sprint.todo}</div><div className="text-[9px] text-muted-foreground">To Do</div></div>
              <div className="p-2 rounded bg-blue-500/10"><div className="text-lg font-bold text-blue-600">{sprint.inProgress}</div><div className="text-[9px] text-muted-foreground">In Progress</div></div>
              <div className="p-2 rounded bg-green-500/10"><div className="text-lg font-bold text-green-600">{sprint.completedPoints}</div><div className="text-[9px] text-muted-foreground">Done</div></div>
            </div>
          </CardContent>
        </Card>

        {/* Velocity Chart (CSS bars) */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Velocity</h3>
            <div className="flex items-end gap-2 h-32">
              {velocity.map((v) => (
                <div key={v.sprint} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full flex gap-0.5 items-end h-24">
                    <div className="flex-1 rounded-t bg-muted" style={{ height: `${(v.planned / maxVelocity) * 100}%` }} />
                    <div className="flex-1 rounded-t bg-blue-500" style={{ height: `${(v.completed / maxVelocity) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground">{v.sprint}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-muted" /> Planned</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" /> Completed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Incidents</h3>
            <div className="space-y-2">
              {incidents.map((inc) => (
                <div key={inc.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  {inc.status === "resolved" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> : <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 ${inc.severity === "P1" ? "text-red-500" : "text-amber-500"}`} />}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{inc.title}</div>
                    <div className="text-[10px] text-muted-foreground">{inc.id} · {inc.assignee} · {inc.time}</div>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${sevColors[inc.severity]}`}>{inc.severity}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech Debt */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Tech Debt Tracker</h3>
            <div className="space-y-2">
              {techDebt.map((d) => (
                <div key={d.area} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{d.area}</div>
                    <div className="text-[10px] text-muted-foreground">{d.impact} · Est. {d.effort} · Age: {d.age}</div>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${debtColors[d.severity]}`}>{d.severity}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Releases */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3">Recent Releases</h3>
          <div className="flex gap-3">
            {releases.map((r) => (
              <div key={r.version} className={`flex-1 p-3 rounded-lg text-center ${r.status === "deploying" ? "bg-blue-500/5 border border-blue-500/20" : "bg-muted/50"}`}>
                <div className="text-sm font-bold">{r.version}</div>
                <Badge variant="outline" className={`text-[9px] mt-1 ${r.status === "deploying" ? "text-blue-600" : "text-green-600"}`}>{r.status}</Badge>
                <div className="text-[10px] text-muted-foreground mt-1">{r.date} · {r.changes} changes</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KPI({ title, value, sub, icon, accent }: { title: string; value: string; sub: string; icon: React.ReactNode; accent: string }) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">{title}</span>
          <div className={accent}>{icon}</div>
        </div>
        <div className={`text-xl font-semibold ${accent}`}>{value}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
      </CardContent>
    </Card>
  )
}
