import { AdjustDashboard } from "@/components/views/adjust-dashboard"
import { getFeedbackLogs, getLearningInsights } from "@/lib/supabase/queries"

export default async function AdjustPage() {
    const [feedbackLogs, learningInsights] = await Promise.all([
        getFeedbackLogs(),
        getLearningInsights()
    ])

    return <AdjustDashboard feedbackLogs={feedbackLogs} learningInsights={learningInsights} />
}
