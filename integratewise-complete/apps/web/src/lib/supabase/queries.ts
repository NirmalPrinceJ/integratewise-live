import { createClient } from "./server"

// METRICS-016: Get business metrics
export async function getMetrics() {
  const supabase = await createClient()

  const [{ data: metrics }, { data: clients }, { data: deals }, { data: subscriptions }, { data: revenue }] =
    await Promise.all([
      supabase.from("metrics").select("*").order("recorded_at", { ascending: false }).limit(10),
      supabase.from("clients").select("id, name, status, health_score, total_revenue, tier"),
      supabase.from("deals").select("id, name, value, stage, probability"),
      supabase.from("subscriptions").select("id, mrr, arr, status"),
      supabase.from("revenue").select("amount, type, created_at").order("created_at", { ascending: false }).limit(100),
    ])

  // Calculate MRR
  const activeSubs = subscriptions?.filter((s) => s.status === "active") || []
  const totalMRR = activeSubs.reduce((sum, s) => sum + (Number(s.mrr) || 0), 0)

  // Calculate Pipeline
  const openDeals = deals?.filter((d) => d.stage !== "won" && d.stage !== "lost") || []
  const totalPipeline = openDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0)

  // Calculate YTD Revenue
  const currentYear = new Date().getFullYear()
  const ytdRevenue =
    revenue
      ?.filter((r) => new Date(r.created_at).getFullYear() === currentYear)
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0) || 0

  // Calculate Win Rate
  const wonDeals = deals?.filter((d) => d.stage === "won").length || 0
  const closedDeals = deals?.filter((d) => d.stage === "won" || d.stage === "lost").length || 1
  const winRate = Math.round((wonDeals / closedDeals) * 100)

  return {
    mrr: totalMRR,
    pipeline: totalPipeline,
    ytdRevenue,
    activeClients: clients?.filter((c) => c.status === "active").length || 0,
    winRate,
    clients: clients || [],
    deals: deals || [],
    subscriptions: subscriptions || [],
  }
}

// TASKS-012: Get tasks
export async function getTasks() {
  const supabase = await createClient()
  const { data: tasks, error } = await supabase.from("tasks").select("*").order("due_date", { ascending: true })

  if (error) throw error
  return tasks || []
}

// BUSINESS-018: Get clients
export async function getClients() {
  const supabase = await createClient()
  const { data: clients, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return clients || []
}

// BUSINESS-018: Get leads
export async function getLeads() {
  const supabase = await createClient()
  const { data: leads, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return leads || []
}

// BUSINESS-018: Get products
export async function getProducts() {
  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) throw error
  return products || []
}

// BUSINESS-018: Get services
export async function getServices() {
  const supabase = await createClient()
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("tier", { ascending: true })

  if (error) throw error
  return services || []
}

// BUSINESS-018: Get deals/pipeline
export async function getDeals() {
  const supabase = await createClient()
  const { data: deals, error } = await supabase
    .from("deals")
    .select("*, leads(name, company)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return deals || []
}

// GOALS-015: Get business goals
export async function getGoals() {
  const supabase = await createClient()
  const { data: goals, error } = await supabase
    .from("business_goals")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return goals || []
}

// IQHUB-008: Get brainstorm sessions
export async function getBrainstormSessions() {
  const supabase = await createClient()
  const { data: sessions, error } = await supabase
    .from("brainstorm_sessions")
    .select("*, brainstorm_insights(*)")
    .order("session_date", { ascending: false })

  if (error) throw error
  return sessions || []
}

// INSIGHTS-013: Get daily insights
export async function getDailyInsights() {
  const supabase = await createClient()
  const { data: insights, error } = await supabase
    .from("daily_insights")
    .select("*")
    .order("insight_date", { ascending: false })
    .limit(7)

  if (error) throw error
  return insights || []
}

// BUSINESS-018: Get content library
export async function getContentLibrary() {
  const supabase = await createClient()
  const { data: content, error } = await supabase
    .from("content_library")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return content || []
}

// BUSINESS-018: Get website pages
export async function getWebsitePages() {
  const supabase = await createClient()
  const { data: pages, error } = await supabase.from("website_pages").select("*").order("views", { ascending: false })

  if (error) throw error
  return pages || []
}

// Format currency for display
export function formatCurrency(amount: number, currency = "INR"): string {
  if (currency === "INR") {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
    return `₹${amount.toLocaleString()}`
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
}

// ACT: Get actionable signals
export async function getActions() {
  const supabase = await createClient()
  const { data: actions, error } = await supabase
    .from("signals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) throw error
  return actions || []
}

// ARTIFACTS: Get canonical artifacts
export async function getArtifacts(clientId?: string) {
  const supabase = await createClient()
  let query = supabase.from("canonical_artifacts").select("*")

  if (clientId) {
    query = query.eq("client_id", clientId)
  }

  const { data: artifacts, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return artifacts || []
}

// CLIENT: Get single client by ID
export async function getClient(id: string) {
  const supabase = await createClient()
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return client
}

// ADJUST: Get feedback logs
export async function getFeedbackLogs() {
  const supabase = await createClient()
  const { data: logs, error } = await supabase
    .from("feedback_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    // Fallback if table doesn't exist yet
    return []
  }
  return logs || []
}

// ADJUST: Get learning insights
export async function getLearningInsights() {
  const supabase = await createClient()
  const { data: insights, error } = await supabase
    .from("learning_insights")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    // Fallback if table doesn't exist yet
    return []
  }
  return insights || []
}

// GOVERN: Get policies
export async function getPolicies() {
  const supabase = await createClient()
  const { data: policies, error } = await supabase
    .from("policies")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    // Fallback if table doesn't exist yet
    return []
  }
  return policies || []
}

// GOVERN: Get approval queue
export async function getApprovalQueue() {
  const supabase = await createClient()
  const { data: approvals, error } = await supabase
    .from("approval_queue")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    // Fallback if table doesn't exist yet
    return []
  }
  return approvals || []
}

// THINK: Get situations/contexts
export async function getSituations() {
  const supabase = await createClient()
  const { data: situations, error } = await supabase
    .from("situations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    // Fallback to signals if situations table doesn't exist
    const { data: signals } = await supabase
      .from("signals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
    return signals || []
  }
  return situations || []
}

// CALENDAR: Get calendar events
export async function getCalendarEvents() {
  const supabase = await createClient()
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  const { data: events, error } = await supabase
    .from("calendar_events")
    .select("*")
    .gte("start_time", startOfDay)
    .lte("start_time", endOfDay)
    .order("start_time", { ascending: true })

  if (error) {
    return []
  }
  return events || []
}
