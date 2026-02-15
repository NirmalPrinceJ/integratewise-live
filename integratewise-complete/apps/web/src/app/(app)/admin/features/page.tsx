import { AdminStubPage } from "@/components/views/stubs/admin-stub"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="governance.workflows">
      <AdminStubPage title="Features" endpoint="/api/admin/features" />
    </ProtectedPage>
  )
}
