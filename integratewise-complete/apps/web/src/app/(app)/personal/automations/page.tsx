"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, Zap, Plus, Clock, CheckCircle2, AlertCircle, MoreHorizontal } from "lucide-react"

const mockAutomations = [
  {
    id: "auto-1",
    name: "Churn Risk Alert",
    description: "Send Slack notification when health score drops below 70",
    status: "active",
    trigger: "Health Score < 70",
    action: "Send Slack #alerts",
    runs: 156,
    lastRun: "2 hours ago"
  },
  {
    id: "auto-2",
    name: "New Customer Onboarding",
    description: "Create tasks and send welcome sequence for new customers",
    status: "active",
    trigger: "New account created",
    action: "Create tasks + Send email",
    runs: 89,
    lastRun: "5 hours ago"
  },
  {
    id: "auto-3",
    name: "Renewal Reminder",
    description: "Notify CSM 90 days before contract renewal",
    status: "paused",
    trigger: "Renewal date - 90 days",
    action: "Create task + Send reminder",
    runs: 234,
    lastRun: "1 day ago"
  },
  {
    id: "auto-4",
    name: "Expansion Opportunity",
    description: "Flag accounts with high usage for expansion outreach",
    status: "active",
    trigger: "Usage > 80% of plan",
    action: "Create opportunity + Notify sales",
    runs: 45,
    lastRun: "3 hours ago"
  }
]

export default function AutomationsPage() {
  const [automations, setAutomations] = useState(mockAutomations)

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(auto =>
      auto.id === id ? { ...auto, status: auto.status === "active" ? "paused" : "active" } : auto
    ))
  }

  const activeCount = automations.filter(a => a.status === "active").length
  const totalRuns = automations.reduce((sum, a) => sum + a.runs, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
          <p className="text-muted-foreground">Build workflows to automate repetitive tasks</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Automation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Zap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRuns.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {automations.map((auto) => (
          <Card key={auto.id} className={auto.status === "paused" ? "opacity-75" : ""}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{auto.name}</h3>
                    <Badge variant={auto.status === "active" ? "default" : "secondary"}>
                      {auto.status === "active" ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{auto.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">When:</span>
                      <Badge variant="outline">{auto.trigger}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Then:</span>
                      <Badge variant="outline">{auto.action}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      {auto.runs} runs
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Last: {auto.lastRun}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch checked={auto.status === "active"} onCheckedChange={() => toggleAutomation(auto.id)} />
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
