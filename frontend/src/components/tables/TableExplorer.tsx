"use client";

import React, { useState } from "react";
import { TableMetadata } from "@/lib/types";
import { Search, Table2 } from "lucide-react";
import { BudgetTrendsChart } from "../charts/BudgetTrendsChart";

interface TableExplorerProps {
  tables: TableMetadata[];
  loading: boolean;
}

export const TableExplorer: React.FC<TableExplorerProps> = ({ tables, loading }) => {
  const [search, setSearch] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");

  const chapters = Array.from(
    new Set(tables.map((t) => t.chapter).filter((c) => Boolean(c)))
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
    <div className="space-y-6">
      {/* Visual Chart Highlight */}
      <BudgetTrendsChart />

      {/* Tables Explorer Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Table2 className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                Budget Tables Catalog ({tables.length} Tables in Neon Postgres)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured financial datasets extracted and SQL-queryable via our multi-agent pipeline
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tables..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/80 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Chapter Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedChapter("all")}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
              selectedChapter === "all"
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80"
            }`}
          >
            All Chapters ({tables.length})
          </button>
          {chapters.map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChapter(ch)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                selectedChapter === ch
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Tables Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs animate-pulse">
            Loading budget tables from Neon Postgres...
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No tables found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {filteredTables.map((t) => (
              <div
                key={t.table_id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group shadow-2xs cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                      Page {t.page_number}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {t.num_rows} rows
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-slate-800 mt-2 line-clamp-2 group-hover:text-amber-800 transition-colors">
                    {t.caption}
                  </h4>
                  {t.chapter && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{t.chapter}</p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono text-slate-600 truncate max-w-[160px]">
                    {t.sql_table_name}
                  </span>
                  <span className="text-amber-700 text-[10px] uppercase font-semibold">
                    SQL Table
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
