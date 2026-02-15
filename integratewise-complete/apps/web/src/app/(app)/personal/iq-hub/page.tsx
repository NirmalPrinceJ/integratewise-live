"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Brain, Send, Plus, MessageSquare, Clock, Sparkles,
  Database, Lightbulb, MoreHorizontal, Trash2
} from "lucide-react"

import { useIQHub, AIConversation, AIMessage } from "@/hooks/useIQHub"
import { Skeleton } from "@/components/ui/skeleton"

export default function IQHubPage() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    messagesLoading,
    sendMessage,
    createConversation
  } = useIQHub()

  const [inputValue, setInputValue] = useState("")
  const [isSending, setIsSending] = useState(false)

  const activeConversation = conversations.find((c: AIConversation) => c.id === activeConversationId) || conversations[0]

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id)
    }
  }, [conversations, activeConversationId, setActiveConversationId])

  async function sendMessageWithRetry(message: string, maxRetries: number = 3, delay: number = 1000) {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        await sendMessage(message);
        return; // Success
      } catch (error: any) {
        if (error.message && error.message.includes("EOF")) {
          console.log(`Attempt ${retries + 1} failed with EOF error. Retrying in ${delay}ms.`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          retries++;
        } else {
          // Non-EOF error, re-throw
          throw error;
        }
      }
    }
    throw new Error(`Failed to send message after ${maxRetries} retries due to EOF error.`);
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return

    setIsSending(true)




    try {
      await sendMessage(inputValue)
      setInputValue("")
    } catch (err) {
      console.error("Failed to send:", err)
    } finally {
      setIsSending(false)
    }
  }

  const handleNewConversation = async () => {
    try {
      await createConversation("New Conversation")
    } catch (err) {
      console.error("Failed to create conversation:", err)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              IQ Hub
            </h2>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleNewConversation}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv: AIConversation) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${activeConversationId === conv.id
                    ? "bg-blue-100 dark:bg-blue-900/20"
                    : "hover:bg-muted"
                  }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-sm truncate pr-2">{conv.title}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(conv.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {conv.last_message || "No messages yet"}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {conv.message_count} msgs
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {conv.type}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold">{activeConversation?.title || "AI Assistant"}</h1>
            <p className="text-sm text-muted-foreground">
              {activeConversation?.message_count || 0} messages • {activeConversation ? new Date(activeConversation.updated_at).toLocaleDateString() : "Just now"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Database className="h-4 w-4" />
              Connect Data
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message: AIMessage) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Brain className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-muted"
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-200">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {messagesLoading && (
              <div className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-10 w-64 rounded-lg" />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Input
              placeholder="Ask about your data, accounts, or insights..."
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSend()}
              disabled={isSending || !activeConversationId}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={isSending || !activeConversationId} className="gap-2">
              {isSending ? <Sparkles className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isSending ? "Thinking..." : "Send"}
            </Button>
          </div>
          <div className="max-w-3xl mx-auto mt-2 flex gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setInputValue("Analyze Q1 performance")}>
              <Sparkles className="h-3 w-3 mr-1" />
              Analyze Q1
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setInputValue("Show churn risks")}>
              <Lightbulb className="h-3 w-3 mr-1" />
              Churn Risks
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setInputValue("Pipeline forecast for this quarter")}>
              <Clock className="h-3 w-3 mr-1" />
              Pipeline Forecast
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
