"use client";

// src/app/support/page.tsx
// Help Center / Support Hub

import { useState } from "react";
import Link from "next/link";
import {
    HelpCircle,
    MessageCircle,
    Book,
    FileQuestion,
    Search,
    ChevronRight,
    Mail,
    Phone,
    ExternalLink,
    Zap,
    Shield,
    Users,
    Settings,
    Database,
    Brain,
} from "lucide-react";
import { IntegrateWiseLogo } from "@/components/integratewise-logo";
import { GlobalFooter } from "@/components/layouts/global-footer";

const HELP_CATEGORIES = [
    {
        id: "getting-started",
        title: "Getting Started",
        icon: Zap,
        description: "New to IntegrateWise? Start here.",
        articles: [
            "Quick start guide",
            "Setting up your first integration",
            "Understanding the Spine",
            "Navigating the dashboard",
        ],
    },
    {
        id: "integrations",
        title: "Integrations",
        icon: Database,
        description: "Connect your tools and data sources.",
        articles: [
            "Supported integrations",
            "OAuth setup guide",
            "Webhook configuration",
            "API authentication",
        ],
    },
    {
        id: "intelligence",
        title: "IQ Hub & AI",
        icon: Brain,
        description: "Leverage AI-powered insights.",
        articles: [
            "How IQ Hub works",
            "Training your digital twin",
            "Understanding signals",
            "Evidence and provenance",
        ],
    },
    {
        id: "team",
        title: "Team & Collaboration",
        icon: Users,
        description: "Work together effectively.",
        articles: [
            "Inviting team members",
            "Roles and permissions",
            "Sharing dashboards",
            "Team notifications",
        ],
    },
    {
        id: "security",
        title: "Security & Privacy",
        icon: Shield,
        description: "Keep your data safe.",
        articles: [
            "Data encryption",
            "SSO setup",
            "Audit trail",
            "GDPR compliance",
        ],
    },
    {
        id: "settings",
        title: "Account & Billing",
        icon: Settings,
        description: "Manage your account.",
        articles: [
            "Billing & invoices",
            "Upgrading your plan",
            "Account settings",
            "Cancel subscription",
        ],
    },
];

const FAQ_ITEMS = [
    {
        question: "How do I connect my first data source?",
        answer: "Navigate to Settings > Integrations and click 'Add Integration'. Follow the OAuth prompts to securely connect your tools.",
    },
    {
        question: "What is the Spine?",
        answer: "The Spine is your single source of truth - structured data from all connected tools, normalized and unified for analysis.",
    },
    {
        question: "How does the Cognitive Layer work?",
        answer: "The Cognitive Layer (press E) is your L2 intelligence surface - providing Evidence, Signals, Knowledge, Memory, and Actions. Every AI insight comes with full provenance, and you can explore the reasoning behind any recommendation.",
    },
    {
        question: "Can I export my data?",
        answer: "Yes! Go to Settings > Data Export to download your data in various formats including CSV, JSON, and PDF reports.",
    },
];

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/">
                        <IntegrateWiseLogo variant="horizontal" size="md" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/support/contact"
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Contact Us
                        </Link>
                        <Link
                            href="/"
                            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Back to App
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-indigo-600 to-purple-700 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <HelpCircle className="w-12 h-12 text-white/80 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-white mb-4">
                        How can we help you?
                    </h1>
                    <p className="text-lg text-white/80 mb-8">
                        Search our knowledge base or browse categories below
                    </p>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for help articles..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                        />
                    </div>
                </div>
            </section>

            {/* Help Categories */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">
                    Browse by category
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {HELP_CATEGORIES.map((category) => (
                        <div
                            key={category.id}
                            className="p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                    <category.icon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 mb-1">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-3">
                                        {category.description}
                                    </p>
                                    <ul className="space-y-1">
                                        {category.articles.slice(0, 3).map((article, i) => (
                                            <li key={i}>
                                                <a
                                                    href="#"
                                                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                                >
                                                    <ChevronRight className="w-3 h-3" />
                                                    {article}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-slate-50 py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {FAQ_ITEMS.map((item, index) => (
                            <details
                                key={index}
                                className="group bg-white rounded-xl border border-slate-200 overflow-hidden"
                            >
                                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50">
                                    <span className="font-medium text-slate-900">
                                        {item.question}
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-slate-400 transform group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-4 pb-4 text-slate-600">
                                    {item.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Options */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                    Still need help?
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Link
                        href="/support/contact"
                        className="p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all text-center group"
                    >
                        <MessageCircle className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-slate-900 mb-2">Live Chat</h3>
                        <p className="text-sm text-slate-500">
                            Chat with our support team in real-time
                        </p>
                    </Link>
                    <a
                        href="mailto:support@integratewise.com"
                        className="p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all text-center group"
                    >
                        <Mail className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-slate-900 mb-2">Email Support</h3>
                        <p className="text-sm text-slate-500">
                            support@integratewise.com
                        </p>
                    </a>
                    <a
                        href="https://docs.integratewise.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all text-center group"
                    >
                        <Book className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-slate-900 mb-2 flex items-center justify-center gap-1">
                            Documentation
                            <ExternalLink className="w-3 h-3" />
                        </h3>
                        <p className="text-sm text-slate-500">
                            Browse our full documentation
                        </p>
                    </a>
                </div>
            </section>

            {/* Footer */}
            {/* Footer */}
            <GlobalFooter />
        </div>
    );
}
