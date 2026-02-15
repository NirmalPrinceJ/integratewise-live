/**
 * Spine Health API Route - Thin proxy to Spine Worker
 */
import { NextRequest } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function GET() {
  return proxyToService({
    service: 'spine',
    path: '/v1/health',
    method: 'GET',
  });
}
