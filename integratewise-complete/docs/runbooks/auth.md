# Authentication Runbook

## Overview
IntegrateWise uses NextAuth.js with Google OAuth for authentication. This runbook covers common operations and incident response.

## Architecture
- **Provider**: Google OAuth 2.0
- **Session**: JWT-based (30-day expiry)
- **Storage**: PostgreSQL via Prisma adapter
- **Cookies**: HttpOnly, SameSite=Lax, Secure (production)

## Key Environment Variables
| Variable | Description | Rotation Cadence |
|----------|-------------|------------------|
| `NEXTAUTH_SECRET` | JWT signing key | 90 days |
| `NEXTAUTH_URL` | Canonical callback URL | N/A |
| `GOOGLE_CLIENT_ID` | OAuth client ID | N/A |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret | 365 days |

## Common Operations

### Rotate NEXTAUTH_SECRET

1. Generate new secret:
   ```bash
   openssl rand -base64 32
   ```

2. Update in Vercel:
   ```bash
   vercel env rm NEXTAUTH_SECRET production
   vercel env add NEXTAUTH_SECRET production
   ```

3. Redeploy:
   ```bash
   vercel --prod
   ```

4. **Note**: Existing sessions will be invalidated. Users must re-authenticate.

### Rotate Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create new OAuth 2.0 Client ID
3. Update authorized redirect URIs:
   - `https://app.integratewise.co/api/auth/callback/google`
   - `https://preview.integratewise.co/api/auth/callback/google`
4. Update environment variables
5. Verify in each environment
6. Delete old credentials after 24h

### Add New OAuth Provider

1. Add provider to `src/lib/auth.ts`:
   ```typescript
   import GitHubProvider from 'next-auth/providers/github';

   providers: [
     // ... existing
     GitHubProvider({
       clientId: process.env.GITHUB_CLIENT_ID!,
       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
     }),
   ]
   ```

2. Update env-manifest.json
3. Add secrets to Vercel
4. Update CSP if needed
5. Deploy and test

## Incident Response

### Users Cannot Sign In

**Symptoms**: 401 errors, redirect loops

**Diagnosis**:
1. Check health endpoint: `GET /api/health`
2. Check auth configuration status
3. Verify NEXTAUTH_URL matches deployment URL
4. Check Google OAuth consent screen status

**Resolution**:
1. If NEXTAUTH_URL mismatch:
   ```bash
   vercel env rm NEXTAUTH_URL production
   vercel env add NEXTAUTH_URL production
   # Enter: https://app.integratewise.co
   vercel --prod
   ```

2. If OAuth error:
   - Check Google Cloud Console for quota/errors
   - Verify redirect URIs are correct
   - Check client secret hasn't expired

### Session Validation Failures

**Symptoms**: Users logged out unexpectedly, 403 errors

**Diagnosis**:
1. Check if NEXTAUTH_SECRET was rotated
2. Check database connectivity
3. Review error logs

**Resolution**:
1. If secret mismatch, users must re-authenticate
2. If database issue, see Database Runbook
3. Clear browser cookies if testing

### High Authentication Latency

**Symptoms**: Slow sign-in, timeouts

**Diagnosis**:
1. Check database latency in health endpoint
2. Check Google OAuth response times
3. Review Vercel function logs

**Resolution**:
1. If database slow, check connection pool
2. If OAuth slow, may be Google-side issue
3. Consider caching user data

## Monitoring

### SLOs
- **Auth Success Rate**: 99.9% (7-day window)
- **Alert Threshold**: < 99.5%

### Key Metrics
- `auth.signin.success` - Successful sign-ins
- `auth.signin.failure` - Failed sign-ins
- `auth.session.created` - New sessions
- `auth.session.expired` - Expired sessions

### Alerts
1. **Auth Failure Spike**: > 5 failures in 5 minutes
2. **Auth Latency**: p99 > 2s
3. **Secret Expiry**: 7 days before rotation due

## Security Checklist

- [ ] NEXTAUTH_SECRET is unique per environment
- [ ] Google OAuth redirect URIs are exact match
- [ ] Session cookies are HttpOnly and Secure
- [ ] CSRF protection is enabled (SameSite=Lax)
- [ ] Audit logs capture all auth events
- [ ] Rate limiting on auth endpoints
