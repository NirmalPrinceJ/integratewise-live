"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<"personal" | "business" | "cs">("personal")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to dashboard on success
      router.push("/")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Green Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2D7A3E] flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">W</span>
            </div>
            <span className="text-white text-2xl font-semibold">IntegrateWise</span>
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Your Complete
            <br />
            Operating System
          </h1>
          <div className="space-y-4">
            <FeatureItem text="Unified Business Intelligence" />
            <FeatureItem text="AI-Powered Insights" />
            <FeatureItem text="Real-time Collaboration" />
          </div>
        </div>

        <p className="text-white/60 text-sm">&copy; 2026 IntegrateWise LLP. All rights reserved.</p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-white">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#2D7A3E] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <span className="text-gray-900 text-xl font-semibold">IntegrateWise</span>
        </div>

        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to your workspace</p>

          {/* Workspace Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
            <TabButton active={activeTab === "personal"} onClick={() => setActiveTab("personal")} label="Personal" />
            <TabButton active={activeTab === "business"} onClick={() => setActiveTab("business")} label="Business" />
            <TabButton active={activeTab === "cs"} onClick={() => setActiveTab("cs")} label="CS Ops" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D7A3E]/20 focus:border-[#2D7A3E] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D7A3E]/20 focus:border-[#2D7A3E] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#2D7A3E] focus:ring-[#2D7A3E]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-[#2D7A3E] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2D7A3E] text-white py-3 rounded-lg font-medium hover:bg-[#236B31] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="/signup" className="text-[#2D7A3E] font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
        <Check className="w-4 h-4 text-white" />
      </div>
      <span className="text-white/90">{text}</span>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
        active ? "bg-white text-[#2D7A3E] shadow-sm" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  )
}
