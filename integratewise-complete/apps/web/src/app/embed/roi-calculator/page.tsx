"use client"

export const runtime = 'edge';

/**
 * Embeddable ROI Calculator for Webflow
 * 
 * Usage in Webflow:
 * <iframe src="https://app.integratewise.ai/embed/roi-calculator?theme=light" />
 */

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Calculator, TrendingUp, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

function ROICalculatorContent() {
  const searchParams = useSearchParams()
  const theme = searchParams.get("theme") || "light"
  const isDark = theme === "dark"

  const [inputs, setInputs] = useState({
    teamSize: 10,
    avgSalary: 75000,
    hoursOnManualTasks: 15,
    toolsUsed: 8,
  })

  // Calculate ROI
  const hourlyRate = inputs.avgSalary / 2080 // 52 weeks * 40 hours
  const weeklyManualCost = inputs.hoursOnManualTasks * hourlyRate * inputs.teamSize
  const monthlyManualCost = weeklyManualCost * 4.33
  const annualManualCost = monthlyManualCost * 12

  // Automation saves ~70% of manual time
  const automationSavings = annualManualCost * 0.7
  const integratewiseCost = inputs.teamSize <= 5 ? 49 * 12 : inputs.teamSize <= 20 ? 149 * 12 : 499 * 12
  const netSavings = automationSavings - integratewiseCost
  const roi = ((netSavings / integratewiseCost) * 100).toFixed(0)
  const hoursSaved = Math.round(inputs.hoursOnManualTasks * inputs.teamSize * 0.7 * 52)

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div className={cn(
      "min-h-screen p-6",
      isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    )}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold">ROI Calculator</h2>
          </div>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            See how much time and money IntegrateWise can save your team
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className={cn(
            "p-6 rounded-xl",
            isDark ? "bg-gray-800" : "bg-gray-50"
          )}>
            <h3 className="font-semibold mb-4">Your Team</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Team Size: <span className="text-blue-500">{inputs.teamSize} people</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={inputs.teamSize}
                  onChange={(e) => setInputs({ ...inputs, teamSize: +e.target.value })}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Average Salary: <span className="text-blue-500">{formatCurrency(inputs.avgSalary)}/year</span>
                </label>
                <input
                  type="range"
                  min="30000"
                  max="200000"
                  step="5000"
                  value={inputs.avgSalary}
                  onChange={(e) => setInputs({ ...inputs, avgSalary: +e.target.value })}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Hours/week on manual tasks: <span className="text-blue-500">{inputs.hoursOnManualTasks} hrs</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={inputs.hoursOnManualTasks}
                  onChange={(e) => setInputs({ ...inputs, hoursOnManualTasks: +e.target.value })}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tools used: <span className="text-blue-500">{inputs.toolsUsed} tools</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={inputs.toolsUsed}
                  onChange={(e) => setInputs({ ...inputs, toolsUsed: +e.target.value })}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className={cn(
              "p-6 rounded-xl border-2 border-green-500",
              isDark ? "bg-gray-800" : "bg-green-50"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-green-600">Annual Savings</span>
              </div>
              <div className="text-4xl font-bold text-green-600">
                {formatCurrency(netSavings)}
              </div>
              <div className={cn(
                "text-sm mt-1",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                {roi}% ROI in the first year
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={cn(
                "p-4 rounded-xl",
                isDark ? "bg-gray-800" : "bg-blue-50"
              )}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Hours Saved</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {hoursSaved.toLocaleString()}
                </div>
                <div className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  per year
                </div>
              </div>

              <div className={cn(
                "p-4 rounded-xl",
                isDark ? "bg-gray-800" : "bg-purple-50"
              )}>
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Current Cost</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(annualManualCost)}
                </div>
                <div className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  wasted annually
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                window.parent.postMessage({ type: "roi-calculated", data: { netSavings, roi, hoursSaved } }, "*")
                window.open("https://app.integratewise.ai/auth/sign-up?source=roi-calculator", "_blank")
              }}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Saving Today →
            </button>

            <p className={cn(
              "text-xs text-center",
              isDark ? "text-gray-500" : "text-gray-400"
            )}>
              Based on 70% automation efficiency from our customer data
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse text-gray-400">Loading calculator...</div>
    </div>
  )
}

export default function EmbedROICalculator() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ROICalculatorContent />
    </Suspense>
  )
}
