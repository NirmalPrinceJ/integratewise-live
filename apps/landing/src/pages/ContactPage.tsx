import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, MessageSquare, Phone, MapPin, ArrowRight, 
  Send, Twitter, Linkedin, Github 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactOptions = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@integratewise.ai',
      description: 'For general inquiries',
      link: 'mailto:hello@integratewise.ai',
    },
    {
      icon: MessageSquare,
      title: 'Support',
      value: 'support@integratewise.ai',
      description: 'For technical help',
      link: 'mailto:support@integratewise.ai',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 80 1234 5678',
      description: 'Mon-Fri, 9am-6pm IST',
      link: 'tel:+918012345678',
    },
    {
      icon: MapPin,
      title: 'Office',
      value: 'Bangalore, India',
      description: 'Remote-first team',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Contact
          </span>
          <h1 className="mt-6 font-display font-bold text-4xl lg:text-5xl text-iw-text">
            Let's talk
          </h1>
          <p className="mt-6 text-lg text-iw-text-secondary max-w-2xl mx-auto">
            Have a question, feedback, or just want to say hello? 
            We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option, index) => (
              <a key={index} href={option.link} className="p-6 rounded-xl glass-card hover:bg-white/5 transition-colors">
                <div className="p-3 rounded-xl bg-iw-accent/20 w-fit mb-4">
                  <option.icon className="w-6 h-6 text-iw-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg text-iw-text mb-1">
                  {option.title}
                </h3>
                <p className="text-iw-accent mb-1">{option.value}</p>
                <p className="text-sm text-iw-text-secondary">{option.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="font-display font-bold text-2xl text-iw-text mb-6">
                Send us a message
              </h2>
              
              {submitted ? (
                <div className="p-8 rounded-xl glass-card text-center">
                  <div className="p-4 rounded-full bg-green-500/20 w-fit mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-iw-text mb-2">
                    Message sent!
                  </h3>
                  <p className="text-iw-text-secondary">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-iw-text">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="bg-white/5 border-white/10 text-iw-text placeholder:text-iw-text-secondary/50 focus:border-iw-accent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-iw-text">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="bg-white/5 border-white/10 text-iw-text placeholder:text-iw-text-secondary/50 focus:border-iw-accent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-iw-text">Company (optional)</Label>
                    <Input
                      id="company"
                      placeholder="Acme Inc"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      className="bg-white/5 border-white/10 text-iw-text placeholder:text-iw-text-secondary/50 focus:border-iw-accent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-iw-text">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      className="bg-white/5 border-white/10 text-iw-text placeholder:text-iw-text-secondary/50 focus:border-iw-accent"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-iw-text">Message</Label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us more about your question or feedback..."
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-iw-text placeholder:text-iw-text-secondary/50 focus:outline-none focus:border-iw-accent resize-none"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-iw-accent text-iw-bg font-semibold py-6 btn-lift"
                  >
                    Send message
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              )}
            </div>

            {/* Social & Other */}
            <div>
              <h2 className="font-display font-bold text-2xl text-iw-text mb-6">
                Connect with us
              </h2>
              <div className="space-y-4 mb-8">
                <a 
                  href="https://twitter.com/integratewise" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl glass-card hover:bg-white/5 transition-colors"
                >
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <Twitter className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-iw-text">Twitter</p>
                    <p className="text-sm text-iw-text-secondary">@integratewise</p>
                  </div>
                </a>
                <a 
                  href="https://linkedin.com/company/integratewise" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl glass-card hover:bg-white/5 transition-colors"
                >
                  <div className="p-3 rounded-xl bg-blue-600/20">
                    <Linkedin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-iw-text">LinkedIn</p>
                    <p className="text-sm text-iw-text-secondary">/company/integratewise</p>
                  </div>
                </a>
                <a 
                  href="https://github.com/integratewise" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl glass-card hover:bg-white/5 transition-colors"
                >
                  <div className="p-3 rounded-xl bg-gray-500/20">
                    <Github className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-iw-text">GitHub</p>
                    <p className="text-sm text-iw-text-secondary">/integratewise</p>
                  </div>
                </a>
              </div>

              <div className="p-6 rounded-xl glass-card">
                <h3 className="font-display font-semibold text-lg text-iw-text mb-4">
                  Looking for something else?
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/documentation" className="text-iw-accent hover:underline">
                      Browse documentation
                    </Link>
                  </li>
                  <li>
                    <Link to="/support" className="text-iw-accent hover:underline">
                      Visit support center
                    </Link>
                  </li>
                  <li>
                    <Link to="/community" className="text-iw-accent hover:underline">
                      Join our community
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
