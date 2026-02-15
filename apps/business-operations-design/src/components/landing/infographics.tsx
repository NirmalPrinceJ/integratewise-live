import React from "react";

export function TeamCollaborationInfographic({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Team collaboration infographic"
    >
      {/* Background */}
      <rect width="400" height="300" fill="#F0FDF4" />
      
      {/* Connected nodes representing unified workspace */}
      <circle cx="200" cy="150" r="60" fill="#059669" fillOpacity="0.1" />
      <circle cx="200" cy="150" r="40" fill="#059669" fillOpacity="0.2" />
      <circle cx="200" cy="150" r="20" fill="#059669" />
      
      {/* Surrounding tools */}
      <circle cx="120" cy="100" r="18" fill="#047857" />
      <circle cx="280" cy="100" r="18" fill="#047857" />
      <circle cx="120" cy="200" r="18" fill="#047857" />
      <circle cx="280" cy="200" r="18" fill="#047857" />
      
      {/* Connection lines */}
      <line x1="200" y1="150" x2="120" y2="100" stroke="#059669" strokeWidth="2" opacity="0.4" />
      <line x1="200" y1="150" x2="280" y2="100" stroke="#059669" strokeWidth="2" opacity="0.4" />
      <line x1="200" y1="150" x2="120" y2="200" stroke="#059669" strokeWidth="2" opacity="0.4" />
      <line x1="200" y1="150" x2="280" y2="200" stroke="#059669" strokeWidth="2" opacity="0.4" />
      
      {/* Tool labels */}
      <text x="120" y="95" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="600">CRM</text>
      <text x="280" y="95" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="600">Support</text>
      <text x="120" y="225" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="600">Docs</text>
      <text x="280" y="225" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="600">Tasks</text>
      
      {/* Center label */}
      <text x="200" y="155" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">Unified</text>
    </svg>
  );
}

export function AICircuitInfographic({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="AI intelligence circuit infographic"
    >
      {/* Background */}
      <rect width="400" height="300" fill="#F0FDF4" />
      
      {/* Circuit board pattern */}
      <g opacity="0.3">
        {/* Horizontal lines */}
        <line x1="0" y1="75" x2="400" y2="75" stroke="#059669" strokeWidth="1" />
        <line x1="0" y1="150" x2="400" y2="150" stroke="#059669" strokeWidth="2" />
        <line x1="0" y1="225" x2="400" y2="225" stroke="#059669" strokeWidth="1" />
        
        {/* Vertical lines */}
        <line x1="100" y1="0" x2="100" y2="300" stroke="#059669" strokeWidth="1" />
        <line x1="200" y1="0" x2="200" y2="300" stroke="#059669" strokeWidth="2" />
        <line x1="300" y1="0" x2="300" y2="300" stroke="#059669" strokeWidth="1" />
      </g>
      
      {/* Neural nodes */}
      <circle cx="100" cy="75" r="8" fill="#059669" />
      <circle cx="200" cy="75" r="10" fill="#047857" />
      <circle cx="300" cy="75" r="8" fill="#059669" />
      
      <circle cx="100" cy="150" r="10" fill="#047857" />
      <circle cx="200" cy="150" r="14" fill="#10B981" />
      <circle cx="300" cy="150" r="10" fill="#047857" />
      
      <circle cx="100" cy="225" r="8" fill="#059669" />
      <circle cx="200" cy="225" r="10" fill="#047857" />
      <circle cx="300" cy="225" r="8" fill="#059669" />
      
      {/* Central AI core */}
      <circle cx="200" cy="150" r="40" fill="none" stroke="#047857" strokeWidth="3" opacity="0.5" />
      <circle cx="200" cy="150" r="25" fill="none" stroke="#10B981" strokeWidth="2" />
      
      {/* AI label */}
      <text x="200" y="155" textAnchor="middle" fill="#111827" fontSize="14" fontWeight="700">AI</text>
      <text x="200" y="170" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="600">Think Engine</text>
    </svg>
  );
}

export function NetworkInfographic({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Connected network technology infographic"
    >
      {/* Background */}
      <rect width="400" height="300" fill="#F0FDF4" />
      
      {/* Network mesh */}
      <g opacity="0.3" stroke="#059669" strokeWidth="1.5">
        <line x1="50" y1="50" x2="150" y2="100" />
        <line x1="150" y1="100" x2="250" y2="80" />
        <line x1="250" y1="80" x2="350" y2="120" />
        <line x1="50" y1="50" x2="80" y2="180" />
        <line x1="80" y1="180" x2="200" y2="220" />
        <line x1="200" y1="220" x2="320" y2="200" />
        <line x1="320" y1="200" x2="350" y2="120" />
        <line x1="150" y1="100" x2="200" y2="220" />
        <line x1="250" y1="80" x2="320" y2="200" />
      </g>
      
      {/* Main nodes */}
      <circle cx="50" cy="50" r="16" fill="#047857" />
      <circle cx="150" cy="100" r="20" fill="#059669" />
      <circle cx="250" cy="80" r="18" fill="#047857" />
      <circle cx="350" cy="120" r="16" fill="#047857" />
      <circle cx="80" cy="180" r="18" fill="#047857" />
      <circle cx="200" cy="220" r="22" fill="#10B981" />
      <circle cx="320" cy="200" r="18" fill="#047857" />
      
      {/* Connection pulses */}
      <circle cx="100" cy="75" r="6" fill="#10B981" opacity="0.8" />
      <circle cx="200" cy="90" r="6" fill="#10B981" opacity="0.8" />
      <circle cx="260" cy="180" r="6" fill="#10B981" opacity="0.8" />
      
      {/* Labels */}
      <text x="200" y="270" textAnchor="middle" fill="#111827" fontSize="12" fontWeight="700">Connected Ecosystem</text>
      <text x="200" y="285" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="600">7 Pillars Unified</text>
    </svg>
  );
}

// Infographic 4: Data Flow Visualization (for platform/architecture pages)
export function DataFlowInfographic({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 600" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect width="800" height="600" fill="#F0FDF4" />
      
      {/* Data streams */}
      {[...Array(5)].map((_, i) => (
        <path
          key={i}
          d={`M 100 ${100 + i * 100} Q 400 ${150 + i * 100} 700 ${100 + i * 100}`}
          stroke="#059669"
          strokeWidth="3"
          fill="none"
          opacity="0.3"
          strokeDasharray="10 5"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="30"
            dur={`${2 + i * 0.5}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}
      
      {/* Central spine */}
      <rect x="350" y="200" width="100" height="200" rx="12" fill="#059669" opacity="0.9" />
      <text x="400" y="310" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">SPINE</text>
      
      {/* Connectors */}
      {[
        { x: 150, y: 150, label: "CRM" },
        { x: 150, y: 450, label: "Support" },
        { x: 650, y: 150, label: "Finance" },
        { x: 650, y: 450, label: "Analytics" },
      ].map((node, i) => (
        <g key={i}>
          <circle cx={node.x} cy={node.y} r="35" fill="url(#dataFlow)" stroke="#047857" strokeWidth="2" />
          <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#047857" fontSize="12" fontWeight="bold">{node.label}</text>
        </g>
      ))}
      
      <text x="400" y="550" textAnchor="middle" fill="#047857" fontSize="14" fontWeight="bold">
        Universal Data Intelligence
      </text>
    </svg>
  );
}

// Infographic 5: Security Shield (for security pages)
export function SecurityShieldInfographic({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 600" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect width="800" height="600" fill="#F0FDF4" />
      
      {/* Shield shape */}
      <path
        d="M 400 100 L 600 200 L 600 400 Q 600 500 400 550 Q 200 500 200 400 L 200 200 Z"
        fill="url(#shieldGrad)"
        opacity="0.15"
      />
      <path
        d="M 400 100 L 600 200 L 600 400 Q 600 500 400 550 Q 200 500 200 400 L 200 200 Z"
        fill="none"
        stroke="#059669"
        strokeWidth="4"
      />
      
      {/* Lock icon */}
      <rect x="360" y="300" width="80" height="100" rx="8" fill="#059669" />
      <circle cx="400" cy="270" r="30" fill="none" stroke="#059669" strokeWidth="12" />
      <circle cx="400" cy="350" r="8" fill="white" />
      <rect x="396" y="355" width="8" height="25" rx="2" fill="white" />
      
      {/* Security layers */}
      {[...Array(3)].map((_, i) => (
        <circle
          key={i}
          cx="400"
          cy="325"
          r={120 + i * 40}
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          opacity={0.3 - i * 0.1}
          strokeDasharray="5 10"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 400 325`}
            to={`360 400 325`}
            dur={`${8 + i * 2}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      
      <text x="400" y="530" textAnchor="middle" fill="#047857" fontSize="14" fontWeight="bold">
        Enterprise-Grade Security
      </text>
    </svg>
  );
}

// Infographic 6: Workflow Automation (for use case pages)
export function WorkflowAutomationInfographic({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 600" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="600" fill="#F0FDF4" />
      
      {/* Workflow steps */}
      {[
        { x: 150, y: 200, label: "Trigger", color: "#059669" },
        { x: 300, y: 200, label: "Process", color: "#047857" },
        { x: 450, y: 200, label: "Decide", color: "#10B981" },
        { x: 600, y: 200, label: "Execute", color: "#059669" },
      ].map((step, i) => (
        <g key={i}>
          <rect
            x={step.x - 50}
            y={step.y - 30}
            width="100"
            height="60"
            rx="12"
            fill={step.color}
            opacity="0.15"
          />
          <rect
            x={step.x - 50}
            y={step.y - 30}
            width="100"
            height="60"
            rx="12"
            fill="none"
            stroke={step.color}
            strokeWidth="3"
          />
          <text x={step.x} y={step.y + 5} textAnchor="middle" fill={step.color} fontSize="13" fontWeight="bold">
            {step.label}
          </text>
          
          {/* Arrow to next */}
          {i < 3 && (
            <path
              d={`M ${step.x + 50} ${step.y} L ${step.x + 100} ${step.y}`}
              stroke={step.color}
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
          )}
        </g>
      ))}
      
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#059669" />
        </marker>
      </defs>
      
      {/* Intelligence layer */}
      <rect x="100" y="350" width="600" height="120" rx="16" fill="#059669" opacity="0.08" />
      <text x="400" y="400" textAnchor="middle" fill="#047857" fontSize="16" fontWeight="bold">
        AI Intelligence Layer
      </text>
      <text x="400" y="430" textAnchor="middle" fill="#059669" fontSize="12">
        Human-Approved • Evidence-Backed • Context-Aware
      </text>
      
      <text x="400" y="550" textAnchor="middle" fill="#047857" fontSize="14" fontWeight="bold">
        Intelligent Workflow Automation
      </text>
    </svg>
  );
}

// Infographic 7: Role Dashboard (for role pages)
export function RoleDashboardInfographic({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 600" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="600" fill="#F0FDF4" />
      
      {/* Dashboard frame */}
      <rect x="100" y="100" width="600" height="400" rx="16" fill="white" stroke="#E5E7EB" strokeWidth="2" />
      
      {/* Header bar */}
      <rect x="100" y="100" width="600" height="50" rx="16" fill="#059669" opacity="0.9" />
      <text x="130" y="135" fill="white" fontSize="16" fontWeight="bold">Customer Success Workspace</text>
      
      {/* Widgets */}
      {[
        { x: 130, y: 180, w: 250, h: 120, label: "Account Health", value: "98.5%" },
        { x: 420, y: 180, w: 250, h: 120, label: "At-Risk Accounts", value: "3" },
        { x: 130, y: 330, w: 540, h: 140, label: "Recent Activity", value: "Timeline" },
      ].map((widget, i) => (
        <g key={i}>
          <rect x={widget.x} y={widget.y} width={widget.w} height={widget.h} rx="12" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2" />
          <text x={widget.x + 15} y={widget.y + 30} fill="#6B7280" fontSize="11" fontWeight="600">{widget.label}</text>
          <text x={widget.x + 15} y={widget.y + 65} fill="#059669" fontSize="24" fontWeight="bold">{widget.value}</text>
        </g>
      ))}
      
      {/* Intelligence indicator */}
      <circle cx="650" cy="125" r="8" fill="#10B981">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="620" y="130" fill="white" fontSize="10">AI</text>
      
      <text x="400" y="550" textAnchor="middle" fill="#047857" fontSize="14" fontWeight="bold">
        Role-Optimized Intelligence
      </text>
    </svg>
  );
}