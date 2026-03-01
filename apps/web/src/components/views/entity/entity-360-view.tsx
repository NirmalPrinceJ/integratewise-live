/**
 * Entity 360 View
 * Unified entity detail view with timeline and tabs
 * Day 4: UI Polish + Integration
 */

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import {
  ArrowLeft,
  Building2,
  User,
  Briefcase,
  Ticket,
  ChevronDown,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileText,
  Sparkles,
  Zap,
  Activity,
  BarChart3,
  Link2,
  Star,
  Heart,
  AlertCircle,
  Loader2,
} from "lucide-react"

// Types
export interface Entity {
  id: string
  type: "account" | "contact" | "deal" | "ticket"
  name: string
  avatar?: string
  healthScore?: number
  metadata: Record<string, any>
}

export interface TimelineEvent {
  id: string
  type: "A" | "B" | "C" // Activity, Behavior, Context
  category: string
  title: string
  description: string
  timestamp: string
  source: string
  icon?: string
}

// Mock entity data
const mockEntity: Entity = {
  id: "acc-001",
  type: "account",
  name: "Acme Corp",
  healthScore: 72,
  metadata: {
    industry: "Technology",
    size: "500-1000 employees",
    location: "San Francisco, CA",
    website: "acme.com",
    linkedin: "linkedin.com/company/acme",
    mrr: 4500,
    arr: 54000,
    owner: "John Smith",
    tier: "Enterprise",
    createdAt: "2023-06-15",
    primaryContact: "Sarah Chen",
    openDeals: 2,
    activeTickets: 1
  }
}

// Mock timeline data
const mockTimeline: TimelineEvent[] = [
  { id: "t1", type: "A", category: "Email", title: "Email sent by John Smith", description: "Follow-up email regarding Q1 renewal discussion", timestamp: "2026-01-29T09:30:00Z", source: "Gmail" },
  { id: "t2", type: "B", category: "Engagement", title: "Engagement score dropped", description: "Weekly engagement score decreased from 85 to 72", timestamp: "2026-01-29T06:00:00Z", source: "IntegrateWise" },
  { id: "t3", type: "A", category: "Meeting", title: "Demo call completed", description: "45-minute product demo with Sarah Chen and team", timestamp: "2026-01-28T14:00:00Z", source: "Calendar" },
  { id: "t4", type: "C", category: "News", title: "Company expansion announced", description: "Acme Corp announced plans to expand into European market", timestamp: "2026-01-27T10:00:00Z", source: "News Feed" },
  { id: "t5", type: "A", category: "Support", title: "Support ticket resolved", description: "Integration issue with API resolved by Tier 2", timestamp: "2026-01-26T16:30:00Z", source: "Zendesk" },
  { id: "t6", type: "B", category: "Usage", title: "Usage spike detected", description: "API calls increased 40% week-over-week", timestamp: "2026-01-25T08:00:00Z", source: "Analytics" },
]

// Mock signals
const mockSignals = [
  { id: "s1", type: "risk", title: "Engagement drop detected", description: "Champion hasn't engaged in 14 days", severity: "high", timestamp: "2026-01-29T06:00:00Z" },
  { id: "s2", type: "opportunity", title: "Upsell potential", description: "Usage approaching plan limits", severity: "medium", timestamp: "2026-01-28T10:00:00Z" },
  { id: "s3", type: "info", title: "New stakeholder identified", description: "CFO added to email thread", severity: "low", timestamp: "2026-01-27T14:00:00Z" },
]

// Mock situations
const mockSituations = [
  { id: "sit1", title: "Champion at risk", description: "Sarah Chen showing signs of disengagement. Consider executive outreach.", status: "open", priority: "high", createdAt: "2026-01-29T08:00:00Z" },
  { id: "sit2", title: "Renewal opportunity", description: "Account approaching renewal. Expansion discussion recommended.", status: "open", priority: "medium", createdAt: "2026-01-28T10:00:00Z" },
]

// Mock context (artifacts)
const mockContext = [
  { id: "c1", type: "document", title: "Proposal - Q1 2026", description: "Enterprise expansion proposal", uploadedAt: "2026-01-20T10:00:00Z" },
  { id: "c2", type: "transcript", title: "Demo Call Recording", description: "45-minute product demo transcript", uploadedAt: "2026-01-28T14:00:00Z" },
  { id: "c3", type: "email", title: "Pricing Discussion Thread", description: "Email thread with CFO about enterprise pricing", uploadedAt: "2026-01-25T09:00:00Z" },
]

// Mock AI memories
const mockMemories = [
  { id: "m1", summary: "Discussed API integration challenges; recommended scheduling technical call", sessionId: "sess-001", createdAt: "2026-01-28T10:00:00Z" },
  { id: "m2", summary: "Explored upsell to Enterprise tier; prospect interested in advanced analytics", sessionId: "sess-002", createdAt: "2026-01-25T14:00:00Z" },
]

// Mock actions
const mockActions = [
  { id: "a1", type: "proposed", title: "Send check-in email", status: "pending", createdAt: "2026-01-29T08:00:00Z" },
  { id: "a2", type: "executed", title: "Schedule follow-up call", status: "completed", createdAt: "2026-01-28T09:00:00Z" },
  { id: "a3", type: "executed", title: "Escalate support ticket", status: "completed", createdAt: "2026-01-26T16:00:00Z" },
]

const entityTypeIcons = {
  account: Building2,
  contact: User,
  deal: Briefcase,
  ticket: Ticket
}

const typeConfig = {
  A: { label: "Activity", color: "bg-blue-100 text-blue-700", borderColor: "border-blue-300" },
  B: { label: "Behavior", color: "bg-purple-100 text-purple-700", borderColor: "border-purple-300" },
  C: { label: "Context", color: "bg-amber-100 text-amber-700", borderColor: "border-amber-300" }
}

interface Entity360ViewProps {
  entity?: Entity
  onBack?: () => void
}

type TabId = "timeline" | "signals" | "situations" | "context" | "memory" | "actions"

export function Entity360View({ entity = mockEntity, onBack }: Entity360ViewProps) {
  const auth = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>("timeline")
  const [timelineFilter, setTimelineFilter] = useState<"all" | "A" | "B" | "C">("all")
  const [entityData, setEntityData] = useState<Entity>(entity)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(mockTimeline)
  const [signals, setSignals] = useState(mockSignals)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // Load entity data from API on mount
  useEffect(() => {
    const loadEntityData = async () => {
      try {
        setLoading(true)
        setApiError(null)

        const apiBase = import.meta.env.VITE_API_BASE_URL || ""
        if (!apiBase) {
          console.warn("[Entity360] No API base URL configured, using mock data")
          setLoading(false)
          return
        }

        // Get tenant ID from auth context
        const tenantId = auth.user?.user_metadata?.tenant_id
          || auth.user?.app_metadata?.tenant_id
          || "default"

        const entityId = entity?.id || "acc-001"

        // Fetch entity details from Spine
        try {
          const entityResponse = await fetch(
            `${apiBase}/api/v1/pipeline/entities/${entityId}`,
            {
              headers: {
                "Content-Type": "application/json",
                "x-tenant-id": tenantId,
              },
              credentials: "include",
            }
          )
          if (entityResponse.ok) {
            const data = await entityResponse.json()
            setEntityData(data?.entity || entity)
          }
        } catch (err) {
          console.warn("[Entity360] Failed to fetch entity details, using mock:", err)
        }

        // Fetch entity timeline from Knowledge
        try {
          const timelineResponse = await fetch(
            `${apiBase}/api/v1/knowledge/search?entity_id=${entityId}`,
            {
              headers: {
                "Content-Type": "application/json",
                "x-tenant-id": tenantId,
              },
              credentials: "include",
            }
          )
          if (timelineResponse.ok) {
            const data = await timelineResponse.json()
            setTimelineEvents(data?.events || mockTimeline)
          }
        } catch (err) {
          console.warn("[Entity360] Failed to fetch timeline, using mock:", err)
        }

        // Fetch entity signals from Think
        try {
          const signalsResponse = await fetch(
            `${apiBase}/api/v1/cognitive/signals?entity_id=${entityId}`,
            {
              headers: {
                "Content-Type": "application/json",
                "x-tenant-id": tenantId,
              },
              credentials: "include",
            }
          )
          if (signalsResponse.ok) {
            const data = await signalsResponse.json()
            setSignals(data?.signals || mockSignals)
          }
        } catch (err) {
          console.warn("[Entity360] Failed to fetch signals, using mock:", err)
        }
      } catch (err) {
        console.error("[Entity360] Error loading entity data:", err)
        setApiError("Failed to load entity data")
      } finally {
        setLoading(false)
      }
    }

    loadEntityData()
  }, [auth.user, entity?.id])

  const EntityIcon = entityTypeIcons[entityData.type]

  // Health score color
  const healthColor = entityData.healthScore && entityData.healthScore >= 80 ? "text-green-600 bg-green-100" :
                      entityData.healthScore && entityData.healthScore >= 60 ? "text-yellow-600 bg-yellow-100" :
                      "text-red-600 bg-red-100"

  const filteredTimeline = timelineFilter === "all"
    ? timelineEvents
    : timelineEvents.filter(e => e.type === timelineFilter)

  const tabs = [
    { id: "timeline", label: "Timeline", count: timelineEvents.length },
    { id: "signals", label: "Signals", count: signals.length },
    { id: "situations", label: "Situations", count: mockSituations.length },
    { id: "context", label: "Context", count: mockContext.length },
    { id: "memory", label: "AI Memory", count: mockMemories.length },
    { id: "actions", label: "Actions", count: mockActions.length },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Back + Breadcrumb */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div className="text-sm text-gray-500">
              <span className="capitalize">{entityData.type}s</span>
              <span className="mx-2">/</span>
              <span className="font-medium text-gray-900">{entityData.name}</span>
            </div>
          </div>

          {/* Entity Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shrink-0">
                <EntityIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{entityData.name}</h1>
                  {loading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="capitalize">{entityData.type}</span>
                  {entityData.metadata.industry && <span>• {entityData.metadata.industry}</span>}
                  {entityData.metadata.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {entityData.metadata.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Health Score */}
            {entityData.healthScore !== undefined && (
              <div className={`px-4 py-2 rounded-xl ${healthColor} shrink-0`}>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <div>
                    <p className="text-2xl font-bold">{entityData.healthScore}</p>
                    <p className="text-xs opacity-80">Health Score</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-6 gap-4 mt-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">MRR</p>
              <p className="text-lg font-semibold text-gray-900">${entityData.metadata.mrr?.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">ARR</p>
              <p className="text-lg font-semibold text-gray-900">${entityData.metadata.arr?.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Owner</p>
              <p className="text-lg font-semibold text-gray-900">{entityData.metadata.owner}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Tier</p>
              <p className="text-lg font-semibold text-gray-900">{entityData.metadata.tier}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Open Deals</p>
              <p className="text-lg font-semibold text-gray-900">{entityData.metadata.openDeals}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Active Tickets</p>
              <p className="text-lg font-semibold text-gray-900">{entityData.metadata.activeTickets}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b border-gray-200 -mx-6 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#2D7A3E] text-[#2D7A3E]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* API Error Box */}
        {apiError && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Note:</strong> Some data is using fallback values. {apiError}
            </div>
          </div>
        )}
        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <div>
            {/* Filter */}
            <div className="flex gap-2 mb-4">
              {(["all", "A", "B", "C"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTimelineFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    timelineFilter === f
                      ? "bg-gray-900 text-white"
                      : f === "all" ? "bg-white text-gray-600 border border-gray-200" : typeConfig[f as "A"|"B"|"C"].color
                  }`}
                >
                  {f === "all" ? `All (${mockTimeline.length})` : `${f} - ${typeConfig[f].label}`}
                </button>
              ))}
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-4">
                {filteredTimeline.map((event) => (
                  <div key={event.id} className="relative pl-10">
                    <div className={`absolute left-2 w-5 h-5 rounded-full border-2 bg-white ${typeConfig[event.type].borderColor} flex items-center justify-center`}>
                      <span className="text-[10px] font-bold">{event.type}</span>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeConfig[event.type].color}`}>
                          {event.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <p className="text-xs text-gray-400 mt-2">via {event.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Signals Tab */}
        {activeTab === "signals" && (
          <div className="space-y-4">
            {signals.map((signal) => (
              <div key={signal.id} className={`bg-white rounded-xl border p-4 ${
                signal.severity === "high" ? "border-red-200" :
                signal.severity === "medium" ? "border-yellow-200" : "border-gray-200"
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      signal.type === "risk" ? "bg-red-100" :
                      signal.type === "opportunity" ? "bg-green-100" : "bg-blue-100"
                    }`}>
                      {signal.type === "risk" ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                       signal.type === "opportunity" ? <TrendingUp className="w-4 h-4 text-green-600" /> :
                       <Activity className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{signal.title}</h4>
                      <p className="text-sm text-gray-600">{signal.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    signal.severity === "high" ? "bg-red-100 text-red-700" :
                    signal.severity === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {signal.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Situations Tab */}
        {activeTab === "situations" && (
          <div className="space-y-4">
            {mockSituations.map((situation) => (
              <div key={situation.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-medium text-gray-900">{situation.title}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    situation.priority === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {situation.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{situation.description}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(situation.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* Context Tab */}
        {activeTab === "context" && (
          <div className="grid grid-cols-3 gap-4">
            {mockContext.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                </div>
                <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(item.uploadedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* AI Memory Tab */}
        {activeTab === "memory" && (
          <div className="space-y-4">
            {mockMemories.map((memory) => (
              <div key={memory.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-purple-600 font-medium">AI Session Memory</span>
                </div>
                <p className="text-sm text-gray-900">{memory.summary}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span>Session: {memory.sessionId}</span>
                  <span>{new Date(memory.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === "actions" && (
          <div className="space-y-4">
            {mockActions.map((action) => (
              <div key={action.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      action.type === "proposed" ? "bg-amber-100" : "bg-green-100"
                    }`}>
                      {action.type === "proposed" ? 
                        <Clock className="w-4 h-4 text-amber-600" /> : 
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      }
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                      <p className="text-xs text-gray-500 capitalize">{action.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    action.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                  }`}>
                    {action.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Entity360View
