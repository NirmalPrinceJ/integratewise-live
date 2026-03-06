# Incident Response Playbook

## Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| SEV1 | Complete outage | 15 min | Site down, all auth failing |
| SEV2 | Major degradation | 30 min | Webhooks failing, DB slow |
| SEV3 | Minor issue | 2 hours | Single feature broken |
| SEV4 | Low impact | 24 hours | UI glitch, non-critical bug |

## On-Call Rotation

See env-manifest.json for team contacts:
- **Platform**: #platform-eng
- **Security**: #security
- **Data**: #data-eng
- **Payments**: #payments

## Incident Workflow

### 1. Detection
- Automated alerts (Vercel, Cloudflare)
- User reports
- Monitoring dashboards

### 2. Triage
1. Assess severity level
2. Create incident channel: `#inc-YYYYMMDD-brief-description`
3. Page appropriate team(s)

### 3. Investigation
1. Check health endpoints
2. Review recent deployments
3. Check logs and metrics
4. Identify root cause

### 4. Mitigation
1. Rollback if deployment-related
2. Scale if capacity-related
3. Patch if code-related

### 5. Resolution
1. Verify fix in production
2. Monitor for recurrence
3. Update status page

### 6. Post-Mortem
1. Document timeline
2. Identify root cause
3. Define action items
4. Share learnings

## Common Scenarios

### Complete Site Outage

**Symptoms**: 5xx errors, site unreachable

**Immediate Actions**:
1. Check Vercel status: https://vercel-status.com
2. Check recent deployments
3. Rollback if deployment-related:
   ```bash
   vercel rollback
   ```

**Investigation**:
1. Check function logs in Vercel
2. Check database connectivity
3. Check DNS resolution

### Authentication Down

**Symptoms**: Users can't sign in, 401 errors

**Immediate Actions**:
1. Check `/api/health` auth status
2. Verify NEXTAUTH_URL matches domain
3. Check Google OAuth status

**Resolution**: See auth.md runbook

### Database Unreachable

**Symptoms**: 500 errors, slow responses

**Immediate Actions**:
1. Check Neon status: https://neonstatus.com
2. Check `/api/health` database status
3. Verify connection strings

**Resolution**: See database.md runbook

### Webhooks Not Processing

**Symptoms**: Events not received, signature errors

**Immediate Actions**:
1. Check worker health: `GET /health`
2. Check worker logs: `wrangler tail`
3. Verify webhook secrets

**Resolution**: See webhooks.md runbook

### High Error Rate

**Symptoms**: Error rate > 1%, user complaints

**Immediate Actions**:
1. Identify error pattern in logs
2. Check recent code changes
3. Check external dependencies

**Investigation**:
1. Group errors by type
2. Find common cause
3. Implement fix or rollback

## Rollback Procedures

### Vercel Deployment

```bash
# List deployments
vercel list

# Rollback to previous
vercel rollback

# Or promote specific deployment
vercel promote [deployment-url]
```

### Cloudflare Worker

```bash
# List versions
wrangler deployments list

# Rollback
wrangler rollback
```

### Database Migration

1. **Stop traffic** (if critical)
2. **Run reverse migration**
3. **Update code if needed**
4. **Resume traffic**

See database.md for detailed steps.

## Communication Templates

### Initial Acknowledgment
```
🔴 INCIDENT: [Brief description]
Severity: SEV[X]
Status: Investigating
Impact: [Who/what is affected]
Next update: [Time]
```

### Status Update
```
🟡 UPDATE: [Brief description]
Status: [Investigating/Identified/Mitigating/Resolved]
Progress: [What's been done]
ETA: [If known]
Next update: [Time]
```

### Resolution
```
🟢 RESOLVED: [Brief description]
Duration: [Start - End]
Impact: [Summary of impact]
Root cause: [Brief explanation]
Post-mortem: [Link when available]
```

## Post-Mortem Template

```markdown
# Incident Post-Mortem: [Title]

**Date**: YYYY-MM-DD
**Severity**: SEV[X]
**Duration**: [Start] - [End] ([X] minutes)
**Authors**: [Names]

## Summary
[1-2 sentences describing what happened]

## Impact
- [Number] users affected
- [Specific features] unavailable
- [Revenue/reputation impact if applicable]

## Timeline
- HH:MM - [Event]
- HH:MM - [Event]
- ...

## Root Cause
[Detailed explanation of why this happened]

## Resolution
[What was done to fix it]

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Task] | [Name] | [Date] | [ ] |

## Lessons Learned
### What went well
- [Point]

### What could be improved
- [Point]
```

## Emergency Contacts

| Role | Contact | Escalation |
|------|---------|------------|
| Platform Lead | See Slack | Immediately for SEV1 |
| Security Lead | See Slack | Any auth/security issue |
| Database Lead | See Slack | Any data issue |
| Vendor Support | Various | See vendor docs |
