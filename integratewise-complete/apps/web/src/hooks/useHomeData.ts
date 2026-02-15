"use client"

/**
 * useHomeData Hook
 * 
 * Aggregates data from multiple L3 services for the Home Skeleton:
 * - Today's schedule (meetings, tasks due, follow-ups)
 * - Signal feed (risks, opportunities, actions)
 * - Work queue (pending tasks, approvals, drafts)
 * - Recent knowledge (documents, notes)
 * - Connector suggestions
 */

import useSWR from 'swr'
import { useTenant } from '@/contexts/tenant-context'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

// ============================================================================
// Types
// ============================================================================

export interface TodayStats {
  meetings: number
  tasksDue: number
  followUps: number
  date: string
}

export interface SignalItem {
  id: string
  type: 'risk' | 'opportunity' | 'action'
  text: string
  time: string
  entityId?: string
  entityType?: string
  band?: 'red' | 'yellow' | 'green'
}

export interface WorkQueueItem {
  id: string
  type: 'task' | 'approval' | 'draft'
  text: string
  priority: 'high' | 'medium' | 'low'
  entityId?: string
  entityType?: string
}

export interface KnowledgeItem {
  id: string
  name: string
  type: 'presentation' | 'doc' | 'notes' | 'email'
  time: string
  url?: string
}

export interface ConnectorSuggestion {
  tool: string
  icon: string
  benefit: string
  connected: boolean
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useHomeData() {
  const tenant = useTenant()
  
  // Fetch today's stats (calendar + tasks)
  const { data: todayData, isLoading: todayLoading } = useSWR<{
    meetings: number
    tasks_due: number
    follow_ups: number
  }>(
    tenant?.id ? `/api/today/stats` : null,
    fetcher,
    { refreshInterval: 60000 } // Refresh every minute
  )
  
  // Fetch signals
  const { data: signalsData, isLoading: signalsLoading } = useSWR<{
    data: Array<{
      id: string
      signal_type: string
      band: string
      title: string
      entity_type: string
      entity_id: string
      computed_at: string
    }>
  }>(
    tenant?.id ? `/api/signals?limit=5` : null,
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30 seconds
  )
  
  // Fetch work queue (tasks + pending approvals)
  const { data: workQueueData, isLoading: workQueueLoading } = useSWR<{
    tasks: Array<{
      id: string
      data: { title: string; priority: string }
      category: string
    }>
    approvals: Array<{
      id: string
      title: string
      type: string
    }>
  }>(
    tenant?.id ? `/api/work-queue` : null,
    fetcher
  )
  
  // Fetch recent knowledge
  const { data: knowledgeData, isLoading: knowledgeLoading } = useSWR<{
    documents: Array<{
      id: string
      title: string
      type: string
      created_at: string
      url?: string
    }>
  }>(
    tenant?.id ? `/api/knowledge/recent?limit=3` : null,
    fetcher
  )
  
  // Fetch connector status
  const { data: connectorsData, isLoading: connectorsLoading } = useSWR<{
    connected: string[]
    suggestions: Array<{
      tool: string
      icon: string
      benefit: string
    }>
  }>(
    tenant?.id ? `/api/connectors/suggestions` : null,
    fetcher
  )
  
  // Transform data
  const today: TodayStats = {
    meetings: todayData?.meetings ?? 0,
    tasksDue: todayData?.tasks_due ?? 0,
    followUps: todayData?.follow_ups ?? 0,
    date: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  const signals: SignalItem[] = (signalsData?.data || []).map(s => ({
    id: s.id,
    type: mapSignalType(s.signal_type, s.band),
    text: s.title,
    time: formatRelativeTime(s.computed_at),
    entityId: s.entity_id,
    entityType: s.entity_type,
    band: s.band as 'red' | 'yellow' | 'green'
  }))
  
  const workQueue: WorkQueueItem[] = [
    ...(workQueueData?.tasks || []).map(t => ({
      id: t.id,
      type: 'task' as const,
      text: t.data?.title || 'Untitled Task',
      priority: mapPriority(t.data?.priority),
      entityId: t.id,
      entityType: 'task'
    })),
    ...(workQueueData?.approvals || []).map(a => ({
      id: a.id,
      type: 'approval' as const,
      text: a.title,
      priority: 'high' as const,
      entityId: a.id,
      entityType: 'approval'
    }))
  ].slice(0, 5)
  
  const recentKnowledge: KnowledgeItem[] = (knowledgeData?.documents || []).map(d => ({
    id: d.id,
    name: d.title,
    type: mapDocType(d.type),
    time: formatRelativeTime(d.created_at),
    url: d.url
  }))
  
  const connectorSuggestions: ConnectorSuggestion[] = (connectorsData?.suggestions || [
    { tool: 'Slack', icon: '💬', benefit: 'See team activity & mentions' },
    { tool: 'Calendar', icon: '📅', benefit: 'Auto-prepare for meetings' },
    { tool: 'HubSpot', icon: '🔗', benefit: 'Sync customer data' },
  ]).map(s => ({
    ...s,
    connected: connectorsData?.connected?.includes(s.tool.toLowerCase()) || false
  }))
  
  const isLoading = todayLoading || signalsLoading || workQueueLoading || knowledgeLoading || connectorsLoading
  
  return {
    today,
    signals,
    workQueue,
    recentKnowledge,
    connectorSuggestions,
    isLoading,
    isEmpty: !isLoading && signals.length === 0 && workQueue.length === 0
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function mapSignalType(signalType: string, band: string): 'risk' | 'opportunity' | 'action' {
  if (band === 'red' || signalType.includes('risk') || signalType.includes('churn')) {
    return 'risk'
  }
  if (band === 'green' || signalType.includes('expansion') || signalType.includes('opportunity')) {
    return 'opportunity'
  }
  return 'action'
}

function mapPriority(priority?: string): 'high' | 'medium' | 'low' {
  if (!priority) return 'medium'
  const p = priority.toLowerCase()
  if (p === 'high' || p === 'urgent' || p === 'critical') return 'high'
  if (p === 'low' || p === 'minor') return 'low'
  return 'medium'
}

function mapDocType(type?: string): 'presentation' | 'doc' | 'notes' | 'email' {
  if (!type) return 'doc'
  const t = type.toLowerCase()
  if (t.includes('presentation') || t.includes('slide') || t.includes('deck')) return 'presentation'
  if (t.includes('note') || t.includes('meeting')) return 'notes'
  if (t.includes('email')) return 'email'
  return 'doc'
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return 'recently'
  }
}

// ============================================================================
// Additional Hooks for Specific Blocks
// ============================================================================

/**
 * Hook for just today's calendar/task stats
 */
export function useTodayStats() {
  const tenant = useTenant()
  const { data, isLoading, error, mutate } = useSWR<{
    meetings: number
    tasks_due: number
    follow_ups: number
    next_meeting?: {
      id: string
      title: string
      starts_at: string
      attendees: string[]
    }
  }>(
    tenant?.id ? `/api/today/stats` : null,
    fetcher,
    { refreshInterval: 60000 }
  )
  
  return {
    stats: data,
    isLoading,
    error,
    refresh: mutate
  }
}

/**
 * Hook for connected tools status
 */
export function useConnectorStatus() {
  const tenant = useTenant()
  const { data, isLoading, error, mutate } = useSWR<{
    connected: Array<{
      id: string
      name: string
      type: string
      status: 'active' | 'error' | 'syncing'
      last_sync: string
    }>
    available: Array<{
      id: string
      name: string
      icon: string
      description: string
    }>
  }>(
    tenant?.id ? `/api/connectors` : null,
    fetcher
  )
  
  return {
    connected: data?.connected || [],
    available: data?.available || [],
    isLoading,
    error,
    refresh: mutate
  }
}
