# IntegrateWise Connector Inventory

This document tracks all external systems, tools, and platforms integrated with the IntegrateWise Unified Plane.

## 1. CRM & Customer Data

| System | Connector Path | Auth Source (Vault) | Flow | Status |
|--------|----------------|---------------------|------|--------|
| Salesforce | `services/act` | `SALESFORCE_CLIENT_ID` | Outbound | Mocked |
| HubSpot | TBD | `HUBSPOT_API_KEY` | Inbound/Outbound | Planned |

## 2. Billing & Finance

| System | Connector Path | Auth Source (Vault) | Flow | Status |
|--------|----------------|---------------------|------|--------|
| Stripe | `services/act`, `services/gateway` | `STRIPE_SECRET_KEY` | Bi-directional | Mocked |

## 3. Communication & Support

| System | Connector Path | Auth Source (Vault) | Flow | Status |
|--------|----------------|---------------------|------|--------|
| Slack | `services/act` | `SLACK_BOT_TOKEN` | Outbound | Mocked |
| Zendesk | TBD | `ZENDESK_API_TOKEN` | Inbound | Planned |

## 4. AI & Intelligence

| System | Connector Path | Auth Source (Vault) | Flow | Status |
|--------|----------------|---------------------|------|--------|
| OpenAI | `services/knowledge`, `services/think` | `OPENAI_API_KEY` | Outbound | Active |
| Anthropic | TBD | `ANTHROPIC_API_KEY` | Outbound | Planned |

## 5. Storage & Knowledge

| System | Connector Path | Auth Source (Vault) | Flow | Status |
|--------|----------------|---------------------|------|--------|
| Box | `services/knowledge` | `BOX_CLIENT_ID` | Outbound | Proxy active |
| Google Drive | TBD | `GOOGLE_DRIVE_ID` | Outbound | Planned |

## Ownership & Consistency Standards

- **Canonical Config**: Each tenant MUST have a single config entry in the `connector_config` table (to be created).
- **Vault Naming**: `TENANT_<ID>_<SYSTEM>_<KEY_NAME>` (e.g., `TENANT_123_STRIPE_SECRET`).
- **Rotation**: Keys should be rotated every 90 days.
