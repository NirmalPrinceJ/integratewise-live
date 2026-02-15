"use client"

import { useState } from "react"
import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { Key, Plus, RefreshCw, MoreVertical, Copy, Check, Trash2, AlertCircle } from "lucide-react"
import { useAdminApiKeys, ApiKey } from "@/hooks/useAdminApiKeys"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"

export default function ApiKeysPage() {
    const { keys, loading, error, refresh, createKey, revokeKey } = useAdminApiKeys()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newKeyName, setNewKeyName] = useState("")
    const [createdKey, setCreatedKey] = useState<ApiKey | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCreate = async () => {
        if (!newKeyName) return
        setIsCreating(true)
        try {
            const key = await createKey(newKeyName)
            setCreatedKey(key)
            toast.success("API Key generated")
        } catch (err) {
            toast.error("Failed to generate API Key")
        } finally {
            setIsCreating(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success("Copied to clipboard")
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
                    Failed to load API keys.
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <PageHeader
                title="API Keys"
                description="Manage secure access keys for integrations"
                stageId="APIKEYS-042"
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => refresh()}>
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>

                        <Dialog open={isCreateOpen} onOpenChange={(open) => {
                            setIsCreateOpen(open)
                            if (!open) {
                                setCreatedKey(null)
                                setNewKeyName("")
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Key
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{createdKey ? "Key Generated" : "Create API Key"}</DialogTitle>
                                    <DialogDescription>
                                        {createdKey
                                            ? "Copy your key now. You won't be able to see it again."
                                            : "Give your key a name to identify its purpose."}
                                    </DialogDescription>
                                </DialogHeader>

                                {createdKey ? (
                                    <div className="space-y-4 py-4">
                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-amber-800 text-sm">
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <p>For security, we only show this key once. If you lose it, you'll need to create a new one.</p>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                readOnly
                                                value={createdKey.value}
                                                className="pr-10 font-mono text-sm bg-gray-50"
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="absolute right-0 top-0 h-full"
                                                onClick={() => copyToClipboard(createdKey.value!)}
                                            >
                                                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="key-name">Key Name</Label>
                                            <Input
                                                id="key-name"
                                                placeholder="e.g., Salesforce Integration"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                        {createdKey ? "Done" : "Cancel"}
                                    </Button>
                                    {!createdKey && (
                                        <Button
                                            className="bg-[#2D7A3E] hover:bg-[#236B31]"
                                            onClick={handleCreate}
                                            disabled={isCreating || !newKeyName}
                                        >
                                            {isCreating ? "Generating..." : "Generate Key"}
                                        </Button>
                                    )}
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                }
            />

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Key Prefix</th>
                            <th className="p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Used</th>
                            <th className="p-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading && keys.length === 0 ? (
                            [...Array(3)].map((_, i) => (
                                <tr key={i}>
                                    <td className="p-4" colSpan={5}><Skeleton className="h-10 w-full" /></td>
                                </tr>
                            ))
                        ) : (
                            keys.map((k: ApiKey) => (
                                <tr key={k.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <Key className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <span className="font-medium text-gray-900">{k.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-xs text-gray-500">{k.prefix}</td>
                                    <td className="p-4">
                                        <Badge
                                            variant="outline"
                                            className={`capitalize ${k.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    'bg-red-50 text-red-700 border-red-200'
                                                }`}
                                        >
                                            {k.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {k.lastUsed ? new Date(k.lastUsed).toLocaleString() : 'Never'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600">
                                            <Trash2 className="w-4 h-4" onClick={() => revokeKey(k.id)} />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {keys.length === 0 && !loading && (
                    <div className="p-12 text-center text-gray-500">
                        No API keys found.
                    </div>
                )}
            </div>
        </div>
    )
}
