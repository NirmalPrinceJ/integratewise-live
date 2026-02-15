"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Link2, History, Users, Building, FileText } from "lucide-react"

const mockContext = [
  {
    id: "ctx-1",
    type: "relationship",
    title: "Account Hierarchy",
    description: "Acme Corp → 3 subsidiaries → 12 departments",
    icon: Building,
    updated: "2 hours ago"
  },
  {
    id: "ctx-2",
    type: "timeline",
    title: "Customer Journey",
    description: "Onboarded Jan 2024 → Expansion July 2024 → Renewal due",
    icon: History,
    updated: "5 hours ago"
  },
  {
    id: "ctx-3",
    type: "people",
    title: "Stakeholder Map",
    description: "8 contacts mapped: 2 champions, 1 decision maker",
    icon: Users,
    updated: "1 day ago"
  },
  {
    id: "ctx-4",
    type: "documents",
    title: "Related Documents",
    description: "Contract, QBR slides, support tickets, notes",
    icon: FileText,
    updated: "3 hours ago"
  },
  {
    id: "ctx-5",
    type: "connections",
    title: "Integration Links",
    description: "Connected to Salesforce, HubSpot, Zendesk",
    icon: Link2,
    updated: "Just now"
  }
]

export default function ContextPage() {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      relationship: "bg-blue-100 text-blue-600",
      timeline: "bg-purple-100 text-purple-600",
      people: "bg-green-100 text-green-600",
      documents: "bg-orange-100 text-orange-600",
      connections: "bg-gray-100 text-gray-600"
    }
    return colors[type] || "bg-gray-100"
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Context</h1>
        <p className="text-muted-foreground">Entity relationships and contextual information</p>
      </div>

      <div className="grid gap-4">
        {mockContext.map((ctx) => {
          const Icon = ctx.icon
          return (
            <Card key={ctx.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getTypeColor(ctx.type)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{ctx.title}</h3>
                      <Badge variant="outline">{ctx.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{ctx.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Updated {ctx.updated}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
