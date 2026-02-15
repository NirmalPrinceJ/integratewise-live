"use client"

/**
 * Ops Dashboard — Operational health, connectors, team capacity, action items.
 * Ported from Figma Design business-ops/dashboard.tsx → shadcn/ui tokens + inline data.
 */

import {
  TrendingUp, Activity, Users, Plug, CheckCircle2, Clock,
  ArrowUpRight, AlertTriangle, Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const summary = { totalARR: 11800000, arrGrowth: 13.5, operationalHealth: 87, activeIntegrations: 6, totalIntegrations: 8, teamUtilization: 78 }

const connectors = [
  { name: "Salesforce", status: "active", entities: 12400, confidence: 92 },
  { name: "HubSpot", status: "active", entities: 8200, confidence: 88 },
  { name: "Slack", status: "active", entities: 3400, confidence: 75 },
  { name: "Jira", status: "active", entities: 5600, confidence: 85 },
  { name: "Google Analytics", status: "active", entities: 15000, confidence: 70 },
  { name: "Stripe", status: "active", entities: 2800, confidence: 95 },
  { name: "Zendesk", status: "pending", entities: 0, confidence: 0 },
  { name: "GitHub", status: "error", entities: 400, confidence: 45 },
]

const teamCapacity = [
  { name: "Priya S.", utilization: 85 },
  { name: "Vikram R.", utilization: 72 },
  { name: "Anjali P.", utilization: 92 },
  { name: "Deepak J.", utilization: 60 },
  { name: "Arun K.", utilization: 78 },
]

const actionItems = [
  { id: 1, title: "Review Q1 forecast accuracy", priority: "high", type: "review", due: "Today" },
  { id: 2, title: "Fix GitHub connector auth failure", priority: "urgent", type: "fix", due: "Today" },
  { id: 3, title: "Approve budget reallocation for marketing", priority: "medium", type: "approval", due: "Feb 12" },
  { id: 4, title: "Complete Zendesk connector setup", priority: "medium", type: "setup", due: "Feb 14" },
  { id: 5, title: "Update team capacity plan for Q2", priority: "low", type: "planning", due: "Feb 20" },
]

const recentActivity = [
  { action: "Salesforce sync completed", time: "12m ago", icon: "🔄" },
  { action: "New deal created: RetailNow BI Dashboard", time: "1h ago", icon: "💰" },
  { action: "GitHub connector error: auth token expired", time: "2h ago", icon: "⚠️" },
  { action: "Customer health score updated for 5 accounts", time: "3h ago", icon: "📊" },
  { action: "Slack integration processed 340 messages", time: "4h ago", icon: "💬" },
]

const prioColors: Record<string, string> = { urgent: "bg-red-500/10 text-red-600", high: "bg-orange-500/10 text-orange-600", medium: "bg-blue-500/10 text-blue-600", low: "bg-green-500/10 text-green-600" }
const statusColors: Record<string, string> = { active: "bg-green-500", pending: "bg-amber-500", error: "bg-red-500" }

export function OpsDashboard() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI title="Total ARR" value={`$${(summary.totalARR / 1000000).toFixed(1)}M`} change={`+${summary.arrGrowth}%`} icon={<TrendingUp className="w-4 h-4" />} accent="text-blue-600" />
        <KPI title="Ops Health" value={`${summary.operationalHealth}%`} change="Good" icon={<Activity className="w-4 h-4" />} accent="text-green-600" />
        <KPI title="Integrations" value={`${summary.activeIntegrations}/${summary.totalIntegrations}`} change="Active" icon={<Plug className="w-4 h-4" />} accent="text-purple-600" />
        <KPI title="Team Utilization" value={`${summary.teamUtilization}%`} change="Balanced" icon={<Users className="w-4 h-4" />} accent="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connector Status */}
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Connector Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {connectors.map((c) => (
                <div key={c.name} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${statusColors[c.status]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">{c.entities.toLocaleString()} entities · {c.confidence}% confidence</div>
                  </div>
                  <Badge variant="outline" className={`text-[9px] capitalize ${c.status === "error" ? "text-red-600" : c.status === "pending" ? "text-amber-600" : "text-green-600"}`}>{c.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Capacity */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Team Capacity</h3>
            <div className="space-y-3">
              {teamCapacity.map((t) => (
                <div key={t.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{t.name}</span>
                    <span className={t.utilization > 85 ? "text-red-600" : t.utilization > 70 ? "text-amber-600" : "text-green-600"}>{t.utilization}%</span>
                  </div>
                  <Progress value={t.utilization} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Items */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Action Items</h3>
            <div className="space-y-2">
              {actionItems.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  {a.priority === "urgent" ? <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" /> : <Zap className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{a.title}</div>
                    <div className="text-[10px] text-muted-foreground">{a.type} · Due {a.due}</div>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${prioColors[a.priority]}`}>{a.priority}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="text-sm">{a.icon}</span>
                  <span className="flex-1 text-xs">{a.action}</span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
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
