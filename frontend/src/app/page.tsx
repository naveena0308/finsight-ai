"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { FiscalDashboard } from "@/components/dashboard/FiscalDashboard";
import { FiscalSimulator } from "@/components/simulator/FiscalSimulator";
import { AuthModal, AuthUser } from "@/components/auth/AuthModal";
import { HealthStatus, TableMetadata } from "@/lib/types";
import { checkBackendHealth, fetchBudgetTables } from "@/lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chat" | "tables" | "simulator">("tables");
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [tables, setTables] = useState<TableMetadata[]>([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Initial health check
    checkBackendHealth().then((h) => setHealth(h));

    // Restore user session if present
    try {
      const stored = localStorage.getItem("finsight_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore JSON errors
    }

    // Fetch budget tables
    setLoadingTables(true);
    fetchBudgetTables()
      .then((data) => setTables(data.tables))
      .catch((err) => console.error("Could not fetch tables:", err))
      .finally(() => setLoadingTables(false));
  }, []);

  const handleAskAIFromDashboard = (question: string) => {
    setPendingQuery(question);
    setActiveTab("chat");
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem("finsight_user");
    } catch {
      // ignore
    }
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col font-sans relative selection:bg-amber-500/25 selection:text-amber-200">
      <Header
        health={health}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 flex flex-col">
        {activeTab === "chat" && (
          <ChatContainer
            initialQuery={pendingQuery}
            onClearInitialQuery={() => setPendingQuery(null)}
          />
        )}

        {activeTab === "tables" && (
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1">
            <FiscalDashboard
              tables={tables}
              loading={loadingTables}
              onAskAI={handleAskAIFromDashboard}
              onNavigateTab={setActiveTab}
            />
          </div>
        )}

        {activeTab === "simulator" && (
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1">
            <FiscalSimulator onAskAI={handleAskAIFromDashboard} />
          </div>
        )}
      </main>

      {/* Auth Modal for Sign In / Sign Up / 1-Click Guest */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />
    </div>
  );
}
