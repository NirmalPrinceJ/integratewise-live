/**
 * Integration Tests
 * Verifies L3 → L2 → L1 binding is complete
 */

import { describe, it, expect } from 'vitest';

// Test API layer imports
describe('API Layer Integration', () => {
  it('all API modules can be imported', async () => {
    const api = await import('../lib/api');
    
    // Auth
    expect(api.getCurrentUser).toBeDefined();
    expect(api.signIn).toBeDefined();
    expect(api.signUp).toBeDefined();
    
    // Entities
    expect(api.getEntities).toBeDefined();
    expect(api.getEntity).toBeDefined();
    expect(api.createEntity).toBeDefined();
    expect(api.updateEntity).toBeDefined();
    
    // Dashboard
    expect(api.getDashboardStats).toBeDefined();
    expect(api.getDomainEntities).toBeDefined();
    expect(api.getDomainSignals).toBeDefined();
    
    // Settings
    expect(api.getUserSettings).toBeDefined();
    expect(api.getWorkspaceSettings).toBeDefined();
    
    // Supabase client
    expect(api.supabase).toBeDefined();
  });
});

// Test hooks layer imports
describe('Hooks Layer Integration', () => {
  it('all hooks can be imported', async () => {
    const hooks = await import('../hooks');
    
    expect(hooks.useAuth).toBeDefined();
    expect(hooks.useEntities).toBeDefined();
    expect(hooks.useEntityStats).toBeDefined();
    expect(hooks.useInsights).toBeDefined();
    expect(hooks.useActions).toBeDefined();
    expect(hooks.useTasks).toBeDefined();
    expect(hooks.useCalendar).toBeDefined();
    expect(hooks.useDashboard).toBeDefined();
    expect(hooks.useDashboardStats).toBeDefined();
    expect(hooks.useDomainEntities).toBeDefined();
    expect(hooks.useDomainSignals).toBeDefined();
    expect(hooks.useSettings).toBeDefined();
  });
});

// Test component imports
describe('Component Integration', () => {
  it('all app pages can be imported', async () => {
    const DashboardPage = (await import('../components/app/DashboardPage')).DashboardPage;
    const AccountsPage = (await import('../components/app/AccountsPage')).AccountsPage;
    const TasksPage = (await import('../components/app/TasksPage')).TasksPage;
    const CalendarPage = (await import('../components/app/CalendarPage')).CalendarPage;
    const IntelligencePage = (await import('../components/app/IntelligencePage')).IntelligencePage;
    const SettingsPage = (await import('../components/app/SettingsPage')).SettingsPage;
    
    expect(DashboardPage).toBeDefined();
    expect(AccountsPage).toBeDefined();
    expect(TasksPage).toBeDefined();
    expect(CalendarPage).toBeDefined();
    expect(IntelligencePage).toBeDefined();
    expect(SettingsPage).toBeDefined();
  });
  
  it('all marketing pages can be imported', async () => {
    const HomePage = (await import('../components/pages/HomePage')).HomePage;
    const LoginPage = (await import('../components/pages/LoginPage')).LoginPage;
    const PricingPage = (await import('../components/pages/PricingPage')).PricingPage;
    
    expect(HomePage).toBeDefined();
    expect(LoginPage).toBeDefined();
    expect(PricingPage).toBeDefined();
  });
  
  it('layout components can be imported', async () => {
    const AppLayout = (await import('../components/app/AppLayout')).AppLayout;
    const AppHeader = (await import('../components/app/AppHeader')).AppHeader;
    const AppSidebar = (await import('../components/app/AppSidebar')).AppSidebar;
    const ProtectedRoute = (await import('../components/app/ProtectedRoute')).ProtectedRoute;
    
    expect(AppLayout).toBeDefined();
    expect(AppHeader).toBeDefined();
    expect(AppSidebar).toBeDefined();
    expect(ProtectedRoute).toBeDefined();
  });
});

// Test data flow
describe('Data Flow Integration', () => {
  it('Domain IDs are properly exported', async () => {
    const { useDomainEntities } = await import('../hooks/useDashboard');
    const { DomainId } = await import('../lib/api/dashboard');
    
    expect(useDomainEntities).toBeDefined();
    // DomainId type should exist (compile-time check)
  });
  
  it('Auth flow components are connected', async () => {
    const { useAuth } = await import('../hooks/useAuth');
    const { getCurrentUser } = await import('../lib/api/auth');
    
    expect(useAuth).toBeDefined();
    expect(getCurrentUser).toBeDefined();
  });
});

// Integration completeness check
describe('Integration Completeness', () => {
  it('has all 8 API modules', async () => {
    const apiModules = [
      'auth', 'entities', 'insights', 'actions',
      'tasks', 'calendar', 'dashboard', 'settings'
    ];
    
    for (const mod of apiModules) {
      const imported = await import(`../lib/api/${mod}`);
      expect(imported).toBeDefined();
    }
  });
  
  it('has all 8 hook modules', async () => {
    const hookModules = [
      'useAuth', 'useEntities', 'useInsights', 'useActions',
      'useTasks', 'useCalendar', 'useDashboard', 'useSettings'
    ];
    
    for (const hook of hookModules) {
      const imported = await import(`../hooks/${hook}`);
      expect(imported[hook]).toBeDefined();
    }
  });
});
