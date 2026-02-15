import { TodayDashboard } from "@/components/views/today-dashboard"

export default async function TodayPage() {
  const { getTasks, getCalendarEvents, getDailyInsights } = await import("@/lib/supabase/queries")

  const [tasks, events, insights] = await Promise.all([
    getTasks(),
    getCalendarEvents(),
    getDailyInsights()
  ])

  return <TodayDashboard tasks={tasks} events={events} insights={insights} />
}
