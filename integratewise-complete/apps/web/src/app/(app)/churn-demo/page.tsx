"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SignalStrip } from "@/components/os/signal-strip"
import { CognitiveDrawer } from "@/components/os/evidence-drawer"
import { 
  AlertTriangle, 
  TrendingDown, 
  DollarSign, 
  Activity,
  CheckCircle,
  Clock,
  Users,
  Zap
} from "lucide-react"

export default function ChurnDemoPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                IntegrateWise Intelligence Demo
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Multi-source signal convergence → AI synthesis → Actionable intelligence
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Demo Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Live Signal Strip */}
      <SignalStrip scope="global" />

      {/* Main Content */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Churn Risk Alert Card */}
        <div className="bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-100 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-rose-900">
                  Critical Churn Risk Detected
                </h2>
                <Badge variant="destructive" className="text-xs">
                  87% Confidence
                </Badge>
              </div>
              <p className="text-sm text-rose-800 mb-4">
                Customer X shows multiple converging signals indicating high churn probability within 30 days.
                Historical pattern matches 8 similar cases (75% churn rate without intervention).
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white/60 rounded-lg p-4 border border-rose-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-medium text-rose-900">Payment Signal</span>
                  </div>
                  <div className="text-lg font-bold text-rose-900">15 days</div>
                  <div className="text-xs text-rose-700">Invoice overdue</div>
                </div>

                <div className="bg-white/60 rounded-lg p-4 border border-rose-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-medium text-rose-900">Technical Signal</span>
                  </div>
                  <div className="text-lg font-bold text-rose-900">12 errors</div>
                  <div className="text-xs text-rose-700">API failures (7 days)</div>
                </div>

                <div className="bg-white/60 rounded-lg p-4 border border-rose-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-medium text-rose-900">Usage Signal</span>
                  </div>
                  <div className="text-lg font-bold text-rose-900">-30%</div>
                  <div className="text-xs text-rose-700">MAU decline (14 days)</div>
                </div>

                <div className="bg-white/60 rounded-lg p-4 border border-rose-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-medium text-rose-900">ARR at Risk</span>
                  </div>
                  <div className="text-lg font-bold text-rose-900">$450K</div>
                  <div className="text-xs text-rose-700">+$180K replacement cost</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  size="sm" 
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={() => {
                    setSelectedSignal("churn-risk-customer-x")
                    setDrawerOpen(true)
                  }}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  View Complete Evidence →
                </Button>
                <Button size="sm" variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Trigger Escalation Workflow
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            How IntegrateWise Intelligence Works
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm font-semibold text-slate-900 mb-1">
                1. Truth Spine
              </div>
              <div className="text-xs text-slate-600">
                Structured data from Stripe, DataDog, Product Analytics
              </div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-sm font-semibold text-slate-900 mb-1">
                2. Context Engine
              </div>
              <div className="text-xs text-slate-600">
                Unstructured signals from support tickets, emails, Slack
              </div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-violet-600" />
              </div>
              <div className="text-sm font-semibold text-slate-900 mb-1">
                3. AI Synthesis
              </div>
              <div className="text-xs text-slate-600">
                Llama 3.3 70B analyzes patterns, predicts outcomes
              </div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-sm font-semibold text-slate-900 mb-1">
                4. Governance
              </div>
              <div className="text-xs text-slate-600">
                Human review, action tracking, outcome monitoring
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Signal Convergence Timeline
          </h3>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />

            {/* Events */}
            <div className="space-y-6">
              <TimelineEvent
                time="11:15 AM"
                title="Payment Delay Detected"
                source="Stripe"
                description="Customer X: Invoice $45K overdue by 15 days"
                icon={<DollarSign className="w-4 h-4 text-red-600" />}
                color="red"
              />

              <TimelineEvent
                time="11:17 AM"
                title="API Error Spike"
                source="DataDog"
                description="Customer X: 12 API failures in 7 days, 3 incidents this week"
                icon={<Activity className="w-4 h-4 text-orange-600" />}
                color="orange"
              />

              <TimelineEvent
                time="11:18 AM"
                title="Usage Decline Alert"
                source="Product Analytics"
                description="Customer X: MAU decreased 30% (450 → 315 users) over 14 days"
                icon={<TrendingDown className="w-4 h-4 text-amber-600" />}
                color="amber"
              />

              <TimelineEvent
                time="11:20 AM"
                title="AI Synthesis Complete"
                source="Think Layer"
                description="87% churn probability detected. Root cause: Technical issues → User frustration → Payment withholding"
                icon={<Sparkles className="w-4 h-4 text-violet-600" />}
                color="violet"
                highlight
              />

              <TimelineEvent
                time="11:21 AM"
                title="Escalation Triggered"
                source="Act Layer"
                description="Emergency notification sent to Engineering VP, CS VP, Sales VP, Finance Director"
                icon={<Zap className="w-4 h-4 text-emerald-600" />}
                color="emerald"
              />

              <TimelineEvent
                time="11:25 AM"
                title="Human Review & Approval"
                source="John Doe (CSM)"
                description="Reviewed prediction, accepted action plan, scheduled executive call"
                icon={<CheckCircle className="w-4 h-4 text-blue-600" />}
                color="blue"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cognitive Drawer */}
      <CognitiveDrawer
        situationId={selectedSignal}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}

// Timeline Event Component
function TimelineEvent({
  time,
  title,
  source,
  description,
  icon,
  color,
  highlight = false
}: {
  time: string
  title: string
  source: string
  description: string
  icon: React.ReactNode
  color: string
  highlight?: boolean
}) {
  const bgColors: Record<string, string> = {
    red: "bg-red-100",
    orange: "bg-orange-100",
    amber: "bg-amber-100",
    violet: "bg-violet-100",
    emerald: "bg-emerald-100",
    blue: "bg-blue-100"
  }

  const borderColors: Record<string, string> = {
    red: "border-red-200",
    orange: "border-orange-200",
    amber: "border-amber-200",
    violet: "border-violet-200",
    emerald: "border-emerald-200",
    blue: "border-blue-200"
  }

  return (
    <div className="relative flex gap-4 pl-16">
      <div className={`absolute left-6 w-6 h-6 rounded-full ${bgColors[color]} border-2 border-white flex items-center justify-center z-10`}>
        {icon}
      </div>
      
      <div className={`flex-1 rounded-lg border p-4 ${highlight ? `${borderColors[color]} ${bgColors[color]}` : "border-slate-200 bg-white"}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">{time}</span>
            <Badge variant="outline" className="text-xs">
              {source}
            </Badge>
          </div>
        </div>
        <div className="text-sm font-semibold text-slate-900 mb-1">{title}</div>
        <div className="text-xs text-slate-600">{description}</div>
      </div>
    </div>
  )
}

// Import icons
import { Brain, Database, FileText, Sparkles } from "lucide-react"
