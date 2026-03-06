/**
 * Pending Approvals Card
 * Shows proposed actions needing user decision on Today view
 * Day 4: UI Polish + Integration
 */

"use client"

import { useState } from "react"
import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight,
  Sparkles,
  Building2,
  User,
  DollarSign,
  Mail,
  Phone,
  AlertTriangle,
  Zap
} from "lucide-react"

export interface PendingApproval {
  id: string
  type: "outreach" | "discount" | "escalation" | "renewal" | "upsell" | "follow_up"
  title: string
  description: string
  entity: {
    id: string
    name: string
    type: "account" | "contact" | "deal" | "ticket"
  }
  urgency: "critical" | "high" | "medium" | "low"
  confidence: number // 0-100
  proposedAt: string
  expiresAt?: string
  evidence: {
    type: "signal" | "pattern" | "rule"
    summary: string
  }[]
  suggestedAction: string
  impact: string
}

const mockApprovals: PendingApproval[] = [
  {
    id: "apr-001",
    type: "outreach",
    title: "Reach out to Acme Corp",
    description: "Champion Sarah Chen hasn't engaged in 14 days. Risk of deal stalling.",
    entity: { id: "acc-001", name: "Acme Corp", type: "account" },
    urgency: "high",
    confidence: 87,
    proposedAt: "2026-01-29T08:00:00Z",
    expiresAt: "2026-01-30T08:00:00Z",
    evidence: [
      { type: "signal", summary: "No email opens in 14 days" },
      { type: "pattern", summary: "Similar deals stalled at this stage" },
      { type: "rule", summary: "Engagement drop detected" }
    ],
    suggestedAction: "Send personalized check-in email",
    impact: "Prevent $45K deal from stalling"
  },
  {
    id: "apr-002",
    type: "discount",
    title: "Offer 15% discount to TechStart",
    description: "Competitor pricing detected. Discount may accelerate close.",
    entity: { id: "deal-002", name: "TechStart Enterprise", type: "deal" },
    urgency: "critical",
    confidence: 92,
    proposedAt: "2026-01-29T07:30:00Z",
    evidence: [
      { type: "signal", summary: "Competitor mentioned in call transcript" },
      { type: "pattern", summary: "Win rate 3x higher with competitive discount" }
    ],
    suggestedAction: "Approve 15% discount ($4,500 off)",
    impact: "Close $30K deal this week"
  },
  {
    id: "apr-003",
    type: "escalation",
    title: "Escalate GlobalTrade support ticket",
    description: "P1 ticket unresolved for 4 hours. Customer health at risk.",
    entity: { id: "acc-003", name: "GlobalTrade Inc", type: "account" },
    urgency: "critical",
    confidence: 95,
    proposedAt: "2026-01-29T09:15:00Z",
    evidence: [
      { type: "signal", summary: "Ticket open 4+ hours (SLA: 2h)" },
      { type: "pattern", summary: "Enterprise customer, $120K ARR" }
    ],
    suggestedAction: "Escalate to Tier 2 support",
    impact: "Protect $120K customer relationship"
  }
]

const urgencyConfig = {
  critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: AlertTriangle },
  high: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: AlertCircle },
  medium: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", icon: Clock },
  low: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: Sparkles }
}

const typeConfig = {
  outreach: { icon: Mail, label: "Outreach", color: "text-blue-600" },
  discount: { icon: DollarSign, label: "Discount", color: "text-green-600" },
  escalation: { icon: AlertTriangle, label: "Escalation", color: "text-red-600" },
  renewal: { icon: Clock, label: "Renewal", color: "text-purple-600" },
  upsell: { icon: Zap, label: "Upsell", color: "text-amber-600" },
  follow_up: { icon: Phone, label: "Follow-up", color: "text-cyan-600" }
}

interface PendingApprovalsCardProps {
  onApprovalClick: (approval: PendingApproval) => void
  approvals?: PendingApproval[]
  className?: string
}

export function PendingApprovalsCard({ 
  onApprovalClick, 
  approvals = mockApprovals,
  className = ""
}: PendingApprovalsCardProps) {
  const criticalCount = approvals.filter(a => a.urgency === "critical").length
  const highCount = approvals.filter(a => a.urgency === "high").length

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 rounded-lg">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Pending Approvals</h3>
          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            {approvals.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {criticalCount > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
              {criticalCount} critical
            </span>
          )}
          {highCount > 0 && (
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
              {highCount} high
            </span>
          )}
        </div>
      </div>

      {/* Approvals List */}
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {approvals.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900">All caught up!</p>
            <p className="text-xs text-gray-500 mt-1">No pending approvals at this time</p>
          </div>
        ) : (
          approvals.map((approval) => {
            const urgency = urgencyConfig[approval.urgency]
            const type = typeConfig[approval.type]
            const UrgencyIcon = urgency.icon
            const TypeIcon = type.icon

            return (
              <div
                key={approval.id}
                onClick={() => onApprovalClick(approval)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Type Icon */}
                  <div className={`p-2 rounded-lg ${urgency.bg}`}>
                    <TypeIcon className={`w-4 h-4 ${type.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${urgency.bg} ${urgency.text}`}>
                        {approval.urgency}
                      </span>
                      <span className="text-xs text-gray-500">{type.label}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{approval.confidence}% confidence</span>
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">
                      {approval.title}
                    </h4>
                    
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {approval.description}
                    </p>

                    {/* Entity Badge */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        <Building2 className="w-3 h-3" />
                        {approval.entity.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(approval.proposedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>

                {/* Impact Preview */}
                <div className="mt-3 ml-11 p-2 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-xs text-green-700">
                    <span className="font-medium">Impact:</span> {approval.impact}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      {approvals.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <button className="text-sm text-[#2D7A3E] hover:underline font-medium">
            View all {approvals.length} pending approvals →
          </button>
        </div>
      )}
    </div>
  )
}

export { mockApprovals }
export default PendingApprovalsCard
