import { L2Redirect } from "@/components/cognitive/l2-redirect"

export default function Page() {
  return <L2Redirect surface="think" fallbackRoute="/accounts/home" message="Opening Brainstorming..." />
}
