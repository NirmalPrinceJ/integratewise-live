/**
 * Adjust Insights API Route - Thin proxy to Govern Worker
 */
import { NextRequest } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const queryParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
        queryParams[key] = value;
    });

    return proxyToService({
        service: 'govern',
        path: '/v1/adjust/insights',
        method: 'GET',
        queryParams,
    });
}
