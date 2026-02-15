import { GovernancePage } from "@/components/admin/pages/governance-page"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="governance.workflows">
      <GovernancePage />
    </ProtectedPage>
  )
}
