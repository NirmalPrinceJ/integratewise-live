/**
 * Actions API Service
 * 
 * HITL (Human-in-the-Loop) approval flow
 * L2 Govern/Act → L1 UI
 */

import { supabase } from "./supabase";

export interface Action {
  id: string;
  tenant_id: string;
  entity_id: string;
  action_type: "send_email" | "update_field" | "create_task" | "schedule_meeting";
  title: string;
  description: string;
  proposed_changes: Record<string, any>;
  status: "pending" | "approved" | "rejected" | "executed";
  requested_by: string;
  approved_by?: string;
  approved_at?: string;
  executed_at?: string;
  created_at: string;
}

// Get pending actions
export async function getPendingActions(): Promise<Action[]> {
  const { data, error } = await supabase
    .from("actions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get actions for entity
export async function getEntityActions(entityId: string): Promise<Action[]> {
  const { data, error } = await supabase
    .from("actions")
    .select("*")
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Approve action
export async function approveAction(
  actionId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("actions")
    .update({
      status: "approved",
      approved_by: userId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", actionId);

  if (error) throw error;

  // Trigger execution (in real app, this would queue for execution)
  await executeAction(actionId);
}

// Reject action
export async function rejectAction(actionId: string): Promise<void> {
  const { error } = await supabase
    .from("actions")
    .update({ status: "rejected" })
    .eq("id", actionId);

  if (error) throw error;
}

// Execute action (internal)
async function executeAction(actionId: string): Promise<void> {
  // In real app, this would:
  // 1. Call the appropriate service (email, CRM, etc.)
  // 2. Log the execution
  // 3. Update the action status
  
  const { error } = await supabase
    .from("actions")
    .update({
      status: "executed",
      executed_at: new Date().toISOString(),
    })
    .eq("id", actionId);

  if (error) throw error;
}

// Create action (from AI or system)
export async function createAction(action: {
  tenant_id: string;
  entity_id: string;
  action_type: string;
  title: string;
  description: string;
  proposed_changes?: Record<string, any>;
}): Promise<Action> {
  const { data, error } = await supabase
    .from("actions")
    .insert({
      ...action,
      proposed_changes: action.proposed_changes || {},
      status: "pending",
      requested_by: "system",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get action stats
export async function getActionStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  executed: number;
}> {
  const { data, error } = await supabase
    .from("actions")
    .select("status");

  if (error) throw error;

  return {
    total: data?.length || 0,
    pending: data?.filter((a) => a.status === "pending").length || 0,
    approved: data?.filter((a) => a.status === "approved").length || 0,
    rejected: data?.filter((a) => a.status === "rejected").length || 0,
    executed: data?.filter((a) => a.status === "executed").length || 0,
  };
}
