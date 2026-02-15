import { ConnectorsPage } from "@/components/admin/pages/connectors-page"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="admin.connectors">
      <ConnectorsPage />
    </ProtectedPage>
  )
}
