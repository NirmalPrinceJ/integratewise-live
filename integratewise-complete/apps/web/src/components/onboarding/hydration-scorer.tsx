"use client"

/**
 * L0.5 Hydration Scorer Component
 * Computes hydration level per bucket during onboarding
 * Updates Feature Bag entitlements based on connected tools + data
 */

import { useEffect, useState, useCallback } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle2, Loader2, Database, FileText, Brain,
    Link2, BarChart3, Shield, Zap, User
} from "lucide-react"
import type { HydrationBucket, TenantBucketStatus, TenantHydrationMetrics } from "@/types/hydration-buckets"
import { calculateBucketStatus, HYDRATION_BUCKETS } from "@/types/hydration-buckets"

interface HydrationScorerProps {
    tenantId: string
    connectedTools: string[]
    onComplete: (bucketStatus: TenantBucketStatus) => void
}

const BUCKET_ICONS: Record<HydrationBucket, React.ElementType> = {
    'B0': User,
    'B1': Database,
    'B2': FileText,
    'B3': Brain,
    'B4': Link2,
    'B5': BarChart3,
    'B6': Shield,
    'B7': Zap,
}

const BUCKET_COLORS: Record<HydrationBucket, string> = {
    'B0': 'text-slate-500',
    'B1': 'text-blue-500',
    'B2': 'text-purple-500',
    'B3': 'text-indigo-500',
    'B4': 'text-green-500',
    'B5': 'text-amber-500',
    'B6': 'text-rose-500',
    'B7': 'text-cyan-500',
}

export function HydrationScorer({ tenantId, connectedTools, onComplete }: HydrationScorerProps) {
    const [isScoring, setIsScoring] = useState(true)
    const [currentBucket, setCurrentBucket] = useState<HydrationBucket>('B0')
    const [bucketStatus, setBucketStatus] = useState<TenantBucketStatus | null>(null)
    const [metrics, setMetrics] = useState<TenantHydrationMetrics | null>(null)

    // Fetch metrics from backend and calculate bucket status
    const calculateScore = useCallback(async () => {
        setIsScoring(true)

        try {
            // Fetch current hydration metrics from API
            const response = await fetch(`/api/hydration/metrics?tenant_id=${tenantId}`)
            let hydrationMetrics: TenantHydrationMetrics

            if (response.ok) {
                hydrationMetrics = await response.json()
            } else {
                // Estimate metrics from connected tools if API not available
                hydrationMetrics = estimateMetricsFromTools(connectedTools)
            }

            setMetrics(hydrationMetrics)

            // Animate through buckets
            for (const bucket of HYDRATION_BUCKETS) {
                setCurrentBucket(bucket.id)
                await new Promise(resolve => setTimeout(resolve, 400))
            }

            // Calculate final status
            const status = calculateBucketStatus(tenantId, hydrationMetrics)
            setBucketStatus(status)

            // Small delay before completing
            await new Promise(resolve => setTimeout(resolve, 500))
            onComplete(status)

        } catch (error) {
            console.error('Hydration scoring failed:', error)
            // Fallback to B0 only
            const fallbackMetrics: TenantHydrationMetrics = {
                users: 1,
                entities: 0,
                documents: 0,
                embeddings: 0,
                tools: 0,
                synced_entities: 0,
                accounts: 0,
                policies: 0,
                governance_enabled: false,
                automation_enabled: false,
            }
            const status = calculateBucketStatus(tenantId, fallbackMetrics)
            setBucketStatus(status)
            onComplete(status)
        } finally {
            setIsScoring(false)
        }
    }, [tenantId, connectedTools, onComplete])

    useEffect(() => {
        calculateScore()
    }, [calculateScore])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900">
                    Computing Your Data Readiness
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Analyzing connected tools and available data...
                </p>
            </div>

            {/* Bucket Progress Grid */}
            <div className="grid grid-cols-4 gap-3">
                {HYDRATION_BUCKETS.map((bucket) => {
                    const Icon = BUCKET_ICONS[bucket.id]
                    const isActive = currentBucket === bucket.id && isScoring
                    const isUnlocked = bucketStatus?.buckets.find(b => b.bucket === bucket.id)?.unlocked
                    const isPast = HYDRATION_BUCKETS.findIndex(b => b.id === bucket.id) <
                        HYDRATION_BUCKETS.findIndex(b => b.id === currentBucket)

                    return (
                        <div
                            key={bucket.id}
                            className={`
                                relative p-3 rounded-lg border transition-all duration-300
                                ${isActive ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' :
                                    isUnlocked ? 'border-green-300 bg-green-50' :
                                        isPast ? 'border-slate-200 bg-slate-50' :
                                            'border-slate-200 bg-white opacity-50'}
                            `}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {isActive ? (
                                    <Loader2 className={`w-4 h-4 animate-spin ${BUCKET_COLORS[bucket.id]}`} />
                                ) : isUnlocked ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Icon className={`w-4 h-4 ${BUCKET_COLORS[bucket.id]}`} />
                                )}
                                <span className="text-xs font-medium text-slate-600">{bucket.id}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate">{bucket.name}</p>
                        </div>
                    )
                })}
            </div>

            {/* Current Status */}
            {bucketStatus && !isScoring && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-800">
                                Hydration Level: {bucketStatus.highest_bucket}
                            </span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {Math.round(bucketStatus.completion_percentage)}% Complete
                        </Badge>
                    </div>

                    <Progress
                        value={bucketStatus.completion_percentage}
                        className="h-2 mb-3"
                    />

                    {/* Unlocked features summary */}
                    <div className="flex flex-wrap gap-1.5">
                        {bucketStatus.buckets
                            .filter(b => b.unlocked)
                            .map(b => {
                                const def = HYDRATION_BUCKETS.find(h => h.id === b.bucket)
                                return def?.enablesModules.slice(0, 2).map(mod => (
                                    <Badge
                                        key={`${b.bucket}-${mod}`}
                                        variant="outline"
                                        className="text-[10px] bg-white"
                                    >
                                        {mod}
                                    </Badge>
                                ))
                            })}
                    </div>

                    {/* Next unlock hint */}
                    {bucketStatus.next_unlock && (
                        <p className="text-xs text-slate-600 mt-3">
                            <span className="font-medium">Next unlock:</span>{' '}
                            {bucketStatus.next_unlock.suggested_actions[0]}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

/**
 * Estimate hydration metrics from connected tools
 * Used when API is not available during onboarding
 */
function estimateMetricsFromTools(tools: string[]): TenantHydrationMetrics {
    const hasCRM = tools.some(t => ['salesforce', 'hubspot', 'pipedrive'].includes(t.toLowerCase()))
    const hasSupport = tools.some(t => ['zendesk', 'intercom', 'freshdesk'].includes(t.toLowerCase()))
    const hasCalendar = tools.some(t => ['google_calendar', 'outlook_calendar', 'calendly'].includes(t.toLowerCase()))
    const hasStorage = tools.some(t => ['google_drive', 'dropbox', 'notion', 'confluence'].includes(t.toLowerCase()))
    const hasSlack = tools.some(t => ['slack', 'teams'].includes(t.toLowerCase()))
    const hasProjectMgmt = tools.some(t => ['jira', 'asana', 'linear', 'monday'].includes(t.toLowerCase()))

    return {
        users: 1,
        entities: hasCRM ? 50 : hasProjectMgmt ? 20 : 5,
        documents: hasStorage ? 10 : 0,
        embeddings: hasStorage ? 20 : 0,
        tools: tools.length,
        synced_entities: hasCRM ? 100 : hasSupport ? 50 : 0,
        accounts: hasCRM ? 15 : 0,
        policies: 0,
        governance_enabled: false,
        automation_enabled: tools.length >= 3,
    }
}

export default HydrationScorer
