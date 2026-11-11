"use client";

import React, { useEffect, useState } from "react";
import { TableDetail } from "@/lib/types";
import { fetchTableDetail } from "@/lib/api";
import { X, Sparkles, FileText, Loader2 } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border border-zinc-200/90 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-200/80 flex items-start justify-between gap-4 bg-zinc-50/50">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                Page {data?.page_number || "..."}
              </span>
              <span className="font-mono text-xs text-zinc-500">
                {tableName}
              </span>
            </div>
            <h3 className="font-semibold text-base sm:text-lg text-zinc-950 line-clamp-1">
              {data?.caption || tableName}
            </h3>
            {data?.chapter && (
              <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
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
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Analyst</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Table Data */}
        <div className="flex-1 overflow-auto p-6 space-y-4 bg-[#FAFAFA]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-800" />
              <p className="text-xs font-mono">Fetching verified dataset from database...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono">
              {error}
            </div>
          ) : data && data.rows.length > 0 ? (
            <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-900">
                      {data.columns.map((col, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-3 font-mono font-semibold tracking-wider uppercase text-[11px] whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {data.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-zinc-50/70 transition-colors"
                      >
                        {row.map((val, colIdx) => (
                          <td
                            key={colIdx}
                            className="px-4 py-2.5 font-mono text-zinc-700 text-[11px] whitespace-nowrap"
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
            <div className="text-center py-16 text-zinc-400 text-xs font-mono">
              No row data available for this table.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-200/80 flex items-center justify-between text-xs text-zinc-500 bg-zinc-50/50">
          <span className="font-mono">
            {data ? `${data.rows.length} rows verified` : "Ground-truth table"}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-medium border border-zinc-200 shadow-2xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
