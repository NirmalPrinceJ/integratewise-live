import { AdminRolesPage } from "@/components/admin/pages/roles-page"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="admin.roles">
      <AdminRolesPage />
    </ProtectedPage>
  )
}
