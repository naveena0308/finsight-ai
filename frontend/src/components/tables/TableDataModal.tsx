"use client";

import React, { useEffect, useState } from "react";
import { TableDetail } from "@/lib/types";
import { fetchTableDetail } from "@/lib/api";
import { X, Sparkles, Database, FileText, Loader2 } from "lucide-react";

interface TableDataModalProps {
  tableName: string | null;
  onClose: () => void;
  onAskAI?: (question: string) => void;
}

export const TableDataModal: React.FC<TableDataModalProps> = ({
  tableName,
  onClose,
  onAskAI,
}) => {
  const [data, setData] = useState<TableDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tableName) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetchTableDetail(tableName)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError(err.message || "Failed to load table details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tableName]);

  if (!tableName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/80">
                Page {data?.page_number || "..."}
              </span>
              <span className="font-mono text-xs text-slate-500">
                `{tableName}`
              </span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 line-clamp-1">
              {data?.caption || tableName}
            </h3>
            {data?.chapter && (
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>{data.chapter}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onAskAI && data && (
              <button
                onClick={() => {
                  onAskAI(`Can you explain the significance and key takeaways from ${data.caption} (Page ${data.page_number})?`);
                  onClose();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Ask AI Analyst</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Table Data */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              <p className="text-sm">Fetching verified dataset from Neon Postgres...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {error}
            </div>
          ) : data && data.rows.length > 0 ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold sticky top-0">
                      {data.columns.map((col, idx) => (
                        <th key={idx} className="px-4 py-3 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                    {data.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-amber-50/40 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-2.5 whitespace-nowrap">
                            {cell !== null && cell !== undefined ? String(cell) : "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-sm">
              No tabular data available for this table.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Postgres Table: <code className="text-slate-700 font-mono bg-slate-100 px-1 py-0.5 rounded">{tableName}</code></span>
            {data?.rows && <span>• {data.rows.length} rows, {data.columns.length} columns</span>}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors font-medium shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
