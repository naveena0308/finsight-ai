import { ChatMessage, CitationItem, HealthStatus, RetrievalStrategy, TableListResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function checkBackendHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch {
    return {
      status: "degraded",
      services: {
        database: "offline",
        pgvector: "unknown",
        llm: "unknown",
        tables_indexed: 0,
        chunks_indexed: 0,
      },
    };
  }
}

export async function fetchBudgetTables(): Promise<TableListResponse> {
  const res = await fetch(`${API_BASE_URL}/api/tables`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch budget tables");
  return await res.json();
}

export async function sendChatMessage(
  message: string,
  history?: ChatMessage[]
): Promise<{
  strategy: RetrievalStrategy;
  response: string;
  citations: CitationItem[];
}> {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history: history?.map((h) => ({ role: h.role, content: h.content })),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Network error" }));
    throw new Error(err.detail || "Failed to process chat message");
  }

  return await res.json();
}
