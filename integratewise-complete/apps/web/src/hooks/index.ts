/**
 * React Hooks - Complete Barrel Export
 * 
 * L1 UI Data Layer - All hooks bound to L3 Backend
 * Usage: import { useAuth, useEntities } from "../hooks"
 */

// Core hooks
export * from "./useAuth";
export * from "./useEntities";
export * from "./useInsights";
export * from "./useActions";
export * from "./useTasks";
export * from "./useCalendar";
export * from "./useDashboard";
export * from "./useSettings";

// Type re-exports for convenience
export type { DomainId } from "./useDashboard";
export type { User } from "./useAuth";
