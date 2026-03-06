/**
 * Act History View
 * /act/history - Execution log with filtering and search
 * Day 4: UI Polish + Integration
 */

"use client"

import { useState } from "react"
import { 
  ListPageTemplate,
  type KPIItem 
} from "@/components/layouts/unified-page-template"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Filter,
  Search,
  Calendar,
  Download,
  ChevronRight,
  Building2,
  Mail,
  Phone,
  DollarSign,
  Zap,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  MoreHorizontal,
  Play,
  Eye
} from "lucide-react"
import type { ExecutionRun } from "@/components/approvals"

// Extended mock data for history
const mockExecutionHistory: ExecutionRun[] = [
  {
    id: "exec-001",
    actionType: "outreach",
    title: "Send check-in email to Sarah Chen",
    entity: { id: "acc-001", name: "Acme Corp", type: "account" },
    status: "completed",
    startedAt: "2026-01-29T09:30:00Z",
    completedAt: "2026-01-29T09:31:00Z",
    duration: 45,
    result: { success: true, message: "Email sent successfully" },
    approvedBy: "John Smith",
    retryCount: 0
  },
  {
    id: "exec-002",
    actionType: "discount",
    title: "Apply 15% discount to TechStart deal",
    entity: { id: "deal-002", name: "TechStart Enterprise", type: "deal" },
    status: "completed",
    startedAt: "2026-01-29T09:15:00Z",
    completedAt: "2026-01-29T09:16:00Z",
    duration: 42,
    result: { success: true, message: "Discount applied and notification sent" },
    approvedBy: "Jane Doe",
    retryCount: 0
  },
  {
    id: "exec-003",
    actionType: "escalation",
    title: "Escalate GlobalTrade ticket to Tier 2",
    entity: { id: "acc-003", name: "GlobalTrade Inc", type: "account" },
    status: "failed",
    startedAt: "2026-01-29T09:00:00Z",
    completedAt: "2026-01-29T09:01:00Z",
    duration: 62,
    result: { success: false, message: "Zendesk API rate limit exceeded" },
    approvedBy: "Mike Johnson",
    retryCount: 2
  },
  {
    id: "exec-004",
    actionType: "follow_up",
    title: "Schedule follow-up call with StartupXYZ",
    entity: { id: "acc-004", name: "StartupXYZ", type: "account" },
    status: "running",
    startedAt: "2026-01-29T09:45:00Z",
    approvedBy: "Sarah Chen",
    retryCount: 0
  },
  {
    id: "exec-005",
    actionType: "renewal",
    title: "Send renewal reminder to BigCorp",
    entity: { id: "acc-005", name: "BigCorp Ltd", type: "account" },
    status: "completed",
    startedAt: "2026-01-28T14:30:00Z",
    completedAt: "2026-01-28T14:31:00Z",
    duration: 38,
    result: { success: true, message: "Renewal reminder sent" },
    approvedBy: "Alex Kim",
    retryCount: 0
  },
  {
    id: "exec-006",
    actionType: "upsell",
    title: "Send enterprise upgrade proposal",
    entity: { id: "acc-006", name: "MidSize Co", type: "account" },
    status: "cancelled",
    startedAt: "2026-01-28T11:00:00Z",
    completedAt: "2026-01-28T11:00:00Z",
    duration: 0,
    result: { success: false, message: "Cancelled by user" },
    approvedBy: "Emily Davis",
    retryCount: 0
  }
]

const statusConfig = {
  queued: { icon: Clock, color: "text-gray-500", bg: "bg-gray-100", label: "Queued" },
  running: { icon: Loader2, color: "text-blue-600", bg: "bg-blue-100", label: "Running", animate: true },
  completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100", label: "Completed" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-100", label: "Failed" },
  cancelled: { icon: XCircle, color: "text-gray-500", bg: "bg-gray-100", label: "Cancelled" }
}

const typeIcons = {
  outreach: Mail,
  discount: DollarSign,
  escalation: AlertTriangle,
  renewal: Clock,
  upsell: Zap,
  follow_up: Phone
}

const typeLabels = {
  outreach: "Outreach",
  discount: "Discount",
  escalation: "Escalation",
  renewal: "Renewal",
  upsell: "Upsell",
  follow_up: "Follow-up"
}

interface ActHistoryViewProps {
  onExecutionClick?: (execution: ExecutionRun) => void
  onRetry?: (execution: ExecutionRun) => void
}

export function ActHistoryView({ onExecutionClick, onRetry }: ActHistoryViewProps) {
  const [executions] = useState(mockExecutionHistory)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selected, setSelected] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  // Filter executions
  const filteredExecutions = executions.filter(exec => {
    const matchesSearch = searchQuery === "" || 
      exec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.entity.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || exec.status === statusFilter
    const matchesType = typeFilter === "all" || exec.actionType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const completedCount = executions.filter(e => e.status === "completed").length
  const failedCount = executions.filter(e => e.status === "failed").length
  const successRate = executions.length > 0 
    ? Math.round((completedCount / executions.length) * 100) 
    : 0

  const kpis: KPIItem[] = [
    { label: "Total Executions", value: String(executions.length), color: "primary", icon: <Play className="w-4 h-4" /> },
    { label: "Completed", value: String(completedCount), color: "green" },
    { label: "Failed", value: String(failedCount), color: "red" },
    { label: "Success Rate", value: `${successRate}%`, change: successRate >= 90 ? "Healthy" : successRate >= 70 ? "Monitor" : "At Risk", changeType: successRate >= 90 ? "positive" : successRate >= 70 ? "neutral" : "negative" },
  ]

  const selectedExecution = executions.find(e => e.id === selected)

  return (
    <ListPageTemplate
      title="Execution History"
      description="View all action executions"
      stageId="ACT-HISTORY-001"
      breadcrumbs={[{ label: "Act", href: "/act" }, { label: "History" }]}
      kpis={kpis}
      headerActions={
        <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      }
      rightPanel={selectedExecution ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Action</h4>
            <p className="text-gray-900 font-medium">{selectedExecution.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedExecution.status].bg} ${statusConfig[selectedExecution.status].color}`}>
              {statusConfig[selectedExecution.status].label}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Entity</h4>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
              <Building2 className="w-3 h-3" />
              {selectedExecution.entity.name}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
              <p className="text-gray-900">{typeLabels[selectedExecution.actionType]}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Duration</h4>
              <p className="text-gray-900">{selectedExecution.duration ? `${selectedExecution.duration}s` : "-"}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Started At</h4>
            <p className="text-gray-900">{new Date(selectedExecution.startedAt).toLocaleString()}</p>
          </div>
          {selectedExecution.completedAt && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Completed At</h4>
              <p className="text-gray-900">{new Date(selectedExecution.completedAt).toLocaleString()}</p>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Approved By</h4>
            <p className="text-gray-900">{selectedExecution.approvedBy}</p>
          </div>
          {selectedExecution.result && (
            <div className={`p-3 rounded-lg ${selectedExecution.result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h4 className={`text-sm font-medium mb-1 ${selectedExecution.result.success ? 'text-green-800' : 'text-red-800'}`}>Result</h4>
              <p className={`text-sm ${selectedExecution.result.success ? 'text-green-600' : 'text-red-600'}`}>
                {selectedExecution.result.message}
              </p>
            </div>
          )}
          {selectedExecution.status === "failed" && (
            <button
              onClick={() => onRetry?.(selectedExecution)}
              className="w-full px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Execution
            </button>
          )}
        </div>
      ) : null}
      rightPanelTitle="Execution Details"
      rightPanelOpen={panelOpen}
      onRightPanelClose={() => setPanelOpen(false)}
    >
      {/* Filters */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search executions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7A3E]/20 focus:border-[#2D7A3E]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7A3E]/20"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="running">Running</option>
          <option value="queued">Queued</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7A3E]/20"
        >
          <option value="all">All Types</option>
          <option value="outreach">Outreach</option>
          <option value="discount">Discount</option>
          <option value="escalation">Escalation</option>
          <option value="renewal">Renewal</option>
          <option value="upsell">Upsell</option>
          <option value="follow_up">Follow-up</option>
        </select>
      </div>

      {/* Executions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Execution</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Entity</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Type</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Duration</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Time</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredExecutions.map((execution) => {
              const status = statusConfig[execution.status]
              const StatusIcon = status.icon
              const TypeIcon = typeIcons[execution.actionType]

              return (
                <tr 
                  key={execution.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => { setSelected(execution.id); setPanelOpen(true); }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${status.bg}`}>
                        <StatusIcon className={`w-4 h-4 ${status.color} ${(status as any).animate ? 'animate-spin' : ''}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{execution.title}</p>
                        <p className="text-xs text-gray-500">ID: {execution.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                      <Building2 className="w-3 h-3" />
                      {execution.entity.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <TypeIcon className="w-4 h-4" />
                      {typeLabels[execution.actionType]}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {execution.duration ? `${execution.duration}s` : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(execution.startedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {execution.status === "failed" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onRetry?.(execution); }}
                          className="p-1.5 text-gray-400 hover:text-[#2D7A3E] hover:bg-green-50 rounded-lg"
                          title="Retry"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </ListPageTemplate>
  )
}

export default ActHistoryView
