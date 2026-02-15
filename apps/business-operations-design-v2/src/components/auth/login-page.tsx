import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Logo } from "../landing/logo";

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: () => void;
  onForgotPassword: () => void;
  onSocialLogin?: () => void;
  error?: string;
  loading?: boolean;
}

const INTEGRATION_LOGOS = ["☁️", "🧡", "💬", "🎧", "💳", "🔵", "📊"];

export function LoginPage({ onLogin, onSignUp, onForgotPassword, onSocialLogin, error, loading }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMessage, setForgotMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex bg-[#0C1222]">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] bg-gradient-to-br from-[#0C1222] to-[#131B2E] flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white/20" style={{
              width: `${200 + i * 120}px`, height: `${200 + i * 120}px`,
              top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            }} />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Logo width={36} />
            <span className="text-xl font-bold text-white">
              Integrate<span className="text-white/70">Wise</span>
            </span>
          </div>
          <p className="text-white/40 text-xs">Integration Intelligence Workspace</p>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Unify your tools.<br />
            <span className="text-[#F54476]">Amplify your growth.</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Connect every tool in your stack. IntegrateWise turns fragmented data into goal-aligned intelligence — from reality to action.
          </p>

          {/* Integration orbit */}
          <div className="flex items-center gap-2 mt-8">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Connects with</span>
            <div className="flex -space-x-1">
              {INTEGRATION_LOGOS.map((logo, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sm border border-white/10"
                >
                  {logo}
                </motion.div>
              ))}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 }}
                className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[9px] text-white/40 font-bold border border-white/10"
              >
                +40
              </motion.div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/30 text-[10px]">
          &copy; 2026 IntegrateWise. All rights reserved.
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[#131B2E]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl shadow-black/20"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Logo width={32} />
            <span className="text-lg font-bold text-[#0F172A]">
              Integrate<span className="text-sky-500">Wise</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Welcome back</h1>
            <p className="text-sm text-slate-500">Sign in to your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <button type="button" onClick={() => { onForgotPassword(); setForgotMessage(true); }} className="text-xs text-sky-600 font-medium hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Forgot password message */}
            {forgotMessage && (
              <div className="bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-xs text-sky-700 flex items-center justify-between">
                <span>Demo mode — enter any credentials to proceed.</span>
                <button type="button" onClick={() => setForgotMessage(false)} className="text-sky-500 hover:text-sky-700 ml-2 font-bold">&times;</button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-sky-500/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSocialLogin ? onSocialLogin() : onLogin("demo@integratewise.com", "demo")}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-2 text-sm font-medium hover:bg-slate-50 transition-all"
            >
              <span className="text-lg">G</span> Google
            </button>
            <button
              type="button"
              onClick={() => onSocialLogin ? onSocialLogin() : onLogin("demo@integratewise.com", "demo")}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-2 text-sm font-medium hover:bg-slate-50 transition-all"
            >
              <span className="text-lg">🔑</span> SSO
            </button>
          </div>

          {/* Sign up */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <button onClick={onSignUp} className="text-sky-500 font-semibold hover:underline">
              Start free trial
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}