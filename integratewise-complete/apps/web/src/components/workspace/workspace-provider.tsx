"use client";

// src/components/workspace/workspace-provider.tsx
// Combined provider wrapper for Hydration + Workspace Bag

import React from 'react';
import { HydrationProvider } from '@/contexts/hydration-context';
import { WorkspaceBagProvider } from '@/contexts/workspace-bag-context';
import type { PlanTier } from '@/types/workspace-bag';

interface WorkspaceProviderProps {
    children: React.ReactNode;
    userId: string;
    tenantId?: string;
    userRole?: string;
    currentPlan?: PlanTier;
    teamSize?: number;
    connectedTools?: string[];
    entityCounts?: Record<string, number>;
}

export function WorkspaceProvider({
    children,
    userId,
    tenantId = 'default',
    userRole = 'personal',
    currentPlan = 'free',
    teamSize = 1,
    connectedTools = [],
    entityCounts = {},
}: WorkspaceProviderProps) {
    return (
        <HydrationProvider tenantId={tenantId}>
            <WorkspaceBagProvider
                userId={userId}
                userRole={userRole}
                currentPlan={currentPlan}
                teamSize={teamSize}
                connectedTools={connectedTools}
                entityCounts={entityCounts}
            >
                {children}
            </WorkspaceBagProvider>
        </HydrationProvider>
    );
}

export default WorkspaceProvider;
