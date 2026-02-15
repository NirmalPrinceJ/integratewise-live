"use client"

import { DashboardLayout, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, TrendingUp, TrendingDown, Users, Target,
  Calendar, BarChart3, ArrowUpRight, ArrowDownRight,
  Mail, Eye, MousePointer, FileText, Megaphone,
  Globe, Share2, Zap, CheckCircle2
} from "lucide-react"

// Marketing KPIs
const KPIS = [
  {
    label: "Total Leads (MTD)",
    value: "847",
    change: "+23%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    label: "MQLs Generated",
    value: "312",
    change: "+15%",
    trend: "up",
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Website Traffic",
    value: "45.2K",
    change: "+8%",
    trend: "up",
    icon: Globe,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    label: "Conversion Rate",
    value: "3.2%",
    change: "-0.3%",
    trend: "down",
    icon: MousePointer,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
]

// Active campaigns
const CAMPAIGNS = [
  {
    name: "Q1 Product Launch",
    type: "Multi-channel",
    status: "active",
    leads: 245,
    spend: "₹2.8L",
    cpl: "₹1,143",
    performance: "above",
  },
  {
    name: "Enterprise Webinar Series",
    type: "Event",
    status: "active",
    leads: 128,
    spend: "₹85K",
    cpl: "₹664",
    performance: "above",
  },
  {
    name: "LinkedIn Retargeting",
    type: "Paid Social",
    status: "active",
    leads: 92,
    spend: "₹1.2L",
    cpl: "₹1,304",
    performance: "below",
  },
  {
    name: "SEO Content Push",
    type: "Organic",
    status: "active",
    leads: 156,
    spend: "₹45K",
    cpl: "₹288",
    performance: "above",
  },
]

// Content performance
const CONTENT_ITEMS = [
  { title: "2026 Industry Trends Report", type: "Ebook", views: 1245, downloads: 342, conversion: "27%" },
  { title: "ROI Calculator Tool", type: "Tool", views: 892, downloads: 156, conversion: "17%" },
  { title: "Customer Success Stories", type: "Case Study", views: 678, downloads: 89, conversion: "13%" },
]

// Channel performance
const CHANNELS = [
  { name: "Organic Search", leads: 312, percentage: 37, color: "bg-green-500" },
  { name: "Paid Search", leads: 185, percentage: 22, color: "bg-blue-500" },
  { name: "Social Media", leads: 156, percentage: 18, color: "bg-purple-500" },
  { name: "Email", leads: 124, percentage: 15, color: "bg-amber-500" },
  { name: "Referral", leads: 70, percentage: 8, color: "bg-slate-400" },
]

// Upcoming activities
const UPCOMING = [
  { title: "Webinar: AI in Enterprise", date: "Feb 5", type: "event" },
  { title: "Newsletter Send", date: "Feb 3", type: "email" },
  { title: "Blog: Product Update", date: "Feb 4", type: "content" },
]

export default function MarketingHomePage() {
  return (
    <DashboardLayout 
      title="Marketing Dashboard" 
      description="Campaigns, leads, and content performance"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            This Month
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
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
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Campaigns */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Active Campaigns</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {CAMPAIGNS.map((campaign, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-900">{campaign.name}</h4>
                        <Badge variant="outline" className="text-[10px] bg-green-100 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-500">{campaign.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900">{campaign.leads}</span>
                      <span className="text-xs text-slate-500 ml-1">leads</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <span>Spend: {campaign.spend}</span>
                      <span>CPL: {campaign.cpl}</span>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${
                      campaign.performance === "above" 
                        ? "bg-green-100 text-green-700 border-green-200" 
                        : "bg-amber-100 text-amber-700 border-amber-200"
                    }`}>
                      {campaign.performance === "above" ? "Above Target" : "Below Target"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Content Performance */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Top Content</h3>
              <Button variant="outline" size="sm">Content Library</Button>
            </div>
            <div className="space-y-3">
              {CONTENT_ITEMS.map((content, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-900 truncate">{content.title}</h4>
                    <span className="text-xs text-slate-500">{content.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {content.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      {content.downloads}
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      {content.conversion}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Channel Distribution */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Lead Sources</h3>
              <Badge variant="outline">MTD</Badge>
            </div>
            <div className="space-y-3">
              {CHANNELS.map((channel, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600">{channel.name}</span>
                    <span className="font-medium text-slate-900">{channel.leads}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`${channel.color} h-2 rounded-full`}
                      style={{ width: `${channel.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Coming Up</h3>
              <Badge variant="outline">{UPCOMING.length}</Badge>
            </div>
            <div className="space-y-3">
              {UPCOMING.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <div className={`p-2 rounded-lg ${
                    item.type === "event" ? "bg-blue-100" :
                    item.type === "email" ? "bg-amber-100" : "bg-purple-100"
                  }`}>
                    {item.type === "event" && <Megaphone className="w-3 h-3 text-blue-600" />}
                    {item.type === "email" && <Mail className="w-3 h-3 text-amber-600" />}
                    {item.type === "content" && <FileText className="w-3 h-3 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3" size="sm">
              Marketing Calendar
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Send Email Campaign
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Schedule Social Post
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Create Landing Page
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
