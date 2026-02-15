"use client"

import { useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name?: string
  workspace_id?: string
  role?: string
}

interface Session {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useSession(): Session {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for session in localStorage or fetch from API
    const checkSession = async () => {
      try {
        // For now, mock session - replace with actual auth check
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Session check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  }
}

export function signIn(email: string, password: string): Promise<User> {
  // Mock sign in - replace with actual auth
  return Promise.resolve({
    id: "1",
    email,
    name: email.split("@")[0],
  })
}

export function signOut(): Promise<void> {
  localStorage.removeItem("user")
  return Promise.resolve()
}
