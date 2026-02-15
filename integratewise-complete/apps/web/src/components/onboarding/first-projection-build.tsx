"use client"

/**
 * L0.6 First Projection Build Component
 * Creates initial L1 snapshots based on available buckets
 * Prepares the workspace modules and home skeleton
 */

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Layers, Home, FolderKanban, Users, FileText,
    Brain, BarChart3, Shield, Zap, CheckCircle2, Loader2
} from "lucide-react"
import type { TenantBucketStatus } from "@/types/hydration-buckets"
import { HYDRATION_BUCKETS, getAvailableModules } from "@/types/hydration-buckets"

interface FirstProjectionBuildProps {
    tenantId: string
    userId: string
    bucketStatus: TenantBucketStatus
    onComplete: (enabledModules: string[]) => void
}

interface ProjectionStep {
    id: string
    label: string
    icon: React.ElementType
    status: 'pending' | 'building' | 'complete'
}

const MODULE_ICONS: Record<string, React.ElementType> = {
    'home': Home,
    'projects': FolderKanban,
    'tasks': FolderKanban,
    'notes': FileText,
    'docs': FileText,
    'context': FileText,
    'documents': FileText,
    'knowledge': Brain,
    'search': Brain,
    'accounts': Users,
    'contacts': Users,
    'meetings': Users,
    'calendar': Users,
    'pipeline': Users,
    'team': Users,
    'analytics': BarChart3,
    'expansion': BarChart3,
    'governance': Shield,
    'audit': Shield,
    'approvals': Shield,
    'workflow-builder': Zap,
}

export function FirstProjectionBuild({
    tenantId,
    userId,
    bucketStatus,
    onComplete
}: FirstProjectionBuildProps) {
    const [steps, setSteps] = useState<ProjectionStep[]>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [enabledModules, setEnabledModules] = useState<string[]>([])
    const [isComplete, setIsComplete] = useState(false)

    // Initialize steps based on unlocked buckets
    useEffect(() => {
        const availableModules = getAvailableModules(bucketStatus)
        setEnabledModules(availableModules)

        // Create projection steps
        const projectionSteps: ProjectionStep[] = [
            { id: 'core', label: 'Building Home Dashboard', icon: Home, status: 'pending' },
            { id: 'modules', label: 'Enabling Workspace Modules', icon: Layers, status: 'pending' },
            { id: 'widgets', label: 'Configuring Home Widgets', icon: FolderKanban, status: 'pending' },
            { id: 'nav', label: 'Setting Up Navigation', icon: Users, status: 'pending' },
            { id: 'preferences', label: 'Applying Preferences', icon: Brain, status: 'pending' },
        ]

        setSteps(projectionSteps)
    }, [bucketStatus])

    // Run projection build
    useEffect(() => {
        if (steps.length === 0) return

        const buildProjection = async () => {
            for (let i = 0; i < steps.length; i++) {
                // Mark current as building
                setSteps(prev => prev.map((s, idx) =>
                    idx === i ? { ...s, status: 'building' } : s
                ))
                setCurrentStep(i)

                // Simulate build step (replace with real API calls)
                await performBuildStep(steps[i].id, tenantId, userId, enabledModules)

                // Mark as complete
                setSteps(prev => prev.map((s, idx) =>
                    idx === i ? { ...s, status: 'complete' } : s
                ))

                await new Promise(resolve => setTimeout(resolve, 300))
            }

            setIsComplete(true)

            // Save workspace bag to API
            await saveInitialWorkspaceBag(tenantId, userId, enabledModules)

            // Short delay then complete
            await new Promise(resolve => setTimeout(resolve, 500))
            onComplete(enabledModules)
        }

        buildProjection()
    }, [steps.length, tenantId, userId, enabledModules, onComplete])

    const progress = steps.length > 0
        ? ((steps.filter(s => s.status === 'complete').length / steps.length) * 100)
        : 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900">
                    Building Your Workspace
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Creating personalized views based on your data...
                </p>
            </div>

            {/* Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                    <span>Projection Build</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Steps */}
            <div className="space-y-3">
                {steps.map((step, idx) => {
                    const Icon = step.icon
                    return (
                        <div
                            key={step.id}
                            className={`
                                flex items-center gap-3 p-3 rounded-lg transition-all
                                ${step.status === 'building' ? 'bg-blue-50 border border-blue-200' :
                                    step.status === 'complete' ? 'bg-green-50 border border-green-200' :
                                        'bg-slate-50 border border-slate-200'}
                            `}
                        >
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center
                                ${step.status === 'building' ? 'bg-blue-100' :
                                    step.status === 'complete' ? 'bg-green-100' :
                                        'bg-slate-100'}
                            `}>
                                {step.status === 'building' ? (
                                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                ) : step.status === 'complete' ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Icon className="w-4 h-4 text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${step.status === 'complete' ? 'text-green-700' :
                                    step.status === 'building' ? 'text-blue-700' : 'text-slate-600'
                                    }`}>
                                    {step.label}
                                </p>
                            </div>
                            {step.status === 'complete' && (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Enabled Modules Summary */}
            {isComplete && enabledModules.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
                    <p className="text-sm font-medium text-indigo-800 mb-3">
                        {enabledModules.length} modules enabled for your workspace:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {enabledModules.slice(0, 8).map(mod => {
                            const Icon = MODULE_ICONS[mod] || Layers
                            return (
                                <Badge
                                    key={mod}
                                    variant="secondary"
                                    className="bg-white text-indigo-700 gap-1"
                                >
                                    <Icon className="w-3 h-3" />
                                    {mod}
                                </Badge>
                            )
                        })}
                        {enabledModules.length > 8 && (
                            <Badge variant="outline" className="text-slate-500">
                                +{enabledModules.length - 8} more
                            </Badge>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

/**
 * Perform individual build step
 */
async function performBuildStep(
    stepId: string,
    tenantId: string,
    userId: string,
    modules: string[]
): Promise<void> {
    // Simulate API call delay
    const delay = 400 + Math.random() * 300

    switch (stepId) {
        case 'core':
            // Initialize home dashboard structure
            await new Promise(resolve => setTimeout(resolve, delay))
            break

        case 'modules':
            // Enable modules based on buckets
            try {
                await fetch('/api/workspace/modules', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tenant_id: tenantId, user_id: userId, modules })
                })
            } catch {
                await new Promise(resolve => setTimeout(resolve, delay))
            }
            break

        case 'widgets':
            // Configure default home widgets
            await new Promise(resolve => setTimeout(resolve, delay))
            break

        case 'nav':
            // Set up navigation preferences
            await new Promise(resolve => setTimeout(resolve, delay))
            break

        case 'preferences':
            // Apply user preferences
            await new Promise(resolve => setTimeout(resolve, delay))
            break

        default:
            await new Promise(resolve => setTimeout(resolve, delay))
    }
}

/**
 * Save initial workspace bag configuration
 */
async function saveInitialWorkspaceBag(
    tenantId: string,
    userId: string,
    enabledModules: string[]
): Promise<void> {
    try {
        await fetch('/api/workspace/bag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tenant_id: tenantId,
                user_id: userId,
                active_modules: ['home', ...enabledModules.filter(m => m !== 'home')],
                pinned_widgets: [],
                module_settings: {},
                sidebar_collapsed: false,
                sidebar_position: 'left',
            })
        })
    } catch (error) {
        console.error('Failed to save workspace bag:', error)
    }
}

export default FirstProjectionBuild
