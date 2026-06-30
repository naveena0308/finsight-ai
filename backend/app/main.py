"""
FinSight AI — FastAPI Backend Entry Point

Run with: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: Initialize vector store, load models, etc.
    print("🚀 FinSight AI backend starting up...")
    yield
    # Shutdown: Cleanup resources
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
        "description": "Agentic Financial Budget Analyst",
    }


@app.get("/health")
async def health():
    """Detailed health check."""
    return {
        "status": "healthy",
        "services": {
            "vector_store": "not_initialized",
            "llm": "not_initialized",
            "agents": "not_initialized",
        },
    }
