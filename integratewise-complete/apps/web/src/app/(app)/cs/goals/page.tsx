"use client"

import { DashboardLayout, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, Target, Users, Calendar, ChevronRight,
  CheckCircle2, AlertTriangle, BarChart3, Heart
} from "lucide-react"

const CS_GOALS = [
  {
    id: "cg-001",
    title: "Net Revenue Retention",
    description: "Achieve 120% net revenue retention",
    target: "120%",
    current: "118%",
    progress: 98,
    status: "on-track",
    owner: "CS Leadership",
    due: "Mar 31",
    keyResults: [
      { title: "Gross retention > 95%", progress: 100 },
      { title: "Expansion revenue: ₹50L", progress: 92 },
      { title: "Churn < 5%", progress: 95 },
    ]
  },
  {
    id: "cg-002",
    title: "Customer Health",
    description: "Improve average health score to 80+",
    target: "80",
    current: "76",
    progress: 95,
    status: "on-track",
    owner: "Health Team",
    due: "Mar 31",
    keyResults: [
      { title: "Red accounts < 10%", progress: 88 },
      { title: "Green accounts > 60%", progress: 95 },
      { title: "QBR completion: 100%", progress: 82 },
    ]
  },
  {
    id: "cg-003",
    title: "Onboarding Excellence",
    description: "Reduce time-to-value to under 14 days",
    target: "14 days",
    current: "18 days",
    progress: 78,
    status: "at-risk",
    owner: "Onboarding Team",
    due: "Mar 31",
    keyResults: [
      { title: "First value milestone: 7 days", progress: 72 },
      { title: "Full adoption: 14 days", progress: 68 },
      { title: "Onboarding NPS > 60", progress: 85 },
    ]
  },
]

const statusConfig = {
  "on-track": { label: "On Track", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700" },
  "at-risk": { label: "At Risk", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
}

export default function CSGoalsPage() {
  return (
    <DashboardLayout 
      title="Customer Success Goals" 
      description="Track CS team objectives and key results"
      actions={
        <Button className="bg-amber-600 hover:bg-amber-700" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      }
    >
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-700">Total Goals</span>
            <Target className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700">{CS_GOALS.length}</p>
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
          <p className="text-2xl font-bold text-slate-900">90%</p>
        </Card>
      </div>

      <div className="space-y-4">
        {CS_GOALS.map((goal) => {
          const config = statusConfig[goal.status as keyof typeof statusConfig]
          return (
            <Card key={goal.id} className={`p-5 ${config.bg} ${config.border}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="outline" className={config.badge}>{config.label}</Badge>
                  <h3 className="font-semibold text-slate-900 mt-1">{goal.title}</h3>
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
                  <div className={`${config.text.replace('text-', 'bg-')} h-2 rounded-full`} style={{ width: `${goal.progress}%` }} />
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
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{goal.owner}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due: {goal.due}</span>
                </div>
                <button className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900">
                  View Details<ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </Card>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
