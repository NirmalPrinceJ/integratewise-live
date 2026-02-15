"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Check, Palette } from "lucide-react"

interface ThemePreviewViewProps {
    userName: string
    onComplete: () => void
}

const themeOptions = [
    { id: "default", name: "Brand Default", color: "bg-blue-600", description: "Clean, professional workspace" },
    { id: "emerald", name: "Forest Focus", color: "bg-emerald-600", description: "Calm, clarity-driven feel" },
    { id: "violet", name: "Creative Energy", color: "bg-violet-600", description: "Vibrant, high-energy mood" },
    { id: "amber", name: "Warm Productivity", color: "bg-amber-600", description: "Focused, friendly vibe" },
]

export function ThemePreviewView({ userName, onComplete }: ThemePreviewViewProps) {
    const [selectedTheme, setSelectedTheme] = useState("default")

    return (
        <div className="max-w-2xl mx-auto space-y-10 py-12">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
                    <Palette className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                    How would you like your dashboard to feel?
                </h2>
                <p className="text-gray-500 text-lg">
                    Pick a look that suits you—or skip this. You can always change it later in Settings.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {themeOptions.map((theme) => {
                    const isSelected = selectedTheme === theme.id
                    return (
                        <button
                            key={theme.id}
                            onClick={() => setSelectedTheme(theme.id)}
                            className={`relative p-6 rounded-2xl border-2 text-left transition-all ${isSelected
                                    ? "border-blue-600 bg-blue-50/50 shadow-lg"
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}
                            <div className={`w-10 h-10 ${theme.color} rounded-xl mb-4`} />
                            <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{theme.description}</p>
                        </button>
                    )
                })}
            </div>

            <div className="flex flex-col items-center gap-4">
                <Button
                    onClick={onComplete}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-12 rounded-xl shadow-lg shadow-blue-200"
                >
                    Continue to Your Workspace <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <button onClick={onComplete} className="text-sm text-gray-400 hover:text-gray-600 underline">
                    Skip for now
                </button>
            </div>

            <p className="text-center text-xs text-gray-400">
                This is just a preview. You can customize your workspace anytime from Settings.
            </p>
        </div>
    )
}
