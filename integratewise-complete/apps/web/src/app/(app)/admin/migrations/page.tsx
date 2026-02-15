import { AdminStubPage } from "@/components/views/stubs/admin-stub"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="admin.migrations">
      <AdminStubPage title="Migrations" endpoint="/api/system/migrations" />
    </ProtectedPage>
  )
}
