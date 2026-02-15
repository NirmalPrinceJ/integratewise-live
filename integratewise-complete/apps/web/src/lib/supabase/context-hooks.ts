/**
 * Supabase Context Hooks
 * 
 * React hooks for managing user context/workspace state.
 * L1 Workplace layer - user's working memory.
 */
'use client'

import { createClient } from './client'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './auth-hooks'
import type { Context, Insertable, Updatable } from './types'

type ContextType = 'workspace' | 'entity' | 'session' | 'preference'

interface UseContextsOptions {
  contextType?: ContextType
  entityType?: string
  entityId?: string
}

/**
 * Hook to get and manage user contexts
 */
export function useContexts(options: UseContextsOptions = {}) {
  const [contexts, setContexts] = useState<Context[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchContexts = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    try {
      let query = supabase
        .from('contexts')
        .select('*')
        .order('updated_at', { ascending: false })

      if (options.contextType) {
        query = query.eq('context_type', options.contextType)
      }
      if (options.entityType) {
        query = query.eq('entity_type', options.entityType)
      }
      if (options.entityId) {
        query = query.eq('entity_id', options.entityId)
      }

      const { data, error } = await query

      if (error) throw error
      setContexts(data as Context[])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [user, options.contextType, options.entityType, options.entityId])

  useEffect(() => {
    fetchContexts()
  }, [fetchContexts])

  const setContext = useCallback(async (
    key: string,
    value: unknown,
    contextType: ContextType = 'workspace',
    entityRef?: { entityType: string; entityId: string }
  ) => {
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single()

    if (!profile) return null

    const contextData: Insertable<'contexts'> = {
      tenant_id: profile.tenant_id,
      user_id: user.id,
      context_type: contextType,
      key,
      value: value as any,
      entity_type: entityRef?.entityType,
      entity_id: entityRef?.entityId,
    }

    const { data, error } = await supabase
      .from('contexts')
      .upsert(contextData, { 
        onConflict: 'tenant_id,user_id,context_type,key' 
      })
      .select()
      .single()

    if (error) throw error
    
    // Update local state
    setContexts(prev => {
      const idx = prev.findIndex(c => c.key === key && c.context_type === contextType)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = data as Context
        return updated
      }
      return [data as Context, ...prev]
    })

    return data as Context
  }, [user])

  const getContext = useCallback(async (key: string, contextType: ContextType = 'workspace') => {
    if (!user) return null

    const { data, error } = await supabase
      .from('contexts')
      .select('*')
      .eq('user_id', user.id)
      .eq('context_type', contextType)
      .eq('key', key)
      .single()

    if (error) return null
    return data as Context
  }, [user])

  const deleteContext = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('contexts')
      .delete()
      .eq('id', id)

    if (error) throw error
    setContexts(prev => prev.filter(c => c.id !== id))
  }, [])

  return {
    contexts,
    loading,
    error,
    setContext,
    getContext,
    deleteContext,
    refresh: fetchContexts,
  }
}

/**
 * Hook for user preferences (convenience wrapper)
 */
export function usePreferences() {
  const { contexts, setContext, getContext, loading } = useContexts({ contextType: 'preference' })

  const setPreference = useCallback(async (key: string, value: unknown) => {
    return setContext(key, value, 'preference')
  }, [setContext])

  const getPreference = useCallback(async <T = unknown>(key: string): Promise<T | null> => {
    const ctx = await getContext(key, 'preference')
    return ctx?.value as T | null
  }, [getContext])

  return {
    preferences: contexts,
    setPreference,
    getPreference,
    loading,
  }
}

/**
 * Hook for current workspace context
 */
export function useWorkspace() {
  const { contexts, setContext, loading } = useContexts({ contextType: 'workspace' })

  const setWorkspaceContext = useCallback(async (key: string, value: unknown) => {
    return setContext(key, value, 'workspace')
  }, [setContext])

  // Extract common workspace values
  const currentEntity = contexts.find(c => c.key === 'current_entity')?.value as {
    entityType?: string
    entityId?: string
  } | undefined

  const recentEntities = contexts.find(c => c.key === 'recent_entities')?.value as Array<{
    entityType: string
    entityId: string
    title: string
    accessedAt: string
  }> | undefined

  return {
    contexts,
    currentEntity,
    recentEntities,
    setWorkspaceContext,
    loading,
  }
}
