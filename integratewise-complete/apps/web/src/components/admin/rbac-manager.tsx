"use client"

/**
 * RBAC Manager — Role-based access control matrix + field-level access + audit
 * Ported from Figma Design admin/rbac-manager.tsx
 */

import { useState } from "react"
import {
  Shield, ShieldCheck, Plus, Search, ChevronDown, ChevronRight,
  CheckCircle, XCircle, MinusCircle, Lock, Eye, Users, Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

/* ─── Types ─── */
type RoleId = "super_admin" | "admin" | "ops_manager" | "analyst" | "cs_lead" | "sales_rep" | "marketing_mgr" | "viewer" | "external_auditor"
interface ModulePermission { view: boolean; create: boolean; edit: boolean; delete: boolean; admin: boolean }
interface FieldAccessConfig { revenue_fields: "full" | "masked" | "hidden"; contact_pii: "full" | "masked" | "hidden"; api_keys: "full" | "masked" | "hidden"; audit_logs: "full" | "read" | "hidden"; billing_info: "full" | "masked" | "hidden" }

interface Role {
  id: RoleId; name: string; description: string; color: string
  isSystem: boolean; userCount: number
  permissions: Record<string, ModulePermission>
  crossCut: Record<string, boolean | string>
  fieldAccess: FieldAccessConfig
}

interface AuditEntry {
  id: string; timestamp: string; user: string
  action: string; target: string; details: string
  severity: "info" | "warning" | "critical"
}

/* ─── Data ─── */
const roles: Role[] = [
  {
    id: "super_admin", name: "Super Admin", description: "Full system access", color: "#E53935", isSystem: true, userCount: 1,
    permissions: { business_ops: { view: true, create: true, edit: true, delete: true, admin: true }, website: { view: true, create: true, edit: true, delete: true, admin: true }, marketing: { view: true, create: true, edit: true, delete: true, admin: true }, sales: { view: true, create: true, edit: true, delete: true, admin: true }, admin: { view: true, create: true, edit: true, delete: true, admin: true } },
    crossCut: { intelligence_overlay: "full", integrations_manage: true, workflows_create: true, agents_configure: true, export_data: true, api_access: true },
    fieldAccess: { revenue_fields: "full", contact_pii: "full", api_keys: "full", audit_logs: "full", billing_info: "full" },
  },
  {
    id: "ops_manager", name: "Ops Manager", description: "Operational oversight", color: "#1A73E8", isSystem: true, userCount: 3,
    permissions: { business_ops: { view: true, create: true, edit: true, delete: false, admin: false }, website: { view: true, create: true, edit: true, delete: false, admin: false }, marketing: { view: true, create: false, edit: false, delete: false, admin: false }, sales: { view: true, create: false, edit: false, delete: false, admin: false }, admin: { view: true, create: false, edit: false, delete: false, admin: false } },
    crossCut: { intelligence_overlay: "read", integrations_manage: true, workflows_create: true, agents_configure: false, export_data: true, api_access: false },
    fieldAccess: { revenue_fields: "full", contact_pii: "masked", api_keys: "hidden", audit_logs: "read", billing_info: "masked" },
  },
  {
    id: "analyst", name: "Analyst", description: "Read-only + reports", color: "#7C4DFF", isSystem: true, userCount: 5,
    permissions: { business_ops: { view: true, create: false, edit: false, delete: false, admin: false }, website: { view: true, create: false, edit: false, delete: false, admin: false }, marketing: { view: true, create: false, edit: false, delete: false, admin: false }, sales: { view: true, create: false, edit: false, delete: false, admin: false }, admin: { view: false, create: false, edit: false, delete: false, admin: false } },
    crossCut: { intelligence_overlay: "read", integrations_manage: false, workflows_create: false, agents_configure: false, export_data: true, api_access: false },
    fieldAccess: { revenue_fields: "masked", contact_pii: "hidden", api_keys: "hidden", audit_logs: "hidden", billing_info: "hidden" },
  },
  {
    id: "cs_lead", name: "CS Lead", description: "Customer Success management", color: "#0F9D58", isSystem: true, userCount: 2,
    permissions: { business_ops: { view: true, create: false, edit: false, delete: false, admin: false }, website: { view: false, create: false, edit: false, delete: false, admin: false }, marketing: { view: true, create: false, edit: false, delete: false, admin: false }, sales: { view: true, create: true, edit: true, delete: false, admin: false }, admin: { view: false, create: false, edit: false, delete: false, admin: false } },
    crossCut: { intelligence_overlay: "full", integrations_manage: false, workflows_create: true, agents_configure: false, export_data: true, api_access: false },
    fieldAccess: { revenue_fields: "full", contact_pii: "full", api_keys: "hidden", audit_logs: "read", billing_info: "masked" },
  },
  {
    id: "viewer", name: "Viewer", description: "View only — no edits", color: "#9E9E9E", isSystem: true, userCount: 8,
    permissions: { business_ops: { view: true, create: false, edit: false, delete: false, admin: false }, website: { view: true, create: false, edit: false, delete: false, admin: false }, marketing: { view: true, create: false, edit: false, delete: false, admin: false }, sales: { view: true, create: false, edit: false, delete: false, admin: false }, admin: { view: false, create: false, edit: false, delete: false, admin: false } },
    crossCut: { intelligence_overlay: "none", integrations_manage: false, workflows_create: false, agents_configure: false, export_data: false, api_access: false },
    fieldAccess: { revenue_fields: "hidden", contact_pii: "hidden", api_keys: "hidden", audit_logs: "hidden", billing_info: "hidden" },
  },
]

const auditEntries: AuditEntry[] = [
  { id: "1", timestamp: "2026-02-10T09:15:00Z", user: "Arun Kumar", action: "role_changed", target: "Priya Sharma", details: "Changed role from Analyst to Ops Manager", severity: "warning" },
  { id: "2", timestamp: "2026-02-09T14:30:00Z", user: "System", action: "permission_changed", target: "CS Lead role", details: "Added workflow_create permission", severity: "info" },
  { id: "3", timestamp: "2026-02-08T11:00:00Z", user: "Arun Kumar", action: "invite_sent", target: "new.user@integratewise.com", details: "Invited as Analyst", severity: "info" },
  { id: "4", timestamp: "2026-02-07T16:45:00Z", user: "Rajesh Menon", action: "exported", target: "Revenue Dashboard", details: "Exported Q4 revenue data (15,234 rows)", severity: "warning" },
  { id: "5", timestamp: "2026-02-06T08:00:00Z", user: "System", action: "login", target: "Vikram Rao", details: "Login from new IP: 203.145.xx.xx", severity: "critical" },
]

const moduleNames: Record<string, string> = { business_ops: "Business Ops", website: "Website", marketing: "Marketing", sales: "Sales", admin: "Admin & Governance" }
const permLabels = ["view", "create", "edit", "delete", "admin"] as const
const fieldLabels: Record<string, string> = { revenue_fields: "Revenue & Financial Data", contact_pii: "Contact PII (Email, Phone)", api_keys: "API Keys & Secrets", audit_logs: "Audit Logs", billing_info: "Billing Information" }
const fieldLevelColors: Record<string, { bg: string; text: string; label: string }> = {
  full: { bg: "bg-green-500/10", text: "text-green-600", label: "Full" },
  masked: { bg: "bg-amber-500/10", text: "text-amber-600", label: "Masked" },
  read: { bg: "bg-blue-500/10", text: "text-blue-600", label: "Read" },
  hidden: { bg: "bg-muted", text: "text-muted-foreground", label: "Hidden" },
}

type TabType = "matrix" | "field-access" | "audit"

export function RBACManager() {
  const [activeTab, setActiveTab] = useState<TabType>("matrix")
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(["business_ops", "sales"]))
  const [searchQuery, setSearchQuery] = useState("")

  const toggleModule = (mod: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(mod)) next.delete(mod)
      else next.add(mod)
      return next
    })
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Roles & Permissions (RBAC)</h2>
          <p className="text-sm text-muted-foreground mt-1">Define roles, manage permission matrices, and control field-level access</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> New Role</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {[
          { id: "matrix" as const, label: "Permission Matrix", icon: Shield },
          { id: "field-access" as const, label: "Field-Level Access", icon: Lock },
          { id: "audit" as const, label: "Audit Log", icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm border-b-2 -mb-px transition-colors ${
                activeTab === tab.id ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Role badges */}
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <Badge key={role.id} variant="outline" className="gap-1.5 py-1" style={{ borderColor: role.color }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: role.color }} />
            {role.name} <span className="text-muted-foreground">({role.userCount})</span>
          </Badge>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "matrix" && (
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="w-full">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground w-48">Module / Permission</th>
                    {roles.map((r) => (
                      <th key={r.id} className="px-3 py-3 text-center font-medium" style={{ color: r.color }}>{r.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(moduleNames).map(([modKey, modName]) => (
                    <>
                      <tr key={modKey} className="border-b bg-muted/30 cursor-pointer hover:bg-muted/50" onClick={() => toggleModule(modKey)}>
                        <td className="px-4 py-2 font-medium flex items-center gap-2">
                          {expandedModules.has(modKey) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          {modName}
                        </td>
                        {roles.map((r) => {
                          const mp = r.permissions[modKey]
                          const allTrue = mp && Object.values(mp).every(Boolean)
                          const anyTrue = mp && Object.values(mp).some(Boolean)
                          return (
                            <td key={r.id} className="px-3 py-2 text-center">
                              {allTrue ? <CheckCircle className="w-4 h-4 text-green-500 inline" /> : anyTrue ? <MinusCircle className="w-4 h-4 text-amber-500 inline" /> : <XCircle className="w-4 h-4 text-muted-foreground/40 inline" />}
                            </td>
                          )
                        })}
                      </tr>
                      {expandedModules.has(modKey) && permLabels.map((perm) => (
                        <tr key={`${modKey}-${perm}`} className="border-b">
                          <td className="pl-10 pr-4 py-1.5 text-muted-foreground capitalize">{perm}</td>
                          {roles.map((r) => {
                            const val = r.permissions[modKey]?.[perm]
                            return (
                              <td key={r.id} className="px-3 py-1.5 text-center">
                                {val ? <CheckCircle className="w-3.5 h-3.5 text-green-500 inline" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/30 inline" />}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {activeTab === "field-access" && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground w-56">Field Category</th>
                  {roles.map((r) => (
                    <th key={r.id} className="px-3 py-3 text-center font-medium" style={{ color: r.color }}>{r.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(fieldLabels).map(([fieldKey, label]) => (
                  <tr key={fieldKey} className="border-b">
                    <td className="px-4 py-2.5 font-medium">{label}</td>
                    {roles.map((r) => {
                      const level = (r.fieldAccess as Record<string, string>)[fieldKey] || "hidden"
                      const cfg = fieldLevelColors[level] || fieldLevelColors.hidden
                      return (
                        <td key={r.id} className="px-3 py-2.5 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === "audit" && (
        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search audit log..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-8 text-sm" />
          </div>
          {auditEntries.filter((e) => !searchQuery || e.details.toLowerCase().includes(searchQuery.toLowerCase()) || e.user.toLowerCase().includes(searchQuery.toLowerCase())).map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-3 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${entry.severity === "critical" ? "bg-red-500" : entry.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{entry.user}</span>
                    <Badge variant="outline" className="text-[10px]">{entry.action.replaceAll("_", " ")}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{entry.details}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{new Date(entry.timestamp).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
