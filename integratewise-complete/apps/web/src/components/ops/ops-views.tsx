"use client"

/**
 * Ops domain-specific views: Capacity, Processes, Resources.
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Activity, Box, ChevronRight, Cpu, Layers,
  Plus, Server, Settings, Users, Wrench,
} from "lucide-react"

/* ─── Capacity View ─── */
const teamCapacity = [
  { name: "Engineering", members: 52, allocated: 88, available: 12, utilization: 88 },
  { name: "Sales", members: 28, allocated: 95, available: 5, utilization: 95 },
  { name: "CS", members: 22, allocated: 82, available: 18, utilization: 82 },
  { name: "Marketing", members: 14, allocated: 76, available: 24, utilization: 76 },
  { name: "Ops", members: 8, allocated: 90, available: 10, utilization: 90 },
]
const infrastructure = [
  { name: "API Gateway", usage: 72, limit: "10K req/s", status: "healthy" },
  { name: "Database (Primary)", usage: 58, limit: "500GB", status: "healthy" },
  { name: "Redis Cache", usage: 45, limit: "16GB", status: "healthy" },
  { name: "Worker Queue", usage: 84, limit: "1000 jobs/min", status: "warning" },
  { name: "Storage (S3)", usage: 31, limit: "2TB", status: "healthy" },
]

export function CapacityView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <h2 className="text-lg font-semibold">Capacity Planning</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Team Utilization</h3>
            <div className="space-y-3">
              {teamCapacity.map((t) => (
                <div key={t.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">{t.name} <span className="text-muted-foreground font-normal">({t.members})</span></span>
                    <span className={t.utilization > 90 ? "text-red-600" : t.utilization > 80 ? "text-amber-600" : "text-green-600"}>{t.utilization}%</span>
                  </div>
                  <Progress value={t.utilization} className={`h-2 ${t.utilization > 90 ? "[&>div]:bg-red-500" : t.utilization > 80 ? "[&>div]:bg-amber-500" : ""}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Infrastructure</h3>
            <div className="space-y-3">
              {infrastructure.map((inf) => (
                <div key={inf.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium flex items-center gap-1.5"><Server className="w-3 h-3" /> {inf.name}</span>
                    <span className="text-muted-foreground">{inf.limit}</span>
                  </div>
                  <Progress value={inf.usage} className={`h-2 ${inf.usage > 80 ? "[&>div]:bg-amber-500" : ""}`} />
                  <div className="text-[9px] text-muted-foreground mt-0.5">{inf.usage}% used</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ─── Processes View ─── */
const processes = [
  { name: "Customer Onboarding", owner: "CS Team", sla: "5 business days", compliance: 94, runs: 28, avgTime: "3.2d" },
  { name: "Deal Desk Approval", owner: "Sales Ops", sla: "24 hours", compliance: 87, runs: 42, avgTime: "18h" },
  { name: "Incident Response", owner: "Engineering", sla: "P1: 15 min", compliance: 100, runs: 3, avgTime: "8 min" },
  { name: "Employee Offboarding", owner: "HR", sla: "48 hours", compliance: 92, runs: 3, avgTime: "1.5d" },
  { name: "Vendor Assessment", owner: "Procurement", sla: "10 days", compliance: 78, runs: 5, avgTime: "12d" },
  { name: "Content Approval", owner: "Marketing", sla: "3 days", compliance: 96, runs: 18, avgTime: "2.1d" },
]

export function ProcessesView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Business Processes</h2>
        <Button size="sm"><Settings className="w-3.5 h-3.5 mr-1.5" /> Define Process</Button>
      </div>
      <div className="space-y-3">
        {processes.map((p) => (
          <Card key={p.name} className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{p.owner} · SLA: {p.sla} · Avg: {p.avgTime}</div>
                </div>
                <div className="text-center mr-2">
                  <div className={`text-xs font-bold ${p.compliance >= 95 ? "text-green-600" : p.compliance >= 85 ? "text-amber-600" : "text-red-600"}`}>{p.compliance}%</div>
                  <div className="text-[8px] text-muted-foreground">SLA met</div>
                </div>
                <Badge variant="outline" className="text-[9px]">{p.runs} runs</Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Resources View ─── */
const resources = [
  { name: "Salesforce", type: "CRM", status: "connected", health: 98, entities: 12_400, lastSync: "2 min ago" },
  { name: "Slack", type: "Communication", status: "connected", health: 100, entities: 8_200, lastSync: "real-time" },
  { name: "Jira", type: "Project Mgmt", status: "connected", health: 95, entities: 3_400, lastSync: "5 min ago" },
  { name: "HubSpot", type: "Marketing", status: "connected", health: 88, entities: 6_100, lastSync: "15 min ago" },
  { name: "Zendesk", type: "Support", status: "degraded", health: 72, entities: 2_800, lastSync: "1h ago" },
  { name: "QuickBooks", type: "Finance", status: "disconnected", health: 0, entities: 0, lastSync: "—" },
]
const resStatus: Record<string, string> = { connected: "bg-green-500/10 text-green-600", degraded: "bg-amber-500/10 text-amber-600", disconnected: "bg-red-500/10 text-red-600" }

export function ResourcesView() {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Connected Resources</h2>
        <Button size="sm"><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Integration</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {resources.map((r) => (
          <Card key={r.name} className={`hover:shadow-sm transition-shadow cursor-pointer ${r.status === "disconnected" ? "opacity-60" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Cpu className={`w-5 h-5 ${r.status === "connected" ? "text-green-500" : r.status === "degraded" ? "text-amber-500" : "text-red-500"}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground">{r.type}</div>
                </div>
                <Badge variant="outline" className={`text-[9px] ${resStatus[r.status]}`}>{r.status}</Badge>
              </div>
              {r.status !== "disconnected" && (
                <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                  <div>Health: <span className="font-medium text-foreground">{r.health}%</span></div>
                  <div>Entities: <span className="font-medium text-foreground">{r.entities.toLocaleString()}</span></div>
                  <div className="col-span-2">Last sync: {r.lastSync}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
