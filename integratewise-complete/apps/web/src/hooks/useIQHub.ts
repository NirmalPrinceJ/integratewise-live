"use client"

import useSWR from "swr"
import { useState, useCallback } from "react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export interface AIConversation {
    id: string
    title: string
    last_message?: string
    message_count: number
    type: string
    created_at: string
    updated_at: string
}

export interface AIMessage {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    created_at: string
}

export function useIQHub() {
    const { data: convData, mutate: mutateConversations } = useSWR<{ conversations: AIConversation[] }>(
        "/api/ai/conversations",
        fetcher
    )

    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

    const { data: msgData, mutate: mutateMessages, isLoading: messagesLoading } = useSWR<{ messages: AIMessage[] }>(
        activeConversationId ? `/api/ai/conversations/${activeConversationId}/messages` : null,
        fetcher
    )

    const sendMessage = useCallback(async (content: string) => {
        if (!activeConversationId) return

        // 1. Save user message
        const userRes = await fetch(`/api/ai/conversations/${activeConversationId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: "user", content })
        })

        if (!userRes.ok) throw new Error("Failed to send message")

        // Refresh messages locally
        mutateMessages()

        // 2. Get AI response
        const aiChatRes = await fetch("/api/ai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: content })
        })

        if (!aiChatRes.ok) throw new Error("AI chat error")
        const { response } = await aiChatRes.json()

        // 3. Save AI message
        await fetch(`/api/ai/conversations/${activeConversationId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: "assistant", content: response })
        })

        // Final refresh
        mutateMessages()
        mutateConversations()
    }, [activeConversationId, mutateMessages, mutateConversations])

    const createConversation = useCallback(async (title: string, type: string = "analysis") => {
        const res = await fetch("/api/ai/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, type })
        })

        if (!res.ok) throw new Error("Failed to create conversation")
        const { conversation } = await res.json()

        mutateConversations()
        setActiveConversationId(conversation.id)
        return conversation
    }, [mutateConversations])

    return {
        conversations: convData?.conversations || [],
        activeConversationId,
        setActiveConversationId,
        messages: msgData?.messages || [],
        messagesLoading,
        sendMessage,
        createConversation,
        refreshConversations: mutateConversations
    }
}
