/**
 * GET /api/connectors/list
 * 
 * Returns live connector status for the authenticated user.
 * Proxies to the Tenants Worker /v1/connectors/list endpoint.
 */
import { NextResponse } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function GET() {
  try {
    const response = await proxyToService({
      service: 'tenants',
      path: '/v1/connectors/list',
      method: 'GET',
    });

    // proxyToService returns a NextResponse — pass it through
    return response;
  } catch (error) {
    console.error('[connectors/list] Error:', error);
    return NextResponse.json({ connectors: [] }, { status: 500 });
  }
}
