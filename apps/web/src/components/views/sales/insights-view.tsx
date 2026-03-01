/**
 * Sales Insights View - AI-Powered Sales Analytics
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { 
  DashboardPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  DollarSign,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3,
  PieChart
} from "lucide-react"

const insights = [
  {
    id: 1,
    type: "opportunity",
    title: "High-value deal stalling",
    description: "Acme Corp ($125K) has been in Negotiation for 14 days without activity. Historical data shows deals in this stage for >10 days have 40% lower close rate.",
    action: "Schedule follow-up call",
    priority: "high",
    impact: "$125K at risk"
  },
  {
    id: 2,
    type: "trend",
    title: "Strong Q1 pipeline momentum",
    description: "Pipeline value is up 23% compared to same period last year. Win rate has improved from 28% to 34%.",
    action: "View pipeline analysis",
    priority: "info",
    impact: "+$450K potential"
  },
  {
    id: 3,
    type: "warning",
    title: "Lead response time increasing",
    description: "Average response time to new leads has increased to 4.2 hours (target: 2 hours). Studies show leads contacted within 1 hour are 7x more likely to convert.",
    action: "Review lead queue",
    priority: "medium",
    impact: "Conversion at risk"
  },
  {
    id: 4,
    type: "recommendation",
    title: "Best time to contact prospects",
    description: "Analysis of 1,200+ calls shows your highest connect rate is Tuesday-Thursday between 10-11 AM. Consider scheduling outreach accordingly.",
    action: "Optimize schedule",
    priority: "low",
    impact: "+15% connect rate"
  },
]

const performanceMetrics = [
  { label: "Pipeline Created", value: "$892K", change: "+18%", trend: "up" },
  { label: "Deals Closed", value: "12", change: "+4", trend: "up" },
  { label: "Avg Sales Cycle", value: "32 days", change: "-5 days", trend: "up" },
  { label: "Win Rate", value: "34%", change: "+6%", trend: "up" },
]

const kpis: KPIItem[] = [
  { label: "AI Insights", value: "12", color: "primary", icon: <Sparkles className="w-4 h-4" /> },
  { label: "Actions Needed", value: "4", color: "yellow", icon: <AlertTriangle className="w-4 h-4" /> },
  { label: "Opportunities", value: "3", color: "green", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Risks Identified", value: "2", color: "red", icon: <TrendingDown className="w-4 h-4" /> },
]

function InsightCard({ insight }: { insight: typeof insights[0] }) {
  const priorityConfig: Record<string, { border: string; bg: string; icon: any; iconColor: string }> = {
    high: { border: "border-red-200", bg: "bg-red-50", icon: AlertTriangle, iconColor: "text-red-500" },
    medium: { border: "border-yellow-200", bg: "bg-yellow-50", icon: AlertTriangle, iconColor: "text-yellow-500" },
    low: { border: "border-blue-200", bg: "bg-blue-50", icon: Lightbulb, iconColor: "text-blue-500" },
    info: { border: "border-green-200", bg: "bg-green-50", icon: TrendingUp, iconColor: "text-green-500" },
  }
  
  const config = priorityConfig[insight.priority] || priorityConfig.info
  const Icon = config.icon

  return (
    <div className={`border rounded-xl p-4 ${config.border} ${config.bg}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-white`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
            <span className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded">{insight.impact}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
          <button className="mt-3 text-sm font-medium text-[#2D7A3E] hover:underline flex items-center gap-1">
            {insight.action}
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function SalesInsightsView() {
  return (
    <DashboardPageTemplate
      title="Insights"
      description="AI-powered analytics and recommendations"
      stageId="SALES-INSIGHTS-001"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Insights" }
      ]}
      kpis={kpis}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Main Insights */}
        <div className="col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">AI Insights</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                All
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                Opportunities
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                Risks
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
        
        {/* Performance Summary */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">Performance Summary</h3>
            </div>
            <div className="space-y-4">
              {performanceMetrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                    <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">Quota Progress</h3>
            </div>
            <div className="text-center py-4">
              <div className="relative inline-flex">
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#2D7A3E" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${78 * 2.51} ${100 * 2.51}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">78%</span>
                  <span className="text-xs text-gray-500">of quota</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">$156K / $200K</p>
              <p className="text-xs text-green-600">On track to exceed by 15%</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#2D7A3E] to-[#1d5a2e] rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-semibold">AI Recommendation</h3>
            </div>
            <p className="text-sm text-green-100">
              Based on your current trajectory, focusing on 3 more mid-market deals this week could help you exceed quota by $30K.
            </p>
            <button className="mt-3 w-full px-3 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
              View Suggested Deals
            </button>
          </div>
        </div>
      </div>
    </DashboardPageTemplate>
  )
}

export default SalesInsightsView
