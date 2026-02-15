"use client"

/**
 * Marketing Dashboard — KPIs, lead funnel, campaigns, channel mix.
 * Ported from Figma Design marketing/dashboard.tsx → shadcn/ui tokens + inline data.
 */

import { Users, TrendingUp, Mail, MousePointerClick, Plus, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

const summary = { leadsGenerated: 1842, mqls: 428, emailOpenRate: 34.2, revenueInfluenced: 2400000, conversionRate: 23 }

const funnelStages = [
  { stage: "Visitors", count: 24500, pct: 100 },
  { stage: "Leads", count: 1842, pct: 75 },
  { stage: "MQL", count: 428, pct: 45 },
  { stage: "SQL", count: 186, pct: 25 },
  { stage: "Opportunity", count: 72, pct: 12 },
]

const campaigns = [
  { id: 1, name: "Q1 Product Launch Webinar", status: "active", channel: "email", clicks: 3420, conversionRate: 12.5, revenue: 180000, type: "Event" },
  { id: 2, name: "APAC Enterprise Outreach", status: "active", channel: "linkedin", clicks: 1890, conversionRate: 8.2, revenue: 95000, type: "ABM" },
  { id: 3, name: "Developer Community Blog Series", status: "completed", channel: "organic", clicks: 8200, conversionRate: 3.1, revenue: 42000, type: "Content" },
  { id: 4, name: "SOC2 Compliance Whitepaper", status: "active", channel: "paid", clicks: 2100, conversionRate: 15.8, revenue: 220000, type: "Content" },
  { id: 5, name: "Partner Co-marketing Webinar", status: "scheduled", channel: "email", clicks: 0, conversionRate: 0, revenue: 0, type: "Event" },
]

const topContent = [
  { title: "API Integration Best Practices", views: 12400, conversions: 342, type: "Blog" },
  { title: "ROI Calculator Tool", views: 8900, conversions: 520, type: "Interactive" },
  { title: "Customer Success Stories", views: 6200, conversions: 180, type: "Case Study" },
  { title: "Platform Overview Video", views: 15800, conversions: 290, type: "Video" },
]

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-600",
  completed: "bg-muted text-muted-foreground",
  scheduled: "bg-blue-500/10 text-blue-600",
  paused: "bg-amber-500/10 text-amber-600",
}

export function MarketingDashboard() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI title="Leads Generated" value={summary.leadsGenerated.toLocaleString()} change="+24% MoM" icon={<Users className="w-4 h-4" />} accent="text-pink-600" />
        <KPI title="Marketing Qualified" value={summary.mqls.toLocaleString()} change={`${summary.conversionRate}% conv`} icon={<TrendingUp className="w-4 h-4" />} accent="text-blue-600" />
        <KPI title="Email Open Rate" value={`${summary.emailOpenRate}%`} change="+3% vs avg" icon={<Mail className="w-4 h-4" />} accent="text-green-600" />
        <KPI title="Revenue Influenced" value={`$${Math.round(summary.revenueInfluenced / 1000)}K`} change="This quarter" icon={<MousePointerClick className="w-4 h-4" />} accent="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Funnel */}
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-4">Lead Funnel</h3>
            <div className="space-y-3">
              {funnelStages.map((stage, i) => {
                const prevCount = i > 0 ? funnelStages[i - 1].count : stage.count
                const convRate = i > 0 ? ((stage.count / prevCount) * 100).toFixed(0) : "100"
                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium">{stage.stage}</span>
                      <span className="text-muted-foreground">{stage.count.toLocaleString()} {i > 0 && <span className="text-pink-600">({convRate}%)</span>}</span>
                    </div>
                    <div className="w-full h-5 bg-muted rounded overflow-hidden">
                      <div
                        className="h-full rounded transition-all bg-pink-500/20"
                        style={{ width: `${stage.pct}%`, opacity: 0.3 + (stage.pct / 100) * 0.7 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Content */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Top Content</h3>
            <div className="space-y-3">
              {topContent.map((c) => (
                <div key={c.title} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium truncate flex-1">{c.title}</span>
                    <Badge variant="outline" className="text-[9px] ml-2">{c.type}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>{c.views.toLocaleString()} views</span>
                    <span>{c.conversions} conversions</span>
                    <span className="text-green-600">{((c.conversions / c.views) * 100).toFixed(1)}% CVR</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Campaigns</h3>
            <Button size="sm" variant="default" className="h-7 text-xs"><Plus className="w-3 h-3 mr-1" /> New Campaign</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Campaign</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden sm:table-cell">Channel</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium hidden md:table-cell">Clicks</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium hidden lg:table-cell">Conv %</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
                    <td className="py-2 px-3">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.type}</div>
                    </td>
                    <td className="py-2 px-3">
                      <Badge variant="outline" className={`text-[10px] capitalize ${statusColors[c.status]}`}>{c.status}</Badge>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground capitalize hidden sm:table-cell">{c.channel}</td>
                    <td className="py-2 px-3 text-right hidden md:table-cell">{c.clicks.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right hidden lg:table-cell">{c.conversionRate}%</td>
                    <td className="py-2 px-3 text-right font-medium">${(c.revenue / 1000).toFixed(0)}K</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KPI({ title, value, change, icon, accent }: { title: string; value: string; change: string; icon: React.ReactNode; accent: string }) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">{title}</span>
          <div className={accent}>{icon}</div>
        </div>
        <div className={`text-xl font-semibold ${accent}`}>{value}</div>
        <div className="text-[10px] text-green-600 flex items-center gap-0.5 mt-0.5"><ArrowUpRight className="w-3 h-3" />{change}</div>
      </CardContent>
    </Card>
  )
}
