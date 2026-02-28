/**
 * API Service Layer - Complete Integration Export
 * 
 * L3 Backend → L2 Cognitive → L1 UI
 * All services bound and ready for production
 */

// Database client
export { supabase } from "./supabase";
export type { Database } from "./supabase";

// Core services (L3 → L2)
export * from "./auth";
export * from "./entities";
export * from "./insights";
export * from "./actions";
export * from "./tasks";
export * from "./calendar";
export * from "./dashboard";
export * from "./settings";

// Type exports for TypeScript
export type { 
  Entity360, 
  EntityWithContext 
} from "./entities";

export type { 
  Insight 
} from "./insights";

export type { 
  Action 
} from "./actions";

export type { 
  DashboardStats, 
  DomainEntity, 
  DomainSignal, 
  RecentActivity,
  DomainId 
} from "./dashboard";

export type { 
  UserSettings, 
  WorkspaceSettings 
} from "./settings";

export type { 
  User, 
  AuthSession 
} from "./auth";

// Re-export for convenience
export { 
  getCurrentUser,
  signIn,
  signInWithOAuth,
  signUp,
  signOut,
  onAuthChange,
  updateProfile
} from "./auth";

// Entity operations
export {
  getEntities,
  getEntity,
  getEntityWithContext,
  createEntity,
  updateEntity,
  getEntityStats
} from "./entities";

// Dashboard operations
export {
  getDashboardStats,
  getDomainEntities,
  getRecentActivity,
  getDomainSignals,
  getConnectorStatuses
} from "./dashboard";

// Settings operations
export {
  getUserSettings,
  updateUserSettings,
  getWorkspaceSettings,
  updateWorkspaceSettings,
  getConnectedIntegrations,
  disconnectIntegration,
  getUserAuditLog
} from "./settings";
