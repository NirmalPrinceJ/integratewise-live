"use client"

import { KBHeader } from "@/components/layouts/kb-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreVertical, Edit, BarChart3, FileText } from "lucide-react"

export default function ThinkPage() {
  const columns = [
    { id: "ideas", title: "Ideas", count: 1 },
    { id: "hypotheses", title: "Hypotheses", count: 1 },
    { id: "actions", title: "Actions", count: 1 },
    { id: "done", title: "Done", count: 0 },
  ]

  const cards = {
    ideas: [
      {
        flow: "FLOW B (KNOWLEDGE)",
        icon: Edit,
        title: "Expansion Hypothesis",
        description: "Stark Industries mentioned interest in the new API layer during QBR.",
        tags: ["growth", "api-v3"],
      },
    ],
    hypotheses: [
      {
        flow: "FLOW A (SPINE)",
        icon: BarChart3,
        title: "Churn Risk: Acme Corp",
        description: "Health score dropped from 85 to 42 in 24 hours.",
        tags: ["high-priority", "cs-intervention"],
      },
    ],
    actions: [
      {
        flow: "FLOW A (SPINE)",
        icon: FileText,
        title: "SLA Breach: HubSpot Sync",
        description: "HubSpot webhook latency exceeding 30s for tenant integratewise-demo.",
        tags: ["technical-debt", "scalability"],
      },
    ],
    done: [],
  }

  return (
    <div className="min-h-screen bg-[#E8EAED]">
      <KBHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2F3E5F] mb-2">Topic Boards (Think)</h1>
              <p className="text-gray-600">
                Unifying Flow A (Truth) and Flow B (Memory) into actionable topics.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white border-[#4A6FA5] text-[#4A6FA5]">
                Clustering Engine: Active
              </Button>
              <Button className="bg-[#4A6FA5] hover:bg-[#3d5a8f] text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Topic
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-4 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#2F3E5F] uppercase">{column.title}</h2>
                  <span className="text-xs text-gray-500">{column.count}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-200">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </Button>
              </div>

              {/* Cards */}
              <div className="space-y-3 flex-1">
                {cards[column.id as keyof typeof cards].map((card, idx) => {
                  const Icon = card.icon
                  return (
                    <Card
                      key={idx}
                      className="p-4 bg-white border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium text-[#4A6FA5] bg-[#E8F0FF] border-0"
                        >
                          {card.flow}
                        </Badge>
                        <Icon className="w-5 h-5 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-[#2F3E5F] mb-2">{card.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                      <div className="flex gap-2">
                        {card.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Card>
                  )
                })}

                {/* Add Card Button */}
                <Button
                  variant="ghost"
                  className="w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-[#4A6FA5] hover:text-[#4A6FA5] hover:bg-transparent h-12"
                >
                  + Suggest Card
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
