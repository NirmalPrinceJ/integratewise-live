# Backend Wiring Guide - RBAC Unified Shell

## Overview

This guide shows how the frontend RBAC Unified Shell connects to the backend services, databases, and APIs.

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  User Interface                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │
│  │  Login      │───→│  Shell      │───→│  Domain     │                     │
│  │  Page       │    │  Container  │    │  Views      │                     │
│  └─────────────┘    └─────────────┘    └─────────────┘                     │
│         │                  │                  │                              │
│         ↓                  ↓                  ↓                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  useRBAC Hook                                                       │   │
│  │  - Auth state management                                            │   │
│  │  - Role fetching                                                    │   │
│  │  - Permission checking                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS
                                    │ JSON API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  Next.js API Routes (app/api/)                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │
│  │  /api/auth  │    │  /api/rbac  │    │  /api/      │                     │
│  │  /login     │    │  /roles     │    │  accounts   │                     │
│  │  /logout    │    │  /check     │    │  /pipeline  │                     │
│  └─────────────┘    └─────────────┘    └─────────────┘                     │
│         │                  │                  │                              │
│         └──────────────────┴──────────────────┘                              │
│                            │                                                 │
│                            ↓                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  @integratewise/rbac Package                                         │   │
│  │  - Role management                                                   │   │
│  │  - Permission checking                                               │   │
│  │  - Access control                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                            │                                                 │
│                            ↓                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL (Neon)                                                  │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                   │   │
│  │  │ profiles│ │ roles   │ │user_roles│ │permission│                   │   │
│  │  │  table  │ │  table  │ │  table   │ │audit_log │                   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Database Schema

### 1. Profiles Table (extends auth.users)

```sql
-- Supabase auth.users is extended via profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'personal-pro', -- RBAC role ID
  tenant_id UUID REFERENCES tenants(id),
  department TEXT,
  industry TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_tenant_id ON profiles(tenant_id);
```

### 2. RBAC System (from 031_rbac_system.sql)

```sql
-- System roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NULL, -- NULL for system roles
  name TEXT NOT NULL,
  description TEXT,
  permissions TEXT[] NOT NULL DEFAULT '{}',
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-role assignments
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID,
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permission audit log
CREATE TABLE permission_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  permission TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  allowed BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Tenants Table

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry TEXT DEFAULT 'saas',
  plan TEXT DEFAULT 'personal',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Endpoints

### Authentication

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/auth/login` | POST | User login | `{ email, password }` | `{ user, session }` |
| `/api/auth/logout` | POST | User logout | - | `{ success }` |
| `/api/auth/callback` | GET | OAuth callback | Query params | Redirect |

### RBAC

| Endpoint | Method | Description | Auth Required | Permission |
|----------|--------|-------------|---------------|------------|
| `/api/rbac/roles` | GET | List all roles | ✅ | `role:read` |
| `/api/rbac/roles` | POST | Create role | ✅ | `role:create` |
| `/api/rbac/check` | POST | Check permission | ✅ | - |
| `/api/rbac/me` | GET | Get current user permissions | ✅ | - |

### User Management

| Endpoint | Method | Description | Auth Required | Permission |
|----------|--------|-------------|---------------|------------|
| `/api/admin/users` | GET | List users | ✅ | `user:read` |
| `/api/admin/users` | POST | Create user | ✅ | `user:create` |
| `/api/admin/users/[id]` | PUT | Update user | ✅ | `user:update` |
| `/api/admin/users/[id]/role` | PUT | Assign role | ✅ | `user:update` |

### Domain APIs

| Endpoint | Method | Description | Auth Required | Module |
|----------|--------|-------------|---------------|--------|
| `/api/accounts` | GET | List accounts | ✅ | CS |
| `/api/accounts/[id]` | GET | Get account | ✅ | CS |
| `/api/accounts/[id]/health` | GET | Health score | ✅ | CS |
| `/api/pipeline` | GET | Pipeline data | ✅ | Sales |
| `/api/deals` | GET | Deals list | ✅ | Sales |
| `/api/forecasts` | GET | Forecasts | ✅ | RevOps |
| `/api/tasks` | GET | Tasks | ✅ | All |
| `/api/calendar` | GET | Calendar | ✅ | All |

## Frontend-Backend Wiring

### 1. Authentication Flow

```typescript
// hooks/useRBAC.ts
export function useRBAC() {
  const supabase = createClient();
  
  // 1. Check session
  const { data: { session } } = await supabase.auth.getSession();
  
  // 2. Get user profile with role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  // 3. Load role configuration
  const roleConfig = getRoleConfig(profile.role);
  
  return { user, role: roleConfig, permissions };
}
```

### 2. Permission Checking

```typescript
// API Route: /api/rbac/check
export async function POST(request: NextRequest) {
  const { user_id, tenant_id, permission } = await request.json();
  
  // Call RBAC package
  const result = await checkPermission(process.env.DATABASE_URL, {
    user_id,
    tenant_id,
    permission,
  });
  
  return NextResponse.json(result);
}
```

### 3. Protected Routes

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('supabase-auth-token');
  
  // Verify JWT
  const { data: { user } } = await supabase.auth.getUser(token);
  
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Check role-based access
  const role = await getUserRole(user.id);
  const path = request.nextUrl.pathname;
  
  if (!canAccess(role, path)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  return NextResponse.next();
}
```

### 4. Domain Data Fetching

```typescript
// components/domains/account-success/dashboard.tsx
export function AccountSuccessDashboard() {
  const { user, hasPermission } = useRBAC();
  
  // Fetch accounts
  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await fetch('/api/accounts', {
        headers: {
          'x-user-id': user.id,
          'x-tenant-id': user.tenantId,
        },
      });
      return res.json();
    },
    enabled: hasPermission('accounts:read'),
  });
  
  return <AccountsView data={accounts} />;
}
```

## Data Flow Examples

### Example 1: CS Manager Logs In

```
1. User enters credentials → /api/auth/login
2. Supabase validates → Returns JWT
3. Frontend stores token
4. useRBAC hook loads:
   - User profile (role = 'cs-manager')
   - Tenant info (industry = 'saas')
   - Role config (shell = 'account-success')
5. UnifiedShell renders with CS navigation
6. Dashboard component fetches:
   GET /api/accounts
   Headers: x-user-id, x-tenant-id
7. Backend checks permission:
   - accounts:read ✅
8. Returns accounts data
9. AccountSuccessShell displays data
```

### Example 2: Permission Denied

```
1. User tries to access /admin/users
2. Middleware intercepts request
3. Checks user role (cs-manager)
4. Checks required permission (user:read)
5. RBAC check fails ❌
6. Redirects to /unauthorized
7. Logs attempt to permission_audit_log
```

### Example 3: Deep View Access

```
1. CS Manager clicks "Risk Register"
2. Navigates to /cs/deep/risk-register
3. Component loads RiskRegisterView
4. Fetches data: GET /api/accounts?risks=true
5. Backend validates:
   - User has accounts:read ✅
   - User has risks:read ✅
6. Returns high-risk accounts
7. View renders with data
```

## Configuration

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Auth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional: External services
OPENROUTER_API_KEY="your-key"
```

### Role Seeding

```sql
-- Seed system roles
INSERT INTO roles (name, description, permissions, is_system_role) VALUES
('cs-chief', 'Chief Customer Officer', 
  '{"core:admin", "accounts:read", "accounts:write", "health:read", "health:write", "risks:read", "risks:write"}', 
  true),
('cs-manager', 'CS Manager', 
  '{"core:write", "accounts:read", "accounts:write", "health:read", "health:write", "risks:read"}', 
  true),
('csm', 'Customer Success Manager', 
  '{"core:write", "accounts:read", "accounts:write", "health:read", "success-plans:read"}', 
  true),
('personal-pro', 'Professional', 
  '{"core:write", "tasks:write", "calendar:write", "docs:write"}', 
  true);
```

## Testing the Wiring

### 1. Test Authentication

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

### 2. Test RBAC

```bash
# Check permission
curl -X POST http://localhost:3000/api/rbac/check \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"permission": "accounts:read"}'
```

### 3. Test Domain API

```bash
# Get accounts
curl http://localhost:3000/api/accounts \
  -H "Authorization: Bearer TOKEN" \
  -H "x-tenant-id: TENANT_ID"
```

## Troubleshooting

### Issue: Role not loading
- Check profiles table has role column
- Verify role exists in roles table
- Check foreign key constraints

### Issue: Permission denied
- Check user_roles junction table
- Verify permission string matches exactly
- Check tenant_id matches

### Issue: API 401
- Verify JWT token is valid
- Check token expiration
- Ensure middleware is configured

## Summary

| Component | Backend | Frontend |
|-----------|---------|----------|
| **Auth** | Supabase Auth | useRBAC hook |
| **Roles** | PostgreSQL roles table | lib/rbac/roles.ts |
| **Permissions** | user_has_permission() SQL | hasPermission() hook |
| **API** | Next.js API routes | Fetch/API client |
| **Shell** | - | UnifiedShell component |
| **Domains** | Domain APIs | Domain shells |

**All components are now wired and ready!** 🎉
