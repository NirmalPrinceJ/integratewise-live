"use client"

import { useEffect, useState } from "react"
import { Loader2, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProcessingViewProps {
  onComplete: () => void
}

const steps = [
  "Initializing Creamy Layer ingest...",
  "Authenticating secure data pipelines...",
  "Extracting raw records from connected tools...",
  "Normalizing entities to Spine (SSOT)...",
  "Building Context Plane relationships...",
  "Synthesizing persona-driven insights...",
  "Priming your personalized cockpit...",
]

export function ProcessingView({ onComplete }: ProcessingViewProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // L0 -> L3 Wiring: Trigger the real 8-Stage Pipeline (Deep Scan)
    const triggerHydration = async () => {
      try {
        const loaderUrl = process.env.NEXT_PUBLIC_LOADER_URL || 'http://localhost:8787';
        await fetch(`${loaderUrl}/v1/loader/ingest`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'deep_scan',
            tenant_id: 'default_tenant',
            priority: 'high'
          })
        });
      } catch (err) {
        console.error(`L0->L3 Hydration Trigger Failed: ${err}`);
      }
    };

    triggerHydration();

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 1500)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          clearInterval(stepInterval)
          setTimeout(onComplete, 800)
          return 100
        }
        return prev + 1
      })
    }, 80)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-20 max-w-xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse" />
        <Loader2 className="h-20 w-20 animate-spin text-blue-600 relative z-10" />
      </div>

      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Deep Scan in Progress</h2>
        <p className="text-lg text-blue-600 font-medium animate-pulse">{steps[currentStep]}</p>
      </div>

      <div className="w-full space-y-3">
        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span>System Hydration</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-100" />
      </div>

      <div className="w-full grid grid-cols-1 gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
        {steps.map((step, i) => {
          const isDone = i < currentStep
          const isCurrent = i === currentStep

          if (!isDone && !isCurrent) return null

          return (
            <div key={i} className={`flex items-center gap-3 text-sm font-medium transition-all duration-500 ${isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
              {isDone ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              )}
              <span>{step}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
