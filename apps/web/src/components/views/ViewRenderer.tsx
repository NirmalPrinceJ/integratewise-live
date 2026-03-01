import React from 'react';
import { ProtectedView } from '../ProtectedView';
import * as ViewComponents from './view-components';

interface ViewRendererProps {
  componentName: string;
  viewId: string;
}

export function ViewRenderer({ componentName, viewId }: ViewRendererProps) {
  // Get the component from the registry
  const Component = (ViewComponents as any)[componentName];

  if (!Component) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Component Not Found</h3>
          <p className="text-sm text-gray-600">The component "{componentName}" is not implemented yet.</p>
          <p className="text-xs text-gray-500 mt-2">View ID: {viewId}</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedView viewId={viewId}>
      <Component />
    </ProtectedView>
  );
}