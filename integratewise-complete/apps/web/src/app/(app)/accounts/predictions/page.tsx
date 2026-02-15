"use client"

import { PredictionsRedirect } from "@/components/cognitive/l2-redirect"

export default function PredictionsPage() {
  return <PredictionsRedirect fallbackRoute="/accounts/home" />
}
