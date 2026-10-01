"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Landmark,
  Scale,
  TrendingUp,
  TrendingDown,
  Coins,
  ShieldAlert,
  Sparkles,
  SlidersHorizontal,
  Table2,
  Search,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
  LayoutGrid,
  List,
  Building2,
  Activity,
  X,
  Filter,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { TableMetadata } from "@/lib/types";
import {
  DEBT_TRAJECTORY_DATA,
  REVENUE_DEFICIT_DATA,
  COMMITTED_EXPENDITURE_DATA,
  PEER_STATE_COMPARISON_DATA,
} from "@/lib/constants";
import { TableDataModal } from "../tables/TableDataModal";

interface FiscalDashboardProps {
  tables: TableMetadata[];
  loading: boolean;
  onAskAI?: (question: string) => void;
  onNavigateTab?: (tab: "chat" | "tables" | "simulator") => void;
}

export const FiscalDashboard: React.FC<FiscalDashboardProps> = ({
  tables,
  loading,
  onAskAI,
  onNavigateTab,
}) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [chartPerspective, setChartPerspective] = useState<
    "all" | "debt" | "deficit" | "expenditure" | "peers"
  >("all");
  const [tableCatalogView, setTableCatalogView] = useState<"grid" | "list">("grid");
  const [showAllTables, setShowAllTables] = useState<boolean>(false);

  // Chart Interactive Toggles
  const [debtViewMode, setDebtViewMode] = useState<"both" | "debt_only">("both");
  const [deficitViewMode, setDeficitViewMode] = useState<"nominal" | "ratio">("nominal");
  const [peerFilter, setPeerFilter] = useState<"all" | "south">("all");

  // Clean chapter list filtering out "nan"
  const chapters = useMemo(() => {
    return Array.from(
      new Set(
        tables
          .map((t) => t.chapter)
          .filter((c) => Boolean(c) && c.toLowerCase() !== "nan")
      )
    );
  }, [tables]);

  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      const matchesSearch =
        t.caption.toLowerCase().includes(search.toLowerCase()) ||
        t.sql_table_name.toLowerCase().includes(search.toLowerCase()) ||
        (t.chapter && t.chapter.toLowerCase().includes(search.toLowerCase()));
      const matchesChapter =
        selectedChapter === "all" || t.chapter === selectedChapter;
      return matchesSearch && matchesChapter;
    });
  }, [tables, search, selectedChapter]);

  // Peer State comparison filtering
  const filteredPeerData = useMemo(() => {
    if (peerFilter === "south") {
      return PEER_STATE_COMPARISON_DATA.filter((p) =>
        ["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh"].includes(p.state)
      );
    }
    return PEER_STATE_COMPARISON_DATA;
  }, [peerFilter]);

  const displayedTables = showAllTables
    ? filteredTables
    : filteredTables.slice(0, 9);

  return (
    <div className="space-y-10 pb-20">
      {/* Table Data Modal for Clicked Tables */}
      <TableDataModal
        tableName={selectedTable}
        onClose={() => setSelectedTable(null)}
        onAskAI={onAskAI}
      />

      {/* 1. Header Command Deck in Obsidian Glass */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0E121B]/80 backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        {/* Subtle Ambient Radial Backlight */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                Government of Tamil Nadu • State Finances (2021–2026)
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 font-mono">
                White Paper Audited
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Executive Fiscal Health Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Macroeconomic audit of Tamil Nadu&apos;s public debt, FRBM target adherence, committed expenditure crowding-out, and cross-state peer liabilities.
            </p>
          </div>

          {/* Quick Action Bar with Luxury Buttons */}
          <div className="flex items-center flex-wrap gap-3">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("simulator")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <SlidersHorizontal className="w-4 h-4 stroke-[2.4]" />
                <span>Simulate Shocks</span>
              </button>
            )}

            <button
              onClick={() =>
                onAskAI?.(
                  "Provide an executive briefing on the key fiscal challenges facing Tamil Nadu based on the White Paper."
                )
              }
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] text-white font-bold text-xs border border-white/10 hover:border-white/20 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-400 stroke-[2.2]" />
              <span>AI Executive Briefing</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Executive 4-Pillar Metric Deck with HUGE Luminous Icons */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Statutory Fiscal Pillars & Vulnerabilities
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            Click any metric to inspect source table
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1: Outstanding Public Debt */}
          <div
            onClick={() => setSelectedTable("table_2_1")}
            className="group relative overflow-hidden rounded-3xl bg-[#0E121B]/80 backdrop-blur-2xl border border-white/[0.08] p-6 hover:border-amber-500/40 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(245,158,11,0.1)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

            <div>
              <div className="flex items-start justify-between">
                {/* HUGE Luminous Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/30 group-hover:scale-105 transition-transform duration-300">
                  <Landmark className="w-7 h-7 stroke-[2.4] drop-shadow-sm text-slate-950" />
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-white/[0.06] text-zinc-300 border border-white/10">
                  Table 2.1
                </span>
              </div>

              <div className="mt-5 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Total Outstanding Debt
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-mono tracking-tight text-white">
                    ₹9,99,832
                  </span>
                  <span className="text-xs font-bold text-zinc-400 font-mono">Cr</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                  <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  +95.1%
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">Since 2020-21</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold pt-1">
                <span>Inspect Historical Trajectory</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Pillar 2: Debt-to-GSDP vs FRBM Target */}
          <div
            onClick={() => setSelectedTable("table_2_1")}
            className="group relative overflow-hidden rounded-3xl bg-[#0E121B]/80 backdrop-blur-2xl border border-white/[0.08] p-6 hover:border-amber-500/40 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(245,158,11,0.1)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

            <div>
              <div className="flex items-start justify-between">
                {/* HUGE Luminous Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-2 ring-amber-400/20 group-hover:scale-105 transition-transform duration-300">
                  <Scale className="w-7 h-7 stroke-[2.2] drop-shadow-sm" />
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-white/[0.06] text-zinc-300 border border-white/10">
                  FRBM Ratio
                </span>
              </div>

              <div className="mt-5 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Debt-to-GSDP Ratio
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-mono tracking-tight text-white">
                    28.3%
                  </span>
                  <span className="text-xs font-bold text-rose-400 font-mono">+3.3% Over Ceiling</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-white/[0.08] space-y-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>FRBM Ceiling: 25.0%</span>
                  <span className="font-bold text-rose-400">28.3% Actual</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-800/80 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-full"
                    style={{ width: "88%" }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold pt-1">
                <span>View Sustainability Gap</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Pillar 3: Committed Expenditure Crowding-Out */}
          <div
            onClick={() => setSelectedTable("table_5_1")}
            className="group relative overflow-hidden rounded-3xl bg-[#0E121B]/80 backdrop-blur-2xl border border-white/[0.08] p-6 hover:border-amber-500/40 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(245,158,11,0.1)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

            <div>
              <div className="flex items-start justify-between">
                {/* HUGE Luminous Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-2 ring-emerald-400/20 group-hover:scale-105 transition-transform duration-300">
                  <Coins className="w-7 h-7 stroke-[2.2] drop-shadow-sm" />
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-white/[0.06] text-zinc-300 border border-white/10">
                  Table 5.1
                </span>
              </div>

              <div className="mt-5 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Committed Expenditure
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-mono tracking-tight text-white">
                    ₹1,89,110
                  </span>
                  <span className="text-xs font-bold text-zinc-400 font-mono">Cr</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-white/[0.08] space-y-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>Salaries + Pension + Int.</span>
                  <span className="font-bold text-emerald-300">64.4% of Rev Exp</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: "64.4%" }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold pt-1">
                <span>Inspect Crowding-Out Details</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Pillar 4: Revenue Deficit Surge */}
          <div
            onClick={() => setSelectedTable("table_3_1")}
            className="group relative overflow-hidden rounded-3xl bg-[#0E121B]/80 backdrop-blur-2xl border border-white/[0.08] p-6 hover:border-amber-500/40 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_25px_rgba(245,158,11,0.1)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-colors pointer-events-none" />

            <div>
              <div className="flex items-start justify-between">
                {/* HUGE Luminous Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)] ring-2 ring-rose-400/20 group-hover:scale-105 transition-transform duration-300">
                  <TrendingDown className="w-7 h-7 stroke-[2.2] drop-shadow-sm" />
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-white/[0.06] text-zinc-300 border border-white/10">
                  Table 3.1
                </span>
              </div>

              <div className="mt-5 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Revenue Deficit
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-mono tracking-tight text-white">
                    ₹46,538
                  </span>
                  <span className="text-xs font-bold text-rose-400 font-mono">-2.25% GSDP</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                  <ShieldAlert className="w-3.5 h-3.5 stroke-[2.2]" />
                  Structural Gap
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">Target: 0%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold pt-1">
                <span>View COVID & Post-COVID Deficit</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Analytical Deep-Dive Workspace with Perspective Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Visual Analytics & Financial Dynamics
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Interactive multi-year time series extracted directly from source government tables
            </p>
          </div>

          {/* Perspective Selector in Dark Capsule */}
          <div className="flex items-center bg-[#121622] border border-white/[0.08] rounded-2xl p-1 text-xs font-semibold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setChartPerspective("all")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                chartPerspective === "all"
                  ? "bg-white/[0.12] text-white shadow-md font-bold border border-white/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All 4 Views</span>
            </button>
            <button
              onClick={() => setChartPerspective("debt")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                chartPerspective === "debt"
                  ? "bg-white/[0.12] text-white shadow-md font-bold border border-white/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Public Debt</span>
            </button>
            <button
              onClick={() => setChartPerspective("deficit")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                chartPerspective === "deficit"
                  ? "bg-white/[0.12] text-white shadow-md font-bold border border-white/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              <span>Deficits</span>
            </button>
            <button
              onClick={() => setChartPerspective("expenditure")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                chartPerspective === "expenditure"
                  ? "bg-white/[0.12] text-white shadow-md font-bold border border-white/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>Committed Exp</span>
            </button>
            <button
              onClick={() => setChartPerspective("peers")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                chartPerspective === "peers"
                  ? "bg-white/[0.12] text-white shadow-md font-bold border border-white/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Peer States</span>
            </button>
          </div>
        </div>

        {/* Dynamic Dark Mode Chart Grid */}
        <div
          className={`grid gap-6 ${
            chartPerspective === "all"
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {/* Chart 1: Debt Trajectory */}
          {(chartPerspective === "all" || chartPerspective === "debt") && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0E121B]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.5)] space-y-5 hover:border-amber-500/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <TrendingUp className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white">
                      Outstanding Debt & % of GSDP Trajectory
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Table 2.1 (Page 27) • 5-Year Window (2020-21 to 2025-26 Pre-AC)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#141824] p-0.5 rounded-xl text-xs font-medium border border-white/[0.06]">
                    <button
                      onClick={() => setDebtViewMode("both")}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        debtViewMode === "both"
                          ? "bg-white/[0.12] text-white shadow-2xs font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Both
                    </button>
                    <button
                      onClick={() => setDebtViewMode("debt_only")}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        debtViewMode === "debt_only"
                          ? "bg-white/[0.12] text-white shadow-2xs font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Debt Only
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedTable("table_2_1")}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 font-semibold transition-colors"
                  >
                    <Table2 className="w-3.5 h-3.5" />
                    <span>Table 2.1</span>
                  </button>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={DEBT_TRAJECTORY_DATA}
                    margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      unit=" Cr"
                      tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    {debtViewMode === "both" && (
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[25, 30]}
                        unit="%"
                        tick={{ fontSize: 11, fill: "#F59E0B" }}
                        axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                      />
                    )}
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 13, 20, 0.96)",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        boxShadow: "0 16px 36px rgba(0,0,0,0.7)",
                      }}
                      formatter={((value: any, name?: any) => {
                        if (name === "debt")
                          return [`₹${Number(value).toLocaleString("en-IN")} Cr`, "Total Debt"];
                        if (name === "gsdpRatio")
                          return [`${value}%`, "Debt as % of GSDP"];
                        return [value, name];
                      }) as any}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ fontSize: "11px", fontWeight: 600, color: "#94A3B8" }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="debt"
                      name="Total Debt (₹ Cr)"
                      fill="#262D3D"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                      cursor="pointer"
                      onClick={() => setSelectedTable("table_2_1")}
                    />
                    {debtViewMode === "both" && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="gsdpRatio"
                        name="Debt % of GSDP"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#F59E0B", stroke: "#0E121B", strokeWidth: 2 }}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400 pt-3 border-t border-white/[0.08] bg-[#0A0D15]/60 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <span className="font-medium">
                  <strong>Key Finding:</strong> Debt grew from ₹5.12L Cr in 2020-21 to ₹9.99L Cr in 2025-26.
                </span>
                <button
                  onClick={() =>
                    onAskAI?.("What caused the sudden rise in Tamil Nadu's debt according to Table 2.1?")
                  }
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Analyst</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Chart 2: Revenue Deficit */}
          {(chartPerspective === "all" || chartPerspective === "deficit") && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0E121B]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.5)] space-y-5 hover:border-rose-500/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                    <TrendingDown className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white">
                      Revenue Deficit Trajectory
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Table 3.1 (Page 44) • Post-COVID Evolution & Structural Fiscal Gap
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#141824] p-0.5 rounded-xl text-xs font-medium border border-white/[0.06]">
                    <button
                      onClick={() => setDeficitViewMode("nominal")}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        deficitViewMode === "nominal"
                          ? "bg-white/[0.12] text-white shadow-2xs font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      ₹ Cr
                    </button>
                    <button
                      onClick={() => setDeficitViewMode("ratio")}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        deficitViewMode === "ratio"
                          ? "bg-white/[0.12] text-white shadow-2xs font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      % GSDP
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedTable("table_3_1")}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 font-semibold transition-colors"
                  >
                    <Table2 className="w-3.5 h-3.5" />
                    <span>Table 3.1</span>
                  </button>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={REVENUE_DEFICIT_DATA}
                    margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      unit={deficitViewMode === "nominal" ? " Cr" : "%"}
                      tickFormatter={(v) =>
                        deficitViewMode === "nominal" ? `₹${Math.round(v / 1000)}k` : `${v}%`
                      }
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 13, 20, 0.96)",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        boxShadow: "0 16px 36px rgba(0,0,0,0.7)",
                      }}
                      formatter={((value: any, name?: any) => {
                        const unit = deficitViewMode === "nominal" ? " Cr" : "%";
                        return [`₹${Number(value).toLocaleString("en-IN")}${unit}`, name];
                      }) as any}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ fontSize: "11px", fontWeight: 600, color: "#94A3B8" }}
                    />
                    <Bar
                      dataKey={deficitViewMode === "nominal" ? "deficit" : "gsdpRatio"}
                      name={deficitViewMode === "nominal" ? "Revenue Deficit (₹ Cr)" : "Revenue Deficit (% GSDP)"}
                      fill="#E11D48"
                      radius={[6, 6, 0, 0]}
                      barSize={28}
                      cursor="pointer"
                      onClick={() => setSelectedTable("table_3_1")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400 pt-3 border-t border-white/[0.08] bg-[#0A0D15]/60 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <span className="font-medium">
                  <strong>Key Finding:</strong> Deficit peaked at ₹62,326 Cr during COVID (3.49% GSDP) and remains structural.
                </span>
                <button
                  onClick={() =>
                    onAskAI?.("Explain why Tamil Nadu's revenue deficit escalated in Table 3.1")
                  }
                  className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Analyst</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Chart 3: Committed Expenditure */}
          {(chartPerspective === "all" || chartPerspective === "expenditure") && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0E121B]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.5)] space-y-5 hover:border-emerald-500/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Coins className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white">
                      Committed Expenditure Breakdown
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Table 5.1 (Page 63) • Salaries, Pensions & Interest Servicing
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTable("table_5_1")}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 font-semibold transition-colors"
                >
                  <Table2 className="w-3.5 h-3.5" />
                  <span>Table 5.1</span>
                </button>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={COMMITTED_EXPENDITURE_DATA}
                    margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      unit=" Cr"
                      tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 13, 20, 0.96)",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        boxShadow: "0 16px 36px rgba(0,0,0,0.7)",
                      }}
                      formatter={((value: any, name?: any) => [
                        `₹${Number(value).toLocaleString("en-IN")} Cr`,
                        name,
                      ]) as any}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ fontSize: "11px", fontWeight: 600, color: "#94A3B8" }}
                    />
                    <Bar
                      dataKey="salaries"
                      name="Salaries"
                      fill="#059669"
                      stackId="a"
                      barSize={32}
                      cursor="pointer"
                      onClick={() => setSelectedTable("table_5_1")}
                    />
                    <Bar
                      dataKey="pensions"
                      name="Pensions"
                      fill="#10B981"
                      stackId="a"
                      barSize={32}
                      cursor="pointer"
                      onClick={() => setSelectedTable("table_5_1")}
                    />
                    <Bar
                      dataKey="interest"
                      name="Interest Payments"
                      fill="#F59E0B"
                      stackId="a"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                      cursor="pointer"
                      onClick={() => setSelectedTable("table_5_1")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400 pt-3 border-t border-white/[0.08] bg-[#0A0D15]/60 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <span className="font-medium">
                  <strong>Key Finding:</strong> Committed expenditure consumes 64.4% of revenue expenditure, crowding out capex.
                </span>
                <button
                  onClick={() =>
                    onAskAI?.("How does committed expenditure crowd out capital outlay in Table 5.1?")
                  }
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Analyst</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Chart 4: Peer State Comparison */}
          {(chartPerspective === "all" || chartPerspective === "peers") && (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0E121B]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.5)] space-y-5 hover:border-indigo-500/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Building2 className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white">
                      Cross-State Outstanding Liabilities
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Table 2.2 (Page 28) • Tamil Nadu vs Peer Industrial States (2025-26)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#141824] p-0.5 rounded-xl text-xs font-medium border border-white/[0.06]">
                    <button
                      onClick={() => setPeerFilter("all")}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        peerFilter === "all"
                          ? "bg-white/[0.12] text-white shadow-2xs font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setPeerFilter("south")}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        peerFilter === "south"
                          ? "bg-white/[0.12] text-white shadow-2xs font-bold"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      South
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedTable("table_2_2")}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/25 font-semibold transition-colors"
                  >
                    <Table2 className="w-3.5 h-3.5" />
                    <span>Table 2.2</span>
                  </button>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredPeerData}
                    layout="vertical"
                    margin={{ top: 15, right: 20, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      unit=" Cr"
                      tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="state"
                      tick={{ fontSize: 11, fill: "#FFFFFF", fontWeight: 700 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 13, 20, 0.96)",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        boxShadow: "0 16px 36px rgba(0,0,0,0.7)",
                      }}
                      formatter={((value: any) => [
                        `₹${Number(value).toLocaleString("en-IN")} Cr`,
                        "Total Liabilities",
                      ]) as any}
                    />
                    <Bar
                      dataKey="debt"
                      name="Total Debt (₹ Cr)"
                      fill="#6366F1"
                      radius={[0, 8, 8, 0]}
                      barSize={24}
                      cursor="pointer"
                      onClick={() => setSelectedTable("table_2_2")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400 pt-3 border-t border-white/[0.08] bg-[#0A0D15]/60 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <span className="font-medium">
                  <strong>Key Finding:</strong> Tamil Nadu has the highest per-capita debt among major southern industrial states.
                </span>
                <button
                  onClick={() =>
                    onAskAI?.("Compare Tamil Nadu's debt with Maharashtra and Gujarat in Table 2.2")
                  }
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Analyst</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Streamlined & De-Cluttered Budget Tables Catalog in Obsidian Glass */}
      <div className="rounded-3xl bg-[#0E121B]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.5)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
              <FileSpreadsheet className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Verified Budget Tables Catalog
                </h2>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/10">
                  {tables.length} Tables
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Structured tabular datasets extracted from the White Paper and verified in Postgres
              </p>
            </div>
          </div>

          {/* Search Box and View Controls */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tables or pages..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#121622] border border-white/[0.1] text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle: Grid vs Clean List */}
            <div className="flex items-center bg-[#121622] p-1 rounded-xl text-zinc-400 border border-white/[0.08]">
              <button
                onClick={() => setTableCatalogView("grid")}
                title="Grid View"
                className={`p-1.5 rounded-lg transition-all ${
                  tableCatalogView === "grid"
                    ? "bg-white/[0.12] text-white shadow-2xs font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTableCatalogView("list")}
                title="Table List View"
                className={`p-1.5 rounded-lg transition-all ${
                  tableCatalogView === "list"
                    ? "bg-white/[0.12] text-white shadow-2xs font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Clean Chapter Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            Chapter:
          </span>
          <button
            onClick={() => setSelectedChapter("all")}
            className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all font-semibold ${
              selectedChapter === "all"
                ? "bg-amber-400 text-slate-950 shadow-md font-bold"
                : "bg-[#141824] hover:bg-[#1C2234] text-zinc-400 hover:text-white border border-white/[0.06]"
            }`}
          >
            All ({tables.length})
          </button>
          {chapters.map((ch) => {
            const count = tables.filter((t) => t.chapter === ch).length;
            const isSelected = selectedChapter === ch;
            return (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all font-semibold ${
                  isSelected
                    ? "bg-amber-400 text-slate-950 shadow-md font-bold"
                    : "bg-[#141824] hover:bg-[#1C2234] text-zinc-400 hover:text-white border border-white/[0.06]"
                }`}
              >
                {ch} ({count})
              </button>
            );
          })}
        </div>

        {/* Tables Content (Card Grid or Clean Table List) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/[0.04] animate-pulse" />
            ))}
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-xs space-y-2">
            <Search className="w-8 h-8 text-zinc-600 mx-auto" />
            <p>No tables matching &ldquo;{search}&rdquo;</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedChapter("all");
              }}
              className="text-amber-400 hover:underline font-bold"
            >
              Clear filters
            </button>
          </div>
        ) : tableCatalogView === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTables.map((t) => (
              <div
                key={t.sql_table_name}
                onClick={() => setSelectedTable(t.sql_table_name)}
                className="p-5 rounded-2xl border border-white/[0.08] hover:border-amber-400/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.06)] transition-all cursor-pointer group bg-[#111520]/70 hover:bg-[#151B2A]/90 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-300 font-bold px-2 py-0.5 rounded-lg bg-white/[0.06] border border-white/[0.08] shadow-2xs">
                      {t.chapter || "Annexure"}
                    </span>
                    <span className="text-zinc-500 font-mono text-[11px]">
                      Page {t.page_number}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 line-clamp-2 transition-colors leading-snug">
                    {t.caption}
                  </h4>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Table2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.num_rows ?? 0} rows</span>
                  </span>
                  <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Inspect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View for ultra-clean, dense scanning */
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xs bg-[#0C0F17]">
            <table className="min-w-full divide-y divide-white/[0.06] text-xs text-left">
              <thead className="bg-[#121622] text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Chapter</th>
                  <th className="py-3 px-4">Caption</th>
                  <th className="py-3 px-4">Page</th>
                  <th className="py-3 px-4">Rows</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-medium text-zinc-300">
                {displayedTables.map((t) => (
                  <tr
                    key={t.sql_table_name}
                    onClick={() => setSelectedTable(t.sql_table_name)}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {t.chapter || "Annexure"}
                    </td>
                    <td className="py-3 px-4 text-zinc-200 font-semibold group-hover:text-amber-300">
                      {t.caption}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400 whitespace-nowrap">
                      p. {t.page_number}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400 whitespace-nowrap">
                      {t.num_rows ?? 0} rows
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 ml-auto">
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View All / Pagination Toggle */}
        {filteredTables.length > 9 && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setShowAllTables(!showAllTables)}
              className="px-5 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 font-bold text-xs transition-colors border border-white/[0.08] shadow-2xs flex items-center gap-2"
            >
              <span>
                {showAllTables
                  ? "Show Less (Collapse)"
                  : `Show All (${filteredTables.length} Tables)`}
              </span>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${
                  showAllTables ? "-rotate-90" : "rotate-90"
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* 5. Luxury AI Analyst Prompt Dock */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(245,158,11,0.35)]">
            <Sparkles className="w-7 h-7 stroke-[2.4]" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm sm:text-base">
              Need deep fiscal analysis on these tables?
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Ask our Agentic RAG pipeline to calculate CAGR, compare state debts, or dissect committed expenditure.
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            onAskAI?.("Explain the policy recommendations in Tamil Nadu's White Paper for debt consolidation.")
          }
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all whitespace-nowrap shrink-0 hover:scale-[1.02]"
        >
          Ask AI About Debt Consolidation
        </button>
      </div>
    </div>
  );
};
