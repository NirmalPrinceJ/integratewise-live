/**
 * Calendar API Service
 * 
 * Events from connected calendar tools
 */

import { supabase } from "./supabase";

export interface CalendarEvent {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  attendees?: string[];
  location?: string;
  source: "google" | "outlook" | "manual";
  entity_ids?: string[];
  is_all_day: boolean;
  created_at: string;
}

// Get events for date range
export async function getEvents(options: {
  startDate: string;
  endDate: string;
  entityId?: string;
}): Promise<CalendarEvent[]> {
  let query = supabase
    .from("calendar_events")
    .select("*")
    .gte("start_time", options.startDate)
    .lte("start_time", options.endDate);

  if (options.entityId) {
    query = query.contains("entity_ids", [options.entityId]);
  }

  const { data, error } = await query
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data || [];
}

// Get today's events
export async function getTodaysEvents(): Promise<CalendarEvent[]> {
  const today = new Date().toISOString().split("T")[0];
  const startOfDay = `${today}T00:00:00Z`;
  const endOfDay = `${today}T23:59:59Z`;

  return getEvents({
    startDate: startOfDay,
    endDate: endOfDay,
  });
}

// Create event
export async function createEvent(event: {
  tenant_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  attendees?: string[];
  location?: string;
  entity_ids?: string[];
}): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from("calendar_events")
    .insert({
      ...event,
      source: "manual",
      is_all_day: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update event
export async function updateEvent(
  id: string,
  updates: Partial<CalendarEvent>
): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from("calendar_events")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete event
export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Get upcoming events (next 7 days)
export async function getUpcomingEvents(limit: number = 5): Promise<CalendarEvent[]> {
  const now = new Date().toISOString();
  const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .gte("start_time", now)
    .lte("start_time", sevenDaysLater)
    .order("start_time", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}
