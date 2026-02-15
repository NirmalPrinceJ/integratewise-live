import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Eye,
  Activity,
  AlertTriangle,
  Database,
  Brain,
  Zap,
  TrendingUp,
  Users,
  Calendar,
  MessageSquare,
  FileText,
  Clock
} from 'lucide-react';

interface Entity360ViewProps {
  entityId: string;
}

export default function Entity360View({ entityId }: Entity360ViewProps) {
  const [activeTab, setActiveTab] = useState('timeline');

  // Mock data - in real app, this would come from API
  const entity = {
    id: entityId,
    name: 'Acme Corp',
    type: 'Company',
    healthScore: 85,
    status: 'active',
    lastActivity: '2024-01-29T14:30:00Z',
    description: 'Leading technology solutions provider'
  };

  const timeline = [
    {
      id: '1',
      type: 'signal',
      title: 'Deal velocity increased',
      description: 'Pipeline movement up 25% this week',
      timestamp: '2024-01-29T14:30:00Z',
      source: 'CRM'
    },
    {
      id: '2',
      type: 'situation',
      title: 'Expansion opportunity detected',
      description: 'AI identified potential for additional services',
      timestamp: '2024-01-29T12:15:00Z',
      source: 'Think Engine'
    },
    {
      id: '3',
      type: 'action',
      title: 'Follow-up call scheduled',
      description: 'Automated scheduling for Q1 review',
      timestamp: '2024-01-29T10:45:00Z',
      source: 'Act Engine'
    },
    {
      id: '4',
      type: 'context',
      title: 'New contact added',
      description: 'CTO joined LinkedIn network',
      timestamp: '2024-01-29T09:20:00Z',
      source: 'LinkedIn'
    },
    {
      id: '5',
      type: 'memory',
      title: 'AI Session Summary',
      description: 'Discussed Q1 roadmap and expansion plans',
      timestamp: '2024-01-28T16:00:00Z',
      source: 'IQ Hub'
    }
  ];

  const signals = [
    { id: '1', name: 'Revenue Growth', value: '+15%', trend: 'up', source: 'Finance' },
    { id: '2', name: 'Deal Velocity', value: '+25%', trend: 'up', source: 'CRM' },
    { id: '3', name: 'Support Tickets', value: '-10%', trend: 'down', source: 'Support' },
    { id: '4', name: 'Email Engagement', value: '+8%', trend: 'up', source: 'Marketing' }
  ];

  const situations = [
    {
      id: '1',
      title: 'Expansion Opportunity',
      severity: 'medium',
      status: 'active',
      description: 'AI detected potential for additional service lines',
      created: '2024-01-29T12:15:00Z'
    },
    {
      id: '2',
      title: 'Contract Renewal Due',
      severity: 'high',
      status: 'pending',
      description: 'Current contract expires in 30 days',
      created: '2024-01-25T09:00:00Z'
    }
  ];

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'signal': return <TrendingUp className="h-4 w-4" />;
      case 'situation': return <AlertTriangle className="h-4 w-4" />;
      case 'action': return <Zap className="h-4 w-4" />;
      case 'context': return <Database className="h-4 w-4" />;
      case 'memory': return <Brain className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTimelineColor = (type: string) => {
    switch (type) {
      case 'signal': return 'text-blue-500';
      case 'situation': return 'text-orange-500';
      case 'action': return 'text-green-500';
      case 'context': return 'text-purple-500';
      case 'memory': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Eye className="h-8 w-8" />
            {entity.name}
          </h1>
          <p className="text-muted-foreground">{entity.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold">{entity.healthScore}/100</div>
            <div className="text-sm text-muted-foreground">Health Score</div>
          </div>
          <Badge variant={entity.status === 'active' ? 'default' : 'secondary'}>
            {entity.status}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
          <TabsTrigger value="situations">Situations</TabsTrigger>
          <TabsTrigger value="context">Context</TabsTrigger>
          <TabsTrigger value="memory">AI Memory</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>
                Chronological view of all entity-related activities across all data planes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={item.id} className="flex gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getTimelineColor(item.type)} bg-muted`}>
                      {getTimelineIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {item.source}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Signals Tab */}
        <TabsContent value="signals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {signals.map((signal) => (
              <Card key={signal.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{signal.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {signal.source}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{signal.value}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className={`h-3 w-3 ${signal.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    {signal.trend === 'up' ? 'Increasing' : 'Decreasing'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Situations Tab */}
        <TabsContent value="situations" className="space-y-4">
          <div className="space-y-4">
            {situations.map((situation) => (
              <Card key={situation.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{situation.title}</h3>
                    <div className="flex gap-2">
                      <Badge variant={situation.severity === 'high' ? 'destructive' : 'secondary'}>
                        {situation.severity}
                      </Badge>
                      <Badge variant="outline">{situation.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {situation.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Created {new Date(situation.created).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Context Tab */}
        <TabsContent value="context" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Linked Artifacts</CardTitle>
              <CardDescription>Documents, emails, and other context related to this entity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">Q1 Roadmap.pdf</p>
                    <p className="text-sm text-muted-foreground">Last modified 2 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Email: Contract Discussion</p>
                    <p className="text-sm text-muted-foreground">From CTO, 1 week ago</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Memory Tab */}
        <TabsContent value="memory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Session Memory</CardTitle>
              <CardDescription>Relevant AI conversations and insights about this entity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 border rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4" />
                    <span className="font-medium">Strategy Discussion</span>
                    <Badge variant="outline" className="text-xs">High Relevance</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    "Discussed expansion into AI services, CTO expressed interest in ML consulting..."
                  </p>
                  <div className="text-xs text-muted-foreground">
                    January 28, 2024 • IQ Hub Session #1234
                  </div>
                </div>
                <div className="p-4 border rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4" />
                    <span className="font-medium">Contract Review</span>
                    <Badge variant="outline" className="text-xs">Medium Relevance</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    "Reviewed current SLA terms, identified opportunities for premium support..."
                  </p>
                  <div className="text-xs text-muted-foreground">
                    January 25, 2024 • IQ Hub Session #1198
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Executed Actions</CardTitle>
              <CardDescription>Actions taken by the system on behalf of this entity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded">
                  <Zap className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Scheduled follow-up call</p>
                    <p className="text-sm text-muted-foreground">Automated based on deal velocity signal</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>2 hours ago</div>
                    <div className="text-xs">Approved</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">Updated contact information</p>
                    <p className="text-sm text-muted-foreground">Synced from LinkedIn profile changes</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>1 day ago</div>
                    <div className="text-xs">Auto-executed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}