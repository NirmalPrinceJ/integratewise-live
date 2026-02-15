"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, User, Target } from "lucide-react"

interface IdentityConnectViewProps {
    onComplete: (data: { name: string; aspiration: string }) => void
}

export function IdentityConnectView({ onComplete }: IdentityConnectViewProps) {
    const [name, setName] = useState("")
    const [aspiration, setAspiration] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name && aspiration) {
            onComplete({ name, aspiration })
        }
    }

    return (
        <div className="max-w-md mx-auto space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
                    <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Personalized Connect</h2>
                <p className="text-gray-500">
                    Sync your identity with the IntegrateWise engine to personalize your workspace.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" /> What should we call you?
                    </label>
                    <Input
                        placeholder="e.g. Alex"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 border-gray-200 focus:border-blue-500 rounded-xl"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-400" /> What is your primary mission today?
                    </label>
                    <Input
                        placeholder="e.g. Scaling operations, designing the future..."
                        value={aspiration}
                        onChange={(e) => setAspiration(e.target.value)}
                        className="h-12 border-gray-200 focus:border-blue-500 rounded-xl"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                    disabled={!name || !aspiration}
                >
                    Initialize Sync
                </Button>
            </form>

            <p className="text-center text-xs text-gray-400">
                Your aspiration helps the Think Engine define your working persona.
            </p>
        </div>
    )
}
