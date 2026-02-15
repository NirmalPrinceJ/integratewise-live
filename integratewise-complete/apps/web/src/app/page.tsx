import { redirect } from "next/navigation"

export default function HomePage() {
  // For now, redirect to today dashboard
  // Later: check auth and show landing for unauthenticated users
  redirect("/today")
}
