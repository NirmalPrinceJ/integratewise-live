# Knowledge-Worker Route Map (v1)

This document defines the API surface for the `knowledge-worker`, which bundles the logical services for Unstructured Data (Knowledge/RAG), AI Chat Capture (IQ Hub/MCP), and Blob Storage (Store).

---

## 1. Overview & Conventions

- **Base URL**: `https://knowledge-worker.integratewise.workers.dev/v1` (Production)
- **Versioning**: All routes prefixed with `/v1`.
- **Tenant Isolation**: Mandatory `x-tenant-id` header or JWT claim for all `tenant` auth level routes.
- **Pagination**: Standard `limit` and `offset` (or `cursor`) for list operations. Default limit: 50.
- **Filtering**: Query parameters for lists (e.g., `?entity_type=lead`).

---

## 2. Route Map

| Category | Method | Path | Purpose | Auth | Ownership |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Knowledge** | `POST` | `/knowledge/ingest` | Ingest doc (extract, chunk, embed) | `internal` | `knowledge` |
| **Knowledge** | `POST` | `/knowledge/search` | Search vector store (RAG retrieval) | `tenant` | `knowledge` |
| **Knowledge** | `GET` | `/knowledge/files` | List ingested files/docs | `tenant` | `knowledge` |
| **Knowledge** | `GET` | `/knowledge/files/:id` | Get file metadata & chunks | `tenant` | `knowledge` |
| **Store** | `POST` | `/store/upload` | Upload binary to blob storage | `tenant` | `store` |
| **Store** | `GET` | `/store/:id` | Get file metadata & access URL | `tenant` | `store` |
| **IQ Hub** | `GET` | `/iq/sessions` | List captured AI chat sessions | `tenant` | `iq-hub` |
| **IQ Hub** | `GET` | `/iq/sessions/:id` | Get session details + memories | `tenant` | `iq-hub` |
| **IQ Hub** | `PATCH` | `/iq/memories/:id` | Confirm or edit a specific memory | `tenant` | `iq-hub` |
| **MCP** | `GET` | `/mcp/tools` | Discovery for external AI assistants | `mcp_key` | `mcp-connector` |
| **MCP** | `POST` | `/mcp/save_session_memory` | Capture decision/rules from AI chat | `mcp_key` | `mcp-connector` |

---

## 3. Request & Response Shapes

### A. MCP Connector: Save Session Memory

**URL**: `POST /v1/mcp/save_session_memory`  
**Purpose**: Terminal endpoint for external AI assistants (ChatGPT/Claude) to push memories.

**Request Body**:

```json
{
  "tenant_id": "uuid",
  "session_id": "string (external id)",
  "tool_source": "chatgpt | claude | grok | gemini",
  "started_at": "iso-8601",
  "ended_at": "iso-8601",
  "summary": "High-level summary of the session decisions",
  "memories": [
    {
      "id": "optional-uuid",
      "type": "decision | rule | preference | plan | insight | note",
      "text": "The actual memory content",
      "entity_refs": {
        "lead_id": "uuid",
        "account_id": "uuid",
        "external_id": "string"
      }
    }
  ]
}
```

**Success Response (202 Accepted)**:

```json
{
  "status": "success",
  "internal_session_id": "uuid",
  "accepted_memories": 3,
  "warnings": []
}
```

---

### B. Knowledge: Search (RAG)

**URL**: `POST /v1/knowledge/search`  
**Purpose**: Retrieve ranked chunks for the Think layer or Context view.

**Request Body**:

```json
{
  "query": "string",
  "top_k": 5,
  "min_score": 0.7,
  "filters": {
    "tags": ["contract", "playbook"],
    "entity_id": "uuid"
  }
}
```

**Success Response (200 OK)**:

```json
{
  "results": [
    {
      "chunk_id": "uuid",
      "text": "...",
      "score": 0.92,
      "metadata": {
        "file_id": "uuid",
        "page": 2,
        "trust_level": "high"
      }
    }
  ]
}
```

---

### C. IQ Hub: List Sessions

**URL**: `GET /v1/iq/sessions`  
**Purpose**: Power the Knowledge UI view for recent AI assistant activities.

**Query Params**:

- `limit`: number of items (default 20)
- `offset`: skip items
- `source`: filter by `chatgpt`, etc.

**Success Response (200 OK)**:

```json
{
  "data": [
    {
      "id": "uuid",
      "source": "claude",
      "summary": "...",
      "memory_count": 5,
      "created_at": "..."
    }
  ],
  "pagination": { "total": 142, "limit": 20, "offset": 0 }
}
```

---

## 4. Auth & Security Boundaries

1. **`tenant` level**: Requires a Valid JWT or `x-api-key` bound to a specific `tenant_id`. Access is strictly scoped to that tenant's files and memories.
2. **`internal` level**: Shared secret or internal network access. Used by `edge-worker` or internal jobs for ingestion.
3. **`mcp_key` level**: Dedicated API keys issued to external AI assistants. These keys are tied to a `tenant_id` but have a restricted scope (write-only for sessions).
4. **Trust Model**: All memories pushed via MCP are tagged as `model_inferred` (low-trust). They must be "confirmed" via the IQ Hub `PATCH` endpoint to be promoted to `high-trust`.
