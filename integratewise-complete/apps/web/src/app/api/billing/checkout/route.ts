/**
 * Billing Checkout API Route - Thin proxy to Billing Worker
 */
import { NextRequest } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.json();

  return proxyToService({
    service: 'billing',
    path: '/v1/checkout',
    method: 'POST',
    body,
  });
}
