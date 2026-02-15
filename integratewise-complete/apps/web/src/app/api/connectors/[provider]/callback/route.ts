/**
 * Connector OAuth Callback API Route - Thin proxy to Tenants Worker
 * 
 * This proxies the OAuth callback to the Tenants Worker which handles
 * token exchange and storage.
 */
import { NextRequest, NextResponse } from 'next/server';
import { proxyToService } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(request.url);

  const queryParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  // Include the state cookie in extra headers for verification
  const oauthState = request.cookies.get(`oauth_state_${provider}`)?.value;
  const extraHeaders: Record<string, string> = {};
  if (oauthState) {
    extraHeaders['X-OAuth-State'] = oauthState;
  }

  // Add the origin for redirect construction
  extraHeaders['X-Origin'] = request.nextUrl.origin;

  try {
    const response = await proxyToService({
      service: 'tenants',
      path: `/v1/connectors/${provider}/callback`,
      method: 'GET',
      queryParams,
      extraHeaders,
    });

    // If the response is a redirect from the worker, forward it
    const redirectUrl = response.headers.get('X-Redirect-URL');
    if (redirectUrl) {
      const redirectResponse = NextResponse.redirect(redirectUrl);
      redirectResponse.cookies.delete(`oauth_state_${provider}`);
      return redirectResponse;
    }

    return response;
  } catch (error) {
    console.error(`OAuth callback error for ${provider}:`, error);
    return NextResponse.redirect(`${request.nextUrl.origin}/integrations?error=callback_failed`);
  }
}
