import type { 
  TenantId, 
  UserId, 
  AccountId, 
  ConnectorId, 
  PolicyId,
  ActionId,
  ExecutionId,
  UUID 
} from './uuid';

export type WorldScope = "personal" | "work" | "accounts" | "admin"

export type TenantStatus = "active" | "suspended" | "trial" | "disabled"

export type Tenant = {
  id: TenantId
  name: string
  domains: string[]
  plan: "personal" | "team" | "org" | "enterprise"
  status: TenantStatus
  createdAt: string
  lastActiveAt: string
}

export type MemberStatus = "active" | "invited" | "suspended"

export type Member = {
  id: UserId
  name: string
  email: string
  status: MemberStatus
  primaryRoleId: UUID
  lastLoginAt: string
  departments: string[]
  accountAccessCount: number
}

export type Role = {
  id: UUID
  name: string
  description?: string
  worldScopes: WorldScope[]
  departments: string[]
  accountRoles: string[]
  permissions: {
    viewKeys: string[]
    actionKeys: string[]
    dataClassifications: string[]
  }
  approvalLimits?: {
    maxRisk?: number
    maxBlastRadius?: number
  }
}

export type RegistryObjectType = "lens" | "view" | "hub" | "module" | "nav"

export type RegistryObject = {
  id: UUID
  type: RegistryObjectType
  registryKey: string
  displayName: string
  description?: string
  worldScope: WorldScope
  department?: string | null
  accountRole?: string | null
  enabled: boolean
  version: number
  modules: string[]
  kpiCards: string[]
  situationTemplates: string[]
  actionLibrary: string[]
  governanceRules: Record<string, unknown>
  rbacRules: Record<string, unknown>
  planGates: Record<string, unknown>
  updatedAt: string
  updatedBy: string
}

export type ConnectorStatus = "healthy" | "warning" | "error" | "paused"

export type ConnectorInstance = {
  id: ConnectorId
  tenantId: TenantId
  system: string
  status: ConnectorStatus
  lastSyncAt: string
  errorRate: number
  tokenExpiresAt: string
}

export type GovernanceRequest = {
  id: UUID
  tenantId: TenantId
  riskScore: number
  blastRadius: number
  requestedBy: UserId
  actionKey: string
  status: "pending" | "approved" | "rejected" | "executed" | "expired"
  dueAt: string
  createdAt: string
}

export type ActionTemplate = {
  id: ActionId
  key: string
  category: string
  riskLevel: number
  connectors: string[]
  approvalRequired: boolean
  simulationSupported: boolean
  rollbackSupported: boolean
  requiredEvidenceTypes: string[]
  outcomeWritebackRules: Record<string, unknown>
}

export type BillingPlan = {
  tenantId: TenantId
  plan: "personal" | "team" | "org" | "enterprise"
  seats: number
  seatsUsed: number
  usage: {
    aiTokens: number
    actionRuns: number
    connectorSyncs: number
    storageGb: number
  }
  alerts: string[]
}

export type ServiceHealthMetric = {
  service: string
  status: "healthy" | "degraded" | "down"
  latencyMs: number
  errorRate: number
  updatedAt: string
}

export type AuditLogEntry = {
  id: UUID
  timestamp: string
  actor: UserId
  action: string
  target: string
  objectType: string
  objectId: UUID
  executionId?: ExecutionId
  justification?: string
  before?: unknown
  after?: unknown
}
