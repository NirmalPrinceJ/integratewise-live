// apps/integratewise-os/src/components/workflow-builder/workflow-canvas.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { N8nService } from '../../clients/n8n/n8n-service';

interface WorkflowNode extends Node {
  data: {
    label: string;
    type: string;
    config: any;
  };
}

interface WorkflowEdge extends Edge {}

const nodeTypes = {
  webhook: WebhookNode,
  ai: AINode,
  action: ActionNode,
  condition: ConditionNode,
  output: OutputNode,
};

const initialNodes: WorkflowNode[] = [
  {
    id: '1',
    type: 'webhook',
    position: { x: 100, y: 100 },
    data: { label: 'Webhook Trigger', type: 'webhook', config: { method: 'POST' } },
  },
];

const initialEdges: WorkflowEdge[] = [];

export default function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const n8nService = useRef(new N8nService(process.env.NEXT_PUBLIC_N8N_API_KEY!));

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as WorkflowNode);
  }, []);

  const addNode = (type: string) => {
    const newNode: WorkflowNode = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        type,
        config: getDefaultConfig(type)
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case 'webhook':
        return { method: 'POST', path: '/webhook' };
      case 'ai':
        return { model: 'anthropic/claude-3-haiku:beta', prompt: 'Analyze this data: {{ $json }}' };
      case 'action':
        return { action: 'create_task', parameters: {} };
      case 'condition':
        return { condition: '{{ $json.score > 0.8 }}', truePath: 'approve', falsePath: 'reject' };
      case 'output':
        return { format: 'json', destination: 'database' };
      default:
        return {};
    }
  };

  const updateNodeConfig = (nodeId: string, config: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } }
          : node
      )
    );
  };

  const saveWorkflow = async () => {
    const workflow = {
      name: 'Custom Workflow',
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        parameters: node.data.config,
      })),
      connections: edges.reduce((acc, edge) => {
        if (!acc[edge.source]) acc[edge.source] = { main: [] };
        acc[edge.source].main.push([{ node: edge.target, type: 'main', index: 0 }]);
        return acc;
      }, {} as any),
    };

    try {
      await n8nService.current.createWorkflow(workflow);
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Failed to save workflow:', error);
      alert('Failed to save workflow');
    }
  };

  const deployWorkflow = async () => {
    const workflow = {
      name: 'Deployed Workflow',
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        parameters: node.data.config,
      })),
      connections: edges.reduce((acc, edge) => {
        if (!acc[edge.source]) acc[edge.source] = { main: [] };
        acc[edge.source].main.push([{ node: edge.target, type: 'main', index: 0 }]);
        return acc;
      }, {} as any),
    };

    try {
      const createdWorkflow = await n8nService.current.createWorkflow(workflow);
      await n8nService.current.toggleWorkflow(createdWorkflow.id, true);
      alert('Workflow deployed and activated!');
    } catch (error) {
      console.error('Failed to deploy workflow:', error);
      alert('Failed to deploy workflow');
    }
  };

  return (
    <div className="h-full w-full">
      <ReactFlow
        ref={reactFlowWrapper}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background />

        <Panel position="top-left">
          <div className="flex gap-2 mb-4">
            <button onClick={() => addNode('webhook')} className="px-3 py-1 bg-blue-500 text-white rounded">+ Webhook</button>
            <button onClick={() => addNode('ai')} className="px-3 py-1 bg-green-500 text-white rounded">+ AI</button>
            <button onClick={() => addNode('action')} className="px-3 py-1 bg-purple-500 text-white rounded">+ Action</button>
            <button onClick={() => addNode('condition')} className="px-3 py-1 bg-yellow-500 text-white rounded">+ Condition</button>
            <button onClick={() => addNode('output')} className="px-3 py-1 bg-red-500 text-white rounded">+ Output</button>
          </div>
          <div className="flex gap-2">
            <button onClick={saveWorkflow} className="px-3 py-1 bg-gray-500 text-white rounded">Save</button>
            <button onClick={deployWorkflow} className="px-3 py-1 bg-orange-500 text-white rounded">Deploy</button>
          </div>
        </Panel>

        {selectedNode && (
          <Panel position="top-right">
            <NodeConfigPanel node={selectedNode} onUpdate={updateNodeConfig} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}

// Node Components
function WebhookNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-blue-100 border-2 border-blue-300">
      <div className="font-bold">{data.label}</div>
      <div className="text-sm">{data.config.method}</div>
    </div>
  );
}

function AINode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-green-100 border-2 border-green-300">
      <div className="font-bold">{data.label}</div>
      <div className="text-sm">{data.config.model.split('/').pop()}</div>
    </div>
  );
}

function ActionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-purple-100 border-2 border-purple-300">
      <div className="font-bold">{data.label}</div>
      <div className="text-sm">{data.config.action}</div>
    </div>
  );
}

function ConditionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-yellow-100 border-2 border-yellow-300">
      <div className="font-bold">{data.label}</div>
      <div className="text-sm">If/Else</div>
    </div>
  );
}

function OutputNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-red-100 border-2 border-red-300">
      <div className="font-bold">{data.label}</div>
      <div className="text-sm">{data.config.format}</div>
    </div>
  );
}

function NodeConfigPanel({ node, onUpdate }: { node: WorkflowNode; onUpdate: (nodeId: string, config: any) => void }) {
  const [config, setConfig] = useState(node.data.config);

  const handleSave = () => {
    onUpdate(node.id, config);
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg w-80">
      <h3 className="font-bold mb-2">{node.data.label} Configuration</h3>
      {Object.entries(config).map(([key, value]) => (
        <div key={key} className="mb-2">
          <label className="block text-sm font-medium mb-1">{key}</label>
          <input
            type="text"
            value={value as string}
            onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
            className="w-full p-1 border rounded"
          />
        </div>
      ))}
      <button onClick={handleSave} className="w-full bg-blue-500 text-white py-2 rounded">Save Config</button>
    </div>
  );
}