"use client"

/**
 * Onboarding Flow — Multi-step wizard for initial workspace setup
 * Ported from Figma Design onboarding-flow.tsx
 * Steps: Identity → Context → Connect → Spine Init
 */

import { useState } from "react"
import {
  CheckCircle2, ChevronRight, Rocket, Database, Zap, Globe,
  Loader2, Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CTXEnum } from "@/types/ctx"

interface OnboardingFlowProps {
  onComplete: (data: {
    userName: string
    role: string
    activeCtx: CTXEnum
    connectedApps: string[]
  }) => void
}

const STEPS = [
  { id: "identity", label: "Identity", icon: Rocket },
  { id: "context", label: "Context", icon: Globe },
  { id: "connect", label: "Connect", icon: Database },
  { id: "spine", label: "Spine", icon: Zap },
]

const CONNECTORS = [
  { id: "salesforce", name: "Salesforce", icon: "☁️" },
  { id: "hubspot", name: "HubSpot", icon: "🎯" },
  { id: "slack", name: "Slack", icon: "💬" },
  { id: "jira", name: "Jira", icon: "🛠️" },
  { id: "stripe", name: "Stripe", icon: "💳" },
  { id: "github", name: "GitHub", icon: "🐙" },
]

const CTX_OPTIONS = [
  { id: CTXEnum.BIZOPS, label: "Business Ops", icon: "🌏" },
  { id: CTXEnum.CS, label: "Customer Success", icon: "💚" },
  { id: CTXEnum.SALES, label: "Sales Ops", icon: "🎯" },
  { id: CTXEnum.MARKETING, label: "Marketing", icon: "📣" },
]

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [userName, setUserName] = useState("")
  const [role, setRole] = useState("Operations Lead")
  const [activeCtx, setActiveCtx] = useState<CTXEnum>(CTXEnum.BIZOPS)
  const [connectedApps, setConnectedApps] = useState<string[]>(["slack"])
  const [isInitializing, setIsInitializing] = useState(false)

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else handleComplete()
  }

  const handleComplete = async () => {
    setIsInitializing(true)
    setTimeout(() => {
      onComplete({ userName: userName || "Arun Kumar", role, activeCtx, connectedApps })
    }, 2000)
  }

  const toggleConnector = (id: string) => {
    setConnectedApps((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 font-sans">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/60 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/50 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-12 px-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                i <= step
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground/30 text-muted-foreground"
              }`}>
                {i < step ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-widest ${
                i <= step ? "text-primary" : "text-muted-foreground"
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[320px]">
          {step === 0 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Welcome to IntegrateWise.</h1>
                <p className="text-muted-foreground">Establish your operational identity to begin Spine normalization.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Full Name</label>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Arun Kumar"
                    className="h-14 text-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Job Role</label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Revenue Operations Manager"
                    className="h-14 text-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Operating Context.</h1>
                <p className="text-muted-foreground">Choose the lens through which you&apos;ll view the unified workspace.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {CTX_OPTIONS.map((ctx) => (
                  <button
                    key={ctx.id}
                    onClick={() => setActiveCtx(ctx.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      activeCtx === ctx.id
                        ? "bg-primary/10 border-primary ring-4 ring-primary/20"
                        : "bg-muted/50 border-border hover:border-muted-foreground/40"
                    }`}
                  >
                    <div className="text-2xl mb-2">{ctx.icon}</div>
                    <div className="font-bold">{ctx.label}</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-1">{ctx.id}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Connect Nodes.</h1>
                <p className="text-muted-foreground">Select the data sources to be ingested into the L3 Normalization Pipeline.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {CONNECTORS.map((conn) => (
                  <button
                    key={conn.id}
                    onClick={() => toggleConnector(conn.id)}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      connectedApps.includes(conn.id)
                        ? "bg-primary border-primary text-primary-foreground shadow-lg"
                        : "bg-muted/40 border-border hover:border-muted-foreground/40"
                    }`}
                  >
                    <span className="text-2xl">{conn.icon}</span>
                    <span className="text-xs font-bold">{conn.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Ignite the Spine.</h1>
                <p className="text-muted-foreground">The L3 8-stage normalization pipeline will now build your Single Source of Truth.</p>
              </div>

              <div className="p-6 rounded-3xl bg-muted/50 border space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold">Canonical Mapping Ready</div>
                      <div className="text-[10px] text-primary font-mono">Normalization_v4.2</div>
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>Provenance Confidence</span>
                    <span>98.4%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[98.4%] rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Identity</div>
                    <div className="text-sm font-medium">{userName || "Arun Kumar"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Active Context</div>
                    <div className="text-sm font-medium">{activeCtx}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className={`text-muted-foreground hover:text-foreground transition-colors font-bold uppercase text-xs tracking-widest ${
              step === 0 ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            Back
          </button>
          <Button
            onClick={handleNext}
            disabled={isInitializing || (step === 0 && !userName)}
            className="h-14 px-8 rounded-2xl font-bold gap-3"
          >
            {isInitializing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Normalizing...
              </>
            ) : (
              <>
                {step === STEPS.length - 1 ? "Complete Setup" : "Next Phase"}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
