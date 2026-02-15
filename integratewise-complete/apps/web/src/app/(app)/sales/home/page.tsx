"use client"

import { DashboardLayout, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, TrendingUp, TrendingDown, DollarSign, Users,
  Target, Calendar, BarChart3, ArrowUpRight, ArrowDownRight,
  Phone, Mail, Clock, CheckCircle2, AlertTriangle, Building2
} from "lucide-react"

// Sales KPIs
const KPIS = [
  {
    label: "Pipeline Value",
    value: "₹4.2Cr",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    label: "Deals Won (MTD)",
    value: "12",
    change: "+3",
    trend: "up",
    icon: CheckCircle2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Win Rate",
    value: "34%",
    change: "-2%",
    trend: "down",
    icon: Target,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    label: "Avg Deal Size",
    value: "₹12.5L",
    change: "+8%",
    trend: "up",
    icon: BarChart3,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

// Pipeline stages
const PIPELINE_STAGES = [
  { name: "Qualification", count: 24, value: "₹1.8Cr", color: "bg-slate-400" },
  { name: "Discovery", count: 18, value: "₹2.1Cr", color: "bg-blue-400" },
  { name: "Proposal", count: 12, value: "₹1.4Cr", color: "bg-amber-400" },
  { name: "Negotiation", count: 8, value: "₹95L", color: "bg-purple-400" },
  { name: "Closing", count: 5, value: "₹62L", color: "bg-green-400" },
]

// Top deals
const TOP_DEALS = [
  { 
    name: "TechCorp Enterprise License", 
    company: "TechCorp India",
    value: "₹45L", 
    stage: "Negotiation",
    probability: 75,
    owner: "Sarah Chen",
    closeDate: "2026-02-15",
  },
  { 
    name: "FinServ Platform Deal", 
    company: "FinServ Solutions",
    value: "₹38L", 
    stage: "Proposal",
    probability: 50,
    owner: "Mike Johnson",
    closeDate: "2026-02-28",
  },
  { 
    name: "RetailMax Expansion", 
    company: "RetailMax Ltd",
    value: "₹32L", 
    stage: "Closing",
    probability: 90,
    owner: "Sarah Chen",
    closeDate: "2026-02-05",
  },
]

// Upcoming activities
const ACTIVITIES = [
  { type: "call", title: "Discovery call with Acme Corp", time: "10:30 AM", contact: "John Smith" },
  { type: "meeting", title: "Product demo - TechStart", time: "2:00 PM", contact: "Lisa Wang" },
  { type: "email", title: "Follow-up: Proposal sent", time: "4:00 PM", contact: "David Lee" },
]

// Team performance
const TEAM_PERFORMANCE = [
  { name: "Sarah Chen", deals: 8, revenue: "₹1.2Cr", quota: 85 },
  { name: "Mike Johnson", deals: 6, revenue: "₹95L", quota: 72 },
  { name: "Emma Wilson", deals: 5, revenue: "₹78L", quota: 65 },
  { name: "Alex Kumar", deals: 4, revenue: "₹52L", quota: 48 },
]

export default function SalesHomePage() {
  return (
    <DashboardLayout 
      title="Sales Dashboard" 
      description="Pipeline health, deals, and team performance"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            This Month
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Deal
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
                <span className="text-xs text-slate-500">vs last month</span>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Pipeline Overview</h3>
              <Button variant="outline" size="sm">View Pipeline</Button>
            </div>
            <div className="space-y-3">
              {PIPELINE_STAGES.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-slate-600">{stage.name}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div 
                        className={`${stage.color} h-2 rounded-full`}
                        style={{ width: `${(stage.count / 24) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-700 w-8">{stage.count}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 w-20 text-right">{stage.value}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-600">Total Pipeline</span>
              <span className="text-lg font-bold text-slate-900">₹6.87Cr</span>
            </div>
          </Card>

          {/* Top Deals */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Top Deals</h3>
              <Button variant="outline" size="sm">All Deals</Button>
            </div>
            <div className="space-y-3">
              {TOP_DEALS.map((deal, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-slate-900">{deal.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Building2 className="w-3 h-3" />
                        {deal.company}
                      </div>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{deal.value}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <Badge variant="outline" className={`
                        ${deal.stage === "Closing" ? "bg-green-100 text-green-700 border-green-200" : ""}
                        ${deal.stage === "Negotiation" ? "bg-purple-100 text-purple-700 border-purple-200" : ""}
                        ${deal.stage === "Proposal" ? "bg-amber-100 text-amber-700 border-amber-200" : ""}
                      `}>
                        {deal.stage}
                      </Badge>
                      <span>{deal.probability}% probability</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(deal.closeDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Today's Activities */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Today's Activities</h3>
              <Badge variant="outline">{ACTIVITIES.length}</Badge>
            </div>
            <div className="space-y-3">
              {ACTIVITIES.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <div className={`p-2 rounded-lg ${
                    activity.type === "call" ? "bg-green-100" : 
                    activity.type === "meeting" ? "bg-blue-100" : "bg-amber-100"
                  }`}>
                    {activity.type === "call" && <Phone className="w-3 h-3 text-green-600" />}
                    {activity.type === "meeting" && <Users className="w-3 h-3 text-blue-600" />}
                    {activity.type === "email" && <Mail className="w-3 h-3 text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{activity.title}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                      <span>•</span>
                      {activity.contact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3" size="sm">
              View Calendar
            </Button>
          </Card>

          {/* Team Leaderboard */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Team Performance</h3>
              <Badge variant="outline">MTD</Badge>
            </div>
            <div className="space-y-3">
              {TEAM_PERFORMANCE.map((member, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">{member.name}</span>
                      <span className="text-sm font-bold text-slate-900">{member.revenue}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${member.quota >= 80 ? "bg-green-500" : member.quota >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${member.quota}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{member.quota}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
