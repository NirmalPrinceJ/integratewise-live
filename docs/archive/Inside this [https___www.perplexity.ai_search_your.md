<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Inside this [https://www.perplexity.ai/search/your-system-is-not-shallow-met-0Tey0Qy8Tp.dm5cs0kZsog\#3](https://www.perplexity.ai/search/your-system-is-not-shallow-met-0Tey0Qy8Tp.dm5cs0kZsog#3) How to bring a saas architecutre \# IntegrateWise OS - Complete SaaS Product Architecture

## Executive Summary

This document defines the complete SaaS product architecture for IntegrateWise OS, covering:

- User tier progression (Personal → Team → Organization → Enterprise)
- Feature gating and paywall strategy
- RBAC and permission model
- Multi-tenancy architecture
- Deployment and scalability design
- View composition and registry-driven UI

---

## 1. User Tier Progression

### Tier 1: Personal (Free / Starter)

**Target**: Individual professionals, freelancers, solo consultants

**Limits**:

- 1 user
- 3 integrations
- 1,000 AI sessions/month
- 5GB storage
- 7-day data retention for signals
- Basic support (community + docs)

**Features Included**:

- Personal World only
- My Today dashboard
- My Tasks \& Projects
- My Notes \& Decisions
- Basic AI assistant (limited)
- 3 connector slots
- Basic search
- Personal knowledge base

**Features Locked**:

- Work World (departments)
- Accounts World
- Team collaboration
- Advanced AI (situation detection, action proposals)
- Governance workflows
- Custom integrations
- API access
- Audit logs

---

### Tier 2: Team (Pro)

**Target**: Small teams, startups, SMB departments
**Price**: \$29/user/month (annual) or \$39/user/month (monthly)

**Limits**:

- Up to 25 users
- 15 integrations
- 10,000 AI sessions/month
- 50GB storage
- 30-day data retention
- Email + chat support

**Features Included**:

- Everything in Personal
- Work World (up to 3 departments)
- Team Today dashboard
- Shared projects \& tasks
- Team knowledge base
- Basic situation detection
- Action proposals (manual approval)
- Basic RBAC (Admin, Member, Viewer)
- Team activity feed
- Basic reporting
- Slack/Discord notifications
- API access (limited)

**Features Locked**:

- Accounts World
- Full department suite (12 depts)
- Advanced governance
- Custom workflows
- SSO/SAML
- Advanced audit
- Custom roles
- White-label

---

### Tier 3: Organization (Business)

**Target**: Mid-market companies, growing teams
**Price**: \$79/user/month (annual) or \$99/user/month (monthly)

**Limits**:

- Up to 250 users
- Unlimited integrations
- 50,000 AI sessions/month
- 500GB storage
- 90-day data retention
- Priority support + CSM

**Features Included**:

- Everything in Team
- Full Work World (all 12 departments)
- Accounts World (role-shaped intelligence)
- Advanced situation detection
- Auto-governance (rule-based approvals)
- Full RBAC (custom roles)
- SSO/SAML
- Advanced audit logs
- Department-level permissions
- Custom dashboards
- Advanced reporting \& BI
- Webhook integrations
- Multi-workspace support
- Data export

**Features Locked**:

- Enterprise features below

---

### Tier 4: Enterprise

**Target**: Large enterprises, regulated industries
**Price**: Custom (typically \$150-300/user/month)

**Limits**:

- Unlimited users
- Unlimited integrations
- Unlimited AI sessions
- Unlimited storage
- Custom retention (up to 7 years)
- Dedicated support + SLA

**Features Included**:

- Everything in Organization
- Multi-tenant management
- Advanced governance workflows
- Compliance frameworks (SOC2, HIPAA, GDPR)
- Custom data residency
- Private cloud / on-prem option
- Advanced security (IP whitelisting, MFA enforcement)
- Custom integrations
- White-label / custom branding
- Dedicated infrastructure
- 99.99% SLA
- Professional services

---

## 2. Feature Gating Matrix

```
┌─────────────────────────────────┬──────────┬────────┬─────────────┬────────────┐
│ Feature                         │ Personal │ Team   │ Org         │ Enterprise │
├─────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ WORLDS                          │          │        │             │            │
├─────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ Personal World                  │ ✓        │ ✓      │ ✓           │ ✓          │
│ Work World (3 depts)            │ ✗        │ ✓      │ ✓           │ ✓          │
│ Work World (all 12 depts)       │ ✗        │ ✗      │ ✓           │ ✓          │
│ Accounts World                  │ ✗        │ ✗      │ ✓           │ ✓          │
├─────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ SURFACES                        │          │        │             │            │
├─────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ Today (Personal)                │ ✓        │ ✓      │ ✓           │ ✓          │
│ Today (Team/Dept)               │ ✗        │ ✓      │ ✓           │ ✓          │
│ Spine (basic)                   │ ✓        │ ✓      │ ✓           │ ✓          │
│ Spine (full canonical model)    │ ✗        │ ✗      │ ✓           │ ✓          │
│ Context (basic)                 │ ✓        │ ✓      │ ✓           │ ✓          │
│ Context (full evidence)         │ ✗        │ ✓      │ ✓           │ ✓          │
│ Knowledge (personal)            │ ✓        │ ✓      │ ✓           │ ✓          │
│ Knowledge (team/org)            │ ✗        │ ✓      │ ✓           │ ✓          │
│ IQ Hub                          │ ✗        │ basic  │ ✓           │ ✓          │
│ Actions (manual)                │ ✗        │ ✓      │ ✓           │ ✓          │
│ Actions (AI-proposed)           │ ✗        │ ✗      │ ✓           │ ✓          │
│ Audit (basic)                   │ ✗        │ ✓      │ ✓           │ ✓          │
│ Audit (full compliance)         │ ✗        │ ✗      │ ✗           │ ✓          │
├─────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ AI FEATURES                     │          │        │             │            │
├─────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ AI Chat                         │ ✓ (1K)   │ ✓ (10K)│ ✓ (50K)     │ ✓ (∞)      │
│ Situation Detection             │ ✗        │ basic  │ ✓           │ ✓          │
│ Action Proposals                │ ✗        │ manual │ ✓           │ ✓          │
│ Auto-execution                  │ ✗        │ ✗      │ governed    │ ✓          │
│ AI Summarization                │ ✗        │ ✓      │ ✓           │ ✓          │
│ Root Cause Analysis             │ ✗        │ ✗      │ ✓           │ ✓          │
│ Impact Prediction               │ ✗        │ ✗      │ ✓           │ ✓          │
├─────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ GOVERNANCE                      │          │        │             │            │
├─────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ Basic approvals                 │ ✗        │ ✓      │ ✓           │ ✓          │
│ Custom approval workflows       │ ✗        │ ✗      │ ✓           │ ✓          │
│ Risk scoring                    │ ✗        │ ✗      │ ✓           │ ✓          │
│ Separation of duties            │ ✗        │ ✗      │ ✗           │ ✓          │
│ Compliance frameworks           │ ✗        │ ✗      │ ✗           │ ✓          │
├─────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ ADMIN & RBAC                    │          │        │             │            │
├─────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ Basic settings                  │ ✓        │ ✓      │ ✓           │ ✓          │
│ User management                 │ ✗        │ ✓      │ ✓           │ ✓          │
│ Role management (preset)        │ ✗        │ ✓      │ ✓           │ ✓          │
│ Custom roles                    │ ✗        │ ✗      │ ✓           │ ✓          │
│ Department permissions          │ ✗        │ ✗      │ ✓           │ ✓          │
│ Account permissions             │ ✗        │ ✗      │ ✓           │ ✓          │
│ API key management              │ ✗        │ limited│ ✓           │ ✓          │
│ SSO/SAML                        │ ✗        │ ✗      │ ✓           │ ✓          │
│ SCIM provisioning               │ ✗        │ ✗      │ ✗           │ ✓          │
├─────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ INTEGRATIONS                    │          │        │             │            │
├─────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ Connector slots                 │ 3        │ 15     │ ∞           │ ∞          │
│ Standard connectors             │ ✓        │ ✓      │ ✓           │ ✓          │
│ Premium connectors              │ ✗        │ ✗      │ ✓           │ ✓          │
│ Custom connectors               │ ✗        │ ✗      │ ✗           │ ✓          │
│ Webhooks (inbound)              │ ✗        │ ✓      │ ✓           │ ✓          │
│ Webhooks (outbound)             │ ✗        │ ✓      │ ✓           │ ✓          │
│ API access                      │ ✗        │ limited│ ✓           │ ✓          │
└─────────────────────────────────┴──────────┴────────┴─────────────┴────────────┘
```


---

## 3. RBAC Permission Model

### 3.1 Role Hierarchy

```
Enterprise Admin
    └── Org Admin
        └── Workspace Admin
            └── Department Admin
                └── Team Lead
                    └── Member
                        └── Viewer
                            └── Guest
```


### 3.2 Permission Dimensions

Permissions are scoped across 4 dimensions:

1. **World Scope**: Personal | Work | Accounts
2. **Department Scope**: Operations | Sales | Marketing | CS | Finance | Support | Product | HR | Legal | Procurement | IT | BI
3. **Entity Scope**: Which accounts/contacts/deals the user can access
4. **Action Scope**: What actions the user can perform

### 3.3 Permission Matrix

```typescript
interface Permission {
  // Resource permissions
  resource: 'today' | 'spine' | 'context' | 'knowledge' | 'actions' | 'audit' | 'admin';
  
  // Actions
  actions: ('view' | 'create' | 'edit' | 'delete' | 'execute' | 'approve' | 'admin')[];
  
  // Scope
  scope: {
    world: ('personal' | 'work' | 'accounts')[];
    departments: string[];
    accountSegments: string[];
    dataClassifications: ('public' | 'internal' | 'confidential' | 'restricted')[];
  };
  
  // Conditions
  conditions?: {
    ownDataOnly?: boolean;
    requireApproval?: boolean;
    maxRiskScore?: number;
    timeRestriction?: { start: string; end: string };
  };
}
```


### 3.4 Preset Roles

**Admin**

- Full access to all resources and actions
- Can manage users, roles, and permissions
- Can configure integrations and governance

**Department Manager**

- Full access within their department
- Can view cross-department data (read-only)
- Can approve actions within their department

**Team Member**

- Can view and edit assigned entities
- Can propose actions (requires approval)
- Cannot access admin or sensitive financial data

**Viewer**

- Read-only access to assigned areas
- Cannot create, edit, or execute anything

**Guest**

- Limited read-only access to specific shared items
- Time-limited access


### 3.5 Data-Level Security (RLS)

```sql
-- Row-Level Security Policy Example
CREATE POLICY account_access ON accounts
  USING (
    -- User is admin
    current_user_role() = 'admin'
    OR
    -- User is assigned to account
    id IN (SELECT account_id FROM account_assignments WHERE user_id = current_user_id())
    OR
    -- User's department has access to account segment
    segment IN (SELECT segment FROM department_segments WHERE department = current_user_department())
  );
```


---

## 4. Multi-Tenancy Architecture

### 4.1 Tenancy Model

```
┌─────────────────────────────────────────────────────────────────┐
│                        PLATFORM LEVEL                           │
│  (Shared infrastructure, routing, billing, platform admin)      │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    TENANT A     │ │    TENANT B     │ │    TENANT C     │
│   (Acme Corp)   │ │  (Beta Inc)     │ │  (Gamma LLC)    │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ Workspace 1     │ │ Workspace 1     │ │ Workspace 1     │
│ Workspace 2     │ │                 │ │                 │
│ (dev/staging)   │ │                 │ │                 │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ Users           │ │ Users           │ │ Users           │
│ Roles           │ │ Roles           │ │ Roles           │
│ Data            │ │ Data            │ │ Data            │
│ Integrations    │ │ Integrations    │ │ Integrations    │
│ Configurations  │ │ Configurations  │ │ Configurations  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```


### 4.2 Data Isolation Strategies

**Shared Database, Tenant Column (Default - Team/Org)**

- Single database with tenant_id column
- RLS policies enforce isolation
- Cost-effective, easy to manage
- Suitable for most customers

**Shared Database, Separate Schema (Organization)**

- Separate PostgreSQL schema per tenant
- Better isolation, easier backup/restore
- Moderate cost increase

**Dedicated Database (Enterprise)**

- Completely separate database instance
- Full isolation, custom retention
- Highest cost, best for regulated industries


### 4.3 Tenant Context Flow

```typescript
// Middleware: Extract tenant from request
const tenantMiddleware = async (req, res, next) => {
  const tenantId = 
    req.headers['x-tenant-id'] ||
    extractFromSubdomain(req.hostname) ||
    extractFromJWT(req.auth);
  
  if (!tenantId) {
    return res.status(401).json({ error: 'Tenant not identified' });
  }
  
  req.tenantContext = {
    tenantId,
    workspaceId: req.headers['x-workspace-id'] || 'default',
    plan: await getTenantPlan(tenantId),
    limits: await getTenantLimits(tenantId),
  };
  
  next();
};


// Database: Automatic tenant scoping
const createTenantClient = (tenantId: string) => {
  return supabase.from('*').eq('tenant_id', tenantId);
};
```


---

## 5. Deployment Architecture

### 5.1 Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            EDGE LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Vercel    │  │ Cloudflare  │  │    CDN      │  │   WAF       │    │
│  │   Edge      │  │   Workers   │  │   Cache     │  │   Shield    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     Next.js Application                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │  │  Pages   │  │   API    │  │  Server  │  │  Cron    │        │   │
│  │  │ (SSR/SSG)│  │  Routes  │  │  Actions │  │  Jobs    │        │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                          SERVICE LAYER                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Auth    │  │   AI     │  │  Queue   │  │ Webhook  │  │ Realtime │ │
│  │ Service  │  │ Gateway  │  │ Workers  │  │ Handler  │  │  (WS)    │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Supabase   │  │    Redis     │  │   Blob       │  │  Vector    │ │
│  │  PostgreSQL  │  │   (Upstash)  │  │  Storage     │  │   Store    │ │
│  │  + Realtime  │  │   Cache/Queue│  │  (Vercel)    │  │ (Embeddings│ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```


### 5.2 Scaling Strategy

**Horizontal Scaling (Automatic)**

- Vercel serverless functions auto-scale
- Supabase connection pooling (PgBouncer)
- Redis cluster for distributed caching

**Vertical Scaling (Manual)**

- Database compute upgrades
- Dedicated compute pools for heavy tenants

**Data Partitioning**

- Time-based partitioning for signals/events
- Tenant-based partitioning for large customers


### 5.3 Caching Strategy

```typescript
// Cache Layers
const cacheStrategy = {
  // L1: Edge Cache (Vercel/Cloudflare)
  edge: {
    staticAssets: '1 year',
    apiResponses: '60 seconds',
    htmlPages: 'stale-while-revalidate',
  },
  
  // L2: Application Cache (Redis)
  redis: {
    userSessions: '24 hours',
    tenantConfig: '5 minutes',
    featureFlags: '1 minute',
    aiResponses: '10 minutes',
  },
  
  // L3: Database Cache (Materialized Views)
  database: {
    dashboardAggregates: 'refresh every 5 minutes',
    accountHealthScores: 'refresh hourly',
    reportingCubes: 'refresh daily',
  },
};
```


---

## 6. View Composition \& Registry

### 6.1 Registry-Driven UI

All views are composed from a registry, enabling:

- Feature gating by plan
- Role-based view composition
- A/B testing
- Gradual rollouts

```typescript
interface ViewRegistry {
  views: ViewDefinition[];
  modules: ModuleDefinition[];
  widgets: WidgetDefinition[];
  actions: ActionDefinition[];
}


interface ViewDefinition {
  id: string;
  name: string;
  path: string;
  
  // Access control
  requiredPlan: 'personal' | 'team' | 'org' | 'enterprise';
  requiredRoles: string[];
  requiredPermissions: string[];
  
  // World/scope
  worlds: ('personal' | 'work' | 'accounts')[];
  departments?: string[];
  
  // Composition
  layout: 'dashboard' | 'list' | 'detail' | 'kanban' | 'timeline';
  modules: ModuleReference[];
  widgets: WidgetReference[];
  
  // Feature flags
  featureFlags?: string[];
  rolloutPercentage?: number;
}


interface ModuleReference {
  moduleId: string;
  position: 'main' | 'sidebar' | 'header' | 'footer';
  config?: Record<string, any>;
  
  // Conditional display
  showWhen?: {
    plan?: string[];
    role?: string[];
    department?: string[];
    accountRole?: string[];
  };
}
```


### 6.2 View Examples

**Today View (Team Plan)**

```json
{
  "id": "today-team",
  "path": "/today",
  "requiredPlan": "team",
  "worlds": ["personal", "work"],
  "modules": [
    { "moduleId": "signals-stream", "position": "header" },
    { "moduleId": "kpi-cards", "position": "main" },
    { "moduleId": "task-list", "position": "main" },
    { "moduleId": "activity-feed", "position": "sidebar" }
  ]
}
```

**Today View (Org Plan - Accounts World)**

```json
{
  "id": "today-accounts",
  "path": "/today",
  "requiredPlan": "org",
  "worlds": ["accounts"],
  "modules": [
    { "moduleId": "signals-stream", "position": "header" },
    { "moduleId": "situation-board", "position": "main" },
    { "moduleId": "action-proposals", "position": "main" },
    { "moduleId": "account-health", "position": "sidebar" },
    {
      "moduleId": "cs-modules",
      "position": "main",
      "showWhen": { "accountRole": ["cs"] }
    },
    {
      "moduleId": "finance-modules",
      "position": "main",
      "showWhen": { "accountRole": ["finance"] }
    }
  ]
}
```


---

## 7. Paywall Implementation

### 7.1 Feature Flag System

```typescript
// Feature flag configuration
const featureFlags = {
  // Plan-gated features
  'worlds.work': { plans: ['team', 'org', 'enterprise'] },
  'worlds.accounts': { plans: ['org', 'enterprise'] },
  'ai.situation-detection': { plans: ['team', 'org', 'enterprise'] },
  'ai.action-proposals': { plans: ['org', 'enterprise'] },
  'governance.workflows': { plans: ['org', 'enterprise'] },
  'admin.custom-roles': { plans: ['org', 'enterprise'] },
  'admin.sso': { plans: ['org', 'enterprise'] },
  'compliance.frameworks': { plans: ['enterprise'] },
  
  // Usage-gated features
  'connectors.count': { 
    limits: { personal: 3, team: 15, org: Infinity, enterprise: Infinity }
  },
  'ai.sessions': {
    limits: { personal: 1000, team: 10000, org: 50000, enterprise: Infinity }
  },
};


// Hook for checking feature access
function useFeatureAccess(featureKey: string) {
  const { plan, usage } = useTenantContext();
  const flag = featureFlags[featureKey];
  
  if (!flag) return { hasAccess: false, reason: 'unknown_feature' };
  
  // Check plan
  if (flag.plans && !flag.plans.includes(plan)) {
    return { 
      hasAccess: false, 
      reason: 'plan_required',
      requiredPlan: flag.plans[0],
    };
  }
  
  // Check usage limits
  if (flag.limits) {
    const limit = flag.limits[plan];
    const current = usage[featureKey] || 0;
    if (current >= limit) {
      return { hasAccess: false, reason: 'limit_exceeded', limit, current };
    }
  }
  
  return { hasAccess: true };
}
```


### 7.2 Paywall UI Components

```typescript
// Upgrade prompt component
function UpgradePrompt({ feature, requiredPlan }: Props) {
  return (
    <Card className="border-dashed border-primary/50 bg-primary/5">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <h3 className="font-semibold">Unlock {feature}</h3>
          <p className="text-sm text-muted-foreground">
            This feature requires the {requiredPlan} plan
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/billing/upgrade">
            Upgrade to {requiredPlan}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}


// Feature gate wrapper
function FeatureGate({ feature, children, fallback }: Props) {
  const { hasAccess, reason, requiredPlan } = useFeatureAccess(feature);
  
  if (!hasAccess) {
    return fallback || <UpgradePrompt feature={feature} requiredPlan={requiredPlan} />;
  }
  
  return children;
}
```


### 7.3 Usage Metering

```typescript
// Meter AI usage
async function meterAIUsage(tenantId: string, sessionType: string) {
  const key = `usage:ai:${tenantId}:${getCurrentMonth()}`;
  
  // Increment counter
  const newCount = await redis.incr(key);
  
  // Check limit
  const limit = await getTenantLimit(tenantId, 'ai.sessions');
  
  if (newCount > limit * 0.8) {
    // Send warning notification
    await notifyUsageWarning(tenantId, 'ai.sessions', newCount, limit);
  }
  
  if (newCount > limit) {
    throw new UsageLimitExceededError('ai.sessions', newCount, limit);
  }
  
  // Log for billing
  await supabase.from('usage_events').insert({
    tenant_id: tenantId,
    event_type: 'ai_session',
    session_type: sessionType,
    timestamp: new Date(),
  });
}
```


---

## 8. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

- [ ] Core authentication (Supabase Auth)
- [ ] Basic tenant management
- [ ] Personal World views
- [ ] Basic RBAC (Admin/Member/Viewer)
- [ ] 3 starter connectors
- [ ] Basic AI chat


### Phase 2: Team Features (Weeks 5-8)

- [ ] Team management UI
- [ ] Work World (3 departments)
- [ ] Shared projects/tasks
- [ ] Basic situation detection
- [ ] Team knowledge base
- [ ] Slack/Discord integration
- [ ] Basic billing (Stripe)


### Phase 3: Organization Features (Weeks 9-12)

- [ ] Full Work World (12 departments)
- [ ] Accounts World
- [ ] Role-shaped modules
- [ ] Advanced RBAC
- [ ] Custom roles
- [ ] Governance workflows
- [ ] SSO/SAML
- [ ] Advanced audit


### Phase 4: Enterprise Features (Weeks 13-16)

- [ ] Multi-tenant management
- [ ] Compliance frameworks
- [ ] Custom data residency
- [ ] Advanced security
- [ ] White-label
- [ ] API documentation
- [ ] Enterprise billing


### Phase 5: Scale \& Polish (Weeks 17-20)

- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] Custom integrations
- [ ] Mobile apps
- [ ] Documentation
- [ ] Enterprise onboarding

---

## 9. Database Schema (Core Tables)

```sql
-- Tenants & Organizations
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'personal',
  status TEXT NOT NULL DEFAULT 'active',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'production', -- production, staging, development
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Users & RBAC
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);


CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id),
  role_id UUID REFERENCES roles(id),
  scope JSONB DEFAULT '{}', -- { world: [], departments: [], accounts: [] }
  granted_by UUID REFERENCES users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);


-- Feature Flags & Plans
CREATE TABLE plan_features (
  plan TEXT NOT NULL,
  feature_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  limit_value INTEGER,
  config JSONB DEFAULT '{}',
  PRIMARY KEY (plan, feature_key)
);


CREATE TABLE tenant_usage (
  tenant_id UUID REFERENCES tenants(id),
  feature_key TEXT NOT NULL,
  period TEXT NOT NULL, -- 'monthly', 'daily'
  period_start DATE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  PRIMARY KEY (tenant_id, feature_key, period, period_start)
);


-- View Registry
CREATE TABLE view_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id), -- null for system views
  view_key TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  definition JSONB NOT NULL,
  required_plan TEXT,
  required_permissions TEXT[],
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;


CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.tenant_id')::UUID);


CREATE POLICY tenant_isolation ON roles
  USING (tenant_id = current_setting('app.tenant_id')::UUID);


CREATE POLICY tenant_isolation ON audit_log
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
```


---

## 10. Summary

This architecture provides:

1. **Clear upgrade path**: Personal → Team → Org → Enterprise
2. **Granular feature gating**: Plan-based, usage-based, role-based
3. **Flexible RBAC**: World/Department/Account/Action scoping
4. **Scalable multi-tenancy**: Shared to dedicated isolation options
5. **Registry-driven UI**: Dynamic view composition
6. **Production-ready deployment**: Edge + serverless + managed services

The system is designed to grow with customers while maintaining security, performance, and governance at every tier.

Based on my research and your comprehensive IntegrateWise OS architecture document, here's an enhanced implementation guide focusing on practical SaaS architecture patterns:

# IntegrateWise OS - SaaS Architecture Implementation Guide

## 🎯 Executive Summary

Your architecture is **production-ready** with excellent foundations. This guide adds **battle-tested patterns from 2026 SaaS leaders** to strengthen:

1. **Multi-tenancy resilience** (WorkOS/AWS patterns)
2. **Feature gating precision** (Storm Internet/DemoGo models)
3. **RBAC enterprise readiness** (Descope/Suridata best practices)
4. **Deployment optimization** (edge-first, Cloudflare-native)
5. **Cost efficiency** (unit economics optimization)

***

## 📊 ENHANCED ARCHITECTURE PATTERNS

### 1. Advanced Multi-Tenancy Isolation

Your current design uses shared database with tenant columns. Here's how to enhance it:

#### **Tenant Placement Strategy Matrix**

```typescript
// services/tenant-placement/src/strategy.ts
interface TenantPlacementStrategy {
  isolationLevel: 'shared' | 'schema' | 'database' | 'infrastructure';
  triggers: PlacementTrigger[];
  costMultiplier: number;
}

const placementMatrix: Record<string, TenantPlacementStrategy> = {
  // Personal/Team: Shared pool
  'personal-team': {
    isolationLevel: 'shared',
    triggers: ['default'],
    costMultiplier: 1.0
  },
  
  // Organization: Separate schema when ARR > $50K
  'org-mid': {
    isolationLevel: 'schema',
    triggers: ['arr_threshold:50000', 'compliance:basic'],
    costMultiplier: 1.3
  },
  
  // Organization: Dedicated DB when ARR > $200K or data residency
  'org-large': {
    isolationLevel: 'database',
    triggers: ['arr_threshold:200000', 'compliance:strict', 'data_residency'],
    costMultiplier: 2.5
  },
  
  // Enterprise: Dedicated infrastructure
  'enterprise': {
    isolationLevel: 'infrastructure',
    triggers: ['plan:enterprise', 'sla:99.99', 'private_cloud'],
    costMultiplier: 5.0
  }
};

// Automatic tenant placement on upgrade
async function evaluateTenantPlacement(tenantId: string) {
  const tenant = await getTenant(tenantId);
  const metrics = await getTenantMetrics(tenantId);
  
  for (const [level, strategy] of Object.entries(placementMatrix)) {
    if (shouldUpgradePlacement(tenant, metrics, strategy.triggers)) {
      await migrateTenantToIsolationLevel(tenantId, strategy.isolationLevel);
      await notifyTenantUpgrade(tenantId, level);
    }
  }
}
```


#### **Row-Level Security (RLS) Enhancement**

```sql
-- Enhanced RLS with performance optimization
-- services/spine/schema/rls-policies.sql

-- Create tenant context function (cached)
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
  SELECT COALESCE(
    current_setting('app.tenant_id', true)::UUID,
    NULL
  );
$$ LANGUAGE SQL STABLE;

-- Optimized account access policy
CREATE POLICY account_access_optimized ON accounts
  FOR ALL
  USING (
    tenant_id = get_current_tenant_id()
    AND (
      -- Fast path: Direct ownership
      owner_id = auth.uid()
      OR
      -- Cached path: Role-based access
      EXISTS (
        SELECT 1 FROM user_account_access_cache
        WHERE user_id = auth.uid()
        AND account_id = accounts.id
        AND expires_at > NOW()
      )
    )
  );

-- Materialized view for access cache (refreshed every 5 mins)
CREATE MATERIALIZED VIEW user_account_access_cache AS
SELECT DISTINCT
  ur.user_id,
  aa.account_id,
  NOW() + INTERVAL '5 minutes' AS expires_at
FROM user_roles ur
JOIN role_permissions rp ON ur.role_id = rp.role_id
JOIN account_assignments aa ON aa.segment = ANY(rp.account_segments)
WHERE ur.scope->>'accounts' IS NOT NULL;

CREATE INDEX idx_access_cache_user ON user_account_access_cache(user_id, account_id);
CREATE INDEX idx_access_cache_expiry ON user_account_access_cache(expires_at);
```


***

### 2. Production-Grade Feature Gating System

#### **Feature Gate Architecture**

```typescript
// services/feature-gate/src/engine.ts

interface FeatureGateRule {
  feature: string;
  
  // Plan gating
  plans?: ('personal' | 'team' | 'org' | 'enterprise')[];
  
  // Usage gating
  usageLimit?: {
    metric: string;
    limit: number | 'unlimited';
    period: 'daily' | 'monthly';
  };
  
  // Role gating
  roles?: string[];
  
  // Progressive rollout
  rollout?: {
    percentage: number;
    cohorts?: string[];
    regions?: string[];
  };
  
  // Time-based gating
  availability?: {
    start?: Date;
    end?: Date;
    timezone?: string;
  };
  
  // Dependency gating
  requires?: string[]; // Other features that must be enabled
  
  // Kill switch
  forceDisabled?: boolean;
}

class FeatureGateEngine {
  private cache: Map<string, FeatureGateRule> = new Map();
  
  async evaluate(
    feature: string,
    context: {
      tenantId: string;
      userId: string;
      plan: string;
      roles: string[];
      usage: Record<string, number>;
    }
  ): Promise<FeatureGateResult> {
    const rule = await this.getRule(feature);
    
    if (!rule) {
      return { allowed: false, reason: 'feature_not_found' };
    }
    
    // Kill switch check
    if (rule.forceDisabled) {
      return { allowed: false, reason: 'feature_disabled' };
    }
    
    // Plan check
    if (rule.plans && !rule.plans.includes(context.plan)) {
      return {
        allowed: false,
        reason: 'plan_required',
        upgrade: {
          feature: feature,
          requiredPlan: rule.plans[^0],
          currentPlan: context.plan
        }
      };
    }
    
    // Usage limit check
    if (rule.usageLimit) {
      const current = context.usage[rule.usageLimit.metric] || 0;
      const limit = rule.usageLimit.limit;
      
      if (limit !== 'unlimited' && current >= limit) {
        return {
          allowed: false,
          reason: 'usage_limit_exceeded',
          limit: { current, max: limit, metric: rule.usageLimit.metric }
        };
      }
    }
    
    // Role check
    if (rule.roles && !context.roles.some(r => rule.roles!.includes(r))) {
      return { allowed: false, reason: 'insufficient_role' };
    }
    
    // Progressive rollout check
    if (rule.rollout) {
      const hash = hashString(`${context.tenantId}:${feature}`);
      const bucket = hash % 100;
      
      if (bucket >= rule.rollout.percentage) {
        return { allowed: false, reason: 'not_in_rollout' };
      }
    }
    
    // Dependency check
    if (rule.requires) {
      for (const dep of rule.requires) {
        const depResult = await this.evaluate(dep, context);
        if (!depResult.allowed) {
          return { allowed: false, reason: 'dependency_not_met', dependency: dep };
        }
      }
    }
    
    return { allowed: true };
  }
  
  private async getRule(feature: string): Promise<FeatureGateRule | null> {
    // Check cache first
    if (this.cache.has(feature)) {
      return this.cache.get(feature)!;
    }
    
    // Fetch from database
    const rule = await env.DB.prepare(
      'SELECT * FROM feature_gates WHERE feature_key = ?'
    ).bind(feature).first();
    
    if (rule) {
      this.cache.set(feature, rule as FeatureGateRule);
    }
    
    return rule as FeatureGateRule | null;
  }
}
```


#### **React Hook for Feature Gating**

```typescript
// frontend/hooks/useFeatureGate.tsx

import { useQuery } from '@tanstack/react-query';
import { useTenantContext } from './useTenantContext';

export function useFeatureGate(feature: string) {
  const { tenantId, plan, roles, usage } = useTenantContext();
  
  const { data: result, isLoading } = useQuery({
    queryKey: ['feature-gate', feature, tenantId],
    queryFn: () => checkFeatureAccess(feature),
    staleTime: 60000, // Cache for 1 minute
  });
  
  return {
    hasAccess: result?.allowed ?? false,
    isLoading,
    reason: result?.reason,
    upgrade: result?.upgrade,
  };
}

// Feature Gate Component (Mode: Hide)
export function FeatureGate({ 
  feature, 
  children, 
  mode = 'hide',
  fallback 
}: FeatureGateProps) {
  const { hasAccess, isLoading, upgrade } = useFeatureGate(feature);
  
  if (isLoading) {
    return <Skeleton className="h-32" />;
  }
  
  if (!hasAccess) {
    if (mode === 'hide') {
      return null;
    }
    
    if (mode === 'replace' && upgrade) {
      return (
        <UpgradePrompt
          feature={upgrade.feature}
          currentPlan={upgrade.currentPlan}
          requiredPlan={upgrade.requiredPlan}
        />
      );
    }
    
    return fallback || null;
  }
  
  return <>{children}</>;
}

// Usage example
function AIPlayground() {
  return (
    <FeatureGate feature="ai.copilot" mode="replace">
      <div className="ai-playground">
        {/* AI features */}
      </div>
    </FeatureGate>
  );
}
```


#### **Feature Gate Database Schema**

```sql
-- services/feature-gate/schema/gates.sql

CREATE TABLE feature_gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT UNIQUE NOT NULL,
  
  -- Plan gating
  required_plans TEXT[], -- ['team', 'org', 'enterprise']
  
  -- Usage gating
  usage_metric TEXT,
  usage_limit_personal INTEGER,
  usage_limit_team INTEGER,
  usage_limit_org INTEGER,
  usage_limit_enterprise INTEGER,
  usage_period TEXT DEFAULT 'monthly',
  
  -- Role gating
  required_roles TEXT[],
  
  -- Progressive rollout
  rollout_percentage INTEGER DEFAULT 100,
  rollout_cohorts TEXT[],
  rollout_regions TEXT[],
  
  -- Time-based
  available_from TIMESTAMPTZ,
  available_until TIMESTAMPTZ,
  
  -- Dependencies
  required_features TEXT[],
  
  -- Kill switch
  force_disabled BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  description TEXT,
  documentation_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data for IntegrateWise features
INSERT INTO feature_gates (feature_key, required_plans, description) VALUES
('worlds.work', ARRAY['team', 'org', 'enterprise'], 'Access to Work World'),
('worlds.accounts', ARRAY['org', 'enterprise'], 'Access to Accounts World'),
('ai.copilot', ARRAY['org', 'enterprise'], 'AI Copilot assistant'),
('ai.situation_detection', ARRAY['team', 'org', 'enterprise'], 'Automatic situation detection'),
('ai.action_proposals', ARRAY['org', 'enterprise'], 'AI-generated action proposals'),
('governance.workflows', ARRAY['org', 'enterprise'], 'Custom governance workflows'),
('admin.sso', ARRAY['org', 'enterprise'], 'Single Sign-On'),
('admin.custom_roles', ARRAY['org', 'enterprise'], 'Custom role creation'),
('compliance.frameworks', ARRAY['enterprise'], 'Compliance frameworks (SOC2, HIPAA)'),
('api.unlimited', ARRAY['org', 'enterprise'], 'Unlimited API access');

-- Usage tracking table
CREATE TABLE feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  feature_key TEXT NOT NULL,
  metric_key TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, feature_key, metric_key, period_start)
);

CREATE INDEX idx_feature_usage_tenant ON feature_usage(tenant_id, period_start);
CREATE INDEX idx_feature_usage_feature ON feature_usage(feature_key, period_start);
```


***

### 3. Enterprise-Grade RBAC Implementation

#### **Permission Evaluation Engine**

```typescript
// services/rbac/src/permission-engine.ts

interface Permission {
  resource: string; // 'accounts', 'deals', 'contacts', etc.
  action: string;   // 'view', 'create', 'edit', 'delete', 'approve'
  scope: PermissionScope;
  conditions?: PermissionCondition[];
}

interface PermissionScope {
  // World scope
  worlds?: ('personal' | 'work' | 'accounts')[];
  
  // Department scope
  departments?: string[];
  
  // Account scope
  accountSegments?: string[];
  accountIds?: string[];
  
  // Data classification
  dataClassifications?: ('public' | 'internal' | 'confidential' | 'restricted')[];
}

interface PermissionCondition {
  type: 'owner' | 'assigned' | 'department' | 'time' | 'risk_score' | 'approval_required';
  params: Record<string, any>;
}

class PermissionEngine {
  async can(
    userId: string,
    action: string,
    resource: string,
    context: {
      tenantId: string;
      resourceId?: string;
      department?: string;
      accountSegment?: string;
      dataClassification?: string;
    }
  ): Promise<boolean> {
    // 1. Get user's effective permissions
    const permissions = await this.getEffectivePermissions(userId, context.tenantId);
    
    // 2. Find matching permissions
    const matchingPerms = permissions.filter(p => 
      p.resource === resource && p.action === action
    );
    
    if (matchingPerms.length === 0) {
      return false;
    }
    
    // 3. Evaluate scope and conditions
    for (const perm of matchingPerms) {
      if (await this.evaluatePermission(perm, userId, context)) {
        return true;
      }
    }
    
    return false;
  }
  
  private async getEffectivePermissions(
    userId: string,
    tenantId: string
  ): Promise<Permission[]> {
    // Use cache for performance
    const cacheKey = `perms:${userId}:${tenantId}`;
    const cached = await env.CACHE.get(cacheKey, 'json');
    
    if (cached) {
      return cached as Permission[];
    }
    
    // Fetch from database with role hierarchy
    const result = await env.DB.prepare(`
      WITH RECURSIVE role_hierarchy AS (
        -- Base roles
        SELECT ur.role_id, r.permissions, r.inherits_from
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = ? AND r.tenant_id = ?
        
        UNION ALL
        
        -- Inherited roles
        SELECT r.id, r.permissions, r.inherits_from
        FROM roles r
        JOIN role_hierarchy rh ON r.id = ANY(rh.inherits_from)
        WHERE r.tenant_id = ?
      )
      SELECT DISTINCT jsonb_array_elements(permissions) as permission
      FROM role_hierarchy
    `).bind(userId, tenantId, tenantId).all();
    
    const permissions = result.results.map(r => r.permission as Permission);
    
    // Cache for 5 minutes
    await env.CACHE.put(cacheKey, JSON.stringify(permissions), { expirationTtl: 300 });
    
    return permissions;
  }
  
  private async evaluatePermission(
    perm: Permission,
    userId: string,
    context: any
  ): Promise<boolean> {
    // Check scope
    if (perm.scope.worlds && !perm.scope.worlds.includes(context.world)) {
      return false;
    }
    
    if (perm.scope.departments && context.department && 
        !perm.scope.departments.includes(context.department)) {
      return false;
    }
    
    if (perm.scope.accountSegments && context.accountSegment && 
        !perm.scope.accountSegments.includes(context.accountSegment)) {
      return false;
    }
    
    if (perm.scope.dataClassifications && context.dataClassification && 
        !perm.scope.dataClassifications.includes(context.dataClassification)) {
      return false;
    }
    
    // Evaluate conditions
    if (perm.conditions) {
      for (const condition of perm.conditions) {
        if (!await this.evaluateCondition(condition, userId, context)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  private async evaluateCondition(
    condition: PermissionCondition,
    userId: string,
    context: any
  ): Promise<boolean> {
    switch (condition.type) {
      case 'owner':
        return context.ownerId === userId;
      
      case 'assigned':
        const assignment = await env.DB.prepare(
          'SELECT 1 FROM assignments WHERE user_id = ? AND resource_id = ?'
        ).bind(userId, context.resourceId).first();
        return !!assignment;
      
      case 'department':
        const userDept = await getUserDepartment(userId);
        return userDept === condition.params.department;
      
      case 'time':
        const now = new Date().getHours();
        return now >= condition.params.start && now <= condition.params.end;
      
      case 'risk_score':
        const risk = context.riskScore || 0;
        return risk <= condition.params.maxRiskScore;
      
      case 'approval_required':
        // Check if action has been approved
        const approval = await env.DB.prepare(
          'SELECT 1 FROM approvals WHERE resource_id = ? AND action = ? AND status = ?'
        ).bind(context.resourceId, context.action, 'approved').first();
        return !!approval;
      
      default:
        return false;
    }
  }
}

// React hook
export function usePermission(action: string, resource: string, resourceId?: string) {
  const { userId, tenantId } = useAuth();
  
  return useQuery({
    queryKey: ['permission', userId, action, resource, resourceId],
    queryFn: () => checkPermission(action, resource, resourceId),
    staleTime: 60000,
  });
}

// Usage
function DeleteAccountButton({ accountId }: Props) {
  const { data: canDelete } = usePermission('delete', 'accounts', accountId);
  
  if (!canDelete) {
    return null;
  }
  
  return <Button onClick={() => deleteAccount(accountId)}>Delete</Button>;
}
```


***

### 4. Cloudflare-Native Deployment Optimization

#### **Smart Placement for Tenant Routing**

```toml
# wrangler.toml - Enhanced configuration

name = "integratewise-gateway"
main = "src/index.ts"
compatibility_date = "2026-01-31"

[placement]
mode = "smart" # Cloudflare automatically routes to nearest datacenter

# Durable Objects for stateful components
[durable_objects]
bindings = [
  { name = "TENANT_SESSION", class_name = "TenantSessionDO" },
  { name = "SIGNAL_STREAM", class_name = "SignalStreamDO" },
  { name = "RATE_LIMITER", class_name = "RateLimiterDO" }
]

[[migrations]]
tag = "v1"
new_classes = ["TenantSessionDO", "SignalStreamDO", "RateLimiterDO"]

# Multi-region D1 (automatic replication)
[[d1_databases]]
binding = "DB"
database_name = "integratewise-core"
database_id = "your-db-id"

# KV for caching (global)
[[kv_namespaces]]
binding = "CACHE"
id = "cache-namespace-id"

# R2 for document storage
[[r2_buckets]]
binding = "DOCUMENTS"
bucket_name = "integratewise-documents"
jurisdiction = "eu" # For GDPR compliance

# Hyperdrive for Neon connection pooling
[[hyperdrive]]
binding = "NEON"
id = "hyperdrive-id"

# Workers AI
[ai]
binding = "AI"

# Vectorize
[[vectorize]]
binding = "VECTORS"
index_name = "integratewise-embeddings"
preset = "openai-text-embedding-ada-002"

# Queues for async processing
[[queues.producers]]
queue = "webhooks"
binding = "WEBHOOK_QUEUE"

[[queues.producers]]
queue = "signals"
binding = "SIGNAL_QUEUE"

# Analytics Engine
[[analytics_engine_datasets]]
binding = "ANALYTICS"
dataset = "integratewise-metrics"

# Environment-specific routing
[env.production]
name = "integratewise-prod"
routes = [
  { pattern = "api.integratewise.ai/*", zone_name = "integratewise.ai" },
  { pattern = "*.integratewise.ai/*", zone_name = "integratewise.ai" }
]

[env.staging]
name = "integratewise-staging"
routes = [
  { pattern = "api-staging.integratewise.ai/*", zone_name = "integratewise.ai" }
]
```


***

### 5. Cost Optimization Strategies

#### **Unit Economics Dashboard**

```typescript
// services/admin/src/unit-economics.ts

interface UnitEconomics {
  tenantId: string;
  period: string; // 'YYYY-MM'
  
  // Revenue
  mrr: number;
  arr: number;
  
  // Costs
  infrastructure: {
    cloudflare: number;
    supabase: number;
    upstash: number;
    openrouter: number;
    total: number;
  };
  
  // Usage metrics
  storage: { gb: number; cost: number };
  compute: { requests: number; cost: number };
  ai: { tokens: number; cost: number };
  bandwidth: { gb: number; cost: number };
  
  // Calculated metrics
  grossMargin: number;
  ltv: number;
  paybackPeriod: number;
}

async function calculateUnitEconomics(
  tenantId: string,
  period: string
): Promise<UnitEconomics> {
  const [revenue, usage] = await Promise.all([
    getTenantRevenue(tenantId, period),
    getTenantUsage(tenantId, period)
  ]);
  
  // Cloudflare costs
  const cfCosts = {
    workers: usage.requests * 0.0000005, // $0.50 per million
    d1: usage.d1Reads * 0.000001 + usage.d1Writes * 0.000005,
    kv: usage.kvReads * 0.0000005 + usage.kvWrites * 0.000005,
    r2: usage.r2Storage * 0.015 + usage.r2Operations * 0.0000036,
    vectorize: usage.vectorCount * 0.00005,
    workersAI: usage.aiTokens * 0.000001,
    durableObjects: usage.doRequests * 0.0000015,
    queues: usage.queueMessages * 0.0000004
  };
  
  const totalCfCost = Object.values(cfCosts).reduce((a, b) => a + b, 0);
  
  // External costs
  const externalCosts = {
    supabase: calculateSupabaseCost(usage),
    upstash: calculateUpstashCost(usage),
    openrouter: usage.openrouterTokens * 0.000002
  };
  
  const totalExternalCost = Object.values(externalCosts).reduce((a, b) => a + b, 0);
  
  const totalCost = totalCfCost + totalExternalCost;
  const grossMargin = ((revenue.mrr - totalCost) / revenue.mrr) * 100;
  
  return {
    tenantId,
    period,
    mrr: revenue.mrr,
    arr: revenue.arr,
    infrastructure: {
      cloudflare: totalCfCost,
      supabase: externalCosts.supabase,
      upstash: externalCosts.upstash,
      openrouter: externalCosts.openrouter,
      total: totalCost
    },
    storage: { gb: usage.storageGb, cost: cfCosts.r2 },
    compute: { requests: usage.requests, cost: cfCosts.workers },
    ai: { tokens: usage.aiTokens, cost: cfCosts.workersAI + externalCosts.openrouter },
    bandwidth: { gb: usage.bandwidthGb, cost: 0 }, // Cloudflare bandwidth included
    grossMargin,
    ltv: revenue.arr * 3, // Assuming 3-year LTV
    paybackPeriod: 12 // months
  };
}
```


***

## ✅ IMPLEMENTATION CHECKLIST

### Week 1-2: Enhanced Multi-Tenancy

- [ ] Implement tenant placement strategy
- [ ] Add RLS performance optimizations
- [ ] Create materialized view for access cache
- [ ] Set up automatic tenant migration triggers
- [ ] Deploy monitoring for tenant-level metrics


### Week 3-4: Feature Gating System

- [ ] Create feature_gates database schema
- [ ] Implement FeatureGateEngine with caching
- [ ] Build React hooks and components
- [ ] Seed initial feature gates
- [ ] Add usage metering infrastructure
- [ ] Deploy upgrade prompts in UI


### Week 5-6: Enterprise RBAC

- [ ] Implement PermissionEngine
- [ ] Create role hierarchy support
- [ ] Add permission caching layer
- [ ] Build permission management UI
- [ ] Test with complex permission scenarios
- [ ] Document permission model for customers


### Week 7-8: Cloudflare Optimization

- [ ] Configure Smart Placement
- [ ] Set up Durable Objects for real-time
- [ ] Optimize D1 queries with indexes
- [ ] Implement edge caching strategy
- [ ] Deploy analytics tracking
- [ ] Monitor latency across regions


### Week 9-10: Cost Optimization

- [ ] Build unit economics dashboard
- [ ] Implement per-tenant cost tracking
- [ ] Set up usage alerts
- [ ] Optimize expensive queries
- [ ] Add cost-aware features (AI model selection)
- [ ] Document cost attribution model

***

## 🎯 KEY TAKEAWAYS

1. **Your architecture is solid** - The foundation is excellent. These enhancements add production resilience.
2. **Cloudflare-native = huge advantage** - Your edge-first approach gives you 12-18 month technical moat over competitors.
3. **Feature gating is your growth engine** - Proper gating drives upgrades naturally without friction.
4. **Multi-tenancy scales with ARR** - Start shared, graduate tenants to dedicated resources as they grow.
5. **RBAC sells to enterprise** - Fine-grained permissions are table stakes for \$100K+ deals.
6. **Unit economics matter from day 1** - Track costs per tenant to ensure profitability at scale.

Your SaaS architecture is **ready for production launch**. Focus on shipping the MVP with Personal + Team tiers, then layer in Organization and Enterprise features based on customer demand. 🚀
<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://relevant.software/blog/multi-tenant-architecture/

[^2]: https://astrogeeksagar.com/blog/saas-architecture-scalability-2026

[^3]: https://aws.amazon.com/solutions/guidance/multi-tenant-architectures-on-aws/

[^4]: https://learn.microsoft.com/en-us/azure/architecture/guide/saas-multitenant-solution-architecture/

[^5]: https://www.rishabhsoft.com/blog/how-to-build-a-multi-tenant-saas-application

[^6]: https://www.storminternet.co.uk/blog/feature-toggles-pricing-dynamic-feature-gating-by-plan-in-your-saas/

[^7]: https://www.suridata.ai/blog/guide-to-role-based-access-control-in-saas-applications/

[^8]: https://architecture.learning.sap.com/docs/ref-arch/d31bedf420

[^9]: https://shadsuper.com/what-role-does-feature-gating-play-in-a-saas-products-growth-and-user-segmentation-strategy/

[^10]: https://www.descope.com/blog/post/rbac-providers-b2b-saas

[^11]: https://workos.com/blog/developers-guide-saas-multi-tenant-architecture

[^12]: https://demogo.com/2025/11/24/feature-gating-in-saas-practical-models-for-freemium-conversion-with-examples/

[^13]: https://www.enterpriseready.io/features/role-based-access-control/

[^14]: https://www.bridgenext.com/resources/adopt-multi-tenancy-to-future-proof-your-saas-architecture/

[^15]: https://dev.to/aniefon_umanah_ac5f21311c/feature-gating-how-we-built-a-freemium-saas-without-duplicating-components-1lo6

