"use client";

import React from "react";
import { HealthStatus } from "@/lib/types";
import { AuthUser } from "../auth/AuthModal";
import {
  ShieldCheck,
  BarChart3,
  MessageSquare,
  SlidersHorizontal,
  LogOut,
  LogIn,
  Landmark,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  health: HealthStatus | null;
  activeTab: "chat" | "tables" | "simulator";
  onTabChange: (tab: "chat" | "tables" | "simulator") => void;
  user: AuthUser | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  activeTab,
  onTabChange,
  user,
  onOpenAuth,
  onSignOut,
}) => {
  const isHealthy = health?.status === "healthy";

  return (
    <header className="border-b border-white/[0.08] bg-[#090A0F]/85 backdrop-blur-2xl sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand with Huge Luminous Lucide Landmark Icon */}
        <div
          className="flex items-center gap-3.5 cursor-pointer group"
          onClick={() => onTabChange("tables")}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-[0_0_28px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/30 text-black shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Landmark className="w-6 h-6 stroke-[2.4] drop-shadow-sm text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-white tracking-tight font-sans">
                FinSight<span className="text-amber-400">.AI</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Fiscal Intelligence
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block font-medium">
              Tamil Nadu White Paper Analytics (2021–2026)
            </p>
          </div>
        </div>

        {/* Tab Navigation in Obsidian Capsule */}
        <div className="flex items-center bg-[#121622]/90 border border-white/[0.08] rounded-2xl p-1.5 text-xs font-semibold shadow-inner gap-1">
          <button
            onClick={() => onTabChange("tables")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-200 ${
              activeTab === "tables"
                ? "bg-white/[0.12] text-white shadow-md border border-white/20 font-bold"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                activeTab === "tables"
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-zinc-400"
              }`}
            >
              <BarChart3 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span>Fiscal Dashboard</span>
          </button>

          <button
            onClick={() => onTabChange("chat")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-200 ${
              activeTab === "chat"
                ? "bg-white/[0.12] text-white shadow-md border border-white/20 font-bold"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                activeTab === "chat"
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-zinc-400"
              }`}
            >
              <MessageSquare className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span>AI Analyst</span>
          </button>

          <button
            onClick={() => onTabChange("simulator")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-200 ${
              activeTab === "simulator"
                ? "bg-white/[0.12] text-white shadow-md border border-white/20 font-bold"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                activeTab === "simulator"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "text-zinc-400"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span>Shock Simulator</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold uppercase tracking-wider">
              Live
            </span>
          </button>
        </div>

        {/* Right Section: Trust Status & User Action */}
        <div className="flex items-center gap-3 text-xs">
          {/* User Trust Verification Pill */}
          <div className="hidden lg:flex items-center gap-2.5">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-2xs ${
                isHealthy
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isHealthy ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-[11px]">Official Data Verified</span>
            </div>
          </div>

          {/* User Profile / Subtle Sign In */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#151924] border border-white/[0.08] shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-[11px] flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="font-semibold text-xs text-white block leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium block">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={onSignOut}
                title="Sign out"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 hover:text-white border border-white/10 hover:border-white/20 shadow-2xs text-xs font-semibold transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-zinc-400" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
