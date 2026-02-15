/**
 * Insights API Route - Thin proxy to Think Worker
 */
import { NextRequest, NextResponse } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return proxyToService({
    service: 'think',
    path: '/v1/insights',
    method: 'GET',
    queryParams,
  });
}
