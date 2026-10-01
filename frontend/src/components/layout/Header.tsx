"use client";

import React from "react";
import { HealthStatus } from "@/lib/types";
import { AuthUser } from "../auth/AuthModal";
import {
  BarChart3,
  MessageSquare,
  SlidersHorizontal,
  LogOut,
  LogIn,
  Landmark,
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
    <header className="border-b border-zinc-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => onTabChange("tables")}
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm sm:text-base text-zinc-950 tracking-tight">
                FinSight
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                AI
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block">
              Tamil Nadu Fiscal Intelligence (2021–2026)
            </p>
          </div>
        </div>

        {/* Minimalist Segmented Pill Navigation */}
        <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200/60 text-xs font-medium">
          <button
            onClick={() => onTabChange("tables")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === "tables"
                ? "bg-white text-zinc-950 font-semibold shadow-xs"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onTabChange("chat")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === "chat"
                ? "bg-white text-zinc-950 font-semibold shadow-xs"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Analyst</span>
          </button>

          <button
            onClick={() => onTabChange("simulator")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeTab === "simulator"
                ? "bg-white text-zinc-950 font-semibold shadow-xs"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </button>
        </div>

        {/* Right Section: Status & Auth */}
        <div className="flex items-center gap-3 text-xs">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-200/80 text-zinc-600">
            <span
              className={`w-2 h-2 rounded-full ${
                isHealthy ? "bg-emerald-500" : "bg-amber-400"
              }`}
            />
            <span className="text-[11px] font-medium">Postgres Verified</span>
          </div>

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 shadow-xs">
                <div className="w-5 h-5 rounded-full bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-medium text-xs text-zinc-800">
                  {user.name}
                </span>
              </div>
              <button
                onClick={onSignOut}
                title="Sign out"
                className="p-1.5 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
