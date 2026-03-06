// Re-export wrapper for sales views with missing exports
export { DealsView, ForecastingView } from '../sales-views-original';

// Add missing view shims
import React from 'react';

export const PipelineView: React.FC = () => {
  return <div className="pipeline-view">Pipeline View (Stub)</div>;
};

export const ActivityView: React.FC = () => {
  return <div className="activity-view">Activity View (Stub)</div>;
};

export const LeaderboardView: React.FC = () => {
  return <div className="leaderboard-view">Leaderboard View (Stub)</div>;
};

export const ContactsView: React.FC = () => {
  return <div className="contacts-view">Contacts View (Stub)</div>;
};
