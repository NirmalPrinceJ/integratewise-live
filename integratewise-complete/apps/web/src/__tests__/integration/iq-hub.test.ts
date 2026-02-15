import { describe, test, expect, beforeEach } from 'vitest'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function apiCall(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    })
    return response
}

describe('IQ Hub Integration', () => {
    let testConversationId: string

    test('should create a new AI conversation', async () => {
        const response = await apiCall('/api/ai/conversations', {
            method: 'POST',
            body: JSON.stringify({
                title: 'Test Integration Conversation',
                type: 'analysis'
            })
        })

        expect(response.status).toBe(201)
        const data = await response.json()
        expect(data.conversation).toHaveProperty('id')
        expect(data.conversation.title).toBe('Test Integration Conversation')
        testConversationId = data.conversation.id
    })

    test('should list AI conversations', async () => {
        const response = await apiCall('/api/ai/conversations')
        expect(response.status).toBe(200)
        const data = await response.json()
        expect(Array.isArray(data.conversations)).toBe(true)
        expect(data.conversations.length).toBeGreaterThan(0)
    })

    test('should send a message to a conversation', async () => {
        if (!testConversationId) {
            // Fallback or create one
            const res = await apiCall('/api/ai/conversations', {
                method: 'POST',
                body: JSON.stringify({ title: 'Fallback' })
            })
            const d = await res.json()
            testConversationId = d.conversation.id
        }

        const response = await apiCall(`/api/ai/conversations/${testConversationId}/messages`, {
            method: 'POST',
            body: JSON.stringify({
                role: 'user',
                content: 'Hello AI, this is an integration test.'
            })
        })

        expect(response.status).toBe(201)
        const data = await response.json()
        expect(data.message.role).toBe('user')
        expect(data.message.content).toBe('Hello AI, this is an integration test.')
    })

    test('should get messages for a conversation', async () => {
        const response = await apiCall(`/api/ai/conversations/${testConversationId}/messages`)
        expect(response.status).toBe(200)
        const data = await response.json()
        expect(Array.isArray(data.messages)).toBe(true)
        expect(data.messages.length).toBeGreaterThan(0)
    })

    test('should get real AI response (integration with Groq API)', async () => {
        // This tests the /api/ai/chat route which calls Groq
        const response = await apiCall('/api/ai/chat', {
            method: 'POST',
            body: JSON.stringify({
                message: 'What is the color of the sky?'
            })
        })

        expect(response.status).toBe(200)
        const data = await response.json()
        expect(data.response).toBeDefined()
        expect(typeof data.response).toBe('string')
        expect(data.response.length).toBeGreaterThan(0)
    })
})
