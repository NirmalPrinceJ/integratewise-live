"use client"

/**
 * Smart Sidebar Component
 * Switches between Feature Bag (L1 Personal) and Department Nav (L1 Business)
 * based on current world scope
 */

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useWorkspaceBagSafe } from '@/contexts/workspace-bag-context'
import { FeatureBagSidebar } from '@/components/workspace/feature-bag-sidebar'
import {
    Home, CheckSquare, Target, Database, FileText,
    BookOpen, Brain, Activity, Lightbulb, Sparkles,
    Workflow, Zap, Shield, History, Eye, ChevronDown
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
    id: string
    label: string
    icon: React.ElementType
    section: string
    description?: string
}

interface NavSectionProps {
    title: string
    items: NavItem[]
    activePage: string
    onNavigate: (id: string) => void
    collapsed?: boolean
    color?: string
}

// Nav Section Component (for department views)
export function NavSection({
    title,
    items,
    activePage,
    onNavigate,
    collapsed = false,
    color = "slate"
}: NavSectionProps) {
    const [isOpen, setIsOpen] = useState(!collapsed)

    if (items.length === 0) return null

    const colorClasses: Record<string, string> = {
        slate: "text-slate-400",
        indigo: "text-indigo-500",
        emerald: "text-emerald-500",
        amber: "text-amber-500",
        rose: "text-rose-500",
    }

    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${colorClasses[color] || colorClasses.slate}`}
            >
                <span>{title}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
            </button>
            {isOpen && (
                <div className="space-y-0.5">
                    {items.map((item) => {
                        const Icon = item.icon
                        const isActive = activePage === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all group ${isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                                    }`}
                                title={item.description}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                                <span className="truncate">{item.label}</span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

interface SmartSidebarProps {
    worldScope: 'personal' | 'work' | 'accounts' | 'admin'
    activeDepartment: string
    activePage: string
    onNavigate: (pageId: string) => void
    leftNavItems: {
        core: NavItem[]
        department: NavItem[]
        intelligence: NavItem[]
        think: NavItem[]
        act: NavItem[]
        govern: NavItem[]
    }
}

export function SmartSidebar({
    worldScope,
    activeDepartment,
    activePage,
    onNavigate,
    leftNavItems,
}: SmartSidebarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const workspaceBag = useWorkspaceBagSafe()

    // Use Feature Bag sidebar for personal workspace if context is available
    if (worldScope === 'personal' && workspaceBag) {
        const {
            activeModules,
            availableModules,
            lockedModules,
            moduleCoverage,
            addModule,
            removeModule,
            reorderModules,
        } = workspaceBag

        return (
            <FeatureBagSidebar
                activeModules={activeModules}
                availableModules={availableModules}
                lockedModules={lockedModules}
                moduleCoverage={moduleCoverage}
                currentRoute={pathname || ''}
                onAddModule={addModule}
                onRemoveModule={removeModule}
                onReorderModules={reorderModules}
                onNavigate={(route) => router.push(route)}
            />
        )
    }

    // Department-based navigation for work/accounts/admin
    // L1 hard rule: keep this sidebar as pure work surfaces (no signals/intelligence overlays).
    // Cognitive/Signals/Evidence/Reasoning live in the global L2 drawer (Cmd/Ctrl+J).
    return (
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {/* Core Work Items */}
            <NavSection
                title="Core"
                items={leftNavItems.core}
                activePage={activePage}
                onNavigate={onNavigate}
                color="slate"
            />

            {/* Department-Specific Items */}
            {leftNavItems.department.length > 0 && (
                <NavSection
                    title={activeDepartment === 'overview' ? 'Admin' : activeDepartment}
                    items={leftNavItems.department}
                    activePage={activePage}
                    onNavigate={onNavigate}
                    color="emerald"
                />
            )}

            {/* Admin-only operational governance surfaces (telemetry + audit trails). */}
            {worldScope === 'admin' && (
                <NavSection
                    title="Governance"
                    items={leftNavItems.govern}
                    activePage={activePage}
                    onNavigate={onNavigate}
                    collapsed={true}
                    color="rose"
                />
            )}
        </div>
    )
}

export default SmartSidebar
