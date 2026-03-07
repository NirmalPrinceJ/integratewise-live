# RBAC & ABAC Matrix

Detailed role-based and attribute-based access control matrix for IntegrateWise OS.

## RBAC Matrix

### Roles

| Role | Description | Use Cases |
|------|-------------|-----------|
| **Admin** | Full workspace access | Workspace owners, IT administrators |
| **Operator** | Operational access | Team leads, operations staff |
| **Contributor** | Content creation | Team members, content creators |
| **Viewer** | Read-only access | Stakeholders, auditors |

### Resource Permissions

#### Agents

| Action | Admin | Operator | Contributor | Viewer |
|--------|-------|----------|------------|-------|
| **Create Agent** | ✅ | ❌ | ❌ | ❌ |
| **Update Agent** | ✅ | ✅ | ❌ | ❌ |
| **Delete Agent** | ✅ | ❌ | ❌ | ❌ |
| **Invoke Agent** | ✅ | ✅ | ❌ | ❌ |
| **View Agent** | ✅ | ✅ | ✅ | ✅ |
| **View Invocations** | ✅ | ✅ | ✅ | ✅ |

#### Render

| Action | Admin | Operator | Contributor | Viewer |
|--------|-------|----------|------------|-------|
| **Create Template** | ✅ | ❌ | ❌ | ❌ |
| **Update Template** | ✅ | ✅ | ❌ | ❌ |
| **Delete Template** | ✅ | ❌ | ❌ | ❌ |
| **Render Output** | ✅ | ✅ | ✅ | ❌ |
| **View Template** | ✅ | ✅ | ✅ | ✅ |
| **View Outputs** | ✅ | ✅ | ✅ | ✅ |

#### Integrations

| Action | Admin | Operator | Contributor | Viewer |
|--------|-------|----------|------------|-------|
| **Connect Integration** | ✅ | ✅ | ❌ | ❌ |
| **Disconnect Integration** | ✅ | ✅ | ❌ | ❌ |
| **Update Integration** | ✅ | ✅ | ❌ | ❌ |
| **View Integration** | ✅ | ✅ | ✅ | ✅ |
| **View Webhooks** | ✅ | ✅ | ✅ | ✅ |

#### Templates

| Action | Admin | Operator | Contributor | Viewer |
|--------|-------|----------|------------|-------|
| **Install Template** | ✅ | ✅ | ❌ | ❌ |
| **Uninstall Template** | ✅ | ✅ | ❌ | ❌ |
| **Update Template** | ✅ | ✅ | ❌ | ❌ |
| **View Template** | ✅ | ✅ | ✅ | ✅ |
| **View Executions** | ✅ | ✅ | ✅ | ✅ |

#### Spine Entities

| Action | Admin | Operator | Contributor | Viewer |
|--------|-------|----------|------------|-------|
| **Create Entity** | ✅ | ✅ | ✅ | ❌ |
| **Update Entity** | ✅ | ✅ | ✅ | ❌ |
| **Delete Entity** | ✅ | ✅ | ❌ | ❌ |
| **Read Entity** | ✅ | ✅ | ✅ | ✅ |
| **Bulk Operations** | ✅ | ✅ | ❌ | ❌ |

#### Audit Logs

| Action | Admin | Operator | Contributor | Viewer |
|--------|-------|----------|------------|-------|
| **View Audit Logs** | ✅ | ✅ | ❌ | ❌ |
| **Export Audit Logs** | ✅ | ✅ | ❌ | ❌ |
| **Delete Audit Logs** | ✅ | ❌ | ❌ | ❌ |

#### Settings

| Action | Admin | Operator | Contributor | Viewer |
|--------|-------|----------|------------|-------|
| **View Settings** | ✅ | ✅ | ❌ | ❌ |
| **Update Settings** | ✅ | ❌ | ❌ | ❌ |
| **Manage Users** | ✅ | ❌ | ❌ | ❌ |
| **Manage Workspace** | ✅ | ❌ | ❌ | ❌ |

## ABAC Policies

### Attribute Definitions

**User Attributes:**
- `user.department`: Department name
- `user.role`: Job role
- `user.location`: Geographic location
- `user.security_clearance`: Security clearance level

**Resource Attributes:**
- `resource.workspace_id`: Workspace identifier
- `resource.sensitivity_level`: low | medium | high | confidential
- `resource.data_classification`: public | internal | confidential | restricted

**Context Attributes:**
- `context.time`: Time of access
- `context.ip_address`: IP address
- `context.device_type`: Device type
- `context.location`: Geographic location

### Policy Examples

#### Department-Based Access

**Policy:** "Users in Finance department can access financial data"

```yaml
policy:
  id: finance-access
  description: Finance department access to financial data
  rules:
    - effect: allow
      conditions:
        - user.department == "Finance"
        - resource.data_classification in ["internal", "confidential"]
      actions:
        - read
        - write
```

#### High-Sensitivity Resource Protection

**Policy:** "High-sensitivity resources require approval"

```yaml
policy:
  id: high-sensitivity-approval
  description: Approval required for high-sensitivity resources
  rules:
    - effect: require_approval
      conditions:
        - resource.sensitivity_level == "high"
        - action == "write"
      actions:
        - write
        - delete
```

#### Time-Based Access

**Policy:** "Access from untrusted IPs requires MFA"

```yaml
policy:
  id: untrusted-ip-mfa
  description: MFA required for untrusted IPs
  rules:
    - effect: require_mfa
      conditions:
        - context.ip_address not in trusted_ips
        - action == "write"
      actions:
        - write
        - delete
```

#### Geographic Restrictions

**Policy:** "EU data can only be accessed from EU locations"

```yaml
policy:
  id: eu-data-geo-restriction
  description: EU data geographic restriction
  rules:
    - effect: deny
      conditions:
        - resource.data_residency == "EU"
        - context.location not in eu_countries
      actions:
        - read
        - write
```

## Workspace Isolation

### Isolation Rules

1. **Data Isolation**: Each workspace has isolated data store
2. **Cross-Workspace Access**: Denied by default
3. **Workspace-Level RBAC**: Roles scoped to workspace
4. **Resource-Level Permissions**: Fine-grained permissions

### Enforcement

**Database Level:**
- Row-level security (RLS) policies
- Workspace ID in every query
- Cross-workspace queries blocked

**API Level:**
- Workspace ID extracted from token
- Workspace filtering on all queries
- Workspace validation on all writes

**Audit Level:**
- Workspace ID in every audit event
- Workspace-scoped audit queries
- Cross-workspace audit access denied

## Permission Inheritance

### Hierarchy

1. **Workspace Admin**: Inherits all permissions
2. **Resource Owner**: Inherits resource-level permissions
3. **Role Permissions**: Base permissions from role
4. **Explicit Permissions**: Override role permissions

### Examples

**Workspace Admin:**
- Inherits: All permissions
- Override: None (full access)

**Resource Owner:**
- Inherits: Role permissions
- Override: Full access to owned resources

**Contributor:**
- Inherits: Create/update permissions
- Override: Read-only on sensitive resources

## See Also

- [Security Overview](./index.md) - Security documentation
- [Audit Logging](./index.md#audit-logging) - Audit details
- [API Reference](../api/index.md) - API authorization
