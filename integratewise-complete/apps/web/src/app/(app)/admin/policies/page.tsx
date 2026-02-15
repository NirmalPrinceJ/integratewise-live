import { AdminStubPage } from "@/components/views/stubs/admin-stub"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="admin.policies">
      <AdminStubPage title="Policies" endpoint="/api/admin/policies" />
    </ProtectedPage>
  )
}
