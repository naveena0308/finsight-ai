"""
FinSight AI Agentic Orchestrator

The central multi-agent controller that:
1. Classifies user question (Table Lookup, Narrative Reasoning, or Hybrid)
2. Gathers evidence from Neon Postgres (Tables + pgvector semantic chunks)
3. Synthesizes an evidence-backed answer with strict financial precision
4. Generates structured, clickable citation badges
"""

import json
import logging
import re
from typing import Any, Dict, List, Optional

from app.agents.semantic_agent import retrieve_narrative_context
from app.agents.table_agent import query_table_data
from app.services.llm_service import llm_service

logger = logging.getLogger("finsight.orchestrator")


ROUTER_PROMPT = """
You are an expert financial query router for the Tamil Nadu Government Budget & Fiscal White Paper.
Analyze the user's question and determine the optimal retrieval strategy:

1. "TABLE_LOOKUP": The question is asking for exact numerical values, specific year numbers, ratios, tables, or fiscal figures (e.g., "What was the debt in 2024-25?", "What is the revenue deficit in 2025-26?").
2. "NARRATIVE_SEARCH": The question is asking about explanations, reasons, policies, methodology, or qualitative context (e.g., "Why did revenue deficit increase?", "Explain the GST compensation cessation.").
3. "HYBRID": The question asks for both exact numbers AND the underlying causes or context (e.g., "How much did debt grow and what are the main factors causing it?").

Respond ONLY in JSON format:
{"strategy": "TABLE_LOOKUP" | "NARRATIVE_SEARCH" | "HYBRID", "reasoning": "..."}

User Question: {question}
"""

SYNTHESIZER_PROMPT = """
You are FinSight AI, an elite financial budget analyst assistant specializing in Indian Government Finances and the Tamil Nadu Fiscal Management White Paper (2021-22 to 2025-26).

Analyze the provided evidence and answer the user question with utmost factual accuracy.

RULES:
1. ONLY make claims supported by the provided Evidence. Do not speculate or hallucinate numbers.
2. Whenever you state a number or finding, attribute it explicitly with inline brackets: e.g. [Table 2.1, Page 27] or [Chapter 3, Page 44].
3. Format currency and financial metrics cleanly (e.g. Rs. 9,99,832 crore, 28.3% of GSDP).
4. If the provided evidence does not contain the answer, state honestly that the specific data is not available in the White Paper.
5. Provide a clear, professional summary followed by key bullet points or a concise breakdown.

Evidence:
{evidence}

User Question:
{question}
"""


def process_chat_message(user_message: str) -> Dict[str, Any]:
    """
    Main entry point for user chat interaction.
    """
    # Step 1: Query Routing
    strategy = "HYBRID"
    try:
        route_resp = llm_service.generate(ROUTER_PROMPT.format(question=user_message))
        m = re.search(r"\{.*\}", route_resp, re.DOTALL)
        if m:
            route_data = json.loads(m.group(0))
            strategy = route_data.get("strategy", "HYBRID")
    except Exception as e:
        logger.warning(f"[Orchestrator] Router fallback to HYBRID: {e}")

    evidence_parts = []
    citations = []

    # Step 2: Evidence Gathering
    if strategy in ("TABLE_LOOKUP", "HYBRID"):
        table_result = query_table_data(user_message)
        if table_result:
            evidence_parts.append(
                f"### Structured Table Data ({table_result['citation']}):\n{table_result['data_markdown']}"
            )
            citations.append({
                "type": "table",
                "label": table_result["citation"],
                "page": table_result["page_number"],
                "table_name": table_result["table_name"],
            })

    if strategy in ("NARRATIVE_SEARCH", "HYBRID") or not evidence_parts:
        chunks = retrieve_narrative_context(user_message, top_k=3)
        for c in chunks:
            evidence_parts.append(
                f"### Narrative Source: {c['citation']}\n{c['text']}"
            )
            citations.append({
                "type": "narrative",
                "label": c["citation"],
                "page": c["page_numbers"],
                "chapter": c["chapter"],
                "section": c["section"],
            })

    if not evidence_parts:
        evidence_str = "No specific direct evidence found in the document."
    else:
        evidence_str = "\n\n".join(evidence_parts)

    # Step 3: Synthesis & Verification
    synth_prompt = SYNTHESIZER_PROMPT.format(
        evidence=evidence_str,
        question=user_message,
    )
    answer = llm_service.generate(synth_prompt)

    # Deduplicate citations
    unique_citations = []
    seen = set()
    for cit in citations:
        key = cit["label"]
        if key not in seen:
            seen.add(key)
            unique_citations.append(cit)

    return {
        "strategy": strategy,
        "answer": answer,
        "citations": unique_citations,
    }
