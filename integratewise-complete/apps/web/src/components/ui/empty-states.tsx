/**
 * Empty States
 * Meaningful empty state components for all views
 * Day 4: UI Polish + Integration
 */

"use client"

import { 
  Inbox, 
  Users, 
  Building2, 
  Briefcase, 
  Ticket, 
  Bell, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Search, 
  Filter, 
  Zap, 
  Brain, 
  Shield, 
  BarChart3, 
  MessageSquare,
  Target,
  CalendarDays,
  TrendingUp,
  Link2,
  Settings
} from "lucide-react"
import React from "react"

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

// Base empty state component
export function EmptyState({ 
  icon: Icon = Inbox, 
  title, 
  description, 
  action,
  secondaryAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      <div className="flex items-center gap-3">
        {action && (
          <button
            onClick={action.onClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              action.variant === 'secondary'
                ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                : 'bg-[#2D7A3E] text-white hover:bg-[#236B32]'
            }`}
          >
            {action.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  )
}

// Entity-specific empty states
export function NoAccountsEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={Building2}
      title="No accounts yet"
      description="Accounts are companies you do business with. Add your first account to start tracking relationships, signals, and opportunities."
      action={{ label: "Add Account", onClick: onAdd }}
    />
  )
}

export function NoContactsEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No contacts yet"
      description="Contacts are people at your accounts. Add contacts to track interactions, decisions, and buying committees."
      action={{ label: "Add Contact", onClick: onAdd }}
    />
  )
}

export function NoDealsEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={Briefcase}
      title="No deals in pipeline"
      description="Deals track your opportunities from qualification to close. Create your first deal to start managing your pipeline."
      action={{ label: "Create Deal", onClick: onAdd }}
    />
  )
}

export function NoTicketsEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={Ticket}
      title="No support tickets"
      description="Tickets track customer issues and requests. When customers need help, tickets will appear here for AI-assisted resolution."
      action={{ label: "Create Ticket", onClick: onAdd }}
    />
  )
}

// Signal-related empty states
export function NoSignalsEmpty({ onConfigureRules }: { onConfigureRules?: () => void }) {
  return (
    <EmptyState
      icon={Zap}
      title="No signals detected"
      description="Signals surface important changes in your data. Connect your integrations and configure signal rules to start detecting opportunities."
      action={onConfigureRules ? { label: "Configure Rules", onClick: onConfigureRules } : undefined}
    />
  )
}

export function NoSituationsEmpty({ onLearnMore }: { onLearnMore?: () => void }) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="No active situations"
      description="Situations are clusters of related signals that need attention. When multiple signals align, they'll be grouped into situations for easier action."
      action={onLearnMore ? { label: "Learn More", onClick: onLearnMore, variant: 'secondary' } : undefined}
    />
  )
}

// Action & Approval empty states
export function NoPendingApprovalsEmpty() {
  return (
    <EmptyState
      icon={CheckCircle2}
      title="All caught up!"
      description="No actions are waiting for your approval. The AI will propose new actions as signals come in."
    />
  )
}

export function NoExecutionsEmpty() {
  return (
    <EmptyState
      icon={Clock}
      title="No recent executions"
      description="When you approve actions, they'll be executed and logged here. You can track progress, view results, and retry failed actions."
    />
  )
}

export function NoActHistoryEmpty({ onExploreSignals }: { onExploreSignals?: () => void }) {
  return (
    <EmptyState
      icon={Activity}
      title="No action history yet"
      description="As the AI executes approved actions, they'll appear here. You can review outcomes, analyze performance, and retry failed actions."
      action={onExploreSignals ? { label: "Explore Signals", onClick: onExploreSignals } : undefined}
    />
  )
}

// AI & Insight empty states
export function NoAIMemoriesEmpty() {
  return (
    <EmptyState
      icon={Brain}
      title="No AI memories yet"
      description="As the AI interacts with this entity, it builds memory of context, preferences, and learnings that inform future recommendations."
    />
  )
}

export function NoInsightsEmpty() {
  return (
    <EmptyState
      icon={TrendingUp}
      title="Not enough data for insights"
      description="Insights are generated from patterns in your data. Keep using the system and insights will emerge as data accumulates."
    />
  )
}

// Governance empty states
export function NoPoliciesEmpty({ onCreatePolicy }: { onCreatePolicy: () => void }) {
  return (
    <EmptyState
      icon={Shield}
      title="No policies configured"
      description="Policies define guardrails for AI actions. Set up policies to control approval thresholds, spending limits, and escalation rules."
      action={{ label: "Create Policy", onClick: onCreatePolicy }}
    />
  )
}

export function NoAuditLogsEmpty() {
  return (
    <EmptyState
      icon={FileText}
      title="No audit logs yet"
      description="All system actions are logged here for compliance and debugging. Logs will appear as the AI starts processing signals and executing actions."
    />
  )
}

// Search & Filter empty states
export function NoSearchResultsEmpty({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or removing some filters to see more results."
      action={{ label: "Clear Search", onClick: onClear, variant: 'secondary' }}
    />
  )
}

export function NoFilteredResultsEmpty({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <EmptyState
      icon={Filter}
      title="No matches for current filters"
      description="Your filter combination returned no results. Try removing some filters to see more data."
      action={{ label: "Clear Filters", onClick: onClearFilters, variant: 'secondary' }}
    />
  )
}

// Timeline empty states
export function NoTimelineEventsEmpty() {
  return (
    <EmptyState
      icon={CalendarDays}
      title="No timeline activity"
      description="Activity, signals, and actions related to this entity will be displayed on this timeline as they occur."
    />
  )
}

// Integration empty states
export function NoIntegrationsEmpty({ onAddIntegration }: { onAddIntegration: () => void }) {
  return (
    <EmptyState
      icon={Link2}
      title="No integrations connected"
      description="Connect your tools to sync data and enable AI-powered automation. Integrations are the foundation of intelligent signal detection."
      action={{ label: "Add Integration", onClick: onAddIntegration }}
    />
  )
}

// Notification empty states
export function NoNotificationsEmpty() {
  return (
    <EmptyState
      icon={Bell}
      title="No notifications"
      description="You're all caught up! Notifications about signals, approvals, and important updates will appear here."
    />
  )
}

// Dashboard-specific empty states
export function NoDashboardDataEmpty({ onConnect }: { onConnect?: () => void }) {
  return (
    <EmptyState
      icon={BarChart3}
      title="No data to display"
      description="Connect your integrations and import your data to see insights, metrics, and AI-powered recommendations on this dashboard."
      action={onConnect ? { label: "Connect Data", onClick: onConnect } : undefined}
    />
  )
}

// Conversation empty states
export function NoConversationsEmpty() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No conversations yet"
      description="Conversations with the AI assistant will be saved here. Start a conversation to get help with your data and decisions."
    />
  )
}

// Goals empty states
export function NoGoalsEmpty({ onCreateGoal }: { onCreateGoal: () => void }) {
  return (
    <EmptyState
      icon={Target}
      title="No goals set"
      description="Goals define what you're trying to achieve. Set goals to help the AI prioritize signals and recommend actions that move you forward."
      action={{ label: "Set a Goal", onClick: onCreateGoal }}
    />
  )
}

// Settings empty state
export function NoCustomSettingsEmpty({ onConfigure }: { onConfigure: () => void }) {
  return (
    <EmptyState
      icon={Settings}
      title="Using default settings"
      description="You're currently using the default configuration. Customize settings to tailor the system to your workflow."
      action={{ label: "Customize", onClick: onConfigure, variant: 'secondary' }}
    />
  )
}

export default {
  EmptyState,
  NoAccountsEmpty,
  NoContactsEmpty,
  NoDealsEmpty,
  NoTicketsEmpty,
  NoSignalsEmpty,
  NoSituationsEmpty,
  NoPendingApprovalsEmpty,
  NoExecutionsEmpty,
  NoActHistoryEmpty,
  NoAIMemoriesEmpty,
  NoInsightsEmpty,
  NoPoliciesEmpty,
  NoAuditLogsEmpty,
  NoSearchResultsEmpty,
  NoFilteredResultsEmpty,
  NoTimelineEventsEmpty,
  NoIntegrationsEmpty,
  NoNotificationsEmpty,
  NoDashboardDataEmpty,
  NoConversationsEmpty,
  NoGoalsEmpty,
  NoCustomSettingsEmpty
}
