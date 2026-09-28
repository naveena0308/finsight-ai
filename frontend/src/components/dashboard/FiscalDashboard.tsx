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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Scale,
  Table2,
  Search,
  Eye,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Sliders,
  ChevronRight,
  ExternalLink,
  Layers,
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
        t.sql_table_name.toLowerCase().includes(search.toLowerCase());
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

  return (
    <div className="space-y-8 pb-16">
      {/* Table Data Modal for Clicked Tables */}
      <TableDataModal
        tableName={selectedTable}
        onClose={() => setSelectedTable(null)}
        onAskAI={onAskAI}
      />

      {/* Hero Bento Header & Executive Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Hero Card: Dark Slate / Mint Modern Fintech Account Widget */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-medium text-emerald-300 uppercase tracking-wider">
                  State Fiscal Balance Sheet
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-800/70 border border-slate-700">
                FY 2021-26
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-medium">
                Government of Tamil Nadu • Total Outstanding Debt
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
                  ₹9,99,832
                </span>
                <span className="text-sm font-semibold text-slate-400">Crore</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 font-mono font-semibold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <TrendingUp className="w-3 h-3" />
                  +95.1%
                </span>
                <span className="text-slate-400">Debt accumulation since 2020-21</span>
              </div>
            </div>

            {/* Quick Stat Bar */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                  Debt-to-GSDP
                </span>
                <span className="text-lg font-bold font-mono text-amber-300 mt-0.5 block">
                  28.3%
                </span>
                <span className="text-[10px] text-rose-400 font-mono">+3.3% over FRBM</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                  Revenue Deficit
                </span>
                <span className="text-lg font-bold font-mono text-white mt-0.5 block">
                  ₹46,538 Cr
                </span>
                <span className="text-[10px] text-slate-400 font-mono">-2.25% GSDP</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-5 mt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 relative z-10">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("simulator")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate Shocks</span>
              </button>
            )}
            <button
              onClick={() => onAskAI?.("Summarize the main fiscal vulnerabilities in Tamil Nadu's White Paper")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/15 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ask AI Analyst</span>
            </button>
            <button
              onClick={() => setSelectedTable("table_2_1")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-400 hover:text-white font-medium text-xs transition-all ml-auto"
            >
              <span>Table 2.1</span>
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 3 Bento Cards: Interactive KPI Pillars */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Bento Card 1: Debt-to-GSDP vs FRBM Target */}
          <div
            onClick={() => setSelectedTable("table_2_1")}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Debt / GSDP</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Scale className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 font-mono">
                  28.3%
                </div>
                <div className="text-xs text-rose-600 font-medium mt-0.5 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Above 25% FRBM ceiling</span>
                </div>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>FRBM Target: 25%</span>
                <span className="font-bold text-rose-600">28.3%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full"
                  style={{ width: "85%" }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Table 2.1 (Page 27)</span>
                <Eye className="w-3 h-3 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Bento Card 2: Committed Expenditure Crowding-Out */}
          <div
            onClick={() => setSelectedTable("table_5_1")}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Committed Exp.</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ₹1,89,110 Cr
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-0.5">
                  64.4% of Revenue Exp.
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Salaries + Pensions + Int.</span>
                <span className="font-bold text-slate-700">64%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "64.4%" }} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Table 5.1 (Page 63)</span>
                <Eye className="w-3 h-3 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Bento Card 3: Revenue Deficit Surge */}
          <div
            onClick={() => setSelectedTable("table_3_1")}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-rose-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Revenue Deficit</span>
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ₹46,538 Cr
                </div>
                <div className="text-xs text-rose-600 font-medium mt-0.5">
                  Structural gap post-2014
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Target: 0% (Surplus)</span>
                <span className="font-bold text-rose-600">-2.25%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: "55%" }} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Table 3.1 (Page 44)</span>
                <Eye className="w-3 h-3 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Visual Analytics (2x2 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Debt Trajectory */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Outstanding Debt & % of GSDP Trajectory
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Table 2.1 (Page 27) • 5-Year Window (2020-21 to 2025-26)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium">
                <button
                  onClick={() => setDebtViewMode("both")}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    debtViewMode === "both" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-500"
                  }`}
                >
                  Both
                </button>
                <button
                  onClick={() => setDebtViewMode("debt_only")}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    debtViewMode === "debt_only" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-500"
                  }`}
                >
                  Debt Only
                </button>
              </div>

              <button
                onClick={() => setSelectedTable("table_2_1")}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition-colors"
              >
                <Table2 className="w-3 h-3 text-amber-600" />
                <span>Inspect</span>
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={DEBT_TRAJECTORY_DATA}
                margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  unit=" Cr"
                  tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                {debtViewMode === "both" && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[24, 30]}
                    unit="%"
                    tick={{ fontSize: 11, fill: "#F59E0B" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                )}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === "debt") return [`₹${Number(value).toLocaleString("en-IN")} Cr`, "Total Debt"];
                    if (name === "pct_gsdp") return [`${value}%`, "Debt as % of GSDP"];
                    return [value, name];
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: 500 }} />
                <Bar
                  yAxisId="left"
                  dataKey="debt"
                  name="Total Debt (₹ Cr)"
                  fill="#0F172A"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  cursor="pointer"
                  onClick={() => setSelectedTable("table_2_1")}
                />
                {debtViewMode === "both" && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="pct_gsdp"
                    name="Debt as % of GSDP"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#F59E0B" }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Critical finding: Debt grew from ₹5.12L Cr (2020-21) to projected ₹9.99L Cr (2025-26).</span>
            <button
              onClick={() => onAskAI?.("What caused the sudden rise in Tamil Nadu's debt according to Table 2.1?")}
              className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
            >
              <span>Ask AI</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Chart 2: Revenue Deficit vs Fiscal Deficit */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Revenue Deficit vs Fiscal Deficit
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Table 3.1 (Page 44) • Divergence from Fiscal Targets
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium">
                <button
                  onClick={() => setDeficitViewMode("nominal")}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    deficitViewMode === "nominal" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-500"
                  }`}
                >
                  ₹ Crore
                </button>
                <button
                  onClick={() => setDeficitViewMode("ratio")}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    deficitViewMode === "ratio" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-500"
                  }`}
                >
                  % GSDP
                </button>
              </div>

              <button
                onClick={() => setSelectedTable("table_3_1")}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition-colors"
              >
                <Table2 className="w-3 h-3 text-rose-600" />
                <span>Inspect</span>
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={REVENUE_DEFICIT_DATA}
                margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  unit={deficitViewMode === "nominal" ? " Cr" : "%"}
                  tickFormatter={(v) => (deficitViewMode === "nominal" ? `₹${Math.round(v / 1000)}k` : `${v}%`)}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: any, name: string) => {
                    const unit = deficitViewMode === "nominal" ? " Cr" : "%";
                    return [`₹${Number(value).toLocaleString("en-IN")}${unit}`, name];
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: 500 }} />
                <Bar
                  dataKey="rev_deficit"
                  name="Revenue Deficit"
                  fill="#F43F5E"
                  radius={[6, 6, 0, 0]}
                  barSize={20}
                  cursor="pointer"
                  onClick={() => setSelectedTable("table_3_1")}
                />
                <Bar
                  dataKey="fiscal_deficit"
                  name="Fiscal Deficit"
                  fill="#0F172A"
                  radius={[6, 6, 0, 0]}
                  barSize={20}
                  cursor="pointer"
                  onClick={() => setSelectedTable("table_3_1")}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Revenue deficit reached a peak of ₹65,994 Cr in 2020-21 (3.46% GSDP).</span>
            <button
              onClick={() => onAskAI?.("Explain why Tamil Nadu's revenue deficit escalated in Table 3.1")}
              className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
            >
              <span>Ask AI</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Chart 3: Committed Expenditure Crowding-Out */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Committed Expenditure Composition & Crowding-Out
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Table 5.1 (Page 63) • Salaries, Pensions & Interest Servicing
              </p>
            </div>

            <button
              onClick={() => setSelectedTable("table_5_1")}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition-colors"
            >
              <Table2 className="w-3 h-3 text-emerald-600" />
              <span>Inspect</span>
            </button>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={COMMITTED_EXPENDITURE_DATA}
                margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  unit=" Cr"
                  tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: any, name: string) => [
                    `₹${Number(value).toLocaleString("en-IN")} Cr`,
                    name,
                  ]}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: 500 }} />
                <Bar
                  dataKey="salaries"
                  name="Salaries"
                  fill="#059669"
                  stackId="a"
                  radius={[0, 0, 0, 0]}
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

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Committed spending consumes 64.4% of total revenue expenditure, crowding out capital works.</span>
            <button
              onClick={() => onAskAI?.("How does committed expenditure crowd out capital outlay in Table 5.1?")}
              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              <span>Ask AI</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Chart 4: Peer State Comparison */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Cross-State Comparison: Outstanding Liabilities
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Table 2.2 (Page 28) • Tamil Nadu vs Peer Industrial States (2025-26)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium">
                <button
                  onClick={() => setPeerFilter("all")}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    peerFilter === "all" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-500"
                  }`}
                >
                  All States
                </button>
                <button
                  onClick={() => setPeerFilter("south")}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    peerFilter === "south" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-500"
                  }`}
                >
                  South Only
                </button>
              </div>

              <button
                onClick={() => setSelectedTable("table_2_2")}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition-colors"
              >
                <Table2 className="w-3 h-3 text-indigo-600" />
                <span>Inspect</span>
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredPeerData}
                layout="vertical"
                margin={{ top: 15, right: 20, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  unit=" Cr"
                  tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  tick={{ fontSize: 11, fill: "#0F172A", fontWeight: 600 }}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")} Cr`, "Liabilities"]}
                />
                <Bar
                  dataKey="liabilities"
                  fill="#6366F1"
                  radius={[0, 6, 6, 0]}
                  barSize={20}
                  cursor="pointer"
                  onClick={() => setSelectedTable("table_2_2")}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Tamil Nadu ranks second in nominal liabilities only behind Maharashtra.</span>
            <button
              onClick={() => onAskAI?.("Compare Tamil Nadu's debt with Maharashtra and Gujarat in Table 2.2")}
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <span>Ask AI</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Interactive Table Explorer */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Verified Budget Tables Directory
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Browse 42 structured financial tables extracted from the White Paper and queryable in Postgres.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search table title, keyword, or page..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
          </div>
        </div>

        {/* Chapter Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedChapter("all")}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-medium ${
              selectedChapter === "all"
                ? "bg-slate-900 text-white shadow-xs font-semibold"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
          >
            All Chapters ({tables.length})
          </button>
          {chapters.map((ch) => {
            const count = tables.filter((t) => t.chapter === ch).length;
            const isSelected = selectedChapter === ch;
            return (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-medium ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs font-semibold"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {ch} ({count})
              </button>
            );
          })}
        </div>

        {/* Table Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTables.map((t) => (
              <div
                key={t.sql_table_name}
                onClick={() => setSelectedTable(t.sql_table_name)}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group bg-slate-50/50 hover:bg-white flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-500 font-semibold px-2 py-0.5 rounded bg-white border border-slate-200">
                      {t.chapter || "Annexure"}
                    </span>
                    <span className="text-slate-400 font-mono">Page {t.page_number}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-700 line-clamp-2 transition-colors">
                    {t.caption}
                  </h4>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{t.row_count} rows indexed</span>
                  <span className="text-amber-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
