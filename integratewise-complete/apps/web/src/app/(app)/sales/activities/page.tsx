"use client"

/**
 * Sales Activities & Tasks — Track calls, emails, meetings across deals
 * Ported from Figma Design sales/activities.tsx
 */

import { useState } from "react"
import { Phone, Mail, Video, CheckCircle, Clock, AlertTriangle, Plus, Search, User, Building2, ClipboardList } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ActivityItem {
  id: string
  type: "call" | "email" | "meeting" | "task" | "note"
  title: string
  description: string
  contact: string
  company: string
  datetime: string
  duration?: string
  status: "completed" | "scheduled" | "overdue" | "cancelled"
  source: string
  owner: string
}

const activities: ActivityItem[] = [
  { id: "a1", type: "meeting", title: "TechServe QBR Prep", description: "Internal prep for quarterly review", contact: "Ravi Sharma", company: "TechServe India", datetime: "Today, 11:00 AM", duration: "45 min", status: "scheduled", source: "Google Cal", owner: "Arun K." },
  { id: "a2", type: "call", title: "Discovery Call", description: "Initial discovery for data integration needs", contact: "Sarah Mitchell", company: "DataVault Australia", datetime: "Today, 2:00 PM", duration: "30 min", status: "scheduled", source: "Zoom", owner: "Anjali P." },
  { id: "a3", type: "email", title: "Follow-up: Pricing Proposal", description: "Sent updated pricing with enterprise discount", contact: "Mei Lin Chen", company: "CloudBridge APAC", datetime: "Today, 9:30 AM", status: "completed", source: "Gmail", owner: "Arun K." },
  { id: "a4", type: "task", title: "Prepare renewal analysis", description: "Compile usage data for renewal discussion", contact: "Suresh Iyer", company: "FinanceFlow Solutions", datetime: "Yesterday", status: "overdue", source: "Manual", owner: "Rajesh M." },
  { id: "a5", type: "meeting", title: "Product Demo", description: "Full product demo with IT team", contact: "Arun Tiwari", company: "RetailNest Pte Ltd", datetime: "Yesterday, 3:00 PM", duration: "1h", status: "completed", source: "Zoom", owner: "Vikram R." },
  { id: "a6", type: "call", title: "Check-in Call", description: "Monthly check-in on integration health", contact: "Dr. Priya Reddy", company: "HealthTech Innovations", datetime: "Feb 7, 10:00 AM", duration: "15 min", status: "completed", source: "Phone", owner: "Priya S." },
  { id: "a7", type: "email", title: "Contract Sent", description: "Enterprise agreement v3.2 sent for review", contact: "Ravi Sharma", company: "TechServe India", datetime: "Feb 6", status: "completed", source: "Gmail", owner: "Vikram R." },
  { id: "a8", type: "note", title: "Meeting Notes: LogiPrime", description: "Discussed renewal concerns, competitor mentions", contact: "Rajiv Kumar", company: "LogiPrime Corp", datetime: "Feb 5", status: "completed", source: "Manual", owner: "Vikram R." },
  { id: "a9", type: "meeting", title: "Onboarding Kickoff", description: "Kickoff meeting for new account onboarding", contact: "Dr. Priya Reddy", company: "HealthTech Innovations", datetime: "Tomorrow, 10:00 AM", duration: "1h", status: "scheduled", source: "Google Cal", owner: "Anjali P." },
  { id: "a10", type: "task", title: "Send case study", description: "Share TechServe case study with prospect", contact: "Arun Tiwari", company: "RetailNest Pte Ltd", datetime: "Tomorrow", status: "scheduled", source: "Manual", owner: "Vikram R." },
]

const typeConfig: Record<string, { className: string; icon: React.ComponentType<{ className?: string }> }> = {
  call: { className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: Phone },
  email: { className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Mail },
  meeting: { className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: Video },
  task: { className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: CheckCircle },
  note: { className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", icon: ClipboardList },
}

const statusBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  scheduled: "secondary",
  overdue: "destructive",
  cancelled: "outline",
}

export default function ActivitiesPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = activities.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.contact.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === "all" || a.type === typeFilter
    return matchSearch && matchType
  })

  const stats = {
    today: activities.filter((a) => a.datetime.includes("Today")).length,
    overdue: activities.filter((a) => a.status === "overdue").length,
    completed: activities.filter((a) => a.status === "completed").length,
    scheduled: activities.filter((a) => a.status === "scheduled").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activities & Tasks</h1>
          <p className="text-sm text-muted-foreground">Track calls, emails, meetings, and tasks across all deals</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Log Activity</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground mb-1">Today</div><p className="text-xl font-semibold">{stats.today}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground mb-1">Overdue</div><p className={`text-xl font-semibold ${stats.overdue > 0 ? "text-red-500" : ""}`}>{stats.overdue}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground mb-1">Completed</div><p className="text-xl font-semibold text-green-600">{stats.completed}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground mb-1">Upcoming</div><p className="text-xl font-semibold text-blue-600">{stats.scheduled}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search activities..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="call">Calls</SelectItem>
            <SelectItem value="email">Emails</SelectItem>
            <SelectItem value="meeting">Meetings</SelectItem>
            <SelectItem value="task">Tasks</SelectItem>
            <SelectItem value="note">Notes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity Cards */}
      <div className="space-y-2">
        {filtered.map((a) => {
          const cfg = typeConfig[a.type]
          const Icon = cfg.icon
          return (
            <Card key={a.id} className={a.status === "overdue" ? "border-red-300 dark:border-red-800" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.className}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-medium">{a.title}</span>
                      <Badge variant={statusBadge[a.status]} className="text-[10px] capitalize">{a.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5">{a.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {a.contact}</span>
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {a.company}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.datetime}{a.duration && ` (${a.duration})`}</span>
                      <Badge variant="outline" className="text-[9px] font-mono">{a.source}</Badge>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">{a.owner}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
