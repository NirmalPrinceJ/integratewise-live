/**
 * Supabase Auth Hooks
 * 
 * React hooks for authentication with Supabase.
 * Uses session from Supabase Auth.
 */
'use client'

import { createClient } from './client'
import { useEffect, useState, useCallback } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import type { Profile } from './types'

export interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  error: AuthError | null
}

/**
 * Hook to get current auth state and listen for changes
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
  })

  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setState(prev => ({ ...prev, loading: false, error }))
          return
        }

        if (session?.user) {
          // Fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setState({
            user: session.user,
            profile: profile as Profile | null,
            session,
            loading: false,
            error: null,
          })
        } else {
          setState(prev => ({ ...prev, loading: false }))
        }
      } catch (err) {
        setState(prev => ({ ...prev, loading: false }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setState({
            user: session.user,
            profile: profile as Profile | null,
            session,
            loading: false,
            error: null,
          })
        } else {
          setState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            error: null,
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return state
}

/**
 * Hook for sign in functionality
 */
export function useSignIn() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const supabase = createClient()

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    setLoading(false)
    if (error) setError(error)
    return { data, error }
  }, [])

  const signInWithOAuth = useCallback(async (provider: 'google' | 'github' | 'azure') => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    setLoading(false)
    if (error) setError(error)
    return { data, error }
  }, [])

  const signInWithMagicLink = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    setLoading(false)
    if (error) setError(error)
    return { data, error }
  }, [])

  return {
    signInWithEmail,
    signInWithOAuth,
    signInWithMagicLink,
    loading,
    error,
  }
}

/**
 * Hook for sign up functionality
 */
export function useSignUp() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const supabase = createClient()

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    metadata?: { full_name?: string }
  ) => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: metadata,
      },
    })
    
    setLoading(false)
    if (error) setError(error)
    return { data, error }
  }, [])

  return { signUp, loading, error }
}

/**
 * Hook for sign out functionality
 */
export function useSignOut() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const signOut = useCallback(async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
    window.location.href = '/login'
  }, [])

  return { signOut, loading }
}

/**
 * Hook for password reset
 */
export function usePasswordReset() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const supabase = createClient()

  const resetPassword = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    
    setLoading(false)
    if (error) setError(error)
    return { data, error }
  }, [])

  const updatePassword = useCallback(async (newPassword: string) => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    
    setLoading(false)
    if (error) setError(error)
    return { data, error }
  }, [])

  return { resetPassword, updatePassword, loading, error }
}
