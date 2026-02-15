// apps/integratewise-os/src/components/views/n8n-dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { N8nService, OpenRouterService } from '../../clients/n8n/n8n-service';

interface Workflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function N8nDashboard() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [n8nService] = useState(() => new N8nService(process.env.NEXT_PUBLIC_N8N_API_KEY!));
  const [openRouterService] = useState(() => new OpenRouterService(process.env.NEXT_PUBLIC_OPENROUTER_API_KEY!));

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await n8nService.getWorkflows();
      setWorkflows(data);
    } catch (error) {
      console.error('Failed to load workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkflow = async (id: string, active: boolean) => {
    try {
      await n8nService.toggleWorkflow(id, active);
      setWorkflows(workflows.map(w =>
        w.id === id ? { ...w, active } : w
      ));
    } catch (error) {
      console.error('Failed to toggle workflow:', error);
    }
  };

  const deployWorkflow = async () => {
    // Example: Deploy a simple workflow template
    const template = {
      name: 'Data Normalizer',
      nodes: [
        {
          id: 'webhook',
          type: 'n8n-nodes-base.webhook',
          position: [100, 100],
          parameters: { httpMethod: 'POST' }
        },
        {
          id: 'openrouter',
          type: 'n8n-nodes-base.httpRequest',
          position: [300, 100],
          parameters: {
            url: 'https://openrouter.ai/api/v1/chat/completions',
            method: 'POST',
            body: '{"model":"anthropic/claude-3-haiku:beta","messages":[{"role":"user","content":"Normalize this data: {{$json}}"}]}'
          }
        }
      ],
      connections: {
        webhook: { main: [[{ node: 'openrouter', type: 'main', index: 0 }]] }
      }
    };

    try {
      await n8nService.deployWorkflowFromTemplate(template);
      loadWorkflows(); // Refresh list
    } catch (error) {
      console.error('Failed to deploy workflow:', error);
    }
  };

  const testOpenRouter = async () => {
    try {
      const response = await openRouterService.generateText('Hello, test message for normalization');
      alert(`OpenRouter Response: ${response}`);
    } catch (error) {
      console.error('OpenRouter test failed:', error);
    }
  };

  if (loading) return <div>Loading n8n workflows...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">n8n Workflow Control</h1>

      <div className="mb-6">
        <button
          onClick={deployWorkflow}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          Deploy New Workflow
        </button>
        <button
          onClick={testOpenRouter}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test OpenRouter
        </button>
      </div>

      <div className="grid gap-4">
        {workflows.map(workflow => (
          <div key={workflow.id} className="border p-4 rounded">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{workflow.name}</h3>
                <p className="text-sm text-gray-600">
                  Created: {new Date(workflow.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => toggleWorkflow(workflow.id, !workflow.active)}
                className={`px-3 py-1 rounded ${
                  workflow.active ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                {workflow.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}