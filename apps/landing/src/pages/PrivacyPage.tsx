import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const PrivacyPage = () => {
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
            Privacy Policy
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
              <Shield className="w-8 h-8 text-iw-accent" />
              <div>
                <h2 className="font-display font-semibold text-xl text-iw-text m-0">
                  Your data is yours
                </h2>
                <p className="text-iw-text-secondary m-0">
                  We believe in privacy by design. Your data is never sold or shared without consent.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              1. Introduction
            </h2>
            <p className="text-iw-text-secondary">
              IntegrateWise ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our services.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-semibold text-iw-text mt-6 mb-3">
              2.1 Personal Information
            </h3>
            <ul className="list-disc list-inside text-iw-text-secondary space-y-2">
              <li>Name and email address</li>
              <li>Company information</li>
              <li>Payment information (processed securely by our payment providers)</li>
              <li>Usage data and analytics</li>
            </ul>

            <h3 className="text-xl font-semibold text-iw-text mt-6 mb-3">
              2.2 Data from Integrations
            </h3>
            <p className="text-iw-text-secondary">
              When you connect third-party tools, we collect and process data from those 
              integrations as authorized by you. This data is stored securely and used only 
              to provide our services.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-iw-text-secondary space-y-2">
              <li>To provide and maintain our services</li>
              <li>To process and complete transactions</li>
              <li>To send you technical notices and support messages</li>
              <li>To improve our services and develop new features</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              4. Data Security
            </h2>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 my-6">
              <Lock className="w-6 h-6 text-iw-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-iw-text mb-2">Enterprise-Grade Security</h4>
                <p className="text-iw-text-secondary text-sm m-0">
                  We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. 
                  Our infrastructure is SOC 2 Type II certified.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              5. Data Residency
            </h2>
            <p className="text-iw-text-secondary">
              By default, data is stored in the region closest to you. Enterprise customers 
              can choose specific regions for data residency, including options for Indian 
              data to remain in India (compliant with DPDP Act 2023).
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              6. Your Rights
            </h2>
            <p className="text-iw-text-secondary">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc list-inside text-iw-text-secondary space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Export your data</li>
              <li>Object to data processing</li>
              <li>Withdraw consent</li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              7. Third-Party Services
            </h2>
            <p className="text-iw-text-secondary">
              We use trusted third-party services for hosting, analytics, and payment processing. 
              All third parties are vetted for security and privacy compliance.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              8. Cookies
            </h2>
            <p className="text-iw-text-secondary">
              We use cookies and similar technologies to enhance your experience. 
              For more information, please see our <Link to="/cookies" className="text-iw-accent hover:underline">Cookie Policy</Link>.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              9. Contact Us
            </h2>
            <p className="text-iw-text-secondary">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@integratewise.ai" className="text-iw-accent hover:underline">
                privacy@integratewise.ai
              </a>.
            </p>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-sm text-iw-text-secondary">
                This Privacy Policy is effective as of March 6, 2026. We may update this 
                policy from time to time. We will notify you of any changes by posting the 
                new policy on this page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
