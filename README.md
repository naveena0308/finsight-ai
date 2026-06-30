# 🏛️ FinSight AI — Agentic Financial Budget Analyst

> A multi-agent RAG system that acts as an intelligent financial analyst for Indian government budgets — not a chatbot, but an **agent that plans, retrieves, verifies, and cites**.

[![Live Demo](https://img.shields.io/badge/Live_Demo-FinSight_AI-blue?style=for-the-badge)](https://finsight-ai.vercel.app)
[![MCP Server](https://img.shields.io/badge/MCP_Server-Available-green?style=for-the-badge)](./mcp-server)

## ✨ What Makes This Different

| Typical RAG Project | FinSight AI |
|---|---|
| Single retrieve → generate | Multi-agent pipeline with planning, routing, verification |
| Text-only search | Hybrid: semantic search + structured table lookup |
| No evaluation | 50-question eval harness with faithfulness/accuracy metrics |
| Consumes APIs | **Exposes an MCP server** — plug into Claude Desktop |
| Single document | Multi-document: TN Budget + India Budget comparison |
| Text-only answers | Auto-generated charts + page/table citations |

## 🏗️ Architecture

```
Frontend (Next.js 14)  →  Backend (FastAPI)  →  LangGraph Agents
     ↕                         ↕                      ↕
  Recharts              ChromaDB + SQLite       Gemini / GPT-4o
     ↕                         ↕
  Vercel                  MCP Server (stdio/SSE)
```

### Agent Pipeline
1. **Planner Agent** — Decomposes query into sub-queries with strategy tags
2. **Router Agent** — Routes to semantic search or table lookup
3. **Retrieval Agents** — Semantic (ChromaDB) + Structured (SQLite SQL)
4. **Verification Agent** — Cross-checks numbers against source tables
5. **Synthesizer Agent** — Generates cited response with optional charts

## 🚀 Features

- 🤖 **Agentic RAG** — Multi-agent orchestration via LangGraph
- 🔧 **MCP Server** — Installable in Claude Desktop
- 📊 **Eval Dashboard** — Naive RAG vs Agentic pipeline comparison
- 🇮🇳 **Budget Comparison** — TN vs India Union Budget
- 🎰 **Budget Simulator** — "What if education spending increases by 15%?"
- 🔍 **Anomaly Detection** — Flags unusual budget allocations
- 📈 **Auto-generated Charts** — Visual answers, not just text

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, Vanilla CSS |
| Backend | FastAPI, Python 3.11+ |
| Agent Orchestration | LangGraph |
| LLM | Gemini 2.0 Flash / GPT-4o |
| Embeddings | Gemini text-embedding-004 |
| Vector Store | ChromaDB → Pinecone (prod) |
| Structured Data | SQLite + Pandas |
| PDF Processing | PyMuPDF + Camelot |
| MCP | Model Context Protocol SDK |
| Evaluation | RAGAS + custom metrics |
| Deployment | Vercel + Railway |

## 📦 Project Structure

```
finsight-ai/
├── frontend/              # Next.js 14 app
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   └── public/            # Static assets
├── backend/               # FastAPI server
│   ├── app/
│   │   ├── agents/        # LangGraph agent definitions
│   │   ├── core/          # Config, database, embeddings
│   │   ├── services/      # PDF processing, retrieval
│   │   ├── models/        # Pydantic schemas
│   │   └── utils/         # Helpers
│   ├── data/
│   │   ├── raw/           # Source PDFs
│   │   ├── processed/     # Extracted tables, chunks
│   │   └── eval/          # Golden set & results
│   └── tests/
├── mcp-server/            # MCP server (stdio/SSE)
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Gemini API key or OpenAI API key

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env      # Add your API keys
python -m app.main
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### MCP Server (Claude Desktop)
```bash
cd mcp-server
npm install
# Add to Claude Desktop config — see docs/mcp-setup.md
```

## 📊 Evaluation Results

| Metric | Naive RAG | Agentic Pipeline | Improvement |
|---|---|---|---|
| Numeric Accuracy | TBD | TBD | TBD |
| Faithfulness | TBD | TBD | TBD |
| Answer Relevance | TBD | TBD | TBD |
| Avg Latency | TBD | TBD | — |

*Results will be populated after Phase 6 (Eval Dashboard)*

## 📄 License

MIT

## 👤 Author

**Naveena Natarajan**
