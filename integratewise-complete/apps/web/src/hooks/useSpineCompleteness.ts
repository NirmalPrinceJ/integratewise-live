/**
 * useSpineCompleteness Hook
 * 
 * Fetches completeness scores from Spine (L3) for L2→L1 wiring.
 * Used by EntityCardWithBadges to display data quality status.
 */

import { useState, useEffect, useCallback } from "react";

interface CompletenessData {
  entityId: string;
  entityType: string;
  completeness: number; // 0-1
  missingFields: string[];
  discoveredSchema: string[];
  lastSynced: string;
}

interface UseSpineCompletenessOptions {
  entityIds: string[];
  entityType?: string;
  pollInterval?: number; // ms, default: 30000
}

export function useSpineCompleteness({
  entityIds,
  entityType = "account",
  pollInterval = 30000,
}: UseSpineCompletenessOptions) {
  const [data, setData] = useState<Map<string, CompletenessData>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompleteness = useCallback(async () => {
    if (entityIds.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/spine/completeness?entityIds=${entityIds.join(",")}&entityType=${entityType}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch completeness: ${response.statusText}`);
      }

      const result = await response.json();
      const dataMap = new Map<string, CompletenessData>();

      for (const item of result.data) {
        dataMap.set(item.entityId, item);
      }

      setData(dataMap);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("[useSpineCompleteness] Failed:", err);
    } finally {
      setLoading(false);
    }
  }, [entityIds, entityType]);

  // Initial fetch
  useEffect(() => {
    fetchCompleteness();
  }, [fetchCompleteness]);

  // Polling
  useEffect(() => {
    if (pollInterval <= 0) return;

    const interval = setInterval(fetchCompleteness, pollInterval);
    return () => clearInterval(interval);
  }, [fetchCompleteness, pollInterval]);

  // Listen for cognitive events
  useEffect(() => {
    const handleEvent = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (
          data.type === "ingestion_complete" &&
          entityIds.includes(data.payload.entityId)
        ) {
          // Refetch when relevant entity is updated
          fetchCompleteness();
        }
      } catch {
        // Ignore parse errors
      }
    };

    // Connect to SSE
    const eventSource = new EventSource("/api/events/cognitive");
    eventSource.onmessage = handleEvent;

    return () => {
      eventSource.close();
    };
  }, [entityIds, fetchCompleteness]);

  return {
    data,
    loading,
    error,
    refetch: fetchCompleteness,
    getCompleteness: (entityId: string) => data.get(entityId),
  };
}

/**
 * Hook for single entity completeness
 */
export function useEntityCompleteness(
  entityId: string,
  entityType?: string
) {
  const { data, loading, error, refetch } = useSpineCompleteness({
    entityIds: [entityId],
    entityType,
  });

  return {
    completeness: data.get(entityId),
    loading,
    error,
    refetch,
  };
}
