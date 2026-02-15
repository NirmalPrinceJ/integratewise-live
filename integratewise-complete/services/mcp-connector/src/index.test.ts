import { describe, it, expect, vi } from 'vitest';
import app from './index';

// Mock Firestore utility
vi.mock('./lib/firestore', () => ({
    updateFirestoreDocument: vi.fn().mockResolvedValue({}),
}));

describe('MCP Connector - Session Memory Capture', () => {
    const MCP_KEY = 'test-token';
    const env = {
        MCP_CONNECTOR_API_KEY: MCP_KEY,
        FIRESTORE_PROJECT_ID: 'test-project',
        ENVIRONMENT: 'test',
    };

    it('should return 401 if API key is missing', async () => {
        const res = await app.request('/v1/mcp/save_session_memory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        }, env);

        expect(res.status).toBe(401);
    });

    it('should return 401 if API key is invalid', async () => {
        const res = await app.request('/v1/mcp/save_session_memory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer invalid-key',
            },
            body: JSON.stringify({}),
        }, env);

        expect(res.status).toBe(401);
    });

    it('should return 400 if payload is invalid', async () => {
        const res = await app.request('/v1/mcp/save_session_memory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MCP_KEY}`,
            },
            body: JSON.stringify({
                tenant_id: 'tenant-1',
                // missing session_id, tool_source, etc.
            }),
        }, env);

        expect(res.status).toBe(400);
        const body: any = await res.json();
        expect(body.error).toBe('validation_failed');
    });

    it('should return 200 and store memories if payload is valid', async () => {
        const payload = {
            tenant_id: 'tenant-123',
            session_id: 'session-456',
            tool_source: 'claude',
            summary: 'Discussed project architecture.',
            memories: [
                {
                    memory_type: 'decision',
                    text: 'Use Cloudflare Workers for all edge services.',
                },
            ],
        };

        const res = await app.request('/v1/mcp/save_session_memory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MCP_KEY}`,
            },
            body: JSON.stringify(payload),
        }, env);

        expect(res.status).toBe(200);
        const result: any = await res.json();
        expect(result.status).toBe('success');
        expect(result.stored_memories).toBe(1);
        expect(result.tenant_id).toBe('tenant-123');
        expect(result.session_id).toBe('session-456');
    });

    it('should enforce memory limit (max 50)', async () => {
        const manyMemories = Array.from({ length: 51 }, (_, i) => ({
            memory_type: 'note',
            text: `Note ${i}`,
        }));

        const res = await app.request('/v1/mcp/save_session_memory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MCP_KEY}`,
            },
            body: JSON.stringify({
                tenant_id: 't1',
                session_id: 's1',
                tool_source: 'test',
                summary: 'too many',
                memories: manyMemories,
            }),
        }, env);

        expect(res.status).toBe(400);
        const body: any = await res.json();
        expect(body.error).toBe('validation_failed');
    });
});
