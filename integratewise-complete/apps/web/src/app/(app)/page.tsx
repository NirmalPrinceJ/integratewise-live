/**
 * Home Page - Role-Based Dashboard
 * 
 * Automatically renders the appropriate dashboard based on user role.
 */

'use client';

import { useRBAC } from '@/hooks/useRBAC';
import { getRoleConfig } from '@/lib/rbac/roles';
import { AccountSuccessDashboard } from '@/components/domains/account-success/dashboard';
import { SalesOpsDashboard } from '@/components/domains/salesops/dashboard';
import { RevOpsDashboard } from '@/components/domains/revops/dashboard';
import { PersonalDashboard } from '@/components/domains/personal/dashboard';

// Dashboard component mapping
const DASHBOARD_COMPONENTS: Record<string, React.FC> = {
  'account-success': AccountSuccessDashboard,
  'sales-ops': SalesOpsDashboard,
  'rev-ops': RevOpsDashboard,
  'personal': PersonalDashboard,
};

export default function HomePage() {
  const { role, isLoading } = useRBAC();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const roleConfig = getRoleConfig(role?.id || 'personal-pro');
  const shell = roleConfig?.shell || 'personal';

  // Get appropriate dashboard
  const DashboardComponent = DASHBOARD_COMPONENTS[shell] || PersonalDashboard;

  return (
    <div className="h-full overflow-auto">
      <DashboardComponent />
    </div>
  );
}
