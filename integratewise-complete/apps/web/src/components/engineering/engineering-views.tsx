"use client"

/**
 * Engineering domain-specific views: Sprints, Releases, Tech Debt, Incidents.
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle, Bug, CheckCircle2, Clock, GitBranch,
  Plus, Rocket, Timer, Wrench,
} from "lucide-react"

/* ─── Sprints View ─── */
const sprintItems = [
  { key: "ENG-142", title: "Implement webhook retry logic", type: "task", points: 5, status: "done", assignee: "Ravi K." },
  { key: "ENG-143", title: "Fix Salesforce sync race condition", type: "bug", points: 3, status: "in-progress", assignee: "Priya M." },
  { key: "ENG-144", title: "Add Supabase RLS policies for teams", type: "task", points: 8, status: "in-progress", assignee: "Dev A." },
  { key: "ENG-145", title: "Dashboard loading skeleton states", type: "task", points: 2, status: "todo", assignee: "Sarah K." },
  { key: "ENG-146", title: "Migrate auth to Clerk v6", type: "task", points: 13, status: "todo", assignee: "Mike R." },
  { key: "ENG-147", title: "E2E tests for onboarding flow", type: "task", points: 5, status: "in-review", assignee: "Priya M." },
  { key: "ENG-148", title: "Memory leak in event bus consumer", type: "bug", points: 3, status: "done", assignee: "Ravi K." },
]
const sprintStatusColor: Record<string, string> = { done: "bg-green-500/10 text-green-600", "in-progress": "bg-blue-500/10 text-blue-600", "in-review": "bg-purple-500/10 text-purple-600", todo: "bg-muted text-muted-foreground" }

export function SprintsView() {
  const columns = ["todo", "in-progress", "in-review", "done"]
  const labels: Record<string, string> = { todo: "To Do", "in-progress": "In Progress", "in-review": "In Review", done: "Done" }

  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sprint 14 Board</h2>
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="text-[10px]"><Timer className="w-3 h-3 mr-1" /> 5 days left</Badge>
          <Button size="sm"><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Item</Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {columns.map((col) => (
          <div key={col}>
            <div className="text-xs font-semibold text-muted-foreground mb-2">{labels[col]} ({sprintItems.filter((i) => i.status === col).length})</div>
            <div className="space-y-2">
              {sprintItems.filter((i) => i.status === col).map((item) => (
                <Card key={item.key} className="hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.type === "bug" ? <Bug className="w-3 h-3 text-red-500" /> : <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                      <span className="text-[9px] text-muted-foreground">{item.key}</span>
                    </div>
                    <div className="text-xs font-medium">{item.title}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[9px] text-muted-foreground">{item.assignee}</span>
                      <Badge variant="outline" className="text-[8px]">{item.points}pt</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Releases View ─── */
const releases = [
  { version: "v2.14.0", status: "deploying", date: "Feb 11", changes: 12, breaking: 0, notes: "Webhook retry, Clerk v6 migration" },
  { version: "v2.13.2", status: "live", date: "Feb 8", changes: 4, breaking: 0, notes: "Hotfix: Salesforce sync timeout" },
  { version: "v2.13.1", status: "live", date: "Feb 5", changes: 2, breaking: 0, notes: "Security patch, dependency updates" },
  { version: "v2.13.0", status: "live", date: "Jan 28", changes: 18, breaking: 1, notes: "Pipeline v2, new dashboard views" },
  { version: "v2.12.0", status: "live", date: "Jan 15", changes: 22, breaking: 2, notes: "Spine SSOT, Intelligence overlay" },
]

export function ReleasesView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Releases</h2>
        <Button size="sm"><Rocket className="w-3.5 h-3.5 mr-1.5" /> New Release</Button>
      </div>
      <div className="space-y-3">
        {releases.map((r) => (
          <Card key={r.version} className={r.status === "deploying" ? "border-blue-500/30" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <GitBranch className={`w-5 h-5 ${r.status === "deploying" ? "text-blue-500" : "text-green-500"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{r.version}</span>
                    <Badge variant="outline" className={`text-[9px] ${r.status === "deploying" ? "bg-blue-500/10 text-blue-600" : "bg-green-500/10 text-green-600"}`}>{r.status}</Badge>
                    {r.breaking > 0 && <Badge variant="outline" className="text-[9px] bg-red-500/10 text-red-600">{r.breaking} breaking</Badge>}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{r.date} · {r.changes} changes · {r.notes}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Tech Debt View ─── */
const techDebt = [
  { area: "Legacy Auth Module", severity: "critical", effort: "5d", impact: "Security + performance", owner: "Ravi K.", age: "6mo", progress: 20 },
  { area: "Monolith API routes", severity: "high", effort: "10d", impact: "Maintainability", owner: "Team", age: "1yr", progress: 0 },
  { area: "Test coverage – ingestion", severity: "medium", effort: "3d", impact: "Reliability", owner: "Priya M.", age: "3mo", progress: 45 },
  { area: "Deprecated Webpack config", severity: "low", effort: "2d", impact: "DX", owner: "Dev A.", age: "8mo", progress: 80 },
  { area: "N+1 queries in account list", severity: "high", effort: "1d", impact: "Performance", owner: "Mike R.", age: "2mo", progress: 0 },
]
const debtSev: Record<string, string> = { critical: "text-red-600 bg-red-500/10", high: "text-orange-600 bg-orange-500/10", medium: "text-amber-600 bg-amber-500/10", low: "text-muted-foreground bg-muted" }

export function TechDebtView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tech Debt Backlog</h2>
        <Button size="sm" variant="outline"><Wrench className="w-3.5 h-3.5 mr-1.5" /> Add Item</Button>
      </div>
      <div className="space-y-3">
        {techDebt.map((d) => (
          <Card key={d.area}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className={`w-4 h-4 ${debtSev[d.severity]?.split(" ")[0]}`} />
                <span className="text-sm font-medium flex-1">{d.area}</span>
                <Badge variant="outline" className={`text-[9px] ${debtSev[d.severity]}`}>{d.severity}</Badge>
              </div>
              <Progress value={d.progress} className="h-1.5 mb-1.5" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{d.owner} · Est. {d.effort} · Age: {d.age}</span>
                <span>{d.progress}% addressed</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Incidents View ─── */
const incidents = [
  { id: "INC-042", title: "API gateway 502 errors spike", severity: "P1", status: "investigating", commander: "Ravi K.", started: "2h ago", impact: "15% of API calls failing", mttr: "—" },
  { id: "INC-041", title: "Slow webhook delivery to Slack", severity: "P2", status: "monitoring", commander: "Priya M.", started: "1d ago", impact: "Delayed notifications ~5min", mttr: "—" },
  { id: "INC-040", title: "Data sync lag >60s for Salesforce", severity: "P3", status: "resolved", commander: "Dev Team", started: "3d ago", impact: "Stale data in accounts view", mttr: "4h 22m" },
  { id: "INC-039", title: "Dashboard SSL cert expiry", severity: "P2", status: "resolved", commander: "DevOps", started: "5d ago", impact: "Browser warnings", mttr: "18m" },
]
const incStatusColor: Record<string, string> = { investigating: "bg-red-500/10 text-red-600", monitoring: "bg-amber-500/10 text-amber-600", resolved: "bg-green-500/10 text-green-600" }
const incSevColor: Record<string, string> = { P1: "bg-red-500 text-white", P2: "bg-orange-500 text-white", P3: "bg-amber-500 text-white" }

export function IncidentsView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Incidents</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-red-500/10 text-red-600 text-[10px]">{incidents.filter((i) => i.status !== "resolved").length} active</Badge>
          <Button size="sm" variant="destructive"><AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Declare</Button>
        </div>
      </div>
      <div className="space-y-3">
        {incidents.map((inc) => (
          <Card key={inc.id} className={inc.status === "investigating" ? "border-red-500/30" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={`text-[9px] ${incSevColor[inc.severity]}`}>{inc.severity}</Badge>
                <span className="text-sm font-medium flex-1">{inc.title}</span>
                <Badge variant="outline" className={`text-[9px] ${incStatusColor[inc.status]}`}>{inc.status}</Badge>
              </div>
              <div className="text-[10px] text-muted-foreground space-y-0.5">
                <div>Commander: {inc.commander} · Started: {inc.started}</div>
                <div>Impact: {inc.impact}</div>
                {inc.mttr !== "—" && <div>MTTR: {inc.mttr}</div>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
