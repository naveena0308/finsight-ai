# 🏛️ FinSight AI — Agentic Financial Budget Analyst

> 🚧 **Work in Progress** — This project is actively being built. Check the progress tracker below.

An intelligent multi-agent RAG system that acts as a financial analyst for Indian government budgets. Unlike typical "chat with PDF" projects, FinSight AI uses **agent orchestration** to plan queries, route to the right retrieval strategy, verify numbers against source tables, and cite exact pages — all exposed as an **MCP server**.

## 🎯 What This Project Covers

| Concept | How It's Used |
|---|---|
| **GenAI / LLMs** | Gemini 2.0 Flash for reasoning, embedding, and generation |
| **RAG** | Hybrid retrieval: semantic search + structured table lookup |
| **Agentic AI** | Multi-agent pipeline with LangGraph (planner → router → retriever → verifier) |
| **MCP** | Exposes the system as an MCP server — installable in Claude Desktop |
| **Evaluation** | RAGAS-based eval harness comparing naive RAG vs agentic pipeline |
| **Fine-tuning** | Domain-specific model for structured table extraction |

## 📊 Progress Tracker

- [x] Project scaffold & repo setup
- [ ] PDF processing pipeline (text + table extraction)
- [ ] Basic RAG pipeline (naive baseline)
- [ ] Multi-agent pipeline with LangGraph
- [ ] India Budget integration & comparison engine
- [ ] Anomaly detection & budget simulator
- [ ] MCP server
- [ ] Evaluation dashboard
- [ ] Next.js frontend
- [ ] Deployment

## 🏗️ Architecture (Planned)

```
Frontend (Next.js 14)  →  Backend (FastAPI)  →  LangGraph Agents
     ↕                         ↕                      ↕
  Recharts              ChromaDB + SQLite       Gemini / GPT-4o
     ↕                         ↕
  Vercel                  MCP Server (stdio/SSE)
```

## 📦 Current Project Structure

```
finsight-ai/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entry point
│   │   ├── core/config.py     # Settings from .env
│   │   ├── agents/            # LangGraph agents (coming soon)
│   │   ├── services/          # PDF processing, retrieval (coming soon)
│   │   ├── models/            # Pydantic schemas
│   │   └── utils/
│   └── data/
│       └── raw/               # Source budget PDFs
├── mcp-server/                # MCP server (coming soon)
├── frontend/                  # Next.js app (coming soon)
└── docs/
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, Vanilla CSS |
| Backend | FastAPI, Python 3.11+ |
| Agents | LangGraph |
| LLM | Gemini 2.0 Flash |
| Vector Store | ChromaDB |
| PDF Processing | PyMuPDF, Camelot |
| Evaluation | RAGAS |
| Deployment | Vercel + Railway |

## 🚀 Setup (Development)

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env         # Add your API keys
uvicorn app.main:app --reload
```

## 📄 License

MIT

## 👤 Author

**Naveena Natarajan** — [GitHub](https://github.com/naveena0308)
