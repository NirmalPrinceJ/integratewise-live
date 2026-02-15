/**
 * Brainstorm Execute API Route - Thin proxy to Act Worker
 */
import { NextRequest } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.json();

  return proxyToService({
    service: 'act',
    path: '/v1/brainstorm/execute',
    method: 'POST',
    body,
    timeout: 60000, // Execution can take longer
  });
}
