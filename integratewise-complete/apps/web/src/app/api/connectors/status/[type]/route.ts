import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * GET /api/connectors/status/[type]
 * Check current connector auth status
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const connectorType = params.type;
    const bucketId = req.nextUrl.searchParams.get('bucketId');

    if (!bucketId) {
      return NextResponse.json(
        { error: 'Missing bucketId' },
        { status: 400 }
      );
    }

    const result = await db.query(
      `
      SELECT 
        connector_status,
        last_sync_at,
        next_sync_at,
        sync_frequency,
        error_code,
        error_message
      FROM base_buckets
      WHERE bucket_id = $1
      `,
      [bucketId]
    );

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'Bucket not found' }, { status: 404 });
    }

    const bucket = result.rows[0];

    return NextResponse.json({
      connectorType,
      status: bucket.connector_status || 'disconnected',
      lastSyncAt: bucket.last_sync_at,
      nextSyncAt: bucket.next_sync_at,
      syncFrequency: bucket.sync_frequency,
      errorCode: bucket.error_code,
      errorMessage: bucket.error_message,
    });
  } catch (error) {
    console.error('GET /api/connectors/status error:', error);
    return NextResponse.json(
      { error: 'Failed to get connector status' },
      { status: 500 }
    );
  }
}
