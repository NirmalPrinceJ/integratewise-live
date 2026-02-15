import { useEntities } from "./useEntities";

export interface DealData {
    id: string;
    name: string;
    account: string;
    value: number;
    stage: string;
    probability: number;
    closeDate: string;
    owner: string;
    type: "new_business" | "expansion" | "renewal";
    status: "active" | "lost" | "won" | "at_risk";
    daysInStage: number;
    nextAction: string | null;
}

interface UseDealsOptions {
    search?: string;
    stage?: string;
    status?: string;
    limit?: number;
}

export function useDeals(options: UseDealsOptions = {}) {
    // Pipeline deals are "deal" entities in Spine
    const { entities, isLoading, error, refresh } = useEntities<DealData>("deal", {
        search: options.search,
        filters: {
            ...(options.stage && { stage: options.stage }),
            ...(options.status && { status: options.status }),
            ...(options.limit && { limit: options.limit.toString() }),
        }
    });

    return {
        deals: entities,
        isLoading,
        error,
        refresh,
    };
}
