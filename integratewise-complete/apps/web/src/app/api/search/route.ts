/**
 * Search API - Thin proxy to Knowledge Worker
 * Routes search queries through the L3 knowledge service
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
    service: 'knowledge',
    path: '/v1/search',
    method: 'GET',
    queryParams,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  return proxyToService({
    service: 'knowledge',
    path: '/v1/search',
    method: 'POST',
    body,
  });
}
