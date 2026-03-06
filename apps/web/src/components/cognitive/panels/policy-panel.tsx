"use client"

/**
 * L2 Policy Panel (RBAC + Guardrails)
 * Makes policy visible and enforceable
 * 
 * Contains:
 * - RBAC scope decisions (allowed/blocked)
 * - Tool restrictions per role/agent
 * - Cost caps / rate limits / quotas
 * - Data boundary rules (tenant/org isolation)
 * - "Policy explanation": which rule triggered
 * 
 * Rule: Every action must show policy result before execution.
 */

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Shield, Lock, Unlock, AlertTriangle, CheckCircle,
  XCircle, RefreshCw, ChevronRight, Users, Bot,
  DollarSign, Clock, Database, Eye
} from 'lucide-react'
import { apiFetch } from '@/lib/api-client'

interface PanelProps {
  entityId?: string
  entityType?: string
}

interface PolicyDecision {
  id: string
  ruleName: string
  ruleType: 'rbac' | 'cost_cap' | 'rate_limit' | 'data_boundary' | 'tool_restriction'
  decision: 'allowed' | 'blocked' | 'requires_approval'
  actorType: 'user' | 'agent' | 'system'
  actorId: string
  actorName: string
  actionType: string
  resource?: string
  reason: string
  evaluatedAt: string
}

interface PolicyRule {
  id: string
  name: string
  description: string
  type: 'rbac' | 'cost_cap' | 'rate_limit' | 'data_boundary' | 'tool_restriction'
  scope: string
  action: 'allow' | 'deny' | 'require_approval'
  enabled: boolean
  priority: number
}

const RULE_ICONS = {
  rbac: Users,
  cost_cap: DollarSign,
  rate_limit: Clock,
  data_boundary: Database,
  tool_restriction: Lock,
}

const DECISION_STYLES = {
  allowed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  blocked: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  requires_approval: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
}

// ── Static fallback data (used when API unavailable) ────────────────────────
const FALLBACK_DECISIONS: PolicyDecision[] = [
    {
      id: '1',
      ruleName: 'Sales Agent Write Access',
      ruleType: 'rbac',
      decision: 'allowed',
      actorType: 'agent',
      actorId: 'agent-sales-001',
      actorName: 'Sales Assistant',
      actionType: 'update_deal',
      resource: 'Deal: Acme Contract',
      reason: 'Agent has "sales:deals:write" permission in current tenant scope',
      evaluatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      ruleName: 'API Call Rate Limit',
      ruleType: 'rate_limit',
      decision: 'blocked',
      actorType: 'agent',
      actorId: 'agent-research-002',
      actorName: 'Research Agent',
      actionType: 'external_api_call',
      resource: 'LinkedIn API',
      reason: 'Rate limit exceeded: 100 calls/hour (current: 112)',
      evaluatedAt: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: '3',
      ruleName: 'PII Data Access',
      ruleType: 'data_boundary',
      decision: 'requires_approval',
      actorType: 'user',
      actorId: 'user-123',
      actorName: 'John Smith',
      actionType: 'export_contacts',
      resource: 'Contact list (1,234 records)',
      reason: 'Export contains PII data, requires manager approval',
      evaluatedAt: new Date(Date.now() - 120000).toISOString(),
    },
    {
      id: '4',
      ruleName: 'Monthly API Cost Cap',
      ruleType: 'cost_cap',
      decision: 'allowed',
      actorType: 'system',
      actorId: 'system',
      actorName: 'System',
      actionType: 'openai_api_call',
      resource: 'GPT-4 Turbo',
      reason: 'Within budget: $847/$1,000 monthly cap (84.7%)',
      evaluatedAt: new Date(Date.now() - 180000).toISOString(),
    },
];

const FALLBACK_RULES: PolicyRule[] = [
    {
      id: '1',
      name: 'Agent Write Permissions',
      description: 'Agents can only modify entities within their assigned scope',
      type: 'rbac',
      scope: 'All agents',
      action: 'allow',
      enabled: true,
      priority: 1,
    },
    {
      id: '2',
      name: 'API Rate Limiting',
      description: 'Limit external API calls to prevent abuse',
      type: 'rate_limit',
      scope: 'All external APIs',
      action: 'deny',
      enabled: true,
      priority: 2,
    },
    {
      id: '3',
      name: 'PII Export Approval',
      description: 'Require approval for exporting personally identifiable information',
      type: 'data_boundary',
      scope: 'Contact/Person data',
      action: 'require_approval',
      enabled: true,
      priority: 1,
    },
    {
      id: '4',
      name: 'Monthly AI Cost Cap',
      description: 'Cap AI API spend at $1,000/month',
      type: 'cost_cap',
      scope: 'OpenAI, Anthropic APIs',
      action: 'deny',
      enabled: true,
      priority: 1,
    },
    {
      id: '5',
      name: 'Code Execution Restriction',
      description: 'Block agents from executing arbitrary code',
      type: 'tool_restriction',
      scope: 'All agents',
      action: 'deny',
      enabled: true,
      priority: 1,
    },
];

export function PolicyPanel({ entityType, entityId }: PanelProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState<'decisions' | 'rules'>('decisions')
  const [decisions, setDecisions] = useState<PolicyDecision[]>(FALLBACK_DECISIONS)
  const [rules, setRules] = useState<PolicyRule[]>(FALLBACK_RULES)

  // Fetch live policy data from Gateway → Govern service
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const [decisionsData, rulesData] = await Promise.all([
          apiFetch<PolicyDecision[]>('/api/v1/cognitive/govern/decisions', {}, 'PolicyDecisions').catch(() => null),
          apiFetch<PolicyRule[]>('/api/v1/cognitive/govern/policies', {}, 'PolicyRules').catch(() => null),
        ]);
        if (cancelled) return;
        if (Array.isArray(decisionsData) && decisionsData.length > 0) setDecisions(decisionsData);
        if (Array.isArray(rulesData) && rulesData.length > 0) setRules(rulesData);
      } catch (err) {
        console.warn('[PolicyPanel] API unavailable, using fallback data');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    return `${Math.floor(diff / 3600000)}h ago`
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="p-3 border rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
        <h3 className="font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-600" />
          Policy Panel
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          RBAC + Guardrails — every action shows policy result
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-3 border rounded-lg text-center">
          <div className="text-xl font-bold text-green-600">
            {decisions.filter(d => d.decision === 'allowed').length}
          </div>
          <div className="text-xs text-muted-foreground">Allowed</div>
        </div>
        <div className="p-3 border rounded-lg text-center">
          <div className="text-xl font-bold text-red-600">
            {decisions.filter(d => d.decision === 'blocked').length}
          </div>
          <div className="text-xs text-muted-foreground">Blocked</div>
        </div>
        <div className="p-3 border rounded-lg text-center">
          <div className="text-xl font-bold text-yellow-600">
            {decisions.filter(d => d.decision === 'requires_approval').length}
          </div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
        <div className="p-3 border rounded-lg text-center">
          <div className="text-xl font-bold text-blue-600">
            {rules.filter(r => r.enabled).length}
          </div>
          <div className="text-xs text-muted-foreground">Active Rules</div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={activeView === 'decisions' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('decisions')}
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-2" />
          Recent Decisions
        </Button>
        <Button
          variant={activeView === 'rules' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('rules')}
          className="flex-1"
        >
          <Lock className="h-4 w-4 mr-2" />
          Policy Rules
        </Button>
      </div>

      {/* Decisions List */}
      {activeView === 'decisions' && (
        <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))
          ) : decisions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No policy decisions recorded
            </div>
          ) : (
            decisions.map((decision) => {
              const RuleIcon = RULE_ICONS[decision.ruleType]
              const style = DECISION_STYLES[decision.decision]
              const DecisionIcon = style.icon

              return (
                <div key={decision.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${style.bg}`}>
                        <DecisionIcon className={`h-4 w-4 ${style.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{decision.actionType}</p>
                        <p className="text-xs text-muted-foreground">
                          by {decision.actorName} ({decision.actorType})
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={decision.decision === 'allowed' ? 'default' : 
                               decision.decision === 'blocked' ? 'destructive' : 'secondary'}
                    >
                      {decision.decision.replace('_', ' ')}
                    </Badge>
                  </div>

                  {decision.resource && (
                    <p className="text-xs text-muted-foreground pl-8">
                      Resource: {decision.resource}
                    </p>
                  )}

                  {/* Policy Explanation */}
                  <div className="p-2 rounded bg-muted/50 text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <RuleIcon className="h-3 w-3" />
                      <span className="font-medium">{decision.ruleName}</span>
                    </div>
                    <p className="text-muted-foreground">{decision.reason}</p>
                  </div>

                  <p className="text-xs text-muted-foreground text-right">
                    {formatTime(decision.evaluatedAt)}
                  </p>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Rules List */}
      {activeView === 'rules' && (
        <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
          {rules.map((rule) => {
            const RuleIcon = RULE_ICONS[rule.type]
            return (
              <div key={rule.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <RuleIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{rule.name}</p>
                      <p className="text-xs text-muted-foreground">{rule.description}</p>
                    </div>
                  </div>
                  <Badge variant={rule.enabled ? 'default' : 'outline'}>
                    {rule.enabled ? 'Active' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pl-6">
                  <span>Scope: {rule.scope}</span>
                  <span>Action: {rule.action}</span>
                  <span>Priority: {rule.priority}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <div className="text-xs text-muted-foreground text-center p-2 border-t">
        Rule: Every action must show policy result before execution
      </div>
    </div>
  )
}
