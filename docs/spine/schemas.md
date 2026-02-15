# Spine Canonical Schemas

This document defines the canonical entities within the IntegrateWise OS Spine, their relationships, constraints, and normalization rules.

## Core Entities

The authoritative schemas are defined in `packages/types/src/spine/entities.ts`.

### Task
Represents a unit of work.
- **Key Fields**: `id`, `title`, `status`, `priority`, `assignee_id`.
- **Identity**: Unique by `id` (UUID). De-duplicated by `external_ref` + `source_tool`.

### Note
Represents unstructured knowledge.
- **Key Fields**: `id`, `title`, `body_md`, `tags`.
- **Identity**: Unique by `id` (UUID).

### Conversation
Represents a thread of communication.
- **Key Fields**: `id`, `source`, `participants`, `linkage_score`.
- **Identity**: Unique by `id` (UUID). De-duplicated by `external_thread_id` + `source`.

### Plan
Represents a high-level objective with milestones.
- **Key Fields**: `id`, `objective`, `milestones`, `status`.

### HealthMetric (Customer Success)
Represents a data point for customer health.
- **Key Fields**: `id`, `account_id`, `metric_type`, `value`.

## Relationships & Constraints

### Relationship Map
- **Task ↔ Plan**: Many-to-One. A Plan has many Tasks (via `milestones` or implicit linking).
- **Note ↔ Task**: Many-to-Many. Notes can reference Tasks via `linked_entity_ids`.
- **Conversation ↔ Task**: Many-to-One. A Conversation can spawn a Task.
- **HealthMetric ↔ Account**: Many-to-One. Metrics belong to an Account (external entity).

### Constraints
1. **Referential Integrity**: `linked_entity_ids` must refer to valid UUIDs existing in the Spine.
2. **Immutability**: `source_tool` and `external_ref` are immutable once created to preserve audit trails.
3. **Uniqueness**: `(source_tool, external_ref)` must be unique per Workspace.

## Normalization Rules

1. **Dates**: All dates are converted to ISO 8601 UTC strings (`YYYY-MM-DDThh:mm:ssZ`).
2. **Email**: All email addresses are lowercased and trimmed.
3. **Tags**: Tags are lowercased, spaces replaced with hyphens, and deduped.
4. **Markdown**: HTML input is sanitized and converted to CommonMark.

## Mapping Guides

### HubSpot Deal → Spine Task
| HubSpot Field | Spine Task Field | Transformation |
|Orgin Field|Target Field|Logic|
|---|---|---|
| `dealname` | `title` | Direct copy |
| `dealstage` | `status` | Map: 'closedwon'->'Done', 'qualified'->'In_Progress', else 'Todo' |
| `amount` | `description` | Append "Value: ${amount}" |
| `close_date` | `due_date` | Convert timestamp to ISO 8601 |
| `owner_id` | `assignee_id` | Map via Identity Provider |
| `deal_id` | `external_ref` | Stringify |
| 'HubSpot' | `source_tool` | Static literal |

### Gmail Message → Spine Conversation
| Gmail Field | Spine Conversation Field | Transformation |
|---|---|---|
| `id` | `external_thread_id` | Uses Thread ID if available, else Message ID |
| `subject` | `topic` | Direct copy |
| `from`, `to`, `cc` | `participants` | Extract name/email, distinct list |
| `snippet` | - | Used for `linkage_score` analysis |
| `internalDate` | `created_at` | Convert timestamp to ISO 8601 |
| 'Gmail' | `source` | Static literal |

### Notion Page → Spine Note
| Notion Field | Spine Note Field | Transformation |
|---|---|---|
| `id` | `external_ref` | Remove hyphens if needed |
| `properties.Name.title`| `title` | Join text fragments |
| `children` | `body_md` | Convert blocks to Markdown |
| `properties.Tags` | `tags` | Extract tag names |
| 'Notion' | `source_tool` | Static literal |

### Slack Message → Spine Conversation / Task
**Context**: A Slack message can be ingested as a Conversation or trigger a Task.

**As Conversation:**
| Slack Field | Spine Conversation Field | Transformation |
|---|---|---|
| `ts` | `external_thread_id` | Use thread_ts if exists, else ts |
| `text` | `topic` | Truncate to 100 chars for topic |
| `user` | `participants` | Resolve Slack User ID to Name/Email |
| 'Slack' | `source` | Static literal |

**As Task (via Reaction/Command):**
| Slack Field | Spine Task Field | Transformation |
|---|---|---|
| `text` | `description` | Full text |
| `text` (first line) | `title` | First 50 chars |
| `user` | `assignee_id` | The user who triggered the action |
| `ts` | `external_ref` | Unique Message Timestamp |
