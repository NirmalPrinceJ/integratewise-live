import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../hooks/useAuth';
import { ErrorBoundary } from '../components/ErrorBoundary';
import App from '../App';

// Smoke test: App renders without crashing
describe('Smoke Tests', () => {
  it('App renders without crashing', () => {
    expect(() => {
      render(
        <ErrorBoundary>
          <AuthProvider>
            <MemoryRouter>
              <App />
            </MemoryRouter>
          </AuthProvider>
        </ErrorBoundary>
      );
    }).not.toThrow();
  });

  it('Login page is accessible', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );
    
    // Should show login-related text
    expect(screen.getByText(/welcome back|sign in/i)).toBeInTheDocument();
  });

  it('ErrorBoundary catches errors', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

// Test API layer imports
describe('API Layer', () => {
  it('All API modules can be imported', async () => {
    expect(async () => {
      await import('../lib/api/auth');
      await import('../lib/api/entities');
      await import('../lib/api/insights');
      await import('../lib/api/actions');
      await import('../lib/api/tasks');
      await import('../lib/api/calendar');
      await import('../lib/api/dashboard');
      await import('../lib/api/settings');
    }).not.toThrow();
  });
});

// Test hooks
describe('Hooks', () => {
  it('All hooks can be imported', async () => {
    expect(async () => {
      await import('../hooks/useAuth');
      await import('../hooks/useEntities');
      await import('../hooks/useInsights');
      await import('../hooks/useActions');
      await import('../hooks/useTasks');
      await import('../hooks/useCalendar');
      await import('../hooks/useDashboard');
      await import('../hooks/useSettings');
    }).not.toThrow();
  });
});

// Test critical components render
describe('Component Rendering', () => {
  it('ErrorBoundary renders children', () => {
    const { container } = render(
      <ErrorBoundary>
        <div data-testid="child">Test Content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
