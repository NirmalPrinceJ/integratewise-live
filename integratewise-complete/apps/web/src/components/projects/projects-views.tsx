"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  FolderKanban,
  Calendar,
  Target,
  Clock,
  Users,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowRight,
  Plus,
  Milestone,
  BarChart3,
  Timer,
  Flag,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Projects Dashboard (for /projects/today and /projects/home)       */
/* ------------------------------------------------------------------ */

const dashboardProjects = [
  { id: "PRJ-001", name: "Platform Migration v3", status: "active", progress: 68, tasks: { done: 34, total: 50 }, lead: "Alex M.", due: "Mar 15" },
  { id: "PRJ-002", name: "Mobile App Redesign", status: "active", progress: 42, tasks: { done: 21, total: 50 }, lead: "Sarah K.", due: "Apr 02" },
  { id: "PRJ-003", name: "API Gateway Rebuild", status: "at-risk", progress: 25, tasks: { done: 8, total: 32 }, lead: "James L.", due: "Feb 28" },
  { id: "PRJ-004", name: "Data Pipeline Optimization", status: "completed", progress: 100, tasks: { done: 18, total: 18 }, lead: "Lisa P.", due: "Jan 30" },
]

const upcomingMilestones = [
  { name: "Beta Release", project: "Platform Migration v3", date: "Feb 20", status: "on-track" },
  { name: "Design Review", project: "Mobile App Redesign", date: "Feb 18", status: "at-risk" },
  { name: "Load Testing", project: "API Gateway Rebuild", date: "Mar 05", status: "on-track" },
]

export function ProjectsDashboard() {
  const activeCount = dashboardProjects.filter(p => p.status === "active").length
  const atRiskCount = dashboardProjects.filter(p => p.status === "at-risk").length
  const totalTasks = dashboardProjects.reduce((s, p) => s + p.tasks.total, 0)
  const doneTasks = dashboardProjects.reduce((s, p) => s + p.tasks.done, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projects Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Track progress across all active projects</p>
        </div>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Project</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Projects", value: activeCount, icon: FolderKanban, color: "text-blue-500" },
          { label: "At Risk", value: atRiskCount, icon: AlertCircle, color: "text-amber-500" },
          { label: "Tasks Complete", value: `${doneTasks}/${totalTasks}`, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Upcoming Milestones", value: upcomingMilestones.length, icon: Milestone, color: "text-purple-500" },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                </div>
                <kpi.icon className={`h-8 w-8 ${kpi.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Projects */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FolderKanban className="h-5 w-5" /> Active Projects</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardProjects.map(proj => (
              <div key={proj.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{proj.name}</span>
                    <Badge variant={proj.status === "completed" ? "default" : proj.status === "at-risk" ? "destructive" : "secondary"} className="text-xs">
                      {proj.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {proj.lead}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Due {proj.due}</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {proj.tasks.done}/{proj.tasks.total} tasks</span>
                  </div>
                </div>
                <div className="w-32 space-y-1">
                  <div className="flex justify-between text-xs"><span>{proj.progress}%</span></div>
                  <Progress value={proj.progress} className="h-2" />
                </div>
                <Button variant="ghost" size="icon"><ArrowRight className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Milestones */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Milestone className="h-5 w-5" /> Upcoming Milestones</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingMilestones.map((ms, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{ms.name}</p>
                  <p className="text-xs text-muted-foreground">{ms.project}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{ms.date}</span>
                  <Badge variant={ms.status === "at-risk" ? "destructive" : "secondary"}>{ms.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  All Projects View                                                  */
/* ------------------------------------------------------------------ */

const allProjectsList = [
  { id: "PRJ-001", name: "Platform Migration v3", status: "active", priority: "high", progress: 68, owner: "Alex M.", team: 8, startDate: "Nov 01", endDate: "Mar 15", budget: "$120K" },
  { id: "PRJ-002", name: "Mobile App Redesign", status: "active", priority: "high", progress: 42, owner: "Sarah K.", team: 6, startDate: "Dec 15", endDate: "Apr 02", budget: "$85K" },
  { id: "PRJ-003", name: "API Gateway Rebuild", status: "at-risk", priority: "critical", progress: 25, owner: "James L.", team: 5, startDate: "Jan 10", endDate: "Feb 28", budget: "$60K" },
  { id: "PRJ-004", name: "Data Pipeline Optimization", status: "completed", priority: "medium", progress: 100, owner: "Lisa P.", team: 3, startDate: "Oct 01", endDate: "Jan 30", budget: "$45K" },
  { id: "PRJ-005", name: "Customer Portal v2", status: "planning", priority: "medium", progress: 0, owner: "Omar H.", team: 4, startDate: "Mar 01", endDate: "Jun 15", budget: "$95K" },
  { id: "PRJ-006", name: "Security Audit Automation", status: "active", priority: "high", progress: 55, owner: "Nina R.", team: 3, startDate: "Jan 05", endDate: "Mar 20", budget: "$35K" },
]

const priorityColor: Record<string, string> = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
}

const statusColor: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "at-risk": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  planning: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  paused: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
}

export function AllProjectsView() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">All Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">{allProjectsList.length} projects across your organization</p>
        </div>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Project</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Project</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Priority</th>
                  <th className="pb-3 font-medium">Progress</th>
                  <th className="pb-3 font-medium">Owner</th>
                  <th className="pb-3 font-medium">Team</th>
                  <th className="pb-3 font-medium">Timeline</th>
                  <th className="pb-3 font-medium">Budget</th>
                </tr>
              </thead>
              <tbody>
                {allProjectsList.map(proj => (
                  <tr key={proj.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{proj.name}</p>
                        <p className="text-xs text-muted-foreground">{proj.id}</p>
                      </div>
                    </td>
                    <td className="py-3"><Badge className={statusColor[proj.status]}>{proj.status}</Badge></td>
                    <td className="py-3"><Badge className={priorityColor[proj.priority]}>{proj.priority}</Badge></td>
                    <td className="py-3">
                      <div className="flex items-center gap-2 w-24">
                        <Progress value={proj.progress} className="h-2" />
                        <span className="text-xs text-muted-foreground">{proj.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{proj.owner}</td>
                    <td className="py-3 text-muted-foreground">{proj.team}</td>
                    <td className="py-3 text-xs text-muted-foreground">{proj.startDate} – {proj.endDate}</td>
                    <td className="py-3 font-medium">{proj.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Timeline View                                                      */
/* ------------------------------------------------------------------ */

const timelineItems = [
  { id: "PRJ-001", name: "Platform Migration v3", startWeek: 1, durationWeeks: 16, progress: 68, color: "bg-blue-500" },
  { id: "PRJ-002", name: "Mobile App Redesign", startWeek: 5, durationWeeks: 14, progress: 42, color: "bg-emerald-500" },
  { id: "PRJ-003", name: "API Gateway Rebuild", startWeek: 8, durationWeeks: 8, progress: 25, color: "bg-amber-500" },
  { id: "PRJ-006", name: "Security Audit Automation", startWeek: 7, durationWeeks: 10, progress: 55, color: "bg-purple-500" },
  { id: "PRJ-005", name: "Customer Portal v2", startWeek: 14, durationWeeks: 15, progress: 0, color: "bg-pink-500" },
]

const totalWeeks = 24
const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"]

export function TimelineView() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Project Timeline</h2>
        <p className="text-sm text-muted-foreground mt-1">Gantt view of all active projects</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Month headers */}
          <div className="flex mb-4">
            <div className="w-48 shrink-0" />
            <div className="flex-1 flex">
              {months.map(m => (
                <div key={m} className="flex-1 text-xs text-muted-foreground text-center border-l border-dashed">{m}</div>
              ))}
            </div>
          </div>

          {/* Gantt rows */}
          <div className="space-y-3">
            {timelineItems.map(item => (
              <div key={item.id} className="flex items-center">
                <div className="w-48 shrink-0 pr-4">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.id}</p>
                </div>
                <div className="flex-1 relative h-8 bg-muted/30 rounded">
                  <div
                    className={`absolute top-1 h-6 ${item.color} rounded opacity-80 flex items-center px-2`}
                    style={{
                      left: `${(item.startWeek / totalWeeks) * 100}%`,
                      width: `${(item.durationWeeks / totalWeeks) * 100}%`,
                    }}
                  >
                    <span className="text-xs text-white font-medium">{item.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Today marker */}
          <div className="flex mt-2">
            <div className="w-48 shrink-0" />
            <div className="flex-1 relative">
              <div className="absolute h-full border-l-2 border-red-500" style={{ left: `${(12 / totalWeeks) * 100}%` }}>
                <span className="text-[10px] text-red-500 ml-1">Today</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Milestones View                                                    */
/* ------------------------------------------------------------------ */

const milestones = [
  { id: "MS-001", name: "Beta Release", project: "Platform Migration v3", date: "Feb 20", status: "on-track", owner: "Alex M.", dependencies: 3, completedDeps: 2 },
  { id: "MS-002", name: "Design System Handoff", project: "Mobile App Redesign", date: "Feb 18", status: "at-risk", owner: "Sarah K.", dependencies: 5, completedDeps: 2 },
  { id: "MS-003", name: "Load Testing Complete", project: "API Gateway Rebuild", date: "Mar 05", status: "on-track", owner: "James L.", dependencies: 4, completedDeps: 3 },
  { id: "MS-004", name: "GA Launch", project: "Platform Migration v3", date: "Mar 15", status: "on-track", owner: "Alex M.", dependencies: 8, completedDeps: 5 },
  { id: "MS-005", name: "Compliance Sign-off", project: "Security Audit Automation", date: "Mar 10", status: "completed", owner: "Nina R.", dependencies: 6, completedDeps: 6 },
  { id: "MS-006", name: "App Store Submission", project: "Mobile App Redesign", date: "Mar 28", status: "on-track", owner: "Sarah K.", dependencies: 7, completedDeps: 2 },
]

const msStatusIcon: Record<string, typeof CheckCircle2> = {
  "on-track": Circle,
  "at-risk": AlertCircle,
  "completed": CheckCircle2,
  "blocked": AlertCircle,
}

export function MilestonesView() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Milestones</h2>
          <p className="text-sm text-muted-foreground mt-1">Key deliverables across all projects</p>
        </div>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Milestone</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {milestones.map(ms => {
          const StatusIcon = msStatusIcon[ms.status] || Circle
          return (
            <Card key={ms.id} className={ms.status === "at-risk" ? "border-amber-500/50" : ms.status === "completed" ? "border-emerald-500/50" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <StatusIcon className={`h-5 w-5 mt-0.5 ${ms.status === "completed" ? "text-emerald-500" : ms.status === "at-risk" ? "text-amber-500" : "text-blue-500"}`} />
                    <div>
                      <p className="font-medium">{ms.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{ms.project}</p>
                    </div>
                  </div>
                  <Badge variant={ms.status === "at-risk" ? "destructive" : ms.status === "completed" ? "default" : "secondary"}>
                    {ms.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {ms.date}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {ms.owner}</span>
                  <span className="flex items-center gap-1"><Flag className="h-3 w-3" /> {ms.completedDeps}/{ms.dependencies} deps</span>
                </div>

                <div className="mt-3">
                  <Progress value={(ms.completedDeps / ms.dependencies) * 100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Resources View (Project-specific)                                  */
/* ------------------------------------------------------------------ */

const projectResources = [
  { name: "Alex Martinez", role: "Tech Lead", allocation: 100, project: "Platform Migration v3", skills: ["React", "Node.js", "AWS"] },
  { name: "Sarah Kim", role: "Senior Designer", allocation: 80, project: "Mobile App Redesign", skills: ["Figma", "UI/UX", "Motion"] },
  { name: "James Lee", role: "Backend Engineer", allocation: 100, project: "API Gateway Rebuild", skills: ["Go", "gRPC", "K8s"] },
  { name: "Lisa Park", role: "Data Engineer", allocation: 40, project: "Data Pipeline", skills: ["Python", "Spark", "Airflow"] },
  { name: "Nina Rao", role: "Security Engineer", allocation: 60, project: "Security Audit", skills: ["Pen Testing", "SAST", "SOC2"] },
  { name: "Omar Hassan", role: "PM", allocation: 50, project: "Customer Portal v2", skills: ["Jira", "Roadmapping", "Agile"] },
]

export function ProjectResourcesView() {
  const overAllocated = projectResources.filter(r => r.allocation > 90).length

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Project Resources</h2>
        <p className="text-sm text-muted-foreground mt-1">Team allocation across projects</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{projectResources.length}</p>
            <p className="text-sm text-muted-foreground">Team Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{Math.round(projectResources.reduce((s, r) => s + r.allocation, 0) / projectResources.length)}%</p>
            <p className="text-sm text-muted-foreground">Avg Allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-amber-500">{overAllocated}</p>
            <p className="text-sm text-muted-foreground">Over-allocated</p>
          </CardContent>
        </Card>
      </div>

      {/* Resource list */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {projectResources.map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  {r.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role} · {r.project}</p>
                </div>
                <div className="flex items-center gap-2">
                  {r.skills.slice(0, 2).map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                </div>
                <div className="w-24 space-y-1 text-right">
                  <span className={`text-sm font-medium ${r.allocation > 90 ? "text-amber-500" : "text-emerald-500"}`}>{r.allocation}%</span>
                  <Progress value={r.allocation} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
