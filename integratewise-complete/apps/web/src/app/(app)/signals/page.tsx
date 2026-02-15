"use client"

import { SignalsRedirect } from "@/components/cognitive/l2-redirect"

/**
 * Signals Page - Redirects to Cognitive Drawer
 * 
 * Signals are part of L2 (Cognitive Layer) and should be accessed
 * through the Cognitive Drawer rather than as standalone pages.
 */
export default function SignalsPage() {
  return <SignalsRedirect fallbackRoute="/personal/home" />
}
