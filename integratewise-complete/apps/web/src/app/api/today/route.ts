/**
 * Today API - Thin proxy to Views Worker
 * Routes today's items requests through the L3 views service
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
    service: 'views',
    path: '/v1/today',
    method: 'GET',
    queryParams,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  return proxyToService({
    service: 'views',
    path: '/v1/today',
    method: 'POST',
    body,
  });
}
