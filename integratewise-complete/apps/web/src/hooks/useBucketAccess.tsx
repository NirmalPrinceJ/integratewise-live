'use client';

import { ReactNode } from 'react';
import { useBuckets, useDepartments } from '@/hooks/useBuckets';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ModuleGuardProps {
  children: ReactNode;
  requiredBuckets: string[];
  moduleName: string;
  moduleRoute: string;
}

/**
 * ModuleGuard: Blocks access to L1 modules based on bucket readiness
 * Shows a "locked module" card if requirements not met
 */
export function ModuleGuard({
  children,
  requiredBuckets,
  moduleName,
  moduleRoute,
}: ModuleGuardProps) {
  const { buckets } = useBuckets();

  // Check if all required buckets are SEEDED or LIVE
  const allRequirementsMet = requiredBuckets.every((requiredType) => {
    const bucket = buckets.find((b) => b.bucket_type === requiredType);
    return bucket && ['SEEDED', 'LIVE'].includes(bucket.state);
  });

  if (allRequirementsMet) {
    return <>{children}</>;
  }

  // Show locked state
  const missingBuckets = requiredBuckets.filter((requiredType) => {
    const bucket = buckets.find((b) => b.bucket_type === requiredType);
    return !bucket || !['SEEDED', 'LIVE'].includes(bucket.state);
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="max-w-md border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Lock className="h-12 w-12 text-amber-600 mx-auto" />

            <div>
              <h3 className="font-semibold text-amber-900">{moduleName} is Locked</h3>
              <p className="text-sm text-amber-700 mt-1">
                This module is activated when you've set up the required data sources.
              </p>
            </div>

            <div className="bg-white rounded p-3 text-left">
              <p className="text-xs font-semibold text-gray-600 mb-2">Missing requirements:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                {missingBuckets.map((bucketType) => (
                  <li key={bucketType} className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-amber-600" />
                    Activate <span className="font-mono font-semibold">{bucketType}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
              <Link href="/setup/buckets">Complete Setup</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * useBucketAccess: Hook to check module access
 * Returns whether user can access specific modules
 */
export function useBucketAccess(requiredBuckets: string[]) {
  const { buckets } = useBuckets();

  const canAccess = requiredBuckets.every((requiredType) => {
    const bucket = buckets.find((b) => b.bucket_type === requiredType);
    return bucket && ['SEEDED', 'LIVE'].includes(bucket.state);
  });

  return { canAccess };
}

/**
 * useDepartmentAccess: Hook to check department unlock
 * Returns whether department is unlocked + which modules are unlocked
 */
export function useDepartmentAccess(departmentKey: string) {
  const { buckets } = useBuckets();
  const { departments } = useDepartments();

  const department = departments.find((d) => d.department_key === departmentKey);

  if (!department) {
    return {
      isUnlocked: false,
      unlockedModules: [],
      unlockedRoutes: [],
      metRequirements: 0,
      totalRequirements: 0,
    };
  }

  const metRequirements = department.required_base_buckets.filter((requiredType) => {
    const bucket = buckets.find((b) => b.bucket_type === requiredType);
    return bucket && ['SEEDED', 'LIVE'].includes(bucket.state);
  }).length;

  const isUnlocked = metRequirements === department.required_base_buckets.length;

  return {
    isUnlocked,
    unlockedModules: isUnlocked ? department.unlocked_modules : [],
    unlockedRoutes: isUnlocked ? department.unlocked_routes : [],
    metRequirements,
    totalRequirements: department.required_base_buckets.length,
  };
}
