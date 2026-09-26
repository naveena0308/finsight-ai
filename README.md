# 🏛️ FinSight AI — Agentic Financial Budget Analyst

FinSight AI is an enterprise-grade multi-agent RAG system and fiscal intelligence platform built for Indian government budgets (anchored on the *Tamil Nadu Fiscal Management White Paper 2021-22 to 2025-26*). 

Unlike naive "chat with PDF" wrappers that hallucinate numbers, FinSight AI leverages **LangGraph agent orchestration** to decompose financial queries, route dynamically between structured SQL tables and `pgvector` semantic narrative search, rigorously verify numbers against ground-truth tables, and cite exact pages and tables — accessible via an interactive Next.js 14 dashboard or through an **exposable Model Context Protocol (MCP) server**.

---

## ✨ Key Capabilities

- 📑 **High-Fidelity PDF Processing**: Extracted and chunked a 121-page official fiscal white paper into 223 section-aware segments preserving chapter, section, and page metadata.
- 📊 **Automated Table Extraction**: Identified and structured 42 complex fiscal tables into Neon Serverless PostgreSQL and SQLite, enabling SQL-based numeric precision.
- 🤖 **LangGraph Multi-Agent Architecture**: Formal `StateGraph` workflow featuring query planning, dynamic retrieval routing (`TABLE_LOOKUP`, `NARRATIVE_SEARCH`, `HYBRID`), and mathematical verification against source tables.
- ⚡ **Dual LLM Engine with Zero-Latency Failover**: Primary reasoning on Google Gemini 3.8 Flash with an automatic circuit-breaker fallback to OpenAI `gpt-4o-mini`.
- 🔌 **Model Context Protocol (MCP) Server**: Exposes 4 native MCP tools for Claude Desktop, Cursor, or any MCP client (`list_budget_tables`, `query_budget_table`, `search_budget_narrative`, `run_financial_analyst_agent`).
- 📈 **Interactive Next.js 14 Fiscal Dashboard**: Real-time KPI summaries, interactive Recharts visualizations (Debt trajectory, Revenue Deficit, Crowding-Out analysis, Peer state comparisons), and click-to-inspect source table modals.
- 🎯 **Automated Evaluation Benchmark**: Evaluation suite validating routing accuracy, keyword coverage, citation presence, and response latency (**93.3% Precision Score**).

---

## 🏗️ Architecture

```
                    ┌────────────────────────────┐
                    │    Claude Desktop / MCP    │
                    └─────────────┬──────────────┘
                                  │ JSON-RPC (stdio/SSE)
┌───────────────────────┐         ▼
│  Next.js 14 Frontend  │ ◄──► [FastAPI Backend] ──► [MCP Server]
│ (Recharts / Tailwind) │         │
└───────────────────────┘         ▼
                         ┌─────────────────────────────────────────┐
                         │      LangGraph Multi-Agent Workflow     │
                         │                                         │
                         │   [Planner / Query Decomposer]          │
                         │                │                        │
                         │       (Conditional Router)              │
                         │       ┌────────┴────────┐               │
                         │       ▼                 ▼               │
                         │ [Table Retriever] [Vector Retriever]    │
                         │   (SQL Engine)     (pgvector cosine)    │
                         │       └────────┬────────┘               │
                         │                ▼                        │
                         │  [Verifier & Synthesis Agent]           │
                         │    (Deterministic Citations)            │
                         └────────────────┬────────────────────────┘
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
       [Neon Serverless Postgres]                      [Dual LLM Engine]
    ├── 42 Structured Budget Tables                 ├── Gemini 3.8 Flash
    └── 223 Embeddings (`pgvector`)                 └── OpenAI GPT-4o-mini
```

---

## 📊 Progress Tracker

- [x] Project scaffold & repository architecture
- [x] PDF processing pipeline (PyMuPDF 121-page extraction into 223 section segments)
- [x] Automated table extraction (42 financial tables structured into SQLite & Neon Postgres)
- [x] Vector store setup (Neon Serverless Postgres with `pgvector` extension)
- [x] Dual LLM Engine (Gemini 3.8 Flash + OpenAI automatic fallback circuit breaker)
- [x] Multi-agent pipeline with LangGraph `StateGraph` (Planner → Router → Verifier)
- [x] Exposable Model Context Protocol (MCP) Server with 4 tools
- [x] Next.js 14 Frontend with interactive Fiscal Dashboard, Recharts, and Table Modal
- [x] Automated RAG evaluation benchmark suite (93.3% precision score)
- [ ] Multi-document cross-state budget comparison expansion

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React, Recharts |
| **Backend** | FastAPI, Uvicorn, Python 3.11+, Pydantic v2 |
| **Orchestration** | LangGraph (`StateGraph`), LangChain Core |
| **LLMs** | Google Gemini 3.8 Flash, OpenAI `gpt-4o-mini` (Dual Failover) |
| **Database** | Neon Serverless PostgreSQL (`pgvector`, `psycopg2`, `SQLAlchemy`), SQLite |
| **Protocol** | Model Context Protocol (MCP SDK 2.2.0) |
| **PDF Extraction** | PyMuPDF (fitz) |
| **Evaluation** | Custom Automated RAG Evaluation Suite |

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- Neon PostgreSQL connection string (or local Postgres with `pgvector`)
- Google Gemini API Key and/or OpenAI API Key

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # Configure GEMINI_API_KEY, OPENAI_API_KEY, DATABASE_URL
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- -p 3001
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

### 4. Running the MCP Server
FinSight AI can be mounted directly into Claude Desktop or Cursor:
```json
{
  "mcpServers": {
    "finsight-ai": {
      "command": "python",
      "args": ["-m", "app.mcp_server"],
      "cwd": "path/to/finsight-ai/backend"
    }
  }
}
```
*See [`MCP_SETUP.md`](./MCP_SETUP.md) for detailed configuration instructions.*

### 5. Running the Evaluation Suite
```bash
cd backend
python data/eval/evaluate_rag.py
```
*Outputs an automated report to [`backend/data/eval/EVALUATION_REPORT.md`](./backend/data/eval/EVALUATION_REPORT.md).*

---

## 📄 License

MIT © [Naveena Natarajan](https://github.com/naveena0308)
