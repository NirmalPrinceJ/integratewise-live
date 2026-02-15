"use client";

// src/contexts/workspace-bag-context.tsx
// Customizable L1 Workspace - Module Bag Context

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
    UserWorkspaceBag,
    L1Module,
    ModuleSettings,
    UnlockContext,
    ViewCategory,
    PinnedWidget,
    ModuleWidget,
    ModuleCoverageState
} from '@/types/workspace-bag';
import {
    L1_MODULES,
    getModuleById,
    getDefaultBagForRole,
    isModuleUnlocked,
    getModuleCoverage,
    getAllWidgets,
    getWidgetById,
    VIEW_CATEGORIES,
    HOME_SKELETON_BLOCKS
} from '@/types/workspace-bag';
import { useHydration } from './hydration-context';

// ═══════════════════════════════════════════════════════════════
// CONTEXT TYPES
// ═══════════════════════════════════════════════════════════════

interface WorkspaceBagContextValue {
    // Current user's bag
    bag: UserWorkspaceBag | null;
    isLoading: boolean;

    // Modules in current bag (resolved to full objects)
    activeModules: L1Module[];

    // Available modules (not in bag, but unlocked)
    availableModules: L1Module[];

    // All unlocked modules
    unlockedModules: L1Module[];

    // Locked modules with unlock requirements
    lockedModules: L1Module[];

    // Module coverage states
    moduleCoverage: Record<string, ModuleCoverageState>;

    // Home skeleton blocks (fixed)
    homeSkeletonBlocks: typeof HOME_SKELETON_BLOCKS;

    // Pinned widgets
    pinnedWidgets: (ModuleWidget & { order: number })[];

    // Available widgets (from active modules with sufficient coverage)
    availableWidgets: ModuleWidget[];

    // ─────────────────────────────────────────────────────────────
    // Module Actions
    // ─────────────────────────────────────────────────────────────
    addModule: (moduleId: string) => Promise<void>;
    removeModule: (moduleId: string) => Promise<void>;
    reorderModules: (newOrder: string[]) => Promise<void>;
    updateModuleSettings: (moduleId: string, settings: Partial<ModuleSettings>) => Promise<void>;

    // ─────────────────────────────────────────────────────────────
    // Widget Actions
    // ─────────────────────────────────────────────────────────────
    pinWidget: (widgetId: string) => Promise<void>;
    unpinWidget: (widgetId: string) => Promise<void>;
    reorderWidgets: (newOrder: string[]) => Promise<void>;

    // ─────────────────────────────────────────────────────────────
    // Bag Actions
    // ─────────────────────────────────────────────────────────────
    resetToDefaults: () => Promise<void>;

    // ─────────────────────────────────────────────────────────────
    // Sidebar state
    // ─────────────────────────────────────────────────────────────
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
}

const WorkspaceBagContext = createContext<WorkspaceBagContextValue | null>(null);

// ═══════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════

interface WorkspaceBagProviderProps {
    children: React.ReactNode;
    userId: string;
    userRole?: string;
    currentPlan?: 'free' | 'starter' | 'pro' | 'enterprise';
    teamSize?: number;
    connectedTools?: string[];
    entityCounts?: Record<string, number>;
}

export function WorkspaceBagProvider({
    children,
    userId,
    userRole = 'personal',
    currentPlan = 'free',
    teamSize = 1,
    connectedTools = [],
    entityCounts = {}
}: WorkspaceBagProviderProps) {
    const [bag, setBag] = useState<UserWorkspaceBag | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Get hydration context for data strength
    const hydration = useHydration();

    // Build unlock context
    const unlockContext: UnlockContext = {
        connectedTools,
        dataStrengthLevel: hydration?.strength?.level || 'seed',
        entityCounts,
        currentPlan,
        teamSize,
    };

    // ─────────────────────────────────────────────────────────────
    // Load bag from API
    // ─────────────────────────────────────────────────────────────
    useEffect(() => {
        async function loadBag() {
            try {
                const response = await fetch(`/api/workspace/bag?userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setBag(data.bag);
                } else if (response.status === 404) {
                    // New user - create default bag
                    const defaultBag = createDefaultBag(userId, userRole);
                    setBag(defaultBag);
                    await saveBag(defaultBag);
                }
            } catch (error) {
                console.error('Failed to load workspace bag:', error);
                setBag(createDefaultBag(userId, userRole));
            } finally {
                setIsLoading(false);
            }
        }

        loadBag();
    }, [userId, userRole]);

    // ─────────────────────────────────────────────────────────────
    // Save bag to API
    // ─────────────────────────────────────────────────────────────
    const saveBag = useCallback(async (updatedBag: UserWorkspaceBag) => {
        try {
            await fetch('/api/workspace/bag', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bag: updatedBag }),
            });
        } catch (error) {
            console.error('Failed to save workspace bag:', error);
        }
    }, []);

    // ─────────────────────────────────────────────────────────────
    // Computed modules
    // ─────────────────────────────────────────────────────────────
    const activeModules = (bag?.active_modules || [])
        .map(id => getModuleById(id))
        .filter((m): m is L1Module => m !== undefined);

    const unlockedModules = L1_MODULES.filter(m => isModuleUnlocked(m, unlockContext));

    const lockedModules = L1_MODULES.filter(m => !isModuleUnlocked(m, unlockContext));

    const availableModules = unlockedModules.filter(
        m => !bag?.active_modules.includes(m.id) && !m.isFixed
    );

    // Calculate coverage for each module
    const moduleCoverage: Record<string, ModuleCoverageState> = {};
    L1_MODULES.forEach(m => {
        moduleCoverage[m.id] = getModuleCoverage(m, unlockContext);
    });

    // ─────────────────────────────────────────────────────────────
    // Computed widgets
    // ─────────────────────────────────────────────────────────────
    const pinnedWidgets = (bag?.pinned_widgets || [])
        .map(pw => {
            const widget = getWidgetById(pw.widget_id);
            return widget ? { ...widget, order: pw.order } : null;
        })
        .filter((w): w is ModuleWidget & { order: number } => w !== null)
        .sort((a, b) => a.order - b.order);

    // Available widgets = from active modules with sufficient coverage
    const availableWidgets = activeModules.flatMap(m => {
        const coverage = moduleCoverage[m.id];
        return m.widgets.filter(w => {
            // Widget is available if module coverage meets widget's min requirement
            if (w.minCoverage === 'missing') return true;
            if (w.minCoverage === 'sparse') return coverage !== 'missing';
            return coverage === 'ready';
        });
    }).filter(w => !bag?.pinned_widgets.some(pw => pw.widget_id === w.id));

    // ─────────────────────────────────────────────────────────────
    // Module Actions
    // ─────────────────────────────────────────────────────────────
    const addModule = useCallback(async (moduleId: string) => {
        if (!bag) return;

        const module = getModuleById(moduleId);
        if (!module || bag.active_modules.includes(moduleId)) return;
        if (!isModuleUnlocked(module, unlockContext)) return;

        const updatedBag: UserWorkspaceBag = {
            ...bag,
            active_modules: [...bag.active_modules, moduleId],
            updated_at: new Date().toISOString(),
        };

        setBag(updatedBag);
        await saveBag(updatedBag);
    }, [bag, unlockContext, saveBag]);

    const removeModule = useCallback(async (moduleId: string) => {
        if (!bag) return;

        const module = getModuleById(moduleId);
        if (!module || module.isFixed) return;

        // Also remove any pinned widgets from this module
        const updatedPinnedWidgets = bag.pinned_widgets.filter(
            pw => pw.module_id !== moduleId
        );

        const updatedBag: UserWorkspaceBag = {
            ...bag,
            active_modules: bag.active_modules.filter(id => id !== moduleId),
            pinned_widgets: updatedPinnedWidgets,
            updated_at: new Date().toISOString(),
        };

        setBag(updatedBag);
        await saveBag(updatedBag);
    }, [bag, saveBag]);

    const reorderModules = useCallback(async (newOrder: string[]) => {
        if (!bag) return;

        // Ensure 'home' is always first
        const homeIndex = newOrder.indexOf('home');
        if (homeIndex > 0) {
            newOrder.splice(homeIndex, 1);
            newOrder.unshift('home');
        } else if (homeIndex === -1) {
            newOrder.unshift('home');
        }

        const updatedBag: UserWorkspaceBag = {
            ...bag,
            active_modules: newOrder,
            updated_at: new Date().toISOString(),
        };

        setBag(updatedBag);
        await saveBag(updatedBag);
    }, [bag, saveBag]);

    const updateModuleSettings = useCallback(async (
        moduleId: string,
        settings: Partial<ModuleSettings>
    ) => {
        if (!bag) return;

        const updatedBag: UserWorkspaceBag = {
            ...bag,
            module_settings: {
                ...bag.module_settings,
                [moduleId]: {
                    ...bag.module_settings[moduleId],
                    ...settings,
                },
            },
            updated_at: new Date().toISOString(),
        };

        setBag(updatedBag);
        await saveBag(updatedBag);
    }, [bag, saveBag]);

    // ─────────────────────────────────────────────────────────────
    // Widget Actions
    // ─────────────────────────────────────────────────────────────
    const pinWidget = useCallback(async (widgetId: string) => {
        if (!bag) return;

        const widget = getWidgetById(widgetId);
        if (!widget) return;
        if (bag.pinned_widgets.some(pw => pw.widget_id === widgetId)) return;

        // Check if module is active
        if (!bag.active_modules.includes(widget.moduleId)) return;

        const newOrder = Math.max(0, ...bag.pinned_widgets.map(pw => pw.order)) + 1;

        const updatedBag: UserWorkspaceBag = {
            ...bag,
            pinned_widgets: [
                ...bag.pinned_widgets,
                { widget_id: widgetId, module_id: widget.moduleId, order: newOrder }
            ],
            updated_at: new Date().toISOString(),
        };

        setBag(updatedBag);
        await saveBag(updatedBag);
    }, [bag, saveBag]);

    const unpinWidget = useCallback(async (widgetId: string) => {
        if (!bag) return;

        const updatedBag: UserWorkspaceBag = {
            ...bag,
            pinned_widgets: bag.pinned_widgets.filter(pw => pw.widget_id !== widgetId),
            updated_at: new Date().toISOString(),
        };

        setBag(updatedBag);
        await saveBag(updatedBag);
    }, [bag, saveBag]);

    const reorderWidgets = useCallback(async (newOrder: string[]) => {
        if (!bag) return;

        const updatedPinnedWidgets = newOrder.map((widgetId, index) => {
            const existing = bag.pinned_widgets.find(pw => pw.widget_id === widgetId);
            if (existing) {
                return { ...existing, order: index };
            }
            const widget = getWidgetById(widgetId);
            return widget
                ? { widget_id: widgetId, module_id: widget.moduleId, order: index }
                : null;
        }).filter((pw): pw is PinnedWidget => pw !== null);

        const updatedBag: UserWorkspaceBag = {
            ...bag,
            pinned_widgets: updatedPinnedWidgets,
            updated_at: new Date().toISOString(),
        };

        setBag(updatedBag);
        await saveBag(updatedBag);
    }, [bag, saveBag]);

    // ─────────────────────────────────────────────────────────────
    // Bag Actions
    // ─────────────────────────────────────────────────────────────
    const resetToDefaults = useCallback(async () => {
        const defaultBag = createDefaultBag(userId, userRole);
        setBag(defaultBag);
        await saveBag(defaultBag);
    }, [userId, userRole, saveBag]);

    const toggleSidebar = useCallback(() => {
        setSidebarCollapsed(prev => !prev);
    }, []);

    // ─────────────────────────────────────────────────────────────
    // Context value
    // ─────────────────────────────────────────────────────────────
    const value: WorkspaceBagContextValue = {
        bag,
        isLoading,
        activeModules,
        availableModules,
        unlockedModules,
        lockedModules,
        moduleCoverage,
        homeSkeletonBlocks: HOME_SKELETON_BLOCKS,
        pinnedWidgets,
        availableWidgets,
        addModule,
        removeModule,
        reorderModules,
        updateModuleSettings,
        pinWidget,
        unpinWidget,
        reorderWidgets,
        resetToDefaults,
        sidebarCollapsed,
        toggleSidebar,
    };

    return (
        <WorkspaceBagContext.Provider value={value}>
            {children}
        </WorkspaceBagContext.Provider>
    );
}

// ═══════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════

// Safe hook that returns null if not in provider
export function useWorkspaceBagSafe() {
    return useContext(WorkspaceBagContext);
}

// Strict hook that throws if not in provider
export function useWorkspaceBag() {
    const context = useContext(WorkspaceBagContext);
    if (!context) {
        throw new Error('useWorkspaceBag must be used within a WorkspaceBagProvider');
    }
    return context;
}

// Categorized modules for the picker UI
export function useCategorizedModules() {
    const { availableModules, lockedModules } = useWorkspaceBag();

    const categorized: Record<ViewCategory, { available: L1Module[]; locked: L1Module[] }> = {
        core: { available: [], locked: [] },
        work: { available: [], locked: [] },
        customers: { available: [], locked: [] },
        intelligence: { available: [], locked: [] },
        personal: { available: [], locked: [] },
        team: { available: [], locked: [] },
    };

    availableModules.forEach(m => {
        categorized[m.category].available.push(m);
    });

    lockedModules.forEach(m => {
        categorized[m.category].locked.push(m);
    });

    const sortedCategories = Object.entries(categorized)
        .filter(([_, modules]) => modules.available.length > 0 || modules.locked.length > 0)
        .sort(([a], [b]) =>
            VIEW_CATEGORIES[a as ViewCategory].order - VIEW_CATEGORIES[b as ViewCategory].order
        );

    return { categorized, sortedCategories };
}

// Module-specific hook
export function useModule(moduleId: string) {
    const { activeModules, moduleCoverage, bag } = useWorkspaceBag();

    const module = getModuleById(moduleId);
    const isActive = activeModules.some(m => m.id === moduleId);
    const coverage = moduleCoverage[moduleId] || 'missing';
    const settings = bag?.module_settings[moduleId] || {};

    return {
        module,
        isActive,
        coverage,
        settings,
        isSparse: coverage === 'sparse',
        isReady: coverage === 'ready',
        isMissing: coverage === 'missing',
    };
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function createDefaultBag(userId: string, role: string): UserWorkspaceBag {
    return {
        user_id: userId,
        active_modules: getDefaultBagForRole(role),
        pinned_widgets: [],
        module_settings: {},
        sidebar_collapsed: false,
        sidebar_position: 'left',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
}
