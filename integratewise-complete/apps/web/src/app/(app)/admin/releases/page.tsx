import { ReleaseDashboard } from "@/components/views/admin/release-dashboard"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function ReleaseControlPage() {
  return (
    <ProtectedPage featureKey="admin.releases">
      <ReleaseDashboard />
    </ProtectedPage>
  )
}
