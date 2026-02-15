"use client"

/**
 * Form Builder / Manager — Manage lead-capture and marketing forms
 * Ported from Figma Design marketing/forms.tsx
 */

import { useState } from "react"
import { FileText, Eye, Users, TrendingUp, Plus, Copy, ExternalLink, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MarketingForm {
  id: string
  name: string
  type: "lead-gen" | "contact" | "webinar" | "feedback" | "demo-request"
  status: "active" | "inactive" | "draft"
  views: number
  submissions: number
  conversionRate: number
  lastSubmission: string
  connectedCampaign?: string
}

const forms: MarketingForm[] = [
  { id: "mf1", name: "Enterprise Demo Request", type: "demo-request", status: "active", views: 3450, submissions: 287, conversionRate: 8.3, lastSubmission: "2 hours ago", connectedCampaign: "APAC Enterprise Push" },
  { id: "mf2", name: "Q1 Webinar Registration", type: "webinar", status: "active", views: 5120, submissions: 892, conversionRate: 17.4, lastSubmission: "45 min ago", connectedCampaign: "Integration Maturity Series" },
  { id: "mf3", name: "Product Feedback Survey", type: "feedback", status: "active", views: 1240, submissions: 156, conversionRate: 12.6, lastSubmission: "1 day ago" },
  { id: "mf4", name: "Partner Contact Form", type: "contact", status: "active", views: 890, submissions: 124, conversionRate: 13.9, lastSubmission: "3 hours ago" },
  { id: "mf5", name: "Free Trial Sign-up", type: "lead-gen", status: "active", views: 8920, submissions: 1240, conversionRate: 13.9, lastSubmission: "12 min ago", connectedCampaign: "Always-On Lead Gen" },
  { id: "mf6", name: "Holiday Promo (Ended)", type: "lead-gen", status: "inactive", views: 2340, submissions: 345, conversionRate: 14.7, lastSubmission: "Jan 15" },
  { id: "mf7", name: "Customer NPS Survey (Draft)", type: "feedback", status: "draft", views: 0, submissions: 0, conversionRate: 0, lastSubmission: "—" },
]

const typeColors: Record<string, string> = {
  "lead-gen": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  contact: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  webinar: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  feedback: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "demo-request": "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
}

export default function FormsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filtered = forms.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === "all" || f.type === typeFilter
    return matchSearch && matchType
  })

  const totalSubmissions = forms.reduce((s, f) => s + f.submissions, 0)
  const totalViews = forms.reduce((s, f) => s + f.views, 0)
  const avgConversion = totalViews > 0 ? ((totalSubmissions / totalViews) * 100).toFixed(1) : "0"
  const activeForms = forms.filter((f) => f.status === "active").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Forms</h1>
          <p className="text-sm text-muted-foreground">Manage lead-capture and marketing forms</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> New Form</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><FileText className="w-4 h-4 text-blue-500" /><span className="text-xs text-muted-foreground">Active Forms</span></div><p className="text-lg font-semibold">{activeForms}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Eye className="w-4 h-4 text-green-500" /><span className="text-xs text-muted-foreground">Total Views</span></div><p className="text-lg font-semibold">{totalViews.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-purple-500" /><span className="text-xs text-muted-foreground">Submissions</span></div><p className="text-lg font-semibold">{totalSubmissions.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-orange-500" /><span className="text-xs text-muted-foreground">Avg Conversion</span></div><p className="text-lg font-semibold">{avgConversion}%</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search forms…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="lead-gen">Lead Gen</SelectItem>
            <SelectItem value="contact">Contact</SelectItem>
            <SelectItem value="webinar">Webinar</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
            <SelectItem value="demo-request">Demo Request</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Submissions</TableHead>
                <TableHead className="text-center">Conversion</TableHead>
                <TableHead>Last Submission</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{form.name}</p>
                      {form.connectedCampaign && (
                        <p className="text-[10px] text-muted-foreground">Campaign: {form.connectedCampaign}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center"><Badge className={`${typeColors[form.type]} text-[10px]`}>{form.type}</Badge></TableCell>
                  <TableCell className="text-center"><Badge variant={form.status === "active" ? "default" : "outline"} className="text-[10px]">{form.status}</Badge></TableCell>
                  <TableCell className="text-right font-mono text-sm">{form.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{form.submissions.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-2">
                      <Progress value={Math.min(form.conversionRate * 4, 100)} className="h-1.5 flex-1" />
                      <span className="text-xs font-mono w-10 text-right">{form.conversionRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{form.lastSubmission}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><ExternalLink className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
