
"use client"

import { X, FileText, HardDrive, Mail, Activity, Lightbulb, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface EvidenceRef {
    type: 'spine' | 'context' | 'knowledge'
    title: string
    source: string
    date: string
    link?: string
    confidence?: number
}

interface EvidenceDrawerProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    evidence: EvidenceRef[]
}

export function EvidenceDrawer({ isOpen, onClose, title, description, evidence }: EvidenceDrawerProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            // Prevent body scroll
            document.body.style.overflow = 'hidden'
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300)
            document.body.style.overflow = 'unset'
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    if (!isVisible && !isOpen) return null

    return (
        <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <div>
                        <h3 className="font-semibold text-gray-900">Evidence & Logic</h3>
                        <p className="text-xs text-gray-500">Traceability for engine decisions</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <h4 className="font-medium text-blue-900 text-sm mb-1">{title}</h4>
                        {description && <p className="text-xs text-blue-700">{description}</p>}
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Supporting Evidence</h4>
                        <div className="space-y-3">
                            {evidence.map((item, i) => (
                                <div key={i} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group">
                                    <div className={`mt-0.5 p-1.5 rounded-md self-start ${item.type === 'spine' ? 'bg-purple-100 text-purple-600' :
                                            item.type === 'context' ? 'bg-orange-100 text-orange-600' :
                                                'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {item.type === 'spine' && <Activity className="w-4 h-4" />}
                                        {item.type === 'context' && <FileText className="w-4 h-4" />}
                                        {item.type === 'knowledge' && <Lightbulb className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                            <span>{item.source}</span>
                                            <span>•</span>
                                            <span>{item.date}</span>
                                        </div>
                                    </div>
                                    {item.link && (
                                        <Link href={item.link} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Close Panel
                    </button>
                </div>
            </div>
        </div>
    )
}
