/**
 * Deals View - Sales Deal Management
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  UnifiedPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  Briefcase,
  Plus,
  DollarSign,
  TrendingUp,
  Calendar,
  User,
  Building2,
  MoreHorizontal,
  ArrowRight,
  Phone,
  Mail
} from "lucide-react"

// Mock data
const mockDeals = [
  {
    id: "deal-001",
    name: "Acme Corp - Enterprise",
    company: "Acme Corporation",
    value: 125000,
    stage: "Negotiation",
    probability: 75,
    closeDate: "2024-02-15",
    owner: "Sarah Chen",
    lastActivity: "2024-01-15T10:00:00Z"
  },
  {
    id: "deal-002",
    name: "TechStart - Growth Plan",
    company: "TechStart Inc",
    value: 45000,
    stage: "Proposal",
    probability: 50,
    closeDate: "2024-01-31",
    owner: "Mike Johnson",
    lastActivity: "2024-01-14T15:30:00Z"
  },
  {
    id: "deal-003",
    name: "Global Systems - Expansion",
    company: "Global Systems Ltd",
    value: 250000,
    stage: "Discovery",
    probability: 25,
    closeDate: "2024-03-30",
    owner: "Lisa Park",
    lastActivity: "2024-01-13T09:00:00Z"
  },
  {
    id: "deal-004",
    name: "InnovateTech - Pilot",
    company: "InnovateTech",
    value: 15000,
    stage: "Closed Won",
    probability: 100,
    closeDate: "2024-01-10",
    owner: "David Lee",
    lastActivity: "2024-01-10T16:00:00Z"
  },
]

const kpis: KPIItem[] = [
  { label: "Pipeline Value", value: "$2.4M", color: "primary", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Open Deals", value: "45", change: "+8 this month", changeType: "positive" },
  { label: "Avg Deal Size", value: "$53K", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Win Rate", value: "32%", change: "+5% vs last Q", changeType: "positive" },
]

const stages = ["Discovery", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]

function StageBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    "Discovery": "bg-blue-100 text-blue-700",
    "Qualification": "bg-purple-100 text-purple-700",
    "Proposal": "bg-yellow-100 text-yellow-700",
    "Negotiation": "bg-orange-100 text-orange-700",
    "Closed Won": "bg-green-100 text-green-700",
    "Closed Lost": "bg-red-100 text-red-700",
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[stage] || "bg-gray-100 text-gray-700"}`}>
      {stage}
    </span>
  )
}

export function DealsView() {
  const [deals] = useState(mockDeals)
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'kanban'>('table')

  const selected = deals.find(d => d.id === selectedDeal)

  return (
    <UnifiedPageTemplate
      title="Deals"
      description="Manage your sales opportunities"
      stageId="SALES-DEALS-001"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Deals" }
      ]}
      kpis={kpis}
      showKpiBand={true}
      viewModes={['table', 'cards', 'kanban']}
      currentViewMode={viewMode}
      onViewModeChange={(mode) => setViewMode(mode as 'table' | 'cards' | 'kanban')}
      headerActions={
        <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Deal
        </button>
      }
      rightPanel={selected ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Deal Name</h4>
            <p className="text-gray-900">{selected.name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Company</h4>
            <p className="text-gray-900">{selected.company}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Value</h4>
              <p className="text-gray-900 font-semibold">${selected.value.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Probability</h4>
              <p className="text-gray-900">{selected.probability}%</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Stage</h4>
            <StageBadge stage={selected.stage} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Close Date</h4>
            <p className="text-gray-900">{new Date(selected.closeDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Owner</h4>
            <p className="text-gray-900">{selected.owner}</p>
          </div>
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <button className="w-full px-3 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] transition-colors flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4" />
              View Deal
            </button>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-1">
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-1">
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
          </div>
        </div>
      ) : null}
      rightPanelTitle="Deal Details"
      rightPanelOpen={rightPanelOpen}
      onRightPanelClose={() => setRightPanelOpen(false)}
      isEmpty={deals.length === 0}
      emptyState={{
        icon: <Briefcase className="w-12 h-12" />,
        title: "No Deals Yet",
        description: "Create your first deal to start tracking opportunities.",
        action: (
          <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832]">
            Create First Deal
          </button>
        )
      }}
    >
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Deal</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Value</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Stage</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Close Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Owner</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deals.map((deal) => (
                <tr 
                  key={deal.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedDeal(deal.id)
                    setRightPanelOpen(true)
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Briefcase className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{deal.name}</p>
                        <p className="text-xs text-gray-500">{deal.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">${deal.value.toLocaleString()}</td>
                  <td className="px-4 py-3"><StageBadge stage={deal.stage} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(deal.closeDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{deal.owner}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage} className="flex-shrink-0 w-72 bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">{stage}</h4>
                <span className="text-xs text-gray-500">{deals.filter(d => d.stage === stage).length}</span>
              </div>
              <div className="space-y-2">
                {deals.filter(d => d.stage === stage).map((deal) => (
                  <div
                    key={deal.id}
                    className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-sm transition-all"
                    onClick={() => {
                      setSelectedDeal(deal.id)
                      setRightPanelOpen(true)
                    }}
                  >
                    <p className="text-sm font-medium text-gray-900 mb-1">{deal.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{deal.company}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-green-600">${deal.value.toLocaleString()}</span>
                      <span className="text-gray-500">{deal.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all"
              onClick={() => {
                setSelectedDeal(deal.id)
                setRightPanelOpen(true)
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{deal.name}</h4>
                    <p className="text-xs text-gray-500">{deal.company}</p>
                  </div>
                </div>
                <StageBadge stage={deal.stage} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-900">${deal.value.toLocaleString()}</span>
                <span className="text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(deal.closeDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </UnifiedPageTemplate>
  )
}

export default DealsView
