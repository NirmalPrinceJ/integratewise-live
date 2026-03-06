# Secret Rotation Runbook

## Rotation Schedule

| Secret | Cadence | Last Rotated | Next Due |
|--------|---------|--------------|----------|
| NEXTAUTH_SECRET | 90 days | - | - |
| GOOGLE_CLIENT_SECRET | 365 days | - | - |
| STRIPE_SECRET_KEY | 365 days | - | - |
| STRIPE_WEBHOOK_SECRET | On endpoint change | - | - |
| XAI_API_KEY | 180 days | - | - |
| CLOUDFLARE_API_TOKEN | 365 days | - | - |

## Pre-Rotation Checklist

- [ ] Schedule during low-traffic window
- [ ] Notify team in Slack
- [ ] Have rollback plan ready
- [ ] Test in preview environment first

## Rotation Procedures

### NEXTAUTH_SECRET

**Impact**: All sessions invalidated, users must re-authenticate

1. Generate new secret:
   ```bash
   openssl rand -base64 32
   ```

2. Update in Vercel:
   ```bash
   # Preview
   vercel env rm NEXTAUTH_SECRET preview
   echo "NEW_SECRET" | vercel env add NEXTAUTH_SECRET preview

   # Test in preview

   # Production
   vercel env rm NEXTAUTH_SECRET production
   echo "NEW_SECRET" | vercel env add NEXTAUTH_SECRET production
   ```

3. Trigger redeploy:
   ```bash
   vercel --prod
   ```

4. Verify:
   - Sign out and sign in
   - Check health endpoint
   - Monitor error rates

### GOOGLE_CLIENT_SECRET

**Impact**: New OAuth flows fail until updated

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

2. Create new secret for existing client ID

3. Update in Vercel:
   ```bash
   vercel env rm GOOGLE_CLIENT_SECRET production
   vercel env add GOOGLE_CLIENT_SECRET production
   ```

4. Redeploy and test sign-in

5. Delete old secret in Google Console after 24h

### STRIPE_SECRET_KEY

**Impact**: API calls fail until updated

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

2. Roll API key (creates new, keeps old active temporarily)

3. Update in Vercel:
   ```bash
   vercel env rm STRIPE_SECRET_KEY production
   vercel env add STRIPE_SECRET_KEY production
   ```

4. Redeploy

5. Delete old key in Stripe after 24h

### STRIPE_WEBHOOK_SECRET

**Impact**: Webhook signature verification fails

1. Go to Stripe Dashboard > Webhooks

2. Reveal signing secret (if unchanged) OR create new endpoint

3. Update in Cloudflare:
   ```bash
   wrangler secret put STRIPE_WEBHOOK_SECRET --env production
   ```

4. Verify with test webhook:
   ```bash
   stripe trigger payment_intent.succeeded
   ```

### XAI_API_KEY

**Impact**: AI features fail

1. Go to xAI dashboard

2. Generate new API key

3. Update in Vercel:
   ```bash
   vercel env rm XAI_API_KEY production
   vercel env add XAI_API_KEY production
   ```

4. Redeploy and test AI features

5. Delete old key after 24h

### CLOUDFLARE_API_TOKEN

**Impact**: Worker deployments fail

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)

2. Create new token with same permissions

3. Update in GitHub Secrets:
   - Settings > Secrets > Actions
   - Update CLOUDFLARE_API_TOKEN

4. Test worker deployment

5. Delete old token after 24h

## Post-Rotation Checklist

- [ ] Verify all environments working
- [ ] Update rotation tracking table
- [ ] Delete old credentials from provider
- [ ] Document in change log
- [ ] Schedule next rotation reminder

## Emergency Rotation

If a secret is compromised:

1. **Immediately** rotate the secret
2. Revoke old secret at provider
3. Check audit logs for unauthorized access
4. Notify security team
5. Document incident

## Automation

### GitHub Action for Rotation Reminders

```yaml
name: Secret Rotation Reminder

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday 9am

jobs:
  check-rotation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check rotation schedule
        run: |
          # Parse env-manifest.json for rotation cadences
          # Send Slack reminder if due
          echo "Check secret rotation schedule"
```

## Recovery from Rotation Failure

1. **Identify failure point**
   - Secret not updated?
   - Deployment failed?
   - Verification failed?

2. **Rollback if possible**
   - Restore old secret if still valid
   - Rollback deployment

3. **Retry rotation**
   - Fix identified issue
   - Retry full procedure

4. **Document**
   - Update runbook with learnings
