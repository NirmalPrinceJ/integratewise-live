/**
 * Run Details View
 * Individual execution inspection with full details
 * Day 4: UI Polish + Integration
 */

"use client"

import { useState } from "react"
import { 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  RotateCcw,
  ExternalLink,
  Building2,
  Mail,
  Phone,
  DollarSign,
  Zap,
  AlertTriangle,
  Copy,
  ChevronDown,
  ChevronUp,
  FileText,
  Code,
  Activity,
  User,
  Sparkles
} from "lucide-react"
import type { ExecutionRun } from "@/components/approvals"

interface RunDetailsViewProps {
  execution: ExecutionRun
  onBack?: () => void
  onRetry?: (execution: ExecutionRun) => void
}

const statusConfig = {
  queued: { icon: Clock, color: "text-gray-500", bg: "bg-gray-100", label: "Queued", description: "Waiting in queue" },
  running: { icon: Loader2, color: "text-blue-600", bg: "bg-blue-100", label: "Running", description: "Currently executing", animate: true },
  completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100", label: "Completed", description: "Successfully executed" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-100", label: "Failed", description: "Execution failed" },
  cancelled: { icon: XCircle, color: "text-gray-500", bg: "bg-gray-100", label: "Cancelled", description: "Cancelled by user" }
}

const typeIcons = {
  outreach: Mail,
  discount: DollarSign,
  escalation: AlertTriangle,
  renewal: Clock,
  upsell: Zap,
  follow_up: Phone
}

// Mock execution logs
const mockLogs = [
  { timestamp: "2026-01-29T09:30:00.000Z", level: "info", message: "Execution started" },
  { timestamp: "2026-01-29T09:30:00.100Z", level: "info", message: "Loading entity data for Acme Corp" },
  { timestamp: "2026-01-29T09:30:00.500Z", level: "info", message: "Fetching contact details for Sarah Chen" },
  { timestamp: "2026-01-29T09:30:01.200Z", level: "info", message: "Generating personalized email content" },
  { timestamp: "2026-01-29T09:30:02.500Z", level: "info", message: "Connecting to email service" },
  { timestamp: "2026-01-29T09:30:03.000Z", level: "info", message: "Email sent successfully" },
  { timestamp: "2026-01-29T09:30:03.100Z", level: "info", message: "Updating CRM with activity" },
  { timestamp: "2026-01-29T09:30:03.500Z", level: "info", message: "Execution completed" }
]

const mockFailedLogs = [
  { timestamp: "2026-01-29T09:00:00.000Z", level: "info", message: "Execution started" },
  { timestamp: "2026-01-29T09:00:00.100Z", level: "info", message: "Loading entity data for GlobalTrade Inc" },
  { timestamp: "2026-01-29T09:00:00.500Z", level: "info", message: "Fetching ticket details from Zendesk" },
  { timestamp: "2026-01-29T09:00:01.000Z", level: "warn", message: "Rate limit warning received (450/500)" },
  { timestamp: "2026-01-29T09:00:01.200Z", level: "info", message: "Attempting escalation request" },
  { timestamp: "2026-01-29T09:00:01.500Z", level: "error", message: "Zendesk API rate limit exceeded (429)" },
  { timestamp: "2026-01-29T09:00:01.600Z", level: "info", message: "Retry attempt 1/3" },
  { timestamp: "2026-01-29T09:00:02.000Z", level: "error", message: "Retry failed: Rate limit still active" },
  { timestamp: "2026-01-29T09:00:02.100Z", level: "info", message: "Retry attempt 2/3" },
  { timestamp: "2026-01-29T09:00:02.500Z", level: "error", message: "Retry failed: Rate limit still active" },
  { timestamp: "2026-01-29T09:00:02.600Z", level: "error", message: "Execution failed after 3 attempts" }
]

export function RunDetailsView({ execution, onBack, onRetry }: RunDetailsViewProps) {
  const [showLogs, setShowLogs] = useState(true)
  const [showPayload, setShowPayload] = useState(false)
  const [copiedId, setCopiedId] = useState(false)

  const status = statusConfig[execution.status]
  const StatusIcon = status.icon
  const TypeIcon = typeIcons[execution.actionType]

  const logs = execution.status === "failed" ? mockFailedLogs : mockLogs

  const copyId = () => {
    navigator.clipboard.writeText(execution.id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  // Mock payload data
  const payloadData = {
    approval_id: `apr-${execution.id.replace('exec-', '')}`,
    entity_id: execution.entity.id,
    entity_type: execution.entity.type,
    action_type: execution.actionType,
    parameters: {
      template: "check_in_email_v2",
      recipient: "sarah.chen@acme.com",
      subject: "Quick check-in on our proposal"
    },
    context: {
      last_engagement: "2026-01-15T10:30:00Z",
      days_since_contact: 14,
      deal_value: 45000
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>Act</span>
                <span>/</span>
                <span>History</span>
                <span>/</span>
                <span className="font-medium text-gray-900">{execution.id}</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">{execution.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {execution.status === "failed" && (
                <button
                  onClick={() => onRetry?.(execution)}
                  className="px-4 py-2 bg-[#2D7A3E] text-white rounded-lg text-sm font-medium hover:bg-[#246832] flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </button>
              )}
              {execution.result?.outputUrl && (
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Output
                </button>
              )}
            </div>
          </div>

          {/* Status Banner */}
          <div className={`p-4 rounded-xl ${status.bg} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <StatusIcon className={`w-6 h-6 ${status.color} ${status.animate ? 'animate-spin' : ''}`} />
              <div>
                <h3 className={`text-lg font-semibold ${status.color}`}>{status.label}</h3>
                <p className="text-sm opacity-80">{status.description}</p>
              </div>
            </div>
            {execution.duration && (
              <div className="text-right">
                <p className="text-sm opacity-60">Duration</p>
                <p className={`text-lg font-semibold ${status.color}`}>{execution.duration}s</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Execution Logs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Execution Logs</h3>
                  <span className="text-xs text-gray-500">({logs.length} entries)</span>
                </div>
                {showLogs ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              
              {showLogs && (
                <div className="border-t border-gray-200 bg-gray-900 p-4 font-mono text-sm overflow-x-auto max-h-[400px] overflow-y-auto">
                  {logs.map((log, idx) => {
                    const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })
                    const levelColor = log.level === "error" ? "text-red-400" : log.level === "warn" ? "text-yellow-400" : "text-gray-400"
                    const messageColor = log.level === "error" ? "text-red-300" : log.level === "warn" ? "text-yellow-300" : "text-gray-300"
                    
                    return (
                      <div key={idx} className="flex gap-4 py-1">
                        <span className="text-gray-500 whitespace-nowrap">{time}</span>
                        <span className={`uppercase w-12 ${levelColor}`}>{log.level}</span>
                        <span className={messageColor}>{log.message}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Request Payload */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowPayload(!showPayload)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Request Payload</h3>
                </div>
                {showPayload ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              
              {showPayload && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <pre className="text-sm text-gray-700 overflow-x-auto">
                    {JSON.stringify(payloadData, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Result */}
            {execution.result && (
              <div className={`rounded-xl border p-4 ${execution.result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {execution.result.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <h3 className={`text-sm font-semibold ${execution.result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {execution.result.success ? "Success" : "Error"}
                  </h3>
                </div>
                <p className={`text-sm ${execution.result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {execution.result.message}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Execution Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Execution Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500">Execution ID</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm text-gray-900 font-mono">{execution.id}</code>
                    <button onClick={copyId} className="p-1 hover:bg-gray-100 rounded">
                      {copiedId ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Action Type</label>
                  <div className="flex items-center gap-2 mt-1">
                    <TypeIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900 capitalize">{execution.actionType.replace("_", " ")}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Started At</label>
                  <p className="text-sm text-gray-900 mt-1">{new Date(execution.startedAt).toLocaleString()}</p>
                </div>
                {execution.completedAt && (
                  <div>
                    <label className="text-xs text-gray-500">Completed At</label>
                    <p className="text-sm text-gray-900 mt-1">{new Date(execution.completedAt).toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500">Retry Count</label>
                  <p className="text-sm text-gray-900 mt-1">{execution.retryCount}</p>
                </div>
              </div>
            </div>

            {/* Entity Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Target Entity</h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{execution.entity.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{execution.entity.type}</p>
                </div>
              </div>
              <button className="w-full mt-3 px-4 py-2 text-sm text-[#2D7A3E] hover:bg-green-50 rounded-lg font-medium flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                View Entity Details
              </button>
            </div>

            {/* Approval Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Approval</h3>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{execution.approvedBy}</p>
                  <p className="text-xs text-gray-500">Approved this action</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RunDetailsView
