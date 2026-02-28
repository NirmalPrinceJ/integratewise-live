/**
 * Tasks API Service
 * 
 * Task management across connected tools
 */

import { supabase } from "./supabase";

export interface Task {
  id: string;
  tenant_id: string;
  entity_id?: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  due_date?: string;
  source: "manual" | "hubspot" | "slack" | "email";
  assigned_to?: string;
  completed_at?: string;
  created_at: string;
}

// Get tasks
export async function getTasks(options: {
  status?: string;
  priority?: string;
  entityId?: string;
} = {}): Promise<Task[]> {
  let query = supabase
    .from("tasks")
    .select("*");

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.priority) {
    query = query.eq("priority", options.priority);
  }

  if (options.entityId) {
    query = query.eq("entity_id", options.entityId);
  }

  const { data, error } = await query
    .order("due_date", { ascending: true })
    .order("priority", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Create task
export async function createTask(task: {
  tenant_id: string;
  entity_id?: string;
  title: string;
  description?: string;
  priority?: string;
  due_date?: string;
}): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      ...task,
      status: "pending",
      source: "manual",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Complete task
export async function completeTask(id: string): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

// Update task
export async function updateTask(
  id: string,
  updates: Partial<Task>
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete task
export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Get task stats
export async function getTaskStats(): Promise<{
  total: number;
  pending: number;
  completed: number;
  overdue: number;
}> {
  const { data, error } = await supabase
    .from("tasks")
    .select("status,due_date");

  if (error) throw error;

  const now = new Date().toISOString();

  return {
    total: data?.length || 0,
    pending: data?.filter((t) => t.status === "pending").length || 0,
    completed: data?.filter((t) => t.status === "completed").length || 0,
    overdue: data?.filter((t) => 
      t.status === "pending" && t.due_date && t.due_date < now
    ).length || 0,
  };
}
