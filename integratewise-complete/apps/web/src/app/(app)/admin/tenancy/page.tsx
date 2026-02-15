import { TenancyPage } from "@/components/admin/pages/tenancy-page"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="admin.tenancy">
      <TenancyPage />
    </ProtectedPage>
  )
}
