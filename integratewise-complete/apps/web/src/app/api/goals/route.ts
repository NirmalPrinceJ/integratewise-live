/**
 * Goals API Route - Thin proxy to Spine Worker
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
    service: 'spine',
    path: '/v1/goals',
    method: 'GET',
    queryParams,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  return proxyToService({
    service: 'spine',
    path: '/v1/goals',
    method: 'POST',
    body,
  });
}
