"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Zap, Target, Brain, Activity } from "lucide-react"

export interface PersonaProfile {
    name: string
    title: string
    archetype: string
    description: string
    themeColor: string
    accentColor: string
    traits: string[]
}

interface PersonaInsightViewProps {
    userName: string
    aspiration: string
    onComplete: () => void
}

export function PersonaInsightView({ userName, aspiration, onComplete }: PersonaInsightViewProps) {
    const [revealed, setRevealed] = useState(false)

    // Simulated logic to define persona based on aspiration
    const profile: PersonaProfile = {
        name: userName,
        title: "The Catalyst of Innovation",
        archetype: "Visionary Strategist",
        description: `Based on your mission to "${aspiration}", the Think Engine has identified your working style as highly transformative and strategic.`,
        themeColor: "from-emerald-500 to-teal-600",
        accentColor: "bg-emerald-500",
        traits: ["Creative Problem Solver", "Efficiency Architect", "Scalable System Designer"]
    }

    useEffect(() => {
        const timer = setTimeout(() => setRevealed(true), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className={`max-w-2xl mx-auto space-y-12 py-12 transition-all duration-1000 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center space-y-4">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${profile.themeColor} text-white shadow-xl shadow-emerald-200 animate-pulse`}>
                    <Sparkles className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Persona Identified</h2>
                <p className="text-xl text-gray-500 font-medium">Welcome, {profile.name}.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
                {/* Subtle background decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${profile.themeColor} opacity-5 -mr-16 -mt-16 rounded-full`} />

                <div className="relative space-y-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-xs">
                            <Target className="w-4 h-4" /> Mission Profile
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{profile.title}</h3>
                        <p className="text-gray-500 leading-relaxed text-lg italic">
                            "{profile.description}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {profile.traits.map((trait, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <Brain className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-semibold text-gray-700">{trait}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                                <Activity className="w-4 h-4" /> System Synced
                            </div>
                            <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4" /> Theme Applied
                            </div>
                        </div>
                        <Button
                            onClick={onComplete}
                            className={`bg-gradient-to-r ${profile.themeColor} hover:scale-105 transition-transform text-white px-8 h-12 rounded-xl shadow-lg`}
                        >
                            Enter Your Workspace <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <p className="text-center text-sm text-gray-400">
                This persona will adapt as the Think Engine learns from your activity in the Context Plane.
            </p>
        </div>
    )
}
