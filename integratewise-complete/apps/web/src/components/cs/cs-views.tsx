"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  User,
  Plus,
  ArrowUpRight,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Support Tickets View                                               */
/* ------------------------------------------------------------------ */

const tickets = [
  { id: "TKT-4201", subject: "SSO login failing for enterprise users", customer: "Acme Corp", priority: "critical", status: "open", assignee: "David L.", created: "2h ago", replies: 3, sla: "1h remaining" },
  { id: "TKT-4198", subject: "Data export timing out on large datasets", customer: "TechStart Inc", priority: "high", status: "in-progress", assignee: "Emily R.", created: "5h ago", replies: 7, sla: "3h remaining" },
  { id: "TKT-4195", subject: "Dashboard widgets not loading after update", customer: "GlobalTech", priority: "medium", status: "in-progress", assignee: "Chris M.", created: "1d ago", replies: 4, sla: "On track" },
  { id: "TKT-4190", subject: "Integration webhook not firing", customer: "RetailMax", priority: "high", status: "open", assignee: "Unassigned", created: "1d ago", replies: 1, sla: "2h remaining" },
  { id: "TKT-4185", subject: "Billing page shows incorrect amounts", customer: "MediaFlow", priority: "medium", status: "waiting", assignee: "Sarah K.", created: "2d ago", replies: 5, sla: "On track" },
  { id: "TKT-4180", subject: "API rate limit too aggressive", customer: "DataDriven Co", priority: "low", status: "resolved", assignee: "James L.", created: "3d ago", replies: 8, sla: "Met" },
]

const priorityStyle: Record<string, string> = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
}

const statusStyle: Record<string, string> = {
  open: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  waiting: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
}

export function TicketsView() {
  const openCount = tickets.filter(t => t.status === "open").length
  const inProgressCount = tickets.filter(t => t.status === "in-progress").length
  const criticalCount = tickets.filter(t => t.priority === "critical").length

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Support Tickets</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage customer support requests</p>
        </div>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Ticket</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Open Tickets", value: openCount, icon: Ticket, color: "text-red-500" },
          { label: "In Progress", value: inProgressCount, icon: Clock, color: "text-blue-500" },
          { label: "Critical", value: criticalCount, icon: AlertCircle, color: "text-red-600" },
          { label: "Resolved Today", value: 1, icon: CheckCircle2, color: "text-emerald-500" },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                </div>
                <kpi.icon className={`h-8 w-8 ${kpi.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tickets table */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Ticket className="h-5 w-5" /> All Tickets</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.map(t => (
              <div key={t.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                    <span className="font-medium truncate">{t.subject}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{t.customer}</span>
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {t.assignee}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.created}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {t.replies}</span>
                  </div>
                </div>
                <Badge className={priorityStyle[t.priority]}>{t.priority}</Badge>
                <Badge className={statusStyle[t.status]}>{t.status}</Badge>
                <span className={`text-xs ${t.sla.includes("remaining") ? "text-amber-500" : "text-muted-foreground"}`}>{t.sla}</span>
                <Button variant="ghost" size="icon"><ArrowUpRight className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
