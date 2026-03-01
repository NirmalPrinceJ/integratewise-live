/**
 * Cross-Platform React Hooks
 * 
 * These hooks work on Web, Mobile (React Native), and Desktop (Electron).
 * They accept a Supabase client as parameter to be platform-agnostic.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import type { User, Session, AuthError, SupabaseClient } from '@supabase/supabase-js'
import type { Database, Profile, AIChat, AIChatMessage, Context } from '../types'

type TypedClient = SupabaseClient<Database>

// ═══════════════════════════════════════════════════════════════
// AUTH HOOKS
// ═══════════════════════════════════════════════════════════════

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
export function useAuth(client: TypedClient) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await client.auth.getSession()
        
        if (error) {
          setState(prev => ({ ...prev, loading: false, error }))
          return
        }

        if (session?.user) {
          const { data: profile } = await client
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
      } catch {
        setState(prev => ({ ...prev, loading: false }))
      }
    }

    getInitialSession()

    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await client
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
  }, [client])

  return state
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT HOOKS (L1 Workplace)
// ═══════════════════════════════════════════════════════════════

type ContextType = 'workspace' | 'entity' | 'session' | 'preference'

export function useContexts(
  client: TypedClient,
  userId: string | null,
  options: { contextType?: ContextType } = {}
) {
  const [contexts, setContexts] = useState<Context[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchContexts = useCallback(async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      let query = client
        .from('contexts')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (options.contextType) {
        query = query.eq('context_type', options.contextType)
      }

      const { data, error } = await query

      if (error) throw error
      setContexts(data as Context[])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [client, userId, options.contextType])

  useEffect(() => {
    fetchContexts()
  }, [fetchContexts])

  const setContext = useCallback(async (
    tenantId: string,
    key: string,
    value: unknown,
    contextType: ContextType = 'workspace'
  ) => {
    if (!userId) return null

    const { data, error } = await (client
      .from('contexts') as any)
      .upsert({
        tenant_id: tenantId,
        user_id: userId,
        context_type: contextType,
        key,
        value: value as any,
      }, {
        onConflict: 'tenant_id,user_id,context_type,key'
      })
      .select()
      .single()

    if (error) throw error
    
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
  }, [client, userId])

  return { contexts, loading, error, setContext, refresh: fetchContexts }
}

// ═══════════════════════════════════════════════════════════════
// CHAT HOOKS (L2 Cognitive)
// ═══════════════════════════════════════════════════════════════

export function useChats(
  client: TypedClient,
  userId: string | null,
  options: { surface?: string; limit?: number } = {}
) {
  const [chats, setChats] = useState<AIChat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchChats = useCallback(async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      let query = client
        .from('ai_chats')
        .select('*')
        .eq('user_id', userId)
        .is('archived_at', null)
        .order('updated_at', { ascending: false })
        .limit(options.limit ?? 50)

      if (options.surface) {
        query = query.eq('surface', options.surface)
      }

      const { data, error } = await query

      if (error) throw error
      setChats(data as AIChat[])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [client, userId, options.surface, options.limit])

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  const createChat = useCallback(async (
    tenantId: string,
    title?: string,
    surface: string = 'cognitive-drawer'
  ): Promise<AIChat | null> => {
    if (!userId) return null

    const { data, error } = await (client
      .from('ai_chats') as any)
      .insert({
        tenant_id: tenantId,
        user_id: userId,
        title,
        surface,
        model: 'gpt-4o',
      })
      .select()
      .single()

    if (error) throw error
    
    setChats(prev => [data as AIChat, ...prev])
    return data as AIChat
  }, [client, userId])

  const archiveChat = useCallback(async (chatId: string) => {
    const { error } = await (client
      .from('ai_chats') as any)
      .update({ archived_at: new Date().toISOString() })
      .eq('id', chatId)

    if (error) throw error
    setChats(prev => prev.filter(c => c.id !== chatId))
  }, [client])

  return { chats, loading, error, createChat, archiveChat, refresh: fetchChats }
}

export function useChat(client: TypedClient, chatId: string | null) {
  const [chat, setChat] = useState<AIChat | null>(null)
  const [messages, setMessages] = useState<AIChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const subscriptionRef = useRef<ReturnType<typeof client.channel> | null>(null)

  const fetchChat = useCallback(async () => {
    if (!chatId) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data: chatData, error: chatError } = await client
        .from('ai_chats')
        .select('*')
        .eq('id', chatId)
        .single()

      if (chatError) throw chatError
      setChat(chatData as AIChat)

      const { data: messagesData, error: messagesError } = await client
        .from('ai_chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError
      setMessages(messagesData as AIChatMessage[])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [client, chatId])

  useEffect(() => {
    fetchChat()
  }, [fetchChat])

  // Real-time subscription
  useEffect(() => {
    if (!chatId) return

    const channel = client
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_chat_messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = payload.new as AIChatMessage
          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev
            return [...prev, newMessage]
          })
        }
      )
      .subscribe()

    subscriptionRef.current = channel

    return () => {
      client.removeChannel(channel)
    }
  }, [client, chatId])

  const sendMessage = useCallback(async (
    content: string,
    role: 'user' | 'assistant' | 'system' = 'user'
  ): Promise<AIChatMessage | null> => {
    if (!chatId) return null

    setSending(true)
    try {
      const { data, error } = await (client
        .from('ai_chat_messages') as any)
        .insert({
          chat_id: chatId,
          role,
          content,
          evidence_refs: [],
        })
        .select()
        .single()

      if (error) throw error

      await (client
        .from('ai_chats') as any)
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId)

      const newMessage = data as AIChatMessage
      setMessages(prev => {
        if (prev.some(m => m.id === newMessage.id)) return prev
        return [...prev, newMessage]
      })

      return newMessage
    } catch (err) {
      setError(err as Error)
      return null
    } finally {
      setSending(false)
    }
  }, [client, chatId])

  return { chat, messages, loading, sending, error, sendMessage, refresh: fetchChat }
}

// Export all hooks
export const hooks = {
  useAuth,
  useContexts,
  useChats,
  useChat,
}
