"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Link2,
    Upload,
    ArrowRight,
    CheckCircle2,
    Loader2,
    ExternalLink,
    Zap,
    Users
} from "lucide-react"

interface SeamlessConnectorViewProps {
    onComplete: (connections: string[]) => void
    onSkip: () => void
}

const tools = [
    {
        id: "stripe",
        name: "Stripe",
        description: "Sync payments, revenue, and subscriptions.",
        icon: Zap,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        id: "hubspot",
        name: "HubSpot",
        description: "Sync contacts, deals, and pipelines.",
        icon: Users,
        color: "text-orange-600",
        bg: "bg-orange-50"
    },
    {
        id: "slack",
        name: "Slack",
        description: "Sync team activity and engine alerts.",
        icon: ExternalLink,
        color: "text-purple-600",
        bg: "bg-purple-50"
    }
]

export function SeamlessConnectorView({ onComplete, onSkip }: SeamlessConnectorViewProps) {
    const [connecting, setConnecting] = useState<string | null>(null)
    const [connected, setConnected] = useState<string[]>([])

    const handleConnect = async (toolId: string) => {
        setConnecting(toolId)

        try {
            const loaderUrl = process.env.NEXT_PUBLIC_LOADER_URL || 'http://localhost:8787';

            // L0 -> L3 Wiring: Register the connector and trigger first sync
            const response = await fetch(`${loaderUrl}/v1/connectors/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool_id: toolId,
                    tenant_id: 'default_tenant', // In production, this comes from auth context
                    config: {
                        sync_mode: 'full_backfill'
                    }
                })
            });

            if (!response.ok) throw new Error('Failed to connect tool');

            setConnected(prev => [...prev, toolId])
        } catch (err) {
            console.error(`L0->L3 Connection Failed: ${err}`);
        } finally {
            setConnecting(null)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Hydrate Your Dashboard</h2>
                <p className="text-gray-500 max-w-lg mx-auto">
                    Connect your tools now to avoid the "Empty Dashboard" problem. Our Loader service will begin extracting data immediately.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {tools.map((tool) => {
                    const isConnected = connected.includes(tool.id)
                    const isConnecting = connecting === tool.id

                    return (
                        <Card key={tool.id} className={`relative overflow-hidden border-2 transition-all ${isConnected ? 'border-green-500 bg-green-50/10' : 'border-gray-100 hover:border-blue-200'}`}>
                            <CardHeader className="p-6">
                                <div className={`w-12 h-12 ${tool.bg} ${tool.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <tool.icon className="w-6 h-6" />
                                </div>
                                <CardTitle className="flex items-center gap-2">
                                    {tool.name}
                                    {isConnected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </CardTitle>
                                <CardDescription className="min-h-[40px]">{tool.description}</CardDescription>

                                <Button
                                    variant={isConnected ? "secondary" : "default"}
                                    className="w-full mt-4"
                                    disabled={isConnected || isConnecting}
                                    onClick={() => handleConnect(tool.id)}
                                >
                                    {isConnecting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : isConnected ? (
                                        "Connected"
                                    ) : (
                                        <>
                                            <Link2 className="w-4 h-4 mr-2" />
                                            Connect {tool.name}
                                        </>
                                    )}
                                </Button>
                            </CardHeader>
                        </Card>
                    )
                })}
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-300 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">Manual Data Dump</h4>
                    <p className="text-sm text-gray-500">Don't have these tools? Upload your raw JSON/CSV data files directly.</p>
                </div>
                <Button variant="outline" className="bg-white">
                    Selective File Upload
                </Button>
            </div>

            <div className="flex items-center justify-between pt-6">
                <Button variant="ghost" onClick={onSkip} className="text-gray-400 hover:text-gray-600">
                    Skip for now (Manual Setup later)
                </Button>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                    onClick={() => onComplete(connected)}
                    disabled={connected.length === 0 && connecting !== null}
                >
                    Proceed to Deep Scan <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
