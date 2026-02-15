"use client"

import useSWR from 'swr'
import { useTenant } from '@/contexts/tenant-context'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

// ============================================================================
// Spine Hooks
// ============================================================================

export interface SpineEntity {
  id: string
  tenant_id: string
  category: string
  scope: Record<string, unknown>
  data: Record<string, unknown>
  relationships: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useSpineEntities(entityType: string, limit = 20) {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ data: SpineEntity[] }>(
    tenant?.id ? `/api/entities/${entityType}?limit=${limit}` : null,
    fetcher
  )
  
  return {
    entities: data?.data || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export function useSpineEntity(entityType: string, id: string | null) {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<SpineEntity>(
    tenant?.id && id ? `/api/entities/${entityType}/${id}` : null,
    fetcher
  )
  
  return {
    entity: data,
    isLoading,
    error,
    refresh: mutate
  }
}

// ============================================================================
// Knowledge Hooks
// ============================================================================

export interface KnowledgeSearchResult {
  id: string
  content: string
  chunk_index: number
  document_id: string
  document_title: string
  similarity: number
  metadata: Record<string, unknown>
}

export interface KnowledgeTopic {
  id: string
  name: string
  description: string
  document_count: number
  last_updated: string
}

export function useKnowledgeSearch(query: string | null) {
  const tenant = useTenant()
  const { data, error, isLoading } = useSWR<{ results: KnowledgeSearchResult[] }>(
    tenant?.id && query ? `/api/search?q=${encodeURIComponent(query)}&type=semantic` : null,
    fetcher
  )
  
  return {
    results: data?.results || [],
    isLoading,
    error
  }
}

export function useKnowledgeTopics() {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ topics: KnowledgeTopic[] }>(
    tenant?.id ? `/api/admin/knowledge?type=topics` : null,
    fetcher
  )
  
  return {
    topics: data?.topics || [],
    isLoading,
    error,
    refresh: mutate
  }
}

// ============================================================================
// Signals / Think Hooks  
// ============================================================================

export interface Signal {
  id: string
  tenant_id: string
  entity_type: string
  entity_id: string
  signal_type: string
  band: 'green' | 'yellow' | 'red'
  score: number
  title: string
  description: string
  evidence: unknown[]
  computed_at: string
}

export interface Situation {
  id: string
  tenant_id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'acknowledged' | 'resolved'
  entity_type: string
  entity_id: string
  signals: string[]
  recommendations: string[]
  created_at: string
  updated_at: string
}

export function useSignals(limit = 20) {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ data: Signal[] }>(
    tenant?.id ? `/api/signals?limit=${limit}` : null,
    fetcher
  )
  
  return {
    signals: data?.data || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export function useSituations(limit = 20) {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ data: Situation[] }>(
    tenant?.id ? `/api/situations?limit=${limit}` : null,
    fetcher
  )
  
  return {
    situations: data?.data || [],
    isLoading,
    error,
    refresh: mutate
  }
}

// ============================================================================
// Evidence / Audit Hooks
// ============================================================================

export interface EvidenceItem {
  id: string
  source: string
  source_type: 'crm' | 'email' | 'meeting' | 'document' | 'api' | 'system'
  entity_type: string
  entity_id: string
  content: string
  confidence: number
  timestamp: string
  link?: string
  metadata: Record<string, unknown>
}

export interface AuditEntry {
  id: string
  tenant_id: string
  action: string
  actor_type: 'user' | 'system' | 'agent'
  actor_id: string
  actor_name?: string
  entity_type?: string
  entity_id?: string
  details: Record<string, unknown>
  created_at: string
}

export function useEvidence(entityType?: string, entityId?: string) {
  const tenant = useTenant()
  const params = new URLSearchParams()
  if (entityType) params.set('entity_type', entityType)
  if (entityId) params.set('entity_id', entityId)
  
  const { data, error, isLoading, mutate } = useSWR<{ evidence: EvidenceItem[] }>(
    tenant?.id ? `/api/evidence/resolve?${params.toString()}` : null,
    fetcher
  )
  
  return {
    evidence: data?.evidence || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export function useAuditLog(limit = 50) {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ logs: AuditEntry[] }>(
    tenant?.id ? `/api/audit?limit=${limit}` : null,
    fetcher
  )
  
  return {
    logs: data?.logs || [],
    isLoading,
    error,
    refresh: mutate
  }
}

// ============================================================================
// IQ / Memory Hooks
// ============================================================================

export interface IQSession {
  id: string
  tenant_id: string
  user_id: string
  title: string
  topic: string
  subtopic?: string
  summary?: string
  decisions: string[]
  insights: string[]
  created_at: string
  updated_at: string
}

export interface MemoryObject {
  id: string
  tenant_id: string
  type: 'preference' | 'decision' | 'commitment' | 'assumption' | 'strategy' | 'learning'
  content: string
  scope: Record<string, unknown>
  status: 'active' | 'superseded' | 'archived'
  confidence: number
  source_session_id?: string
  created_at: string
  expires_at?: string
}

export function useIQSessions(limit = 20) {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ sessions: IQSession[] }>(
    tenant?.id ? `/api/iq/sessions?limit=${limit}` : null,
    fetcher
  )
  
  return {
    sessions: data?.sessions || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export function useMemories(type?: string) {
  const tenant = useTenant()
  const params = type ? `?type=${type}` : ''
  const { data, error, isLoading, mutate } = useSWR<{ memories: MemoryObject[] }>(
    tenant?.id ? `/api/ai/memories${params}` : null,
    fetcher
  )
  
  return {
    memories: data?.memories || [],
    isLoading,
    error,
    refresh: mutate
  }
}

// ============================================================================
// Workflow / Agent Hooks
// ============================================================================

export interface WorkflowRun {
  id: string
  workflow_id: string
  workflow_name: string
  status: 'pending' | 'running' | 'awaiting_approval' | 'completed' | 'failed'
  trigger_type: 'manual' | 'scheduled' | 'signal' | 'agent'
  triggered_by: string
  started_at: string
  completed_at?: string
  output?: Record<string, unknown>
  error?: string
}

export interface AgentRun {
  id: string
  agent_id: string
  agent_name: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  input: Record<string, unknown>
  output?: Record<string, unknown>
  tokens_used?: number
  started_at: string
  completed_at?: string
}

export function useWorkflowRuns(limit = 20) {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ runs: WorkflowRun[] }>(
    tenant?.id ? `/api/act/runs?limit=${limit}` : null,
    fetcher
  )
  
  return {
    runs: data?.runs || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export function useAgentRuns(limit = 20) {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ runs: AgentRun[] }>(
    tenant?.id ? `/api/iq-hub/agents?limit=${limit}` : null,
    fetcher
  )
  
  return {
    runs: data?.runs || [],
    isLoading,
    error,
    refresh: mutate
  }
}

// ============================================================================
// Governance / Approvals Hooks
// ============================================================================

export interface PendingApproval {
  id: string
  instance_id: string
  tenant_id: string
  user_id: string
  type: 'action' | 'insight' | 'alert'
  title: string
  description: string
  action_data: string
  confidence: number
  evidence: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  expires_at?: string
}

export function usePendingApprovals() {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ recommendations: PendingApproval[] }>(
    tenant?.id ? `/api/govern/queue` : null,
    fetcher
  )
  
  return {
    approvals: data?.recommendations || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export async function approveAction(instanceId: string, approved: boolean, comments?: string) {
  const res = await fetch(`/api/govern/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instance_id: instanceId, approved, comments })
  })
  return res.json()
}

// ============================================================================
// Context Hooks
// ============================================================================

export interface ContextItem {
  id: string
  type: 'meeting' | 'email' | 'note' | 'document' | 'entity'
  title: string
  entity_type?: string
  entity_id?: string
  relevance_score: number
  reason: string
  pinned: boolean
  added_at: string
}

export interface ContextPack {
  session_id: string
  workspace_scope: string
  active_entity?: { type: string; id: string; name: string }
  items: ContextItem[]
  updated_at: string
}

export function useContextPack() {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ context: ContextPack }>(
    tenant?.id ? `/api/context/active` : null,
    fetcher
  )

  return {
    contextPack: data?.context,
    isLoading,
    error,
    refresh: mutate
  }
}

export async function updateContextItem(itemId: string, action: 'add' | 'remove' | 'pin' | 'unpin') {
  const res = await fetch(`/api/context/items/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  })
  return res.json()
}

// ============================================================================
// Think Workspace Hooks
// ============================================================================

export interface ThinkProposal {
  id: string
  tenant_id: string
  type: 'summary' | 'plan' | 'strategy' | 'hypothesis' | 'risk_analysis' | 'what_if'
  title: string
  content: string
  entity_type?: string
  entity_id?: string
  evidence_ids: string[]
  confidence: number
  uncertainty?: number
  alternatives?: string[]
  status: 'draft' | 'proposed' | 'accepted' | 'rejected'
  created_at: string
}

export function useThinkProposals(type?: string) {
  const tenant = useTenant()
  const params = type ? `?type=${type}` : ''
  const { data, error, isLoading, mutate } = useSWR<{ proposals: ThinkProposal[] }>(
    tenant?.id ? `/api/think/proposals${params}` : null,
    fetcher
  )

  return {
    proposals: data?.proposals || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export async function createThinkProposal(proposal: Partial<ThinkProposal>) {
  const res = await fetch(`/api/think/proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(proposal)
  })
  return res.json()
}

// ============================================================================
// Policy Hooks
// ============================================================================

export interface PolicyDecision {
  id: string
  rule_id: string
  rule_name: string
  decision: 'allowed' | 'blocked' | 'requires_approval'
  reason: string
  actor_type: 'user' | 'agent' | 'system'
  actor_id: string
  action_type: string
  resource_type?: string
  resource_id?: string
  evaluated_at: string
}

export interface PolicyRule {
  id: string
  name: string
  description: string
  type: 'rbac' | 'cost_cap' | 'rate_limit' | 'data_boundary' | 'tool_restriction'
  scope: Record<string, unknown>
  conditions: Record<string, unknown>
  action: 'allow' | 'deny' | 'require_approval'
  enabled: boolean
  priority: number
}

export function usePolicyDecisions(limit = 20) {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ decisions: PolicyDecision[] }>(
    tenant?.id ? `/api/govern/policy/decisions?limit=${limit}` : null,
    fetcher
  )

  return {
    decisions: data?.decisions || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export function usePolicyRules() {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ rules: PolicyRule[] }>(
    tenant?.id ? `/api/govern/policy/rules` : null,
    fetcher
  )

  return {
    rules: data?.rules || [],
    isLoading,
    error,
    refresh: mutate
  }
}

// ============================================================================
// Corrections Hooks
// ============================================================================

export interface Correction {
  id: string
  tenant_id: string
  user_id: string
  entity_type: string
  entity_id: string
  insight_id: string
  original_value: string
  corrected_value: string
  feedback: string
  status: 'pending' | 'applied' | 'rejected'
  created_at: string
  applied_at?: string
}

export function useCorrections(limit = 20) {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ corrections: Correction[] }>(
    tenant?.id ? `/api/correct?limit=${limit}` : null,
    fetcher
  )

  return {
    corrections: data?.corrections || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export async function submitCorrection(correction: Partial<Correction>) {
  const res = await fetch(`/api/correct`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(correction)
  })
  return res.json()
}

// ============================================================================
// Proactive Twin Hooks
// ============================================================================

export interface Watchlist {
  id: string
  tenant_id: string
  user_id: string
  entity_type: string
  entity_id: string
  watch_type: 'health' | 'activity' | 'metrics' | 'deadlines'
  thresholds: Record<string, unknown>
  last_checked_at: string
  last_alert_at?: string
}

export interface ScheduledCheck {
  id: string
  watchlist_id: string
  scheduled_at: string
  status: 'pending' | 'completed' | 'failed'
  result?: Record<string, unknown>
  alert_generated: boolean
}

export interface Briefing {
  id: string
  tenant_id: string
  user_id: string
  briefing_type: 'daily' | 'weekly'
  title: string
  summary: string
  key_items: string[]
  recommendations: string[]
  evidence_ids: string[]
  generated_at: string
}

export function useWatchlists() {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ watchlists: Watchlist[] }>(
    tenant?.id ? `/api/twin/watchlists` : null,
    fetcher
  )

  return {
    watchlists: data?.watchlists || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export function useScheduledChecks(limit = 20) {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ checks: ScheduledCheck[] }>(
    tenant?.id ? `/api/twin/checks?limit=${limit}` : null,
    fetcher
  )

  return {
    checks: data?.checks || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export function useBriefings(limit = 10) {
  const tenant = useTenant()
  const { data, error, isLoading, mutate } = useSWR<{ briefings: Briefing[] }>(
    tenant?.id ? `/api/twin/briefings?limit=${limit}` : null,
    fetcher
  )

  return {
    briefings: data?.briefings || [],
    isLoading,
    error,
    refresh: mutate
  }
}

export async function createWatchlist(watchlist: Partial<Watchlist>) {
  const res = await fetch(`/api/twin/watchlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(watchlist)
  })
  return res.json()
}
