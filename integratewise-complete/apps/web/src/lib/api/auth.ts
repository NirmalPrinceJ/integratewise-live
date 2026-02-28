/**
 * Auth API - User authentication and session management
 * L3: Supabase Auth integration
 */

import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  workspaceId: string;
  workspaceName: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    defaultDomain: string;
  };
}

export interface AuthSession {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user: authUser }, error } = await supabase.auth.getUser();
    
    if (error || !authUser) return null;

    // Get user profile from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, workspaces(name)')
      .eq('id', authUser.id)
      .single();

    return {
      id: authUser.id,
      email: authUser.email!,
      name: profile?.full_name || authUser.email!.split('@')[0],
      avatar: profile?.avatar_url,
      role: profile?.role || 'member',
      workspaceId: profile?.workspace_id,
      workspaceName: profile?.workspaces?.name || 'My Workspace',
      preferences: {
        theme: profile?.theme || 'system',
        notifications: profile?.notifications !== false,
        defaultDomain: profile?.default_domain || 'customer-success',
      },
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Sign in with email/password
 */
export async function signIn(email: string, password: string): Promise<{ user: User | null; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const user = await getCurrentUser();
    return { user };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(provider: 'google' | 'github' | 'microsoft') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/app/dashboard`,
      },
    });

    if (error) throw error;
    return { url: data.url };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Sign up new user
 */
export async function signUp(email: string, password: string, name: string): Promise<{ user: User | null; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;

    const user = await getCurrentUser();
    return { user };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Subscribe to auth changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      const user = await getCurrentUser();
      callback(user);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });

  return () => subscription.unsubscribe();
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: Partial<User>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.name,
        avatar_url: updates.avatar,
        theme: updates.preferences?.theme,
        notifications: updates.preferences?.notifications,
        default_domain: updates.preferences?.defaultDomain,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
}
