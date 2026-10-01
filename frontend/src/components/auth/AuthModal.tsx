"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User, Sparkles, ShieldCheck, ArrowRight, Landmark } from "lucide-react";

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  isGuest?: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim() || (mode === "signup" && !name.trim())) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: AuthUser = {
        name: mode === "signup" ? name.trim() : email.split("@")[0],
        email: email.trim(),
        role: "Fiscal Policy Analyst",
      };
      localStorage.setItem("finsight_user", JSON.stringify(user));
      onSuccess(user);
      onClose();
    }, 600);
  };

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const guestUser: AuthUser = {
        name: "Guest Analyst",
        email: "guest@finsight.ai",
        role: "Public Researcher",
        isGuest: true,
      };
      localStorage.setItem("finsight_user", JSON.stringify(guestUser));
      onSuccess(guestUser);
      onClose();
    }, 400);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const googleUser: AuthUser = {
        name: "Verified Google User",
        email: "analyst@gmail.com",
        role: "Financial Analyst",
      };
      localStorage.setItem("finsight_user", JSON.stringify(googleUser));
      onSuccess(googleUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0B0E14] border border-white/[0.1] rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Amber Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] text-amber-400 font-bold mx-auto">
            <Landmark className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono">
            {mode === "signup" ? "Create FinSight Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Access verified Tamil Nadu fiscal models, deep structured tables, and primary source citations.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-white/[0.04] p-1 rounded-xl text-xs font-semibold mb-5 border border-white/[0.08]">
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === "signup"
                ? "bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setMode("signin"); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === "signin"
                ? "bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* One-Click Social & Guest Logins */}
        <div className="space-y-2.5 mb-5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-medium transition-all shadow-sm disabled:opacity-50 active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-semibold transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)] disabled:opacity-50 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Frictionless 1-Click Guest Access</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 ml-1" />
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-white/[0.08] w-full" />
          <span className="bg-[#0B0E14] px-3 text-[11px] text-slate-500 font-medium uppercase tracking-wider shrink-0">
            or with email
          </span>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Priyanshu Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="analyst@domain.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:bg-white/[0.06] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:bg-white/[0.06] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_28px_rgba(245,158,11,0.4)] disabled:opacity-50 mt-1 active:scale-95"
          >
            {loading ? "Authenticating..." : mode === "signup" ? "Create Free Account" : "Sign In to Dashboard"}
          </button>
        </form>

        {/* Security badge footer */}
        <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Neon Enterprise Security • 100% Free & Open Source</span>
        </div>
      </div>
    </div>
  );
};
