"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Activity, Bot, CreditCard, Database, Shield, Webhook, 
  Cpu, Brain, BarChart3, Zap, Server, Network,
  AlertTriangle, CheckCircle2, Layers, Radio, GitBranch,
  ArrowRight, Sparkles, ExternalLink
} from "lucide-react"

const SYSTEM_CATEGORIES = [
  {
    title: "Deployed Services",
    description: "17 Cloudflare Workers in production",
    icon: <Server className="h-5 w-5" />,
    color: "emerald",
    items: [
      { name: "Gateway", status: "healthy", isNew: false },
      { name: "IQ-Hub", status: "healthy", isNew: false },
      { name: "Spine", status: "healthy", isNew: false },
      { name: "Knowledge", status: "healthy", isNew: false },
      { name: "Think", status: "healthy", isNew: false },
      { name: "Act", status: "healthy", isNew: false },
      { name: "Govern", status: "healthy", isNew: false },
      { name: "Agents", status: "healthy", isNew: false },
      { name: "Workflow", status: "healthy", isNew: false },
      { name: "Webhooks", status: "healthy", isNew: true },
      { name: "Billing", status: "healthy", isNew: true },
    ],
    link: "/admin/observability"
  },
  {
    title: "Security & RBAC",
    description: "Role-based access control with field-level permissions",
    icon: <Shield className="h-5 w-5" />,
    color: "blue",
    items: [
      { name: "RBAC Engine", status: "ready", isNew: true },
      { name: "Permission Audit", status: "ready", isNew: true },
      { name: "Field-Level ACL", status: "ready", isNew: true },
      { name: "Wildcard Patterns", status: "ready", isNew: true },
    ],
    link: "/admin/roles"
  },
  {
    title: "Billing & Subscriptions",
    description: "Stripe + RazorPay with 4 plans",
    icon: <CreditCard className="h-5 w-5" />,
    color: "violet",
    items: [
      { name: "Free Plan", status: "active", isNew: false },
      { name: "Pro Plan ($49)", status: "active", isNew: false },
      { name: "Business ($199)", status: "active", isNew: false },
      { name: "Enterprise", status: "active", isNew: false },
      { name: "Usage Tracking", status: "ready", isNew: true },
      { name: "40+ Feature Gates", status: "ready", isNew: true },
    ],
    link: "/admin/billing"
  },
  {
    title: "AI & Agent Systems",
    description: "Multi-agent orchestration with learning",
    icon: <Bot className="h-5 w-5" />,
    color: "purple",
    items: [
      { name: "Orchestra Agent", status: "ready", isNew: true },
      { name: "Insight Agent", status: "ready", isNew: true },
      { name: "Action Agent", status: "ready", isNew: true },
      { name: "Sage Agent", status: "ready", isNew: true },
      { name: "Multi-Agent Orchestrator", status: "ready", isNew: true },
      { name: "Advanced AI Models", status: "ready", isNew: true },
    ],
    link: "/admin/agent"
  },
  {
    title: "Webhooks",
    description: "14 provider integrations with signature verification",
    icon: <Webhook className="h-5 w-5" />,
    color: "amber",
    items: [
      { name: "Stripe", status: "active", isNew: false },
      { name: "RazorPay", status: "active", isNew: false },
      { name: "GitHub", status: "active", isNew: false },
      { name: "HubSpot", status: "active", isNew: true },
      { name: "Salesforce", status: "active", isNew: true },
      { name: "WhatsApp", status: "active", isNew: true },
    ],
    link: "/admin/webhooks"
  },
  {
    title: "Data Pipeline",
    description: "8-stage universal ingestion with 992 lines of tool mappings",
    icon: <GitBranch className="h-5 w-5" />,
    color: "cyan",
    items: [
      { name: "Analyzer", status: "ready", isNew: true },
      { name: "Classifier", status: "ready", isNew: true },
      { name: "Filter", status: "ready", isNew: true },
      { name: "Refiner", status: "ready", isNew: true },
      { name: "Extractor", status: "ready", isNew: true },
      { name: "Validator", status: "ready", isNew: true },
      { name: "Split Router", status: "ready", isNew: true },
      { name: "Writers", status: "ready", isNew: true },
    ],
    link: "/admin/executions"
  },
  {
    title: "Analytics & BI",
    description: "Predictive analytics with custom dashboards",
    icon: <BarChart3 className="h-5 w-5" />,
    color: "rose",
    items: [
      { name: "Predictive Models", status: "ready", isNew: true },
      { name: "BI Service", status: "ready", isNew: true },
      { name: "Insight Generation", status: "ready", isNew: true },
      { name: "Report Scheduling", status: "ready", isNew: true },
    ],
    link: "/admin/predictions"
  },
  {
    title: "Resilience",
    description: "Circuit breakers, retries, and rate limiting",
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "orange",
    items: [
      { name: "Circuit Breaker", status: "ready", isNew: true },
      { name: "Connection Retry", status: "ready", isNew: true },
      { name: "Rate Limiter", status: "ready", isNew: true },
      { name: "Governor Limits", status: "ready", isNew: true },
      { name: "Scalability Service", status: "ready", isNew: true },
    ],
    link: "/admin/automations"
  },
]

const STATS = [
  { label: "Total Services", value: "17", icon: <Server className="h-4 w-4" />, change: "+2 new" },
  { label: "Feature Gates", value: "40+", icon: <Zap className="h-4 w-4" />, change: "Ready" },
  { label: "Connectors", value: "16", icon: <Network className="h-4 w-4" />, change: "Active" },
  { label: "Webhook Providers", value: "14", icon: <Webhook className="h-4 w-4" />, change: "+6 new" },
  { label: "Pipeline Stages", value: "8", icon: <GitBranch className="h-4 w-4" />, change: "1,090 lines" },
  { label: "Code Lines", value: "15K+", icon: <Database className="h-4 w-4" />, change: "Undocumented" },
]

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Buried Treasures Discovered
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">System Inventory</h1>
        <p className="text-slate-500 mt-1">
          37 major systems comprising 15,000+ lines of production-ready code
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label} className="bg-white">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                {stat.icon}
                <span className="text-xs">{stat.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-xs text-emerald-600">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recently Deployed Banner */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Just Deployed</h3>
                <p className="text-emerald-100 text-sm">
                  Webhooks Worker + Billing Service now live on Cloudflare
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/webhooks">
                <Button variant="secondary" size="sm">
                  View Webhooks
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/admin/billing">
                <Button variant="secondary" size="sm">
                  View Billing
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SYSTEM_CATEGORIES.map((category) => (
          <Card key={category.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`h-10 w-10 rounded-lg bg-${category.color}-100 text-${category.color}-600 flex items-center justify-center`}>
                  {category.icon}
                </div>
                <Link href={category.link}>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <CardTitle className="text-base mt-3">{category.title}</CardTitle>
              <CardDescription className="text-xs">{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {category.items.slice(0, 5).map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.name}</span>
                    <div className="flex items-center gap-1">
                      {item.isNew && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 bg-emerald-50 text-emerald-600 border-emerald-200">
                          NEW
                        </Badge>
                      )}
                      <span className={`w-2 h-2 rounded-full ${
                        item.status === 'healthy' || item.status === 'active' ? 'bg-emerald-500' : 
                        item.status === 'ready' ? 'bg-blue-500' : 'bg-slate-300'
                      }`} />
                    </div>
                  </div>
                ))}
                {category.items.length > 5 && (
                  <p className="text-xs text-slate-400 pt-1">
                    +{category.items.length - 5} more
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documentation Link */}
      <Card className="bg-slate-900 text-white">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Full Documentation</h3>
              <p className="text-slate-400 text-sm mt-1">
                Complete inventory at docs/BURIED_TREASURES.md
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/observability">
                <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                  <Activity className="h-4 w-4 mr-2" />
                  Health Check
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
