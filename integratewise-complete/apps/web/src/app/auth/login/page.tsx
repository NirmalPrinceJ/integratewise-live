"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { IntegrateWiseLogo } from "@/components/integratewise-logo"
import { signInWithEmail, signInWithMicrosoft, signInWithProvider } from "@/lib/auth-client"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [workspace, setWorkspace] = useState("acme")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [providerLoading, setProviderLoading] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signInWithEmail(email, password)
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      })
      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid credentials",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderLogin = async (provider: "google" | "microsoft" | "github" | "azure") => {
    setProviderLoading(provider)
    try {
      if (provider === "microsoft") {
        await signInWithMicrosoft()
      } else {
        await signInWithProvider(provider === "azure" ? "azure" : provider)
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in",
        type: "error",
      })
      setProviderLoading(null)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Slack-like contextual panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <IntegrateWiseLogo className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">IntegrateWise OS</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">Sign in to your workspace</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Admins can manage members, auth, and provisioning from the Control Plane.
          </p>
        </div>
        <div className="relative z-10 space-y-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-sm font-semibold text-white">Slack-like admin UX</div>
            <div className="text-sm text-white/70 mt-1">People, IAM, SSO/SCIM, domain verification.</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-sm font-semibold text-white">Card UI everywhere</div>
            <div className="text-sm text-white/70 mt-1">No tables; clear actions and empty states.</div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#3F3182] to-[#E94B8A] flex items-center justify-center">
                <IntegrateWiseLogo className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">IntegrateWise OS</span>
            </div>
          </div>

          <Card className="border shadow-lg">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
              <CardDescription>Choose a workspace, then continue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Workspace selector (Slack-like) */}
              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace</Label>
                <div className="grid grid-cols-1 gap-2">
                  <select
                    id="workspace"
                    aria-label="Workspace"
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="acme">Acme Corp</option>
                    <option value="globex">Globex</option>
                    <option value="umbrella">Umbrella</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Not sure? You can still sign in and pick later.
                  </p>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full h-11 bg-transparent"
                  onClick={() => handleProviderLogin("google")}
                  disabled={!!providerLoading}
                >
                  {providerLoading === "google" ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-11 bg-transparent"
                  onClick={() => handleProviderLogin("microsoft")}
                  disabled={!!providerLoading}
                >
                  {providerLoading === "microsoft" ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                  )}
                  Microsoft
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full h-11 bg-transparent"
                  onClick={() => handleProviderLogin("github")}
                  disabled={!!providerLoading}
                >
                  {providerLoading === "github" ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  )}
                  GitHub
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-11 bg-transparent"
                  onClick={() => handleProviderLogin("azure")}
                  disabled={!!providerLoading}
                >
                  {providerLoading === "azure" ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 3.2l-9.1 7.5 3.6 13.3z" fill="#0089D6" />
                      <path d="M10.9 10.7L4 12.3 12.9 3.2l-2 7.5z" fill="#0089D6" />
                      <path d="M16.5 14L4 12.3 2 21h14.5z" fill="#00BCF2" />
                    </svg>
                  )}
                  SSO
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                  />
                </div>

                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in with Email"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="text-primary font-medium hover:underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
