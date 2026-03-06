/**
 * Sessions View - AI Session History
 * Uses UnifiedPageTemplate per Day 3 Best Practice
 */

"use client"

import { useState } from "react"
import { 
  UnifiedPageTemplate, 
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import { 
  Brain, 
  Clock, 
  MessageSquare, 
  Target,
  Search,
  Filter,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ExternalLink
} from "lucide-react"

// Mock data - replace with API calls
const mockSessions = [
  {
    id: "session-001",
    title: "Deal Analysis - Acme Corp",
    model: "gpt-4",
    status: "completed",
    messages: 12,
    tokens: 4532,
    duration: "2m 34s",
    created_at: "2024-01-15T10:30:00Z",
    context: ["deals", "accounts"]
  },
  {
    id: "session-002",
    title: "Customer Health Check",
    model: "gpt-4",
    status: "active",
    messages: 5,
    tokens: 1876,
    duration: "1m 12s",
    created_at: "2024-01-15T11:00:00Z",
    context: ["customers", "health"]
  },
  {
    id: "session-003",
    title: "Pipeline Forecast Query",
    model: "gpt-3.5-turbo",
    status: "failed",
    messages: 3,
    tokens: 892,
    duration: "0m 45s",
    created_at: "2024-01-14T15:20:00Z",
    context: ["pipeline", "sales"]
  },
]

const kpis: KPIItem[] = [
  { label: "Total Sessions", value: "1,234", change: "+12% this week", changeType: "positive", icon: <Brain className="w-4 h-4" /> },
  { label: "Active Now", value: "8", color: "green" },
  { label: "Avg Duration", value: "2m 18s", icon: <Clock className="w-4 h-4" /> },
  { label: "Tokens Used", value: "89.2K", change: "-5% vs last week", changeType: "positive" },
]

function StatusBadge({ status }: { status: string }) {
  const styles = {
    completed: "bg-green-100 text-green-700",
    active: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  }
  const icons = {
    completed: <CheckCircle className="w-3 h-3" />,
    active: <Play className="w-3 h-3" />,
    failed: <XCircle className="w-3 h-3" />,
    pending: <Pause className="w-3 h-3" />,
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
      {icons[status as keyof typeof icons]}
      {status}
    </span>
  )
}

export function SessionsView() {
  const [sessions] = useState(mockSessions)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)

  const selected = sessions.find(s => s.id === selectedSession)

  return (
    <UnifiedPageTemplate
      title="AI Sessions"
      description="View and manage AI conversation sessions"
      stageId="OPS-SESSIONS-001"
      breadcrumbs={[
        { label: "Operations", href: "/operations" },
        { label: "Sessions" }
      ]}
      kpis={kpis}
      showKpiBand={true}
      headerActions={
        <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] transition-colors">
          New Session
        </button>
      }
      rightPanel={selected ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Session Title</h4>
            <p className="text-gray-900">{selected.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Model</h4>
            <p className="text-gray-900">{selected.model}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Messages</h4>
            <p className="text-gray-900">{selected.messages}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Context Used</h4>
            <div className="flex flex-wrap gap-1">
              {selected.context.map((ctx, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{ctx}</span>
              ))}
            </div>
          </div>
          <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View Full Session
          </button>
        </div>
      ) : null}
      rightPanelTitle="Session Details"
      rightPanelOpen={rightPanelOpen}
      onRightPanelClose={() => setRightPanelOpen(false)}
      isEmpty={sessions.length === 0}
      emptyState={{
        icon: <Brain className="w-12 h-12" />,
        title: "No Sessions Yet",
        description: "Start a conversation with the AI to see session history here.",
        action: (
          <button className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832]">
            Start First Session
          </button>
        )
      }}
    >
      {/* Sessions Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sessions.map((session) => (
          <button
            key={session.id}
            type="button"
            className="text-left bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
            onClick={() => {
              setSelectedSession(session.id)
              setRightPanelOpen(true)
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{session.title}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{session.model}</div>
                </div>
              </div>
              <div className="shrink-0">
                <StatusBadge status={session.status} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Messages</div>
                <div className="text-sm font-semibold text-gray-900">{session.messages}</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Duration</div>
                <div className="text-sm font-semibold text-gray-900">{session.duration}</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Created</div>
                <div className="text-sm font-semibold text-gray-900">
                  {new Date(session.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </UnifiedPageTemplate>
  )
}

export default SessionsView
