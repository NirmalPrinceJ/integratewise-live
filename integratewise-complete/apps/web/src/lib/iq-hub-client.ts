/**
 * IQ Hub Client
 * 
 * High-level client for the IQ-Hub worker.
 * Handles AI chat, memory management, and cognitive operations.
 */
import { iqHub } from '@/lib/db';

export interface ChatRequest {
    message: string;
    context?: Record<string, any>;
    conversation_id?: string;
    correlation_id?: string;
}

export interface ChatResponse {
    message: string;
    conversation_id: string;
    suggested_actions?: any[];
}

export class IQHubClient {
    /**
     * Send a chat message to the IQ-Hub service
     */
    async chat(request: ChatRequest): Promise<ChatResponse> {
        return iqHub.post<ChatResponse>('/v1/chat', request);
    }

    /**
     * Get a conversation by ID
     */
    async getConversation(id: string): Promise<any> {
        return iqHub.get<any>(`/v1/conversations/${id}`);
    }

    /**
     * List memories with optional filtering
     */
    async listMemories(params?: Record<string, string>): Promise<any[]> {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return iqHub.get<any[]>(`/v1/memories${query}`);
    }

    /**
     * Confirm or update a memory
     */
    async confirmMemory(id: string, updates?: Record<string, any>): Promise<any> {
        return iqHub.post<any>(`/v1/memories/${id}/confirm`, updates);
    }
}

export const iqHubClient = new IQHubClient();
