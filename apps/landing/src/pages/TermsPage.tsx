import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-12 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="text-iw-text-secondary hover:text-iw-text mb-6">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to home
            </Button>
          </Link>
          <h1 className="font-display font-bold text-4xl lg:text-5xl text-iw-text mb-4">
            Terms of Service
          </h1>
          <p className="text-iw-text-secondary">
            Last updated: March 6, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto prose prose-invert prose-lg max-w-none">
          <div className="glass-card rounded-xl p-8 lg:p-12">
            <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-iw-accent/10 border border-iw-accent/30">
              <Scale className="w-8 h-8 text-iw-accent" />
              <div>
                <h2 className="font-display font-semibold text-xl text-iw-text m-0">
                  Fair and transparent
                </h2>
                <p className="text-iw-text-secondary m-0">
                  Our terms are designed to be clear and fair to all users.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-iw-text-secondary">
              By accessing or using IntegrateWise ("the Service"), you agree to be bound by 
              these Terms of Service. If you do not agree to these terms, please do not use 
              the Service.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              2. Description of Service
            </h2>
            <p className="text-iw-text-secondary">
              IntegrateWise provides a cognitive operating system that connects tools, AI, 
              data, context, and memory. The Service includes web applications, APIs, and 
              related services.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              3. Account Registration
            </h2>
            <p className="text-iw-text-secondary">
              To use the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-iw-text-secondary space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activity under your account</li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              4. Subscription and Payment
            </h2>
            <h3 className="text-xl font-semibold text-iw-text mt-6 mb-3">
              4.1 Free Tier
            </h3>
            <p className="text-iw-text-secondary">
              We offer a free tier with limited features. Free accounts may be subject to 
              usage limits and feature restrictions.
            </p>

            <h3 className="text-xl font-semibold text-iw-text mt-6 mb-3">
              4.2 Paid Subscriptions
            </h3>
            <p className="text-iw-text-secondary">
              Paid subscriptions are billed in advance on a monthly or annual basis. 
              You may cancel at any time, but no refunds will be provided for partial months.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              5. Acceptable Use
            </h2>
            <p className="text-iw-text-secondary">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-iw-text-secondary space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to systems</li>
              <li>Interfere with other users' access to the Service</li>
              <li>Engage in data mining or harvesting</li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              6. Data Ownership
            </h2>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 my-6">
              <FileText className="w-6 h-6 text-iw-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-iw-text mb-2">Your Data Belongs to You</h4>
                <p className="text-iw-text-secondary text-sm m-0">
                  You retain all rights to your data. We claim no ownership over your content. 
                  You can export your data at any time.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              7. Service Level Agreement
            </h2>
            <p className="text-iw-text-secondary">
              For Enterprise customers, we offer a Service Level Agreement (SLA) with 
              guaranteed uptime. Details are specified in your Enterprise agreement.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              8. Termination
            </h2>
            <p className="text-iw-text-secondary">
              We reserve the right to suspend or terminate your account for violations of 
              these terms. You may terminate your account at any time by contacting support.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-iw-text-secondary">
              To the maximum extent permitted by law, IntegrateWise shall not be liable 
              for any indirect, incidental, special, consequential, or punitive damages 
              arising from your use of the Service.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-iw-text-secondary">
              We may modify these terms at any time. We will notify you of significant 
              changes via email or through the Service. Continued use constitutes acceptance 
              of the modified terms.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              11. Governing Law
            </h2>
            <p className="text-iw-text-secondary">
              These terms shall be governed by the laws of India. Any disputes shall be 
              resolved in the courts of Bangalore, Karnataka.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              12. Contact Information
            </h2>
            <p className="text-iw-text-secondary">
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@integratewise.ai" className="text-iw-accent hover:underline">
                legal@integratewise.ai
              </a>.
            </p>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-sm text-iw-text-secondary">
                By using IntegrateWise, you acknowledge that you have read, understood, and 
                agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsPage;
