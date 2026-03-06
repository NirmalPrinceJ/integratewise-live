"use client"

/**
 * Shared cross-domain view components.
 * Each accepts a `domain` prop to contextualize content per domain.
 * Used across: engineering, ops, finance, marketing, people, sales, cs, accounts, admin.
 */

import {
  FileText, Shield, Workflow, Zap, Target, Brain,
  Bot, Lightbulb, User, Clock, CheckCircle2, AlertCircle,
  Search, Filter, ChevronRight, Activity, Eye,
  MessageSquare, Sparkles, GitBranch, Plus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

/* ─── Audit Log View ─── */
const auditEntries = [
  { id: 1, action: "Created", resource: "Success Plan – Acme Corp", user: "Sarah K.", time: "10 min ago", type: "create" },
  { id: 2, action: "Updated", resource: "Pipeline stage for Deal #1092", user: "Mike R.", time: "25 min ago", type: "update" },
  { id: 3, action: "Approved", resource: "Budget request Q2 – Marketing", user: "Admin", time: "1h ago", type: "approve" },
  { id: 4, action: "Deleted", resource: "Draft workflow – Onboarding v2", user: "Dev Team", time: "2h ago", type: "delete" },
  { id: 5, action: "Exported", resource: "Revenue report – Jan 2026", user: "CFO", time: "3h ago", type: "export" },
  { id: 6, action: "Role Changed", resource: "User jsmith@acme.com → Editor", user: "Admin", time: "5h ago", type: "update" },
  { id: 7, action: "Connected", resource: "Salesforce integration", user: "Ops Bot", time: "1d ago", type: "create" },
  { id: 8, action: "Archived", resource: "Campaign – Holiday 2025", user: "Marketing Lead", time: "2d ago", type: "archive" },
]
const actionColor: Record<string, string> = {
  create: "text-green-600 bg-green-500/10",
  update: "text-blue-600 bg-blue-500/10",
  approve: "text-purple-600 bg-purple-500/10",
  delete: "text-red-600 bg-red-500/10",
  export: "text-amber-600 bg-amber-500/10",
  archive: "text-muted-foreground bg-muted",
}

export function AuditLogView({ domain = "System" }: { domain?: string }) {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{domain} Audit Log</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="w-3.5 h-3.5 mr-1.5" /> Filter</Button>
          <Button variant="outline" size="sm"><Search className="w-3.5 h-3.5 mr-1.5" /> Search</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {auditEntries.map((e) => (
              <div key={e.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                <Badge variant="outline" className={`text-[9px] ${actionColor[e.type] || ""}`}>{e.action}</Badge>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{e.resource}</div>
                  <div className="text-[10px] text-muted-foreground">{e.user}</div>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{e.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Workflows View ─── */
const workflows = [
  { name: "New Customer Onboarding", status: "active", steps: 8, runs: 142, successRate: 96, lastRun: "2h ago" },
  { name: "Deal Approval Pipeline", status: "active", steps: 5, runs: 87, successRate: 100, lastRun: "30 min ago" },
  { name: "Quarterly Business Review", status: "draft", steps: 12, runs: 0, successRate: 0, lastRun: "—" },
  { name: "Renewal Notification Chain", status: "active", steps: 4, runs: 234, successRate: 92, lastRun: "1d ago" },
  { name: "Incident Escalation", status: "paused", steps: 6, runs: 18, successRate: 88, lastRun: "5d ago" },
]
const wfStatusColor: Record<string, string> = { active: "bg-green-500/10 text-green-600", draft: "bg-muted text-muted-foreground", paused: "bg-amber-500/10 text-amber-600" }

export function WorkflowsView({ domain = "System" }: { domain?: string }) {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{domain} Workflows</h2>
        <Button size="sm"><Plus className="w-3.5 h-3.5 mr-1.5" /> New Workflow</Button>
      </div>
      <div className="grid gap-3">
        {workflows.map((w) => (
          <Card key={w.name} className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Workflow className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{w.name}</span>
                    <Badge variant="outline" className={`text-[9px] ${wfStatusColor[w.status]}`}>{w.status}</Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1 flex gap-3">
                    <span>{w.steps} steps</span>
                    <span>{w.runs} runs</span>
                    {w.successRate > 0 && <span>{w.successRate}% success</span>}
                    <span>Last: {w.lastRun}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Automations View ─── */
const automations = [
  { name: "Auto-assign new leads to AE", trigger: "New lead created", enabled: true, runs: 312, lastTriggered: "15 min ago" },
  { name: "Slack alert on P1 incident", trigger: "Incident severity = P1", enabled: true, runs: 8, lastTriggered: "3d ago" },
  { name: "Weekly digest email", trigger: "Every Monday 9:00 AM", enabled: true, runs: 52, lastTriggered: "2d ago" },
  { name: "Archive stale deals (90d)", trigger: "Deal idle > 90 days", enabled: false, runs: 14, lastTriggered: "30d ago" },
  { name: "Sync contacts to HubSpot", trigger: "Contact updated", enabled: true, runs: 1842, lastTriggered: "5 min ago" },
]

export function AutomationsView({ domain = "System" }: { domain?: string }) {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{domain} Automations</h2>
        <Button size="sm"><Zap className="w-3.5 h-3.5 mr-1.5" /> New Rule</Button>
      </div>
      <div className="grid gap-3">
        {automations.map((a) => (
          <Card key={a.name} className={`${!a.enabled ? "opacity-60" : ""}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <Zap className={`w-5 h-5 flex-shrink-0 ${a.enabled ? "text-amber-500" : "text-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{a.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Trigger: {a.trigger} · {a.runs} runs · Last: {a.lastTriggered}
                </div>
              </div>
              <Badge variant="outline" className={`text-[9px] ${a.enabled ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>{a.enabled ? "active" : "disabled"}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Policies View ─── */
const policies = [
  { title: "Data Retention Policy", category: "Compliance", version: "v2.1", lastUpdated: "Jan 15, 2026", status: "published" },
  { title: "RBAC Access Control", category: "Security", version: "v3.0", lastUpdated: "Feb 1, 2026", status: "published" },
  { title: "Approval Thresholds", category: "Governance", version: "v1.4", lastUpdated: "Dec 10, 2025", status: "published" },
  { title: "Incident Response SLA", category: "Operations", version: "v2.0", lastUpdated: "Nov 20, 2025", status: "draft" },
  { title: "Vendor Onboarding", category: "Procurement", version: "v1.0", lastUpdated: "Feb 5, 2026", status: "review" },
]
const policyStatus: Record<string, string> = { published: "bg-green-500/10 text-green-600", draft: "bg-muted text-muted-foreground", review: "bg-amber-500/10 text-amber-600" }

export function PoliciesView({ domain = "System" }: { domain?: string }) {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{domain} Policies</h2>
        <Button size="sm"><Plus className="w-3.5 h-3.5 mr-1.5" /> New Policy</Button>
      </div>
      <div className="grid gap-3">
        {policies.map((p) => (
          <Card key={p.title} className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{p.title}</span>
                  <Badge variant="outline" className={`text-[9px] ${policyStatus[p.status]}`}>{p.status}</Badge>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{p.category} · {p.version} · Updated {p.lastUpdated}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Goals / OKR View ─── */
const goals = [
  { title: "Increase NRR to 120%", owner: "CS Team", progress: 72, target: "Q1 2026", status: "on-track" },
  { title: "Launch v3.0 Platform", owner: "Engineering", progress: 45, target: "Q2 2026", status: "at-risk" },
  { title: "Reduce churn below 5%", owner: "CS + Product", progress: 88, target: "Q1 2026", status: "on-track" },
  { title: "50 new enterprise logos", owner: "Sales", progress: 34, target: "FY 2026", status: "behind" },
  { title: "SOC 2 Type II Certification", owner: "Security", progress: 60, target: "Q2 2026", status: "on-track" },
]
const goalStatus: Record<string, string> = { "on-track": "text-green-600", "at-risk": "text-amber-600", behind: "text-red-600" }

export function GoalsView({ domain = "System" }: { domain?: string }) {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{domain} Goals & OKRs</h2>
        <Button size="sm"><Target className="w-3.5 h-3.5 mr-1.5" /> New Goal</Button>
      </div>
      <div className="grid gap-3">
        {goals.map((g) => (
          <Card key={g.title} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Target className={`w-4 h-4 flex-shrink-0 ${goalStatus[g.status]}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{g.title}</div>
                  <div className="text-[10px] text-muted-foreground">{g.owner} · Target: {g.target}</div>
                </div>
                <Badge variant="outline" className={`text-[9px] ${goalStatus[g.status]}`}>{g.status}</Badge>
              </div>
              <Progress value={g.progress} className="h-1.5" />
              <div className="text-[10px] text-muted-foreground mt-1 text-right">{g.progress}%</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── IQ Hub View ─── */
const iqInsights = [
  { title: "Revenue at risk: 3 renewals in 30 days", confidence: 92, category: "Revenue", severity: "high" },
  { title: "Engagement drop detected for Acme Corp", confidence: 87, category: "Health", severity: "medium" },
  { title: "Top-performing campaign: Product Launch Feb", confidence: 95, category: "Marketing", severity: "info" },
  { title: "Sprint velocity declining — investigate blockers", confidence: 78, category: "Engineering", severity: "medium" },
  { title: "New competitor mention in 4 deal conversations", confidence: 84, category: "Competitive", severity: "high" },
]
const sevColors: Record<string, string> = { high: "text-red-600 bg-red-500/10", medium: "text-amber-600 bg-amber-500/10", info: "text-blue-600 bg-blue-500/10" }

export function IQHubView({ domain = "System" }: { domain?: string }) {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{domain} IQ Hub</h2>
        <Badge variant="outline" className="text-[10px]"><Sparkles className="w-3 h-3 mr-1" /> AI-Powered</Badge>
      </div>
      <div className="grid gap-3">
        {iqInsights.map((ins) => (
          <Card key={ins.title} className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <Brain className={`w-5 h-5 flex-shrink-0 ${sevColors[ins.severity]?.split(" ")[0] || "text-blue-500"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{ins.title}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{ins.category} · {ins.confidence}% confidence</div>
              </div>
              <Badge variant="outline" className={`text-[9px] ${sevColors[ins.severity]}`}>{ins.severity}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-muted/30">
        <CardContent className="p-4 text-center">
          <Sparkles className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold">Ask IQ</h3>
          <p className="text-[10px] text-muted-foreground mt-1">Type a question to get AI-powered insights from your data</p>
          <div className="mt-3 flex gap-2">
            <input className="flex-1 rounded-md border px-3 py-1.5 text-xs bg-background" placeholder="e.g. What's our biggest risk this quarter?" />
            <Button size="sm">Ask</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Agent View ─── */
const agentHistory = [
  { role: "user", content: "What accounts are at risk of churning this quarter?" },
  { role: "agent", content: "Based on health scores and engagement patterns, 3 accounts are at elevated risk:\n• DataFlow Inc (Health: 42, declining usage -28%)\n• CloudServ (Health: 58, no exec contact 60d)\n• FinScale (Health: 61, support tickets +180%)" },
  { role: "user", content: "Draft an email to the DataFlow CSM about this" },
  { role: "agent", content: "Here's a draft:\n\nSubject: Action needed — DataFlow Inc health declining\n\nHi team, DataFlow's product usage has dropped 28% over the past 30 days. I recommend scheduling a business review this week to understand their current priorities and address any concerns before renewal..." },
]

export function AgentView({ domain = "System" }: { domain?: string }) {
  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{domain} AI Agent</h2>
        <Badge variant="outline" className="text-[10px]"><Bot className="w-3 h-3 mr-1" /> Online</Badge>
      </div>
      <Card className="flex-1 overflow-y-auto">
        <CardContent className="p-4 space-y-4">
          {agentHistory.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "agent" && <Bot className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />}
              <div className={`max-w-[80%] rounded-lg p-3 text-xs ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
              {msg.role === "user" && <User className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />}
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="mt-3 flex gap-2">
        <input className="flex-1 rounded-md border px-3 py-2 text-xs bg-background" placeholder={`Ask your ${domain} agent anything…`} />
        <Button size="sm"><MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Send</Button>
      </div>
    </div>
  )
}

/* ─── Brainstorming View ─── */
const ideas = [
  { id: 1, title: "AI-powered renewal predictions", author: "Sarah K.", votes: 12, category: "Product", status: "evaluating" },
  { id: 2, title: "Slack-first customer engagement", author: "Mike R.", votes: 8, category: "CS", status: "planned" },
  { id: 3, title: "Self-serve analytics dashboard", author: "Priya M.", votes: 15, category: "Product", status: "building" },
  { id: 4, title: "Competitor battlecard automation", author: "Jake L.", votes: 6, category: "Sales", status: "new" },
  { id: 5, title: "Multi-tenant data isolation", author: "Dev Team", votes: 10, category: "Engineering", status: "evaluating" },
]
const ideaStatus: Record<string, string> = { new: "bg-blue-500/10 text-blue-600", evaluating: "bg-amber-500/10 text-amber-600", planned: "bg-purple-500/10 text-purple-600", building: "bg-green-500/10 text-green-600" }

export function BrainstormingView({ domain = "System" }: { domain?: string }) {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{domain} Brainstorming</h2>
        <Button size="sm"><Lightbulb className="w-3.5 h-3.5 mr-1.5" /> New Idea</Button>
      </div>
      <div className="grid gap-3">
        {ideas.map((idea) => (
          <Card key={idea.id} className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex flex-col items-center gap-0.5">
                <button className="text-muted-foreground hover:text-foreground">▲</button>
                <span className="text-sm font-bold">{idea.votes}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{idea.title}</span>
                  <Badge variant="outline" className={`text-[9px] ${ideaStatus[idea.status]}`}>{idea.status}</Badge>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{idea.author} · {idea.category}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Profile View ─── */
export function ProfileView({ domain = "System" }: { domain?: string }) {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h2 className="text-lg font-semibold">{domain} Profile</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto flex items-center justify-center text-white text-2xl font-bold">NK</div>
            <h3 className="mt-3 text-sm font-semibold">Nirmal Kumar</h3>
            <p className="text-[10px] text-muted-foreground">{domain} Lead · Product & Engineering</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge variant="outline" className="text-[9px]">Admin</Badge>
              <Badge variant="outline" className="text-[9px]">Owner</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold">Activity Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50"><div className="text-lg font-bold text-blue-600">147</div><div className="text-[10px] text-muted-foreground">Actions this month</div></div>
              <div className="p-3 rounded-lg bg-muted/50"><div className="text-lg font-bold text-green-600">23</div><div className="text-[10px] text-muted-foreground">Tasks completed</div></div>
              <div className="p-3 rounded-lg bg-muted/50"><div className="text-lg font-bold text-purple-600">8</div><div className="text-[10px] text-muted-foreground">Reviews given</div></div>
              <div className="p-3 rounded-lg bg-muted/50"><div className="text-lg font-bold text-amber-600">12</div><div className="text-[10px] text-muted-foreground">Approvals pending</div></div>
            </div>
            <h3 className="text-sm font-semibold mt-4">Recent Sessions</h3>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Last login</span><span>Today, 9:15 AM</span></div>
              <div className="flex justify-between"><span>Last action</span><span>Approved budget request</span></div>
              <div className="flex justify-between"><span>Active since</span><span>March 2024</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ─── Spine / SSOT View (domain-contextualized) ─── */
export function SpineView({ domain = "System" }: { domain?: string }) {
  const buckets = [
    { name: "Accounts", readiness: 85, entities: 142, status: "LIVE" },
    { name: "Contacts", readiness: 72, entities: 834, status: "SEEDED" },
    { name: "Deals", readiness: 68, entities: 67, status: "SEEDED" },
    { name: "Activities", readiness: 91, entities: 2340, status: "LIVE" },
    { name: "Documents", readiness: 45, entities: 128, status: "ADDING" },
  ]
  const statusColors: Record<string, string> = { LIVE: "text-green-600", SEEDED: "text-blue-600", ADDING: "text-amber-600" }

  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{domain} Spine SSOT</h2>
        <Badge variant="outline" className="text-[10px]"><Activity className="w-3 h-3 mr-1" /> Real-time</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {buckets.map((b) => (
          <Card key={b.name} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{b.name}</span>
                <span className={`text-[10px] font-semibold ${statusColors[b.status]}`}>{b.status}</span>
              </div>
              <Progress value={b.readiness} className="h-1.5 mb-1.5" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{b.readiness}% ready</span>
                <span>{b.entities} entities</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Context / Business Context View ─── */
export function ContextView({ domain = "System" }: { domain?: string }) {
  const contexts = [
    { label: "Active Accounts", value: "142", delta: "+5 this month", trend: "up" },
    { label: "Open Opportunities", value: "67", delta: "$2.4M pipeline", trend: "up" },
    { label: "At-Risk", value: "8", delta: "3 critical", trend: "down" },
    { label: "Team Members", value: "23", delta: "2 new hires", trend: "up" },
  ]

  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <h2 className="text-lg font-semibold">{domain} Business Context</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {contexts.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-3">
              <div className="text-[10px] text-muted-foreground">{c.label}</div>
              <div className="text-xl font-bold mt-1">{c.value}</div>
              <div className={`text-[10px] mt-0.5 ${c.trend === "up" ? "text-green-600" : "text-red-600"}`}>{c.delta}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3">Key Context Signals</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded bg-green-500/5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> All integrations synced and healthy</div>
            <div className="flex items-center gap-2 p-2 rounded bg-amber-500/5"><AlertCircle className="w-3.5 h-3.5 text-amber-500" /> 3 accounts with engagement score drop &gt;15%</div>
            <div className="flex items-center gap-2 p-2 rounded bg-blue-500/5"><Eye className="w-3.5 h-3.5 text-blue-500" /> Quarterly review prep materials generated</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Tasks View (reusable) ─── */
const sharedTasks = [
  { id: 1, title: "Review Q1 pipeline forecast", priority: "high", status: "in-progress", assignee: "You", due: "Today" },
  { id: 2, title: "Prepare QBR deck for Acme Corp", priority: "high", status: "todo", assignee: "Sarah K.", due: "Feb 12" },
  { id: 3, title: "Follow up on DataFlow support tickets", priority: "medium", status: "todo", assignee: "Mike R.", due: "Feb 13" },
  { id: 4, title: "Update renewal pricing model", priority: "medium", status: "in-progress", assignee: "You", due: "Feb 15" },
  { id: 5, title: "Send NPS survey batch 3", priority: "low", status: "todo", assignee: "Priya M.", due: "Feb 18" },
  { id: 6, title: "Archive completed onboarding docs", priority: "low", status: "done", assignee: "You", due: "Feb 10" },
]
const priColors: Record<string, string> = { high: "text-red-600", medium: "text-amber-600", low: "text-muted-foreground" }
const statusBg: Record<string, string> = { "in-progress": "bg-blue-500/10 text-blue-600", todo: "bg-muted text-muted-foreground", done: "bg-green-500/10 text-green-600" }

export function TasksView({ domain = "System" }: { domain?: string }) {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{domain} Tasks</h2>
        <Button size="sm"><Plus className="w-3.5 h-3.5 mr-1.5" /> New Task</Button>
      </div>
      <div className="grid gap-2">
        {sharedTasks.map((t) => (
          <Card key={t.id} className={`${t.status === "done" ? "opacity-60" : ""}`}>
            <CardContent className="p-3 flex items-center gap-3">
              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${t.status === "done" ? "text-green-500" : "text-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-medium ${t.status === "done" ? "line-through" : ""}`}>{t.title}</span>
                <div className="text-[10px] text-muted-foreground">{t.assignee} · Due {t.due}</div>
              </div>
              <Badge variant="outline" className={`text-[9px] ${priColors[t.priority]}`}>{t.priority}</Badge>
              <Badge variant="outline" className={`text-[9px] ${statusBg[t.status]}`}>{t.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Approvals View (reusable) ─── */
const pendingApprovals = [
  { id: 1, type: "Budget", title: "Q2 Marketing Budget – $120K", requester: "CMO", submitted: "Feb 8", urgency: "high" },
  { id: 2, type: "Access", title: "Admin access for new hire #247", requester: "HR Lead", submitted: "Feb 9", urgency: "medium" },
  { id: 3, type: "Deal", title: "Custom pricing – Acme Corp renewal", requester: "AE Jake L.", submitted: "Feb 10", urgency: "high" },
  { id: 4, type: "Policy", title: "Updated data retention policy v2.2", requester: "Legal", submitted: "Feb 7", urgency: "low" },
]
const urgColors: Record<string, string> = { high: "bg-red-500/10 text-red-600", medium: "bg-amber-500/10 text-amber-600", low: "bg-muted text-muted-foreground" }

export function ApprovalsView({ domain = "System" }: { domain?: string }) {
  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{domain} Approvals</h2>
        <Badge variant="outline">{pendingApprovals.length} pending</Badge>
      </div>
      <div className="grid gap-3">
        {pendingApprovals.map((a) => (
          <Card key={a.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px]">{a.type}</Badge>
                  <span className="text-sm font-medium">{a.title}</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">From {a.requester} · {a.submitted}</div>
              </div>
              <Badge variant="outline" className={`text-[9px] ${urgColors[a.urgency]}`}>{a.urgency}</Badge>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="h-7 text-[10px]">Reject</Button>
                <Button size="sm" className="h-7 text-[10px]">Approve</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
