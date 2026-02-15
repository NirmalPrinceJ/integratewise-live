"use client";

// src/components/workspace/module-picker.tsx
// Module Picker Dialog - Add modules to workspace bag

import React, { useState } from 'react';
import { useWorkspaceBag, useCategorizedModules } from '@/contexts/workspace-bag-context';
import { getUnlockMessage, VIEW_CATEGORIES } from '@/types/workspace-bag';
import type { L1Module, ViewCategory, ModuleCoverageState } from '@/types/workspace-bag';
import {
    Home, FolderKanban, CalendarClock, FileText, CheckSquare, Calendar,
    StickyNote, Building2, Users, TrendingUp, Users2, Brain, AlertTriangle,
    Rocket, BarChart3, Plus, X, Lock, Briefcase, User, Sparkles, Check
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// ICON MAP
// ═══════════════════════════════════════════════════════════════

const ICON_MAP: Record<string, React.ElementType> = {
    Home,
    FolderKanban,
    CalendarClock,
    FileText,
    CheckSquare,
    Calendar,
    StickyNote,
    Building2,
    Users,
    TrendingUp,
    Users2,
    Brain,
    AlertTriangle,
    Rocket,
    BarChart3,
    Briefcase,
    User,
};

const CATEGORY_ICONS: Record<ViewCategory, React.ElementType> = {
    core: Home,
    work: Briefcase,
    customers: Building2,
    intelligence: Brain,
    personal: User,
    team: Users,
};

// ═══════════════════════════════════════════════════════════════
// MODULE CARD
// ═══════════════════════════════════════════════════════════════

interface ModuleCardProps {
    module: L1Module;
    isLocked: boolean;
    isAdded: boolean;
    coverage?: ModuleCoverageState;
    onAdd: () => void;
}

function ModuleCard({ module, isLocked, isAdded, coverage, onAdd }: ModuleCardProps) {
    const Icon = ICON_MAP[module.icon] || Home;

    return (
        <div
            className={`
        relative p-4 rounded-xl border transition-all duration-200
        ${isLocked
                    ? 'bg-gray-800/30 border-gray-700/50 opacity-60'
                    : isAdded
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-gray-800/50 border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/70'
                }
      `}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`
          p-2.5 rounded-lg
          ${isLocked
                        ? 'bg-gray-700/50'
                        : isAdded
                            ? 'bg-green-500/20'
                            : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                    }
        `}>
                    <Icon className={`w-5 h-5 ${isLocked ? 'text-gray-500' : isAdded ? 'text-green-400' : 'text-blue-400'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                            {module.name}
                        </h3>
                        {isAdded && (
                            <span className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">
                                Added
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                        {module.description}
                    </p>

                    {/* Unlock requirement */}
                    {isLocked && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500">
                            <Lock className="w-3 h-3" />
                            <span>{getUnlockMessage(module.unlockCondition)}</span>
                        </div>
                    )}

                    {/* Coverage indicator */}
                    {!isLocked && coverage && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <div className={`w-2 h-2 rounded-full ${coverage === 'ready' ? 'bg-green-500' :
                                    coverage === 'sparse' ? 'bg-yellow-500' :
                                        'bg-gray-500'
                                }`} />
                            <span className="text-xs text-gray-500">
                                {coverage === 'ready' ? 'Full data' :
                                    coverage === 'sparse' ? 'Partial data' :
                                        'No data'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Add button */}
                {!isLocked && !isAdded && (
                    <button
                        onClick={onAdd}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                )}

                {isAdded && (
                    <div className="p-2">
                        <Check className="w-4 h-4 text-green-400" />
                    </div>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// MODULE PICKER DIALOG
// ═══════════════════════════════════════════════════════════════

interface ModulePickerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ModulePicker({ isOpen, onClose }: ModulePickerProps) {
    const { addModule, activeModules, moduleCoverage } = useWorkspaceBag();
    const { sortedCategories } = useCategorizedModules();
    const [selectedCategory, setSelectedCategory] = useState<ViewCategory | 'all'>('all');

    if (!isOpen) return null;

    const activeModuleIds = activeModules.map(m => m.id);

    const filteredCategories = selectedCategory === 'all'
        ? sortedCategories
        : sortedCategories.filter(([cat]) => cat === selectedCategory);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-2xl max-h-[80vh] bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                                <Sparkles className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Add Module</h2>
                                <p className="text-sm text-gray-400">Customize your workspace with capability modules</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'all'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-gray-800/50 text-gray-400 hover:text-white'
                                }`}
                        >
                            All
                        </button>
                        {Object.entries(VIEW_CATEGORIES)
                            .sort(([, a], [, b]) => a.order - b.order)
                            .filter(([cat]) => cat !== 'core') // Hide core (Home is fixed)
                            .map(([category, meta]) => {
                                const Icon = CATEGORY_ICONS[category as ViewCategory];
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category as ViewCategory)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${selectedCategory === category
                                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                : 'bg-gray-800/50 text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {meta.label}
                                    </button>
                                );
                            })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {filteredCategories.map(([category, modules]) => {
                        const meta = VIEW_CATEGORIES[category as ViewCategory];
                        const Icon = CATEGORY_ICONS[category as ViewCategory];
                        const allModules = [...modules.available, ...modules.locked];

                        // Skip core category (Home is always there)
                        if (category === 'core') return null;

                        return (
                            <div key={category}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Icon className="w-4 h-4 text-gray-500" />
                                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                                        {meta.label}
                                    </h3>
                                    <div className="flex-1 h-px bg-gray-700/50" />
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {allModules.map(module => (
                                        <ModuleCard
                                            key={module.id}
                                            module={module}
                                            isLocked={modules.locked.some(m => m.id === module.id)}
                                            isAdded={activeModuleIds.includes(module.id)}
                                            coverage={moduleCoverage[module.id]}
                                            onAdd={() => addModule(module.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-gray-900/50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            {activeModules.length} modules active
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModulePicker;
