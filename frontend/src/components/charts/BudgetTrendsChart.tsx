"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { DEBT_TRAJECTORY_DATA } from "@/lib/constants";
import { TrendingUp } from "lucide-react";

export const BudgetTrendsChart: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-sm text-slate-100">
              Outstanding Debt & Liabilities Trajectory (Table 2.1)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            5-Year Window: 2020-21 to 2025-26 (Pre-AC) | Amount in Rs. Crore & % of GSDP
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
          Source: Page 27
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={DEBT_TRAJECTORY_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
              barSize={32}
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
  );
};
