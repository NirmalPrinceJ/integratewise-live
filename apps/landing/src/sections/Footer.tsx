import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const Footer = ({ className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: 'Features', href: '/features' },
      { label: 'Architecture', href: '/architecture' },
      { label: 'Security', href: '/security' },
      { label: 'Pricing', href: '/#proof' },
      { label: 'Changelog', href: '/changelog' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
    Resources: [
      { label: 'Documentation', href: '/documentation' },
      { label: 'API Reference', href: '/api-reference' },
      { label: 'Community', href: '/community' },
      { label: 'Support', href: '/support' },
      { label: 'Status', href: '/status' },
    ],
    Legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'DPA', href: '/dpa' },
      { label: 'Security', href: '/security' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/integratewise', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/integratewise', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/integratewise', label: 'GitHub' },
    { icon: Mail, href: 'mailto:hello@integratewise.ai', label: 'Email' },
  ];

  return (
    <footer className={`relative bg-iw-bg border-t border-white/5 ${className}`}>
      <div className="w-full px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="font-display font-bold text-2xl text-iw-text mb-4 inline-block">
              IntegrateWise
            </Link>
            <p className="text-sm text-iw-text-secondary leading-relaxed mb-6 max-w-xs">
              The Universal Cognitive Operating System. Stop being the cable between your own tools.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 text-iw-text-secondary hover:bg-white/10 hover:text-iw-text transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-mono text-xs text-iw-text-secondary uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-sm text-iw-text-secondary hover:text-iw-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-iw-text-secondary">
            {currentYear} IntegrateWise. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-iw-text-secondary">
              Made with care from Kashmir to Kanyakumari
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
