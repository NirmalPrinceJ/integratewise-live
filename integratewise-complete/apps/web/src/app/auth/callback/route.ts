/**
 * Auth Callback API Route
 * 
 * Handles OAuth callback from identity providers, exchanges code for session,
 * and manages redirects appropriately.
 * 
 * Supports both Supabase Auth (primary) and Cloudflare Worker (fallback).
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server-client';
import { proxyToService } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  // Try Supabase Auth first (if configured)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        return NextResponse.redirect(new URL(next, request.url));
      }
      // If Supabase fails, fall through to worker
      console.warn('Supabase auth failed, trying worker:', error.message);
    } catch (err) {
      console.warn('Supabase auth error, trying worker:', err);
    }
  }

  // Fallback to Cloudflare Auth Worker
  const queryParams: Record<string, string> = {
    code,
    next,
    origin: request.nextUrl.origin,
  };

  try {
    const response = await proxyToService({
      service: 'auth',
      path: '/v1/callback/oauth',
      method: 'GET',
      queryParams,
    });

    // Check for redirect instruction from Auth Worker
    const redirectUrl = response.headers.get('X-Redirect-URL');
    if (redirectUrl) {
      return NextResponse.redirect(redirectUrl);
    }

    // Default fallback - check response for redirect path
    const data = await response.json().catch(() => null);
    if (data?.redirectTo) {
      return NextResponse.redirect(new URL(data.redirectTo, request.url));
    }

    // Fallback redirect
    return NextResponse.redirect(new URL(next, request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL(`/auth/error?message=callback_failed`, request.url));
  }
}
