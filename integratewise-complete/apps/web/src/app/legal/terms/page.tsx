// src/app/legal/terms/page.tsx
// Terms of Service Page

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IntegrateWiseLogo } from "@/components/integratewise-logo";
import { GlobalFooter } from "@/components/layouts/global-footer";

export const metadata = {
    title: "Terms of Service | IntegrateWise",
    description: "IntegrateWise Terms of Service - Terms and conditions for using our platform.",
};

export default function TermsOfServicePage() {
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
                        Terms of Service
                    </h1>
                    <p className="text-slate-500">Last updated: {lastUpdated}</p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-slate-600 mb-4">
                            By accessing or using IntegrateWise (&quot;the Service&quot;), you agree to be
                            bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these
                            Terms, you may not access or use the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            2. Description of Service
                        </h2>
                        <p className="text-slate-600 mb-4">
                            IntegrateWise is a business operations platform that provides:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                            <li>Data integration and synchronization across business tools</li>
                            <li>AI-powered insights and recommendations</li>
                            <li>Workflow automation and task management</li>
                            <li>Analytics and reporting dashboards</li>
                            <li>Team collaboration features</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            3. Account Registration
                        </h2>
                        <p className="text-slate-600 mb-4">
                            To use the Service, you must:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                            <li>Provide accurate and complete registration information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Notify us immediately of any unauthorized access</li>
                            <li>Be at least 18 years old or have legal authority to enter into contracts</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            4. Subscription and Payment
                        </h2>
                        <p className="text-slate-600 mb-4">
                            <strong>4.1 Billing:</strong> Subscription fees are billed in advance on a
                            monthly or annual basis. All fees are non-refundable except as required by law.
                        </p>
                        <p className="text-slate-600 mb-4">
                            <strong>4.2 Automatic Renewal:</strong> Subscriptions automatically renew
                            unless cancelled before the renewal date.
                        </p>
                        <p className="text-slate-600 mb-4">
                            <strong>4.3 Price Changes:</strong> We may change pricing with 30 days notice.
                            Continued use after the change constitutes acceptance of the new pricing.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            5. Acceptable Use
                        </h2>
                        <p className="text-slate-600 mb-4">You agree not to:</p>
                        <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-1">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe on the rights of others</li>
                            <li>Attempt to gain unauthorized access to the Service</li>
                            <li>Interfere with or disrupt the Service</li>
                            <li>Use the Service for competitive analysis without consent</li>
                            <li>Share account credentials with unauthorized users</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            6. Intellectual Property
                        </h2>
                        <p className="text-slate-600 mb-4">
                            <strong>6.1 Our IP:</strong> IntegrateWise and its licensors retain all
                            intellectual property rights in the Service.
                        </p>
                        <p className="text-slate-600 mb-4">
                            <strong>6.2 Your Content:</strong> You retain ownership of content you
                            upload. You grant us a license to use this content to provide the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            7. Limitation of Liability
                        </h2>
                        <p className="text-slate-600 mb-4">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, INTEGRATEWISE SHALL NOT BE LIABLE
                            FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                            OR ANY LOSS OF PROFITS OR REVENUES.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            8. Termination
                        </h2>
                        <p className="text-slate-600 mb-4">
                            We may suspend or terminate your access to the Service if you violate
                            these Terms. You may cancel your subscription at any time through your
                            account settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            9. Contact Information
                        </h2>
                        <p className="text-slate-600 mb-4">
                            For questions about these Terms, please contact us:
                        </p>
                        <ul className="list-none text-slate-600 space-y-1">
                            <li>Email: legal@integratewise.com</li>
                            <li>Address: 123 Innovation Drive, San Francisco, CA 94105</li>
                        </ul>
                    </section>
                </div>

                {/* Related Links */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                    <h3 className="font-medium text-slate-900 mb-4">Related Policies</h3>
                    <div className="flex gap-4">
                        <Link
                            href="/legal/privacy"
                            className="text-indigo-600 hover:text-indigo-700"
                        >
                            Privacy Policy →
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
