/**
 * Dashboard Hook - Business metrics and domain data
 * L1: Workspace data access layer
 * Supports all 12 domains
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getDashboardStats,
  getDomainEntities,
  getRecentActivity,
  getDomainSignals,
  getConnectorStatuses,
  type DashboardStats,
  type DomainEntity,
  type DomainSignal,
  type DomainId,
} from '../lib/api/dashboard';

/**
 * Hook for dashboard statistics
 */
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
}

/**
 * Hook for domain-specific entities - all 12 domains
 */
export function useDomainEntities(domain: DomainId) {
  const [entities, setEntities] = useState<DomainEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDomainEntities(domain);
      setEntities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load domain entities');
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { entities, loading, error, refresh };
}

/**
 * Hook for recent activity feed
 */
export function useRecentActivity(limit: number = 20) {
  const [activities, setActivities] = useState<{
    id: string;
    type: 'entity' | 'insight' | 'action' | 'task' | 'event';
    title: string;
    description: string;
    timestamp: string;
    entityId?: string;
    status?: 'completed' | 'pending' | 'failed';
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecentActivity(limit);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activity');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { activities, loading, error, refresh };
}

/**
 * Hook for domain signals/alerts - all 12 domains
 */
export function useDomainSignals(domain: DomainId) {
  const [signals, setSignals] = useState<DomainSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDomainSignals(domain);
      setSignals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load signals');
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { signals, loading, error, refresh };
}

/**
 * Hook for connector statuses
 */
export function useConnectors() {
  const [connectors, setConnectors] = useState<{ name: string; status: 'active' | 'error' | 'syncing'; lastSync?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getConnectorStatuses();
      setConnectors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connectors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { connectors, loading, error, refresh };
}

/**
 * Combined hook for all dashboard data
 */
export function useDashboard() {
  const stats = useDashboardStats();
  const activity = useRecentActivity();
  const connectors = useConnectors();

  const refreshAll = useCallback(async () => {
    await Promise.all([
      stats.refresh(),
      activity.refresh(),
      connectors.refresh(),
    ]);
  }, [stats.refresh, activity.refresh, connectors.refresh]);

  return {
    stats,
    activity,
    connectors,
    refreshAll,
  };
}

// Re-export types
export type { DomainId };
