"""
FinSight AI — LangGraph Multi-Agent StateGraph Orchestrator

Defines a formal StateGraph workflow coordinating:
1. Query Planner Node: Routes queries into TABLE_LOOKUP, NARRATIVE_SEARCH, or HYBRID.
2. Table Retriever Node: Extracts targeted numeric budget tables via SQL on Neon/SQLite.
3. Narrative Retriever Node: Performs semantic cosine search via pgvector on 223 section chunks.
4. Verifier Synthesizer Node: Verifies facts against retrieved evidence and enforces strict inline citations.
"""

import json
import logging
import re
from typing import Any, Dict, List, Optional, TypedDict

from langgraph.graph import END, START, StateGraph

from app.agents.semantic_agent import retrieve_narrative_context
from app.agents.table_agent import query_table_data
from app.services.llm_service import llm_service

logger = logging.getLogger("finsight.graph_orchestrator")


class AgentState(TypedDict):
    """The shared state passed through every node in the LangGraph workflow."""
    user_query: str
    strategy: str  # "TABLE_LOOKUP" | "NARRATIVE_SEARCH" | "HYBRID"
    reasoning: str
    table_result: Optional[Dict[str, Any]]
    narrative_chunks: List[Dict[str, Any]]
    evidence_text: str
    answer: str
    citations: List[Dict[str, Any]]


ROUTER_PROMPT = """
You are an expert financial query router for the Tamil Nadu Government Budget & Fiscal White Paper.
Analyze the user's question and determine the optimal retrieval strategy:

1. "TABLE_LOOKUP": The question asks for exact numerical values, specific year numbers, ratios, tables, or fiscal figures (e.g., "What was the debt in 2024-25?", "What is the committed expenditure in 2025-26?").
2. "NARRATIVE_SEARCH": The question asks about explanations, causes, economic reasoning, policy reforms, or methodology (e.g., "Why did revenue deficit increase?", "Explain the fiscal deterioration factors.").
3. "HYBRID": The question asks for both exact numbers AND the underlying causes or context (e.g., "How much did debt grow and why?").

Respond ONLY in JSON format:
{{"strategy": "TABLE_LOOKUP" | "NARRATIVE_SEARCH" | "HYBRID", "reasoning": "..."}}

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


def planner_node(state: AgentState) -> Dict[str, Any]:
    """Classifies user question and determines the optimal retrieval strategy."""
    query = state["user_query"]
    strategy = "HYBRID"
    reasoning = "Default hybrid routing"

    try:
        route_resp = llm_service.generate(ROUTER_PROMPT.format(question=query))
        m = re.search(r"\{.*\}", route_resp, re.DOTALL)
        if m:
            route_data = json.loads(m.group(0))
            strategy = route_data.get("strategy", "HYBRID")
            reasoning = route_data.get("reasoning", "")
    except Exception as e:
        logger.warning(f"[LangGraph Planner] Error in routing: {e}. Fallback to HYBRID.")

    logger.info(f"[LangGraph Planner] Selected strategy: {strategy} ({reasoning})")
    return {"strategy": strategy, "reasoning": reasoning}


def table_retriever_node(state: AgentState) -> Dict[str, Any]:
    """Retrieves structured budget table evidence via SQL lookup."""
    query = state["user_query"]
    table_result = None
    citations = list(state.get("citations") or [])

    try:
        table_result = query_table_data(query)
        if table_result:
            citations.append({
                "type": "table",
                "label": table_result["citation"],
                "page": table_result["page_number"],
                "table_name": table_result["table_name"],
            })
            logger.info(f"[LangGraph TableRetriever] Found table: {table_result['table_name']}")
    except Exception as e:
        logger.error(f"[LangGraph TableRetriever] Error querying table: {e}")

    return {"table_result": table_result, "citations": citations}


def narrative_retriever_node(state: AgentState) -> Dict[str, Any]:
    """Retrieves semantic narrative text chunks via pgvector cosine search."""
    query = state["user_query"]
    citations = list(state.get("citations") or [])
    chunks = []

    try:
        chunks = retrieve_narrative_context(query, top_k=3)
        for c in chunks:
            citations.append({
                "type": "narrative",
                "label": c["citation"],
                "page": c["page_numbers"],
                "chapter": c["chapter"],
                "section": c["section"],
            })
        logger.info(f"[LangGraph NarrativeRetriever] Retrieved {len(chunks)} chunks")
    except Exception as e:
        logger.error(f"[LangGraph NarrativeRetriever] Error retrieving chunks: {e}")

    return {"narrative_chunks": chunks, "citations": citations}


def verifier_synthesizer_node(state: AgentState) -> Dict[str, Any]:
    """Synthesizes evidence-backed answer with strict citation verification."""
    query = state["user_query"]
    table_result = state.get("table_result")
    chunks = state.get("narrative_chunks") or []
    citations = state.get("citations") or []

    evidence_parts = []
    if table_result:
        evidence_parts.append(
            f"### Structured Table Data ({table_result['citation']}):\n{table_result['data_markdown']}"
        )
    for c in chunks:
        evidence_parts.append(
            f"### Narrative Source: {c['citation']}\n{c['text']}"
        )

    if not evidence_parts:
        evidence_str = "No specific direct evidence found in the document."
    else:
        evidence_str = "\n\n".join(evidence_parts)

    synth_prompt = SYNTHESIZER_PROMPT.format(
        evidence=evidence_str,
        question=query,
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
        "evidence_text": evidence_str,
        "answer": answer,
        "citations": unique_citations,
    }


def route_after_planner(state: AgentState) -> str:
    """Conditional edge routing after planner node."""
    strat = state.get("strategy", "HYBRID")
    if strat == "NARRATIVE_SEARCH":
        return "narrative_retriever"
    # TABLE_LOOKUP and HYBRID both start with table retrieval
    return "table_retriever"


def route_after_table(state: AgentState) -> str:
    """Conditional edge routing after table retriever node."""
    strat = state.get("strategy", "HYBRID")
    if strat == "HYBRID" or not state.get("table_result"):
        # Hybrid requires narrative context as well; or fallback to narrative if no table was matched
        return "narrative_retriever"
    return "verifier_synthesizer"


# =========================================================================
# LangGraph Workflow Construction
# =========================================================================

def build_financial_rag_graph():
    """Constructs and compiles the FinSight AI LangGraph StateGraph."""
    workflow = StateGraph(AgentState)

    # Add Nodes
    workflow.add_node("planner", planner_node)
    workflow.add_node("table_retriever", table_retriever_node)
    workflow.add_node("narrative_retriever", narrative_retriever_node)
    workflow.add_node("verifier_synthesizer", verifier_synthesizer_node)

    # Add Edges
    workflow.add_edge(START, "planner")

    workflow.add_conditional_edges(
        "planner",
        route_after_planner,
        {
            "table_retriever": "table_retriever",
            "narrative_retriever": "narrative_retriever",
        },
    )

    workflow.add_conditional_edges(
        "table_retriever",
        route_after_table,
        {
            "narrative_retriever": "narrative_retriever",
            "verifier_synthesizer": "verifier_synthesizer",
        },
    )

    workflow.add_edge("narrative_retriever", "verifier_synthesizer")
    workflow.add_edge("verifier_synthesizer", END)

    return workflow.compile()


# Global compiled graph instance
rag_graph = build_financial_rag_graph()


def run_graph_chat(user_message: str) -> Dict[str, Any]:
    """High-level runner invoking the LangGraph StateGraph for a user message."""
    initial_state: AgentState = {
        "user_query": user_message,
        "strategy": "HYBRID",
        "reasoning": "",
        "table_result": None,
        "narrative_chunks": [],
        "evidence_text": "",
        "answer": "",
        "citations": [],
    }
    final_state = rag_graph.invoke(initial_state)
    return {
        "strategy": final_state.get("strategy", "HYBRID"),
        "answer": final_state.get("answer", ""),
        "citations": final_state.get("citations", []),
        "evidence_text": final_state.get("evidence_text", ""),
    }
