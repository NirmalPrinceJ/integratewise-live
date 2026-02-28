/**
 * Settings Hook - User preferences and workspace configuration
 * L1: Settings UI data access
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getUserSettings,
  updateUserSettings,
  getWorkspaceSettings,
  updateWorkspaceSettings,
  getConnectedIntegrations,
  disconnectIntegration,
  getUserAuditLog,
  type UserSettings,
  type WorkspaceSettings,
} from '../lib/api/settings';
import { useAuth } from './useAuth';

/**
 * Hook for user settings
 */
export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getUserSettings(user.id);
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const update = useCallback(async (updates: Partial<UserSettings>) => {
    if (!user?.id) return false;
    try {
      setSaving(true);
      const updated = await updateUserSettings(user.id, updates);
      if (updated) {
        setSettings(updated);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update settings:', err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { settings, loading, error, saving, refresh, update };
}

/**
 * Hook for workspace settings
 */
export function useWorkspaceSettings() {
  const [settings, setSettings] = useState<WorkspaceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const refresh = useCallback(async () => {
    if (!user?.workspaceId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getWorkspaceSettings(user.workspaceId);
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workspace settings');
    } finally {
      setLoading(false);
    }
  }, [user?.workspaceId]);

  const update = useCallback(async (updates: Partial<WorkspaceSettings>) => {
    if (!user?.workspaceId) return false;
    try {
      setSaving(true);
      const updated = await updateWorkspaceSettings(user.workspaceId, updates);
      if (updated) {
        setSettings(updated);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update workspace settings:', err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [user?.workspaceId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { settings, loading, error, saving, refresh, update };
}

/**
 * Hook for connected integrations
 */
export function useIntegrations() {
  const [integrations, setIntegrations] = useState<{
    id: string;
    name: string;
    provider: string;
    status: 'active' | 'error' | 'paused';
    lastSyncAt?: string;
    config: Record<string, any>;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const refresh = useCallback(async () => {
    if (!user?.workspaceId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getConnectedIntegrations(user.workspaceId);
      setIntegrations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load integrations');
    } finally {
      setLoading(false);
    }
  }, [user?.workspaceId]);

  const disconnect = useCallback(async (integrationId: string) => {
    const success = await disconnectIntegration(integrationId);
    if (success) {
      setIntegrations(prev => prev.filter(i => i.id !== integrationId));
    }
    return success;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { integrations, loading, error, refresh, disconnect };
}

/**
 * Hook for user audit log
 */
export function useAuditLog(options?: { limit?: number; type?: string }) {
  const [logs, setLogs] = useState<{
    id: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    metadata?: Record<string, any>;
    createdAt: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getUserAuditLog(user.id, options);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit log');
    } finally {
      setLoading(false);
    }
  }, [user?.id, options?.limit, options?.type]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { logs, loading, error, refresh };
}

/**
 * Combined settings hook
 */
export function useSettings() {
  const userSettings = useUserSettings();
  const workspaceSettings = useWorkspaceSettings();
  const integrations = useIntegrations();

  const refreshAll = useCallback(async () => {
    await Promise.all([
      userSettings.refresh(),
      workspaceSettings.refresh(),
      integrations.refresh(),
    ]);
  }, [userSettings.refresh, workspaceSettings.refresh, integrations.refresh]);

  return {
    user: userSettings,
    workspace: workspaceSettings,
    integrations,
    refreshAll,
  };
}
