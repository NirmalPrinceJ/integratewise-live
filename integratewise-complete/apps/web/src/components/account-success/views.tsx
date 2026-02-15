"use client"

/**
 * Account-Success Views — 15+ specialized views for CS domain
 * Ported from Figma Design account-success/views/
 * Each view function renders a card-based data display
 */

import { useState } from "react"
import {
  Search, TrendingUp, TrendingDown, Users, Target, Shield, Heart,
  Activity, Briefcase, Globe, Star, AlertTriangle, CheckCircle, Clock,
  BarChart3, Zap, FileText, ArrowRight, ChevronRight, Minus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

/* ─── Shared Data ─── */
const accounts = [
  { id: "ACC-001", name: "TechServe India", arr: 2400000, healthScore: 78, tier: "Enterprise", csm: "Priya Sharma", riskLevel: "medium", trend: "Declining", daysToRenewal: 45, nps: 42, region: "APAC", industry: "Technology", contacts: 12, openTickets: 3 },
  { id: "ACC-002", name: "CloudBridge APAC", arr: 1800000, healthScore: 92, tier: "Enterprise", csm: "Anjali Patel", riskLevel: "low", trend: "Improving", daysToRenewal: 120, nps: 68, region: "Singapore", industry: "FinTech", contacts: 8, openTickets: 0 },
  { id: "ACC-003", name: "HealthTech Solutions", arr: 960000, healthScore: 65, tier: "Growth", csm: "Priya Sharma", riskLevel: "high", trend: "Declining", daysToRenewal: 30, nps: 25, region: "India", industry: "Healthcare", contacts: 5, openTickets: 7 },
  { id: "ACC-004", name: "RetailNow Global", arr: 3100000, healthScore: 88, tier: "Enterprise", csm: "Vikram Rao", riskLevel: "low", trend: "Stable", daysToRenewal: 200, nps: 72, region: "Global", industry: "Retail", contacts: 15, openTickets: 1 },
  { id: "ACC-005", name: "EduPlatform Asia", arr: 480000, healthScore: 54, tier: "Starter", csm: "Anjali Patel", riskLevel: "critical", trend: "Declining", daysToRenewal: 15, nps: 18, region: "India", industry: "Education", contacts: 3, openTickets: 5 },
]

const riskColors: Record<string, string> = { low: "text-green-600", medium: "text-amber-600", high: "text-orange-600", critical: "text-red-600" }
const healthColor = (score: number) => score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-600"
const trendIcon = (trend: string) => trend === "Improving" ? <TrendingUp className="w-3 h-3 text-green-500" /> : trend === "Declining" ? <TrendingDown className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3 text-muted-foreground" />
const formatCurrency = (v: number) => `$${(v / 1000).toFixed(0)}K`

/* ─── Account Master View ─── */
export function AccountMasterView() {
  const [search, setSearch] = useState("")
  const filtered = accounts.filter((a) => !search || a.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Account Master</h2>
          <p className="text-xs text-muted-foreground">{accounts.length} accounts in portfolio</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search accounts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-8 text-sm" />
        </div>
      </div>
      <div className="space-y-2">
        {filtered.map((a) => (
          <Card key={a.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
            <CardContent className="p-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{a.name}</span>
                  <Badge variant="outline" className="text-[10px]">{a.tier}</Badge>
                  {trendIcon(a.trend)}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{a.id} · {a.industry} · {a.region}</div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-bold ${healthColor(a.healthScore)}`}>{a.healthScore}</div>
                <div className="text-[9px] text-muted-foreground">Health</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold">{formatCurrency(a.arr)}</div>
                <div className="text-[9px] text-muted-foreground">ARR</div>
              </div>
              <div className="text-center">
                <div className={`text-xs font-semibold capitalize ${riskColors[a.riskLevel]}`}>{a.riskLevel}</div>
                <div className="text-[9px] text-muted-foreground">Risk</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold">{a.daysToRenewal}d</div>
                <div className="text-[9px] text-muted-foreground">Renewal</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Strategic Objectives View ─── */
export function StrategicObjectivesView() {
  const objectives = [
    { id: 1, title: "Achieve 95% Gross Retention", metric: "93.2%", target: "95%", progress: 82, status: "on-track", owner: "CS Team" },
    { id: 2, title: "Expand APAC Enterprise ARR by 40%", metric: "$4.8M", target: "$6.7M", progress: 71, status: "at-risk", owner: "Sales + CS" },
    { id: 3, title: "Reduce Time-to-Value to <30 days", metric: "38 days", target: "30 days", progress: 65, status: "behind", owner: "Onboarding" },
    { id: 4, title: "NPS Score ≥ 60", metric: "52", target: "60", progress: 87, status: "on-track", owner: "CS Team" },
    { id: 5, title: "Zero Critical Churn in Q1", metric: "1 lost", target: "0", progress: 50, status: "at-risk", owner: "CS Leadership" },
  ]
  const statusColors: Record<string, string> = { "on-track": "bg-green-500/10 text-green-600", "at-risk": "bg-amber-500/10 text-amber-600", behind: "bg-red-500/10 text-red-600" }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Strategic Objectives</h2>
      <div className="grid gap-3">
        {objectives.map((o) => (
          <Card key={o.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{o.title}</span>
                    <Badge className={`text-[10px] ${statusColors[o.status]}`}>{o.status.replace("-", " ")}</Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Current: <strong className="text-foreground">{o.metric}</strong></span>
                    <span>Target: {o.target}</span>
                    <span>Owner: {o.owner}</span>
                  </div>
                </div>
                <span className="text-lg font-bold text-primary">{o.progress}%</span>
              </div>
              <Progress value={o.progress} className="h-1.5 mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Value Streams View ─── */
export function ValueStreamsView() {
  const streams = [
    { id: 1, name: "Revenue Retention", value: "$12.4M", growth: "+8%", health: 88, accounts: 42, icon: "💰" },
    { id: 2, name: "Product Adoption", value: "72%", growth: "+12%", health: 75, accounts: 38, icon: "🚀" },
    { id: 3, name: "Expansion Pipeline", value: "$3.2M", growth: "+22%", health: 82, accounts: 15, icon: "📈" },
    { id: 4, name: "Customer Advocacy", value: "28 refs", growth: "+5", health: 68, accounts: 20, icon: "🌟" },
    { id: 5, name: "Operational Efficiency", value: "4.2h avg", growth: "-15%", health: 90, accounts: 50, icon: "⚡" },
  ]
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Value Streams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {streams.map((s) => (
          <Card key={s.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground">{s.accounts} accounts</div>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">{s.value}</span>
                <span className={`text-xs font-medium ${s.growth.startsWith("+") ? "text-green-600" : s.growth.startsWith("-") ? "text-red-600" : "text-muted-foreground"}`}>{s.growth}</span>
              </div>
              <Progress value={s.health} className="h-1 mt-3" />
              <div className="text-[10px] text-muted-foreground mt-1">Health: {s.health}%</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Stakeholder Outcomes View ─── */
export function StakeholderOutcomesView() {
  const stakeholders = [
    { name: "Ravi Sharma", title: "CTO", company: "TechServe India", outcome: "Reduce integration overhead by 40%", progress: 72, sentiment: "positive", lastContact: "2 days ago" },
    { name: "Li Wei", title: "VP Engineering", company: "CloudBridge APAC", outcome: "Achieve SOC2 compliance via unified audit", progress: 88, sentiment: "positive", lastContact: "1 week ago" },
    { name: "Dr. Meena Rao", title: "CEO", company: "HealthTech Solutions", outcome: "Cut time-to-market for patient analytics", progress: 45, sentiment: "neutral", lastContact: "3 weeks ago" },
    { name: "James Tan", title: "COO", company: "RetailNow Global", outcome: "Unify 12 regional data sources into one SSOT", progress: 65, sentiment: "positive", lastContact: "5 days ago" },
    { name: "Arjun Nair", title: "Head of Product", company: "EduPlatform Asia", outcome: "Launch self-service analytics dashboard", progress: 20, sentiment: "negative", lastContact: "1 month ago" },
  ]
  const sentimentColors: Record<string, string> = { positive: "text-green-600", neutral: "text-amber-600", negative: "text-red-600" }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Stakeholder Outcomes</h2>
      <div className="space-y-2">
        {stakeholders.map((s) => (
          <Card key={s.name}>
            <CardContent className="p-3 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{s.name.split(" ").map((n) => n[0]).join("")}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{s.name} <span className="text-muted-foreground font-normal">· {s.title}</span></div>
                <div className="text-[10px] text-muted-foreground">{s.company}</div>
                <div className="text-xs mt-1">{s.outcome}</div>
              </div>
              <div className="text-center w-16">
                <div className="text-sm font-bold">{s.progress}%</div>
                <Progress value={s.progress} className="h-1 mt-1" />
              </div>
              <div className={`text-[10px] font-semibold capitalize ${sentimentColors[s.sentiment]}`}>{s.sentiment}</div>
              <div className="text-[10px] text-muted-foreground w-20 text-right">{s.lastContact}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Business Context View ─── */
export function BusinessContextView() {
  const contexts = [
    { account: "TechServe India", industry: "Technology", segment: "Mid-Market", buying: "Technical-led", maturity: "Growth", priority: "Cost optimization", competitorRisk: "Medium" },
    { account: "CloudBridge APAC", industry: "FinTech", segment: "Enterprise", buying: "Executive-led", maturity: "Scale", priority: "Compliance & security", competitorRisk: "Low" },
    { account: "HealthTech Solutions", industry: "Healthcare", segment: "SMB", buying: "Consensus", maturity: "Early", priority: "Time-to-value", competitorRisk: "High" },
    { account: "RetailNow Global", industry: "Retail", segment: "Enterprise", buying: "Procurement-led", maturity: "Mature", priority: "Global unification", competitorRisk: "Low" },
  ]
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Business Context</h2>
      <div className="grid gap-3">
        {contexts.map((c) => (
          <Card key={c.account}>
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-2">{c.account}</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <ContextField label="Industry" value={c.industry} />
                <ContextField label="Segment" value={c.segment} />
                <ContextField label="Buying Motion" value={c.buying} />
                <ContextField label="Maturity" value={c.maturity} />
                <ContextField label="Priority" value={c.priority} />
                <ContextField label="Competitor Risk" value={c.competitorRisk} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ContextField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground uppercase font-bold">{label}</div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
    </div>
  )
}

/* ─── Platform Health View ─── */
export function PlatformHealthView() {
  const metrics = [
    { label: "API Uptime", value: "99.97%", trend: "+0.02%", status: "healthy" },
    { label: "Avg Response Time", value: "142ms", trend: "-8ms", status: "healthy" },
    { label: "Active Integrations", value: "24/28", trend: "+2", status: "healthy" },
    { label: "Data Sync Lag", value: "45s", trend: "+12s", status: "warning" },
    { label: "Error Rate", value: "0.03%", trend: "+0.01%", status: "healthy" },
    { label: "Pipeline Throughput", value: "12.4K/hr", trend: "+1.2K", status: "healthy" },
  ]
  const statusColors: Record<string, string> = { healthy: "bg-green-500", warning: "bg-amber-500", critical: "bg-red-500" }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Platform Health</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{m.label}</span>
                <div className={`w-2 h-2 rounded-full ${statusColors[m.status]}`} />
              </div>
              <div className="text-2xl font-bold">{m.value}</div>
              <div className={`text-xs mt-1 ${m.trend.startsWith("-") && m.label !== "Avg Response Time" ? "text-red-600" : "text-green-600"}`}>{m.trend}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── People & Team View ─── */
export function PeopleTeamView() {
  const team = [
    { name: "Priya Sharma", role: "Senior CSM", accounts: 8, healthAvg: 74, npsAvg: 48, sentiment: "positive", capacity: 85 },
    { name: "Anjali Patel", role: "CSM", accounts: 6, healthAvg: 68, npsAvg: 42, sentiment: "neutral", capacity: 92 },
    { name: "Vikram Rao", role: "Senior CSM", accounts: 7, healthAvg: 82, npsAvg: 64, sentiment: "positive", capacity: 78 },
    { name: "Deepak Jain", role: "Onboarding Specialist", accounts: 4, healthAvg: 71, npsAvg: 55, sentiment: "positive", capacity: 60 },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">People & Team</h2>
      <div className="grid gap-3">
        {team.map((t) => (
          <Card key={t.name}>
            <CardContent className="p-3 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{t.name.split(" ").map((n) => n[0]).join("")}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-[10px] text-muted-foreground">{t.role} · {t.accounts} accounts</div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-bold ${healthColor(t.healthAvg)}`}>{t.healthAvg}</div>
                <div className="text-[9px] text-muted-foreground">Avg Health</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold">{t.npsAvg}</div>
                <div className="text-[9px] text-muted-foreground">NPS</div>
              </div>
              <div className="w-20">
                <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                  <span>Capacity</span>
                  <span>{t.capacity}%</span>
                </div>
                <Progress value={t.capacity} className="h-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Engagement Log View ─── */
export function EngagementLogView() {
  const entries = [
    { id: 1, type: "email", account: "TechServe India", contact: "Ravi Sharma", summary: "Follow-up on API integration timeline", time: "2h ago", sentiment: "neutral" },
    { id: 2, type: "meeting", account: "CloudBridge APAC", contact: "Li Wei", summary: "QBR preparation — reviewed SOC2 progress", time: "5h ago", sentiment: "positive" },
    { id: 3, type: "call", account: "HealthTech Solutions", contact: "Dr. Meena Rao", summary: "Escalation re: onboarding delays, assigned P1 ticket", time: "1d ago", sentiment: "negative" },
    { id: 4, type: "slack", account: "RetailNow Global", contact: "James Tan", summary: "Shared regional data unification roadmap doc", time: "2d ago", sentiment: "positive" },
    { id: 5, type: "email", account: "EduPlatform Asia", contact: "Arjun Nair", summary: "Sent renewal proposal with discount option", time: "3d ago", sentiment: "neutral" },
  ]
  const typeIcons: Record<string, string> = { email: "📧", meeting: "📅", call: "📞", slack: "💬" }
  const sentColors: Record<string, string> = { positive: "bg-green-500/10 text-green-600", neutral: "bg-muted text-muted-foreground", negative: "bg-red-500/10 text-red-600" }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Engagement Log</h2>
      <div className="space-y-2">
        {entries.map((e) => (
          <Card key={e.id}>
            <CardContent className="p-3 flex items-start gap-3">
              <span className="text-lg">{typeIcons[e.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{e.account}</span>
                  <span className="text-xs text-muted-foreground">· {e.contact}</span>
                </div>
                <p className="text-xs mt-0.5">{e.summary}</p>
              </div>
              <Badge variant="outline" className={`text-[10px] capitalize ${sentColors[e.sentiment]}`}>{e.sentiment}</Badge>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{e.time}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Initiatives View ─── */
export function InitiativesView() {
  const initiatives = [
    { id: 1, name: "Self-Service Analytics Rollout", status: "in-progress", progress: 62, owner: "Priya Sharma", accounts: 5, dueDate: "Mar 15" },
    { id: 2, name: "SOC2 Compliance Module", status: "in-progress", progress: 88, owner: "Vikram Rao", accounts: 3, dueDate: "Feb 28" },
    { id: 3, name: "Executive Alignment Program", status: "planned", progress: 15, owner: "Anjali Patel", accounts: 8, dueDate: "Apr 30" },
    { id: 4, name: "Legacy Migration Phase 2", status: "in-progress", progress: 45, owner: "Deepak Jain", accounts: 2, dueDate: "Mar 30" },
    { id: 5, name: "Customer Community Launch", status: "planned", progress: 5, owner: "Arun Kumar", accounts: 12, dueDate: "May 15" },
  ]
  const statusColors: Record<string, string> = { "in-progress": "bg-blue-500/10 text-blue-600", planned: "bg-muted text-muted-foreground", completed: "bg-green-500/10 text-green-600" }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Initiatives</h2>
      {initiatives.map((ini) => (
        <Card key={ini.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{ini.name}</span>
                <Badge variant="outline" className={`text-[10px] ${statusColors[ini.status]}`}>{ini.status.replace("-", " ")}</Badge>
              </div>
              <span className="text-sm font-bold text-primary">{ini.progress}%</span>
            </div>
            <Progress value={ini.progress} className="h-1.5 mb-2" />
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span>Owner: {ini.owner}</span>
              <span>{ini.accounts} accounts</span>
              <span>Due: {ini.dueDate}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/* ─── Insights View ─── */
export function InsightsView() {
  const insights = [
    { id: 1, type: "risk", title: "HealthTech Solutions may churn within 30 days", detail: "Declining NPS (25), 7 open tickets, no exec engagement in 3 weeks", confidence: 87, impact: "high" },
    { id: 2, type: "opportunity", title: "CloudBridge APAC ready for expansion", detail: "High NPS (68), 3 new use cases identified in QBR, exec sponsor engaged", confidence: 92, impact: "high" },
    { id: 3, type: "pattern", title: "Onboarding bottleneck in API setup", detail: "3 accounts stuck at API config step >14 days. Consider guided setup wizard.", confidence: 78, impact: "medium" },
    { id: 4, type: "recommendation", title: "Assign dedicated CSM to EduPlatform", detail: "Account has no dedicated CSM since reassignment. Capacity check shows Deepak at 60%.", confidence: 85, impact: "high" },
  ]
  const typeIcons: Record<string, string> = { risk: "🔴", opportunity: "🟢", pattern: "🔵", recommendation: "💡" }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">AI Insights</h2>
      {insights.map((i) => (
        <Card key={i.id} className={i.impact === "high" ? "border-primary/30" : ""}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">{typeIcons[i.type]}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{i.title}</div>
                <p className="text-xs text-muted-foreground mt-1">{i.detail}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span>Confidence: <strong>{i.confidence}%</strong></span>
                  <span>Impact: <strong className="capitalize">{i.impact}</strong></span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/* ─── Capabilities View ─── */
export function CapabilitiesView() {
  const capabilities = [
    { name: "Data Integration", adopted: 85, target: 95, features: ["API Sync", "Webhook Ingestion", "Batch Import"] },
    { name: "Analytics & Reporting", adopted: 62, target: 80, features: ["Dashboards", "Custom Reports", "Scheduled Exports"] },
    { name: "Automation & Workflows", adopted: 45, target: 70, features: ["Rule Engine", "Triggers", "Approval Flows"] },
    { name: "AI & Intelligence", adopted: 30, target: 60, features: ["Predictions", "Anomaly Detection", "NLP Search"] },
    { name: "Governance & Compliance", adopted: 72, target: 90, features: ["RBAC", "Audit Logs", "Data Residency"] },
  ]
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Capabilities Adoption</h2>
      {capabilities.map((c) => (
        <Card key={c.name}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.adopted}% / {c.target}% target</span>
            </div>
            <Progress value={c.adopted} className="h-2 mb-2" />
            <div className="flex flex-wrap gap-1">
              {c.features.map((f) => <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/* ─── Company Growth View ─── */
export function CompanyGrowthView() {
  const quarters = [
    { q: "Q1 2025", arr: 8200000, customers: 38, nrr: 108, churn: 3.2 },
    { q: "Q2 2025", arr: 9100000, customers: 42, nrr: 112, churn: 2.8 },
    { q: "Q3 2025", arr: 10400000, customers: 45, nrr: 115, churn: 2.1 },
    { q: "Q4 2025", arr: 11800000, customers: 50, nrr: 118, churn: 1.9 },
  ]
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Company Growth</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Current ARR" value="$11.8M" change="+13.5%" />
        <StatCard label="Customers" value="50" change="+5" />
        <StatCard label="Net Revenue Retention" value="118%" change="+3%" />
        <StatCard label="Gross Churn" value="1.9%" change="-0.2%" positive />
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Quarter</th>
                <th className="text-right px-4 py-2 text-muted-foreground font-medium">ARR</th>
                <th className="text-right px-4 py-2 text-muted-foreground font-medium">Customers</th>
                <th className="text-right px-4 py-2 text-muted-foreground font-medium">NRR</th>
                <th className="text-right px-4 py-2 text-muted-foreground font-medium">Churn %</th>
              </tr>
            </thead>
            <tbody>
              {quarters.map((q) => (
                <tr key={q.q} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium">{q.q}</td>
                  <td className="px-4 py-2 text-right">${(q.arr / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-2 text-right">{q.customers}</td>
                  <td className="px-4 py-2 text-right">{q.nrr}%</td>
                  <td className="px-4 py-2 text-right">{q.churn}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ label, value, change, positive }: { label: string; value: string; change: string; positive?: boolean }) {
  const isGood = positive || change.startsWith("+") || change.startsWith("-")
  return (
    <Card>
      <CardContent className="p-3">
        <div className="text-[10px] text-muted-foreground">{label}</div>
        <div className="text-xl font-bold mt-1">{value}</div>
        <div className={`text-xs mt-0.5 ${positive ? "text-green-600" : change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>{change}</div>
      </CardContent>
    </Card>
  )
}

/* ─── Product Client View ─── */
export function ProductClientView() {
  const features = [
    { feature: "Data Integration Hub", adoption: 92, accounts: 46, satisfaction: 4.5 },
    { feature: "Custom Dashboards", adoption: 78, accounts: 39, satisfaction: 4.2 },
    { feature: "Workflow Automation", adoption: 55, accounts: 28, satisfaction: 3.8 },
    { feature: "Intelligence Overlay", adoption: 42, accounts: 21, satisfaction: 4.6 },
    { feature: "API Gateway", adoption: 68, accounts: 34, satisfaction: 4.0 },
    { feature: "Spine SSOT", adoption: 85, accounts: 43, satisfaction: 4.4 },
  ]
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Product & Client Adoption</h2>
      <div className="space-y-2">
        {features.map((f) => (
          <Card key={f.feature}>
            <CardContent className="p-3 flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium">{f.feature}</div>
                <div className="text-[10px] text-muted-foreground">{f.accounts} accounts using</div>
              </div>
              <div className="w-32">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                  <span>Adoption</span>
                  <span>{f.adoption}%</span>
                </div>
                <Progress value={f.adoption} className="h-1.5" />
              </div>
              <div className="text-center">
                <div className="text-sm font-bold">⭐ {f.satisfaction}</div>
                <div className="text-[9px] text-muted-foreground">CSAT</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── API Portfolio View ─── */
export function ApiPortfolioView() {
  const apis = [
    { name: "Accounts API", version: "v4.2", calls: "12.4K/day", latency: "89ms", uptime: "99.99%", status: "healthy" },
    { name: "Contacts API", version: "v3.8", calls: "8.2K/day", latency: "112ms", uptime: "99.97%", status: "healthy" },
    { name: "Analytics API", version: "v2.1", calls: "3.1K/day", latency: "245ms", uptime: "99.95%", status: "warning" },
    { name: "Webhooks API", version: "v1.5", calls: "1.8K/day", latency: "67ms", uptime: "99.99%", status: "healthy" },
    { name: "Intelligence API", version: "v1.0-beta", calls: "520/day", latency: "1.2s", uptime: "99.80%", status: "beta" },
  ]
  const statusBadge: Record<string, string> = { healthy: "bg-green-500/10 text-green-600", warning: "bg-amber-500/10 text-amber-600", beta: "bg-blue-500/10 text-blue-600" }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">API Portfolio</h2>
      <div className="space-y-2">
        {apis.map((api) => (
          <Card key={api.name}>
            <CardContent className="p-3 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{api.name}</span>
                  <Badge variant="outline" className="text-[10px]">{api.version}</Badge>
                  <Badge className={`text-[10px] ${statusBadge[api.status]}`}>{api.status}</Badge>
                </div>
              </div>
              <div className="text-center text-xs"><div className="font-bold">{api.calls}</div><div className="text-[9px] text-muted-foreground">Volume</div></div>
              <div className="text-center text-xs"><div className="font-bold">{api.latency}</div><div className="text-[9px] text-muted-foreground">P50</div></div>
              <div className="text-center text-xs"><div className="font-bold">{api.uptime}</div><div className="text-[9px] text-muted-foreground">Uptime</div></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─── Task Manager View ─── */
export function TaskManagerView() {
  const tasks = [
    { id: 1, title: "Schedule QBR with TechServe CTO", priority: "high", status: "todo", assignee: "Priya S.", account: "TechServe India", dueDate: "Feb 12" },
    { id: 2, title: "Send renewal proposal to HealthTech", priority: "critical", status: "in-progress", assignee: "Anjali P.", account: "HealthTech Solutions", dueDate: "Feb 10" },
    { id: 3, title: "Complete SOC2 evidence packet for CloudBridge", priority: "high", status: "in-progress", assignee: "Vikram R.", account: "CloudBridge APAC", dueDate: "Feb 15" },
    { id: 4, title: "Follow up on RetailNow expansion opportunity", priority: "medium", status: "todo", assignee: "Priya S.", account: "RetailNow Global", dueDate: "Feb 18" },
    { id: 5, title: "Onboard EduPlatform Asia team (3 new users)", priority: "high", status: "todo", assignee: "Deepak J.", account: "EduPlatform Asia", dueDate: "Feb 11" },
    { id: 6, title: "Update success plan for CloudBridge Q1", priority: "medium", status: "done", assignee: "Anjali P.", account: "CloudBridge APAC", dueDate: "Feb 8" },
  ]
  const prioColors: Record<string, string> = { critical: "bg-red-500/10 text-red-600", high: "bg-orange-500/10 text-orange-600", medium: "bg-amber-500/10 text-amber-600", low: "bg-muted text-muted-foreground" }
  const statusIcons: Record<string, typeof CheckCircle> = { todo: Clock, "in-progress": Activity, done: CheckCircle }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Task Manager</h2>
      <div className="space-y-2">
        {tasks.map((t) => {
          const StatusIcon = statusIcons[t.status] || Clock
          return (
            <Card key={t.id} className={t.status === "done" ? "opacity-60" : ""}>
              <CardContent className="p-3 flex items-center gap-3">
                <StatusIcon className={`w-4 h-4 flex-shrink-0 ${t.status === "done" ? "text-green-500" : t.status === "in-progress" ? "text-blue-500" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${t.status === "done" ? "line-through" : ""}`}>{t.title}</div>
                  <div className="text-[10px] text-muted-foreground">{t.account} · {t.assignee}</div>
                </div>
                <Badge variant="outline" className={`text-[10px] ${prioColors[t.priority]}`}>{t.priority}</Badge>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{t.dueDate}</span>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Risk Register View ─── */
export function RiskRegisterView() {
  const risks = [
    { id: 1, account: "HealthTech Solutions", risk: "Churn risk — no exec engagement", level: "critical", probability: 75, impact: "$960K ARR", mitigation: "Schedule CEO-to-CEO call this week", owner: "Priya S." },
    { id: 2, account: "EduPlatform Asia", risk: "Slow adoption — only 20% features used", level: "high", probability: 60, impact: "$480K ARR", mitigation: "Assign dedicated onboarding specialist", owner: "Deepak J." },
    { id: 3, account: "TechServe India", risk: "Delayed integration blocking value realization", level: "medium", probability: 40, impact: "$2.4M ARR", mitigation: "Fast-track API setup with engineering support", owner: "Vikram R." },
  ]
  const levelColors: Record<string, string> = { critical: "border-red-500 bg-red-500/5", high: "border-orange-500 bg-orange-500/5", medium: "border-amber-500 bg-amber-500/5", low: "border-muted" }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Risk Register</h2>
      {risks.map((r) => (
        <Card key={r.id} className={`border-l-4 ${levelColors[r.level]}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className={`w-4 h-4 ${r.level === "critical" ? "text-red-500" : r.level === "high" ? "text-orange-500" : "text-amber-500"}`} />
              <span className="text-sm font-medium">{r.account}</span>
              <Badge variant="outline" className="text-[10px] capitalize">{r.level}</Badge>
              <span className="text-[10px] text-muted-foreground ml-auto">Impact: {r.impact}</span>
            </div>
            <p className="text-xs">{r.risk}</p>
            <div className="mt-2 p-2 rounded bg-muted/30 text-xs">
              <strong>Mitigation:</strong> {r.mitigation}
              <span className="text-muted-foreground ml-2">— {r.owner}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
