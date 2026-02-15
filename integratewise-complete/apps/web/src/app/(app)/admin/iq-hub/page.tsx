import { AdminStubPage } from "@/components/views/stubs/admin-stub"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="surfaces.iq_hub">
      <AdminStubPage title="IQ Hub" endpoint="/api/iq/sessions" />
    </ProtectedPage>
  )
}
