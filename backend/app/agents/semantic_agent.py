"""
Semantic Narrative Retriever Agent for FinSight AI

Handles:
1. Searching relevant narrative paragraphs using pgvector similarity search
2. Formats narrative excerpts with exact chapter, section, and page citations
"""

from typing import Any, Dict, List, Optional
from app.services.postgres_service import search_similar_chunks


def retrieve_narrative_context(
    query: str,
    top_k: int = 4,
    chapter_filter: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Retrieve semantic narrative context from Neon document_chunks.
    """
    chunks = search_similar_chunks(query, top_k=top_k, chapter_filter=chapter_filter)
    formatted_results = []

    for c in chunks:
        formatted_results.append({
            "id": c["id"],
            "text": c["text"],
            "citation": c["citation"],
            "page_numbers": c["page_numbers"],
            "chapter": c["chapter"],
            "section": c["section"],
            "score": c["similarity_score"],
        })

    return formatted_results
