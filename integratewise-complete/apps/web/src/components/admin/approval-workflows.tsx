"use client"

/**
 * Approval Workflows — Multi-step approval queue for RBAC changes
 * Ported from Figma Design admin/approval-workflows.tsx
 */

import { useState } from "react"
import {
  Clock, CheckCircle, XCircle, AlertTriangle, ChevronRight, Users,
  Eye, MessageSquare, Search, Filter, Check, X, Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ApprovalRequest {
  id: string
  type: "role_change" | "permission_change" | "field_access_change" | "new_role"
  status: "pending" | "approved" | "rejected" | "expired"
  priority: "low" | "medium" | "high" | "critical"
  requestedBy: { name: string; initials: string; role: string }
  requestedAt: string
  expiresAt: string
  title: string
  description: string
  approvers: { name: string; initials: string; status: "pending" | "approved" | "rejected" }[]
  impactSummary: string
  affectedUsers: number
}

const mockApprovals: ApprovalRequest[] = [
  {
    id: "apr-1", type: "role_change", status: "pending", priority: "high",
    requestedBy: { name: "Priya Sharma", initials: "PS", role: "Ops Manager" },
    requestedAt: "12 min ago", expiresAt: "2026-02-11",
    title: "Role Change: Vikram Rao → Admin",
    description: "Elevate Vikram Rao from Analyst to Admin role for Q1 audit oversight",
    approvers: [{ name: "Arun Kumar", initials: "AK", status: "pending" }, { name: "Rajesh Menon", initials: "RM", status: "approved" }],
    impactSummary: "Grants full admin access including billing, api keys, and user management",
    affectedUsers: 1,
  },
  {
    id: "apr-2", type: "permission_change", status: "pending", priority: "medium",
    requestedBy: { name: "Anjali Patel", initials: "AP", role: "CS Lead" },
    requestedAt: "2 hours ago", expiresAt: "2026-02-12",
    title: "Enable Export for Marketing Module",
    description: "Grant export_data permission to CS Lead role for marketing module reports",
    approvers: [{ name: "Arun Kumar", initials: "AK", status: "pending" }],
    impactSummary: "Allows CS team to export marketing analytics data",
    affectedUsers: 2,
  },
  {
    id: "apr-3", type: "field_access_change", status: "approved", priority: "critical",
    requestedBy: { name: "Arun Kumar", initials: "AK", role: "Super Admin" },
    requestedAt: "1 day ago", expiresAt: "2026-02-10",
    title: "Unmask Revenue Fields for Analyst",
    description: "Change revenue_fields access from 'masked' to 'full' for Analyst role during board review period",
    approvers: [{ name: "Arun Kumar", initials: "AK", status: "approved" }, { name: "Rajesh Menon", initials: "RM", status: "approved" }],
    impactSummary: "5 analysts will see raw revenue figures including deal amounts",
    affectedUsers: 5,
  },
  {
    id: "apr-4", type: "role_change", status: "rejected", priority: "low",
    requestedBy: { name: "Deepak Jain", initials: "DJ", role: "Sales Rep" },
    requestedAt: "3 days ago", expiresAt: "2026-02-08",
    title: "Request Admin Access",
    description: "Self-request for admin role to configure integrations",
    approvers: [{ name: "Arun Kumar", initials: "AK", status: "rejected" }],
    impactSummary: "Would grant full system access to sales rep — security risk",
    affectedUsers: 1,
  },
]

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-amber-500", label: "Pending" },
  approved: { icon: CheckCircle, color: "text-green-500", label: "Approved" },
  rejected: { icon: XCircle, color: "text-red-500", label: "Rejected" },
  expired: { icon: AlertTriangle, color: "text-muted-foreground", label: "Expired" },
}

const priorityColors: Record<string, string> = {
  critical: "bg-red-500/10 text-red-600",
  high: "bg-orange-500/10 text-orange-600",
  medium: "bg-amber-500/10 text-amber-600",
  low: "bg-muted text-muted-foreground",
}

export function ApprovalWorkflows() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = mockApprovals
    .filter((a) => filter === "all" || a.status === filter)
    .filter((a) => !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.description.toLowerCase().includes(searchQuery.toLowerCase()))

  const pendingCount = mockApprovals.filter((a) => a.status === "pending").length

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Approval Workflows</h2>
          <p className="text-sm text-muted-foreground mt-1">{pendingCount} pending approvals require your attention</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex p-0.5 bg-secondary rounded-lg">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                filter === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}{f === "pending" && pendingCount > 0 && ` (${pendingCount})`}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search approvals..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-8 text-sm" />
        </div>
      </div>

      {/* Approval Cards */}
      <div className="space-y-3">
        {filtered.map((req) => {
          const sc = statusConfig[req.status]
          const StatusIcon = sc.icon
          const isExpanded = expandedId === req.id
          return (
            <Card key={req.id} className={`transition-all ${req.status === "pending" ? "border-amber-500/30" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <StatusIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${sc.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{req.title}</span>
                      <Badge variant="outline" className={`text-[10px] ${priorityColors[req.priority]}`}>{req.priority}</Badge>
                      <Badge variant="outline" className="text-[10px]">{req.type.replaceAll("_", " ")}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{req.description}</p>

                    <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                      <span>By {req.requestedBy.name} ({req.requestedBy.role})</span>
                      <span>{req.requestedAt}</span>
                      <span>{req.affectedUsers} user{req.affectedUsers > 1 ? "s" : ""} affected</span>
                    </div>

                    {/* Approvers */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[10px] text-muted-foreground font-medium">Approvers:</span>
                      {req.approvers.map((ap) => (
                        <div key={ap.name} className="flex items-center gap-1">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${ap.status === "approved" ? "bg-green-500" : ap.status === "rejected" ? "bg-red-500" : "bg-muted-foreground/30"}`}>
                            {ap.initials}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    {req.status === "pending" && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        <Button size="sm" variant="default" className="h-7 gap-1 text-xs"><Check className="w-3 h-3" /> Approve</Button>
                        <Button size="sm" variant="destructive" className="h-7 gap-1 text-xs"><X className="w-3 h-3" /> Reject</Button>
                        <Button size="sm" variant="outline" className="h-7 gap-1 text-xs"><MessageSquare className="w-3 h-3" /> Comment</Button>
                      </div>
                    )}

                    {isExpanded && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/30 text-xs">
                        <p className="font-medium mb-1">Impact Summary</p>
                        <p className="text-muted-foreground">{req.impactSummary}</p>
                      </div>
                    )}
                  </div>

                  <button onClick={() => setExpandedId(isExpanded ? null : req.id)} className="p-1 rounded hover:bg-secondary">
                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
