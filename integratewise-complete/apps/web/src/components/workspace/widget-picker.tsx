"use client";

// src/components/workspace/widget-picker.tsx
// Widget Picker - Pin widgets from modules to Home

import React, { useState } from 'react';
import { useWorkspaceBag } from '@/contexts/workspace-bag-context';
import { getModuleById } from '@/types/workspace-bag';
import type { ModuleWidget } from '@/types/workspace-bag';
import {
    Home, FolderKanban, Building2, Users, Brain, AlertTriangle,
    Rocket, BarChart3, Plus, X, Pin, Grid3X3
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
    Home, FolderKanban, Building2, Users, Brain, AlertTriangle, Rocket, BarChart3,
};

interface WidgetCardProps {
    widget: ModuleWidget;
    isPinned: boolean;
    onPin: () => void;
    onUnpin: () => void;
}

function WidgetCard({ widget, isPinned, onPin, onUnpin }: WidgetCardProps) {
    const module = getModuleById(widget.moduleId);
    const ModuleIcon = module ? ICON_MAP[module.icon] || Home : Home;

    return (
        <div className={`p-4 rounded-xl border transition-all ${isPinned ? 'bg-blue-500/10 border-blue-500/30' : 'bg-gray-800/50 border-gray-700/50 hover:border-blue-500/50'
            }`}>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isPinned ? 'bg-blue-500/20' : 'bg-gray-700/50'}`}>
                    <ModuleIcon className={`w-4 h-4 ${isPinned ? 'text-blue-400' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white text-sm">{widget.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{widget.description}</p>
                    {module && <p className="text-xs text-gray-600 mt-1">from {module.name}</p>}
                </div>
                <button
                    onClick={isPinned ? onUnpin : onPin}
                    className={`p-2 rounded-lg transition-colors ${isPinned ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                        }`}
                >
                    {isPinned ? <X className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}

interface WidgetPickerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WidgetPicker({ isOpen, onClose }: WidgetPickerProps) {
    const { pinnedWidgets, availableWidgets, activeModules, pinWidget, unpinWidget, moduleCoverage } = useWorkspaceBag();
    const [showPinned, setShowPinned] = useState(true);

    if (!isOpen) return null;

    const widgetsByModule = activeModules.reduce((acc, module) => {
        const mWidgets = module.widgets.filter(w => {
            const cov = moduleCoverage[module.id];
            if (w.minCoverage === 'ready') return cov === 'ready';
            if (w.minCoverage === 'sparse') return cov !== 'missing';
            return true;
        });
        if (mWidgets.length > 0) acc[module.id] = { module, widgets: mWidgets };
        return acc;
    }, {} as Record<string, { module: typeof activeModules[0]; widgets: ModuleWidget[] }>);

    const pinnedIds = pinnedWidgets.map(w => w.id);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl max-h-[80vh] bg-gray-900 rounded-2xl border border-white/10 shadow-2xl flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/20"><Grid3X3 className="w-5 h-5 text-blue-400" /></div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Home Widgets</h2>
                                <p className="text-sm text-gray-400">Pin widgets to Home</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button onClick={() => setShowPinned(true)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${showPinned ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800/50 text-gray-400'}`}>
                            Pinned ({pinnedWidgets.length})
                        </button>
                        <button onClick={() => setShowPinned(false)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${!showPinned ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800/50 text-gray-400'}`}>
                            Available ({availableWidgets.length})
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {showPinned ? (
                        pinnedWidgets.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No widgets pinned</div>
                        ) : (
                            pinnedWidgets.map(w => <WidgetCard key={w.id} widget={w} isPinned onPin={() => { }} onUnpin={() => unpinWidget(w.id)} />)
                        )
                    ) : (
                        Object.entries(widgetsByModule).map(([id, { module, widgets }]) => (
                            <div key={id}>
                                <h3 className="text-sm font-medium text-gray-400 mb-2">{module.name}</h3>
                                {widgets.map(w => <WidgetCard key={w.id} widget={w} isPinned={pinnedIds.includes(w.id)} onPin={() => pinWidget(w.id)} onUnpin={() => unpinWidget(w.id)} />)}
                            </div>
                        ))
                    )}
                </div>
                <div className="p-4 border-t border-white/10 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium">Done</button>
                </div>
            </div>
        </div>
    );
}

export default WidgetPicker;
