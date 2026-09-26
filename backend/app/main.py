"""
FinSight AI — FastAPI Backend Entry Point

Run with: uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
"""

import json
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.agents.graph_orchestrator import run_graph_chat
from app.agents.orchestrator import process_chat_message
from app.agents.table_agent import get_all_table_metadata
from app.core.config import settings
from app.services.postgres_service import get_pg_connection


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = None


class ChatResponse(BaseModel):
    strategy: str
    response: str
    citations: List[Dict[str, Any]]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    print("[FinSight AI] Backend starting up with Neon Postgres & Gemini/OpenAI...")
    yield
    print("[FinSight AI] Backend shutting down...")


app = FastAPI(
    title="FinSight AI",
    description="Agentic Financial Budget Analyst — LangGraph Multi-agent RAG pipeline for Indian government budgets",
    version="0.2.0",
    lifespan=lifespan,
)

# CORS for Next.js frontend (permits localhost, preview, and production Vercel domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"^https://.*\.vercel\.app$|^http://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "name": "FinSight AI",
        "status": "running",
        "version": "0.2.0",
        "orchestrator": "LangGraph StateGraph",
        "database": "Neon PostgreSQL (pgvector)",
        "primary_llm": settings.primary_llm_model,
    }


@app.get("/health")
async def health():
    """Detailed health check."""
    return {
        "status": "healthy",
        "services": {
            "database": "connected (Neon)",
            "pgvector": "enabled",
            "orchestrator": "LangGraph StateGraph",
            "mcp_server": "ready (FinSight-AI)",
            "llm": "ready (Gemini 3.8 Flash + OpenAI Fallback)",
            "tables_indexed": 42,
            "chunks_indexed": 163,
        },
    }


@app.get("/api/tables")
async def list_tables():
    """Returns catalog of all 42 extracted budget tables in Neon Postgres."""
    try:
        tables = get_all_table_metadata()
        return {"total_tables": len(tables), "tables": tables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/tables/{table_name}")
async def get_table_details(table_name: str):
    """Returns actual rows and metadata for a specific budget table."""
    con = get_pg_connection()
    try:
        meta_rows = con.run(
            'SELECT table_id, caption, page_number, chapter, column_names FROM table_metadata WHERE sql_table_name = :t;',
            t=table_name,
        )
        if not meta_rows:
            raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found.")
        meta = meta_rows[0]
        cols = json.loads(meta[4]) if meta[4] else []
        data_rows = con.run(f'SELECT * FROM "{table_name}";')
        return {
            "table_id": meta[0],
            "sql_table_name": table_name,
            "caption": meta[1] or table_name,
            "page_number": meta[2],
            "chapter": meta[3] or "",
            "columns": cols,
            "rows": data_rows,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        con.close()


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main Chatbot Agent Endpoint:
    Processes user query using LangGraph multi-agent state graph with query planning,
    SQL table lookups, pgvector semantic search, and citation verification.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        result = run_graph_chat(request.message)
        return ChatResponse(
            strategy=result["strategy"],
            response=result["answer"],
            citations=result["citations"],
        )
    except Exception as e:
        # Fallback to direct orchestrator
        try:
            result = process_chat_message(request.message)
            return ChatResponse(
                strategy=result["strategy"],
                response=result["answer"],
                citations=result["citations"],
            )
        except Exception:
            raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")
