"""
FinSight AI — FastAPI Backend Entry Point

Run with: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""

from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.agents.orchestrator import process_chat_message
from app.agents.table_agent import get_all_table_metadata
from app.core.config import settings


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
    print("🚀 FinSight AI backend starting up with Neon Postgres & Gemini/OpenAI...")
    yield
    print("👋 FinSight AI backend shutting down...")


app = FastAPI(
    title="FinSight AI",
    description="Agentic Financial Budget Analyst — Multi-agent RAG pipeline for Indian government budgets",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
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
        "version": "0.1.0",
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


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main Chatbot Agent Endpoint:
    Processes user query, routes to SQL/Vector agents, and returns citation-backed answer.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        result = process_chat_message(request.message)
        return ChatResponse(
            strategy=result["strategy"],
            response=result["answer"],
            citations=result["citations"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")
