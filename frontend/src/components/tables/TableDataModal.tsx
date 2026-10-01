"use client";

import React, { useEffect, useState } from "react";
import { TableDetail } from "@/lib/types";
import { fetchTableDetail } from "@/lib/api";
import { X, Sparkles, Database, FileText, Loader2, Table2 } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0D1017] border border-white/[0.12] rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-[#121622]/90">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                Page {data?.page_number || "..."}
              </span>
              <span className="font-mono text-xs text-zinc-400">
                {tableName}
              </span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-white line-clamp-1">
              {data?.caption || tableName}
            </h3>
            {data?.chapter && (
              <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
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
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ask AI Analyst</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Table Data */}
        <div className="flex-1 overflow-auto p-6 space-y-4 bg-[#0A0C13]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <p className="text-xs font-mono">Fetching verified dataset from database...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
              {error}
            </div>
          ) : data && data.rows.length > 0 ? (
            <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-[#0D1018] shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#141926] border-b border-white/[0.08] text-white">
                      {data.columns.map((col, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-3 font-mono font-bold tracking-wider uppercase text-[11px] whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {data.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-white/[0.03] transition-colors"
                      >
                        {row.map((val, colIdx) => (
                          <td
                            key={colIdx}
                            className="px-4 py-2.5 font-mono text-zinc-300 text-[11px] whitespace-nowrap"
                          >
                            {val !== null && val !== undefined ? String(val) : "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-zinc-500 text-xs font-mono">
              No row data available for this table.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400 bg-[#0E121B]">
          <span className="font-mono">
            {data ? `${data.rows.length} rows verified` : "Ground-truth table"}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 text-xs font-semibold border border-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
