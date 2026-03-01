import { describe, it, expect, vi } from 'vitest';
import app from './index';

describe('Think Service', () => {
    it('should return health status', async () => {
        const res = await app.request('/health');
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body).toEqual({ status: 'ok', service: 'think' });
    });

    it('should require x-tenant-id for signals', async () => {
        const res = await app.request('/v1/signals');
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toBe('Missing x-tenant-id');
    });
});
