"use client"

/**
 * Success Plans View — detailed success plans per account
 * Ported from Figma Design account-success/views/success-plans-view.tsx
 */

import { useState } from "react"
import { Target, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const plans = [
  {
    id: 1,
    account: "TechServe India",
    title: "Integration-First Success Plan",
    status: "active",
    progress: 55,
    dueDate: "Jun 30, 2025",
    milestones: [
      { name: "API integration setup", status: "completed", date: "Jan 15" },
      { name: "Data migration Phase 1", status: "completed", date: "Feb 1" },
      { name: "Team onboarding (15 users)", status: "in-progress", date: "Feb 20" },
      { name: "Custom dashboard configuration", status: "pending", date: "Mar 15" },
      { name: "QBR with exec sponsors", status: "pending", date: "Apr 1" },
    ],
  },
  {
    id: 2,
    account: "CloudBridge APAC",
    title: "Expansion & Compliance Plan",
    status: "active",
    progress: 78,
    dueDate: "Mar 31, 2025",
    milestones: [
      { name: "SOC2 evidence gathering", status: "completed", date: "Jan 10" },
      { name: "Regional data residency setup", status: "completed", date: "Jan 25" },
      { name: "Compliance audit review", status: "in-progress", date: "Feb 28" },
      { name: "Expansion proposal delivery", status: "pending", date: "Mar 15" },
    ],
  },
  {
    id: 3,
    account: "HealthTech Solutions",
    title: "Recovery & Retention Plan",
    status: "at-risk",
    progress: 25,
    dueDate: "Mar 15, 2025",
    milestones: [
      { name: "Exec alignment call (CEO-CEO)", status: "pending", date: "Feb 12" },
      { name: "Dedicated onboarding sprint", status: "in-progress", date: "Feb 20" },
      { name: "Address 7 open support tickets", status: "in-progress", date: "Feb 15" },
      { name: "Value realization workshop", status: "pending", date: "Mar 1" },
    ],
  },
]

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-600",
  "at-risk": "bg-red-500/10 text-red-600",
  completed: "bg-blue-500/10 text-blue-600",
}

const milestoneIcons: Record<string, typeof CheckCircle> = {
  completed: CheckCircle,
  "in-progress": Clock,
  pending: AlertCircle,
}
const milestoneColors: Record<string, string> = {
  completed: "text-green-500",
  "in-progress": "text-blue-500",
  pending: "text-muted-foreground",
}

export function SuccessPlansView() {
  const [expandedId, setExpandedId] = useState<number | null>(1)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Success Plans</h2>
      {plans.map((plan) => {
        const isExpanded = expandedId === plan.id
        return (
          <Card key={plan.id} className={plan.status === "at-risk" ? "border-red-500/30" : ""}>
            <CardContent className="p-4">
              <button
                className="w-full flex items-center gap-3 text-left"
                onClick={() => setExpandedId(isExpanded ? null : plan.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <Target className="w-4 h-4 text-primary" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{plan.title}</span>
                    <Badge className={`text-[10px] ${statusColors[plan.status]}`}>
                      {plan.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {plan.account} · Due {plan.dueDate}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">{plan.progress}%</div>
                </div>
              </button>

              <Progress value={plan.progress} className="h-1.5 mt-3 mb-2" />

              {isExpanded && (
                <div className="mt-3 space-y-1.5 pl-7">
                  {plan.milestones.map((m) => {
                    const Icon = milestoneIcons[m.status]
                    return (
                      <div key={m.name} className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${milestoneColors[m.status]}`} />
                        <span className={`text-xs flex-1 ${m.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                          {m.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{m.date}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
