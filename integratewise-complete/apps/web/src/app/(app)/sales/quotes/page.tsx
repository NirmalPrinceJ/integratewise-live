"use client"

/**
 * Quotes & Contracts — Create, send, and track sales quotes
 * Ported from Figma Design sales/quotes.tsx
 */

import { useState } from "react"
import { FileSignature, Search, Plus, Eye, Download, CheckCircle, Clock, AlertTriangle, Send, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Quote {
  id: string
  number: string
  title: string
  company: string
  contact: string
  value: number
  status: "draft" | "sent" | "viewed" | "accepted" | "expired" | "declined"
  createdAt: string
  expiresAt: string
  items: number
  discount: number
  owner: string
  requiresApproval: boolean
}

const quotes: Quote[] = [
  { id: "q1", number: "QT-2026-042", title: "Enterprise Integration Suite - Annual", company: "TechServe India Pvt Ltd", contact: "Ravi Sharma", value: 120000, status: "sent", createdAt: "Feb 7", expiresAt: "Feb 21", items: 3, discount: 10, owner: "Vikram R.", requiresApproval: false },
  { id: "q2", number: "QT-2026-041", title: "APAC Regional Deployment", company: "CloudBridge APAC", contact: "Mei Lin Chen", value: 85000, status: "viewed", createdAt: "Feb 5", expiresAt: "Feb 19", items: 2, discount: 5, owner: "Arun K.", requiresApproval: false },
  { id: "q3", number: "QT-2026-040", title: "RevOps Automation Package", company: "HealthTech Innovations", contact: "Dr. Priya Reddy", value: 65000, status: "accepted", createdAt: "Jan 28", expiresAt: "Feb 11", items: 2, discount: 0, owner: "Priya S.", requiresApproval: false },
  { id: "q4", number: "QT-2026-039", title: "Data Integration Platform - Custom", company: "DataVault Australia", contact: "Sarah Mitchell", value: 95000, status: "draft", createdAt: "Feb 9", expiresAt: "Feb 23", items: 4, discount: 15, owner: "Anjali P.", requiresApproval: true },
  { id: "q5", number: "QT-2026-038", title: "Renewal + API Access Expansion", company: "FinanceFlow Solutions", contact: "Suresh Iyer", value: 52000, status: "sent", createdAt: "Feb 4", expiresAt: "Feb 18", items: 2, discount: 8, owner: "Rajesh M.", requiresApproval: false },
  { id: "q6", number: "QT-2026-037", title: "Starter Integration Package", company: "RetailNest Pte Ltd", contact: "Arun Tiwari", value: 28000, status: "expired", createdAt: "Jan 15", expiresAt: "Jan 29", items: 1, discount: 0, owner: "Vikram R.", requiresApproval: false },
]

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  sent: "secondary",
  viewed: "secondary",
  accepted: "default",
  expired: "destructive",
  declined: "destructive",
}

export default function QuotesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = quotes.filter((q) => {
    const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.company.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || q.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalValue = quotes.reduce((s, q) => s + q.value, 0)
  const accepted = quotes.filter((q) => q.status === "accepted")
  const pending = quotes.filter((q) => ["sent", "viewed"].includes(q.status))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quotes & Contracts</h1>
          <p className="text-sm text-muted-foreground">Create, send, and track quotes with e-signature integration</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> New Quote</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-blue-500" /><span className="text-xs text-muted-foreground">Total Quoted</span></div><p className="text-lg font-semibold">${(totalValue / 1000).toFixed(0)}K</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-xs text-muted-foreground">Accepted</span></div><p className="text-lg font-semibold">{accepted.length} (${(accepted.reduce((s, q) => s + q.value, 0) / 1000).toFixed(0)}K)</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><Clock className="w-4 h-4 text-amber-500" /><span className="text-xs text-muted-foreground">Pending</span></div><p className="text-lg font-semibold">{pending.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><FileSignature className="w-4 h-4 text-purple-500" /><span className="text-xs text-muted-foreground">Win Rate</span></div><p className="text-lg font-semibold">{Math.round((accepted.length / quotes.length) * 100)}%</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search quotes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center hidden md:table-cell">Discount</TableHead>
                <TableHead className="hidden lg:table-cell">Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((q) => (
                <TableRow key={q.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium text-sm">{q.title}</p>
                        <p className="text-[10px] text-muted-foreground">{q.number} · {q.company} · {q.contact}</p>
                      </div>
                      {q.requiresApproval && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" title="Requires approval" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold font-mono text-sm">${(q.value / 1000).toFixed(0)}K</TableCell>
                  <TableCell className="text-center"><Badge variant={statusVariant[q.status]} className="text-[10px] capitalize">{q.status}</Badge></TableCell>
                  <TableCell className="text-center text-xs hidden md:table-cell">{q.discount > 0 ? <span className="text-amber-500 font-medium">{q.discount}%</span> : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{q.expiresAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="w-3.5 h-3.5" /></Button>
                      {q.status === "draft" && <Button variant="ghost" size="icon" className="h-7 w-7"><Send className="w-3.5 h-3.5 text-blue-500" /></Button>}
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
