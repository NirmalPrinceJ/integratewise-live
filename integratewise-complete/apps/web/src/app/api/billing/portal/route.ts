/**
 * Billing Portal API Route - Thin proxy to Billing Worker
 */
import { NextRequest } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function POST() {
  return proxyToService({
    service: 'billing',
    path: '/v1/portal',
    method: 'POST',
  });
}
