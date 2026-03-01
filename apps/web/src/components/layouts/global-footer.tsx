"use client";

// src/components/layouts/global-footer.tsx
// Global Footer Component with copyright and navigation

import { Link } from "react-router";
import { IntegrateWiseLogo } from "@/components/integratewise-logo";
import {
    Twitter,
    Linkedin,
    Github,
    Mail,
    ExternalLink,
} from "lucide-react";

const FOOTER_LINKS = {
    product: [
        { label: "Features", href: "/features" },
        { label: "Integrations", href: "/integrations" },
        { label: "Pricing", href: "/pricing" },
        { label: "Documentation", href: "https://docs.integratewise.com", external: true },
        { label: "API Reference", href: "https://api.integratewise.com", external: true },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Press Kit", href: "/press" },
        { label: "Contact", href: "/support/contact" },
    ],
    resources: [
        { label: "Help Center", href: "/support" },
        { label: "Community", href: "https://community.integratewise.com", external: true },
        { label: "Status", href: "https://status.integratewise.com", external: true },
        { label: "Security", href: "/security" },
        { label: "Changelog", href: "/changelog" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/legal/privacy" },
        { label: "Terms of Service", href: "/legal/terms" },
        { label: "Cookie Policy", href: "/legal/cookies" },
        { label: "GDPR", href: "/legal/gdpr" },
        { label: "DPA", href: "/legal/dpa" },
    ],
};

const SOCIAL_LINKS = [
    { label: "Twitter", icon: Twitter, href: "https://twitter.com/integratewise" },
    { label: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/integratewise" },
    { label: "GitHub", icon: Github, href: "https://github.com/integratewise" },
];

interface GlobalFooterProps {
    variant?: "full" | "compact" | "minimal";
    className?: string;
}

export function GlobalFooter({ variant = "full", className = "" }: GlobalFooterProps) {
    const currentYear = new Date().getFullYear();

    // Minimal footer - just copyright
    if (variant === "minimal") {
        return (
            <footer className={`bg-slate-900 text-white py-6 ${className}`}>
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-sm text-slate-400">
                        © {currentYear} IntegrateWise, Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        );
    }

    // Compact footer - logo, basic links, copyright
    if (variant === "compact") {
        return (
            <footer className={`bg-slate-900 text-white py-8 ${className}`}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <IntegrateWiseLogo variant="icon" />
                            <span className="font-semibold text-white">IntegrateWise</span>
                        </Link>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <Link to="/legal/privacy" className="hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link to="/legal/terms" className="hover:text-white transition-colors">
                                Terms
                            </Link>
                            <Link to="/support" className="hover:text-white transition-colors">
                                Support
                            </Link>
                            <Link to="/support/contact" className="hover:text-white transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-800 text-center text-sm text-slate-500">
                        © {currentYear} IntegrateWise, Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        );
    }

    // Full footer - all sections
    return (
        <footer className={`bg-slate-900 text-white ${className}`}>
            {/* Main Footer Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <IntegrateWiseLogo variant="icon" />
                        </Link>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                            Your business command center. Single source of truth for all your operations.
                        </p>
                        <div className="flex items-center gap-3">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.product.map((link) => (
                                <li key={link.label}>
                                    {link.external ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                                        >
                                            {link.label}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <Link
                                            to={link.href}
                                            className="text-sm text-slate-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.resources.map((link) => (
                                <li key={link.label}>
                                    {link.external ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                                        >
                                            {link.label}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <Link
                                            to={link.href}
                                            className="text-sm text-slate-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-500">
                            © {currentYear} IntegrateWise, Inc. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                All systems operational
                            </span>
                            <a
                                href="mailto:hello@integratewise.com"
                                className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                            >
                                <Mail className="w-3 h-3" />
                                hello@integratewise.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
