import { redirect } from "next/navigation"

export default async function Home() {
  // Root redirects to L1 Workplace - /personal/today
  redirect('/personal/today')
}
