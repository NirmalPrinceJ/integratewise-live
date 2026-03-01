"use client";

// src/components/support/help-widget.tsx
// Floating Help Widget for in-app support access

import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/components/auth/auth-provider";
import {
    HelpCircle,
    MessageCircle,
    Book,
    Mail,
    X,
    ChevronRight,
    Search,
    Keyboard,
    ExternalLink,
    Send,
    Loader2,
} from "lucide-react";

interface HelpWidgetProps {
    position?: "bottom-right" | "bottom-left";
}

const QUICK_HELP = [
    { label: "Getting Started Guide", href: "/support#getting-started", icon: Book },
    { label: "Keyboard Shortcuts", action: "shortcuts", icon: Keyboard },
    { label: "Submit Support Ticket", action: "ticket", icon: Mail },
    { label: "Documentation", href: "https://docs.integratewise.com", external: true, icon: ExternalLink },
];

export function HelpWidget({ position = "bottom-right" }: HelpWidgetProps) {
    const auth = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [ticketForm, setTicketForm] = useState({ email: "", subject: "", description: "", category: "general" });
    const [ticketSubmitting, setTicketSubmitting] = useState(false);
    const [ticketError, setTicketError] = useState("");

    const positionClasses = {
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
    };

    const SHORTCUTS = [
        { keys: ["⌘", "K"], description: "Open command palette" },
        { keys: ["E"], description: "Toggle evidence panel" },
        { keys: ["⌘", "/"], description: "Open help" },
        { keys: ["⌘", "."], description: "Toggle sidebar" },
        { keys: ["Esc"], description: "Close panel/modal" },
        { keys: ["⌘", "Shift", "P"], description: "Quick actions" },
    ];

    const handleItemClick = (item: typeof QUICK_HELP[0]) => {
        if (item.action === "shortcuts") {
            setShowShortcuts(true);
        } else if (item.action === "ticket") {
            setShowTicketForm(true);
        } else if (item.external) {
            window.open(item.href, "_blank");
            setIsOpen(false);
        }
    };

    const handleSubmitTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setTicketSubmitting(true);
        setTicketError("");

        if (!ticketForm.email || !ticketForm.subject || !ticketForm.description) {
            setTicketError("Please fill in all required fields");
            setTicketSubmitting(false);
            return;
        }

        try {
            const API_BASE = process.env.REACT_APP_API_BASE || "https://gateway.integratewise.ai";

            // Get tenant ID from auth context
            const tenantId = auth.user?.user_metadata?.tenant_id
                || auth.user?.app_metadata?.tenant_id
                || "default";

            const res = await fetch(`${API_BASE}/api/v1/support/ticket`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken || ""}`,
                    "x-tenant-id": tenantId,
                },
                body: JSON.stringify(ticketForm),
            });

            const data = await res.json();
            if (data.success) {
                setTicketForm({ email: "", subject: "", description: "", category: "general" });
                setShowTicketForm(false);
                alert("Support ticket created successfully! Ticket ID: " + data.ticket_id);
            } else {
                setTicketError(data.error || "Failed to create ticket");
            }
        } catch (err) {
            setTicketError("Network error. Please try again.");
        } finally {
            setTicketSubmitting(false);
        }
    };

    return (
        <div className={`fixed ${positionClasses[position]} z-40`}>
            {/* Help Panel */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden mb-2">
                    {/* Header */}
                    <div className="bg-indigo-600 text-white p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Need Help?</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/70 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-white/80 mt-1">
                            We&apos;re here to assist you
                        </p>
                    </div>

                    {/* Search */}
                    <div className="p-3 border-b border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search help articles..."
                                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Content Sections */}
                    {!showShortcuts && !showTicketForm ? (
                        <div className="p-2">
                            {QUICK_HELP.map((item, index) => (
                                item.action ? (
                                    <button
                                        key={index}
                                        onClick={() => handleItemClick(item)}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        <item.icon className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-700 flex-1">{item.label}</span>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </button>
                                ) : (
                                    <Link
                                        key={index}
                                        to={item.href || "#"}
                                        onClick={() => !item.action && setIsOpen(false)}
                                        target={item.external ? "_blank" : undefined}
                                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        <item.icon className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-700 flex-1">{item.label}</span>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </Link>
                                )
                            ))}
                        </div>
                    ) : showShortcuts ? (
                        <div className="p-3">
                            <button
                                onClick={() => setShowShortcuts(false)}
                                className="flex items-center gap-1 text-xs text-indigo-600 mb-3 hover:text-indigo-700"
                            >
                                ← Back
                            </button>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                Keyboard Shortcuts
                            </h4>
                            <div className="space-y-2">
                                {SHORTCUTS.map((shortcut, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-1.5"
                                    >
                                        <span className="text-sm text-slate-600">
                                            {shortcut.description}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, i) => (
                                                <kbd
                                                    key={i}
                                                    className="px-1.5 py-0.5 text-xs font-medium bg-slate-100 border border-slate-200 rounded"
                                                >
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-3">
                            <button
                                onClick={() => setShowTicketForm(false)}
                                className="flex items-center gap-1 text-xs text-indigo-600 mb-3 hover:text-indigo-700"
                            >
                                ← Back
                            </button>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">
                                Submit Support Ticket
                            </h4>
                            <form onSubmit={handleSubmitTicket} className="space-y-2.5">
                                <div>
                                    <label className="text-xs font-medium text-slate-600 mb-1 block">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={ticketForm.email}
                                        onChange={e => setTicketForm(f => ({...f, email: e.target.value}))}
                                        placeholder="your@email.com"
                                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600 mb-1 block">Subject *</label>
                                    <input
                                        type="text"
                                        required
                                        value={ticketForm.subject}
                                        onChange={e => setTicketForm(f => ({...f, subject: e.target.value}))}
                                        placeholder="Brief subject"
                                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600 mb-1 block">Category</label>
                                    <select
                                        value={ticketForm.category}
                                        onChange={e => setTicketForm(f => ({...f, category: e.target.value}))}
                                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="general">General</option>
                                        <option value="bug">Bug Report</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="billing">Billing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600 mb-1 block">Description *</label>
                                    <textarea
                                        required
                                        value={ticketForm.description}
                                        onChange={e => setTicketForm(f => ({...f, description: e.target.value}))}
                                        placeholder="Describe your issue..."
                                        rows={3}
                                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                                    />
                                </div>
                                {ticketError && <p className="text-xs text-red-600 bg-red-50 p-1.5 rounded">{ticketError}</p>}
                                <button
                                    type="submit"
                                    disabled={ticketSubmitting}
                                    className="w-full px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-1"
                                >
                                    {ticketSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                    {ticketSubmitting ? "Submitting..." : "Submit"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Chat CTA */}
                    <div className="p-3 border-t border-slate-100 bg-slate-50">
                        <Link
                            to="/support/contact"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chat with Support
                        </Link>
                    </div>
                </div>
            )}

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${isOpen
                        ? "bg-slate-700 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                aria-label={isOpen ? "Close help" : "Open help"}
            >
                {isOpen ? (
                    <X className="w-5 h-5" />
                ) : (
                    <HelpCircle className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}
