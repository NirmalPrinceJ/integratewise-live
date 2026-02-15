"use client";

// src/components/workspace/workspace-sidebar.tsx
// Customizable Sidebar with Drag & Drop

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWorkspaceBag } from '@/contexts/workspace-bag-context';
import type { L1Module, ModuleCoverageState } from '@/types/workspace-bag';
import {
    Home, FolderKanban, CalendarClock, FileText, CheckSquare, Calendar,
    StickyNote, Building2, Users, TrendingUp, Users2, Brain, AlertTriangle,
    Rocket, BarChart3, Plus, ChevronLeft, ChevronRight, GripVertical, X,
    Sparkles, Lock
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
};

// ═══════════════════════════════════════════════════════════════
// SORTABLE ITEM
// ═══════════════════════════════════════════════════════════════

interface SortableModuleItemProps {
    module: L1Module;
    isActive: boolean;
    coverage: ModuleCoverageState;
    onRemove: () => void;
    collapsed: boolean;
}

function SortableModuleItem({
    module,
    isActive,
    coverage,
    onRemove,
    collapsed
}: SortableModuleItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: module.id, disabled: module.isFixed });

    const pathname = usePathname();
    const isCurrentRoute = pathname === module.route;
    const Icon = ICON_MAP[module.icon] || Home;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
        transition-all duration-200 cursor-pointer
        ${isDragging ? 'opacity-50 z-50' : ''}
        ${isCurrentRoute
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }
      `}
        >
            {/* Drag Handle */}
            {!module.isFixed && !collapsed && (
                <div
                    {...attributes}
                    {...listeners}
                    className="opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="w-4 h-4" />
                </div>
            )}

            {/* Icon */}
            <Link href={module.route} className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                    <Icon className={`w-5 h-5 ${isCurrentRoute ? 'text-blue-400' : ''}`} />

                    {/* Coverage indicator */}
                    {coverage === 'sparse' && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-500" />
                    )}
                    {coverage === 'ready' && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500" />
                    )}
                </div>

                {!collapsed && (
                    <span className="truncate text-sm font-medium">{module.name}</span>
                )}
            </Link>

            {/* Remove button */}
            {!module.isFixed && !collapsed && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-red-400 transition-opacity"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// MAIN SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════

interface WorkspaceSidebarProps {
    onOpenModulePicker: () => void;
}

export function WorkspaceSidebar({ onOpenModulePicker }: WorkspaceSidebarProps) {
    const {
        activeModules,
        moduleCoverage,
        removeModule,
        reorderModules,
        sidebarCollapsed,
        toggleSidebar,
        isLoading,
    } = useWorkspaceBag();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = activeModules.findIndex(m => m.id === active.id);
            const newIndex = activeModules.findIndex(m => m.id === over.id);

            // Don't allow moving to position 0 (home is fixed)
            if (newIndex === 0) return;

            const newOrder = arrayMove(
                activeModules.map(m => m.id),
                oldIndex,
                newIndex
            );

            reorderModules(newOrder);
        }
    };

    if (isLoading) {
        return (
            <div className={`
        h-full bg-gray-900/50 backdrop-blur-xl border-r border-white/10
        flex flex-col transition-all duration-300
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `}>
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`
      h-full bg-gray-900/50 backdrop-blur-xl border-r border-white/10
      flex flex-col transition-all duration-300
      ${sidebarCollapsed ? 'w-16' : 'w-64'}
    `}>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                {!sidebarCollapsed && (
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold text-white">Workspace</span>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* Module List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={activeModules.map(m => m.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {activeModules.map((module) => (
                            <SortableModuleItem
                                key={module.id}
                                module={module}
                                isActive={true}
                                coverage={moduleCoverage[module.id] || 'missing'}
                                onRemove={() => removeModule(module.id)}
                                collapsed={sidebarCollapsed}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            {/* Add Module Button */}
            <div className="p-3 border-t border-white/10">
                <button
                    onClick={onOpenModulePicker}
                    className={`
            w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
            bg-gradient-to-r from-blue-500/20 to-purple-500/20
            border border-blue-500/30 text-blue-400
            hover:from-blue-500/30 hover:to-purple-500/30
            transition-all duration-200
          `}
                >
                    <Plus className="w-4 h-4" />
                    {!sidebarCollapsed && <span className="text-sm font-medium">Add Module</span>}
                </button>
            </div>
        </div>
    );
}

export default WorkspaceSidebar;
