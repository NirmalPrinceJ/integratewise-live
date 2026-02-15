
import { getActions } from "@/lib/supabase/queries"
import { ActDashboard } from "@/components/views/act-dashboard"

export default async function ActPage() {
    const actions = await getActions()
    return <ActDashboard actions={actions} />
}
