"use client"

import { DashboardLayout, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, Target, TrendingUp, Users, Calendar,
  ChevronRight, CheckCircle2, AlertTriangle, Clock,
  DollarSign, BarChart3
} from "lucide-react"

const SALES_GOALS = [
  {
    id: "sg-001",
    title: "Q1 Revenue Target",
    description: "Achieve ₹2.5Cr in new business revenue",
    target: "₹2.5Cr",
    current: "₹1.8Cr",
    progress: 72,
    status: "on-track",
    owner: "Sales Team",
    due: "Mar 31",
    keyResults: [
      { title: "Close 25 new deals", progress: 68 },
      { title: "Avg deal size > ₹10L", progress: 85 },
      { title: "Win rate > 30%", progress: 78 },
    ]
  },
  {
    id: "sg-002",
    title: "Enterprise Expansion",
    description: "Land 5 enterprise accounts (>₹25L ARR)",
    target: "5",
    current: "3",
    progress: 60,
    status: "at-risk",
    owner: "Enterprise Team",
    due: "Mar 31",
    keyResults: [
      { title: "Generate 20 enterprise leads", progress: 75 },
      { title: "Complete 10 enterprise demos", progress: 50 },
      { title: "Close 5 enterprise deals", progress: 60 },
    ]
  },
  {
    id: "sg-003",
    title: "Pipeline Growth",
    description: "Build ₹10Cr qualified pipeline",
    target: "₹10Cr",
    current: "₹8.2Cr",
    progress: 82,
    status: "on-track",
    owner: "BDR Team",
    due: "Mar 31",
    keyResults: [
      { title: "Add 100 new opportunities", progress: 88 },
      { title: "Qualify 80% of inbound leads", progress: 75 },
      { title: "Outbound: 50 qualified meetings", progress: 82 },
    ]
  },
]

const statusConfig = {
  "on-track": { label: "On Track", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700" },
  "at-risk": { label: "At Risk", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
  "behind": { label: "Behind", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700" },
}

export default function SalesGoalsPage() {
  return (
    <DashboardLayout 
      title="Sales Goals & OKRs" 
      description="Track sales team objectives and key results"
      actions={
        <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      }
    >
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700">Total Goals</span>
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{SALES_GOALS.length}</p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-green-700">On Track</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">2</p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-700">At Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700">1</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Avg Progress</span>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">71%</p>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {SALES_GOALS.map((goal) => {
          const config = statusConfig[goal.status as keyof typeof statusConfig]
          return (
            <Card key={goal.id} className={`p-5 ${config.bg} ${config.border}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={config.badge}>
                      {config.label}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900">{goal.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{goal.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{goal.current}</p>
                  <p className="text-sm text-slate-500">of {goal.target}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">Progress</span>
                  <span className={`font-semibold ${config.text}`}>{goal.progress}%</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-2">
                  <div 
                    className={`${config.text.replace('text-', 'bg-')} h-2 rounded-full`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs font-medium text-slate-500 uppercase">Key Results</p>
                {goal.keyResults.map((kr, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">{kr.title}</span>
                        <span className="text-xs font-medium text-slate-700">{kr.progress}%</span>
                      </div>
                      <div className="w-full bg-white/60 rounded-full h-1">
                        <div className="bg-slate-400 h-1 rounded-full" style={{ width: `${kr.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/40 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {goal.owner}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Due: {goal.due}
                  </span>
                </div>
                <button className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900">
                  View Details
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </Card>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
