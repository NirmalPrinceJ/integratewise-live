/**
 * Bridge Fusions API Route - Thin proxy to Spine Worker
 */
import { NextRequest } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const queryParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
        queryParams[key] = value;
    });

    // Default limit if not provided
    if (!queryParams.limit) {
        queryParams.limit = '50';
    }

    return proxyToService({
        service: 'spine',
        path: '/v1/bridge/fusions',
        method: 'GET',
        queryParams,
    });
}
