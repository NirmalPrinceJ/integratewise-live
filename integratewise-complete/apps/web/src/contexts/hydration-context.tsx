"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
    DataStrength,
    DataStrengthLevel,
    TenantHydrationStatus,
    ViewHydrationContext,
    HydrationState,
    DataStrengthUpdatedEvent,
    getUnlockedFeatures,
    levelToHydrationState
} from '@/types/data-strength';

interface HydrationContextType {
    // Current state
    status: TenantHydrationStatus | null;
    isLoading: boolean;
    error: string | null;

    // Derived values
    strength: DataStrength | null;
    level: DataStrengthLevel;
    hydrationState: HydrationState;
    unlockedFeatures: string[];

    // For L1 views
    getViewContext: (viewName: string) => ViewHydrationContext;

    // Actions
    refresh: () => Promise<void>;

    // Real-time updates
    lastUpdate: DataStrengthUpdatedEvent | null;
}

const HydrationContext = createContext<HydrationContextType | null>(null);

export function HydrationProvider({
    children,
    tenantId
}: {
    children: ReactNode;
    tenantId: string;
}) {
    const [status, setStatus] = useState<TenantHydrationStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<DataStrengthUpdatedEvent | null>(null);

    // Fetch initial hydration status
    const fetchStatus = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/hydration/status?tenant_id=${tenantId}`);
            if (!response.ok) throw new Error('Failed to fetch hydration status');
            const data = await response.json();
            setStatus(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, [tenantId]);

    // Initial fetch
    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    // Listen for real-time updates via custom event
    useEffect(() => {
        const handleStrengthUpdate = (event: CustomEvent<DataStrengthUpdatedEvent>) => {
            setLastUpdate(event.detail);
            // Update local status
            if (status) {
                setStatus({
                    ...status,
                    data_strength: {
                        ...status.data_strength,
                        score: event.detail.new_score,
                        level: event.detail.new_level
                    },
                    last_updated: event.detail.timestamp
                });
            }
        };

        window.addEventListener('iw:strength:updated', handleStrengthUpdate as EventListener);
        return () => {
            window.removeEventListener('iw:strength:updated', handleStrengthUpdate as EventListener);
        };
    }, [status]);

    // Derived values
    const strength = status?.data_strength || null;
    const level: DataStrengthLevel = strength?.level || 'seed';
    const hydrationState = levelToHydrationState(level);
    const unlockedFeatures = getUnlockedFeatures(level);

    // Get view-specific hydration context
    const getViewContext = useCallback((viewName: string): ViewHydrationContext => {
        if (!status) {
            return {
                state: 'empty',
                missing_sources: [],
                data_completeness: 0
            };
        }

        // Determine what this view needs
        const viewRequirements: Record<string, { needs: string[]; minEntities: number }> = {
            accounts: { needs: ['crm'], minEntities: status.spine_density.accounts },
            contacts: { needs: ['crm', 'email'], minEntities: status.spine_density.contacts },
            meetings: { needs: ['calendar', 'crm'], minEntities: status.spine_density.meetings },
            tasks: { needs: ['project_mgmt'], minEntities: status.spine_density.tasks },
            pipeline: { needs: ['crm'], minEntities: status.spine_density.deals },
            docs: { needs: ['storage'], minEntities: status.context_density.documents },
            knowledge: { needs: [], minEntities: status.knowledge_density.summaries },
            home: { needs: [], minEntities: 1 }
        };

        const req = viewRequirements[viewName] || { needs: [], minEntities: 0 };
        const connectedToolIds = status.connected_tools.map(t => t.tool_id);
        const missingSources = req.needs.filter(n => !connectedToolIds.includes(n));

        // Determine state for this view
        let state: HydrationState = 'empty';
        if (req.minEntities === 0) {
            state = 'empty';
        } else if (req.minEntities < 10) {
            state = 'seeding';
        } else if (missingSources.length > 0) {
            state = 'growing';
        } else {
            state = 'rich';
        }

        // Generate enrichment prompt if needed
        let enrichment_prompt;
        if (missingSources.length > 0) {
            enrichment_prompt = {
                message: `Connect ${missingSources[0]} to see more ${viewName} data`,
                action: `/settings/integrations/${missingSources[0]}`
            };
        }

        return {
            state,
            missing_sources: missingSources,
            enrichment_prompt,
            data_completeness: Math.min(100, (req.minEntities / 50) * 100)
        };
    }, [status]);

    return (
        <HydrationContext.Provider value={{
            status,
            isLoading,
            error,
            strength,
            level,
            hydrationState,
            unlockedFeatures,
            getViewContext,
            refresh: fetchStatus,
            lastUpdate
        }}>
            {children}
        </HydrationContext.Provider>
    );
}

export function useHydration() {
    const context = useContext(HydrationContext);
    // Return null if not in provider (safe for conditional rendering)
    return context;
}

// Strict version that throws if not in provider
export function useHydrationRequired() {
    const context = useContext(HydrationContext);
    if (!context) {
        throw new Error('useHydrationRequired must be used within HydrationProvider');
    }
    return context;
}

// Hook for L1 views to get their specific hydration context
export function useViewHydration(viewName: string) {
    const { getViewContext, hydrationState, level, strength } = useHydration();
    const viewContext = getViewContext(viewName);

    return {
        ...viewContext,
        globalState: hydrationState,
        globalLevel: level,
        globalStrength: strength,

        // Convenience booleans
        isEmpty: viewContext.state === 'empty',
        isSeeding: viewContext.state === 'seeding',
        isGrowing: viewContext.state === 'growing',
        isRich: viewContext.state === 'rich',

        // Feature checks
        canShowAISummaries: level === 'healthy' || level === 'rich',
        canShowHealthScores: level === 'healthy' || level === 'rich',
        canShowPredictions: level === 'rich'
    };
}
