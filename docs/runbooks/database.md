# Database Runbook

## Overview
IntegrateWise uses Neon PostgreSQL with Prisma ORM. This runbook covers operations, migrations, and incident response.

## Architecture
- **Provider**: Neon (serverless PostgreSQL)
- **ORM**: Prisma with Neon adapter
- **Pooling**: Neon's built-in connection pooler
- **Branching**: Neon database branching for previews

## Key Environment Variables
| Variable | Description | Usage |
|----------|-------------|-------|
| `DATABASE_URL` | Pooled connection string | Prisma queries |
| `DATABASE_URL_UNPOOLED` | Direct connection string | Prisma migrations |
| `PGHOST` | Postgres host | Health checks |
| `PGUSER` | Postgres user | Health checks |

## Connection Strings

### Pooled (for queries)
```
postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require&pgbouncer=true
```

### Unpooled (for migrations)
```
postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

## Common Operations

### Run Migration

1. Ensure `DATABASE_URL_UNPOOLED` is set:
   ```bash
   export DATABASE_URL_UNPOOLED="..."
   ```

2. Generate migration:
   ```bash
   cd apps/integrationwise-os
   npx prisma migrate dev --name your_migration_name
   ```

3. Deploy to production:
   ```bash
   npx prisma migrate deploy
   ```

### Rollback Migration

1. Check migration history:
   ```bash
   npx prisma migrate status
   ```

2. Manual rollback (Prisma doesn't auto-rollback):
   ```sql
   -- Connect to database
   -- Run inverse of migration
   -- Remove from _prisma_migrations table
   DELETE FROM _prisma_migrations WHERE migration_name = '20241229_your_migration';
   ```

3. Update schema and redeploy

### Create Neon Branch for Preview

1. Via Neon CLI:
   ```bash
   neonctl branches create --name preview-pr-123
   ```

2. Get connection string:
   ```bash
   neonctl connection-string preview-pr-123
   ```

3. Set in Vercel preview environment

### Seed Database

```bash
cd apps/integrationwise-os
npx prisma db seed
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

## Preview Environment Read-Only Policy

Preview environments have read-only access to prevent accidental mutations:

```typescript
// In src/lib/db.ts
export function isReadOnlyEnvironment(): boolean {
  return process.env.VERCEL_ENV === 'preview';
}

export async function withWriteCheck<T>(
  operation: () => Promise<T>,
  entityName: string
): Promise<T> {
  if (isReadOnlyEnvironment()) {
    throw new Error(`Writes to ${entityName} disabled in preview`);
  }
  return operation();
}
```

## Incident Response

### Database Unreachable

**Symptoms**: 500 errors, health check fails

**Diagnosis**:
1. Check Neon status: https://neonstatus.com
2. Check connection string format
3. Check firewall/network

**Resolution**:
1. If Neon outage, wait and monitor
2. If connection string wrong:
   ```bash
   vercel env rm DATABASE_URL production
   vercel env add DATABASE_URL production
   ```
3. If SSL issue, ensure `sslmode=require`

### High Latency

**Symptoms**: Slow API responses, timeouts

**Diagnosis**:
1. Check health endpoint latency
2. Check Neon console for slow queries
3. Check connection pool usage

**Resolution**:
1. Add indexes for slow queries:
   ```prisma
   @@index([field_name])
   ```
2. If pool exhausted, check for connection leaks
3. Consider query optimization

### Migration Failed

**Symptoms**: Deploy fails, schema mismatch

**Diagnosis**:
1. Check migration status:
   ```bash
   npx prisma migrate status
   ```
2. Review migration SQL
3. Check for data conflicts

**Resolution**:
1. If shadow database issue:
   ```bash
   npx prisma migrate resolve --rolled-back 20241229_migration
   ```
2. If data conflict, fix data first
3. If schema drift:
   ```bash
   npx prisma db pull
   npx prisma migrate dev
   ```

### Data Corruption

**Symptoms**: Inconsistent data, constraint violations

**Diagnosis**:
1. Check audit logs for recent changes
2. Identify affected records
3. Check for race conditions

**Resolution**:
1. Restore from Neon point-in-time recovery
2. Fix application code if race condition
3. Add database constraints to prevent recurrence

## Monitoring

### SLOs
- **DB Latency p99**: < 100ms
- **Alert Threshold**: > 200ms

### Key Metrics
- `db.query.duration` - Query execution time
- `db.connection.active` - Active connections
- `db.connection.waiting` - Waiting connections
- `db.error.count` - Database errors

### Alerts
1. **Connection Pool Exhausted**: > 90% capacity
2. **Query Timeout**: > 5s
3. **Migration Failed**: Any migration error

## Backup & Recovery

### Neon Automatic Backups
- Point-in-time recovery: 7 days (free tier)
- Branch-based recovery available

### Manual Backup
```bash
pg_dump $DATABASE_URL_UNPOOLED > backup.sql
```

### Restore
```bash
psql $DATABASE_URL_UNPOOLED < backup.sql
```

## Security Checklist

- [ ] Connection strings use SSL (`sslmode=require`)
- [ ] Database user has minimum required permissions
- [ ] No raw SQL with user input (use Prisma parameterized queries)
- [ ] Audit logging enabled for sensitive tables
- [ ] Preview environments are read-only
- [ ] Connection strings not logged or exposed
