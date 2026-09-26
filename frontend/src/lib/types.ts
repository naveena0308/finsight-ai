export type RetrievalStrategy = "TABLE_LOOKUP" | "NARRATIVE_SEARCH" | "HYBRID";

export interface CitationItem {
  type: "table" | "narrative";
  label: string;
  page?: number | number[];
  table_name?: string;
  chapter?: string;
  section?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  strategy?: RetrievalStrategy;
  citations?: CitationItem[];
  timestamp: string;
}

export interface TableMetadata {
  table_id: string;
  caption: string;
  page_number: number;
  chapter: string;
  num_rows: number;
  columns: string[];
  sql_table_name: string;
}

export interface TableListResponse {
  total_tables: number;
  tables: TableMetadata[];
}

export interface HealthStatus {
  status: string;
  services: {
    database: string;
    pgvector: string;
    llm: string;
    tables_indexed: number;
    chunks_indexed: number;
  };
}
