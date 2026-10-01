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
    <div className="space-y-8 pb-16">
      {/* Table Data Modal for Clicked Tables */}
      <TableDataModal
        tableName={selectedTable}
        onClose={() => setSelectedTable(null)}
        onAskAI={onAskAI}
      />

      {/* 1. Header Command Deck - Minimal Mercury Design */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
              Executive Fiscal Health Dashboard
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-medium border border-zinc-200">
              2021–2026
            </span>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Macroeconomic audit of Tamil Nadu&apos;s public debt, FRBM target adherence, committed expenditure crowding-out, and cross-state peer liabilities.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab("simulator")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 text-xs font-medium transition-all shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Simulate Shocks</span>
            </button>
          )}

          <button
            onClick={() =>
              onAskAI?.(
                "Provide an executive briefing on the key fiscal challenges facing Tamil Nadu based on the White Paper."
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Executive Briefing</span>
          </button>
        </div>
      </div>

      {/* 2. Executive 4-Pillar Metric Deck */}
      <div>
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-zinc-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Statutory Fiscal Pillars & Vulnerabilities
            </h2>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            Click metric to inspect table
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: Outstanding Public Debt */}
          <div
            onClick={() => setSelectedTable("table_2_1")}
            className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Landmark className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                  Table 2.1
                </span>
              </div>

              <div className="mt-4 space-y-0.5">
                <span className="text-xs font-medium text-zinc-500 block">
                  Total Outstanding Debt
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold font-mono tracking-tight text-zinc-950">
                    ₹9,99,832
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">Cr</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-mono font-semibold text-rose-600">
                <TrendingUp className="w-3.5 h-3.5" />
                +95.1%
              </span>
              <span className="text-[11px] text-zinc-400">Since 2020-21</span>
            </div>
          </div>

          {/* Pillar 2: Debt-to-GSDP vs FRBM Target */}
          <div
            onClick={() => setSelectedTable("table_2_1")}
            className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Scale className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                  FRBM Ratio
                </span>
              </div>

              <div className="mt-4 space-y-0.5">
                <span className="text-xs font-medium text-zinc-500 block">
                  Debt-to-GSDP Ratio
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold font-mono tracking-tight text-zinc-950">
                    28.3%
                  </span>
                  <span className="text-xs font-semibold text-rose-600 font-mono">+3.3% Over</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>Ceiling: 25.0%</span>
                <span className="font-medium text-rose-600">28.3% Actual</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 rounded-full"
                  style={{ width: "88%" }}
                />
              </div>
            </div>
          </div>

          {/* Pillar 3: Committed Expenditure */}
          <div
            onClick={() => setSelectedTable("table_5_1")}
            className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Coins className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                  Table 5.1
                </span>
              </div>

              <div className="mt-4 space-y-0.5">
                <span className="text-xs font-medium text-zinc-500 block">
                  Committed Expenditure
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold font-mono tracking-tight text-zinc-950">
                    ₹1,89,110
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">Cr</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>Salaries + Pension + Int.</span>
                <span className="font-semibold text-zinc-900">64.4% of Rev</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 rounded-full"
                  style={{ width: "64.4%" }}
                />
              </div>
            </div>
          </div>

          {/* Pillar 4: Revenue Deficit */}
          <div
            onClick={() => setSelectedTable("table_3_1")}
            className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                  Table 3.1
                </span>
              </div>

              <div className="mt-4 space-y-0.5">
                <span className="text-xs font-medium text-zinc-500 block">
                  Revenue Deficit
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold font-mono tracking-tight text-zinc-950">
                    ₹46,538
                  </span>
                  <span className="text-xs font-semibold text-rose-600 font-mono">-2.25% GSDP</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-mono font-semibold text-rose-600">
                <ShieldAlert className="w-3.5 h-3.5" />
                Structural Gap
              </span>
              <span className="text-[11px] text-zinc-400">Target: 0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Analytical Deep-Dive Workspace with Perspective Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-zinc-700" />
              <h2 className="text-sm font-semibold text-zinc-950">
                Visual Analytics & Financial Dynamics
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Multi-year time series extracted directly from source government tables
            </p>
          </div>

          {/* Perspective Selector */}
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/60 text-xs font-medium overflow-x-auto no-scrollbar">
            <button
              onClick={() => setChartPerspective("all")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                chartPerspective === "all"
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>All 4 Views</span>
            </button>
            <button
              onClick={() => setChartPerspective("debt")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                chartPerspective === "debt"
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <span>Public Debt</span>
            </button>
            <button
              onClick={() => setChartPerspective("deficit")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                chartPerspective === "deficit"
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <span>Deficits</span>
            </button>
            <button
              onClick={() => setChartPerspective("expenditure")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                chartPerspective === "expenditure"
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <span>Committed Exp</span>
            </button>
            <button
              onClick={() => setChartPerspective("peers")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                chartPerspective === "peers"
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <span>Peer States</span>
            </button>
          </div>
        </div>

        {/* Chart Grid */}
        <div
          className={`grid gap-4 ${
            chartPerspective === "all"
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {/* Chart 1: Debt Trajectory */}
          {(chartPerspective === "all" || chartPerspective === "debt") && (
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-zinc-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-950">
                    Outstanding Debt & % of GSDP Trajectory
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Table 2.1 • 5-Year Window (2020-21 to 2025-26)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-zinc-100 p-0.5 rounded-md text-xs font-medium border border-zinc-200/60">
                    <button
                      onClick={() => setDebtViewMode("both")}
                      className={`px-2 py-0.5 rounded transition-all ${
                        debtViewMode === "both"
                          ? "bg-white text-zinc-950 font-semibold shadow-xs"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      Both
                    </button>
                    <button
                      onClick={() => setDebtViewMode("debt_only")}
                      className={`px-2 py-0.5 rounded transition-all ${
                        debtViewMode === "debt_only"
                          ? "bg-white text-zinc-950 font-semibold shadow-xs"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      Debt Only
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedTable("table_2_1")}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium transition-colors"
                  >
                    <Table2 className="w-3 h-3 text-zinc-500" />
                    <span>Table 2.1</span>
                  </button>
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={DEBT_TRAJECTORY_DATA}
                    margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 11, fill: "#71717A" }}
                      axisLine={{ stroke: "#E4E4E7" }}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11, fill: "#71717A" }}
                      unit=" Cr"
                      tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                      axisLine={{ stroke: "#E4E4E7" }}
                    />
                    {debtViewMode === "both" && (
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[25, 30]}
                        unit="%"
                        tick={{ fontSize: 11, fill: "#71717A" }}
                        axisLine={{ stroke: "#E4E4E7" }}
                      />
                    )}
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "8px",
                        border: "1px solid #E4E4E7",
                        color: "#09090B",
                        fontSize: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
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
                      height={32}
                      wrapperStyle={{ fontSize: "11px", fontWeight: 500, color: "#71717A" }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="debt"
                      name="Total Debt (₹ Cr)"
                      fill="#18181B"
                      radius={[4, 4, 0, 0]}
                      barSize={28}
                      cursor="pointer"
                      onClick={() => setSelectedTable("table_2_1")}
                    />
                    {debtViewMode === "both" && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="gsdpRatio"
                        name="Debt % of GSDP"
                        stroke="#71717A"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#18181B" }}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                <span>
                  <strong className="text-zinc-800 font-semibold">Key Finding:</strong> Debt grew from ₹5.12L Cr in 2020-21 to ₹9.99L Cr in 2025-26.
                </span>
                <button
                  onClick={() =>
                    onAskAI?.("Explain the growth trend of Tamil Nadu's outstanding debt from Table 2.1.")
                  }
                  className="text-zinc-700 hover:text-zinc-950 font-semibold flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Ask AI</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Chart 2: Revenue Deficit */}
          {(chartPerspective === "all" || chartPerspective === "deficit") && (
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-zinc-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-950">
                    Revenue Deficit Trajectory
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Table 3.1 • Post-COVID Evolution & Structural Fiscal Gap
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-zinc-100 p-0.5 rounded-md text-xs font-medium border border-zinc-200/60">
                    <button
                      onClick={() => setDeficitViewMode("nominal")}
                      className={`px-2 py-0.5 rounded transition-all ${
                        deficitViewMode === "nominal"
                          ? "bg-white text-zinc-950 font-semibold shadow-xs"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      ₹ Cr
                    </button>
                    <button
                      onClick={() => setDeficitViewMode("ratio")}
                      className={`px-2 py-0.5 rounded transition-all ${
                        deficitViewMode === "ratio"
                          ? "bg-white text-zinc-950 font-semibold shadow-xs"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      % GSDP
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedTable("table_3_1")}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium transition-colors"
                  >
                    <Table2 className="w-3 h-3 text-zinc-500" />
                    <span>Table 3.1</span>
                  </button>
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={REVENUE_DEFICIT_DATA}
                    margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 11, fill: "#71717A" }}
                      axisLine={{ stroke: "#E4E4E7" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#71717A" }}
                      unit={deficitViewMode === "nominal" ? " Cr" : "%"}
                      tickFormatter={(v) =>
                        deficitViewMode === "nominal"
                          ? `₹${Math.round(v / 1000)}k`
                          : `${v}%`
                      }
                      axisLine={{ stroke: "#E4E4E7" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "8px",
                        border: "1px solid #E4E4E7",
                        color: "#09090B",
                        fontSize: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      }}
                      formatter={((value: any) => [
                        deficitViewMode === "nominal"
                          ? `₹${Number(value).toLocaleString("en-IN")} Cr`
                          : `${value}% of GSDP`,
                        "Revenue Deficit",
                      ]) as any}
                    />
                    <Bar
                      dataKey={deficitViewMode === "nominal" ? "deficit" : "gsdpRatio"}
                      name="Revenue Deficit"
                      fill="#E11D48"
                      radius={[4, 4, 0, 0]}
                      barSize={28}
                      cursor="pointer"
                      onClick={() => setSelectedTable("table_3_1")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                <span>
                  <strong className="text-zinc-800 font-semibold">Key Finding:</strong> Deficit peaked at ₹62,326 Cr during COVID (3.49% GSDP) and remains structural.
                </span>
                <button
                  onClick={() =>
                    onAskAI?.("Why did Tamil Nadu's revenue deficit surge post-COVID according to Table 3.1?")
                  }
                  className="text-zinc-700 hover:text-zinc-950 font-semibold flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Ask AI</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Chart 3: Committed Expenditure */}
          {(chartPerspective === "all" || chartPerspective === "expenditure") && (
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-zinc-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-950">
                    Committed Expenditure Breakdown
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Table 5.1 • Salaries, Pensions & Interest Servicing
                  </p>
                </div>

                <button
                  onClick={() => setSelectedTable("table_5_1")}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium transition-colors"
                >
                  <Table2 className="w-3 h-3 text-zinc-500" />
                  <span>Table 5.1</span>
                </button>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={COMMITTED_EXPENDITURE_DATA}
                    margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 11, fill: "#71717A" }}
                      axisLine={{ stroke: "#E4E4E7" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#71717A" }}
                      unit=" Cr"
                      tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                      axisLine={{ stroke: "#E4E4E7" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "8px",
                        border: "1px solid #E4E4E7",
                        color: "#09090B",
                        fontSize: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      }}
                      formatter={((value: any, name?: any) => [
                        `₹${Number(value).toLocaleString("en-IN")} Cr`,
                        name,
                      ]) as any}
                    />
                    <Legend
                      verticalAlign="top"
                      height={32}
                      wrapperStyle={{ fontSize: "11px", fontWeight: 500, color: "#71717A" }}
                    />
                    <Bar
                      dataKey="salaries"
                      name="Salaries"
                      fill="#059669"
                      stackId="a"
                      barSize={28}
                      cursor="pointer"
                      onClick={() => setSelectedTable("table_5_1")}
                    />
                    <Bar
                      dataKey="pensions"
                      name="Pensions"
                      fill="#10B981"
                      stackId="a"
                      barSize={28}
                      cursor="pointer"
                      onClick={() => setSelectedTable("table_5_1")}
                    />
                    <Bar
                      dataKey="interest"
                      name="Interest Payments"
                      fill="#F59E0B"
                      stackId="a"
                      radius={[4, 4, 0, 0]}
                      barSize={28}
                      cursor="pointer"
                      onClick={() => setSelectedTable("table_5_1")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                <span>
                  <strong className="text-zinc-800 font-semibold">Key Finding:</strong> Committed expenditure consumes 64.4% of revenue expenditure, crowding out capex.
                </span>
                <button
                  onClick={() =>
                    onAskAI?.("How does committed expenditure crowd out capital outlay in Table 5.1?")
                  }
                  className="text-zinc-700 hover:text-zinc-950 font-semibold flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Ask AI</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Chart 4: Peer State Comparison */}
          {(chartPerspective === "all" || chartPerspective === "peers") && (
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-zinc-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-950">
                    Cross-State Outstanding Liabilities
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Table 2.2 • Tamil Nadu vs Peer Industrial States (2025-26)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-zinc-100 p-0.5 rounded-md text-xs font-medium border border-zinc-200/60">
                    <button
                      onClick={() => setPeerFilter("all")}
                      className={`px-2 py-0.5 rounded transition-all ${
                        peerFilter === "all"
                          ? "bg-white text-zinc-950 font-semibold shadow-xs"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setPeerFilter("south")}
                      className={`px-2 py-0.5 rounded transition-all ${
                        peerFilter === "south"
                          ? "bg-white text-zinc-950 font-semibold shadow-xs"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      South
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedTable("table_2_2")}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium transition-colors"
                  >
                    <Table2 className="w-3 h-3 text-zinc-500" />
                    <span>Table 2.2</span>
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
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F4F4F5" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#71717A" }}
                      unit=" Cr"
                      tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                      axisLine={{ stroke: "#E4E4E7" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="state"
                      tick={{ fontSize: 11, fill: "#09090B", fontWeight: 600 }}
                      axisLine={{ stroke: "#E4E4E7" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "8px",
                        border: "1px solid #E4E4E7",
                        color: "#09090B",
                        fontSize: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      }}
                      formatter={((value: any) => [
                        `₹${Number(value).toLocaleString("en-IN")} Cr`,
                        "Total Liabilities",
                      ]) as any}
                    />
                    <Bar
                      dataKey="debt"
                      name="Total Debt (₹ Cr)"
                      fill="#18181B"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                      cursor="pointer"
                      onClick={() => setSelectedTable("table_2_2")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                <span>
                  <strong className="text-zinc-800 font-semibold">Key Finding:</strong> Tamil Nadu has the highest per-capita debt among major southern industrial states.
                </span>
                <button
                  onClick={() =>
                    onAskAI?.("Compare Tamil Nadu's debt with Maharashtra and Gujarat in Table 2.2")
                  }
                  className="text-zinc-700 hover:text-zinc-950 font-semibold flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Ask AI</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Budget Tables Catalog */}
      <div className="rounded-xl bg-white border border-zinc-200/80 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800 shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-semibold text-zinc-950 tracking-tight">
                  Verified Budget Tables Catalog
                </h2>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                  {tables.length} Tables
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Structured tabular datasets extracted from the White Paper and verified in Postgres
              </p>
            </div>
          </div>

          {/* Search Box and View Controls */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tables or pages..."
                className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg text-zinc-500 border border-zinc-200/60">
              <button
                onClick={() => setTableCatalogView("grid")}
                title="Grid View"
                className={`p-1.5 rounded-md transition-all ${
                  tableCatalogView === "grid"
                    ? "bg-white text-zinc-950 shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-950"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTableCatalogView("list")}
                title="Table List View"
                className={`p-1.5 rounded-md transition-all ${
                  tableCatalogView === "list"
                    ? "bg-white text-zinc-950 shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-950"
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chapter Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Chapter:
          </span>
          <button
            onClick={() => setSelectedChapter("all")}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all font-medium ${
              selectedChapter === "all"
                ? "bg-zinc-900 text-white shadow-xs font-semibold"
                : "bg-zinc-100 hover:bg-zinc-200/70 text-zinc-600 hover:text-zinc-950 border border-zinc-200"
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
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all font-medium ${
                  isSelected
                    ? "bg-zinc-900 text-white shadow-xs font-semibold"
                    : "bg-zinc-100 hover:bg-zinc-200/70 text-zinc-600 hover:text-zinc-950 border border-zinc-200"
                }`}
              >
                {ch} ({count})
              </button>
            );
          })}
        </div>

        {/* Tables Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-zinc-100 animate-pulse" />
            ))}
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="text-center py-10 text-zinc-400 text-xs space-y-2">
            <Search className="w-6 h-6 text-zinc-300 mx-auto" />
            <p>No tables matching &ldquo;{search}&rdquo;</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedChapter("all");
              }}
              className="text-zinc-700 hover:text-zinc-950 underline font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : tableCatalogView === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayedTables.map((t) => (
              <div
                key={t.sql_table_name}
                onClick={() => setSelectedTable(t.sql_table_name)}
                className="p-4 rounded-xl border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all cursor-pointer group bg-white shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-600 font-medium px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px]">
                      {t.chapter || "Annexure"}
                    </span>
                    <span className="text-zinc-400 font-mono text-[11px]">
                      Page {t.page_number}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm text-zinc-900 group-hover:text-zinc-950 line-clamp-2 transition-colors leading-snug">
                    {t.caption}
                  </h4>
                </div>

                <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Table2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{t.num_rows ?? 0} rows</span>
                  </span>
                  <span className="text-zinc-700 group-hover:text-zinc-950 font-medium flex items-center gap-1">
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="border border-zinc-200/80 rounded-xl overflow-hidden shadow-xs bg-white">
            <table className="min-w-full divide-y divide-zinc-200 text-xs text-left">
              <thead className="bg-zinc-50/75 text-zinc-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Chapter</th>
                  <th className="py-2.5 px-4">Caption</th>
                  <th className="py-2.5 px-4">Page</th>
                  <th className="py-2.5 px-4">Rows</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                {displayedTables.map((t) => (
                  <tr
                    key={t.sql_table_name}
                    onClick={() => setSelectedTable(t.sql_table_name)}
                    className="hover:bg-zinc-50/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-4 font-mono font-semibold text-zinc-900 whitespace-nowrap">
                      {t.chapter || "Annexure"}
                    </td>
                    <td className="py-2.5 px-4 text-zinc-900 group-hover:text-zinc-950 font-medium">
                      {t.caption}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-zinc-500 whitespace-nowrap">
                      p. {t.page_number}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-zinc-500 whitespace-nowrap">
                      {t.num_rows ?? 0} rows
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <button className="text-zinc-700 hover:text-zinc-950 font-medium flex items-center gap-1 ml-auto">
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
              className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-50 text-zinc-700 font-medium text-xs transition-colors border border-zinc-200 shadow-xs flex items-center gap-1.5"
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

      {/* 5. Minimal AI Analyst Prompt Dock */}
      <div className="rounded-xl bg-zinc-50 border border-zinc-200/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-950 text-sm">
              Need deep fiscal analysis on these tables?
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Ask our Agentic RAG pipeline to calculate CAGR, compare state debts, or dissect committed expenditure.
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            onAskAI?.("Explain the policy recommendations in Tamil Nadu's White Paper for debt consolidation.")
          }
          className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs shadow-xs transition-all whitespace-nowrap shrink-0 active:scale-95"
        >
          Ask AI About Debt Consolidation
        </button>
      </div>
    </div>
  );
};
