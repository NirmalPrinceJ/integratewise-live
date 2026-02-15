"use client"

import { DashboardLayout, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, TrendingUp, TrendingDown, AlertTriangle,
  UserPlus, UserMinus, Clock, Heart, Target,
  Briefcase, GraduationCap, Award, Activity
} from "lucide-react"

// People/HR KPIs from docs.md Layer 1: HR Intelligence
const KPIS = [
  {
    label: "Headcount",
    value: "142",
    change: "+8",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    detail: "Q1 growth"
  },
  {
    label: "Attrition Rate",
    value: "8.4%",
    change: "+1.2%",
    trend: "down",
    icon: UserMinus,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    detail: "12-month rolling"
  },
  {
    label: "Time to Fill",
    value: "32 days",
    change: "-5 days",
    trend: "up",
    icon: Clock,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    detail: "Avg for open roles"
  },
  {
    label: "Engagement Score",
    value: "7.8/10",
    change: "+0.3",
    trend: "up",
    icon: Heart,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    detail: "Last pulse survey"
  },
]

// Flight Risk Dashboard from Layer 7
const FLIGHT_RISK_EMPLOYEES = [
  { 
    name: "Sarah Chen", 
    role: "Senior Engineer", 
    department: "Engineering", 
    riskScore: 78, 
    signals: ["LinkedIn activity +120%", "Meeting decline rate +40%", "No 1:1s last 3 weeks"],
    tenure: "2.5 years",
    severity: "high"
  },
  { 
    name: "Marcus Johnson", 
    role: "Product Manager", 
    department: "Product", 
    riskScore: 71, 
    signals: ["Glassdoor searches", "Reduced code reviews", "Declined project lead role"],
    tenure: "1.8 years",
    severity: "high"
  },
  { 
    name: "Emily Rodriguez", 
    role: "CS Manager", 
    department: "Customer Success", 
    riskScore: 65, 
    signals: ["Team satisfaction -15%", "PTO usage spike", "Resume updated"],
    tenure: "3.2 years",
    severity: "medium"
  },
]

// Skills Gap Analysis from Layer 5
const SKILLS_GAPS = [
  { 
    skill: "Kubernetes", 
    currentLevel: 2, 
    requiredLevel: 4, 
    gap: 2, 
    impactedProjects: ["Platform Migration", "Service Mesh"], 
    priority: "high" 
  },
  { 
    skill: "React 19", 
    currentLevel: 3, 
    requiredLevel: 5, 
    gap: 2, 
    impactedProjects: ["UI Refresh"], 
    priority: "medium" 
  },
  { 
    skill: "Go/Golang", 
    currentLevel: 1, 
    requiredLevel: 3, 
    gap: 2, 
    impactedProjects: ["Microservices"], 
    priority: "medium" 
  },
]

// Open Roles from Layer 1
const OPEN_ROLES = [
  { title: "Senior Backend Engineer", department: "Engineering", daysOpen: 28, candidates: 12, stage: "Final Round" },
  { title: "Product Designer", department: "Product", daysOpen: 45, candidates: 8, stage: "Phone Screen" },
  { title: "Customer Success Manager", department: "CS", daysOpen: 15, candidates: 18, stage: "Sourcing" },
  { title: "DevOps Engineer", department: "Engineering", daysOpen: 52, candidates: 5, stage: "Offer" },
]

// Recent Departures
const RECENT_DEPARTURES = [
  { name: "Alex Kim", role: "Engineering Manager", department: "Engineering", exitDate: "2025-01-15", reason: "Better opportunity", regrettable: true },
  { name: "Lisa Patel", role: "Sales Rep", department: "Sales", exitDate: "2025-01-08", reason: "Relocation", regrettable: false },
  { name: "Tom Wilson", role: "QA Lead", department: "Engineering", exitDate: "2024-12-20", reason: "Career change", regrettable: true },
]

export default function PeopleHomePage() {
  return (
    <DashboardLayout 
      title="People & Culture" 
      description="Workforce intelligence, talent management, and organizational health analytics"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Award className="w-4 h-4 mr-2" />
            Performance Reviews
          </Button>
          <Button variant="outline" size="sm">
            <GraduationCap className="w-4 h-4 mr-2" />
            Learning Paths
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            New Hire
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

      {/* Flight Risk & Skills Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Flight Risk Dashboard */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Flight Risk Analysis</h3>
              <p className="text-sm text-slate-600">Predictive retention signals</p>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>

          <div className="space-y-4">
            {FLIGHT_RISK_EMPLOYEES.map((employee) => (
              <div key={employee.name} className="border-l-4 border-l-rose-500 pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium">{employee.name}</span>
                    <div className="text-xs text-slate-600 mt-1">{employee.role} • {employee.department}</div>
                    <div className="text-xs text-slate-500">Tenure: {employee.tenure}</div>
                  </div>
                  <Badge variant={employee.severity === "high" ? "destructive" : "secondary"}>
                    {employee.riskScore}% risk
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {employee.signals.map((signal, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {signal}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700">
                <strong>Recommended:</strong> Schedule 1:1s with high-risk employees within 48 hours. Historical conversion: 60% retention with early intervention.
              </div>
            </div>
          </div>
        </Card>

        {/* Skills Gap Analysis */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Skills Gap Analysis</h3>
              <p className="text-sm text-slate-600">Current vs. required capabilities</p>
            </div>
            <Button variant="outline" size="sm">
              <GraduationCap className="w-4 h-4 mr-2" />
              Training Plans
            </Button>
          </div>

          <div className="space-y-4">
            {SKILLS_GAPS.map((skill) => (
              <div key={skill.skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{skill.skill}</span>
                    <Badge 
                      variant="outline" 
                      className={`ml-2 text-xs ${skill.priority === 'high' ? 'border-rose-500 text-rose-700' : 'border-amber-500 text-amber-700'}`}
                    >
                      {skill.priority} priority
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-600">Gap: {skill.gap} levels</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ width: `${(skill.currentLevel / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 w-16 text-right">{skill.currentLevel}/5</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {skill.impactedProjects.map((project, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {project}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" className="w-full mt-4">
            <Target className="w-4 h-4 mr-2" />
            Create Learning Paths
          </Button>
        </Card>
      </div>

      {/* Hiring Pipeline & Recent Departures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Roles Pipeline */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Hiring Pipeline</h3>
              <p className="text-sm text-slate-600">4 open positions</p>
            </div>
            <Button variant="outline" size="sm">
              <Briefcase className="w-4 h-4 mr-2" />
              All Jobs
            </Button>
          </div>

          <div className="space-y-3">
            {OPEN_ROLES.map((role) => (
              <div key={role.title} className="p-4 rounded-lg border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium">{role.title}</span>
                    <div className="text-xs text-slate-600 mt-1">{role.department}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {role.daysOpen} days open
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-600">{role.candidates} candidates</span>
                  <Badge variant="secondary" className="text-xs">
                    {role.stage}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Departures */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Recent Departures</h3>
              <p className="text-sm text-slate-600">Last 90 days</p>
            </div>
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              Exit Interviews
            </Button>
          </div>

          <div className="space-y-3">
            {RECENT_DEPARTURES.map((departure) => (
              <div key={departure.name} className={`p-4 rounded-lg border ${departure.regrettable ? 'border-rose-200 bg-rose-50' : 'border-slate-200'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{departure.name}</span>
                      {departure.regrettable && (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">{departure.role} • {departure.department}</div>
                  </div>
                  <span className="text-xs text-slate-500">{departure.exitDate}</span>
                </div>
                <div className="mt-2">
                  <Badge variant={departure.regrettable ? "destructive" : "secondary"} className="text-xs">
                    {departure.reason}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs text-blue-700">
              <strong>Insight:</strong> 67% of departures are regrettable. Top reason: Limited career growth opportunities.
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
