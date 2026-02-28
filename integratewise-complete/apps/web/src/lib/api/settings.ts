/**
 * Settings API - User preferences and workspace configuration
 * L3: User preferences stored in Supabase
 */

import { supabase } from './supabase';

export interface UserSettings {
  id?: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    slack: boolean;
    digest: 'daily' | 'weekly' | 'never';
  };
  dashboard: {
    defaultView: 'customer-success' | 'sales' | 'revops' | 'marketing' | 'product-eng' | 'finance' | 'service' | 'procurement' | 'it-admin' | 'education' | 'personal' | 'bizops';
    showSignals: boolean;
    compactMode: boolean;
  };
  integrations: {
    autoSync: boolean;
    syncInterval: number; // minutes
    conflictResolution: 'manual' | 'auto-prefer-source' | 'auto-prefer-target';
  };
  updatedAt?: string;
}

export interface WorkspaceSettings {
  id?: string;
  workspaceId: string;
  name: string;
  description?: string;
  logoUrl?: string;
  industry?: string;
  companySize?: string;
  timezone: string;
  fiscalYearStart?: string;
  currency: string;
  features: {
    aiInsights: boolean;
    signals: boolean;
    automation: boolean;
    auditLog: boolean;
  };
  dataRetention: {
    auditLogs: number; // days
    deletedRecords: number; // days
    activityHistory: number; // days
  };
  updatedAt?: string;
}

/**
 * Get current user settings
 */
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found - create defaults
        return createDefaultUserSettings(userId);
      }
      throw error;
    }
    
    return transformFromDb(data);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return createDefaultUserSettings(userId);
  }
}

/**
 * Update user settings
 */
export async function updateUserSettings(
  userId: string, 
  settings: Partial<UserSettings>
): Promise<UserSettings | null> {
  try {
    const dbSettings = transformToDb({ ...settings, userId });
    
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...dbSettings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return transformFromDb(data);
  } catch (error) {
    console.error('Error updating user settings:', error);
    return null;
  }
}

/**
 * Get workspace settings
 */
export async function getWorkspaceSettings(workspaceId: string): Promise<WorkspaceSettings | null> {
  try {
    const { data, error } = await supabase
      .from('workspace_settings')
      .select('*')
      .eq('workspace_id', workspaceId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return createDefaultWorkspaceSettings(workspaceId);
      }
      throw error;
    }
    
    return transformWorkspaceFromDb(data);
  } catch (error) {
    console.error('Error fetching workspace settings:', error);
    return createDefaultWorkspaceSettings(workspaceId);
  }
}

/**
 * Update workspace settings
 */
export async function updateWorkspaceSettings(
  workspaceId: string,
  settings: Partial<WorkspaceSettings>
): Promise<WorkspaceSettings | null> {
  try {
    const dbSettings = transformWorkspaceToDb({ ...settings, workspaceId });
    
    const { data, error } = await supabase
      .from('workspace_settings')
      .upsert({
        workspace_id: workspaceId,
        ...dbSettings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return transformWorkspaceFromDb(data);
  } catch (error) {
    console.error('Error updating workspace settings:', error);
    return null;
  }
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences(userId: string): Promise<UserSettings['notifications'] | null> {
  const settings = await getUserSettings(userId);
  return settings?.notifications || null;
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  notifications: Partial<UserSettings['notifications']>
): Promise<boolean> {
  const current = await getUserSettings(userId);
  if (!current) return false;
  
  const updated = await updateUserSettings(userId, {
    notifications: { ...current.notifications, ...notifications },
  });
  
  return !!updated;
}

/**
 * Get connected integrations
 */
export async function getConnectedIntegrations(workspaceId: string): Promise<{
  id: string;
  name: string;
  provider: string;
  status: 'active' | 'error' | 'paused';
  lastSyncAt?: string;
  config: Record<string, any>;
}[]> {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data?.map(integration => ({
      id: integration.id,
      name: integration.name,
      provider: integration.provider,
      status: integration.status,
      lastSyncAt: integration.last_sync_at,
      config: integration.config || {},
    })) || [];
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return [];
  }
}

/**
 * Disconnect an integration
 */
export async function disconnectIntegration(integrationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', integrationId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error disconnecting integration:', error);
    return false;
  }
}

/**
 * Get audit log for user actions
 */
export async function getUserAuditLog(
  userId: string,
  options?: { limit?: number; offset?: number; type?: string }
): Promise<{
  id: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}[]> {
  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    if (options?.type) query = query.eq('action', options.type);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data?.map(log => ({
      id: log.id,
      action: log.action,
      resourceType: log.resource_type,
      resourceId: log.resource_id,
      metadata: log.metadata,
      createdAt: log.created_at,
    })) || [];
  } catch (error) {
    console.error('Error fetching audit log:', error);
    return [];
  }
}

// Helper functions
function createDefaultUserSettings(userId: string): UserSettings {
  return {
    userId,
    theme: 'system',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      slack: false,
      digest: 'daily',
    },
    dashboard: {
      defaultView: 'customer-success',
      showSignals: true,
      compactMode: false,
    },
    integrations: {
      autoSync: true,
      syncInterval: 15,
      conflictResolution: 'manual',
    },
  };
}

function createDefaultWorkspaceSettings(workspaceId: string): WorkspaceSettings {
  return {
    workspaceId,
    name: 'My Workspace',
    timezone: 'UTC',
    currency: 'USD',
    features: {
      aiInsights: true,
      signals: true,
      automation: true,
      auditLog: true,
    },
    dataRetention: {
      auditLogs: 365,
      deletedRecords: 30,
      activityHistory: 90,
    },
  };
}

function transformFromDb(data: any): UserSettings {
  return {
    id: data.id,
    userId: data.user_id,
    theme: data.theme,
    timezone: data.timezone,
    dateFormat: data.date_format,
    currency: data.currency,
    language: data.language,
    notifications: data.notifications,
    dashboard: data.dashboard,
    integrations: data.integrations,
    updatedAt: data.updated_at,
  };
}

function transformToDb(settings: Partial<UserSettings>): any {
  return {
    theme: settings.theme,
    timezone: settings.timezone,
    date_format: settings.dateFormat,
    currency: settings.currency,
    language: settings.language,
    notifications: settings.notifications,
    dashboard: settings.dashboard,
    integrations: settings.integrations,
  };
}

function transformWorkspaceFromDb(data: any): WorkspaceSettings {
  return {
    id: data.id,
    workspaceId: data.workspace_id,
    name: data.name,
    description: data.description,
    logoUrl: data.logo_url,
    industry: data.industry,
    companySize: data.company_size,
    timezone: data.timezone,
    fiscalYearStart: data.fiscal_year_start,
    currency: data.currency,
    features: data.features,
    dataRetention: data.data_retention,
    updatedAt: data.updated_at,
  };
}

function transformWorkspaceToDb(settings: Partial<WorkspaceSettings>): any {
  return {
    name: settings.name,
    description: settings.description,
    logo_url: settings.logoUrl,
    industry: settings.industry,
    company_size: settings.companySize,
    timezone: settings.timezone,
    fiscal_year_start: settings.fiscalYearStart,
    currency: settings.currency,
    features: settings.features,
    data_retention: settings.dataRetention,
  };
}
