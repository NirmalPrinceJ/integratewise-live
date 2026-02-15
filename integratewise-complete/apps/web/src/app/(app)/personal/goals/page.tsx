"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target, Plus, Search, TrendingUp, Calendar, CheckCircle2,
  Circle, AlertCircle, MoreHorizontal, Flag
} from "lucide-react"

// Mock data
const mockGoals = [
  {
    id: "goal-1",
    title: "Increase Q1 Revenue by 25%",
    description: "Drive expansion and new business to hit $2.5M ARR",
    category: "revenue",
    progress: 68,
    target: 2500000,
    current: 1700000,
    dueDate: "2026-03-31",
    status: "on_track",
    owner: "Sales Team",
    keyResults: [
      { label: "New ARR", current: 800000, target: 1200000 },
      { label: "Expansion", current: 900000, target: 1300000 }
    ]
  },
  {
    id: "goal-2",
    title: "Reduce Customer Churn to <5%",
    description: "Improve retention through proactive health monitoring",
    category: "retention",
    progress: 82,
    target: 5,
    current: 6.2,
    dueDate: "2026-06-30",
    status: "on_track",
    owner: "Customer Success",
    keyResults: [
      { label: "Monthly Churn", current: 6.2, target: 5.0 },
      { label: "Health Score Coverage", current: 85, target: 95 }
    ]
  },
  {
    id: "goal-3",
    title: "Launch API v3.0",
    description: "Complete development and release of API v3 with new features",
    category: "product",
    progress: 45,
    target: 100,
    current: 45,
    dueDate: "2026-04-15",
    status: "at_risk",
    owner: "Engineering",
    keyResults: [
      { label: "Features Complete", current: 6, target: 12 },
      { label: "Documentation", current: 40, target: 100 }
    ]
  },
  {
    id: "goal-4",
    title: "Expand to 3 New Markets",
    description: "Enter EMEA, APAC, and LATAM regions",
    category: "expansion",
    progress: 30,
    target: 3,
    current: 1,
    dueDate: "2026-12-31",
    status: "on_track",
    owner: "Growth Team",
    keyResults: [
      { label: "Markets Live", current: 1, target: 3 },
      { label: "Local Partners", current: 2, target: 6 }
    ]
  }
]

const statusConfig = {
  on_track: { label: "On Track", color: "bg-green-500", icon: CheckCircle2 },
  at_risk: { label: "At Risk", color: "bg-red-500", icon: AlertCircle },
  behind: { label: "Behind", color: "bg-yellow-500", icon: Circle },
  completed: { label: "Completed", color: "bg-blue-500", icon: CheckCircle2 }
}

const categoryConfig = {
  revenue: { label: "Revenue", color: "bg-blue-500" },
  retention: { label: "Retention", color: "bg-green-500" },
  product: { label: "Product", color: "bg-purple-500" },
  expansion: { label: "Expansion", color: "bg-orange-500" }
}

export default function GoalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredGoals = mockGoals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || goal.status === activeTab
    return matchesSearch && matchesTab
  })

  const stats = {
    total: mockGoals.length,
    onTrack: mockGoals.filter(g => g.status === "on_track").length,
    atRisk: mockGoals.filter(g => g.status === "at_risk").length,
    avgProgress: Math.round(mockGoals.reduce((sum, g) => sum + g.progress, 0) / mockGoals.length)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals & Milestones</h1>
          <p className="text-muted-foreground">Track OKRs and strategic objectives</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.onTrack}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.atRisk}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search goals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Goals</TabsTrigger>
          <TabsTrigger value="on_track">On Track</TabsTrigger>
          <TabsTrigger value="at_risk">At Risk</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredGoals.map((goal) => {
              const status = statusConfig[goal.status as keyof typeof statusConfig]
              const category = categoryConfig[goal.category as keyof typeof categoryConfig]
              const StatusIcon = status.icon

              return (
                <Card key={goal.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${category.color}`} />
                        <Badge variant="outline">{category.label}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${status.color} text-white`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    {/* Key Results */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Key Results</p>
                      {goal.keyResults.map((kr, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{kr.label}</span>
                          <span className="font-medium">
                            {typeof kr.current === 'number' && kr.current > 1000 
                              ? `$${(kr.current / 1000).toFixed(0)}k` 
                              : kr.current}
                            /{typeof kr.target === 'number' && kr.target > 1000 
                              ? `$${(kr.target / 1000).toFixed(0)}k` 
                              : kr.target}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{goal.owner}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
