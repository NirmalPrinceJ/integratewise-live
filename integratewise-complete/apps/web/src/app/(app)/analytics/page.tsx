'use client';

// apps/integratewise-os/src/app/(app)/analytics/page.tsx

import dynamic from 'next/dynamic';

const CustomDashboard = dynamic(
  () => import('../../../components/analytics/custom-dashboard'),
  { ssr: false }
);

export default function AnalyticsPage() {
  return (
    <CustomDashboard
      context={{
        category: 'personal',
        scope: {},
        user_id: 'current-user'
      }}
    />
  );
}