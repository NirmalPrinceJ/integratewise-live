/**
 * Onboarding Status API Route - Thin proxy to Tenants Worker
 */
import { NextRequest } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function GET() {
  return proxyToService({
    service: 'tenants',
    path: '/v1/onboarding/status',
    method: 'GET',
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  return proxyToService({
    service: 'tenants',
    path: '/v1/onboarding/status',
    method: 'POST',
    body,
  });
}
