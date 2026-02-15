"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SpineContextValue {
    connected: boolean
    connect: () => Promise<void>
    disconnect: () => void
    status: 'disconnected' | 'connecting' | 'connected' | 'error'
}

const SpineContext = createContext<SpineContextValue | undefined>(undefined)

export function SpineContextProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')

    const connect = async () => {
        setStatus('connecting')
        try {
            // TODO: Implement actual spine connection logic
            await new Promise(resolve => setTimeout(resolve, 800))
            setStatus('connected')
        } catch (err) {
            console.error('Failed to connect to Spine', err)
            setStatus('error')
        }
    }

    const disconnect = () => {
        setStatus('disconnected')
    }

    // Auto-connect on mount
    useEffect(() => {
        connect()
    }, [])

    return (
        <SpineContext.Provider value={{
            connected: status === 'connected',
            connect,
            disconnect,
            status
        }}>
            {children}
        </SpineContext.Provider>
    )
}

export function useSpine() {
    const context = useContext(SpineContext)
    if (!context) {
        throw new Error('useSpine must be used within SpineContextProvider')
    }
    return context
}
