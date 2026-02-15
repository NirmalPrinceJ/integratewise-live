"use client"

/**
 * L2 Intelligence Overlay — 14-tab cognitive surface
 * Ported from Figma Design intelligence-overlay-new.tsx
 * Triggered by ⌘J — full-height bottom panel
 */

import { useState } from "react"
import {
  Network, Target, Brain, Layers, Zap, CheckCircle,
  ShieldCheck, RefreshCw, History, Settings, UserCircle,
  X, MessageSquare, Building2, DollarSign, Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { CTXEnum, L2Component } from "@/types/ctx"

interface IntelligenceOverlayProps {
  isOpen: boolean
  onClose: () => void
  activeCtx: CTXEnum
}

const L2_COMPONENTS: { id: L2Component; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "SpineUI", label: "Spine", icon: Network },
  { id: "ContextUI", label: "Context", icon: Target },
  { id: "KnowledgeUI", label: "Knowledge", icon: Brain },
  { id: "Evidence Drawer", label: "Evidence", icon: Layers },
  { id: "Signals", label: "Signals", icon: Zap },
  { id: "Think", label: "Think", icon: MessageSquare },
  { id: "Act", label: "Act", icon: CheckCircle },
  { id: "HITL", label: "HITL", icon: UserCircle },
  { id: "Govern", label: "Govern", icon: ShieldCheck },
  { id: "Adjust", label: "Adjust", icon: RefreshCw },
  { id: "Repeat", label: "Repeat", icon: RefreshCw },
  { id: "Audit Trail", label: "Audit", icon: History },
  { id: "Agent Config", label: "Agents", icon: Settings },
  { id: "Digital Twin", label: "Twin", icon: Network },
]

const IMPLEMENTED_TABS = ["SpineUI", "HITL", "Think", "Act", "Govern", "Digital Twin"]

export function IntelligenceOverlay({ isOpen, onClose, activeCtx }: IntelligenceOverlayProps) {
  const [activeTab, setActiveTab] = useState<L2Component>("SpineUI")

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={onClose} />

      {/* Bottom-up Panel */}
      <div className="fixed bottom-0 left-0 right-0 h-[85vh] bg-background border-t shadow-2xl z-[70] flex flex-col rounded-t-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                L2 Cognitive Intelligence
                <Badge variant="secondary" className="text-[10px]">{activeCtx}</Badge>
              </h2>
              <p className="text-xs text-muted-foreground">Unified Operational Knowledge Plane · ⌘J to close</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex-1 flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as L2Component)} className="flex-1 flex flex-col">
            <div className="border-b bg-background/50 sticky top-0 z-10">
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="h-12 bg-transparent gap-1 px-4 w-max">
                  {L2_COMPONENTS.map((comp) => (
                    <TabsTrigger
                      key={comp.id}
                      value={comp.id}
                      className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 text-xs"
                    >
                      <comp.icon className="w-4 h-4" />
                      {comp.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <div className="flex-1 overflow-hidden p-6">
              <TabsContent value="SpineUI" className="mt-0 h-full overflow-auto">
                <SpineView activeCtx={activeCtx} />
              </TabsContent>
              <TabsContent value="HITL" className="mt-0 h-full overflow-auto">
                <HITLView />
              </TabsContent>
              <TabsContent value="Think" className="mt-0 h-full overflow-auto">
                <ThinkView />
              </TabsContent>
              <TabsContent value="Act" className="mt-0 h-full overflow-auto">
                <ActView />
              </TabsContent>
              <TabsContent value="Govern" className="mt-0 h-full overflow-auto">
                <GovernView />
              </TabsContent>
              <TabsContent value="Digital Twin" className="mt-0 h-full overflow-auto">
                <DigitalTwinView activeCtx={activeCtx} />
              </TabsContent>
              {/* Placeholder tabs */}
              {L2_COMPONENTS.filter((c) => !IMPLEMENTED_TABS.includes(c.id)).map((comp) => (
                <TabsContent key={comp.id} value={comp.id} className="mt-0 h-full">
                  <div className="flex flex-col items-center justify-center h-full text-center p-12 opacity-50">
                    <comp.icon className="w-12 h-12 mb-4" />
                    <h3 className="text-xl font-medium">{comp.label} Module</h3>
                    <p className="text-sm text-muted-foreground max-w-md mt-2">
                      The {comp.label} component of the L2 Cognitive layer is being reconciled with the SSOT Spine.
                    </p>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </>
  )
}

/* ═══════════ Sub-Views ═══════════ */

function SpineView({ activeCtx }: { activeCtx: string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Network className="w-4 h-4" /> Active Spine Nodes ({activeCtx})
            </h3>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-background border flex items-center justify-center font-mono text-xs">A{i}</div>
                    <div>
                      <div className="font-medium">Canonical Account Node {i}</div>
                      <div className="text-xs text-muted-foreground">Source: Salesforce · Updated 2m ago</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">goal_ref: GOAL_{i}00</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h3 className="font-medium text-primary mb-1 text-sm">Normalization Health</h3>
            <div className="text-2xl font-bold">98.4%</div>
            <p className="text-xs text-muted-foreground">Sectorizer active · 0 collisions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">Quick Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Entities</span><span className="font-mono">2,847</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Relationships</span><span className="font-mono">12,450</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Last Sync</span><span className="font-mono">2m ago</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Connectors</span><span className="font-mono">8 active</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function HITLView() {
  const approvals = [
    { title: "Update HubSpot Lifecycle Stage", confidence: 94, entity: "TechServe India", agent: "Next Best Action" },
    { title: "Send Renewal Reminder Email", confidence: 87, entity: "CloudBridge APAC", agent: "ChurnShield" },
  ]
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Human-in-the-Loop Approval Queue</h3>
      <div className="space-y-4">
        {approvals.map((item, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-muted-foreground">Confidence: {item.confidence}% · {item.entity}</div>
                    <Badge variant="outline" className="text-[10px] mt-1">{item.agent}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">Deny</Button>
                  <Button size="sm">Approve & Execute</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ThinkView() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto space-y-4 pr-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <Brain className="w-4 h-4" />
          </div>
          <div className="p-4 rounded-2xl rounded-tl-none bg-muted max-w-2xl text-sm leading-relaxed">
            <p className="font-bold mb-2">Analyzing Business Context...</p>
            <p>I have identified an expansion opportunity for the APAC region based on recent usage spikes. TechServe India shows 40% increased API calls, suggesting they're ready for an enterprise tier upgrade.</p>
            <div className="mt-3 flex gap-2">
              <Badge variant="secondary" className="text-[10px]">High Confidence</Badge>
              <Badge variant="outline" className="text-[10px]">Revenue Impact: $45K</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <div className="p-4 rounded-2xl rounded-tr-none bg-primary/10 max-w-2xl text-sm leading-relaxed">
            <p>What signals support this recommendation?</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <UserCircle className="w-4 h-4" />
          </div>
        </div>
      </div>
      <div className="border-t pt-4 mt-4">
        <div className="flex gap-2">
          <input className="flex-1 rounded-lg bg-muted px-4 py-2 text-sm outline-none" placeholder="Ask the cognitive layer..." />
          <Button size="sm">Send</Button>
        </div>
      </div>
    </div>
  )
}

function ActView() {
  const actions = [
    { label: "HubSpot Write-Back", status: "completed" },
    { label: "Slack Notification", status: "completed" },
    { label: "Salesforce Opportunity Update", status: "in-progress" },
    { label: "Email Sequence Trigger", status: "queued" },
  ]
  return (
    <div className="space-y-4">
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-medium">Execution Pipeline Status</h3>
          </div>
          <div className="space-y-3">
            {actions.map((act, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{act.label}</span>
                <Badge variant={act.status === "completed" ? "default" : act.status === "in-progress" ? "secondary" : "outline"} className="text-[10px]">
                  {act.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function GovernView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-xs text-muted-foreground mb-1">Policies Enforced</div><div className="text-2xl font-bold">892</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-xs text-muted-foreground mb-1">Audit Score</div><div className="text-2xl font-bold text-emerald-600">A+</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-xs text-muted-foreground mb-1">Violations (30d)</div><div className="text-2xl font-bold">3</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-xs text-muted-foreground mb-1">RBAC Coverage</div><div className="text-2xl font-bold">100%</div></CardContent></Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-3">Recent Policy Evaluations</h3>
          <div className="space-y-2">
            {[
              { policy: "PII Access Control", result: "pass", time: "2m ago" },
              { policy: "Export Rate Limit", result: "pass", time: "15m ago" },
              { policy: "Cross-Tenant Isolation", result: "pass", time: "1h ago" },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                <span>{p.policy}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{p.time}</span>
                  <Badge variant="default" className="text-[10px] bg-emerald-600">{p.result}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DigitalTwinView({ activeCtx }: { activeCtx: string }) {
  const mutations = [
    { entity: "Account: Acme Corp", change: "RenewalDate updated", source: "Salesforce", time: "2m ago" },
    { entity: "Contact: John Doe", change: "Sentiment → Positive", source: "Slack Analysis", time: "14m ago" },
    { entity: "Project: Q1 Launch", change: "Status → Completed", source: "Jira Sync", time: "1h ago" },
  ]
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Operational Digital Twin</h3>
          <p className="text-sm text-muted-foreground">Real-time mirroring of business entities & relationships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><RefreshCw className="w-4 h-4" /> Sync Twin</Button>
          <Button size="sm" className="gap-2"><Layers className="w-4 h-4" /> View Lineage</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Graph Visualization */}
        <div className="lg:col-span-2 relative bg-muted/30 rounded-2xl border-2 border-dashed overflow-hidden p-8 flex items-center justify-center min-h-[300px]">
          <div className="relative">
            {/* Center Node */}
            <div className="w-24 h-24 rounded-3xl bg-primary shadow-lg flex flex-col items-center justify-center text-primary-foreground border-4 border-background z-10 relative">
              <Building2 className="w-8 h-8 mb-1" />
              <span className="text-[10px] font-bold">CORE_SSOT</span>
            </div>
            {/* Orbits */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-primary/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-primary/10" />
            {/* Satellites */}
            {[
              { label: "Accounts", icon: Building2, x: -120, y: -100, color: "bg-emerald-500" },
              { label: "Revenue", icon: DollarSign, x: 80, y: -120, color: "bg-blue-500" },
              { label: "Product", icon: Zap, x: 130, y: 60, color: "bg-indigo-500" },
              { label: "Contacts", icon: Users, x: -140, y: 80, color: "bg-amber-500" },
            ].map((sat, i) => (
              <div key={i} className="absolute flex flex-col items-center gap-2 cursor-pointer transition-transform hover:scale-110"
                style={{ top: `calc(50% + ${sat.y}px)`, left: `calc(50% + ${sat.x}px)`, transform: "translate(-50%, -50%)" }}>
                <div className={`w-12 h-12 rounded-xl ${sat.color} text-white flex items-center justify-center shadow-lg`}>
                  <sat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold bg-background/80 px-2 py-0.5 rounded border shadow-sm">{sat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mutations */}
        <div className="space-y-4 overflow-auto">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Twin Mutations</h4>
          <div className="space-y-2">
            {mutations.map((mut, i) => (
              <Card key={i} className="cursor-pointer hover:bg-muted/30 transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold truncate pr-2">{mut.entity}</span>
                    <span className="text-[10px] text-muted-foreground">{mut.time}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mb-2">{mut.change}</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-mono">source: {mut.source}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
