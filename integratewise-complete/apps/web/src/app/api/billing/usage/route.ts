/**
 * Billing Usage API Route - Thin proxy to Billing Worker
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
    service: 'billing',
    path: '/v1/usage',
    method: 'GET',
    queryParams,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  return proxyToService({
    service: 'billing',
    path: '/v1/usage',
    method: 'POST',
    body,
  });
}
