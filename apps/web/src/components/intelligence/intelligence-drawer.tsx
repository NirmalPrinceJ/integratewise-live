"use client"

/**
 * Intelligence Drawer — Module-aware AI agent panel
 * Ported from Figma Design intelligence-drawer.tsx
 * Shows Spine nodes, Hub (RBAC), Agents, Evidence chain per active module
 */

import { useState } from "react"
import {
  X, Maximize2, Minimize2, Network, Shield, Bot, FileSearch,
  ChevronRight, Sparkles, CheckCircle, Clock, AlertCircle, ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAgents } from "@/hooks/use-agent-colony"

type IntelTab = "spine" | "hub" | "agents" | "evidence"

interface IntelligenceDrawerProps {
  isOpen: boolean
  activeModule: string
  onClose: () => void
}

// Icons for named agents (fallback when API doesn't include icon)
const AGENT_ICONS: Record<string, string> = {
  forecast: "📊", churn: "🔍", quality: "🔬", nba: "🎯",
  sentiment: "📧", anomaly: "🔔", architect: "🏗️", template: "✨",
  success: "🧭", dealdesk: "💼", vault: "🔒", data: "📡",
}

// Module affinity — which agents show for which workspace modules
const AGENT_MODULES: Record<string, string[]> = {
  forecast: ["ops", "sales", "revops"],
  churn: ["ops", "sales", "marketing", "cs"],
  quality: ["ops"],
  nba: ["sales", "marketing", "cs"],
  sentiment: ["sales", "marketing"],
  anomaly: ["ops", "website"],
  architect: ["website"],
  template: ["website", "marketing"],
  success: ["sales", "cs"],
  dealdesk: ["sales"],
  vault: ["ops", "it_admin"],
  data: ["ops", "it_admin"],
}

const spineNodes = [
  { id: "n1", type: "account", label: "TechServe India", source: "Salesforce", connections: 12, lastUpdate: "2 min ago" },
  { id: "n2", type: "contact", label: "Ravi Sharma (CTO)", source: "CRM + Email", connections: 8, lastUpdate: "15 min ago" },
  { id: "n3", type: "transaction", label: "Invoice #INV-2026-042", source: "Stripe", connections: 3, lastUpdate: "1h ago" },
  { id: "n4", type: "activity", label: "QBR Meeting Notes", source: "Slack + Zoom", connections: 5, lastUpdate: "30 min ago" },
  { id: "n5", type: "document", label: "SOW v3.2", source: "Google Drive", connections: 4, lastUpdate: "2h ago" },
  { id: "n6", type: "task", label: "Renewal Review", source: "Asana", connections: 2, lastUpdate: "45 min ago" },
]

const nodeColors: Record<string, string> = {
  account: "bg-blue-500",
  contact: "bg-green-500",
  transaction: "bg-amber-500",
  activity: "bg-purple-500",
  document: "bg-pink-500",
  task: "bg-gray-400",
}

const evidenceChain = [
  { id: 1, type: "source", label: "Salesforce: Account Record", confidence: 99, time: "Real-time sync" },
  { id: 2, type: "source", label: "Stripe: Payment History", confidence: 99, time: "Hourly sync" },
  { id: 3, type: "source", label: "Slack: #techserve-support", confidence: 95, time: "Streaming" },
  { id: 4, type: "transform", label: "Spine: Data Normalization", confidence: 97, time: "Processed 2 min ago" },
  { id: 5, type: "ai", label: "ChurnShield: Risk Assessment", confidence: 82, time: "Model v3.2, Claude 3" },
  { id: 6, type: "insight", label: "Account Health: 78/100 (At-Risk)", confidence: 82, time: "Generated 1 min ago" },
]

const statusBadge: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  learning: "secondary",
  attention: "destructive",
  error: "destructive",
  paused: "outline",
}

function getModuleKey(path: string): string {
  if (path.includes("marketing")) return "marketing"
  if (path.includes("sales") || path.includes("revops")) return "sales"
  if (path.includes("cs")) return "cs"
  if (path.includes("website")) return "website"
  return "ops"
}

export function IntelligenceDrawer({ isOpen, activeModule, onClose }: IntelligenceDrawerProps) {
  const [activeTab, setActiveTab] = useState<IntelTab>("spine")
  const [expanded, setExpanded] = useState(false)
  const { agents: liveAgents } = useAgents()

  const moduleKey = getModuleKey(activeModule)

  // Merge live agent data with module affinity + icons
  const enrichedAgents = liveAgents.map((a) => ({
    ...a,
    icon: AGENT_ICONS[a.id] || "🤖",
    modules: AGENT_MODULES[a.id] || [],
  }))
  const relevantAgents = enrichedAgents.filter((a) => a.modules.includes(moduleKey))

  if (!isOpen) return null

  const tabs: { id: IntelTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "spine", label: "Spine", icon: Network },
    { id: "hub", label: "Hub", icon: Shield },
    { id: "agents", label: "Agents", icon: Bot },
    { id: "evidence", label: "Evidence", icon: FileSearch },
  ]

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-2xl rounded-t-2xl transition-all duration-300 ${expanded ? "h-[90vh]" : "h-[55vh]"}`}>
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span className="text-sm font-medium">Intelligence: {moduleKey}</span>
            <Badge variant="outline" className="text-[10px]">L2 Overlay</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(!expanded)}>
              {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-2 border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${
                  activeTab === tab.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: expanded ? "calc(90vh - 120px)" : "calc(55vh - 120px)" }}>
          {activeTab === "spine" && <SpineTabView />}
          {activeTab === "hub" && <HubTabView />}
          {activeTab === "agents" && <AgentsTabView agents={relevantAgents} />}
          {activeTab === "evidence" && <EvidenceTabView />}
        </div>
      </div>
    </>
  )
}

/* ─── Tab Content ─── */

function SpineTabView() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Unified Data Graph — Entity relationships across connected systems</p>

      {/* Graph nodes */}
      <div className="flex flex-wrap gap-4 justify-center p-6 rounded-lg border bg-muted/30 min-h-[160px] items-center">
        {spineNodes.map((node) => (
          <div key={node.id} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
            <div className={`w-14 h-14 rounded-full ${nodeColors[node.type]} text-white flex items-center justify-center text-lg relative`}>
              {node.type === "account" ? "🔵" : node.type === "contact" ? "🟢" : node.type === "transaction" ? "🟡" : node.type === "activity" ? "🟣" : node.type === "document" ? "📄" : "📋"}
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${nodeColors[node.type]} text-[8px] flex items-center justify-center text-white font-bold border-2 border-background`}>
                {node.connections}
              </div>
            </div>
            <span className="text-[9px] text-muted-foreground">{node.label.split(" ")[0]}</span>
          </div>
        ))}
      </div>

      {/* Node List */}
      <div className="space-y-2">
        {spineNodes.map((node) => (
          <div key={node.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer">
            <div className={`w-3 h-3 rounded-full ${nodeColors[node.type]}`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{node.label}</div>
              <div className="text-[10px] text-muted-foreground">{node.type} · {node.source}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground">{node.connections} connections</div>
              <div className="text-[10px] text-muted-foreground/60">{node.lastUpdate}</div>
            </div>
            <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
          </div>
        ))}
      </div>
    </div>
  )
}

function HubTabView() {
  const permissions = [
    { user: "Arun K.", role: "Admin", accounts: "Full", contacts: "Full", revenue: "Full", docs: "Full" },
    { user: "Priya S.", role: "Ops Manager", accounts: "Edit", contacts: "Edit", revenue: "View", docs: "Edit" },
    { user: "Rajesh M.", role: "Analyst", accounts: "View", contacts: "View", revenue: "View", docs: "View" },
    { user: "Anjali P.", role: "CS Lead", accounts: "Edit", contacts: "Full", revenue: "View", docs: "Edit" },
  ]

  const accessColors: Record<string, string> = {
    Full: "text-green-600",
    Edit: "text-blue-600",
    View: "text-amber-500",
    None: "text-muted-foreground",
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Hub Router — Data routing, RBAC, and governance</p>

      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-2 border-b flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-medium">Permission Matrix</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-3 py-2 text-muted-foreground font-medium">User</th>
                  <th className="text-left px-3 py-2 text-muted-foreground font-medium">Role</th>
                  <th className="text-center px-3 py-2 text-muted-foreground font-medium">Accounts</th>
                  <th className="text-center px-3 py-2 text-muted-foreground font-medium">Contacts</th>
                  <th className="text-center px-3 py-2 text-muted-foreground font-medium">Revenue</th>
                  <th className="text-center px-3 py-2 text-muted-foreground font-medium">Docs</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((p) => (
                  <tr key={p.user} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">{p.user}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.role}</td>
                    {[p.accounts, p.contacts, p.revenue, p.docs].map((lvl, i) => (
                      <td key={i} className={`px-3 py-2 text-center font-medium ${accessColors[lvl]}`}>{lvl}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AgentsTabView({ agents: agentList }: { agents: Array<{ id: string; name: string; status: string; lastRun: string; successRate: number; actionsThisWeek: number; icon?: string; modules?: string[] }> }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{agentList.length} agents active in this context</p>
      {agentList.map((agent) => (
        <Card key={agent.id} className="cursor-pointer hover:bg-muted/30 transition-colors">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">{agent.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{agent.name}</span>
                  <Badge variant={statusBadge[agent.status]} className="text-[10px] capitalize">{agent.status}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span>Last: {agent.lastRun}</span>
                  <span>{agent.actionsThisWeek} actions/wk</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold">{agent.successRate}%</div>
                <Progress value={agent.successRate} className="h-1 w-16 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EvidenceTabView() {
  const typeColors: Record<string, string> = {
    source: "bg-blue-500",
    transform: "bg-purple-500",
    ai: "bg-amber-500",
    insight: "bg-emerald-500",
  }
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Evidence Chain — Full provenance for the latest insight</p>
      <div className="space-y-0 relative">
        <div className="absolute left-[18px] top-6 bottom-6 w-0.5 bg-border" />
        {evidenceChain.map((step) => (
          <div key={step.id} className="flex items-start gap-3 p-3 relative">
            <div className={`w-4 h-4 rounded-full ${typeColors[step.type]} border-2 border-background flex-shrink-0 mt-0.5 z-10`} />
            <div className="flex-1">
              <div className="text-sm font-medium">{step.label}</div>
              <div className="text-[10px] text-muted-foreground">{step.time}</div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">{step.confidence}%</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
