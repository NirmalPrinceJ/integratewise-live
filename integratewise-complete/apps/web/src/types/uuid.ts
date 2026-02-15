/**
 * UUID Type Re-exports for UI Components
 * 
 * This file re-exports branded UUID types from the workspace package
 * for use in UI components. All IDs should use these branded types
 * for type safety and UUID compliance.
 * 
 * @see packages/types/src/uuid.ts for the full type definitions
 */

// Entity & Core IDs
export type { 
  UUID,
  TenantId, 
  UserId, 
  WorkspaceId,
  AccountId,
  StakeholderId,
  DealId,
  ProjectId,
  SpineEntityId,
  CanonicalEntityId,
} from '../../packages/types/src/uuid';

// Signal & Intelligence IDs
export type {
  SignalId,
  InsightId,
  SituationId,
  EvidenceId,
} from '../../packages/types/src/uuid';

// Execution & Workflow IDs
export type {
  ExecutionId,
  ProposalId,
  ActionId,
  ApprovalId,
} from '../../packages/types/src/uuid';

// Integration IDs
export type {
  ConnectorId,
  WebhookId,
  SyncId,
  EventId,
} from '../../packages/types/src/uuid';

// Knowledge & Context IDs
export type {
  SessionId,
  MCPSessionId,
  MemoryId,
  SummaryId,
  DocumentId,
  ChunkId,
  TopicId,
} from '../../packages/types/src/uuid';

// Governance & Audit IDs
export type {
  PolicyId,
  AuditLogId,
  RiskId,
  DecisionId,
  CorrelationId,
  CorrectionId,
  LearningSignalId,
} from '../../packages/types/src/uuid';

// Re-export validation and generation utilities
export {
  isUUID,
  isUUIDv4,
  isUUIDv7,
  generateUUID,
  generateUUIDv7,
} from '../../packages/types/src/uuid';
