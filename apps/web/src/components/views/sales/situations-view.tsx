/**
 * Situations View - Scope-Filtered Situation Cards
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 * 
 * Situations are AI-detected patterns that require attention
 */

"use client"

import { useState } from "react"
import { 
  UnifiedPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  AlertCircle,
  Zap,
  Clock,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Users,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ArrowRight,
  Sparkles,
  Filter
} from "lucide-react"

type SituationType = 'risk' | 'opportunity' | 'action' | 'info'

interface Situation {
  id: string
  title: string
  description: string
  type: SituationType
  priority: 'critical' | 'high' | 'medium' | 'low'
  entity: {
    type: 'deal' | 'account' | 'lead' | 'contact'
    name: string
    id: string
  }
  suggestedActions: string[]
  createdAt: string
  expiresAt?: string
  resolved: boolean
}

const mockSituations: Situation[] = [
  {
    id: "sit-001",
    title: "Deal at risk of stalling",
    description: "Acme Corp Enterprise deal has had no activity for 12 days. Deals at this stage typically close within 7 days of activity.",
    type: "risk",
    priority: "critical",
    entity: { type: "deal", name: "Acme Corp - Enterprise", id: "deal-001" },
    suggestedActions: ["Schedule follow-up call", "Send check-in email", "Involve sales manager"],
    createdAt: "2024-01-15T08:00:00Z",
    expiresAt: "2024-01-18T08:00:00Z",
    resolved: false
  },
  {
    id: "sit-002",
    title: "Hot lead detected",
    description: "RetailMax visited pricing page 5 times in the last 24 hours and downloaded 2 case studies. Lead score increased from 45 to 92.",
    type: "opportunity",
    priority: "high",
    entity: { type: "lead", name: "RetailMax", id: "lead-005" },
    suggestedActions: ["Call immediately", "Send personalized demo invite"],
    createdAt: "2024-01-15T10:30:00Z",
    resolved: false
  },
  {
    id: "sit-003",
    title: "Contract renewal due",
    description: "TechStart subscription renews in 14 days. They've been a happy customer with NPS score of 9. Great upsell opportunity.",
    type: "action",
    priority: "medium",
    entity: { type: "account", name: "TechStart Inc", id: "acc-002" },
    suggestedActions: ["Schedule renewal call", "Prepare upsell proposal"],
    createdAt: "2024-01-14T09:00:00Z",
    resolved: false
  },
  {
    id: "sit-004",
    title: "Champion left company",
    description: "Sarah Johnson, your primary contact at GlobalTech, has updated their LinkedIn to show a new position at another company.",
    type: "risk",
    priority: "high",
    entity: { type: "contact", name: "Sarah Johnson (GlobalTech)", id: "contact-010" },
    suggestedActions: ["Identify new champion", "Reach out to Sarah for intro", "Update account org chart"],
    createdAt: "2024-01-13T14:00:00Z",
    resolved: false
  },
]

const kpis: KPIItem[] = [
  { label: "Active Situations", value: "18", color: "primary", icon: <Zap className="w-4 h-4" /> },
  { label: "Critical", value: "3", color: "red", icon: <AlertCircle className="w-4 h-4" /> },
  { label: "Opportunities", value: "5", color: "green", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Resolved Today", value: "7", icon: <CheckCircle className="w-4 h-4" /> },
]

const typeConfig: Record<SituationType, { bg: string; border: string; icon: any; iconBg: string; iconColor: string }> = {
  risk: { bg: "bg-red-50", border: "border-red-200", icon: TrendingDown, iconBg: "bg-red-100", iconColor: "text-red-600" },
  opportunity: { bg: "bg-green-50", border: "border-green-200", icon: TrendingUp, iconBg: "bg-green-100", iconColor: "text-green-600" },
  action: { bg: "bg-yellow-50", border: "border-yellow-200", icon: Clock, iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
  info: { bg: "bg-blue-50", border: "border-blue-200", icon: Sparkles, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
}

const priorityConfig = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-gray-100 text-gray-600",
}

function SituationCard({ situation, onSelect }: { situation: Situation; onSelect: () => void }) {
  const config = typeConfig[situation.type]
  const Icon = config.icon

  return (
    <div 
      className={`${config.bg} ${config.border} border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.iconBg}`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-900">{situation.title}</h4>
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${priorityConfig[situation.priority]}`}>
                  {situation.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{situation.description}</p>
            </div>
            <button className="p-1 hover:bg-white/50 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs bg-white/70 px-2 py-0.5 rounded border border-white">
              {situation.entity.type}: {situation.entity.name}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(situation.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            {situation.suggestedActions.slice(0, 2).map((action, idx) => (
              <button 
                key={idx}
                className="px-2 py-1 text-xs font-medium bg-white rounded border border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={(e) => e.stopPropagation()}
              >
                {action}
              </button>
            ))}
            {situation.suggestedActions.length > 2 && (
              <span className="text-xs text-gray-500">+{situation.suggestedActions.length - 2} more</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SituationsView() {
  const [situations] = useState(mockSituations)
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [filterType, setFilterType] = useState<SituationType | 'all'>('all')

  const selected = situations.find(s => s.id === selectedSituation)
  const filtered = filterType === 'all' ? situations : situations.filter(s => s.type === filterType)

  return (
    <UnifiedPageTemplate
      title="Situations"
      description="AI-detected patterns requiring attention"
      stageId="SALES-SITUATIONS-001"
      breadcrumbs={[
        { label: "Sales", href: "/sales" },
        { label: "Situations" }
      ]}
      kpis={kpis}
      showKpiBand={true}
      headerActions={
        <div className="flex items-center gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as SituationType | 'all')}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600"
          >
            <option value="all">All Types</option>
            <option value="risk">Risks</option>
            <option value="opportunity">Opportunities</option>
            <option value="action">Actions</option>
          </select>
        </div>
      }
      rightPanel={selected ? (
        <div className="space-y-4">
          <div>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityConfig[selected.priority]}`}>
              {selected.priority} priority
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Situation</h4>
            <p className="text-gray-900 font-medium">{selected.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
            <p className="text-gray-600 text-sm">{selected.description}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Related Entity</h4>
            <p className="text-gray-900">
              <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded mr-1 capitalize">{selected.entity.type}</span>
              {selected.entity.name}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Suggested Actions</h4>
            <div className="space-y-2">
              {selected.suggestedActions.map((action, idx) => (
                <button 
                  key={idx}
                  className="w-full px-3 py-2 text-sm text-left bg-gray-50 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  {action}
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <button className="w-full px-3 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Mark Resolved
            </button>
            <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4" />
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
      rightPanelTitle="Situation Details"
      rightPanelOpen={rightPanelOpen}
      onRightPanelClose={() => setRightPanelOpen(false)}
      isEmpty={filtered.length === 0}
      emptyState={{
        icon: <Zap className="w-12 h-12" />,
        title: "No Situations",
        description: "No active situations detected. Check back later or adjust your filters.",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((situation) => (
          <SituationCard 
            key={situation.id} 
            situation={situation} 
            onSelect={() => {
              setSelectedSituation(situation.id)
              setRightPanelOpen(true)
            }}
          />
        ))}
      </div>
    </UnifiedPageTemplate>
  )
}

export default SituationsView
