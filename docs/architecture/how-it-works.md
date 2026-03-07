# How It Works: IntegrateWise Architecture

This document defines the component I/O contracts and the canonical data flow within the IntegrateWise OS.

## Core Components

### 1. Hub (The Gateway)
The entry point for all external signals and user actions.
- **Responsibilities**: Authentication, Rate Limiting, Routing, Policy Enforcement, Audit Logging.
- **Input**: Webhooks (HTTP), API Requests (REST/GraphQL).
- **Output**: Validated Events (Internal Event Bus).
- **Adapters**: Auth Adapters (OAuth2, API Key), Usage Meter.

### 2. AI Loader (The Ingest Engine)
Transforms raw data into Spine-compatible formats.
- **Responsibilities**: Data Mapping, Normalization, Conflict Resolution, Validation.
- **Input**: Raw Connector Payloads (JSON).
- **Output**: Normalized Spine Entities (`Task`, `Note`, `Conversation`).

### 3. Spine (The State Store)
The canonical database preserving structure and relationships.
- **Responsibilities**: Persistence, Referential Integrity, Querying.
- **Schema**: See [Spine Schemas](../spine/schemas.md).
- **Storage**: Postgres (Structured), Vector DB (Embeddings).

### 4. Brain (The Intelligence)
The semantic layer for memory and reasoning.
- **Responsibilities**: Embeddings, Context Retrieval, Deduplication, Linking.
- **Input**: New Spine Entities, Search Queries.
- **Output**: Related Context, Linkage Scores.
- **Memory**: Short-term (Session), Long-term (Vector).

### 5. Agents (The Workers)
Autonomous units performing specific missions.
- **Responsibilities**: Planning, Execution, Approval Flows, Sandboxing.
- **Triggers**: Events (e.g., "New Email"), Schedules, Manual Invocation.
- **Output**: Actions (Write back to connectors), Synthesized Content.

### 6. Render (The View Layer)
Generates consumption-ready artifacts.
- **Responsibilities**: Templating, Formatting, Exporting.
- **Output Types**: Dashboards, Email Digests, PDFs, Notion Pages.

## Canonical Sequence Flow

The following flow describes how a Slack message is processed into a Task and notified via Email.

1.  **Ingest**: Slack sends a webhook to **Hub**.
2.  **Auth**: Hub validates signature and routes to **AI Loader**.
3.  **Map**: Loader maps Slack payload to `Spine Task`.
4.  **Write**: Loader writes Task to **Spine**.
5.  **Memory**: **Brain** updates vector index and links to related projects.
6.  **Plan**: **Agent** wakes up, sees new Task, drafts a plan.
7.  **Approval**: Agent requests human approval (if needed).
8.  **Execute**: Agent updates **Spine** state.
9.  **Render**: **Render** engine creates a "New Task" email summary.
10. **Audit**: All steps logged to Audit Log.

## Component I/O Contracts

### Hub
- **Input**: `HTTPRequest { headers, body, method, path }`
- **Output**: `RoutedEvent { source_id, event_type, payload, trace_id }`
- **Error**: `401 Unauthorized`, `429 Too Many Requests`

### AI Loader
- **Input**: `RoutedEvent`
- **Output**: `EntityMutation { entity_type, operation, data }`
- **Error**: `ValidationException`, `MappingError`

### Brain
- **Input**: `Entity { id, content }` or `Query { text, filters }`
- **Output**: `Vector { embedding }` or `SearchResults { matches[] }`

### Agents
- **Input**: `TriggerContext { event, related_entities }`
- **Output**: `Plan { actions[] }`
