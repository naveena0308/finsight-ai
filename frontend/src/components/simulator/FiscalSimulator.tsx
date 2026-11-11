"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  SlidersHorizontal,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Info,
} from "lucide-react";

interface FiscalSimulatorProps {
  onAskAI?: (prompt: string) => void;
}

// Ground-truth baseline from TN White Paper 2021-22 to 2025-26 (Table 2.1 & Chapter 2 projections)
const HISTORICAL_BASELINE = [
  { year: "2021-22", debt: 596331, gsdp: 2169820, committedExp: 125370 },
  { year: "2022-23", debt: 679214, gsdp: 2430198, committedExp: 143970 },
  { year: "2023-24", debt: 773620, gsdp: 2721822, committedExp: 155480 },
  { year: "2024-25", debt: 878850, gsdp: 3048440, committedExp: 167920 },
  { year: "2025-26", debt: 999480, gsdp: 3414250, committedExp: 181350 },
  { year: "2026-27", debt: 1135000, gsdp: 3824000, committedExp: 195860 },
];

const PRESETS = [
  {
    name: "Baseline (Status Quo)",
    desc: "Continuation of medium-term budget trajectory with 8% wage growth & 12% GSDP growth.",
    interestShock: 0.0,
    salaryGrowth: 8.0,
    gsdpGrowth: 12.0,
    badge: "Neutral",
    badgeColor: "bg-zinc-100 text-zinc-700 border-zinc-200",
  },
  {
    name: "Stagflation Shock",
    desc: "+1.5% RBI interest rate hike, 11% salary inflation, and lower 8% nominal GSDP growth.",
    interestShock: 1.5,
    salaryGrowth: 11.0,
    gsdpGrowth: 8.0,
    badge: "Severe Stress",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    name: "High Interest Hike",
    desc: "+2.5% severe borrowing cost surge with normal macroeconomic expansion.",
    interestShock: 2.5,
    salaryGrowth: 8.0,
    gsdpGrowth: 10.0,
    badge: "Debt Spiral",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    name: "Fiscal Consolidation",
    desc: "-0.5% debt refinancing relief, 6% expenditure rationalization, and 13% high growth.",
    interestShock: -0.5,
    salaryGrowth: 6.0,
    gsdpGrowth: 13.0,
    badge: "FRBM Compliant",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
];

export const FiscalSimulator: React.FC<FiscalSimulatorProps> = ({ onAskAI }) => {
  // Simulator Controls
  const [interestShock, setInterestShock] = useState<number>(0.0);
  const [salaryGrowth, setSalaryGrowth] = useState<number>(8.0);
  const [gsdpGrowth, setGsdpGrowth] = useState<number>(12.0);
  const [viewMetric, setViewMetric] = useState<"ratio" | "nominal">("ratio");

  // Reset to Baseline
  const handleReset = () => {
    setInterestShock(0.0);
    setSalaryGrowth(8.0);
    setGsdpGrowth(12.0);
  };

  // Run dynamic simulation model
  const simulationResults = useMemo(() => {
    let accumulatedDebtDelta = 0;
    let prevSimDebt = HISTORICAL_BASELINE[0].debt;
    let prevSimGsdp = HISTORICAL_BASELINE[0].gsdp;
    let prevCommittedExp = HISTORICAL_BASELINE[0].committedExp;

    return HISTORICAL_BASELINE.map((base, idx) => {
      if (idx === 0) {
        return {
          year: base.year,
          baselineDebt: Math.round(base.debt / 1000) / 100, // Lakh Cr
          baselineGsdp: Math.round(base.gsdp / 1000) / 100,
          baselineDebtToGsdp: Number(((base.debt / base.gsdp) * 100).toFixed(2)),
          simulatedDebt: Math.round(base.debt / 1000) / 100,
          simulatedGsdp: Math.round(base.gsdp / 1000) / 100,
          simulatedDebtToGsdp: Number(((base.debt / base.gsdp) * 100).toFixed(2)),
          frbmTarget: 25.0,
          gapToTarget: Number(((base.debt / base.gsdp) * 100 - 25.0).toFixed(2)),
          incrementalInterestCr: 0,
          annualFiscalGapCr: 0,
        };
      }

      // 1. Simulated GSDP
      const simGsdp = prevSimGsdp * (1 + gsdpGrowth / 100);

      // 2. Incremental Interest Shock Burden (Applied to outstanding debt stock)
      const interestDeltaCr = prevSimDebt * (interestShock / 100);

      // 3. Committed Exp Shock (delta above baseline 8%)
      const simCommittedExp = prevCommittedExp * (1 + salaryGrowth / 100);
      const baseCommittedExpProjected = base.committedExp;
      const committedDeltaCr = Math.max(0, simCommittedExp - baseCommittedExpProjected);

      // 4. Annual fiscal deficit expansion that must be financed by new market borrowing
      const annualFiscalGapCr = interestDeltaCr + committedDeltaCr;
      accumulatedDebtDelta += annualFiscalGapCr;

      const simDebt = base.debt + accumulatedDebtDelta;
      const simDebtToGsdp = (simDebt / simGsdp) * 100;
      const baseDebtToGsdp = (base.debt / base.gsdp) * 100;

      prevSimDebt = simDebt;
      prevSimGsdp = simGsdp;
      prevCommittedExp = simCommittedExp;

      return {
        year: base.year,
        baselineDebt: Number((base.debt / 100000).toFixed(2)), // in Lakh Cr
        baselineGsdp: Number((base.gsdp / 100000).toFixed(2)),
        baselineDebtToGsdp: Number(baseDebtToGsdp.toFixed(2)),
        simulatedDebt: Number((simDebt / 100000).toFixed(2)), // in Lakh Cr
        simulatedGsdp: Number((simGsdp / 100000).toFixed(2)),
        simulatedDebtToGsdp: Number(simDebtToGsdp.toFixed(2)),
        frbmTarget: 25.0,
        gapToTarget: Number((simDebtToGsdp - 25.0).toFixed(2)),
        incrementalInterestCr: Math.round(interestDeltaCr),
        annualFiscalGapCr: Math.round(annualFiscalGapCr),
      };
    });
  }, [interestShock, salaryGrowth, gsdpGrowth]);

  const finalYear = simulationResults[simulationResults.length - 1];
  const baselineFinalYear = HISTORICAL_BASELINE[HISTORICAL_BASELINE.length - 1];

  const totalIncrementalDebtCr = Math.round(
    finalYear.simulatedDebt * 100000 - baselineFinalYear.debt
  );
  const peakDebtRatio = Math.max(...simulationResults.map((r) => r.simulatedDebtToGsdp));

  // Fiscal Risk Category
  const getRiskStatus = () => {
    if (peakDebtRatio >= 33.0) {
      return {
        label: "Critical Fiscal Vulnerability",
        color: "bg-rose-50 border-rose-200 text-rose-900",
        desc: "Severe debt-servicing crowding out; debt sustainability compromised.",
      };
    }
    if (peakDebtRatio > 28.0) {
      return {
        label: "Elevated Debt Stress",
        color: "bg-amber-50 border-amber-200 text-amber-900",
        desc: "Significant deviation from the 25% FRBM ceiling; requires expenditure pruning.",
      };
    }
    if (peakDebtRatio > 25.0) {
      return {
        label: "Moderate Target Breach",
        color: "bg-amber-50/70 border-amber-200 text-amber-800",
        desc: "Slightly over FRBM benchmark, manageable with steady state growth.",
      };
    }
    return {
      label: "FRBM Compliant / Sustainable",
      color: "bg-emerald-50 border-emerald-200 text-emerald-900",
      desc: "Within statutory 25% debt ceiling with adequate capital expenditure room.",
    };
  };

  const riskStatus = getRiskStatus();

  // Send Scenario to AI Chat Analyst
  const handleConsultAI = () => {
    const prompt = `Evaluate the fiscal sustainability of Tamil Nadu under a simulated scenario where:
1. Interest Rate Shock: ${interestShock >= 0 ? `+${interestShock}%` : `${interestShock}%`} on public debt.
2. Committed Expenditure Growth (Salaries/Pensions): ${salaryGrowth}% per annum.
3. Nominal GSDP Growth Rate: ${gsdpGrowth}% per annum.

The simulation projects 2026-27 Debt-to-GSDP to reach ${finalYear.simulatedDebtToGsdp}% (vs 25.0% FRBM limit) with total debt of ₹${finalYear.simulatedDebt} Lakh Cr (₹${totalIncrementalDebtCr.toLocaleString("en-IN")} Cr delta). What are the policy recommendations and risks?`;

    if (onAskAI) {
      onAskAI(prompt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white p-6 sm:p-7 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center shrink-0 shadow-2xs">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 font-sans">
                Macroeconomic Fiscal Policy Simulator
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium">
                Medium-Term (2021–2027)
              </span>
            </div>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Stress-test the impact of borrowing rates, wage inflation, and state GDP growth on Tamil Nadu&apos;s debt trajectory against the <strong className="text-zinc-800 font-semibold">25% FRBM statutory limit</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 text-xs font-medium border border-zinc-200 transition-all shadow-2xs active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
          <button
            onClick={handleConsultAI}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition-all shadow-xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI to Evaluate Scenario</span>
          </button>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRESETS.map((p) => {
          const isActive =
            interestShock === p.interestShock &&
            salaryGrowth === p.salaryGrowth &&
            gsdpGrowth === p.gsdpGrowth;

          return (
            <button
              key={p.name}
              onClick={() => {
                setInterestShock(p.interestShock);
                setSalaryGrowth(p.salaryGrowth);
                setGsdpGrowth(p.gsdpGrowth);
              }}
              className={`p-4 rounded-xl text-left border transition-all relative ${
                isActive
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                  : "bg-white hover:bg-zinc-50 border-zinc-200/80 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-semibold text-xs tracking-wide ${isActive ? "text-white" : "text-zinc-900"}`}>
                  {p.name}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${isActive ? "bg-white/10 text-white border-white/20" : p.badgeColor}`}>
                  {p.badge}
                </span>
              </div>
              <p className={`text-[11px] line-clamp-2 leading-relaxed ${isActive ? "text-zinc-300" : "text-zinc-500"}`}>
                {p.desc}
              </p>
              <div className={`mt-3 flex items-center gap-2 text-[10px] font-mono ${isActive ? "text-zinc-400" : "text-zinc-500"}`}>
                <span>Shock: {p.interestShock >= 0 ? `+${p.interestShock}%` : `${p.interestShock}%`}</span>
                <span>•</span>
                <span>Wage: {p.salaryGrowth}%</span>
                <span>•</span>
                <span>GSDP: {p.gsdpGrowth}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Controls & Live Outcome Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-zinc-700" />
              <span>Policy Parameters</span>
            </h3>
            <span className="text-xs text-zinc-400 font-medium">Interactive Sliders</span>
          </div>

          {/* Slider 1: Interest Rate Shock */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                <span>Interest Rate Shock on Debt Stock</span>
                <span className="group relative cursor-pointer text-zinc-400 hover:text-zinc-600">
                  <Info className="w-3.5 h-3.5" />
                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-48 p-2 bg-zinc-900 text-white text-[10px] rounded-lg shadow-xl z-50">
                    Shift in effective interest rate on Tamil Nadu&apos;s outstanding market loans and central loans.
                  </span>
                </span>
              </label>
              <span
                className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
                  interestShock > 0
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : interestShock < 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-zinc-100 text-zinc-700 border-zinc-200"
                }`}
              >
                {interestShock > 0 ? `+${interestShock.toFixed(2)}%` : `${interestShock.toFixed(2)}%`}
              </span>
            </div>
            <input
              type="range"
              min="-1.0"
              max="3.0"
              step="0.25"
              value={interestShock}
              onChange={(e) => setInterestShock(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>-1.0% (Refinance)</span>
              <span>0.0% (Status Quo)</span>
              <span>+3.0% (Severe Shock)</span>
            </div>
          </div>

          {/* Slider 2: Committed Expenditure Growth */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                <span>Committed Expenditure (Salaries & Pensions)</span>
                <span className="group relative cursor-pointer text-zinc-400 hover:text-zinc-600">
                  <Info className="w-3.5 h-3.5" />
                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-48 p-2 bg-zinc-900 text-white text-[10px] rounded-lg shadow-xl z-50">
                    Annual percentage expansion of salaries, pensions, and non-discretionary commitments (White Paper Ch. 5).
                  </span>
                </span>
              </label>
              <span
                className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
                  salaryGrowth > 8.0
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : salaryGrowth < 8.0
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-zinc-100 text-zinc-700 border-zinc-200"
                }`}
              >
                {salaryGrowth.toFixed(1)}% p.a.
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="15.0"
              step="0.5"
              value={salaryGrowth}
              onChange={(e) => setSalaryGrowth(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>0% (Wage Freeze)</span>
              <span>8.0% (Historical)</span>
              <span>15.0% (High Inflation)</span>
            </div>
          </div>

          {/* Slider 3: Nominal GSDP Growth Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                <span>Nominal GSDP Growth Rate</span>
                <span className="group relative cursor-pointer text-zinc-400 hover:text-zinc-600">
                  <Info className="w-3.5 h-3.5" />
                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-48 p-2 bg-zinc-900 text-white text-[10px] rounded-lg shadow-xl z-50">
                    Nominal state economic expansion rate (Real Growth + Inflation). Denominator of Debt/GSDP ratio.
                  </span>
                </span>
              </label>
              <span
                className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
                  gsdpGrowth >= 12.0
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : gsdpGrowth < 9.0
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-zinc-100 text-zinc-700 border-zinc-200"
                }`}
              >
                {gsdpGrowth.toFixed(1)}% p.a.
              </span>
            </div>
            <input
              type="range"
              min="6.0"
              max="14.0"
              step="0.5"
              value={gsdpGrowth}
              onChange={(e) => setGsdpGrowth(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>6.0% (Stagnation)</span>
              <span>10.0% (Trend)</span>
              <span>14.0% (High Growth)</span>
            </div>
          </div>

          {/* Summary Callout */}
          <div className="pt-2 border-t border-zinc-100">
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                Calculations are benchmarked against official figures from <strong className="text-zinc-900 font-medium">Table 2.1 (Outstanding Debt)</strong> and <strong className="text-zinc-900 font-medium">Table 5.1 (Committed Expenditure)</strong> of the Tamil Nadu Government White Paper.
              </p>
            </div>
          </div>
        </div>

        {/* Live Impact Dashboard (Right Column) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Projected Debt/GSDP */}
            <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                Debt/GSDP (2026-27)
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-zinc-950 font-mono">
                  {finalYear.simulatedDebtToGsdp}%
                </span>
                <span
                  className={`text-xs font-semibold font-mono ${
                    finalYear.simulatedDebtToGsdp > finalYear.baselineDebtToGsdp
                      ? "text-rose-600"
                      : "text-emerald-600"
                  }`}
                >
                  {finalYear.simulatedDebtToGsdp > finalYear.baselineDebtToGsdp ? "▲" : "▼"}{" "}
                  {Math.abs(finalYear.simulatedDebtToGsdp - finalYear.baselineDebtToGsdp).toFixed(2)}%
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Baseline: {finalYear.baselineDebtToGsdp}%
              </span>
            </div>

            {/* Total Simulated Debt */}
            <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                Total Debt (2026-27)
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold text-zinc-950 font-mono">
                  ₹{finalYear.simulatedDebt}L
                </span>
                <span className="text-xs text-zinc-500 font-medium">Cr</span>
              </div>
              <span
                className={`text-[10px] font-semibold font-mono mt-1 block ${
                  totalIncrementalDebtCr > 0 ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {totalIncrementalDebtCr > 0 ? `+₹${totalIncrementalDebtCr.toLocaleString("en-IN")} Cr gap` : "Within baseline"}
              </span>
            </div>

            {/* FRBM Statutory Limit Gap */}
            <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                FRBM 25% Breach Gap
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-semibold font-mono ${
                    finalYear.gapToTarget > 0 ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {finalYear.gapToTarget > 0 ? `+${finalYear.gapToTarget}%` : `${finalYear.gapToTarget}%`}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                {finalYear.gapToTarget > 0 ? "Over statutory ceiling" : "Target compliant"}
              </span>
            </div>
          </div>

          {/* Risk Level Alert Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${riskStatus.color}`}>
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider block">
                  {riskStatus.label}
                </span>
                <p className="text-xs opacity-90 mt-0.5">{riskStatus.desc}</p>
              </div>
            </div>
            <button
              onClick={handleConsultAI}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-zinc-900 text-xs font-medium border border-zinc-200/60 shrink-0 transition-all shadow-2xs active:scale-95"
            >
              <span>Explain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual Simulation Chart */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-sm font-semibold text-zinc-950">
                  {viewMetric === "ratio"
                    ? "Debt-to-GSDP Trajectory vs FRBM Ceiling (%)"
                    : "Total Outstanding Public Debt (₹ Lakh Crore)"}
                </h4>
                <p className="text-xs text-zinc-500">
                  {viewMetric === "ratio"
                    ? "Comparing baseline vs simulated scenario against the 25% FRBM limit"
                    : "Nominal market debt accumulation trajectory across 5 fiscal years"}
                </p>
              </div>

              {/* Metric Toggle */}
              <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/60 text-xs font-medium">
                <button
                  onClick={() => setViewMetric("ratio")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    viewMetric === "ratio"
                      ? "bg-white text-zinc-950 font-semibold shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  Debt/GSDP (%)
                </button>
                <button
                  onClick={() => setViewMetric("nominal")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    viewMetric === "nominal"
                      ? "bg-white text-zinc-950 font-semibold shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  Debt (₹ Lakh Cr)
                </button>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={simulationResults}
                  margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: "#71717A" }}
                    axisLine={{ stroke: "#E4E4E7" }}
                  />
                  <YAxis
                    domain={viewMetric === "ratio" ? [20, "auto"] : [5, "auto"]}
                    tick={{ fontSize: 11, fill: "#71717A" }}
                    unit={viewMetric === "ratio" ? "%" : "L"}
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
                    formatter={((value: any, name?: any) => {
                      if (name === "Simulated Scenario" || name === "Simulated Debt") {
                        return viewMetric === "ratio" ? [`${value}%`, "Simulated Debt/GSDP"] : [`₹${value} Lakh Cr`, "Simulated Debt"];
                      }
                      if (name === "Official Baseline" || name === "Official Baseline Debt") {
                        return viewMetric === "ratio" ? [`${value}%`, "Baseline Debt/GSDP"] : [`₹${value} Lakh Cr`, "Baseline Debt"];
                      }
                      return [value, name];
                    }) as any}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontSize: "11px", fontWeight: 500, color: "#71717A" }}
                  />

                  {/* 25% FRBM Benchmark Ceiling (Only on ratio view) */}
                  {viewMetric === "ratio" && (
                    <ReferenceLine
                      y={25}
                      stroke="#EF4444"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: "25% FRBM Limit",
                        position: "insideTopLeft",
                        fill: "#DC2626",
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {viewMetric === "ratio" ? (
                    <>
                      <Area
                        type="monotone"
                        dataKey="simulatedDebtToGsdp"
                        name="Simulated Scenario"
                        fill="rgba(24, 24, 27, 0.08)"
                        stroke="#18181B"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#18181B" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="baselineDebtToGsdp"
                        name="Official Baseline"
                        stroke="#A1A1AA"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 3, fill: "#A1A1AA" }}
                      />
                    </>
                  ) : (
                    <>
                      <Area
                        type="monotone"
                        dataKey="simulatedDebt"
                        name="Simulated Debt"
                        fill="rgba(24, 24, 27, 0.08)"
                        stroke="#18181B"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#18181B" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="baselineDebt"
                        name="Official Baseline Debt"
                        stroke="#A1A1AA"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 3, fill: "#A1A1AA" }}
                      />
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-Year Comparison Table */}
      <div className="bg-white rounded-xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-zinc-950">
              Medium-Term Fiscal Projection Breakdown (2021-22 to 2026-27)
            </h4>
            <p className="text-xs text-zinc-500">
              Direct comparison of baseline figures vs simulated macroeconomic shock figures.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500 font-medium">Unit: ₹ Lakh Cr / %</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Fiscal Year</th>
                <th className="py-3 px-4">Baseline Debt</th>
                <th className="py-3 px-4">Simulated Debt</th>
                <th className="py-3 px-4">Baseline Debt/GSDP</th>
                <th className="py-3 px-4">Simulated Debt/GSDP</th>
                <th className="py-3 px-4">Gap to FRBM (25%)</th>
                <th className="py-3 px-4">Annual Fiscal Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-mono">
              {simulationResults.map((r) => (
                <tr key={r.year} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-zinc-900">{r.year}</td>
                  <td className="py-3 px-4 text-zinc-500">₹{r.baselineDebt}L Cr</td>
                  <td className="py-3 px-4 font-semibold text-zinc-900">₹{r.simulatedDebt}L Cr</td>
                  <td className="py-3 px-4 text-zinc-500">{r.baselineDebtToGsdp}%</td>
                  <td
                    className={`py-3 px-4 font-semibold ${
                      r.simulatedDebtToGsdp > 25.0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {r.simulatedDebtToGsdp}%
                  </td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      r.gapToTarget > 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {r.gapToTarget > 0 ? `+${r.gapToTarget}%` : `${r.gapToTarget}%`}
                  </td>
                  <td className="py-3 px-4 text-zinc-500">
                    {r.annualFiscalGapCr > 0 ? `+₹${r.annualFiscalGapCr.toLocaleString("en-IN")} Cr` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
