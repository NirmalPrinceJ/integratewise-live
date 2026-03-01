import { apiFetch } from '../../../lib/api-client';
import type {
  KnowledgeDocument,
  KnowledgeTopic,
  KnowledgeSearchResult,
  InboxItem,
  Session,
} from '../types';

export async function fetchDocuments(params?: Record<string, any>): Promise<KnowledgeDocument[]> {
  try {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const data = await apiFetch<KnowledgeDocument[]>(`/api/v1/knowledge/documents${qs}`);
    return data || [];
  } catch (err) {
    console.error('Failed to fetch documents:', err);
    return [];
  }
}

export async function fetchTopics(): Promise<KnowledgeTopic[]> {
  try {
    const data = await apiFetch<KnowledgeTopic[]>('/api/v1/knowledge/topics');
    return data || [];
  } catch (err) {
    console.error('Failed to fetch topics:', err);
    return [];
  }
}

export async function getTopics(): Promise<KnowledgeTopic[]> {
  return fetchTopics();
}

export async function saveTopic(topic: Partial<KnowledgeTopic>): Promise<KnowledgeTopic> {
  try {
    if (topic.id) {
      const data = await apiFetch<KnowledgeTopic>(`/api/v1/knowledge/topics/${topic.id}`, {
        method: 'PUT',
        body: topic,
      });
      return data;
    } else {
      const data = await apiFetch<KnowledgeTopic>('/api/v1/knowledge/topics', {
        method: 'POST',
        body: topic,
      });
      return data;
    }
  } catch (err) {
    console.error('Failed to save topic:', err);
    throw err;
  }
}

export async function deleteTopic(id: string): Promise<void> {
  try {
    await apiFetch(`/api/v1/knowledge/topics/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Failed to delete topic:', err);
    throw err;
  }
}

export async function searchKnowledge(query: string): Promise<KnowledgeSearchResult[]> {
  try {
    const data = await apiFetch<KnowledgeSearchResult[]>('/api/v1/knowledge/search', {
      method: 'POST',
      body: { query },
    });
    return data || [];
  } catch (err) {
    console.error('Failed to search knowledge:', err);
    return [];
  }
}

export async function searchSessions(query: string): Promise<Session[]> {
  try {
    const qs = '?' + new URLSearchParams({ q: query }).toString();
    const data = await apiFetch<Session[]>(`/api/v1/knowledge/sessions/search${qs}`);
    return data || [];
  } catch (err) {
    console.error('Failed to search sessions:', err);
    return [];
  }
}

export async function fetchInbox(): Promise<InboxItem[]> {
  try {
    const data = await apiFetch<InboxItem[]>('/api/v1/knowledge/inbox');
    return data || [];
  } catch (err) {
    console.error('Failed to fetch inbox:', err);
    return [];
  }
}

export async function getSessions(): Promise<Session[]> {
  try {
    const data = await apiFetch<Session[]>('/api/v1/knowledge/sessions');
    return data || [];
  } catch (err) {
    console.error('Failed to fetch sessions:', err);
    return [];
  }
}

export async function processDocument(id: string): Promise<void> {
  try {
    await apiFetch(`/api/v1/knowledge/documents/${id}/process`, { method: 'POST' });
  } catch (err) {
    console.error('Failed to process document:', err);
    throw err;
  }
}
