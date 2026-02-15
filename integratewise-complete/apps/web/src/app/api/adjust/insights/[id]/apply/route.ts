/**
 * Apply Learning Insight API Route - Thin proxy to Govern Worker
 */
import { NextRequest } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    return proxyToService({
        service: 'govern',
        path: `/v1/adjust/insights/${id}/apply`,
        method: 'POST',
    });
}
