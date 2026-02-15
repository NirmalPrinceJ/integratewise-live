import { AdminStubPage } from "@/components/views/stubs/admin-stub"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="admin.executions">
      <AdminStubPage title="Executions" endpoint="/api/act/runs" />
    </ProtectedPage>
  )
}
