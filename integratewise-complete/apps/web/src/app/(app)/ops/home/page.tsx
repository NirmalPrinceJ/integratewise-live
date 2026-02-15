"use client"

import { DashboardLayout, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, TrendingUp, Zap, Activity, Target,
  Calendar, BarChart3, ArrowUpRight, ArrowDownRight,
  CheckCircle2, Clock, AlertTriangle, Users,
  Workflow, Settings, RefreshCw, Play, Pause
} from "lucide-react"

// Ops KPIs
const KPIS = [
  {
    label: "Active Workflows",
    value: "24",
    change: "+4",
    trend: "up",
    icon: Workflow,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    label: "Tasks Completed",
    value: "156",
    change: "+23%",
    trend: "up",
    icon: CheckCircle2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Avg Cycle Time",
    value: "2.4d",
    change: "-0.6d",
    trend: "up",
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    label: "Automation Rate",
    value: "78%",
    change: "+5%",
    trend: "up",
    icon: Zap,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
]

// Active processes
const PROCESSES = [
  {
    name: "Customer Onboarding",
    status: "healthy",
    instances: 12,
    avgDuration: "3.2 days",
    completionRate: 94,
  },
  {
    name: "Invoice Processing",
    status: "warning",
    instances: 45,
    avgDuration: "1.8 days",
    completionRate: 87,
  },
  {
    name: "Support Escalation",
    status: "healthy",
    instances: 8,
    avgDuration: "4.1 hours",
    completionRate: 98,
  },
  {
    name: "Lead Qualification",
    status: "critical",
    instances: 34,
    avgDuration: "2.5 days",
    completionRate: 72,
  },
]

// Recent automations
const AUTOMATIONS = [
  { name: "Slack → CRM Sync", runs: 1245, success: 99.2, lastRun: "2 min ago", status: "active" },
  { name: "Invoice Generation", runs: 342, success: 98.5, lastRun: "15 min ago", status: "active" },
  { name: "Lead Scoring", runs: 892, success: 97.8, lastRun: "5 min ago", status: "active" },
  { name: "Report Distribution", runs: 56, success: 100, lastRun: "1 hour ago", status: "paused" },
]

// Team workload
const TEAM_WORKLOAD = [
  { name: "Operations Team", tasks: 45, capacity: 80 },
  { name: "Support Team", tasks: 34, capacity: 75 },
  { name: "Finance Team", tasks: 28, capacity: 60 },
  { name: "HR Team", tasks: 18, capacity: 45 },
]

// Pending approvals
const APPROVALS = [
  { title: "Budget Increase Request", requester: "Sales Team", priority: "high", waiting: "2 days" },
  { title: "New Vendor Onboarding", requester: "Procurement", priority: "medium", waiting: "1 day" },
  { title: "Policy Update Review", requester: "Legal", priority: "low", waiting: "4 days" },
]

export default function OpsHomePage() {
  return (
    <DashboardLayout 
      title="Operations Dashboard" 
      description="Workflows, automations, and process health"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            This Week
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPIS.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card key={idx} className={`p-4 ${kpi.bgColor} border-transparent`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-red-600" />
                )}
                <span className={`text-xs font-medium ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {kpi.change}
                </span>
                <span className="text-xs text-slate-500">vs last week</span>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Process Health */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Process Health</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {PROCESSES.map((process, idx) => (
                <div key={idx} className={`p-3 rounded-lg border ${
                  process.status === "healthy" ? "bg-green-50 border-green-100" :
                  process.status === "warning" ? "bg-amber-50 border-amber-100" :
                  "bg-red-50 border-red-100"
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-900">{process.name}</h4>
                        <Badge variant="outline" className={`text-[10px] ${
                          process.status === "healthy" ? "bg-green-100 text-green-700 border-green-200" :
                          process.status === "warning" ? "bg-amber-100 text-amber-700 border-amber-200" :
                          "bg-red-100 text-red-700 border-red-200"
                        }`}>
                          {process.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>{process.instances} active</span>
                        <span>•</span>
                        <span>Avg: {process.avgDuration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900">{process.completionRate}%</span>
                      <p className="text-xs text-slate-500">completion</p>
                    </div>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        process.completionRate >= 90 ? "bg-green-500" :
                        process.completionRate >= 80 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${process.completionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Automations */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Active Automations</h3>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            <div className="space-y-3">
              {AUTOMATIONS.map((auto, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${auto.status === "active" ? "bg-green-100" : "bg-slate-200"}`}>
                    {auto.status === "active" ? (
                      <Play className="w-4 h-4 text-green-600" />
                    ) : (
                      <Pause className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-slate-900">{auto.name}</h4>
                      <Badge variant="outline" className={`text-[10px] ${
                        auto.status === "active" 
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {auto.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{auto.runs.toLocaleString()} runs</span>
                      <span>•</span>
                      <span>{auto.success}% success</span>
                      <span>•</span>
                      <span>Last: {auto.lastRun}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Team Workload */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Team Workload</h3>
              <Badge variant="outline">This Week</Badge>
            </div>
            <div className="space-y-3">
              {TEAM_WORKLOAD.map((team, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600">{team.name}</span>
                    <span className="font-medium text-slate-900">{team.tasks} tasks</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        team.capacity >= 70 ? "bg-amber-500" :
                        team.capacity >= 50 ? "bg-blue-500" : "bg-green-500"
                      }`}
                      style={{ width: `${team.capacity}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{team.capacity}% capacity</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Pending Approvals */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Pending Approvals</h3>
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                {APPROVALS.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {APPROVALS.map((approval, idx) => (
                <div key={idx} className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{approval.title}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{approval.requester}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {approval.waiting}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${
                      approval.priority === "high" ? "bg-red-100 text-red-700 border-red-200" :
                      approval.priority === "medium" ? "bg-amber-100 text-amber-700 border-amber-200" :
                      "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {approval.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3" size="sm">
              Review All
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Workflow className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                New Automation
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync All Systems
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
