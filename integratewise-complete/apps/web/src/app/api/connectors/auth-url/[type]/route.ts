import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import crypto from 'crypto';
import { db } from '@/lib/db';

/**
 * GET /api/connectors/auth-url/[type]
 * Generate OAuth authorization URL for connector
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const connectorType = params.type;
    const tenantId = req.nextUrl.searchParams.get('tenantId');
    const bucketId = req.nextUrl.searchParams.get('bucketId');
    const bucketType = req.nextUrl.searchParams.get('bucketType');

    if (!bucketId || !bucketType) {
      return NextResponse.json(
        { error: 'Missing bucketId or bucketType' },
        { status: 400 }
      );
    }

    // OAuth provider configuration
    const providers: Record<string, { authUrl: string; scope: string[] }> = {
      salesforce: {
        authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
        scope: ['api', 'refresh_token', 'offline_access'],
      },
      hubspot: {
        authUrl: 'https://app.hubspot.com/oauth/authorize',
        scope: ['contacts', 'crm.objects.companies.read'],
      },
      google_calendar: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      },
      google_drive: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scope: ['https://www.googleapis.com/auth/drive.readonly'],
      },
      slack: {
        authUrl: 'https://slack.com/oauth/v2/authorize',
        scope: ['channels:read', 'users:read', 'chat:read'],
      },
    };

    const provider = providers[connectorType];
    if (!provider) {
      return NextResponse.json(
        { error: `Unknown connector: ${connectorType}` },
        { status: 400 }
      );
    }

    // Generate state token for CSRF protection
    const stateToken = crypto.randomBytes(32).toString('hex');
    const stateData = { tenantId, bucketId, bucketType, connectorType };

    // Store state in DB (expires in 15 minutes)
    await db.query(
      `
      INSERT INTO connector_auth_state (state_token, state_data, expires_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '15 minutes')
      `,
      [stateToken, JSON.stringify(stateData)]
    );

    // Build authorization URL
    const authUrl = new URL(provider.authUrl);
    authUrl.searchParams.set('client_id', process.env[`${connectorType.toUpperCase()}_CLIENT_ID`] || '');
    authUrl.searchParams.set('redirect_uri', process.env.CONNECTOR_CALLBACK_URL || '');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', provider.scope.join(' '));
    authUrl.searchParams.set('state', stateToken);

    return NextResponse.json({
      authUrl: authUrl.toString(),
      stateToken,
    });
  } catch (error) {
    console.error('GET /api/connectors/auth-url error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
