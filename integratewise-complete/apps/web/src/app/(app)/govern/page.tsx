import { GovernDashboard } from "@/components/views/govern-dashboard"
import { getPolicies, getApprovalQueue } from "@/lib/supabase/queries"

export default async function GovernPage() {
    const [policies, approvalQueue] = await Promise.all([
        getPolicies(),
        getApprovalQueue()
    ])

    return <GovernDashboard policies={policies} approvalQueue={approvalQueue} />
}
