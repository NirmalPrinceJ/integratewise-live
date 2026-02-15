// src/app/legal/privacy/page.tsx
// Privacy Policy Page

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IntegrateWiseLogo } from "@/components/integratewise-logo";
import { GlobalFooter } from "@/components/layouts/global-footer";

export const metadata = {
    title: "Privacy Policy | IntegrateWise",
    description: "IntegrateWise Privacy Policy - How we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
    const lastUpdated = "February 1, 2026";

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/">
                        <IntegrateWiseLogo variant="horizontal" size="md" />
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to App
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-500">Last updated: {lastUpdated}</p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            1. Introduction
                        </h2>
                        <p className="text-slate-600 mb-4">
                            IntegrateWise, Inc. (&quot;IntegrateWise,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your
                            privacy and is committed to protecting your personal data. This privacy
                            policy explains how we collect, use, disclose, and safeguard your
                            information when you use our platform and services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            2. Information We Collect
                        </h2>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">
                            2.1 Information You Provide
                        </h3>
                        <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                            <li>Account information (name, email, company)</li>
                            <li>Profile information and preferences</li>
                            <li>Payment and billing information</li>
                            <li>Communications with our support team</li>
                            <li>Content you create within the platform</li>
                        </ul>

                        <h3 className="text-lg font-medium text-slate-800 mb-2">
                            2.2 Information Collected Automatically
                        </h3>
                        <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                            <li>Device and browser information</li>
                            <li>IP address and location data</li>
                            <li>Usage patterns and analytics</li>
                            <li>Cookies and similar technologies</li>
                        </ul>

                        <h3 className="text-lg font-medium text-slate-800 mb-2">
                            2.3 Integration Data
                        </h3>
                        <p className="text-slate-600 mb-4">
                            When you connect third-party services to IntegrateWise (e.g., Salesforce,
                            HubSpot, Google Workspace), we access and process data from these services
                            according to the permissions you grant. This data is used solely to
                            provide our services and is handled in accordance with this policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            3. How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                            <li>Provide and maintain our services</li>
                            <li>Process transactions and send related information</li>
                            <li>Send administrative messages and updates</li>
                            <li>Respond to your inquiries and provide support</li>
                            <li>Improve and personalize our services</li>
                            <li>Detect and prevent fraud or abuse</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            4. Data Security
                        </h2>
                        <p className="text-slate-600 mb-4">
                            We implement industry-standard security measures to protect your data,
                            including:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                            <li>Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
                            <li>Regular security audits and penetration testing</li>
                            <li>SOC 2 Type II compliance</li>
                            <li>Access controls and authentication</li>
                            <li>Employee security training</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            5. Your Rights
                        </h2>
                        <p className="text-slate-600 mb-4">
                            Depending on your location, you may have the following rights:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Delete your data</li>
                            <li>Export your data (data portability)</li>
                            <li>Opt out of marketing communications</li>
                            <li>Object to processing</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            6. Contact Us
                        </h2>
                        <p className="text-slate-600 mb-4">
                            If you have questions about this Privacy Policy, please contact us:
                        </p>
                        <ul className="list-none text-slate-600 space-y-1">
                            <li>Email: privacy@integratewise.com</li>
                            <li>Address: 123 Innovation Drive, San Francisco, CA 94105</li>
                        </ul>
                    </section>
                </div>

                {/* Related Links */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                    <h3 className="font-medium text-slate-900 mb-4">Related Policies</h3>
                    <div className="flex gap-4">
                        <Link
                            href="/legal/terms"
                            className="text-indigo-600 hover:text-indigo-700"
                        >
                            Terms of Service →
                        </Link>
                        <Link
                            href="/legal/cookies"
                            className="text-indigo-600 hover:text-indigo-700"
                        >
                            Cookie Policy →
                        </Link>
                    </div>
                </div>
            </main>

            <GlobalFooter variant="compact" />
        </div>
    );
}
