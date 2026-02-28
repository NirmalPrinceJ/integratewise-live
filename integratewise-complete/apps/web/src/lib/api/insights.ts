/**
 * Insights API Service
 * 
 * L2 Intelligence → L1 UI
 */

import { supabase } from "./supabase";

export interface Insight {
  id: string;
  tenant_id: string;
  entity_id: string;
  insight_type: "risk" | "opportunity" | "anomaly" | "growth";
  title: string;
  description: string;
  confidence: number;
  evidence: Array<{
    source: string;
    data: any;
  }>;
  status: "active" | "dismissed" | "actioned";
  created_at: string;
}

// Get all insights
export async function getInsights(options: {
  entityId?: string;
  type?: string;
  status?: string;
} = {}): Promise<Insight[]> {
  let query = supabase
    .from("ai_insights")
    .select("*");

  if (options.entityId) {
    query = query.eq("entity_id", options.entityId);
  }

  if (options.type) {
    query = query.eq("insight_type", options.type);
  }

  if (options.status) {
    query = query.eq("status", options.status);
  } else {
    query = query.eq("status", "active");
  }

  const { data, error } = await query
    .order("confidence", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get insight by ID
export async function getInsight(id: string): Promise<Insight | null> {
  const { data, error } = await supabase
    .from("ai_insights")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Dismiss insight
export async function dismissInsight(id: string): Promise<void> {
  const { error } = await supabase
    .from("ai_insights")
    .update({ status: "dismissed" })
    .eq("id", id);

  if (error) throw error;
}

// Mark insight as actioned
export async function actionInsight(id: string): Promise<void> {
  const { error } = await supabase
    .from("ai_insights")
    .update({ status: "actioned" })
    .eq("id", id);

  if (error) throw error;
}

// Get insight stats
export async function getInsightStats(): Promise<{
  total: number;
  risk: number;
  opportunity: number;
  anomaly: number;
  growth: number;
}> {
  const { data, error } = await supabase
    .from("ai_insights")
    .select("insight_type")
    .eq("status", "active");

  if (error) throw error;

  return {
    total: data?.length || 0,
    risk: data?.filter((i) => i.insight_type === "risk").length || 0,
    opportunity: data?.filter((i) => i.insight_type === "opportunity").length || 0,
    anomaly: data?.filter((i) => i.insight_type === "anomaly").length || 0,
    growth: data?.filter((i) => i.insight_type === "growth").length || 0,
  };
}
