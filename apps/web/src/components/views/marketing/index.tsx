/**
 * Marketing Views - Marketing Department
 * All views use UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  UnifiedPageTemplate,
  ListPageTemplate, 
  DashboardPageTemplate,
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  Megaphone,
  FileText,
  Globe,
  BarChart3,
  Calendar,
  CheckSquare,
  Lightbulb,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Users,
  Mail,
  Target,
  Clock,
  MoreHorizontal,
  ArrowRight,
  Sparkles,
  Play,
  Pause
} from "lucide-react"

// ============================================================================
// Campaigns View
// ============================================================================

const mockCampaigns = [
  { id: "camp-001", name: "Q1 Product Launch", type: "Multi-channel", status: "active", budget: 50000, spent: 32000, leads: 234, conversions: 45 },
  { id: "camp-002", name: "Webinar Series", type: "Email", status: "active", budget: 15000, spent: 8500, leads: 156, conversions: 28 },
  { id: "camp-003", name: "LinkedIn Ads", type: "Paid Social", status: "paused", budget: 25000, spent: 12000, leads: 89, conversions: 12 },
  { id: "camp-004", name: "SEO Content Push", type: "Content", status: "completed", budget: 10000, spent: 10000, leads: 312, conversions: 67 },
]

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: any }> = {
    active: { bg: "bg-green-100", text: "text-green-700", icon: Play },
    paused: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Pause },
    completed: { bg: "bg-gray-100", text: "text-gray-600", icon: null },
    draft: { bg: "bg-blue-100", text: "text-blue-700", icon: null },
  }
  const { bg, text, icon: Icon } = config[status] || config.draft
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {status}
    </span>
  )
}

export function CampaignsView() {
  const [campaigns] = useState(mockCampaigns)
  const [selected, setSelected] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const kpis: KPIItem[] = [
    { label: "Active Campaigns", value: "12", color: "primary" },
    { label: "Total Spend", value: "$62.5K", icon: <Target className="w-4 h-4" /> },
    { label: "Leads Generated", value: "791", color: "green", change: "+23% this month", changeType: "positive" },
    { label: "Conversion Rate", value: "19.2%", change: "+2.4%", changeType: "positive" },
  ]

  const selectedCampaign = campaigns.find(c => c.id === selected)

  return (
    <ListPageTemplate
      title="Campaigns"
      description="Manage marketing campaigns"
      stageId="MKT-CAMPAIGNS-001"
      breadcrumbs={[{ label: "Marketing", href: "/marketing" }, { label: "Campaigns" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />New Campaign</button>}
      rightPanel={selectedCampaign ? (
        <div className="space-y-4">
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Campaign</h4><p className="text-gray-900 font-medium">{selectedCampaign.name}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4><p className="text-gray-900">{selectedCampaign.type}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4><StatusBadge status={selectedCampaign.status} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><h4 className="text-sm font-medium text-gray-500 mb-1">Budget</h4><p className="text-gray-900">${selectedCampaign.budget.toLocaleString()}</p></div>
            <div><h4 className="text-sm font-medium text-gray-500 mb-1">Spent</h4><p className="text-gray-900">${selectedCampaign.spent.toLocaleString()}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><h4 className="text-sm font-medium text-gray-500 mb-1">Leads</h4><p className="text-gray-900">{selectedCampaign.leads}</p></div>
            <div><h4 className="text-sm font-medium text-gray-500 mb-1">Conversions</h4><p className="text-gray-900">{selectedCampaign.conversions}</p></div>
          </div>
        </div>
      ) : null}
      rightPanelTitle="Campaign Details"
      rightPanelOpen={panelOpen}
      onRightPanelClose={() => setPanelOpen(false)}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Campaign</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Type</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Budget</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Leads</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Conv.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setSelected(campaign.id); setPanelOpen(true); }}>
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="p-2 bg-purple-50 rounded-lg"><Megaphone className="w-4 h-4 text-purple-600" /></div><span className="text-sm font-medium text-gray-900">{campaign.name}</span></div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{campaign.type}</td>
                <td className="px-4 py-3"><StatusBadge status={campaign.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-600">${campaign.budget.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{campaign.leads}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{campaign.conversions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Content View
// ============================================================================

export function ContentView() {
  const content = [
    { id: 1, title: "Ultimate Guide to Sales Automation", type: "Blog", status: "published", views: 2341, leads: 45 },
    { id: 2, title: "Q1 Product Update Video", type: "Video", status: "published", views: 1256, leads: 23 },
    { id: 3, title: "ROI Calculator", type: "Tool", status: "published", views: 892, leads: 67 },
    { id: 4, title: "Customer Success Playbook", type: "Ebook", status: "draft", views: 0, leads: 0 },
  ]

  const kpis: KPIItem[] = [
    { label: "Total Content", value: "156", color: "primary" },
    { label: "Published", value: "134", color: "green" },
    { label: "Total Views", value: "45.2K", icon: <Eye className="w-4 h-4" /> },
    { label: "Leads Generated", value: "892", change: "+18%", changeType: "positive" },
  ]

  return (
    <ListPageTemplate
      title="Content"
      description="Manage marketing content library"
      stageId="MKT-CONTENT-001"
      breadcrumbs={[{ label: "Marketing", href: "/marketing" }, { label: "Content" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Create Content</button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-lg"><FileText className="w-5 h-5 text-blue-600" /></div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h4>
            <p className="text-xs text-gray-500 mb-3">{item.type}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.views.toLocaleString()}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{item.leads} leads</span>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Website View
// ============================================================================

export function WebsiteView() {
  const kpis: KPIItem[] = [
    { label: "Visitors Today", value: "2,341", color: "primary", icon: <Users className="w-4 h-4" /> },
    { label: "Page Views", value: "8,923", icon: <Eye className="w-4 h-4" /> },
    { label: "Bounce Rate", value: "42%", change: "-3%", changeType: "positive" },
    { label: "Avg Session", value: "4m 23s", change: "+45s", changeType: "positive" },
  ]

  return (
    <DashboardPageTemplate
      title="Website"
      description="Website traffic and performance"
      stageId="MKT-WEBSITE-001"
      breadcrumbs={[{ label: "Marketing", href: "/marketing" }, { label: "Website" }]}
      kpis={kpis}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Traffic Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg"><span className="text-gray-400">Traffic Chart Placeholder</span></div>
        </div>
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Pages</h3>
            <div className="space-y-2">
              {["/pricing", "/features", "/demo", "/blog"].map((page, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{page}</span>
                  <span className="text-gray-900 font-medium">{(2341 - idx * 400).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Traffic Sources</h3>
            <div className="space-y-2">
              {[{ name: "Organic", pct: 45 }, { name: "Direct", pct: 28 }, { name: "Paid", pct: 18 }, { name: "Social", pct: 9 }].map((src, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{src.name}</span>
                  <span className="text-gray-900 font-medium">{src.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardPageTemplate>
  )
}

// ============================================================================
// Analytics View
// ============================================================================

export function AnalyticsView() {
  const kpis: KPIItem[] = [
    { label: "MQLs", value: "234", change: "+18%", changeType: "positive" },
    { label: "SQLs", value: "89", change: "+12%", changeType: "positive" },
    { label: "Pipeline Created", value: "$1.2M", icon: <Target className="w-4 h-4" /> },
    { label: "CAC", value: "$342", change: "-8%", changeType: "positive" },
  ]

  return (
    <DashboardPageTemplate
      title="Analytics"
      description="Marketing performance analytics"
      stageId="MKT-ANALYTICS-001"
      breadcrumbs={[{ label: "Marketing", href: "/marketing" }, { label: "Analytics" }]}
      kpis={kpis}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Funnel Performance</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg"><span className="text-gray-400">Funnel Chart Placeholder</span></div>
        </div>
        <div className="col-span-6 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Channel Attribution</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg"><span className="text-gray-400">Attribution Chart Placeholder</span></div>
        </div>
      </div>
    </DashboardPageTemplate>
  )
}

// ============================================================================
// Marketing Today View
// ============================================================================

export function MarketingTodayView() {
  const kpis: KPIItem[] = [
    { label: "Content to Review", value: "3", color: "yellow" },
    { label: "Campaigns Active", value: "5", color: "green" },
    { label: "Leads Today", value: "45", change: "+12%", changeType: "positive" },
    { label: "Tasks Due", value: "7", icon: <CheckSquare className="w-4 h-4" /> },
  ]

  return (
    <DashboardPageTemplate
      title="Today"
      description={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      stageId="MKT-TODAY-001"
      breadcrumbs={[{ label: "Marketing", href: "/marketing" }, { label: "Today" }]}
      kpis={kpis}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {[
              { time: "10:00 AM", title: "Content review meeting", type: "meeting" },
              { time: "1:00 PM", title: "Campaign performance review", type: "review" },
              { time: "3:00 PM", title: "Social media planning", type: "planning" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-500 w-20">{item.time}</span>
                <div className="flex-1"><p className="text-sm font-medium text-gray-900">{item.title}</p></div>
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{item.type}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-4 bg-gradient-to-br from-[#2D7A3E] to-[#1d5a2e] rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4" /><h3 className="text-sm font-semibold">AI Suggestions</h3></div>
          <div className="space-y-2">
            <div className="bg-white/10 rounded-lg p-3"><p className="text-sm">Blog post "Sales Automation Guide" is trending - consider promoting on LinkedIn.</p></div>
            <div className="bg-white/10 rounded-lg p-3"><p className="text-sm">Email open rates are highest on Tuesdays at 10 AM. Schedule next campaign accordingly.</p></div>
          </div>
        </div>
      </div>
    </DashboardPageTemplate>
  )
}

// ============================================================================
// Marketing Tasks View
// ============================================================================

export function MarketingTasksView() {
  const kpis: KPIItem[] = [
    { label: "Total Tasks", value: "28", color: "primary" },
    { label: "Due Today", value: "4", color: "yellow" },
    { label: "Overdue", value: "1", color: "red" },
    { label: "Completed", value: "15", color: "green" },
  ]

  return (
    <ListPageTemplate
      title="Tasks"
      description="Manage marketing tasks"
      stageId="MKT-TASKS-001"
      breadcrumbs={[{ label: "Marketing", href: "/marketing" }, { label: "Tasks" }]}
      kpis={kpis}
      headerActions={<button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"><Plus className="w-4 h-4" />Add Task</button>}
    >
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-gray-500 text-sm">Task list with same structure as Sales Tasks view</p>
      </div>
    </ListPageTemplate>
  )
}

// ============================================================================
// Marketing Insights View
// ============================================================================

export function MarketingInsightsView() {
  const kpis: KPIItem[] = [
    { label: "AI Insights", value: "6", color: "primary", icon: <Sparkles className="w-4 h-4" /> },
    { label: "Optimization Opps", value: "4", color: "green" },
    { label: "Warnings", value: "2", color: "yellow" },
    { label: "Budget Alerts", value: "1", color: "red" },
  ]

  return (
    <DashboardPageTemplate
      title="Insights"
      description="AI-powered marketing analytics"
      stageId="MKT-INSIGHTS-001"
      breadcrumbs={[{ label: "Marketing", href: "/marketing" }, { label: "Insights" }]}
      kpis={kpis}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Marketing Insights</h3>
          <div className="space-y-4">
            {[
              { type: "opportunity", title: "High-performing content", description: "Blog posts with videos get 3x more engagement. Consider adding videos to top posts." },
              { type: "warning", title: "LinkedIn Ads underperforming", description: "CPC is 40% above benchmark. Consider pausing and optimizing audience targeting." },
              { type: "action", title: "Email list hygiene", description: "12% of email list hasn't engaged in 6 months. Consider a re-engagement campaign." },
            ].map((insight, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${insight.type === 'opportunity' ? 'bg-green-50 border-green-200' : insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Channel Performance</h3>
            <div className="space-y-2">
              {[{ name: "Email", score: 92 }, { name: "SEO", score: 85 }, { name: "Paid", score: 68 }, { name: "Social", score: 74 }].map((ch, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{ch.name}</span>
                  <span className={`text-sm font-medium ${ch.score >= 80 ? 'text-green-600' : ch.score >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>{ch.score}/100</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardPageTemplate>
  )
}

export default {
  CampaignsView,
  ContentView,
  WebsiteView,
  AnalyticsView,
  MarketingTodayView,
  MarketingTasksView,
  MarketingInsightsView,
}
