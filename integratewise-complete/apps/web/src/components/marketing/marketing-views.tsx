"use client"

/**
 * Marketing domain-specific views: Campaigns, Analytics, Leads.
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowUpRight, BarChart3, Eye, Filter, Mail,
  Megaphone, Plus, Search, TrendingUp, Users,
} from "lucide-react"

/* ─── Campaigns View ─── */
const campaigns = [
  { name: "Product Launch — Feb 2026", status: "active", channel: "Multi-channel", budget: 25_000, spent: 18_200, leads: 342, conv: 4.2, start: "Feb 1", end: "Feb 28" },
  { name: "Enterprise Webinar Series", status: "active", channel: "Email + Landing", budget: 8_000, spent: 5_400, leads: 128, conv: 8.1, start: "Jan 15", end: "Mar 15" },
  { name: "Holiday 2025 Promo", status: "completed", channel: "Social + Ads", budget: 15_000, spent: 14_800, leads: 512, conv: 3.8, start: "Nov 20", end: "Dec 31" },
  { name: "Content Syndication Q1", status: "active", channel: "Content", budget: 12_000, spent: 4_500, leads: 89, conv: 5.6, start: "Jan 1", end: "Mar 31" },
  { name: "ABM — Top 20 Accounts", status: "planned", channel: "ABM", budget: 20_000, spent: 0, leads: 0, conv: 0, start: "Mar 1", end: "May 31" },
]
const campStatus: Record<string, string> = { active: "bg-green-500/10 text-green-600", completed: "bg-muted text-muted-foreground", planned: "bg-blue-500/10 text-blue-600" }

export function CampaignsView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Campaigns</h2>
        <Button size="sm"><Megaphone className="w-3.5 h-3.5 mr-1.5" /> New Campaign</Button>
      </div>
      <div className="space-y-3">
        {campaigns.map((c) => (
          <Card key={c.name} className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{c.name}</span>
                    <Badge variant="outline" className={`text-[9px] ${campStatus[c.status]}`}>{c.status}</Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{c.channel} · {c.start} – {c.end}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 text-center text-[10px]">
                <div><div className="font-bold text-sm">{c.leads}</div> Leads</div>
                <div><div className="font-bold text-sm">{c.conv}%</div> Conv Rate</div>
                <div><div className="font-bold text-sm">${(c.spent / 1000).toFixed(1)}K</div> Spent</div>
                <div>
                  <Progress value={c.budget > 0 ? (c.spent / c.budget) * 100 : 0} className="h-1.5 mt-1" />
                  <span className="text-muted-foreground">{c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0}% of budget</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Analytics View ─── */
const channels = [
  { name: "Organic Search", visits: 12_400, leads: 186, conv: 1.5, trend: 8.2 },
  { name: "Paid Search", visits: 8_200, leads: 312, conv: 3.8, trend: -2.1 },
  { name: "Social Media", visits: 6_800, leads: 98, conv: 1.4, trend: 15.3 },
  { name: "Email", visits: 4_200, leads: 284, conv: 6.8, trend: 3.5 },
  { name: "Direct", visits: 3_100, leads: 45, conv: 1.5, trend: 0.8 },
  { name: "Referral", visits: 2_400, leads: 67, conv: 2.8, trend: 22.1 },
]
const contentMetrics = [
  { title: "Complete Guide to CS Platforms", views: 4_200, time: "6:42", shares: 128 },
  { title: "Why NRR > ARR Growth", views: 3_800, time: "4:18", shares: 96 },
  { title: "2026 SaaS Benchmarks Report", views: 2_900, time: "8:15", shares: 214 },
  { title: "ROI Calculator Template", views: 1_800, time: "3:30", shares: 52 },
]

export function AnalyticsView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Marketing Analytics</h2>
        <Badge variant="outline" className="text-[10px]">Feb 2026 · 30d window</Badge>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Total Visits</div><div className="text-xl font-bold">37.1K</div><div className="text-[10px] text-green-600 flex items-center"><ArrowUpRight className="w-3 h-3" /> 6.4%</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Leads Generated</div><div className="text-xl font-bold text-pink-600">992</div><div className="text-[10px] text-green-600 flex items-center"><ArrowUpRight className="w-3 h-3" /> 12.1%</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Avg Conv Rate</div><div className="text-xl font-bold">2.7%</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] text-muted-foreground">Cost per Lead</div><div className="text-xl font-bold text-amber-600">$28</div></CardContent></Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3">Channel Performance</h3>
          <table className="w-full text-xs">
            <thead><tr className="text-left text-[10px] text-muted-foreground border-b"><th className="pb-2 font-medium">Channel</th><th className="pb-2 font-medium text-right">Visits</th><th className="pb-2 font-medium text-right">Leads</th><th className="pb-2 font-medium text-right">Conv %</th><th className="pb-2 font-medium text-right">Trend</th></tr></thead>
            <tbody className="divide-y">
              {channels.map((ch) => (
                <tr key={ch.name} className="hover:bg-muted/50">
                  <td className="py-2 font-medium">{ch.name}</td>
                  <td className="py-2 text-right text-muted-foreground">{ch.visits.toLocaleString()}</td>
                  <td className="py-2 text-right">{ch.leads}</td>
                  <td className="py-2 text-right">{ch.conv}%</td>
                  <td className={`py-2 text-right ${ch.trend > 0 ? "text-green-600" : "text-red-600"}`}>{ch.trend > 0 ? "+" : ""}{ch.trend}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3">Top Content</h3>
          <div className="space-y-2">
            {contentMetrics.map((c) => (
              <div key={c.title} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                <div className="flex-1 min-w-0"><div className="text-xs font-medium truncate">{c.title}</div></div>
                <span className="text-[10px] text-muted-foreground">{c.views.toLocaleString()} views</span>
                <span className="text-[10px] text-muted-foreground">{c.time} avg</span>
                <span className="text-[10px] text-muted-foreground">{c.shares} shares</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Leads View ─── */
const leads = [
  { name: "Jordan Walker", company: "TechStart Inc", source: "Webinar", score: 85, status: "MQL", lastActivity: "2h ago" },
  { name: "Lisa Chen", company: "GrowthCo", source: "Content DL", score: 72, status: "MQL", lastActivity: "1d ago" },
  { name: "Tom Bradley", company: "ScaleUp Ltd", source: "Paid Search", score: 68, status: "New", lastActivity: "3h ago" },
  { name: "Nina Patel", company: "Enterprise Global", source: "ABM", score: 92, status: "SQL", lastActivity: "30 min ago" },
  { name: "Carlos Diaz", company: "InnovateTech", source: "Referral", score: 55, status: "New", lastActivity: "2d ago" },
  { name: "Emily Foster", company: "DataDriven Inc", source: "Organic", score: 78, status: "MQL", lastActivity: "5h ago" },
]
const leadStatus: Record<string, string> = { New: "bg-blue-500/10 text-blue-600", MQL: "bg-purple-500/10 text-purple-600", SQL: "bg-green-500/10 text-green-600" }

export function LeadsView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Leads ({leads.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="w-3.5 h-3.5 mr-1.5" /> Filter</Button>
          <Button size="sm"><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Lead</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {leads.map((l) => (
              <div key={l.name} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-[9px] font-bold">{l.name.split(" ").map((n) => n[0]).join("")}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium">{l.name}</div>
                  <div className="text-[10px] text-muted-foreground">{l.company} · {l.source}</div>
                </div>
                <div className="text-center">
                  <div className={`text-xs font-bold ${l.score >= 80 ? "text-green-600" : l.score >= 60 ? "text-amber-600" : "text-muted-foreground"}`}>{l.score}</div>
                  <div className="text-[8px] text-muted-foreground">score</div>
                </div>
                <Badge variant="outline" className={`text-[9px] ${leadStatus[l.status]}`}>{l.status}</Badge>
                <span className="text-[10px] text-muted-foreground">{l.lastActivity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
