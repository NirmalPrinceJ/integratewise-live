/**
 * Integrations API Route - Thin proxy to Tenants Worker
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
    service: 'tenants',
    path: '/v1/integrations',
    method: 'GET',
    queryParams,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  return proxyToService({
    service: 'tenants',
    path: '/v1/integrations',
    method: 'POST',
    body,
  });
}
