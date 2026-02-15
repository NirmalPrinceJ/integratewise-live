"use client"

import { DashboardLayout, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, Target, TrendingUp, Users, Calendar,
  ChevronRight, CheckCircle2, AlertTriangle, Clock,
  BarChart3, Filter, Building2, MoreHorizontal
} from "lucide-react"
import { useState } from "react"

const COMPANY_GOALS = [
  {
    id: "cg-001",
    title: "Achieve ₹100Cr ARR",
    description: "Scale annual recurring revenue to ₹100 crore by end of FY2026",
    category: "revenue",
    target: "₹100Cr",
    current: "₹72Cr",
    progress: 72,
    status: "on-track",
    owner: "CEO",
    quarter: "Q4 FY26",
    departments: ["Sales", "Marketing", "Customer Success"],
  },
  {
    id: "cg-002",
    title: "Net Promoter Score > 70",
    description: "Improve customer satisfaction and loyalty metrics",
    category: "customer",
    target: "70",
    current: "65",
    progress: 93,
    status: "on-track",
    owner: "Chief Customer Officer",
    quarter: "Q4 FY26",
    departments: ["Customer Success", "Product"],
  },
  {
    id: "cg-003",
    title: "Launch Enterprise Platform",
    description: "Complete and launch enterprise-grade platform with SSO, RBAC, and audit logging",
    category: "product",
    target: "100%",
    current: "78%",
    progress: 78,
    status: "at-risk",
    owner: "CTO",
    quarter: "Q3 FY26",
    departments: ["Engineering", "Product"],
  },
  {
    id: "cg-004",
    title: "Expand to 5 Countries",
    description: "International expansion into new markets",
    category: "growth",
    target: "5",
    current: "3",
    progress: 60,
    status: "behind",
    owner: "VP Growth",
    quarter: "Q4 FY26",
    departments: ["Sales", "Operations"],
  },
]

const DEPARTMENT_GOALS = [
  {
    department: "Sales",
    color: "bg-blue-500",
    goals: [
      { title: "Close 50 Enterprise Deals", progress: 68, status: "on-track" },
      { title: "Average Deal Size > ₹15L", progress: 85, status: "ahead" },
      { title: "Sales Cycle < 45 Days", progress: 52, status: "at-risk" },
    ]
  },
  {
    department: "Marketing",
    color: "bg-purple-500",
    goals: [
      { title: "Generate 2000 MQLs", progress: 74, status: "on-track" },
      { title: "Content Library: 100 Assets", progress: 92, status: "ahead" },
      { title: "Brand Awareness +30%", progress: 45, status: "behind" },
    ]
  },
  {
    department: "Customer Success",
    color: "bg-amber-500",
    goals: [
      { title: "Gross Retention > 95%", progress: 98, status: "ahead" },
      { title: "Net Retention > 120%", progress: 88, status: "on-track" },
      { title: "Onboarding Time < 14 Days", progress: 62, status: "at-risk" },
    ]
  },
  {
    department: "Engineering",
    color: "bg-indigo-500",
    goals: [
      { title: "99.9% Uptime SLA", progress: 99, status: "ahead" },
      { title: "Deploy Frequency: Daily", progress: 75, status: "on-track" },
      { title: "Technical Debt: -40%", progress: 35, status: "behind" },
    ]
  },
]

const statusConfig = {
  "on-track": { label: "On Track", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700" },
  "at-risk": { label: "At Risk", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
  "ahead": { label: "Ahead", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
  "behind": { label: "Behind", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700" },
}

export default function AdminGoalsPage() {
  const [view, setView] = useState<"company" | "department">("company")

  const stats = {
    total: COMPANY_GOALS.length + DEPARTMENT_GOALS.reduce((acc, d) => acc + d.goals.length, 0),
    onTrack: 8,
    atRisk: 4,
    behind: 3,
    ahead: 5,
  }

  return (
    <DashboardLayout 
      title="Goals Administration" 
      description="Manage company and departmental OKRs"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>
      }
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Goals</span>
            <Target className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-1">Company + Dept</p>
        </Card>
        
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-green-700">On Track</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">{stats.onTrack}</p>
        </Card>
        
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700">Ahead</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{stats.ahead}</p>
        </Card>
        
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-700">At Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700">{stats.atRisk}</p>
        </Card>
        
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-red-700">Behind</span>
            <Clock className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-700">{stats.behind}</p>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setView("company")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            view === "company" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Building2 className="w-4 h-4 inline mr-2" />
          Company Goals
        </button>
        <button
          onClick={() => setView("department")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            view === "department" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Department Goals
        </button>
      </div>

      {/* Company Goals View */}
      {view === "company" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {COMPANY_GOALS.map((goal) => {
            const config = statusConfig[goal.status as keyof typeof statusConfig]
            return (
              <Card key={goal.id} className={`p-5 ${config.bg} ${config.border} hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={config.badge}>
                        {config.label}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-100 text-slate-600 text-[10px]">
                        {goal.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900">{goal.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{goal.description}</p>
                  </div>
                  <button className="p-1 hover:bg-white/50 rounded" title="More options">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">{goal.current} of {goal.target}</span>
                    <span className={`font-semibold ${config.text}`}>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-2">
                    <div 
                      className={`${config.text.replace('text-', 'bg-')} h-2 rounded-full`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between pt-3 border-t border-white/40 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {goal.owner}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {goal.quarter}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {goal.departments.slice(0, 2).map((dept) => (
                      <Badge key={dept} variant="outline" className="text-[10px] px-1.5 py-0">
                        {dept}
                      </Badge>
                    ))}
                    {goal.departments.length > 2 && (
                      <span className="text-[10px] text-slate-400">+{goal.departments.length - 2}</span>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Department Goals View */}
      {view === "department" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEPARTMENT_GOALS.map((dept) => (
            <Card key={dept.department} className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${dept.color}`} />
                <h3 className="font-semibold text-slate-900">{dept.department}</h3>
                <Badge variant="outline" className="text-[10px]">
                  {dept.goals.length} Goals
                </Badge>
              </div>

              <div className="space-y-3">
                {dept.goals.map((goal, idx) => {
                  const config = statusConfig[goal.status as keyof typeof statusConfig]
                  return (
                    <div key={idx} className={`p-3 rounded-lg ${config.bg} border ${config.border}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">{goal.title}</span>
                        <Badge variant="outline" className={`${config.badge} text-[10px]`}>
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/60 rounded-full h-1.5">
                          <div 
                            className={`${config.text.replace('text-', 'bg-')} h-1.5 rounded-full`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${config.text}`}>{goal.progress}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button className="flex items-center gap-1 mt-4 text-xs font-medium text-slate-600 hover:text-slate-900">
                View All {dept.department} Goals
                <ChevronRight className="w-3 h-3" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
