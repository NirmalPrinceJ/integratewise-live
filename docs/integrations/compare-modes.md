# Full Integration vs Render Only Mode

IntegrateWise offers two distinct modes of operation to satisfy different security and compliance postures.

## Comparison Table

| Feature | Full Integration | Render Only |
|---|---|---|
| **Write Access** | ✅ Read & Write | ❌ Read Only |
| **Approvals** | Optional (Configurable) | N/A (No Writes) |
| **RBAC Scope** | Editor / Contributor | Viewer Only |
| **Audit Trails** | Full (Read + Write ops) | Access Log Only |
| **Failure Rollback** | Automated | N/A |
| **Data Residency** | Hosted / Hybrid | Ephemeral / Client-Side |
| **Caching** | Persistent (Spine) | Short-lived (TTL 5m) |
| **SLA Coverage** | 99.9% | 99.95% |
| **Connector Caps** | All Enabled | Write APIs Blocked |

## Render Only Enforcement

When a workspace is configured in **Render Only** mode, the following technical controls are enforced by the Hub:

1.  **API Deny List**: All HTTP verbs except `GET`, `HEAD`, `OPTIONS` are blocked at the proxy level for connector endpoints.
2.  **Policy Checks**: The Policy Engine validates every outbound request against a "No-Side-Effects" policy.
3.  **Audit Validation**: A background job verifies that no state-changing operations were recorded in the connector logs.
4.  **Ephemeral Storage**: Data fetched is held in memory or short-lived cache (Redis) only for the duration of the render session; it is not persisted to the Spine long-term storage (Postgres).
5.  **Periodic Compliance Export**: Automated reports demonstrating "Read Only" adherence generated monthly.

### Verification Checklist

To verify a Render Only setup:
- [ ] Attempt a `POST` / `PUT` / `DELETE` action via the API; ensure 403 Forbidden is returned.
- [ ] Verify that the `mode` flag in Workspace Settings is set to `render_only`.
- [ ] Check Audit Logs; ensure `action_type` contains only `read`, `list`, `fetch`.
- [ ] Validate that "Write" buttons in the UI are disabled or hidden.
