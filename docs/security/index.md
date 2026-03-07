# Security & Governance

Security whitepaper summary, authentication, authorization, tenancy model, and audit logging.

## Overview

IntegrateWise OS is built with security-first principles, implementing industry-standard controls for authentication, authorization, data isolation, encryption, and audit logging.

## Authentication

### OAuth2

**Supported Flows:**
- Authorization Code Flow (with PKCE)
- Client Credentials Flow (for service accounts)
- Refresh Token Flow

**Token Management:**
- Access tokens: JWT format, 1-hour expiration
- Refresh tokens: Long-lived, revocable
- Token rotation: Automatic on refresh

**Security Features:**
- PKCE for public clients
- State parameter for CSRF protection
- Token revocation on logout
- Scope-based access control

### API Keys

**Format:**
- Prefix: `iw_live_` (production) or `iw_test_` (preview)
- Length: 64 characters
- Example: `iw_live_1234567890abcdef...`

**Security:**
- Hashed storage (bcrypt)
- Last used timestamp tracked
- Revocable via API or UI
- Rate limits per key

### Service Accounts

**Use Cases:**
- CI/CD pipelines
- Automated workflows
- System integrations

**Authentication:**
- Service account key (JSON)
- mTLS (where applicable)
- IP allowlisting (optional)

## Authorization

### RBAC (Role-Based Access Control)

**Roles:**

| Role | Description | Permissions |
|------|-------------|-------------|
| **Admin** | Full workspace access | All operations |
| **Operator** | Operational access | Read/write operations, no admin |
| **Contributor** | Content creation | Create/update entities, limited reads |
| **Viewer** | Read-only access | Read operations only |

**Resource Scopes:**

| Resource | Admin | Operator | Contributor | Viewer |
|----------|-------|----------|-------------|--------|
| **Agents** | All | Invoke, Read | Read | Read |
| **Render** | All | All | Create, Read | Read |
| **Integrations** | All | Connect, Read | Read | Read |
| **Templates** | All | Install, Read | Read | Read |
| **Spine Entities** | All | Read/Write | Create/Update | Read |
| **Audit Logs** | All | Read | None | None |
| **Settings** | All | Read | None | None |

### ABAC (Attribute-Based Access Control)

**Attributes:**
- User attributes (department, role, location)
- Resource attributes (workspace, sensitivity level)
- Context attributes (time, IP address, device)

**Policy Examples:**
- "Users in Finance department can access financial data"
- "High-sensitivity resources require approval"
- "Access from untrusted IPs requires MFA"

### Workspace Isolation

**Isolation Model:**
- Data isolation per workspace
- Cross-workspace access denied by default
- Workspace-level RBAC
- Resource-level permissions

**Enforcement:**
- Database-level row security
- API-level workspace filtering
- Audit logging per workspace

## Tenancy Model

### Workspace Isolation

**Data Isolation:**
- Each workspace has isolated data store
- Cross-workspace queries denied
- Workspace-level encryption keys

**Resource Isolation:**
- Connectors scoped to workspace
- Agents scoped to workspace
- Templates scoped to workspace

### Data Residency

**Options:**
- **US**: US East (default)
- **EU**: EU West (GDPR-compliant)
- **Custom**: On-premise or dedicated cloud

**Configuration:**
- Set at workspace creation
- Cannot be changed after creation
- Data migration required for changes

### Encryption

**In Transit:**
- TLS 1.2+ (TLS 1.3 preferred)
- Perfect Forward Secrecy
- Certificate pinning (mobile apps)

**At Rest:**
- AES-256 encryption
- Workspace-level encryption keys
- Key rotation: 90 days
- Key management: AWS KMS / Azure Key Vault

### Secrets Management

**Recommended Pattern:**
- **Bitwarden**: For API keys, OAuth secrets
- **AWS Secrets Manager**: For production secrets
- **HashiCorp Vault**: For enterprise deployments

**Best Practices:**
- Never commit secrets to code
- Rotate secrets regularly
- Use environment variables
- Audit secret access

## Audit Logging

### Audit Event Schema

```typescript
interface AuditEvent {
  workspace_id: string;
  actor_id: string;
  action_type: 'read' | 'write' | 'delete' | 'approve' | 'deny';
  resource_type: string;
  resource_id?: string;
  timestamp: string; // ISO 8601
  request_id: string;
  policy_id?: string;
  outcome: 'success' | 'failure' | 'denied';
  metadata?: Record<string, unknown>;
}
```

### Event Categories

**Authentication:**
- Login success/failure
- Token refresh
- Logout
- MFA events

**Authorization:**
- Policy evaluation
- Access granted/denied
- Role changes
- Permission changes

**Data Access:**
- Entity reads
- Entity writes
- Entity deletes
- Bulk operations

**Administrative:**
- Workspace creation/deletion
- User management
- Integration configuration
- Template installation

### Retention

**Retention Windows:**
- **Standard**: 1 year
- **Compliance**: 7 years (configurable)
- **Security Events**: 7 years (immutable)

**Export Capabilities:**
- CSV export
- JSON export
- SIEM integration (Splunk, Datadog, etc.)
- API access for programmatic export

### Compliance

**Regulatory Mapping:**

| Control Family | Standard | IntegrateWise Control |
|---------------|----------|----------------------|
| **Access Control** | SOC 2 CC6.1 | RBAC, ABAC, workspace isolation |
| **Encryption** | SOC 2 CC6.7 | TLS 1.2+, AES-256 at rest |
| **Audit Logging** | SOC 2 CC7.2 | Comprehensive audit trail |
| **Data Residency** | GDPR Art. 45 | EU data residency option |
| **Data Subject Rights** | GDPR Art. 15-22 | Data export, deletion |
| **Incident Response** | ISO 27001 A.16 | Security event monitoring |

**SOC 2 Control Families:**
- CC6: Logical and Physical Access Controls
- CC7: System Operations
- CC8: Change Management

**ISO 27001 Annex A References:**
- A.9: Access Control
- A.10: Cryptography
- A.12: Operations Security
- A.16: Information Security Incident Management

**GDPR Data Subject Rights:**
- Right to access (Art. 15)
- Right to rectification (Art. 16)
- Right to erasure (Art. 17)
- Right to data portability (Art. 20)

## Security Headers

**HTTP Security Headers:**
- `Content-Security-Policy`: Restrict resource loading
- `X-Frame-Options`: Prevent clickjacking
- `X-Content-Type-Options`: Prevent MIME sniffing
- `Referrer-Policy`: Control referrer information
- `Permissions-Policy`: Restrict browser features

**Example Configuration:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## See Also

- [RBAC & ABAC](./rbac-abac.md) - Detailed authorization matrix
- [Webhooks Documentation](../webhooks/index.md) - Webhook security
- [Compliance](./compliance.md) - Compliance details
