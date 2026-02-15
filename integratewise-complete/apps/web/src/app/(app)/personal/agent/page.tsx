"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bot, Play, Pause, Settings, Activity, CheckCircle2, AlertCircle,
  Clock, MessageSquare, TrendingUp, Shield, Sparkles
} from "lucide-react"

// Mock AI agents
const mockAgents = [
  {
    id: "agent-1",
    name: "ChurnShield",
    description: "Monitors customer health and flags churn risks",
    status: "active",
    type: "monitoring",
    tasksCompleted: 156,
    tasksPending: 3,
    lastActivity: "2 minutes ago",
    accuracy: 94,
    icon: Shield
  },
  {
    id: "agent-2",
    name: "DealDesk",
    description: "Analyzes pipeline and suggests next actions",
    status: "active",
    type: "analytics",
    tasksCompleted: 89,
    tasksPending: 12,
    lastActivity: "5 minutes ago",
    accuracy: 87,
    icon: TrendingUp
  },
  {
    id: "agent-3",
    name: "SuccessPilot",
    description: "Automates customer success workflows",
    status: "paused",
    type: "automation",
    tasksCompleted: 234,
    tasksPending: 0,
    lastActivity: "1 hour ago",
    accuracy: 91,
    icon: CheckCircle2
  },
  {
    id: "agent-4",
    name: "InsightMiner",
    description: "Extracts insights from meetings and notes",
    status: "active",
    type: "analysis",
    tasksCompleted: 67,
    tasksPending: 8,
    lastActivity: "15 minutes ago",
    accuracy: 82,
    icon: Sparkles
  }
]

const recentActivity = [
  { id: 1, agent: "ChurnShield", action: "Flagged at-risk account", target: "Acme Corp", time: "2 min ago", type: "alert" },
  { id: 2, agent: "DealDesk", action: "Suggested next action", target: "TechStart deal", time: "5 min ago", type: "suggestion" },
  { id: 3, agent: "InsightMiner", action: "Extracted key points from", target: "QBR meeting", time: "15 min ago", type: "insight" },
  { id: 4, agent: "ChurnShield", action: "Updated health score for", target: "Global Retail", time: "1 hour ago", type: "update" },
  { id: 5, agent: "SuccessPilot", action: "Completed workflow", target: "Onboarding sequence", time: "2 hours ago", type: "completion" }
]

export default function AgentPage() {
  const [agents, setAgents] = useState(mockAgents)

  const toggleAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === "active" ? "paused" : "active" }
        : agent
    ))
  }

  const activeAgents = agents.filter(a => a.status === "active").length
  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0)
  const avgAccuracy = Math.round(agents.reduce((sum, a) => sum + a.accuracy, 0) / agents.length)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground">Manage your cognitive workforce</p>
        </div>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Create Agent
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents}/{agents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAccuracy}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.reduce((sum, a) => sum + a.tasksPending, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {agents.map((agent) => {
              const Icon = agent.icon
              const isActive = agent.status === "active"

              return (
                <Card key={agent.id} className={`hover:shadow-md transition-shadow ${!isActive ? "opacity-75" : ""}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isActive ? "bg-blue-100" : "bg-gray-100"}`}>
                          <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <CardDescription>{agent.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={isActive ? "default" : "secondary"}>
                          {isActive ? "Active" : "Paused"}
                        </Badge>
                        <Switch checked={isActive} onCheckedChange={() => toggleAgent(agent.id)} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{agent.tasksCompleted}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{agent.tasksPending}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{agent.accuracy}%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        Last activity: {agent.lastActivity}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Agent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "alert" ? "bg-red-500" :
                      activity.type === "suggestion" ? "bg-blue-500" :
                      activity.type === "insight" ? "bg-purple-500" :
                      "bg-green-500"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.agent}</span>
                        {" "}{activity.action}{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>Global settings for AI agent behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-approve Suggestions</p>
                  <p className="text-sm text-muted-foreground">Allow agents to act without confirmation</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notify on High-Priority Alerts</p>
                  <p className="text-sm text-muted-foreground">Send notifications for critical findings</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Learning Mode</p>
                  <p className="text-sm text-muted-foreground">Continuously improve from feedback</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
