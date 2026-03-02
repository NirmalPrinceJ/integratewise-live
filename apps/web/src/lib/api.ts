import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const API_BASE = import.meta.env.VITE_API_BASE_URL; // Gateway worker URL

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function apiCall<T = any>(path: string, options?: RequestInit): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'x-tenant-id': session.user.user_metadata?.tenant_id || '',
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Dashboard
  getDashboard: () => apiCall('/api/v1/workspace/dashboard'),
  
  // Entities
  getEntities: (type?: string) => apiCall(`/api/v1/workspace/entities${type ? `?type=${type}` : ''}`),
  getEntity: (id: string) => apiCall(`/api/v1/pipeline/entities/${id}`),
  
  // Signals
  getSignals: () => apiCall('/api/v1/cognitive/signals'),
  
  // HITL
  getApprovals: () => apiCall('/api/v1/cognitive/hitl/queue'),
  approve: (actionId: string) => apiCall('/api/v1/cognitive/hitl/queue', {
    method: 'POST', body: JSON.stringify({ action_id: actionId, decision: 'approve' }),
  }),
  deny: (actionId: string) => apiCall('/api/v1/cognitive/hitl/queue', {
    method: 'POST', body: JSON.stringify({ action_id: actionId, decision: 'deny' }),
  }),
  
  // Knowledge
  search: (query: string) => apiCall(`/api/v1/knowledge/search?q=${encodeURIComponent(query)}`),
  
  // Connectors
  listConnectors: () => apiCall('/api/v1/connector/list'),
  connectTool: (tool: string) => apiCall(`/api/v1/connector/oauth/init/${tool}`, { method: 'POST' }),
  
  // Manual data ingestion
  ingestData: (source: string, data: any[]) => apiCall('/api/v1/connector/ingest', {
    method: 'POST', body: JSON.stringify({ source, data }),
  }),
  
  // Brainstorm (Cmd+J)
  brainstorm: (prompt: string) => apiCall('/api/v1/brainstorm', {
    method: 'POST', body: JSON.stringify({ prompt }),
  }),
  
  // Audit
  getAuditLog: (limit?: number) => apiCall(`/api/v1/cognitive/audit?limit=${limit || 50}`),
};
