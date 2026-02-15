"use client"

/**
 * L1 Feature Bag Sidebar Component
 * Shows module add/remove UI with unlock states
 * Supports drag-drop reordering of active modules
 */

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
    Home, FolderKanban, CheckSquare, FileText, CalendarClock,
    Users, Building2, TrendingUp, BarChart3, Brain, BookOpen,
    Lightbulb, Radio, Zap, Shield, History, Workflow,
    Plus, Lock, GripVertical, ChevronDown, ChevronRight,
    Sparkles, Settings, X
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { L1Module, ModuleCoverageState } from '@/types/workspace-bag'

// Icon mapping for modules
const MODULE_ICONS: Record<string, React.ElementType> = {
    'home': Home,
    'projects': FolderKanban,
    'tasks': CheckSquare,
    'docs': FileText,
    'meetings': CalendarClock,
    'notes': FileText,
    'calendar': CalendarClock,
    'accounts': Building2,
    'contacts': Users,
    'pipeline': TrendingUp,
    'team': Users,
    'risks': BarChart3,
    'expansion': TrendingUp,
    'analytics': BarChart3,
    'knowledge': Brain,
    'context': BookOpen,
    'signals': Radio,
    'predictions': Lightbulb,
    'workflows': Workflow,
    'automations': Zap,
    'approvals': Shield,
    'audit': History,
}

// Coverage indicator colors
const COVERAGE_COLORS: Record<ModuleCoverageState, string> = {
    'ready': 'bg-green-500',
    'sparse': 'bg-amber-500',
    'missing': 'bg-slate-300',
}

interface FeatureBagSidebarProps {
    activeModules: L1Module[]
    availableModules: L1Module[]
    lockedModules: L1Module[]
    moduleCoverage: Record<string, ModuleCoverageState>
    currentRoute: string
    onAddModule: (moduleId: string) => void
    onRemoveModule: (moduleId: string) => void
    onReorderModules: (newOrder: string[]) => void
    onNavigate: (route: string) => void
}

export function FeatureBagSidebar({
    activeModules,
    availableModules,
    lockedModules,
    moduleCoverage,
    currentRoute,
    onAddModule,
    onRemoveModule,
    onReorderModules,
    onNavigate,
}: FeatureBagSidebarProps) {
    const router = useRouter()
    const [showAddModule, setShowAddModule] = useState(false)
    const [draggedItem, setDraggedItem] = useState<string | null>(null)
    const [dragOverItem, setDragOverItem] = useState<string | null>(null)

    // Handle drag start
    const handleDragStart = useCallback((e: React.DragEvent, moduleId: string) => {
        setDraggedItem(moduleId)
        e.dataTransfer.effectAllowed = 'move'
    }, [])

    // Handle drag over
    const handleDragOver = useCallback((e: React.DragEvent, moduleId: string) => {
        e.preventDefault()
        if (moduleId !== draggedItem) {
            setDragOverItem(moduleId)
        }
    }, [draggedItem])

    // Handle drop
    const handleDrop = useCallback((e: React.DragEvent, targetModuleId: string) => {
        e.preventDefault()
        if (draggedItem && draggedItem !== targetModuleId) {
            const currentOrder = activeModules.map(m => m.id)
            const draggedIndex = currentOrder.indexOf(draggedItem)
            const targetIndex = currentOrder.indexOf(targetModuleId)

            if (draggedIndex !== -1 && targetIndex !== -1) {
                const newOrder = [...currentOrder]
                newOrder.splice(draggedIndex, 1)
                newOrder.splice(targetIndex, 0, draggedItem)
                onReorderModules(newOrder)
            }
        }
        setDraggedItem(null)
        setDragOverItem(null)
    }, [draggedItem, activeModules, onReorderModules])

    const handleDragEnd = useCallback(() => {
        setDraggedItem(null)
        setDragOverItem(null)
    }, [])

    return (
        <div className="flex flex-col h-full">
            {/* Active Modules */}
            <div className="flex-1 overflow-y-auto py-2">
                <div className="px-3 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Your Modules
                    </span>
                </div>

                <div className="space-y-0.5 px-1">
                    {activeModules.map((module) => {
                        const Icon = MODULE_ICONS[module.id] || FolderKanban
                        const coverage = moduleCoverage[module.id] || 'missing'
                        const isActive = currentRoute === module.route || currentRoute.startsWith(module.route + '/')
                        const isFixed = module.isFixed
                        const isDragging = draggedItem === module.id
                        const isDragOver = dragOverItem === module.id

                        return (
                            <div
                                key={module.id}
                                draggable={!isFixed}
                                onDragStart={(e) => handleDragStart(e, module.id)}
                                onDragOver={(e) => handleDragOver(e, module.id)}
                                onDrop={(e) => handleDrop(e, module.id)}
                                onDragEnd={handleDragEnd}
                                className={`
                                    group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer
                                    transition-all duration-150
                                    ${isActive
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }
                                    ${isDragging ? 'opacity-50' : ''}
                                    ${isDragOver ? 'border-t-2 border-blue-500' : ''}
                                `}
                                onClick={() => onNavigate(module.route)}
                            >
                                {/* Drag handle */}
                                {!isFixed && (
                                    <GripVertical
                                        className={`w-3 h-3 cursor-grab opacity-0 group-hover:opacity-50 ${isActive ? 'text-white' : 'text-slate-400'
                                            }`}
                                    />
                                )}

                                {/* Coverage indicator */}
                                <div className={`w-1.5 h-1.5 rounded-full ${COVERAGE_COLORS[coverage]}`} />

                                {/* Icon */}
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />

                                {/* Label */}
                                <span className="flex-1 text-sm truncate">{module.name}</span>

                                {/* Remove button (if not fixed) */}
                                {!isFixed && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onRemoveModule(module.id)
                                        }}
                                        title={`Remove ${module.name} from sidebar`}
                                        aria-label={`Remove ${module.name}`}
                                        className={`
                                            opacity-0 group-hover:opacity-100 p-0.5 rounded
                                            ${isActive ? 'hover:bg-white/20' : 'hover:bg-slate-200'}
                                        `}
                                    >
                                        <X className={`w-3 h-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Add Module Section */}
            <Collapsible open={showAddModule} onOpenChange={setShowAddModule}>
                <div className="border-t border-slate-200 px-2 py-2">
                    <CollapsibleTrigger asChild>
                        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors">
                            {showAddModule ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            <span className="text-sm">Add Module</span>
                            {availableModules.length > 0 && (
                                <Badge variant="secondary" className="ml-auto text-[10px]">
                                    {availableModules.length}
                                </Badge>
                            )}
                        </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="pt-2 space-y-1">
                        {/* Available (unlocked) modules */}
                        {availableModules.length > 0 && (
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 px-2">Available</span>
                                {availableModules.map((module) => {
                                    const Icon = MODULE_ICONS[module.id] || FolderKanban
                                    return (
                                        <button
                                            key={module.id}
                                            onClick={() => {
                                                onAddModule(module.id)
                                                setShowAddModule(false)
                                            }}
                                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-slate-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                                        >
                                            <Plus className="w-3 h-3 text-green-500" />
                                            <Icon className="w-4 h-4" />
                                            <span className="text-sm truncate">{module.name}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {/* Locked modules */}
                        {lockedModules.length > 0 && (
                            <div className="space-y-1 pt-2">
                                <span className="text-[10px] text-slate-400 px-2">Unlock by connecting tools</span>
                                {lockedModules.slice(0, 5).map((module) => {
                                    const Icon = MODULE_ICONS[module.id] || FolderKanban
                                    return (
                                        <div
                                            key={module.id}
                                            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-slate-400 opacity-60"
                                        >
                                            <Lock className="w-3 h-3" />
                                            <Icon className="w-4 h-4" />
                                            <span className="text-sm truncate">{module.name}</span>
                                        </div>
                                    )
                                })}
                                {lockedModules.length > 5 && (
                                    <button
                                        onClick={() => router.push('/settings/integrations')}
                                        className="w-full flex items-center gap-2 px-2 py-1 text-xs text-blue-500 hover:underline"
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        Connect tools to unlock {lockedModules.length - 5} more
                                    </button>
                                )}
                            </div>
                        )}

                        {availableModules.length === 0 && lockedModules.length === 0 && (
                            <p className="text-xs text-slate-400 px-2 py-2">
                                All modules are already in your workspace
                            </p>
                        )}
                    </CollapsibleContent>
                </div>
            </Collapsible>
        </div>
    )
}

export default FeatureBagSidebar
