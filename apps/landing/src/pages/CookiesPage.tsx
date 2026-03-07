import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const CookiesPage = () => {
  const cookieTypes = [
    {
      name: 'Essential Cookies',
      required: true,
      description: 'Required for the website to function properly. Cannot be disabled.',
      examples: ['Session ID', 'CSRF token', 'Authentication state'],
    },
    {
      name: 'Functional Cookies',
      required: false,
      description: 'Enable enhanced functionality and personalization.',
      examples: ['Language preference', 'Theme settings', 'User preferences'],
    },
    {
      name: 'Analytics Cookies',
      required: false,
      description: 'Help us understand how visitors interact with our website.',
      examples: ['Page views', 'Session duration', 'Feature usage'],
    },
    {
      name: 'Marketing Cookies',
      required: false,
      description: 'Used to deliver relevant advertisements and track their performance.',
      examples: ['Ad targeting', 'Campaign tracking', 'Conversion tracking'],
    },
  ];

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
            Cookie Policy
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
              <Cookie className="w-8 h-8 text-iw-accent" />
              <div>
                <h2 className="font-display font-semibold text-xl text-iw-text m-0">
                  Transparency in tracking
                </h2>
                <p className="text-iw-text-secondary m-0">
                  We use cookies responsibly to improve your experience.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              1. What Are Cookies?
            </h2>
            <p className="text-iw-text-secondary">
              Cookies are small text files that are stored on your device when you visit a website. 
              They help websites remember your preferences and improve your browsing experience.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              2. How We Use Cookies
            </h2>
            <p className="text-iw-text-secondary">
              IntegrateWise uses cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside text-iw-text-secondary space-y-2">
              <li>To maintain your session and authentication state</li>
              <li>To remember your preferences and settings</li>
              <li>To analyze website usage and improve our services</li>
              <li>To deliver personalized content and advertisements</li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              3. Types of Cookies We Use
            </h2>
            <div className="space-y-4 my-6">
              {cookieTypes.map((type, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-iw-text">{type.name}</h4>
                    {type.required ? (
                      <span className="px-2 py-1 rounded bg-iw-accent/20 text-iw-accent text-xs font-mono">
                        REQUIRED
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-white/10 text-iw-text-secondary text-xs font-mono">
                        OPTIONAL
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-iw-text-secondary mb-2">{type.description}</p>
                  <p className="text-xs text-iw-text-secondary">
                    Examples: {type.examples.join(', ')}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              4. Third-Party Cookies
            </h2>
            <p className="text-iw-text-secondary">
              We may use third-party services that set cookies on our behalf:
            </p>
            <ul className="list-disc list-inside text-iw-text-secondary space-y-2">
              <li>Google Analytics - for website analytics</li>
              <li>Stripe - for payment processing</li>
              <li>Intercom - for customer support chat</li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              5. Managing Cookies
            </h2>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 my-6">
              <Settings className="w-6 h-6 text-iw-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-iw-text mb-2">Your Control</h4>
                <p className="text-iw-text-secondary text-sm m-0">
                  You can manage cookie preferences through your browser settings. 
                  Note that disabling certain cookies may affect website functionality.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              6. Cookie Duration
            </h2>
            <p className="text-iw-text-secondary">
              Cookies can be either:
            </p>
            <ul className="list-disc list-inside text-iw-text-secondary space-y-2">
              <li><strong>Session cookies</strong> - deleted when you close your browser</li>
              <li><strong>Persistent cookies</strong> - remain until they expire or you delete them</li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              7. Updates to This Policy
            </h2>
            <p className="text-iw-text-secondary">
              We may update this Cookie Policy from time to time. We will notify you of any 
              changes by posting the new policy on this page.
            </p>

            <h2 className="text-2xl font-display font-semibold text-iw-text mt-8 mb-4">
              8. Contact Us
            </h2>
            <p className="text-iw-text-secondary">
              If you have any questions about our Cookie Policy, please contact us at{' '}
              <a href="mailto:privacy@integratewise.ai" className="text-iw-accent hover:underline">
                privacy@integratewise.ai
              </a>.
            </p>

            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-iw-accent text-iw-bg font-semibold">
                  <Settings className="mr-2 w-4 h-4" />
                  Manage Cookie Preferences
                </Button>
                <Link to="/privacy">
                  <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5">
                    <Shield className="mr-2 w-4 h-4" />
                    Privacy Policy
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CookiesPage;
