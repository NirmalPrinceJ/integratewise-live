# Edge-First Architecture: Supabase + Cloudflare

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    "Write to Supabase, Read from Edge"                   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              WRITE PATH (Source of Truth)                    │
│                                                                              │
│  User Action → Next.js → Supabase (PostgreSQL)                               │
│                              ↓                                               │
│                        Canonical Data                                        │
│                        (Single Source of Truth)                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Trigger / Webhook
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SYNC TO EDGE (Background)                            │
│                                                                              │
│  Supabase → Webhook → Cloudflare Worker                                      │
│                              ↓                                               │
│                        Cache in:                                             │
│                        • Cloudflare KV (fast key-value)                      │
│                        • D1 (edge SQLite)                                    │
│                        • R2 (blobs/files)                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Global Replicate
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              READ PATH (Edge)                                │
│                                                                              │
│  User Request → Cloudflare Worker (300+ locations)                           │
│                              ↓                                               │
│                        < 50ms response                                       │
│                        (cached in 300+ edge locations)                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Why This Pattern?

| Aspect | Supabase | Cloudflare Edge |
|--------|----------|-----------------|
| **Role** | Source of Truth | Fast Cache |
| **Latency** | ~100-300ms | ~50ms globally |
| **Use For** | Writes, complex queries | Reads, frequent data |
| **Data** | Complete, relational | Cached, denormalized |
| **Durability** | ACID, permanent | Eventually consistent |

## Implementation

### 1. Write Path (Always to Supabase)

```typescript
// apps/web/src/lib/database/provider.ts
export async function updateUser(userId: string, data: UserData) {
  const supabase = createAdminDbClient()
  
  // 1. Write to Supabase (source of truth)
  const { data: user, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  
  // 2. Trigger edge sync (background)
  await syncToEdge('user', userId, user)
  
  return user
}
```

### 2. Read Path (From Edge)

```typescript
// Workers read from KV/D1 for speed
export async function getUserFromEdge(userId: string) {
  // Try KV first (sub-millisecond)
  const cached = await KV.get(`user:${userId}`)
  if (cached) return JSON.parse(cached)
  
  // Fallback to D1 (edge SQLite)
  const user = await D1.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(userId).first()
  
  if (user) {
    // Cache for next time
    await KV.put(`user:${userId}`, JSON.stringify(user), {
      expirationTtl: 3600 // 1 hour
    })
  }
  
  return user
}
```

### 3. Sync Mechanism

```typescript
// Cloudflare Worker webhook handler
export default {
  async fetch(request: Request, env: Env) {
    const webhook = await request.json()
    
    // Supabase Realtime / Webhook
    if (webhook.type === 'INSERT' || webhook.type === 'UPDATE') {
      const { table, record } = webhook
      
      // Sync to KV
      await env.KV.put(`${table}:${record.id}`, JSON.stringify(record))
      
      // Sync to D1 (if using edge SQLite)
      await env.D1.prepare(`
        INSERT OR REPLACE INTO ${table} (id, data, updated_at)
        VALUES (?, ?, ?)
      `).bind(record.id, JSON.stringify(record), Date.now()).run()
    }
    
    return new Response('OK')
  }
}
```

## Current Code Status

### ✅ What's Ready

| Component | Status | File |
|-----------|--------|------|
| Supabase Client | ✅ | `lib/database/provider.ts` |
| Direct DB Connection | ✅ | Can write/read Supabase |
| Test Page | ✅ | `/test` verifies connection |

### ⏳ What Needs Building

| Component | Status | Purpose |
|-----------|--------|---------|
| KV Sync Worker | ⏳ | Sync Supabase → KV |
| D1 Schema | ⏳ | Edge SQLite tables |
| Read-from-Edge | ⏳ | Fast data fetching |
| Cache Invalidation | ⏳ | Keep edge data fresh |

## When to Use What

### Use Supabase (Source of Truth)
- ✅ User registration/login
- ✅ Writing new data
- ✅ Complex queries (JOINs, aggregations)
- ✅ Data that must be consistent
- ✅ Transactions

### Use Cloudflare Edge (Fast Cache)
- ✅ User profile reads (frequent)
- ✅ Dashboard data (cached)
- ✅ Static/reference data
- ✅ High-traffic reads
- ✅ Global low-latency needs

## Example: User Dashboard

```typescript
// Dashboard loads from edge (fast)
async function loadDashboard(userId: string) {
  // 1. Get user from edge cache (< 50ms)
  const user = await getFromEdge('user', userId)
  
  // 2. Get accounts from edge cache
  const accounts = await getFromEdge('accounts', userId)
  
  // 3. If cache miss, fetch from Supabase and cache
  if (!user) {
    const freshUser = await supabase.from('profiles').select('*').eq('id', userId).single()
    await cacheToEdge('user', userId, freshUser.data)
    return freshUser.data
  }
  
  return { user, accounts }
}
```

## Sync Strategies

### Option 1: Real-time (Supabase Realtime)
```javascript
// Subscribe to changes
supabase
  .channel('table-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' },
    (payload) => {
      // Push to Cloudflare KV
      syncToEdge(payload.new)
    }
  )
  .subscribe()
```

### Option 2: Webhook (Database Trigger)
```sql
-- Supabase function/trigger
CREATE OR REPLACE FUNCTION notify_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url:='https://your-worker.workers.dev/sync',
    body:=json_build_object(
      'table', TG_TABLE_NAME,
      'record', row_to_json(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Option 3: Cron (Periodic Sync)
```javascript
// Cloudflare Cron Trigger
export default {
  async scheduled(event: ScheduledEvent, env: Env) {
    // Every minute, sync recent changes
    const recent = await supabase
      .from('profiles')
      .select('*')
      .gt('updated_at', fiveMinutesAgo())
    
    for (const row of recent.data) {
      await env.KV.put(`user:${row.id}`, JSON.stringify(row))
    }
  }
}
```

## Summary

| Your Question | Answer |
|---------------|--------|
| **Main database?** | Supabase (PostgreSQL) |
| **Source of truth?** | Supabase |
| **Fast reads?** | Cloudflare Edge (KV/D1) |
| **Writes go to?** | Supabase only |
| **Background sync?** | Supabase → Cloudflare |

## Next Steps

1. ✅ **Current**: Can write/read Supabase directly
2. ⏳ **Next**: Build sync worker (Supabase → KV)
3. ⏳ **Then**: Update reads to use edge first
4. ⏳ **Finally**: Implement cache invalidation

**Ready to build the sync layer, or want to implement Figma design first?**
