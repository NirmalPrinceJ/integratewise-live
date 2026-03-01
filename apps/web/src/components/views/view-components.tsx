/**
 * View Components Registry
 * Maps component names from VIEW_REGISTRY to actual React components
 * Day 4: UI Polish + Integration
 */

// Core Views (Implemented)
export { default as TodayView } from './TodayView';
export { default as Entity360View } from './Entity360View';
export { default as ActHistoryView } from './ActHistoryView';
export { default as AuditLogsView } from './AuditLogsView';

// Placeholder for missing components
const ComponentNotImplemented = ({ componentName }: { componentName: string }) => (
  <div className="flex items-center justify-center min-h-[400px] p-4">
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Component Not Implemented</h3>
      <p className="text-sm text-gray-600">The component "{componentName}" is not implemented yet.</p>
    </div>
  </div>
);

// Admin Views (Placeholder - implement as needed)
export const AdminDashboardView = () => <ComponentNotImplemented componentName="AdminDashboardView" />;
export const TenantListView = () => <ComponentNotImplemented componentName="TenantListView" />;
export const TenantDetailView = () => <ComponentNotImplemented componentName="TenantDetailView" />;
export const UserManagementView = () => <ComponentNotImplemented componentName="UserManagementView" />;
export const RoleManagementView = () => <ComponentNotImplemented componentName="RoleManagementView" />;
export const SystemHealthView = () => <ComponentNotImplemented componentName="SystemHealthView" />;
export const FeatureFlagsView = () => <ComponentNotImplemented componentName="FeatureFlagsView" />;
export const ApiKeysView = () => <ComponentNotImplemented componentName="ApiKeysView" />;
export const BillingOverviewView = () => <ComponentNotImplemented componentName="BillingOverviewView" />;
export const UsageAnalyticsView = () => <ComponentNotImplemented componentName="UsageAnalyticsView" />;
export const SecuritySettingsView = () => <ComponentNotImplemented componentName="SecuritySettingsView" />;
export const DataRetentionView = () => <ComponentNotImplemented componentName="DataRetentionView" />;
export const BackupRestoreView = () => <ComponentNotImplemented componentName="BackupRestoreView" />;
export const IntegrationStatusView = () => <ComponentNotImplemented componentName="IntegrationStatusView" />;
export const NotificationSettingsView = () => <ComponentNotImplemented componentName="NotificationSettingsView" />;
export const ComplianceReportsView = () => <ComponentNotImplemented componentName="ComplianceReportsView" />;
export const SystemConfigurationView = () => <ComponentNotImplemented componentName="SystemConfigurationView" />;
export const PerformanceMetricsView = () => <ComponentNotImplemented componentName="PerformanceMetricsView" />;

// CRM Views (Placeholder)
export const CrmDashboardView = () => <ComponentNotImplemented componentName="CrmDashboardView" />;
export const ContactsView = () => <ComponentNotImplemented componentName="ContactsView" />;
export const AccountsView = () => <ComponentNotImplemented componentName="AccountsView" />;
export const LeadsView = () => <ComponentNotImplemented componentName="LeadsView" />;
export const OpportunitiesView = () => <ComponentNotImplemented componentName="OpportunitiesView" />;
export const ActivitiesView = () => <ComponentNotImplemented componentName="ActivitiesView" />;
export const CampaignsView = () => <ComponentNotImplemented componentName="CampaignsView" />;
export const ReportsView = () => <ComponentNotImplemented componentName="ReportsView" />;
export const TerritoriesView = () => <ComponentNotImplemented componentName="TerritoriesView" />;

// Operations Views (Placeholder)
export const OperationsDashboardView = () => <ComponentNotImplemented componentName="OperationsDashboardView" />;
export const TasksView = () => <ComponentNotImplemented componentName="TasksView" />;
export const GoalsMilestonesView = () => <ComponentNotImplemented componentName="GoalsMilestonesView" />;
export const ProjectsView = () => <ComponentNotImplemented componentName="ProjectsView" />;
export const SessionsView = () => <ComponentNotImplemented componentName="SessionsView" />;
export const ContextView = () => <ComponentNotImplemented componentName="ContextView" />;
export const IqHubView = () => <ComponentNotImplemented componentName="IqHubView" />;
export const IntegrationsView = () => <ComponentNotImplemented componentName="IntegrationsView" />;

// Knowledge Views (Placeholder)
export const KnowledgeDashboardView = () => <ComponentNotImplemented componentName="KnowledgeDashboardView" />;
export const KnowledgeBaseView = () => <ComponentNotImplemented componentName="KnowledgeBaseView" />;
export const DocumentsView = () => <ComponentNotImplemented componentName="DocumentsView" />;
export const FaqView = () => <ComponentNotImplemented componentName="FaqView" />;
export const TrainingMaterialsView = () => <ComponentNotImplemented componentName="TrainingMaterialsView" />;
export const KnowledgeSearchView = () => <ComponentNotImplemented componentName="KnowledgeSearchView" />;
export const ContentLibraryView = () => <ComponentNotImplemented componentName="ContentLibraryView" />;

// Spine/SSOT Views (Placeholder)
export const SpineDashboardView = () => <ComponentNotImplemented componentName="SpineDashboardView" />;
export const DataSourcesView = () => <ComponentNotImplemented componentName="DataSourcesView" />;
export const DataFlowView = () => <ComponentNotImplemented componentName="DataFlowView" />;
export const SchemaManagementView = () => <ComponentNotImplemented componentName="SchemaManagementView" />;
export const DataQualityView = () => <ComponentNotImplemented componentName="DataQualityView" />;
export const MasterDataView = () => <ComponentNotImplemented componentName="MasterDataView" />;
export const DataLineageView = () => <ComponentNotImplemented componentName="DataLineageView" />;

// Intelligence Views (Placeholder)
export const IntelligenceDashboardView = () => <ComponentNotImplemented componentName="IntelligenceDashboardView" />;
export const SignalsView = () => <ComponentNotImplemented componentName="SignalsView" />;
export const SituationsView = () => <ComponentNotImplemented componentName="SituationsView" />;
export const InsightsView = () => <ComponentNotImplemented componentName="InsightsView" />;
export const PredictiveAnalyticsView = () => <ComponentNotImplemented componentName="PredictiveAnalyticsView" />;
export const AnomalyDetectionView = () => <ComponentNotImplemented componentName="AnomalyDetectionView" />;
export const TrendAnalysisView = () => <ComponentNotImplemented componentName="TrendAnalysisView" />;
export const RecommendationEngineView = () => <ComponentNotImplemented componentName="RecommendationEngineView" />;

// Sales Views (Placeholder)
export const SalesDashboardView = () => <ComponentNotImplemented componentName="SalesDashboardView" />;
export const SalesHubView = () => <ComponentNotImplemented componentName="SalesHubView" />;
export const PipelineView = () => <ComponentNotImplemented componentName="PipelineView" />;
export const DealsView = () => <ComponentNotImplemented componentName="DealsView" />;
export const ForecastingView = () => <ComponentNotImplemented componentName="ForecastingView" />;
export const QuotasView = () => <ComponentNotImplemented componentName="QuotasView" />;
export const SalesReportsView = () => <ComponentNotImplemented componentName="SalesReportsView" />;
export const TerritoryManagementView = () => <ComponentNotImplemented componentName="TerritoryManagementView" />;
export const CompetitiveAnalysisView = () => <ComponentNotImplemented componentName="CompetitiveAnalysisView" />;

// Customer Success Views (Placeholder)
export const CsDashboardView = () => <ComponentNotImplemented componentName="CsDashboardView" />;
export const CustomersView = () => <ComponentNotImplemented componentName="CustomersView" />;
export const ClientDetailView = () => <ComponentNotImplemented componentName="ClientDetailView" />;
export const HealthScoresView = () => <ComponentNotImplemented componentName="HealthScoresView" />;
export const ChurnRiskView = () => <ComponentNotImplemented componentName="ChurnRiskView" />;
export const ExpansionOpportunitiesView = () => <ComponentNotImplemented componentName="ExpansionOpportunitiesView" />;
export const CustomerJourneyView = () => <ComponentNotImplemented componentName="CustomerJourneyView" />;
export const SupportTicketsView = () => <ComponentNotImplemented componentName="SupportTicketsView" />;
export const OnboardingView = () => <ComponentNotImplemented componentName="OnboardingView" />;

// Marketing Views (Placeholder)
export const MarketingDashboardView = () => <ComponentNotImplemented componentName="MarketingDashboardView" />;
export const CampaignManagerView = () => <ComponentNotImplemented componentName="CampaignManagerView" />;
export const LeadGenerationView = () => <ComponentNotImplemented componentName="LeadGenerationView" />;
export const ContentMarketingView = () => <ComponentNotImplemented componentName="ContentMarketingView" />;
export const SocialMediaView = () => <ComponentNotImplemented componentName="SocialMediaView" />;
export const EmailMarketingView = () => <ComponentNotImplemented componentName="EmailMarketingView" />;
export const SeoSemView = () => <ComponentNotImplemented componentName="SeoSemView" />;
export const MarketingAnalyticsView = () => <ComponentNotImplemented componentName="MarketingAnalyticsView" />;

// Finance Views (Placeholder)
export const FinanceDashboardView = () => <ComponentNotImplemented componentName="FinanceDashboardView" />;
export const FinancialReportsView = () => <ComponentNotImplemented componentName="FinancialReportsView" />;
export const BudgetManagementView = () => <ComponentNotImplemented componentName="BudgetManagementView" />;
export const ExpenseTrackingView = () => <ComponentNotImplemented componentName="ExpenseTrackingView" />;
export const RevenueAnalyticsView = () => <ComponentNotImplemented componentName="RevenueAnalyticsView" />;
export const ProfitLossView = () => <ComponentNotImplemented componentName="ProfitLossView" />;

// Projects Views (Placeholder)
export const ProjectsDashboardView = () => <ComponentNotImplemented componentName="ProjectsDashboardView" />;
export const ProjectDetailView = () => <ComponentNotImplemented componentName="ProjectDetailView" />;
export const ProjectPlanningView = () => <ComponentNotImplemented componentName="ProjectPlanningView" />;
export const ResourceAllocationView = () => <ComponentNotImplemented componentName="ResourceAllocationView" />;

// System Views (Placeholder)
export const SystemDashboardView = () => <ComponentNotImplemented componentName="SystemDashboardView" />;
export const ArchitectureView = () => <ComponentNotImplemented componentName="ArchitectureView" />;
export const MonitoringView = () => <ComponentNotImplemented componentName="MonitoringView" />;
export const LogsView = () => <ComponentNotImplemented componentName="LogsView" />;
export const AlertsView = () => <ComponentNotImplemented componentName="AlertsView" />;

// Act Views (Placeholder)
export const ActDashboardView = () => <ComponentNotImplemented componentName="ActDashboardView" />;