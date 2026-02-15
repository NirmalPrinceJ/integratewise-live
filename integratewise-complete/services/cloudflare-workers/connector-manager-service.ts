/**
 * L3 Connector Manager Service
 * 
 * Handles:
 * - OAuth flow for third-party connectors (Salesforce, Google, Slack, etc.)
 * - Credential storage (encrypted in DB)
 * - Sync scheduling and orchestration
 * - Health checks and error recovery
 * 
 * Deploy to: Cloudflare Workers (Hono) or Node.js backend
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Context } from 'hono';
import crypto from 'crypto';

type Env = {
  NEON_DB_URL: string;
  CONNECTOR_ENCRYPTION_KEY: string;
  // OAuth client credentials
  SALESFORCE_CLIENT_ID: string;
  SALESFORCE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  SLACK_CLIENT_ID: string;
  SLACK_CLIENT_SECRET: string;
  HUBSPOT_CLIENT_ID: string;
  HUBSPOT_CLIENT_SECRET: string;
  // Callback URL
  CONNECTOR_CALLBACK_URL: string;
};

interface ConnectorConfig {
  connectorType: string;
  tenantId: string;
  bucketId: string;
  bucketType: string;
  state: 'waiting_auth' | 'connected' | 'error' | 'disconnected';
  credentials?: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
    scope?: string[];
  };
  lastSyncAt?: string;
  nextSyncAt?: string;
  syncFrequency: string; // '1h', '6h', '24h'
  errorCode?: string;
  errorMessage?: string;
}

interface OAuthProvider {
  authorizationUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  scope: string[];
  redirectUri: string;
}

/**
 * OAuth Provider Registry
 */
const oauthProviders: Record<string, OAuthProvider> = {
  salesforce: {
    authorizationUrl: 'https://login.salesforce.com/services/oauth2/authorize',
    tokenUrl: 'https://login.salesforce.com/services/oauth2/token',
    clientId: '', // From env
    clientSecret: '', // From env
    scope: ['api', 'refresh_token'],
    redirectUri: '', // From env
  },
  google_calendar: {
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    clientId: '',
    clientSecret: '',
    scope: ['https://www.googleapis.com/auth/calendar.readonly', 'profile', 'email'],
    redirectUri: '',
  },
  google_drive: {
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    clientId: '',
    clientSecret: '',
    scope: ['https://www.googleapis.com/auth/drive.readonly', 'profile', 'email'],
    redirectUri: '',
  },
  slack: {
    authorizationUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    clientId: '',
    clientSecret: '',
    scope: ['channels:read', 'users:read', 'chat:read'],
    redirectUri: '',
  },
  hubspot: {
    authorizationUrl: 'https://app.hubspot.com/oauth/authorize',
    tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
    clientId: '',
    clientSecret: '',
    scope: ['contacts', 'crm.objects.companies.read'],
    redirectUri: '',
  },
};

/**
 * Connector Manager App
 */
const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

/**
 * GET /connector/auth-url/:connectorType
 * Generate OAuth authorization URL for user
 */
app.get('/connector/auth-url/:connectorType', (c: Context<{ Bindings: Env }>) => {
  const connectorType = c.req.param('connectorType');
  const tenantId = c.req.query('tenantId');
  const bucketId = c.req.query('bucketId');
  const bucketType = c.req.query('bucketType');

  if (!tenantId || !bucketId || !bucketType) {
    return c.json(
      { error: 'Missing required params: tenantId, bucketId, bucketType' },
      400
    );
  }

  const provider = oauthProviders[connectorType];
  if (!provider) {
    return c.json({ error: `Unknown connector: ${connectorType}` }, 400);
  }

  // Generate state token for CSRF protection
  const stateToken = crypto.randomBytes(32).toString('hex');
  const stateData = JSON.stringify({ tenantId, bucketId, bucketType, connectorType });

  // Store state in DB for verification later
  // TODO: store stateData with expiry (5 min)

  // Build auth URL
  const authUrl = new URL(provider.authorizationUrl);
  authUrl.searchParams.set('client_id', c.env[`${connectorType.toUpperCase()}_CLIENT_ID`] || '');
  authUrl.searchParams.set('redirect_uri', c.env.CONNECTOR_CALLBACK_URL);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', provider.scope.join(' '));
  authUrl.searchParams.set('state', stateToken);

  return c.json({
    authUrl: authUrl.toString(),
    stateToken,
  });
});

/**
 * POST /connector/callback
 * OAuth callback handler
 * body: { code, state, tenantId, bucketId, bucketType, connectorType }
 */
app.post('/connector/callback', async (c: Context<{ Bindings: Env }>) => {
  try {
    const { code, state, connectorType } = await c.req.json();

    if (!code || !state) {
      return c.json({ error: 'Missing code or state' }, 400);
    }

    // Verify state token
    // TODO: retrieve stateData from DB using state

    const provider = oauthProviders[connectorType];
    if (!provider) {
      return c.json({ error: `Unknown connector: ${connectorType}` }, 400);
    }

    // Exchange code for access token
    const tokenResponse = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: c.env[`${connectorType.toUpperCase()}_CLIENT_ID`] || '',
        client_secret: c.env[`${connectorType.toUpperCase()}_CLIENT_SECRET`] || '',
        redirect_uri: c.env.CONNECTOR_CALLBACK_URL,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      return c.json({ error: `Token exchange failed: ${error.error_description}` }, 400);
    }

    const tokenData = await tokenResponse.json();

    // Encrypt and store credentials
    // TODO: store encrypted credentials in DB
    // Update connector_config in base_buckets table

    return c.json({
      success: true,
      connectorConnected: true,
      expiresAt: tokenData.expires_in ? Date.now() + tokenData.expires_in * 1000 : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: `Callback failed: ${message}` }, 500);
  }
});

/**
 * GET /connector/status/:connectorType
 * Check current connector auth status
 */
app.get('/connector/status/:connectorType', async (c: Context<{ Bindings: Env }>) => {
  try {
    const connectorType = c.req.param('connectorType');
    const tenantId = c.req.query('tenantId');
    const bucketId = c.req.query('bucketId');

    if (!tenantId || !bucketId) {
      return c.json({ error: 'Missing tenantId or bucketId' }, 400);
    }

    // Fetch connector config from DB
    // TODO: SELECT connector_status, last_sync_at FROM base_buckets WHERE bucket_id = bucketId

    return c.json({
      connectorType,
      status: 'connected', // or 'disconnected', 'error', 'waiting_auth'
      lastSyncAt: null,
      nextSyncAt: null,
      syncFrequency: '1h',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: `Status check failed: ${message}` }, 500);
  }
});

/**
 * POST /connector/sync/:connectorType
 * Trigger manual sync for a connector
 */
app.post('/connector/sync/:connectorType', async (c: Context<{ Bindings: Env }>) => {
  try {
    const connectorType = c.req.param('connectorType');
    const { tenantId, bucketId, bucketType } = await c.req.json();

    if (!tenantId || !bucketId) {
      return c.json({ error: 'Missing tenantId or bucketId' }, 400);
    }

    // Retrieve credentials
    // TODO: SELECT connector_config FROM base_buckets WHERE bucket_id = bucketId

    // Trigger sync job
    // This would typically queue a background job that:
    // 1. Fetches data from external service (using stored credentials)
    // 2. Normalizes to SSOT schema
    // 3. Stores in Spine DB
    // 4. Updates bucket state (SEEDED → LIVE)
    // 5. Marks sync success/failure in connector_status

    return c.json({
      success: true,
      syncId: crypto.randomBytes(16).toString('hex'),
      bucketState: 'LIVE',
      startedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: `Sync failed: ${message}` }, 500);
  }
});

/**
 * DELETE /connector/:connectorType
 * Disconnect and remove connector auth
 */
app.delete('/connector/:connectorType', async (c: Context<{ Bindings: Env }>) => {
  try {
    const connectorType = c.req.param('connectorType');
    const tenantId = c.req.query('tenantId');
    const bucketId = c.req.query('bucketId');

    if (!tenantId || !bucketId) {
      return c.json({ error: 'Missing tenantId or bucketId' }, 400);
    }

    // Remove and revoke credentials from DB
    // TODO: DELETE FROM connector_credentials WHERE bucket_id = bucketId

    return c.json({
      success: true,
      disconnected: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: `Disconnect failed: ${message}` }, 500);
  }
});

export default app;
