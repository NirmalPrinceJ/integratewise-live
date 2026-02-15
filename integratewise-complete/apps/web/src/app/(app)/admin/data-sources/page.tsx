import { AdminStubPage } from "@/components/views/stubs/admin-stub"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="admin.data_sources">
      <AdminStubPage title="Data Sources" endpoint="/api/data-sources/sync" />
    </ProtectedPage>
  )
}
