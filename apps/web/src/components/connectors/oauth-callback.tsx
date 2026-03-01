"use client"

/**
 * OAuth Callback Page
 * Catches ?code=&state= from OAuth provider redirect,
 * exchanges for tokens via Gateway, then redirects to integrations page.
 *
 * Route: /oauth/callback/:provider
 */

import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router'
import { connector } from '@/lib/api-client'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

type CallbackStatus = 'processing' | 'success' | 'error'

export function OAuthCallbackPage() {
  const { provider } = useParams<{ provider: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<CallbackStatus>('processing')
  const [message, setMessage] = useState('Connecting your account...')

  useEffect(() => {
    async function exchangeCode() {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')

      if (error) {
        setStatus('error')
        setMessage(`Authorization denied: ${error}`)
        setTimeout(() => navigate('/app/workspace?tab=integrations&error=' + error), 3000)
        return
      }

      if (!code || !provider) {
        setStatus('error')
        setMessage('Missing authorization code or provider')
        setTimeout(() => navigate('/app/workspace?tab=integrations&error=missing_code'), 3000)
        return
      }

      try {
        const result = await connector.callback(provider, code, state || '')
        if (result) {
          setStatus('success')
          setMessage(`${provider} connected successfully!`)
          setTimeout(() => navigate('/app/workspace?tab=integrations&connected=' + provider), 2000)
        }
      } catch (err: any) {
        setStatus('error')
        setMessage(err?.message || 'Failed to complete OAuth exchange')
        setTimeout(() => navigate('/app/workspace?tab=integrations&error=exchange_failed'), 3000)
      }
    }

    exchangeCode()
  }, [provider, searchParams, navigate])

  return (
    <div className="min-h-screen bg-[#0C1222] flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md px-6">
        {status === 'processing' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto" />
            <h2 className="text-xl text-white font-semibold">Connecting {provider}...</h2>
            <p className="text-white/60 text-sm">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-xl text-white font-semibold">Connected!</h2>
            <p className="text-white/60 text-sm">{message}</p>
            <p className="text-white/40 text-xs">Redirecting to workspace...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl text-white font-semibold">Connection Failed</h2>
            <p className="text-white/60 text-sm">{message}</p>
            <p className="text-white/40 text-xs">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default OAuthCallbackPage
