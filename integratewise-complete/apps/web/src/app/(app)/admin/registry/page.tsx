import { RegistryPage } from "@/components/admin/pages/registry-page"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="admin.features">
      <RegistryPage />
    </ProtectedPage>
  )
}
