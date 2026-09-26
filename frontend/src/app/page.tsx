"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { TableExplorer } from "@/components/tables/TableExplorer";
import { HealthStatus, TableMetadata } from "@/lib/types";
import { checkBackendHealth, fetchBudgetTables } from "@/lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chat" | "tables">("chat");
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [tables, setTables] = useState<TableMetadata[]>([]);
  const [loadingTables, setLoadingTables] = useState(false);

  useEffect(() => {
    // Initial health check
    checkBackendHealth().then((h) => setHealth(h));

    // Fetch budget tables
    setLoadingTables(true);
    fetchBudgetTables()
      .then((data) => setTables(data.tables))
      .catch((err) => console.error("Could not fetch tables:", err))
      .finally(() => setLoadingTables(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header health={health} activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col">
        {activeTab === "chat" ? (
          <ChatContainer />
        ) : (
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1">
            <TableExplorer tables={tables} loading={loadingTables} />
          </div>
        )}
      </main>
    </div>
  );
}
