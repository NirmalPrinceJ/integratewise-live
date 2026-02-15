"use client"

import { DashboardLayout, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, TrendingUp, TrendingDown, Users, Heart,
  Calendar, BarChart3, ArrowUpRight, ArrowDownRight,
  MessageCircle, RefreshCw, AlertTriangle, CheckCircle2,
  Clock, Zap, Star, ThumbsUp, Building2
} from "lucide-react"

// CS KPIs
const KPIS = [
  {
    label: "Net Retention",
    value: "118%",
    change: "+3%",
    trend: "up",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    label: "Health Score Avg",
    value: "78",
    change: "+5",
    trend: "up",
    icon: Heart,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    label: "Open Tickets",
    value: "34",
    change: "-8",
    trend: "up",
    icon: MessageCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "CSAT Score",
    value: "4.6",
    change: "+0.2",
    trend: "up",
    icon: Star,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

// At-risk accounts
const AT_RISK_ACCOUNTS = [
  {
    name: "TechStart Inc",
    health: 45,
    arr: "₹18L",
    reason: "Low usage, missed QBR",
    lastContact: "15 days ago",
    owner: "Mike Johnson",
  },
  {
    name: "DataFlow Systems",
    health: 52,
    arr: "₹24L",
    reason: "Support escalation pending",
    lastContact: "8 days ago",
    owner: "Emma Wilson",
  },
  {
    name: "CloudNine Labs",
    health: 58,
    arr: "₹12L",
    reason: "Feature request unfulfilled",
    lastContact: "22 days ago",
    owner: "Sarah Chen",
  },
]

// Upcoming renewals
const RENEWALS = [
  { name: "GlobalTech Corp", arr: "₹45L", date: "Feb 15", health: 85, likelihood: "high" },
  { name: "FinServ Solutions", arr: "₹32L", date: "Feb 28", health: 72, likelihood: "medium" },
  { name: "RetailMax Ltd", arr: "₹28L", date: "Mar 10", health: 68, likelihood: "medium" },
  { name: "HealthPlus Inc", arr: "₹22L", date: "Mar 15", health: 91, likelihood: "high" },
]

// Recent tickets
const TICKETS = [
  { id: "T-1234", subject: "API rate limiting issue", priority: "high", status: "open", customer: "TechCorp" },
  { id: "T-1235", subject: "Dashboard loading slow", priority: "medium", status: "in-progress", customer: "DataFlow" },
  { id: "T-1236", subject: "Export feature request", priority: "low", status: "open", customer: "CloudNine" },
]

// Health distribution
const HEALTH_DISTRIBUTION = [
  { range: "Healthy (80-100)", count: 45, percentage: 56, color: "bg-green-500" },
  { range: "Neutral (60-79)", count: 24, percentage: 30, color: "bg-amber-500" },
  { range: "At Risk (0-59)", count: 11, percentage: 14, color: "bg-red-500" },
]

export default function CSHomePage() {
  return (
    <DashboardLayout 
      title="Customer Success Dashboard" 
      description="Account health, renewals, and support"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            This Month
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Log Activity
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
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* At-Risk Accounts */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">At-Risk Accounts</h3>
                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                  {AT_RISK_ACCOUNTS.length} Accounts
                </Badge>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {AT_RISK_ACCOUNTS.map((account, idx) => (
                <div key={idx} className="p-3 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-900">{account.name}</h4>
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 text-[10px]">
                          Health: {account.health}
                        </Badge>
                      </div>
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {account.reason}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{account.arr}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {account.owner}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last contact: {account.lastContact}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Take Action
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Renewals */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">Upcoming Renewals</h3>
                <Badge variant="outline">Next 60 Days</Badge>
              </div>
              <Button variant="outline" size="sm">All Renewals</Button>
            </div>
            <div className="space-y-3">
              {RENEWALS.map((renewal, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-slate-900">{renewal.name}</h4>
                      <Badge variant="outline" className={`text-[10px] ${
                        renewal.likelihood === "high" 
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-amber-100 text-amber-700 border-amber-200"
                      }`}>
                        {renewal.likelihood === "high" ? "Likely" : "At Risk"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Health: {renewal.health}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {renewal.date}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-slate-900">{renewal.arr}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Health Distribution */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Health Distribution</h3>
              <Badge variant="outline">80 Accounts</Badge>
            </div>
            <div className="space-y-3">
              {HEALTH_DISTRIBUTION.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.range}</span>
                    <span className="font-medium text-slate-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Tickets */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Recent Tickets</h3>
              <Badge variant="outline">{TICKETS.length} Open</Badge>
            </div>
            <div className="space-y-3">
              {TICKETS.map((ticket, idx) => (
                <div key={idx} className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{ticket.id}</span>
                        <Badge variant="outline" className={`text-[10px] ${
                          ticket.priority === "high" ? "bg-red-100 text-red-700 border-red-200" :
                          ticket.priority === "medium" ? "bg-amber-100 text-amber-700 border-amber-200" :
                          "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-slate-900 mt-1">{ticket.subject}</p>
                      <span className="text-xs text-slate-500">{ticket.customer}</span>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${
                      ticket.status === "open" ? "bg-blue-100 text-blue-700 border-blue-200" :
                      "bg-amber-100 text-amber-700 border-amber-200"
                    }`}>
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3" size="sm">
              View All Tickets
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Create Ticket
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Schedule QBR
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Request Testimonial
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
