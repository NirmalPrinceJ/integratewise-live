/**
 * Auth Hook - User authentication and session management
 * L1: React context for auth state
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  getCurrentUser,
  signIn,
  signUp,
  signOut,
  onAuthChange,
  updateProfile,
  type User,
} from '../lib/api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithOAuth: (provider: 'google' | 'github' | 'microsoft') => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial auth check
  useEffect(() => {
    const initAuth = async () => {
      const user = await getCurrentUser();
      setUser(user);
      setLoading(false);
    };

    initAuth();

    // Subscribe to auth changes
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const { user, error } = await signIn(email, password);
      if (error) {
        setError(error);
        return false;
      }
      setUser(user);
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithOAuth = useCallback(async (provider: 'google' | 'github' | 'microsoft') => {
    const { error } = await signInWithOAuth(provider);
    if (error) setError(error);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const { user, error } = await signUp(email, password, name);
      if (error) {
        setError(error);
        return false;
      }
      setUser(user);
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    const success = await updateProfile(user.id, updates);
    if (success) {
      setUser({ ...user, ...updates });
    }
    return success;
  }, [user]);

  const refreshUser = useCallback(async () => {
    const user = await getCurrentUser();
    setUser(user);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    loginWithOAuth,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Re-export from API for convenience
export { signInWithOAuth } from '../lib/api/auth';
export type { User } from '../lib/api/auth';
