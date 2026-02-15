"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"

interface ProtectedProps {
  children: ReactNode
  requireAdmin?: boolean
}

export function Protected({ children, requireAdmin = false }: ProtectedProps) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useSession()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }

    if (!isLoading && requireAdmin && user?.role !== "admin") {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, user, requireAdmin, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requireAdmin && user?.role !== "admin") {
    return null
  }

  return <>{children}</>
}
