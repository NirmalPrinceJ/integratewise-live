import { SchemaPage } from "../../../../components/admin/pages/schema-page"
import { ProtectedPage } from "@/components/ProtectedPage"

export default function Page() {
  return (
    <ProtectedPage featureKey="admin.features">
      <SchemaPage />
    </ProtectedPage>
  )
}
