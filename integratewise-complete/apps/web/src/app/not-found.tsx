"use client";

// src/app/not-found.tsx
// Custom 404 Not Found page with support links

import Link from "next/link";
import { Home, ArrowLeft, HelpCircle, MessageCircle, Search } from "lucide-react";
import { IntegrateWiseLogo } from "@/components/integratewise-logo";
import { GlobalFooter } from "@/components/layouts/global-footer";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <IntegrateWiseLogo className="text-white" />
                </div>

                {/* 404 Graphic */}
                <div className="mb-8">
                    <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                        404
                    </h1>
                    <p className="text-xl text-slate-300 mt-4">Page not found</p>
                    <p className="text-slate-500 mt-2">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search for what you need..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Support Links */}
                <div className="flex items-center justify-center gap-6 text-sm">
                    <Link
                        href="/support"
                        className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                    >
                        <HelpCircle className="w-4 h-4" />
                        Help Center
                    </Link>
                    <Link
                        href="/support/contact"
                        className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Contact Support
                    </Link>
                </div>

                {/* Footer */}
                {/* Footer */}
                <div className="mt-12 border-t border-slate-800">
                    <GlobalFooter variant="minimal" className="bg-transparent py-8" />
                </div>
            </div>
        </div>
    );
}
