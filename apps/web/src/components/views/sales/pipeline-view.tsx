/**
 * Pipeline View - Sales Pipeline Kanban
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  KanbanPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  TrendingUp,
  DollarSign,
  Calendar,
  User,
  Building2,
  MoreHorizontal,
  Filter,
  Plus,
  ChevronRight,
  GripVertical
} from "lucide-react"

const stages = [
  { id: "discovery", name: "Discovery", color: "bg-blue-500" },
  { id: "qualification", name: "Qualification", color: "bg-purple-500" },
  { id: "proposal", name: "Proposal", color: "bg-yellow-500" },
  { id: "negotiation", name: "Negotiation", color: "bg-orange-500" },
  { id: "closed-won", name: "Closed Won", color: "bg-green-500" },
]

const mockDeals = [
  { id: "d1", name: "Acme Corp - Enterprise", company: "Acme Corp", value: 125000, stage: "negotiation", owner: "Sarah", daysInStage: 5 },
  { id: "d2", name: "TechStart Growth", company: "TechStart Inc", value: 45000, stage: "proposal", owner: "Mike", daysInStage: 3 },
  { id: "d3", name: "Global Systems Expansion", company: "Global Systems", value: 250000, stage: "discovery", owner: "Lisa", daysInStage: 12 },
  { id: "d4", name: "InnovateTech Pilot", company: "InnovateTech", value: 15000, stage: "closed-won", owner: "David", daysInStage: 1 },
  { id: "d5", name: "RetailMax Pro", company: "RetailMax", value: 78000, stage: "qualification", owner: "Sarah", daysInStage: 7 },
  { id: "d6", name: "DataFlow Suite", company: "DataFlow Inc", value: 92000, stage: "proposal", owner: "Mike", daysInStage: 4 },
  { id: "d7", name: "CloudSync Basic", company: "CloudSync", value: 32000, stage: "discovery", owner: "Lisa", daysInStage: 2 },
]

const kpis: KPIItem[] = [
  { label: "Pipeline Value", value: "$2.4M", color: "primary" },
  { label: "Weighted Value", value: "$892K", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Deals in Pipeline", value: "45", change: "+8 this week", changeType: "positive" },
  { label: "Avg Days in Stage", value: "12", change: "-2 days", changeType: "positive" },
]

export function PipelineView() {
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)

  const selected = mockDeals.find(d => d.id === selectedDeal)

  const getStageValue = (stageId: string) => {
    return mockDeals.filter(d => d.stage === stageId).reduce((sum, d) => sum + d.value, 0)
  }

  return (
    <KanbanPageTemplate
      title="Pipeline"
      description="Visual pipeline of all active deals"
      stageId="SALES-PIPELINE-001"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Pipeline" }
      ]}
      kpis={kpis}
      headerActions={
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Deal
          </button>
        </div>
      }
      rightPanel={selected ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Deal</h4>
            <p className="text-gray-900 font-medium">{selected.name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Company</h4>
            <p className="text-gray-900">{selected.company}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Value</h4>
            <p className="text-gray-900 text-xl font-semibold">${selected.value.toLocaleString()}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Days in Stage</h4>
            <p className="text-gray-900">{selected.daysInStage} days</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Owner</h4>
            <p className="text-gray-900">{selected.owner}</p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button className="w-full px-3 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center justify-center gap-2">
              View Full Deal <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
      rightPanelTitle="Deal Details"
      rightPanelOpen={rightPanelOpen}
      onRightPanelClose={() => setRightPanelOpen(false)}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
        {stages.map((stage) => {
          const stageDeals = mockDeals.filter(d => d.stage === stage.id)
          const stageValue = getStageValue(stage.id)
          
          return (
            <div key={stage.id} className="flex-shrink-0 w-80">
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <h3 className="text-sm font-semibold text-gray-700">{stage.name}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{stageDeals.length}</span>
                </div>
                <span className="text-xs font-medium text-gray-500">${(stageValue / 1000).toFixed(0)}K</span>
              </div>
              
              {/* Stage Column */}
              <div className="bg-gray-50 rounded-xl p-2 min-h-[500px]">
                <div className="space-y-2">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-all group"
                      onClick={() => {
                        setSelectedDeal(deal.id)
                        setRightPanelOpen(true)
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{deal.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            {deal.company}
                          </p>
                        </div>
                        <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 rounded">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-sm font-semibold text-green-600">${deal.value.toLocaleString()}</span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {deal.owner}
                          </span>
                          <span className={`${deal.daysInStage > 7 ? 'text-orange-500' : ''}`}>
                            {deal.daysInStage}d
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Deal Button */}
                  <button className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" />
                    Add deal
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </KanbanPageTemplate>
  )
}

export default PipelineView
