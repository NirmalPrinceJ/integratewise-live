/**
 * Entity API Service
 * 
 * Connects to L3 Spine via Supabase
 * Provides 360° entity data to L1 UI
 */

import { supabase } from "./supabase";

export interface Entity360 {
  id: string;
  tenant_id: string;
  entity_type: string;
  name: string;
  status: string;
  data: Record<string, any>;
  completeness_score: number;
  health_score: number;
  completeness_status: "complete" | "partial" | "incomplete";
  health_status: "healthy" | "at-risk" | "critical";
  related_count: number;
  knowledge_count: number;
  insights_count: number;
  pending_actions_count: number;
  created_at: string;
  updated_at: string;
}

export interface EntityWithContext {
  entity: Entity360;
  relationships: Array<{
    id: string;
    type: string;
    entity: {
      id: string;
      name: string;
      type: string;
    };
  }>;
  knowledge: Array<{
    id: string;
    title: string;
    content: string;
    source: string;
  }>;
  insights: Array<{
    id: string;
    insight_type: string;
    title: string;
    description: string;
    confidence: number;
  }>;
  actions: Array<{
    id: string;
    action_type: string;
    title: string;
    status: string;
  }>;
}

// Get all entities (360 view)
export async function getEntities(
  options: {
    type?: string;
    health?: string;
    completeness?: string;
    search?: string;
  } = {}
): Promise<Entity360[]> {
  let query = supabase
    .from("entity_360")
    .select("*");

  if (options.type) {
    query = query.eq("entity_type", options.type);
  }

  if (options.health) {
    query = query.eq("health_status", options.health);
  }

  if (options.completeness) {
    query = query.eq("completeness_status", options.completeness);
  }

  if (options.search) {
    query = query.or(`name.ilike.%${options.search}%,data::text.ilike.%${options.search}%`);
  }

  const { data, error } = await query.order("health_score", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get single entity with full 360 context
export async function getEntityWithContext(id: string): Promise<EntityWithContext | null> {
  const { data, error } = await supabase
    .rpc("get_entity_360", { entity_uuid: id });

  if (error) throw error;
  return data;
}

// Get entity by ID (basic)
export async function getEntity(id: string): Promise<Entity360 | null> {
  const { data, error } = await supabase
    .from("entity_360")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Create entity
export async function createEntity(entity: {
  tenant_id: string;
  entity_type: string;
  name: string;
  source: string;
  data?: Record<string, any>;
}): Promise<Entity360> {
  const { data, error } = await supabase
    .from("spine_entities")
    .insert({
      ...entity,
      data: entity.data || {},
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update entity
export async function updateEntity(
  id: string,
  updates: Partial<Entity360>
): Promise<Entity360> {
  const { data, error } = await supabase
    .from("spine_entities")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get entity stats
export async function getEntityStats(): Promise<{
  total: number;
  healthy: number;
  atRisk: number;
  critical: number;
  complete: number;
  partial: number;
  incomplete: number;
}> {
  const { data, error } = await supabase
    .from("entity_360")
    .select("health_status,completeness_status");

  if (error) throw error;

  const stats = {
    total: data?.length || 0,
    healthy: data?.filter((e) => e.health_status === "healthy").length || 0,
    atRisk: data?.filter((e) => e.health_status === "at-risk").length || 0,
    critical: data?.filter((e) => e.health_status === "critical").length || 0,
    complete: data?.filter((e) => e.completeness_status === "complete").length || 0,
    partial: data?.filter((e) => e.completeness_status === "partial").length || 0,
    incomplete: data?.filter((e) => e.completeness_status === "incomplete").length || 0,
  };

  return stats;
}
