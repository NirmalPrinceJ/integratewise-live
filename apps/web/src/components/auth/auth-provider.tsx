/**
 * Auth Provider — Manages Supabase session state
 * 
 * Handles:
 * - Session persistence (auto-restore on page load)
 * - OAuth callback detection (PKCE code exchange)
 * - Auth state change listener
 * - Login / Signup / Logout / Google OAuth methods
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "../../utils/supabase/client";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import type { Session, User } from "@supabase/supabase-js";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string;
  /** Email/password sign in */
  signIn: (email: string, password: string) => Promise<boolean>;
  /** Email/password sign up (calls server endpoint) */
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  /** Google OAuth sign in */
  signInWithGoogle: () => Promise<void>;
  /** GitHub OAuth sign in */
  signInWithGitHub: () => Promise<void>;
  /** Sign out */
  signOut: () => Promise<void>;
  /** Clear any auth error */
  clearError: () => void;
  /** Access token for authorized server requests */
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Initialize: restore session + listen for changes ──────────────────
  useEffect(() => {
    let mounted = true;

    // 1. Check for existing session
    const initSession = async () => {
      try {
        const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("[AuthProvider] Session restore error:", sessionError.message);
        }
        if (mounted) {
          setSession(existingSession);
          setLoading(false);
        }
      } catch (err) {
        console.error("[AuthProvider] Unexpected error restoring session:", err);
        if (mounted) setLoading(false);
      }
    };

    initSession();

    // 2. Listen for auth state changes (handles OAuth callback automatically)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("[AuthProvider] Auth state change:", event);
        if (mounted) {
          setSession(newSession);
          setLoading(false);

          // Clean up URL after OAuth callback (remove ?code= query params)
          if (event === "SIGNED_IN" && window.location.search.includes("code=")) {
            const cleanUrl = window.location.origin + "/app";
            window.history.replaceState({}, "", cleanUrl);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── Email/Password Sign In ────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError("");
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("[AuthProvider] Sign in error:", signInError.message);
        setError(signInError.message);
        return false;
      }

      setSession(data.session);
      return true;
    } catch (err: any) {
      const msg = err?.message || "Unexpected error during sign in";
      console.error("[AuthProvider] Sign in exception:", msg);
      setError(msg);
      return false;
    }
  }, []);

  // ── Email/Password Sign Up (via server) ───────────────────────────────
  const signUp = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setError("");
    try {
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e3b03387/signup`;
      const res = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        const errMsg = result.error || `Sign up failed (${res.status})`;
        console.error("[AuthProvider] Sign up server error:", errMsg);
        setError(errMsg);
        return false;
      }

      // After signup, auto sign in
      const signedIn = await signIn(email, password);
      return signedIn;
    } catch (err: any) {
      const msg = err?.message || "Network error during sign up";
      console.error("[AuthProvider] Sign up exception:", msg);
      setError(msg);
      return false;
    }
  }, [signIn]);

  // ── Google OAuth Sign In ──────────────────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    setError("");
    try {
      // Redirect back to /app after Google auth (unified routing)
      const redirectTo = window.location.origin + "/app";

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (oauthError) {
        console.error("[AuthProvider] Google OAuth error:", oauthError.message);
        setError(oauthError.message);
      }
      // Browser will redirect — no need to handle response here
    } catch (err: any) {
      const msg = err?.message || "Unexpected error starting Google login";
      console.error("[AuthProvider] Google OAuth exception:", msg);
      setError(msg);
    }
  }, []);

  // ── GitHub OAuth Sign In ──────────────────────────────────────────────
  const signInWithGitHub = useCallback(async () => {
    setError("");
    try {
      // Redirect back to /app after GitHub auth (unified routing)
      const redirectTo = window.location.origin + "/app";

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo,
          scopes: "read:user user:email",
        },
      });

      if (oauthError) {
        console.error("[AuthProvider] GitHub OAuth error:", oauthError.message);
        setError(oauthError.message);
      }
      // Browser will redirect — no need to handle response here
    } catch (err: any) {
      const msg = err?.message || "Unexpected error starting GitHub login";
      console.error("[AuthProvider] GitHub OAuth exception:", msg);
      setError(msg);
    }
  }, []);

  // ── Sign Out ──────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("[AuthProvider] Sign out error:", signOutError.message);
      }
      setSession(null);
    } catch (err: any) {
      console.error("[AuthProvider] Sign out exception:", err?.message);
      setSession(null);
    }
  }, []);

  // ── Clear Error ───────────────────────────────────────────────────────
  const clearError = useCallback(() => setError(""), []);

  // ── Value ─────────────────────────────────────────────────────────────
  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    clearError,
    accessToken: session?.access_token ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
