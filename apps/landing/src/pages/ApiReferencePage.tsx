import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, Copy, Check, Terminal, 
  Server, Database, Brain, Shield 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const ApiReferencePage = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeEndpoint, setActiveEndpoint] = useState('auth');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const endpoints = {
    auth: {
      title: 'Authentication',
      description: 'Authenticate users and manage sessions.',
      methods: [
        {
          method: 'POST',
          path: '/api/v1/auth/login',
          description: 'Authenticate a user with email and password.',
          request: `{
  "email": "user@example.com",
  "password": "your-password"
}`,
          response: `{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}`,
        },
        {
          method: 'POST',
          path: '/api/v1/auth/register',
          description: 'Register a new user account.',
          request: `{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "your-password"
}`,
          response: `{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}`,
        },
      ],
    },
    workspaces: {
      title: 'Workspaces',
      description: 'Manage workspaces and their configuration.',
      methods: [
        {
          method: 'GET',
          path: '/api/v1/workspaces',
          description: 'List all workspaces for the authenticated user.',
          request: '',
          response: `{
  "workspaces": [
    {
      "id": "ws_123",
      "name": "My Workspace",
      "type": "personal",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}`,
        },
        {
          method: 'POST',
          path: '/api/v1/workspaces',
          description: 'Create a new workspace.',
          request: `{
  "name": "My Team",
  "type": "team"
}`,
          response: `{
  "id": "ws_456",
  "name": "My Team",
  "type": "team",
  "created_at": "2026-03-06T00:00:00Z"
}`,
        },
      ],
    },
    integrations: {
      title: 'Integrations',
      description: 'Connect and manage third-party integrations.',
      methods: [
        {
          method: 'GET',
          path: '/api/v1/integrations',
          description: 'List all available integrations.',
          request: '',
          response: `{
  "integrations": [
    {
      "id": "int_slack",
      "name": "Slack",
      "category": "messaging",
      "status": "available"
    }
  ]
}`,
        },
        {
          method: 'POST',
          path: '/api/v1/integrations/{id}/connect',
          description: 'Connect an integration to your workspace.',
          request: `{
  "config": {
    "webhook_url": "https://hooks.slack.com/..."
  }
}`,
          response: `{
  "id": "conn_123",
  "integration_id": "int_slack",
  "status": "connected",
  "connected_at": "2026-03-06T00:00:00Z"
}`,
        },
      ],
    },
  };

  const categories = [
    { id: 'auth', icon: Shield, label: 'Authentication' },
    { id: 'workspaces', icon: Database, label: 'Workspaces' },
    { id: 'integrations', icon: Server, label: 'Integrations' },
    { id: 'ai', icon: Brain, label: 'AI & Agents' },
  ];

  return (
    <div className="min-h-screen bg-iw-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-xs tracking-[0.2em] text-iw-accent uppercase">
              API Reference
            </span>
            <h1 className="mt-6 font-display font-bold text-4xl lg:text-5xl text-iw-text">
              IntegrateWise API
            </h1>
            <p className="mt-6 text-lg text-iw-text-secondary max-w-2xl mx-auto">
              Build custom integrations and extend IntegrateWise with our REST API.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/documentation">
                <Button variant="outline" className="border-white/20 text-iw-text hover:bg-white/5 px-6 py-5">
                  <Code className="mr-2 w-5 h-5" />
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>

          {/* Base URL */}
          <div className="max-w-2xl mx-auto">
            <div className="p-4 rounded-xl glass-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-iw-accent" />
                <code className="text-iw-text">https://api.integratewise.ai/v1</code>
              </div>
              <button
                onClick={() => copyToClipboard('https://api.integratewise.ai/v1', 'baseurl')}
                className="p-2 rounded-lg hover:bg-white/5"
              >
                {copied === 'baseurl' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-iw-text-secondary" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* API Explorer */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <h3 className="font-display font-semibold text-lg text-iw-text mb-4">
                Endpoints
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveEndpoint(cat.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeEndpoint === cat.id
                        ? 'bg-iw-accent/20 text-iw-accent'
                        : 'text-iw-text-secondary hover:bg-white/5 hover:text-iw-text'
                    }`}
                  >
                    <cat.icon className="w-5 h-5" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {Object.entries(endpoints).map(([key, section]) => (
                activeEndpoint === key && (
                  <div key={key}>
                    <h2 className="font-display font-bold text-2xl text-iw-text mb-2">
                      {section.title}
                    </h2>
                    <p className="text-iw-text-secondary mb-8">
                      {section.description}
                    </p>

                    <div className="space-y-8">
                      {section.methods.map((method, index) => (
                        <div key={index} className="glass-card rounded-xl overflow-hidden">
                          <div className="p-4 border-b border-white/5 flex items-center gap-4">
                            <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                              method.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                              method.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {method.method}
                            </span>
                            <code className="text-iw-text">{method.path}</code>
                          </div>
                          <div className="p-6">
                            <p className="text-iw-text-secondary mb-6">
                              {method.description}
                            </p>

                            {method.request && (
                              <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-iw-text">Request</span>
                                  <button
                                    onClick={() => copyToClipboard(method.request, `req-${key}-${index}`)}
                                    className="text-iw-text-secondary hover:text-iw-text"
                                  >
                                    {copied === `req-${key}-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </div>
                                <pre className="p-4 bg-black/30 rounded-lg overflow-x-auto">
                                  <code className="text-sm text-iw-text">{method.request}</code>
                                </pre>
                              </div>
                            )}

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-iw-text">Response</span>
                                <button
                                  onClick={() => copyToClipboard(method.response, `res-${key}-${index}`)}
                                  className="text-iw-text-secondary hover:text-iw-text"
                                >
                                  {copied === `res-${key}-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                              <pre className="p-4 bg-black/30 rounded-lg overflow-x-auto">
                                <code className="text-sm text-iw-text">{method.response}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl text-iw-text mb-6">
            Official SDKs
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['JavaScript', 'Python', 'Go', 'Ruby', 'PHP'].map((sdk, index) => (
              <div key={index} className="px-6 py-3 rounded-xl glass-card text-iw-text font-medium">
                {sdk}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ApiReferencePage;
