"use client";

// src/app/support/contact/page.tsx
// Contact Support Page with Chat Widget

import { useState } from "react";
import Link from "next/link";
import {
    MessageCircle,
    Mail,
    Phone,
    Clock,
    Send,
    ArrowLeft,
    CheckCircle,
} from "lucide-react";
import { IntegrateWiseLogo } from "@/components/integratewise-logo";

export default function ContactSupportPage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        priority: "normal",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
                <div className="max-w-md text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        Message Sent!
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Thank you for reaching out. Our support team will get back to you
                        within 24 hours.
                    </p>
                    <p className="text-sm text-slate-500 mb-8">
                        Ticket reference: <code className="bg-slate-100 px-2 py-1 rounded">
                            IW-{Date.now().toString(36).toUpperCase()}
                        </code>
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/support"
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Back to Help Center
                        </Link>
                        <Link
                            href="/"
                            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/">
                        <IntegrateWiseLogo variant="horizontal" size="md" />
                    </Link>
                    <Link
                        href="/support"
                        className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Help Center
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">
                        Contact Support
                    </h1>
                    <p className="text-slate-600 max-w-xl mx-auto">
                        We&apos;re here to help. Choose how you&apos;d like to reach us.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Options */}
                    <div className="space-y-6">
                        <h2 className="font-semibold text-slate-900">Contact Options</h2>

                        {/* Live Chat */}
                        <button
                            onClick={() => setChatOpen(true)}
                            className="w-full p-4 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors text-left group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900 group-hover:text-indigo-600">
                                        Live Chat
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Chat with us now
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-xs text-green-600 font-medium">
                                            Online now
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Email */}
                        <a
                            href="mailto:support@integratewise.com"
                            className="block w-full p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">Email</h3>
                                    <p className="text-sm text-indigo-600">
                                        support@integratewise.com
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs text-slate-500">
                                            Response within 24 hours
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>

                        {/* Phone */}
                        <a
                            href="tel:+1-888-555-1234"
                            className="block w-full p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">Phone</h3>
                                    <p className="text-sm text-indigo-600">+1 (888) 555-1234</p>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs text-slate-500">
                                            Mon–Fri, 9AM–6PM EST
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
                        >
                            <h2 className="font-semibold text-slate-900 mb-6">
                                Send us a message
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formState.name}
                                        onChange={(e) =>
                                            setFormState({ ...formState, name: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formState.email}
                                        onChange={(e) =>
                                            setFormState({ ...formState, email: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="you@company.com"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formState.subject}
                                        onChange={(e) =>
                                            setFormState({ ...formState, subject: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Priority
                                    </label>
                                    <select
                                        value={formState.priority}
                                        onChange={(e) =>
                                            setFormState({ ...formState, priority: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="low">Low - General inquiry</option>
                                        <option value="normal">Normal - Need assistance</option>
                                        <option value="high">High - Blocking issue</option>
                                        <option value="urgent">Urgent - System down</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formState.message}
                                    onChange={(e) =>
                                        setFormState({ ...formState, message: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    placeholder="Describe your issue or question in detail..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Floating Chat Widget */}
            {chatOpen && (
                <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50">
                    {/* Chat Header */}
                    <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-medium">IntegrateWise Support</h3>
                                <p className="text-xs text-white/70">Online now</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setChatOpen(false)}
                            className="text-white/70 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 space-y-3 overflow-auto">
                        <div className="flex gap-2">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs">🤖</span>
                            </div>
                            <div className="bg-slate-100 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                                <p className="text-sm text-slate-700">
                                    Hi there! 👋 I&apos;m your IntegrateWise assistant. How can I
                                    help you today?
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-slate-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Trigger Button (when closed) */}
            {!chatOpen && (
                <button
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-4 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center z-50"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-8 mt-16">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} IntegrateWise. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
