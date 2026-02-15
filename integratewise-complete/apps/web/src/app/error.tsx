"use client";

// src/app/error.tsx
// Global error boundary with recovery options

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, MessageCircle, Bug } from "lucide-react";
import { IntegrateWiseLogo } from "@/components/integratewise-logo";
import { GlobalFooter } from "@/components/layouts/global-footer";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log error to monitoring service (e.g., Sentry)
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <IntegrateWiseLogo className="text-white" />
                </div>

                {/* Error Graphic */}
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Something went wrong
                    </h1>
                    <p className="text-slate-400">
                        We encountered an unexpected error. Don&apos;t worry, our team has been notified.
                    </p>
                </div>

                {/* Error Details (Development only) */}
                {process.env.NODE_ENV === "development" && (
                    <div className="mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-left">
                        <p className="text-xs text-slate-500 mb-1">Error Details:</p>
                        <code className="text-xs text-red-400 break-all">
                            {error.message}
                        </code>
                        {error.digest && (
                            <p className="text-xs text-slate-600 mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Recovery Actions */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <button
                        onClick={reset}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>

                {/* Support Options */}
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 mb-8">
                    <p className="text-sm text-slate-300 mb-3">Need help?</p>
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href="/support/contact"
                            className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Contact Support
                        </Link>
                        <Link
                            href="/support/report-bug"
                            className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                        >
                            <Bug className="w-4 h-4" />
                            Report Bug
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                {/* Footer */}
                <div className="border-t border-slate-800">
                    <GlobalFooter variant="minimal" className="bg-transparent py-8" />
                </div>
            </div>
        </div>
    );
}
