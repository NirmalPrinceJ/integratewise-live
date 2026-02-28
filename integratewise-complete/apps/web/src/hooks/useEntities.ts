import { useState, useEffect, useCallback } from "react";
import { getEntities, getEntityWithContext, getEntityStats, Entity360, EntityWithContext } from "../lib/api";

export function useEntities(options: {
  type?: string;
  health?: string;
  completeness?: string;
  search?: string;
} = {}) {
  const [entities, setEntities] = useState<Entity360[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEntities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEntities(options);
      setEntities(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [options.type, options.health, options.completeness, options.search]);

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  return { entities, loading, error, refetch: fetchEntities };
}

export function useEntityWithContext(id: string | null) {
  const [entity, setEntity] = useState<EntityWithContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchEntity() {
      try {
        setLoading(true);
        const data = await getEntityWithContext(id);
        setEntity(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntity();
  }, [id]);

  return { entity, loading, error };
}

export function useEntityStats() {
  const [stats, setStats] = useState<{
    total: number;
    healthy: number;
    atRisk: number;
    critical: number;
    complete: number;
    partial: number;
    incomplete: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getEntityStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading };
}
