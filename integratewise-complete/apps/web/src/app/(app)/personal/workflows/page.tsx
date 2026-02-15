"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, Plus, GitBranch, CheckCircle2, Clock, MoreHorizontal } from "lucide-react"

const mockWorkflows = [
  {
    id: "wf-1",
    name: "Customer Onboarding",
    description: "Complete onboarding sequence for new customers",
    status: "active",
    steps: 8,
    completions: 156,
    avgTime: "3 days",
    triggers: ["New account created"]
  },
  {
    id: "wf-2",
    name: "Churn Prevention",
    description: "Intervention workflow for at-risk accounts",
    status: "active",
    steps: 5,
    completions: 89,
    avgTime: "1 day",
    triggers: ["Health score < 70"]
  },
  {
    id: "wf-3",
    name: "Expansion Play",
    description: "Upsell sequence for high-usage accounts",
    status: "draft",
    steps: 6,
    completions: 0,
    avgTime: "—",
    triggers: ["Usage > 80%"]
  },
  {
    id: "wf-4",
    name: "QBR Preparation",
    description: "Auto-generate QBR materials",
    status: "active",
    steps: 4,
    completions: 234,
    avgTime: "2 hours",
    triggers: ["QBR scheduled", "Manual"]
  }
]

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(mockWorkflows)

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(wf =>
      wf.id === id 
        ? { ...wf, status: wf.status === "active" ? "paused" : "active" }
        : wf
    ))
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">Automated sequences and playbooks</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      <div className="grid gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className={workflow.status === "draft" ? "opacity-75" : ""}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{workflow.name}</h3>
                    <Badge variant={workflow.status === "active" ? "default" : workflow.status === "draft" ? "outline" : "secondary"}>
                      {workflow.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{workflow.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span>{workflow.steps} steps</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span>{workflow.completions} runs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Avg: {workflow.avgTime}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    {workflow.triggers.map((trigger, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        Trigger: {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {workflow.status !== "draft" && (
                    <Switch checked={workflow.status === "active"} onCheckedChange={() => toggleWorkflow(workflow.id)} />
                  )}
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
