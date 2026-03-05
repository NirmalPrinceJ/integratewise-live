import { Link } from 'react-router-dom';
import { 
  Users, MessageSquare, Calendar, Book, Github, 
  Twitter, ArrowRight, Star, Heart 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const CommunityPage = () => {
  const channels = [
    {
      icon: MessageSquare,
      title: 'Discord',
      description: 'Join 2,000+ developers discussing IntegrateWise.',
      link: 'https://discord.gg/integratewise',
      cta: 'Join Discord',
      members: '2,000+',
    },
    {
      icon: Twitter,
      title: 'Twitter',
      description: 'Follow us for product updates and tips.',
      link: 'https://twitter.com/integratewise',
      cta: 'Follow @integratewise',
      members: '5,000+',
    },
    {
      icon: Github,
      title: 'GitHub',
      description: 'Contribute to open-source projects and SDKs.',
      link: 'https://github.com/integratewise',
      cta: 'View on GitHub',
      members: '500+',
    },
    {
      icon: Book,
      title: 'Forum',
      description: 'Ask questions and share knowledge.',
      link: '/forum',
      cta: 'Visit Forum',
      members: '1,000+',
    },
  ];

  const events = [
    {
      title: 'IntegrateWise Community Call',
      date: 'March 15, 2026',
      time: '10:00 AM IST',
      description: 'Monthly community update and Q&A.',
    },
    {
      title: 'Builder Workshop: Custom Integrations',
      date: 'March 22, 2026',
      time: '2:00 PM IST',
      description: 'Learn to build custom integrations with our SDK.',
    },
    {
      title: 'AI Governance Webinar',
      date: 'April 5, 2026',
      time: '11:00 AM IST',
      description: 'Deep dive into The Hard Gate™ and AI safety.',
    },
  ];

  const contributors = [
    { name: 'Rajesh K.', contributions: 45, avatar: 'RK' },
    { name: 'Priya M.', contributions: 32, avatar: 'PM' },
    { name: 'Arun S.', contributions: 28, avatar: 'AS' },
    { name: 'Deepa R.', contributions: 21, avatar: 'DR' },
  ];

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
            Community
          </span>
          <h1 className="mt-6 font-display font-bold text-4xl lg:text-5xl text-iw-text">
            Join the IntegrateWise
            <br />
            <span className="text-iw-accent">community</span>
          </h1>
          <p className="mt-6 text-lg text-iw-text-secondary max-w-2xl mx-auto">
            Connect with thousands of developers, builders, and teams who are 
            unifying their stacks with IntegrateWise.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://discord.gg/integratewise" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-iw-accent text-iw-bg font-semibold px-8 py-6 btn-lift">
                <Users className="mr-2 w-5 h-5" />
                Join Discord
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <Link to="/documentation">
              <Button variant="outline" size="lg" className="border-white/20 text-iw-text hover:bg-white/5 px-8 py-6">
                Read docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '5,000+', label: 'Community Members' },
              { value: '1,000+', label: 'Forum Topics' },
              { value: '500+', label: 'GitHub Stars' },
              { value: '50+', label: 'Contributors' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display font-bold text-3xl text-iw-accent">{stat.value}</div>
                <div className="text-sm text-iw-text-secondary mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-12">
            Connect with us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {channels.map((channel, index) => (
              <a 
                key={index} 
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-xl glass-card hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-iw-accent/20">
                      <channel.icon className="w-6 h-6 text-iw-accent" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-iw-text">
                        {channel.title}
                      </h3>
                      <p className="text-sm text-iw-text-secondary">
                        {channel.description}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-iw-text-secondary font-mono">
                    {channel.members}
                  </span>
                </div>
                <div className="mt-4 flex items-center text-iw-accent">
                  <span className="text-sm font-medium">{channel.cta}</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-iw-text text-center mb-12">
            Upcoming Events
          </h2>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="p-6 rounded-xl glass-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-iw-text mb-1">
                      {event.title}
                    </h3>
                    <p className="text-iw-text-secondary text-sm mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-iw-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5">
                    Register
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributors */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-iw-text mb-4">
            Top Contributors
          </h2>
          <p className="text-iw-text-secondary mb-8">
            Thanks to these amazing people who help make IntegrateWise better.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {contributors.map((contributor, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-iw-accent/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-display font-bold text-iw-accent">
                    {contributor.avatar}
                  </span>
                </div>
                <p className="text-iw-text font-medium">{contributor.name}</p>
                <p className="text-sm text-iw-text-secondary">{contributor.contributions} contributions</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-2xl glass-card">
            <div className="p-4 rounded-full bg-iw-accent/20 w-fit mx-auto mb-6">
              <Heart className="w-8 h-8 text-iw-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl text-iw-text mb-4">
              Contribute to IntegrateWise
            </h2>
            <p className="text-iw-text-secondary mb-6 max-w-xl mx-auto">
              Help us build the future of cognitive work. Contribute code, documentation, 
              or spread the word.
            </p>
            <a href="https://github.com/integratewise" target="_blank" rel="noopener noreferrer">
              <Button className="bg-iw-accent text-iw-bg font-semibold px-6 py-5">
                <Star className="mr-2 w-5 h-5" />
                Star us on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CommunityPage;
