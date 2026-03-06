# Supabase Boundaries (Server vs Client)

To ensure security and prevent server-side credentials from leaking into the browser, IntegrateWise OS enforces a strict boundary between Server and Client adapters.

## The Problem

Using `@supabase/supabase-js` without care can lead to:

1. Large bundle sizes (server logic including `os` and `fs` types).
2. Leaked `SERVICE_ROLE` keys if mistakenly passed to a client-side component.

## The Solution: Two Adapters

We use a common interface `IRegistryService` and provide two implementations:

### 1. Server Adapter (`registryServer.ts`)

- **Location**: `lib/registry/registryServer.ts`
- **Utility**: Uses `lib/supabase/server.ts` (Next.js cookies/Worker environment).
- **Usage**: Use this in API Routes, Server Components, and Cloudflare Workers.
- **Example**:

  ```typescript
  import { registryServer } from '@/lib/registry/registryServer';
  const signals = await registryServer.getSignalDefinitions();
  ```

### 2. Client Adapter (`registryClient.ts`)

- **Location**: `lib/registry/registryClient.ts`
- **Utility**: Uses `lib/supabase/client.ts` (Browser singleton).
- **Usage**: Use this in React Client Components and Hooks.
- **Example**:

  ```typescript
  "use client"
  import { registryClient } from '@/lib/registry/registryClient';
  useEffect(() => {
    registryClient.getResourceTypes().then(setResources);
  }, []);
  ```

## Shared Interface

Both adapters implement `lib/registry/types.ts`. This allows you to write domain logic that accepts *any* `IRegistryService` via Dependency Injection if needed.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Required by client.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Required by client.
- `SUPABASE_SERVICE_ROLE_KEY`: **SERVER ONLY** (Never prefix with `NEXT_PUBLIC`).
