import { useState, useEffect, useCallback } from "react";
import { getInsights, getInsightStats, Insight } from "../lib/api";

export function useInsights(options: {
  entityId?: string;
  type?: string;
} = {}) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getInsights(options);
      setInsights(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [options.entityId, options.type]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const dismiss = useCallback(async (id: string) => {
    // Implementation would call API
    setInsights((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { insights, loading, error, refetch: fetchInsights, dismiss };
}

export function useInsightStats() {
  const [stats, setStats] = useState<{
    total: number;
    risk: number;
    opportunity: number;
    anomaly: number;
    growth: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getInsightStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch insight stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading };
}
