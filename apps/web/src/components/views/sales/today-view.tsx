/**
 * Sales Today View - Daily Sales Dashboard
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  DashboardPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  Calendar,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Briefcase,
  ArrowRight
} from "lucide-react"

const todayActivities = [
  { id: 1, type: "call", title: "Follow-up call with Acme Corp", time: "9:00 AM", status: "upcoming", contact: "John Smith" },
  { id: 2, type: "meeting", title: "Demo with TechStart", time: "11:00 AM", status: "upcoming", contact: "Emily Johnson" },
  { id: 3, type: "task", title: "Send proposal to GlobalTech", time: "2:00 PM", status: "upcoming", contact: "Michael Chen" },
  { id: 4, type: "call", title: "Check-in with InnovateTech", time: "3:30 PM", status: "completed", contact: "Sarah Williams" },
]

const urgentItems = [
  { id: 1, type: "deal", title: "Acme Corp deal closing today", value: "$125K", priority: "high" },
  { id: 2, type: "task", title: "Contract review overdue", daysOverdue: 2, priority: "high" },
  { id: 3, type: "lead", title: "Hot lead: RetailMax inquiry", score: 95, priority: "medium" },
]

const kpis: KPIItem[] = [
  { label: "Calls Today", value: "8/12", icon: <Phone className="w-4 h-4" /> },
  { label: "Meetings", value: "3", icon: <Calendar className="w-4 h-4" /> },
  { label: "Tasks Due", value: "5", color: "yellow" },
  { label: "Deals Closing", value: "2", color: "green", icon: <DollarSign className="w-4 h-4" /> },
]

function ActivityIcon({ type }: { type: string }) {
  const icons: Record<string, { icon: any; bg: string; color: string }> = {
    call: { icon: Phone, bg: "bg-blue-50", color: "text-blue-600" },
    meeting: { icon: Users, bg: "bg-purple-50", color: "text-purple-600" },
    task: { icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
    email: { icon: Mail, bg: "bg-orange-50", color: "text-orange-600" },
  }
  const { icon: Icon, bg, color } = icons[type] || icons.task
  return (
    <div className={`p-2 rounded-lg ${bg}`}>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
  )
}

export function SalesTodayView() {
  return (
    <DashboardPageTemplate
      title="Today"
      description={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      stageId="SALES-TODAY-001"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Today" }
      ]}
      kpis={kpis}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Main Timeline */}
        <div className="col-span-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Today's Schedule</h3>
              <button className="text-sm text-[#2D7A3E] hover:underline">View Calendar</button>
            </div>
            <div className="space-y-3">
              {todayActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
                    activity.status === 'completed' ? 'bg-gray-50 border-gray-200' : 'border-gray-200'
                  }`}
                >
                  <ActivityIcon type={activity.type} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${activity.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.contact}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </span>
                    {activity.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <button className="px-3 py-1 text-xs font-medium text-[#2D7A3E] bg-[#2D7A3E]/10 rounded-lg hover:bg-[#2D7A3E]/20">
                        Start
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">Pipeline Added</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">$45K</p>
              <p className="text-xs text-green-600">+12% vs yesterday</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Deals Advanced</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">4</p>
              <p className="text-xs text-gray-500">Moved to next stage</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">Quota Progress</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">78%</p>
              <p className="text-xs text-gray-500">$156K / $200K</p>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="col-span-4 space-y-4">
          {/* Urgent Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-gray-900">Needs Attention</h3>
            </div>
            <div className="space-y-3">
              {urgentItems.map((item) => (
                <div key={item.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      {item.value && <p className="text-xs text-green-600 font-medium mt-1">{item.value}</p>}
                      {item.daysOverdue && <p className="text-xs text-red-600 mt-1">{item.daysOverdue} days overdue</p>}
                      {item.score && <p className="text-xs text-blue-600 mt-1">Score: {item.score}</p>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* AI Suggestions */}
          <div className="bg-gradient-to-br from-[#2D7A3E] to-[#1d5a2e] rounded-xl p-4 text-white">
            <h3 className="text-sm font-semibold mb-3">AI Suggestions</h3>
            <div className="space-y-2">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm">Best time to call John Smith is between 2-4 PM based on past engagement.</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm">TechStart deal has 85% close probability. Consider sending final proposal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageTemplate>
  )
}

export default SalesTodayView
