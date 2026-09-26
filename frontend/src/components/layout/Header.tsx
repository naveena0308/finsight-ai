"use client";

import React from "react";
import { HealthStatus } from "@/lib/types";
import { AuthUser } from "../auth/AuthModal";
import { Database, Sparkles, BarChart3, MessageSquare, LogOut, User as UserIcon, LogIn } from "lucide-react";

interface HeaderProps {
  health: HealthStatus | null;
  activeTab: "chat" | "tables";
  onTabChange: (tab: "chat" | "tables") => void;
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
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-bold text-xl">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">FinSight AI</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                Agentic RAG
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              TN Fiscal Management White Paper (2021-22 to 2025-26)
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-slate-100/90 border border-slate-200/80 rounded-xl p-1 text-sm font-medium shadow-inner">
          <button
            onClick={() => onTabChange("chat")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "chat"
                ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span>Chat Analyst</span>
          </button>
          <button
            onClick={() => onTabChange("tables")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "tables"
                ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>Visual Dashboard</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-mono font-semibold">
              Live
            </span>
          </button>
        </div>

        {/* Right Section: Status Indicators & User Profile */}
        <div className="flex items-center gap-3 text-xs">
          {/* Status Indicators */}
          <div className="hidden xl:flex items-center gap-2.5">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xs ${
              isHealthy
                ? "bg-emerald-50 border-emerald-200/80 text-emerald-700"
                : "bg-amber-50 border-amber-200/80 text-amber-800"
            }`}>
              <span className={`w-2 h-2 rounded-full ${isHealthy ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium">Neon Postgres</span>
            </div>
          </div>

          {/* User Profile / Sign In Pill */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/90 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-[11px] flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="font-semibold text-xs text-slate-800 block leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={onSignOut}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold shadow-md shadow-amber-500/20 text-xs transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
