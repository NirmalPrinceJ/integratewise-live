/**
 * Brainstorm Analyze API Route - Thin proxy to Think Worker
 */
import { NextRequest } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.json();

  return proxyToService({
    service: 'think',
    path: '/v1/brainstorm/analyze',
    method: 'POST',
    body,
    timeout: 60000, // AI analysis can take longer
  });
}
