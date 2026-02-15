"use client";

// apps/integratewise-os/src/app/(app)/workflow-builder/page.tsx
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with ReactFlow
const WorkflowCanvas = dynamic(
  () => import('../../../components/workflow-builder/workflow-canvas'),
  { ssr: false }
);

export default function WorkflowBuilderPage() {
  return (
    <div className="h-screen w-full">
      <WorkflowCanvas />
    </div>
  );
}