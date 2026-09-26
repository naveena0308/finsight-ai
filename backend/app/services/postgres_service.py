"""
PostgreSQL Service with pgvector for Neon Database

Handles:
1. Neon PostgreSQL connection via pure-Python pg8000
2. Storing 43 budget tables & metadata
3. Storing 163 document chunks with 3072-dimensional vector embeddings
4. Hybrid & vector similarity search with citations
"""

import json
import sqlite3
import time
import urllib.parse
from pathlib import Path
from typing import Any, Dict, List, Optional

import pandas as pd
import pg8000.native
from google import genai

from app.core.config import settings


def get_pg_connection() -> pg8000.native.Connection:
    """Create and return a direct pg8000 native connection to Neon Postgres."""
    url = settings.database_url_unpooled or settings.database_url
    if not url:
        raise ValueError("DATABASE_URL or DATABASE_URL_UNPOOLED not set in environment!")

    parsed = urllib.parse.urlparse(url)
    return pg8000.native.Connection(
        user=parsed.username,
        password=parsed.password,
        host=parsed.hostname,
        port=parsed.port or 5432,
        database=parsed.path.lstrip("/"),
        ssl_context=True,
    )


def generate_embedding(text: str, client: Optional[genai.Client] = None) -> List[float]:
    """Generate a 3072-dim vector embedding using gemini-embedding-001."""
    if client is None:
        client = genai.Client(api_key=settings.gemini_api_key)
    res = client.models.embed_content(
        model=settings.embedding_model,
        contents=text,
    )
    return res.embeddings[0].values


def search_similar_chunks(
    query: str,
    top_k: int = 4,
    chapter_filter: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Search chunks using pgvector cosine similarity.
    Calculates cosine similarity score: 1 - (embedding <=> query_vector).
    """
    client = genai.Client(api_key=settings.gemini_api_key)
    query_emb = generate_embedding(query, client=client)
    emb_str = "[" + ",".join(str(v) for v in query_emb) + "]"

    pg_con = get_pg_connection()
    try:
        filter_clause = "WHERE chapter = :chapter" if chapter_filter else ""
        sql = f"""
            SELECT id, text, page_numbers, chapter, section, citation, chunk_type,
                   1 - (embedding <=> :qemb::vector) AS similarity_score
            FROM document_chunks
            {filter_clause}
            ORDER BY embedding <=> :qemb::vector ASC
            LIMIT :limit;
        """
        params = {"qemb": emb_str, "limit": top_k}
        if chapter_filter:
            params["chapter"] = chapter_filter

        rows = pg_con.run(sql, **params)
        results = []
        for r in rows:
            results.append({
                "id": r[0],
                "text": r[1],
                "page_numbers": r[2],
                "chapter": r[3],
                "section": r[4],
                "citation": r[5],
                "chunk_type": r[6],
                "similarity_score": round(float(r[7]), 4),
            })
        return results
    finally:
        pg_con.close()


def query_postgres(sql: str) -> pd.DataFrame:
    """Execute arbitrary read SQL query against Neon Postgres and return DataFrame."""
    pg_con = get_pg_connection()
    try:
        rows = pg_con.run(sql)
        return pd.DataFrame(rows)
    finally:
        pg_con.close()
