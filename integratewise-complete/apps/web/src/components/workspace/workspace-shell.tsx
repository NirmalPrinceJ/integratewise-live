"use client";

// src/components/workspace/workspace-shell.tsx
// Complete Workspace Shell - Sidebar + Main Content

import React, { useState } from 'react';
import { WorkspaceSidebar } from './workspace-sidebar';
import { ModulePicker } from './module-picker';
import { WidgetPicker } from './widget-picker';
import { HomeSkeleton } from './home-skeleton';
import { useWorkspaceBag } from '@/contexts/workspace-bag-context';

interface WorkspaceShellProps {
    children: React.ReactNode;
    showHomeSkeleton?: boolean;
}

export function WorkspaceShell({ children, showHomeSkeleton = false }: WorkspaceShellProps) {
    const [modulePickerOpen, setModulePickerOpen] = useState(false);
    const [widgetPickerOpen, setWidgetPickerOpen] = useState(false);
    const { sidebarCollapsed } = useWorkspaceBag();

    return (
        <div className="flex h-screen bg-gray-950">
            {/* Sidebar */}
            <WorkspaceSidebar onOpenModulePicker={() => setModulePickerOpen(true)} />

            {/* Main Content */}
            <main className={`flex-1 overflow-y-auto transition-all duration-300`}>
                <div className="max-w-5xl mx-auto p-6">
                    {showHomeSkeleton ? (
                        <HomeSkeleton onOpenWidgetPicker={() => setWidgetPickerOpen(true)} />
                    ) : (
                        children
                    )}
                </div>
            </main>

            {/* Module Picker Dialog */}
            <ModulePicker
                isOpen={modulePickerOpen}
                onClose={() => setModulePickerOpen(false)}
            />

            {/* Widget Picker Dialog */}
            <WidgetPicker
                isOpen={widgetPickerOpen}
                onClose={() => setWidgetPickerOpen(false)}
            />
        </div>
    );
}

export default WorkspaceShell;
