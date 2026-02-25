'use client'

import { useEffect, useState } from 'react'
import { createBrowserDbClient } from '@/lib/database/provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInWithSupabaseEmail, signUpWithSupabase, getSupabaseUser } from '@/lib/supabase/auth'

export default function TestPage() {
  const [dbStatus, setDbStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [dbError, setDbError] = useState<string>('')
  const [userCount, setUserCount] = useState<number>(0)
  
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [authError, setAuthError] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Detect if using Doppler
  const isDoppler = !!process.env.DOPPLER_ENVIRONMENT

  // Test database connection
  const testDbConnection = async () => {
    setDbStatus('loading')
    setDbError('')
    
    try {
      const supabase = createBrowserDbClient()
      
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      
      if (countError) throw countError
      
      setUserCount(count || 0)
      setDbStatus('connected')
      
    } catch (err: any) {
      setDbStatus('error')
      setDbError(err.message || 'Connection failed')
    }
  }

  // Test auth - sign in
  const testAuthSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthStatus('loading')
    setAuthError('')
    
    try {
      await signInWithSupabaseEmail(email, password)
      const user = await getSupabaseUser()
      setCurrentUser(user)
      setAuthStatus('success')
    } catch (err: any) {
      setAuthStatus('error')
      setAuthError(err.message || 'Auth failed')
    }
  }

  // Test auth - sign up
  const testAuthSignUp = async () => {
    setAuthStatus('loading')
    setAuthError('')
    
    try {
      await signUpWithSupabase(email, password, { name: 'Test User' })
      setAuthStatus('success')
    } catch (err: any) {
      setAuthStatus('error')
      setAuthError(err.message || 'Sign up failed')
    }
  }

  // Check existing session on load
  useEffect(() => {
    testDbConnection()
    getSupabaseUser().then(user => {
      if (user) {
        setCurrentUser(user)
        setAuthStatus('success')
      }
    })
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">🔌 Supabase Connection Test</h1>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isDoppler 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isDoppler ? '🔒 Doppler' : '📄 Local .env'}
          </div>
        </div>
        
        {/* Database Connection Card */}
        <Card>
          <CardHeader>
            <CardTitle>Database Connection</CardTitle>
            <CardDescription>
              Testing direct Supabase connection
              {isDoppler && ' (via Doppler)'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dbStatus === 'loading' && (
              <div className="flex items-center gap-2 text-yellow-600">
                <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                Testing connection...
              </div>
            )}
            
            {dbStatus === 'connected' && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-800">✅ Database Connected</AlertTitle>
                <AlertDescription className="text-green-700">
                  Successfully connected to Supabase!
                  <br />
                  Users in database: <strong>{userCount}</strong>
                </AlertDescription>
              </Alert>
            )}
            
            {dbStatus === 'error' && (
              <Alert variant="destructive">
                <AlertTitle>❌ Database Connection Failed</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>{dbError}</p>
                  <div className="text-sm mt-2">
                    <p className="font-semibold">Troubleshooting:</p>
                    <ul className="list-disc list-inside">
                      {isDoppler ? (
                        <>
                          <li>Check: doppler secrets --config prd_web</li>
                          <li>Verify NEXT_PUBLIC_SUPABASE_URL is set</li>
                          <li>Run: doppler run --config prd_web -- npm run dev</li>
                        </>
                      ) : (
                        <>
                          <li>Check .env.local file exists</li>
                          <li>Verify NEXT_PUBLIC_SUPABASE_URL is set</li>
                          <li>Restart dev server after changes</li>
                        </>
                      )}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <Button onClick={testDbConnection} disabled={dbStatus === 'loading'} variant="outline">
              {dbStatus === 'loading' ? 'Testing...' : 'Test Again'}
            </Button>
          </CardContent>
        </Card>

        {/* Auth Test Card */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
            <CardDescription>Test Supabase Auth</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentUser ? (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800">👤 Logged In</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Email: {currentUser.email}
                  <br />
                  ID: {currentUser.id.slice(0, 8)}...
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={testAuthSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-email">Email</Label>
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="test@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-password">Password</Label>
                  <Input
                    id="test-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {authStatus === 'error' && (
                  <Alert variant="destructive">
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}
                
                {authStatus === 'success' && !currentUser && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription>Check your email for confirmation!</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={authStatus === 'loading'}>
                    {authStatus === 'loading' ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <Button type="button" variant="outline" onClick={testAuthSignUp} disabled={authStatus === 'loading'}>
                    Sign Up
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Environment Card */}
        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded text-sm ${
                isDoppler ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                Source: {isDoppler ? 'Doppler' : '.env.local file'}
              </div>
              {isDoppler && (
                <div className="text-sm text-muted-foreground">
                  Config: {process.env.DOPPLER_CONFIG}
                </div>
              )}
            </div>
            
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) || 'NOT SET'}...
Anon Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
Service Key: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}
${isDoppler ? `Doppler Env: ${process.env.DOPPLER_ENVIRONMENT}` : ''}`}
            </pre>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            <Button variant="outline" onClick={() => window.location.href = '/auth/login'}>
              Production Login
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Home Page
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
