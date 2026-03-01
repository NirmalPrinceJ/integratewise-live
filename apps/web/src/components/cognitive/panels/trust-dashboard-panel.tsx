"use client"

/**
 * L2 Trust Dashboard Panel
 * Source reliability, trust scores, autonomy levels
 */

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Shield, ShieldCheck, ShieldAlert, ShieldOff,
  Database, RefreshCw, TrendingUp, TrendingDown,
  AlertTriangle, Settings, ChevronRight, Lock
} from 'lucide-react'

interface PanelProps {
  entityId?: string
  entityType?: string
  tenantId?: string
}

interface SourceReliability {
  id: string
  sourceName: string
  sourceType: 'crm' | 'support' | 'marketing' | 'product' | 'finance' | 'manual'
  reliabilityScore: number
  accuracyTrend: 'up' | 'down' | 'stable'
  sampleSize: number
  lastSync: string
  status: 'active' | 'degraded' | 'offline'
}

interface TrustScore {
  entityName: string
  entityType: string
  compositeScore: number
  components: {
    dataFreshness: number
    signalAccuracy: number
    sourceReliability: number
    predictionAccuracy: number
    dataCompleteness: number
    humanFeedback: number
  }
  effectiveAutonomy: number
  overrideActive: boolean
}

interface AutonomyOverride {
  id: string
  level: 'global' | 'entity_type' | 'entity'
  reason: string
  maxAutonomy: number
  expiresAt: string | null
  createdBy: string
}

const MOCK_SOURCES: SourceReliability[] = [
  { id: '1', sourceName: 'Salesforce', sourceType: 'crm', reliabilityScore: 0.94, accuracyTrend: 'stable', sampleSize: 1250, lastSync: '2 min ago', status: 'active' },
  { id: '2', sourceName: 'Zendesk', sourceType: 'support', reliabilityScore: 0.87, accuracyTrend: 'up', sampleSize: 890, lastSync: '5 min ago', status: 'active' },
  { id: '3', sourceName: 'Mixpanel', sourceType: 'product', reliabilityScore: 0.91, accuracyTrend: 'stable', sampleSize: 2100, lastSync: '15 min ago', status: 'active' },
  { id: '4', sourceName: 'Stripe', sourceType: 'finance', reliabilityScore: 0.98, accuracyTrend: 'stable', sampleSize: 450, lastSync: '1 hr ago', status: 'active' },
  { id: '5', sourceName: 'HubSpot', sourceType: 'marketing', reliabilityScore: 0.72, accuracyTrend: 'down', sampleSize: 320, lastSync: '3 hr ago', status: 'degraded' }
]

const MOCK_TRUST_SCORE: TrustScore = {
  entityName: 'Acme Corp',
  entityType: 'account',
  compositeScore: 0.84,
  components: {
    dataFreshness: 0.92,
    signalAccuracy: 0.81,
    sourceReliability: 0.88,
    predictionAccuracy: 0.76,
    dataCompleteness: 0.85,
    humanFeedback: 0.82
  },
  effectiveAutonomy: 2,
  overrideActive: false
}

const MOCK_OVERRIDES: AutonomyOverride[] = [
  { id: '1', level: 'global', reason: 'Q4 freeze - manual approval required', maxAutonomy: 1, expiresAt: '2026-02-15', createdBy: 'admin@company.com' }
]

const sourceTypeIcon = {
  crm: '💼',
  support: '🎧',
  marketing: '📣',
  product: '📊',
  finance: '💰',
  manual: '✏️'
}

const statusColor = {
  active: 'text-green-500',
  degraded: 'text-yellow-500',
  offline: 'text-red-500'
}

export function TrustDashboardPanel({ entityType, entityId }: PanelProps) {
  const [isLoading] = useState(false)
  const [sources] = useState<SourceReliability[]>(MOCK_SOURCES)
  const [trustScore] = useState<TrustScore>(MOCK_TRUST_SCORE)
  const [overrides] = useState<AutonomyOverride[]>(MOCK_OVERRIDES)
  const [activeTab, setActiveTab] = useState<'trust' | 'sources' | 'autonomy'>('trust')

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="p-3 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <h3 className="font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Trust Dashboard
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Source reliability & autonomy control (Clause 2, 5)
        </p>
      </div>

      {/* Overall Trust Score */}
      <div className="p-4 border rounded-lg bg-gradient-to-br from-background to-muted/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Composite Trust Score</span>
          <Badge variant={trustScore.compositeScore > 0.8 ? 'default' : 'secondary'}>
            {trustScore.overrideActive && <Lock className="h-3 w-3 mr-1" />}
            L{trustScore.effectiveAutonomy} Autonomy
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-green-600">
            {Math.round(trustScore.compositeScore * 100)}%
          </div>
          <Progress value={trustScore.compositeScore * 100} className="flex-1 h-3" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('trust')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'trust' ? 'border-green-500 text-green-600' : 'border-transparent text-muted-foreground'
          }`}
        >
          Trust Components
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'sources' ? 'border-green-500 text-green-600' : 'border-transparent text-muted-foreground'
          }`}
        >
          Sources
        </button>
        <button
          onClick={() => setActiveTab('autonomy')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'autonomy' ? 'border-green-500 text-green-600' : 'border-transparent text-muted-foreground'
          }`}
        >
          Overrides
        </button>
      </div>

      {activeTab === 'trust' && (
        <div className="space-y-3">
          {Object.entries(trustScore.components).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-32 text-sm text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <Progress value={value * 100} className="flex-1 h-2" />
              <div className="w-12 text-sm text-right font-medium">
                {Math.round(value * 100)}%
              </div>
            </div>
          ))}

          {/* Weights Explanation */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            <div className="font-medium mb-1">Trust Formula (Clause 2)</div>
            <code>
              composite = (freshness × 0.2) + (accuracy × 0.25) + (reliability × 0.2) + 
              (prediction × 0.15) + (completeness × 0.1) + (feedback × 0.1)
            </code>
          </div>
        </div>
      )}

      {activeTab === 'sources' && (
        <ScrollArea className="h-[350px]">
          <div className="space-y-2">
            {sources.map((source) => (
              <div
                key={source.id}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sourceTypeIcon[source.sourceType]}</span>
                    <div>
                      <div className="font-medium text-sm">{source.sourceName}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {source.sourceType} • {source.lastSync}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${source.reliabilityScore > 0.85 ? 'text-green-600' : source.reliabilityScore > 0.7 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {Math.round(source.reliabilityScore * 100)}%
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${statusColor[source.status]}`}>
                      {source.accuracyTrend === 'up' && <TrendingUp className="h-3 w-3" />}
                      {source.accuracyTrend === 'down' && <TrendingDown className="h-3 w-3" />}
                      {source.status}
                    </div>
                  </div>
                </div>
                <Progress value={source.reliabilityScore * 100} className="mt-2 h-1" />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {activeTab === 'autonomy' && (
        <div className="space-y-4">
          {/* Autonomy Levels Explanation */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="p-2 border rounded text-center">
              <div className="font-bold">L0</div>
              <div className="text-muted-foreground">Suggest Only</div>
            </div>
            <div className="p-2 border rounded text-center">
              <div className="font-bold">L1</div>
              <div className="text-muted-foreground">Draft Actions</div>
            </div>
            <div className="p-2 border rounded text-center bg-green-50 dark:bg-green-900/20 border-green-300">
              <div className="font-bold text-green-600">L2</div>
              <div className="text-muted-foreground">Auto Low-Risk</div>
            </div>
            <div className="p-2 border rounded text-center">
              <div className="font-bold">L3</div>
              <div className="text-muted-foreground">Full Auto</div>
            </div>
          </div>

          {/* Active Overrides (Clause 5) */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Active Overrides (Clause 5 Kill Hierarchy)
            </h4>
            {overrides.length > 0 ? (
              <div className="space-y-2">
                {overrides.map((override) => (
                  <div key={override.id} className="p-3 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="capitalize">
                          {override.level.replace(/_/g, ' ')}
                        </Badge>
                        <span className="ml-2 text-sm">{override.reason}</span>
                      </div>
                      <Badge className="bg-red-100 text-red-700">
                        Max L{override.maxAutonomy}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      By: {override.createdBy} • 
                      {override.expiresAt ? ` Expires: ${override.expiresAt}` : ' No expiry'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border rounded-lg text-center text-muted-foreground">
                <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-green-500" />
                No active overrides
              </div>
            )}
          </div>

          <Button variant="outline" className="w-full" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage Autonomy Rules
          </Button>
        </div>
      )}
    </div>
  )
}
