import React from 'react';
import { useViewAccess } from '../hooks/useViewAccess';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Lock, Crown } from 'lucide-react';

interface ProtectedViewProps {
  viewId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedView: React.FC<ProtectedViewProps> = ({
  viewId,
  children,
  fallback
}) => {
  const { allowed, reason, upgradeUrl } = useViewAccess(viewId);

  if (allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Include the feature context in upgrade URL
  const upgradeUrlWithFeature = upgradeUrl 
    ? `${upgradeUrl}${upgradeUrl.includes('?') ? '&' : '?'}feature=${encodeURIComponent(viewId)}`
    : `/upgrade?feature=${encodeURIComponent(viewId)}`;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">Access Restricted</CardTitle>
          <CardDescription>
            {reason || 'You don\'t have permission to view this content.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild className="w-full">
            <a href={upgradeUrlWithFeature}>
              <Crown className="mr-2 h-4 w-4" />
              Upgrade Plan
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};