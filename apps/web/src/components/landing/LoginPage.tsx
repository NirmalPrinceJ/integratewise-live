import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Brain, Shield, Workflow, Lock, Cpu, Database, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
            {/* LEFT SIDE: Architecture & Technical Showcase */}
            <div className="md:w-[55%] lg:w-[60%] bg-[#0a0a0a] text-white p-8 lg:p-16 flex flex-col relative overflow-hidden hidden md:flex">
                {/* Animated Background Mesh */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <motion.div
                        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-white/[0.05] to-transparent blur-3xl"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Back Link */}
                <div className="relative z-10 mb-12">
                    <Link to="/" className="inline-flex items-center text-sm text-white/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col justify-center max-w-2xl">
                    <Badge className="bg-white/10 text-white hover:bg-white/20 mb-6 w-fit border-white/5">
                        The Context Layer
                    </Badge>
                    <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
                        Not another tool.<br />
                        <span className="text-white/50 italic font-normal">Your intelligence fabric.</span>
                    </h1>

                    <p className="text-lg text-white/50 mb-12 leading-relaxed">
                        IntegrateWise is built on a universal backend that connects your scattered data into a single context-aware layer. Powered by MCP (Model Context Protocol), it acts as the bridge between human intent and machine execution.
                    </p>

                    {/* Architecture Details */}
                    <div className="space-y-8">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                <Brain className="w-5 h-5 text-white/70" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white mb-1">L0 — Domain Awareness</h3>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    The system adapts to your world. It learns your specific language, labels, and behavior to contextualize data properly before any processing happens.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                <Network className="w-5 h-5 text-white/70" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white mb-1">L1 & L2 — The Cognitive Workspace</h3>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    Data flows from connected tools into a unified truth. Insights emerge from connected context, and loop back into your understanding.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                <Database className="w-5 h-5 text-white/70" />
                            </div>
                            <div>
                                <h3 className="font-medium text-white mb-1">L3 — Universal Backend & Control Loops</h3>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    An 8-stage pipeline that normalizes data once, rendering it anywhere. Powered by Loop A (Human-governed Context) and Loop B (System-governed Data).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 mt-12 flex items-center justify-between text-xs text-white/30">
                    <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3" /> E2E Encryption
                    </div>
                    <div>Strict Architecture. No Training on User Data.</div>
                </div>
            </div>

            {/* RIGHT SIDE: Login/Signup Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 relative">
                <div className="w-full max-w-sm">
                    {/* Mobile Logo */}
                    <div className="md:hidden mb-12 flex justify-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Workflow className="h-6 w-6" />
                            <span className="font-semibold text-lg tracking-tight">IntegrateWise</span>
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold tracking-tight mb-2">
                            {isLogin ? "Welcome back" : "Create your workspace"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isLogin ? "Enter your credentials to access your context layer." : "Join thousands of users eliminating digital chaos."}
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate(isLogin ? "/app/login" : "/app/signup"); }}>
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="John Doe" className="h-11" />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="name@example.com" className="h-11" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {isLogin && (
                                    <a href="#" className="text-sm text-gray-500 hover:text-black">
                                        Forgot password?
                                    </a>
                                )}
                            </div>
                            <Input id="password" type="password" className="h-11" />
                        </div>

                        <Button className="w-full h-11 text-base bg-black hover:bg-black/90 text-white mt-6">
                            {isLogin ? "Sign in" : "Create account"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-black font-medium hover:underline"
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Simple Badge component since we don't have the exact import path for ui/badge
function Badge({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold overflow-hidden ${className}`}>
            {children}
        </span>
    );
}
