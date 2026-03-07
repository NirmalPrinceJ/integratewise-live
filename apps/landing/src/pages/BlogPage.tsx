import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const BlogPage = () => {
  const featuredPost = {
    title: 'Introducing v3.6: The Context Layer',
    excerpt: 'After two years of building, we\'re launching the Universal Cognitive Operating System. Connect Tools ↔ AI ↔ Data ↔ Context ↔ Memory in one unified loop.',
    author: 'Nirmal Prince J',
    date: 'March 6, 2026',
    readTime: '8 min read',
    category: 'Product',
    slug: 'introducing-v36-context-layer',
  };

  const posts = [
    {
      title: 'The $4.2 Trillion Disconnection Tax',
      excerpt: 'How fragmented tools are costing businesses more than they realize—and what to do about it.',
      author: 'Nirmal Prince J',
      date: 'February 28, 2026',
      readTime: '5 min read',
      category: 'Industry',
      slug: 'disconnection-tax',
    },
    {
      title: 'Why We Built The Hard Gate™',
      excerpt: 'AI governance isn\'t optional. Here\'s how we ensure human sovereignty in every AI action.',
      author: 'Engineering Team',
      date: 'February 15, 2026',
      readTime: '6 min read',
      category: 'Engineering',
      slug: 'hard-gate-ai-governance',
    },
    {
      title: 'From Jaipur to Kanyakumari: Building for Bharat',
      excerpt: 'How we designed IntegrateWise to work for the 63 million SMEs across India.',
      author: 'Product Team',
      date: 'January 30, 2026',
      readTime: '7 min read',
      category: 'Company',
      slug: 'building-for-bharat',
    },
    {
      title: 'The Three Spaces Architecture',
      excerpt: 'Why we separated Personal, Work, and Team spaces—and how RLS enforces it.',
      author: 'Engineering Team',
      date: 'January 15, 2026',
      readTime: '4 min read',
      category: 'Engineering',
      slug: 'three-spaces-architecture',
    },
    {
      title: 'MCP: The Protocol That Changes Everything',
      excerpt: 'How the Model Context Protocol enables AI to truly understand your business.',
      author: 'Nirmal Prince J',
      date: 'December 20, 2025',
      readTime: '10 min read',
      category: 'Product',
      slug: 'mcp-protocol',
    },
    {
      title: 'Achieving SOC 2 Type II',
      excerpt: 'Our journey to enterprise-grade security certification.',
      author: 'Security Team',
      date: 'December 5, 2025',
      readTime: '5 min read',
      category: 'Security',
      slug: 'soc2-certification',
    },
  ];

  const categories = ['All', 'Product', 'Engineering', 'Security', 'Company', 'Industry'];

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
              Blog
            </span>
            <h1 className="mt-6 font-display font-bold text-4xl lg:text-5xl text-iw-text">
              Thoughts on the future of
              <br />
              <span className="text-iw-accent">cognitive work</span>
            </h1>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-iw-accent text-iw-bg'
                    : 'bg-white/5 text-iw-text-secondary hover:bg-white/10 hover:text-iw-text'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="mb-12">
            <Link to={`/blog/${featuredPost.slug}`}>
              <div className="glass-card rounded-2xl p-8 lg:p-12 hover:bg-white/5 transition-colors">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="px-3 py-1 rounded-full bg-iw-accent/20 text-iw-accent text-sm font-mono">
                    {featuredPost.category}
                  </span>
                  <span className="text-sm text-iw-text-secondary flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </span>
                  <span className="text-sm text-iw-text-secondary flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="font-display font-bold text-2xl lg:text-3xl text-iw-text mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-iw-text-secondary text-lg mb-6 max-w-3xl">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-iw-accent/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-iw-accent" />
                  </div>
                  <span className="text-iw-text">{featuredPost.author}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <Link key={index} to={`/blog/${post.slug}`}>
                <div className="glass-card rounded-xl p-6 h-full hover:bg-white/5 transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-iw-text-secondary text-xs font-mono">
                      {post.category}
                    </span>
                    <span className="text-xs text-iw-text-secondary">{post.readTime}</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-iw-text mb-3">
                    {post.title}
                  </h3>
                  <p className="text-sm text-iw-text-secondary mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-iw-text-secondary">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5 px-8 py-5">
              Load more articles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl text-iw-text mb-4">
            Subscribe to our newsletter
          </h2>
          <p className="text-iw-text-secondary mb-6">
            Get the latest updates on product, engineering, and company news.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="you@company.com"
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-iw-text placeholder:text-iw-text-secondary/50 focus:outline-none focus:border-iw-accent"
            />
            <Button className="bg-iw-accent text-iw-bg font-semibold px-6 py-3">
              Subscribe
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
