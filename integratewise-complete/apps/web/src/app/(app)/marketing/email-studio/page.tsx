"use client"

/**
 * Email Studio — Design, personalize, and automate email campaigns
 * Ported from Figma Design marketing/email-studio.tsx
 */

import { useState } from "react"
import { Mail, Search, Plus, Send, Eye, MousePointerClick, Clock, CheckCircle, Edit3, Copy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  status: "sent" | "draft" | "scheduled" | "ab-testing"
  type: "campaign" | "nurture" | "transactional" | "newsletter"
  sentTo: number
  openRate: number
  clickRate: number
  lastEdited: string
  scheduledFor?: string
}

const emails: EmailTemplate[] = [
  { id: "e1", name: "APAC RevOps Launch Announcement", subject: "Introducing IntegrateWise: Your APAC Integration Hub", status: "sent", type: "campaign", sentTo: 2340, openRate: 42.5, clickRate: 12.3, lastEdited: "Feb 5" },
  { id: "e2", name: "Integration Maturity Webinar Invite", subject: "Join us: Master Integration Maturity in 2026", status: "sent", type: "campaign", sentTo: 1890, openRate: 38.2, clickRate: 15.7, lastEdited: "Feb 1" },
  { id: "e3", name: "Weekly Digest - Feb W2", subject: "Your APAC Ops Weekly: Key Metrics & Insights", status: "scheduled", type: "newsletter", sentTo: 0, openRate: 0, clickRate: 0, lastEdited: "Feb 8", scheduledFor: "Feb 10, 9AM IST" },
  { id: "e4", name: "Customer Onboarding - Day 1", subject: "Welcome to IntegrateWise! Let's get started", status: "sent", type: "nurture", sentTo: 156, openRate: 68.4, clickRate: 45.2, lastEdited: "Jan 20" },
  { id: "e5", name: "A/B Test: CTA Button Color", subject: "Unlock Deeper Insights with Intelligence Overlay", status: "ab-testing", type: "campaign", sentTo: 500, openRate: 35.6, clickRate: 11.8, lastEdited: "Feb 7" },
  { id: "e6", name: "Product Update: Multi-Tenant Support", subject: "New: Manage Multiple Workspaces with Ease", status: "draft", type: "campaign", sentTo: 0, openRate: 0, clickRate: 0, lastEdited: "Feb 9" },
]

const statusConfig: Record<string, { color: string; label: string }> = {
  sent: { color: "hsl(var(--chart-2))", label: "Sent" },
  draft: { color: "hsl(var(--muted-foreground))", label: "Draft" },
  scheduled: { color: "hsl(var(--chart-1))", label: "Scheduled" },
  "ab-testing": { color: "hsl(var(--chart-4))", label: "A/B Testing" },
}

export default function EmailStudioPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = emails.filter((e) => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== "all" && e.type !== typeFilter) return false
    return true
  })

  const sentEmails = emails.filter((e) => e.status === "sent")
  const avgOpen = sentEmails.length > 0 ? Math.round((sentEmails.reduce((s, e) => s + e.openRate, 0) / sentEmails.length) * 10) / 10 : 0
  const avgClick = sentEmails.length > 0 ? Math.round((sentEmails.reduce((s, e) => s + e.clickRate, 0) / sentEmails.length) * 10) / 10 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email Studio</h1>
          <p className="text-sm text-muted-foreground">Design, personalize, and automate email campaigns</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> New Email</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Send className="w-4 h-4 text-blue-500" /><span className="text-[10px] text-muted-foreground">Total Sent</span></div><p className="text-lg font-semibold">{emails.reduce((s, e) => s + e.sentTo, 0).toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Eye className="w-4 h-4 text-green-500" /><span className="text-[10px] text-muted-foreground">Avg Open Rate</span></div><p className="text-lg font-semibold">{avgOpen}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><MousePointerClick className="w-4 h-4 text-purple-500" /><span className="text-[10px] text-muted-foreground">Avg Click Rate</span></div><p className="text-lg font-semibold">{avgClick}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Mail className="w-4 h-4 text-amber-500" /><span className="text-[10px] text-muted-foreground">Templates</span></div><p className="text-lg font-semibold">{emails.length}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search emails..." className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="campaign">Campaign</SelectItem>
            <SelectItem value="nurture">Nurture</SelectItem>
            <SelectItem value="transactional">Transactional</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Email Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Sent</TableHead>
              <TableHead className="text-right">Open Rate</TableHead>
              <TableHead className="text-right">Click Rate</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((email) => {
              const cfg = statusConfig[email.status]
              return (
                <TableRow key={email.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{email.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[300px]">{email.subject}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{cfg.label}</Badge>
                    {email.scheduledFor && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />{email.scheduledFor}
                      </div>
                    )}
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="capitalize text-[10px]">{email.type}</Badge></TableCell>
                  <TableCell className="text-right font-medium">{email.sentTo > 0 ? email.sentTo.toLocaleString() : "—"}</TableCell>
                  <TableCell className="text-right">{email.openRate > 0 ? `${email.openRate}%` : "—"}</TableCell>
                  <TableCell className="text-right">{email.clickRate > 0 ? `${email.clickRate}%` : "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit3 className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="w-3 h-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
