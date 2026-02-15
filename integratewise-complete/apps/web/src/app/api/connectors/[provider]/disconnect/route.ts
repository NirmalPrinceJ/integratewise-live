/**
 * Connector Disconnect API Route - Thin proxy to Tenants Worker
 */
import { NextRequest } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  return proxyToService({
    service: 'tenants',
    path: `/v1/connectors/${provider}/disconnect`,
    method: 'POST',
  });
}
