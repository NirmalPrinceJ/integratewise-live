"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Sparkles, TrendingUp, Clock, Brain, ArrowRight } from "lucide-react"

export default function InsightsPreviewPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [showInsights, setShowInsights] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setShowInsights(true)
    }
  }

  const handleContinue = () => {
    router.push("/hub/signup?name=" + encodeURIComponent(name))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1833] via-[#1a2744] to-[#0A1833] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {!showInsights ? (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-indigo-400" />
              <h1 className="text-3xl font-bold text-white">Your Personal Insights</h1>
            </div>

            <p className="text-gray-300 mb-8 text-lg">
              Tell us your name and we'll show you the kind of insights IntegrateWise generates for you every day.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  What should we call you?
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                Show my insights
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Hey {name}! 👋 Here's what we discovered:</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Peak Productivity</h3>
                    <p className="text-gray-300 text-sm">
                      You're most productive on <strong>Tuesday mornings</strong> between 9-11 AM. Schedule your deep
                      work then!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Time Leaks</h3>
                    <p className="text-gray-300 text-sm">
                      Meetings after 3 PM drain your energy. Try blocking afternoons for async work.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Hidden Opportunities</h3>
                    <p className="text-gray-300 text-sm">
                      3 clients haven't heard from you in 2+ weeks. Quick check-ins could unlock new projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 text-center">
              <p className="text-white mb-4">
                This is just a taste. Connect your tools to unlock personalized insights every day.
              </p>
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-white text-indigo-900 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center gap-2"
              >
                Continue to IntegrateWise
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
