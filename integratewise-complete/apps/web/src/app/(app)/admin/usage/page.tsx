import { AdminUsagePage } from "@/components/admin/pages/usage-page"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="admin.usage">
      <AdminUsagePage />
    </ProtectedPage>
  )
}
