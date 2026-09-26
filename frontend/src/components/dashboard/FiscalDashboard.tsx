"use client";

import React, { useState } from "react";
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
}

export const FiscalDashboard: React.FC<FiscalDashboardProps> = ({
  tables,
  loading,
  onAskAI,
}) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");

  // Clean chapter list filtering out "nan"
  const chapters = Array.from(
    new Set(
      tables
        .map((t) => t.chapter)
        .filter((c) => Boolean(c) && c.toLowerCase() !== "nan")
    )
  );

  const filteredTables = tables.filter((t) => {
    const matchesSearch =
      t.caption.toLowerCase().includes(search.toLowerCase()) ||
      t.sql_table_name.toLowerCase().includes(search.toLowerCase());
    const matchesChapter =
      selectedChapter === "all" || t.chapter === selectedChapter;
    return matchesSearch && matchesChapter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Table Data Modal for Clicked Tables */}
      <TableDataModal
        tableName={selectedTable}
        onClose={() => setSelectedTable(null)}
        onAskAI={onAskAI}
      />

      {/* Header Banner */}
      <div className="space-y-1 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Executive Visualizations
          </span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-400">Tamil Nadu Fiscal Management White Paper</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Fiscal Analytics & Visual Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
          Interactive macro-fiscal indicators, debt dynamics, revenue deficit trends, and expenditure composition synthesized from 42 verified government budget tables.
        </p>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div 
          onClick={() => setSelectedTable("table_2_1")}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Total Outstanding Debt</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
              ₹9,99,832 Cr
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+95.1% since 2020-21</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-300">
            <span>Table 2.1 (Page 27)</span>
            <Eye className="w-3.5 h-3.5 text-amber-400/80" />
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => setSelectedTable("table_2_1")}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Debt-to-GSDP Ratio</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
              28.3%
            </div>
            <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Above 25% FRBM ceiling</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-300">
            <span>Table 2.1 (Page 27)</span>
            <Eye className="w-3.5 h-3.5 text-sky-400/80" />
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => setSelectedTable("table_3_1")}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Revenue Deficit (2021-22)</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-slate-950 transition-colors">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
              ₹46,538 Cr
            </div>
            <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
              <span>-2.25% of State GSDP</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-300">
            <span>Table 3.1 (Page 44)</span>
            <Eye className="w-3.5 h-3.5 text-rose-400/80" />
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => setSelectedTable("table_5_1")}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Committed Expenditure</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
              ₹1,89,110 Cr
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
              <span>64.4% of Revenue Exp.</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-300">
            <span>Table 5.1 (Page 63)</span>
            <Eye className="w-3.5 h-3.5 text-emerald-400/80" />
          </div>
        </div>
      </div>

      {/* Visual Charts Grid (2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Debt Trajectory */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-sm text-slate-100">
                  Outstanding Debt & % of GSDP Trajectory
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Table 2.1 (Page 27) • 5-Year Window: 2020-21 to 2025-26
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedTable("table_2_1")}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>View Data</span>
              </button>
              {onAskAI && (
                <button
                  onClick={() => onAskAI("Explain the trend in Tamil Nadu's debt growth and why debt-to-GSDP has reached 28.3%.")}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DEBT_TRAJECTORY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L Cr`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  domain={[20, 32]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  formatter={(value: any, name: any) => {
                    if (name === "Outstanding Liabilities") return [`₹${Number(value).toLocaleString()} Cr`, name];
                    if (name === "% of GSDP") return [`${value}%`, name];
                    return [value, name];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar
                  yAxisId="left"
                  dataKey="debt"
                  name="Outstanding Liabilities"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gsdpRatio"
                  name="% of GSDP"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#38bdf8" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Revenue Deficit Dynamics */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <h3 className="font-semibold text-sm text-slate-100">
                  Revenue Deficit & % of GSDP Dynamics
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Table 3.1 (Page 44) • Post-COVID Deficit Trajectory
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedTable("table_3_1")}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>View Data</span>
              </button>
              {onAskAI && (
                <button
                  onClick={() => onAskAI("Why did Tamil Nadu's revenue deficit increase and what are the structural causes outlined in Chapter 3?")}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={REVENUE_DEFICIT_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k Cr`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  domain={[0, 4.5]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  formatter={(value: any, name: any) => {
                    if (name === "Revenue Deficit") return [`₹${Number(value).toLocaleString()} Cr`, name];
                    if (name === "% of GSDP") return [`${value}%`, name];
                    return [value, name];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar
                  yAxisId="left"
                  dataKey="deficit"
                  name="Revenue Deficit"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gsdpRatio"
                  name="% of GSDP"
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#fbbf24" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Committed Expenditure Crowding-Out */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-sm text-slate-100">
                  Committed Expenditure Composition (Crowding-Out)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Table 5.1 (Page 63) • Salaries, Pensions & Interest Payments
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedTable("table_5_1")}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>View Data</span>
              </button>
              {onAskAI && (
                <button
                  onClick={() => onAskAI("What is the committed expenditure of Tamil Nadu and how does it crowd out capital investment?")}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMMITTED_EXPENDITURE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k Cr`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  formatter={(value: any, name: any) => [`₹${Number(value).toLocaleString()} Cr`, name]}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="salaries" name="Salaries" stackId="a" fill="#3b82f6" />
                <Bar dataKey="pensions" name="Pensions" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="interest" name="Interest Payments" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Peer State Comparison */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-sm text-slate-100">
                  Peer State Debt Burden Comparison (2025-26)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Table 2.2 (Page 28) • Total Liabilities across Major States
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedTable("table_2_2")}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>View Data</span>
              </button>
              {onAskAI && (
                <button
                  onClick={() => onAskAI("Compare Tamil Nadu's debt burden and debt-to-GSDP ratio with Karnataka, Maharashtra, and Gujarat.")}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={PEER_STATE_COMPARISON_DATA}
                margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L Cr`}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  formatter={(value: any, name: any) => {
                    if (name === "Outstanding Debt") return [`₹${Number(value).toLocaleString()} Cr`, name];
                    return [value, name];
                  }}
                />
                <Bar
                  dataKey="debt"
                  name="Outstanding Debt"
                  fill="#6366f1"
                  radius={[0, 4, 4, 0]}
                  barSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Underlying Datasets Catalog (Clean & Clickable) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Table2 className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-semibold text-slate-100">
                Explore Underlying Budget Datasets ({tables.length} Tables in Neon Postgres)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Click on any table card to view and inspect the verified tabular dataset stored in cloud Postgres.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Chapter Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedChapter("all")}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors font-medium ${
              selectedChapter === "all"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            All Chapters ({tables.length})
          </button>
          {chapters.map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChapter(ch)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors font-medium ${
                selectedChapter === ch
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Clickable Tables Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-xs animate-pulse">
            Loading budget tables from Neon Postgres...
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            No tables found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {filteredTables.map((t) => (
              <div
                key={t.table_id}
                onClick={() => setSelectedTable(t.sql_table_name)}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900/60 transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      Page {t.page_number}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {t.num_rows} rows
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-slate-200 mt-2.5 line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {t.caption}
                  </h4>
                  {t.chapter && t.chapter.toLowerCase() !== "nan" && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{t.chapter}</p>
                  )}
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-500 text-[10px] truncate max-w-[150px]">
                    {t.sql_table_name}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 text-[11px] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    <span>Inspect</span>
                    <Eye className="w-3 h-3" />
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
