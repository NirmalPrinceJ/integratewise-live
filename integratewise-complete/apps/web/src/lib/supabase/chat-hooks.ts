/**
 * Supabase AI Chat Hooks
 * 
 * React hooks for AI chat sessions and messages.
 * L2 Cognitive Brain layer - AI conversation persistence.
 */
'use client'

import { createClient } from './client'
import { useCallback, useEffect, useState, useRef } from 'react'
import { useAuth } from './auth-hooks'
import type { AIChat, AIChatMessage, Insertable } from './types'

interface UseChatOptions {
  chatId?: string
  surface?: string
  entityRef?: { entityType: string; entityId: string }
}

/**
 * Hook to list user's chat sessions
 */
export function useChats(options: { surface?: string; limit?: number } = {}) {
  const [chats, setChats] = useState<AIChat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchChats = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    try {
      let query = supabase
        .from('ai_chats')
        .select('*')
        .eq('user_id', user.id)
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
  }, [user, options.surface, options.limit])

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  const createChat = useCallback(async (
    title?: string,
    surface: string = 'cognitive-drawer',
    entityRef?: { entityType: string; entityId: string }
  ): Promise<AIChat | null> => {
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single()

    if (!profile) return null

    const chatData: Insertable<'ai_chats'> = {
      tenant_id: profile.tenant_id,
      user_id: user.id,
      title,
      surface,
      context_entity_type: entityRef?.entityType,
      context_entity_id: entityRef?.entityId,
      model: 'gpt-4o',
    }

    const { data, error } = await supabase
      .from('ai_chats')
      .insert(chatData)
      .select()
      .single()

    if (error) throw error
    
    setChats(prev => [data as AIChat, ...prev])
    return data as AIChat
  }, [user])

  const archiveChat = useCallback(async (chatId: string) => {
    const { error } = await supabase
      .from('ai_chats')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', chatId)

    if (error) throw error
    setChats(prev => prev.filter(c => c.id !== chatId))
  }, [])

  const updateChatTitle = useCallback(async (chatId: string, title: string) => {
    const { data, error } = await supabase
      .from('ai_chats')
      .update({ title })
      .eq('id', chatId)
      .select()
      .single()

    if (error) throw error
    setChats(prev => prev.map(c => c.id === chatId ? data as AIChat : c))
    return data as AIChat
  }, [])

  return {
    chats,
    loading,
    error,
    createChat,
    archiveChat,
    updateChatTitle,
    refresh: fetchChats,
  }
}

/**
 * Hook for a single chat session with messages
 */
export function useChat(chatId: string | null) {
  const [chat, setChat] = useState<AIChat | null>(null)
  const [messages, setMessages] = useState<AIChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const supabase = createClient()
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // Fetch chat and messages
  const fetchChat = useCallback(async () => {
    if (!chatId || !user) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      // Fetch chat details
      const { data: chatData, error: chatError } = await supabase
        .from('ai_chats')
        .select('*')
        .eq('id', chatId)
        .single()

      if (chatError) throw chatError
      setChat(chatData as AIChat)

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
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
  }, [chatId, user])

  useEffect(() => {
    fetchChat()
  }, [fetchChat])

  // Real-time subscription for new messages
  useEffect(() => {
    if (!chatId) return

    const channel = supabase
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
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) return prev
            return [...prev, newMessage]
          })
        }
      )
      .subscribe()

    subscriptionRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId])

  const sendMessage = useCallback(async (
    content: string,
    role: 'user' | 'assistant' | 'system' = 'user',
    metadata?: {
      toolCalls?: unknown
      toolResults?: unknown
      evidenceRefs?: string[]
      tokensInput?: number
      tokensOutput?: number
      latencyMs?: number
    }
  ): Promise<AIChatMessage | null> => {
    if (!chatId) return null

    setSending(true)
    try {
      const messageData: Insertable<'ai_chat_messages'> = {
        chat_id: chatId,
        role,
        content,
        tool_calls: metadata?.toolCalls as any,
        tool_results: metadata?.toolResults as any,
        evidence_refs: metadata?.evidenceRefs ?? [],
        tokens_input: metadata?.tokensInput,
        tokens_output: metadata?.tokensOutput,
        latency_ms: metadata?.latencyMs,
      }

      const { data, error } = await supabase
        .from('ai_chat_messages')
        .insert(messageData)
        .select()
        .single()

      if (error) throw error

      // Update chat's updated_at
      await supabase
        .from('ai_chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId)

      // Add to local state (subscription will also add, but this ensures immediate update)
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
  }, [chatId])

  return {
    chat,
    messages,
    loading,
    sending,
    error,
    sendMessage,
    refresh: fetchChat,
  }
}

/**
 * Hook for quick chat creation and messaging (convenience)
 */
export function useQuickChat(surface: string = 'cognitive-drawer') {
  const { createChat } = useChats({ surface })
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const chatState = useChat(currentChatId)

  const startNewChat = useCallback(async (
    firstMessage?: string,
    entityRef?: { entityType: string; entityId: string }
  ) => {
    const chat = await createChat(undefined, surface, entityRef)
    if (chat) {
      setCurrentChatId(chat.id)
      if (firstMessage) {
        // Small delay to ensure subscription is ready
        setTimeout(async () => {
          await chatState.sendMessage(firstMessage)
        }, 100)
      }
    }
    return chat
  }, [createChat, surface, chatState.sendMessage])

  const switchToChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId)
  }, [])

  return {
    ...chatState,
    currentChatId,
    startNewChat,
    switchToChat,
  }
}
