"use client"

import { SignalsRedirect } from "@/components/cognitive/l2-redirect"

export default function SignalsPage() {
  return <SignalsRedirect fallbackRoute="/sales/home" />
}
