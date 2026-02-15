import { AdminStubPage } from "@/components/views/stubs/admin-stub"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="admin.permissions">
      <AdminStubPage title="Permissions" endpoint="/api/admin/permissions" />
    </ProtectedPage>
  )
}
