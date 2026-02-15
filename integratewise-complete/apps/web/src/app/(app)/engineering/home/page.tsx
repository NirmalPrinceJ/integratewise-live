"use client"

import { DashboardLayout, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Code, GitBranch, Rocket, AlertCircle, TrendingUp, TrendingDown,
  CheckCircle2, Clock, Zap, Users, BarChart3, Activity,
  Bug, Server, Database, CloudIcon
} from "lucide-react"

// Engineering KPIs from docs.md Layer 1: Product & Development Intelligence
const KPIS = [
  {
    label: "Sprint Velocity",
    value: "34 pts",
    change: "-12%",
    trend: "down",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    detail: "4-sprint average: 38 pts"
  },
  {
    label: "Deployment Frequency",
    value: "12/week",
    change: "+8%",
    trend: "up",
    icon: Rocket,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    detail: "Daily deployments enabled"
  },
  {
    label: "Build Success Rate",
    value: "94%",
    change: "-3%",
    trend: "down",
    icon: CheckCircle2,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    detail: "Target: 98%"
  },
  {
    label: "MTTR",
    value: "2.4h",
    change: "-0.8h",
    trend: "up",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    detail: "Mean Time to Repair"
  },
]

// Technical Health from Layer 3
const SYSTEM_HEALTH = [
  { service: "API Gateway", status: "healthy", uptime: "99.98%", latency: "42ms", color: "emerald" },
  { service: "Auth Service", status: "degraded", uptime: "99.12%", latency: "180ms", color: "amber" },
  { service: "Database Primary", status: "healthy", uptime: "99.99%", latency: "8ms", color: "emerald" },
  { service: "Queue Workers", status: "healthy", uptime: "99.85%", latency: "120ms", color: "emerald" },
]

// Sprint Health from Layer 1
const SPRINT_STATUS = {
  total: 47,
  done: 28,
  inProgress: 12,
  blocked: 3,
  todo: 4,
  burndown: [34, 32, 29, 25, 22, 19, 15, 12, 10, 8, 5, 3, 0] // Day-by-day ideal
}

// Technical Debt from Layer 1
const TECHNICAL_DEBT = [
  { item: "Authentication Service Refactor", effort: "8 weeks", impact: "High", incidents: "15%", velocity: "-23%", priority: "P0" },
  { item: "Legacy API v1 Deprecation", effort: "4 weeks", impact: "Medium", incidents: "8%", velocity: "-12%", priority: "P1" },
  { item: "Database Query Optimization", effort: "2 weeks", impact: "Medium", incidents: "5%", velocity: "-8%", priority: "P2" },
]

// Incident Intelligence from Layer 3
const RECENT_INCIDENTS = [
  { id: "INC-1247", severity: "critical", service: "API Gateway", status: "resolved", duration: "45m", impact: "Customer logins", resolved: "2h ago" },
  { id: "INC-1246", severity: "high", service: "Auth Service", status: "investigating", duration: "ongoing", impact: "Slow authentication", resolved: "" },
  { id: "INC-1245", severity: "medium", service: "Email Service", status: "resolved", duration: "1.2h", impact: "Delayed notifications", resolved: "5h ago" },
]

export default function EngineeringHomePage() {
  return (
    <DashboardLayout 
      title="Engineering" 
      description="Product development intelligence, system health, and technical excellence metrics"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Incident Dashboard
          </Button>
          <Button variant="outline" size="sm">
            <GitBranch className="w-4 h-4 mr-2" />
            Roadmap
          </Button>
          <Button size="sm">
            <Rocket className="w-4 h-4 mr-2" />
            Deploy
          </Button>
        </div>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {KPIS.map((kpi) => (
          <Card key={kpi.label} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <Badge variant={kpi.trend === "up" ? "default" : "secondary"} className="text-xs">
                {kpi.change}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-sm text-slate-600 font-medium">{kpi.label}</p>
              <p className="text-xs text-slate-500">{kpi.detail}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sprint Health */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Sprint #42 Progress</h3>
              <p className="text-sm text-slate-600">Day 12 of 14 • 60% complete</p>
            </div>
            <Button variant="outline" size="sm">
              <GitBranch className="w-4 h-4 mr-2" />
              View Board
            </Button>
          </div>

          {/* Sprint Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{SPRINT_STATUS.done}</div>
              <div className="text-xs text-slate-600">Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{SPRINT_STATUS.inProgress}</div>
              <div className="text-xs text-slate-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{SPRINT_STATUS.blocked}</div>
              <div className="text-xs text-slate-600">Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-400">{SPRINT_STATUS.todo}</div>
              <div className="text-xs text-slate-600">To Do</div>
            </div>
          </div>

          {/* Burndown Chart Placeholder */}
          <div className="h-48 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Sprint Burndown Chart</p>
              <p className="text-xs">Tracking toward goal</p>
            </div>
          </div>
        </Card>

        {/* System Health */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">System Health</h3>
            <Button variant="ghost" size="sm">
              <Server className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {SYSTEM_HEALTH.map((service) => (
              <div key={service.service} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{service.service}</span>
                  <Badge 
                    variant={service.status === "healthy" ? "default" : "secondary"}
                    className={service.status === "healthy" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}
                  >
                    {service.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Uptime: {service.uptime}</span>
                  <span>Latency: {service.latency}</span>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" className="w-full mt-4">
            <Activity className="w-4 h-4 mr-2" />
            View All Services
          </Button>
        </Card>
      </div>

      {/* Technical Debt & Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Debt */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Technical Debt</h3>
              <p className="text-sm text-slate-600">Estimated 14 weeks remediation</p>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>

          <div className="space-y-4">
            {TECHNICAL_DEBT.map((item, idx) => (
              <div key={idx} className="border-l-4 border-l-rose-500 pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium">{item.item}</span>
                  <Badge variant="outline" className="text-xs">{item.priority}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                  <div>Effort: {item.effort}</div>
                  <div>Incidents: {item.incidents}</div>
                  <div>Impact: {item.velocity}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-700">
                <strong>High Priority:</strong> Authentication service refactor blocking 23% of feature velocity
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Incidents */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Recent Incidents</h3>
              <p className="text-sm text-slate-600">Last 24 hours</p>
            </div>
            <Button variant="outline" size="sm">
              <Bug className="w-4 h-4 mr-2" />
              Create PIR
            </Button>
          </div>

          <div className="space-y-4">
            {RECENT_INCIDENTS.map((incident) => (
              <div key={incident.id} className="border-l-4 border-l-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-mono font-medium">{incident.id}</span>
                    <Badge 
                      variant="outline" 
                      className={`ml-2 text-xs ${
                        incident.severity === "critical" ? "border-rose-500 text-rose-700" :
                        incident.severity === "high" ? "border-amber-500 text-amber-700" :
                        "border-blue-500 text-blue-700"
                      }`}
                    >
                      {incident.severity}
                    </Badge>
                  </div>
                  <Badge variant={incident.status === "resolved" ? "default" : "secondary"}>
                    {incident.status}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Service:</strong> {incident.service}</div>
                  <div><strong>Impact:</strong> {incident.impact}</div>
                  <div><strong>Duration:</strong> {incident.duration}</div>
                  {incident.resolved && <div className="text-emerald-600"><strong>Resolved:</strong> {incident.resolved}</div>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
