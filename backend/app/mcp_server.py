"""
FinSight AI — Model Context Protocol (MCP) Server

Exposes FinSight AI's financial analysis tools to any MCP-compatible client
(Anthropic Claude Desktop, Cursor, Antigravity, or custom LLM agents).

Tools exposed:
1. list_budget_tables: Browse metadata catalog of all 42 budget tables.
2. query_budget_table: Execute SQL lookups on the 42 extracted financial tables.
3. search_budget_narrative: Semantic search across the 223 section chunks.
4. run_financial_analyst_agent: Full agentic LangGraph pipeline execution.
"""

import sys
from typing import Any, Dict, List, Optional
from mcp.server.mcpserver import MCPServer

from app.agents.graph_orchestrator import run_graph_chat
from app.agents.semantic_agent import retrieve_narrative_context
from app.agents.table_agent import get_all_table_metadata, query_table_data

# Create Fast/Standard MCP Server instance
server = MCPServer(
    name="FinSight-AI",
    version="0.1.0",
    description="Agentic Financial Budget Analyst for Indian Government Budgets (Tamil Nadu Fiscal White Paper)",
)


@server.tool()
def list_budget_tables() -> str:
    """Lists all 42 financial budget tables extracted from the Tamil Nadu White Paper."""
    tables = get_all_table_metadata()
    if not tables:
        return "No budget tables currently loaded."

    lines = [f"Found {len(tables)} financial budget tables in database:"]
    for t in tables:
        lines.append(f"- `{t['sql_table_name']}` (Page {t['page_number']}): {t['caption']}")
    return "\n".join(lines)


@server.tool()
def query_budget_table(query: str) -> str:
    """
    Finds and executes SQL against the most relevant budget table based on a user's question.
    Returns markdown table and citation.
    """
    res = query_table_data(query)
    if not res:
        return f"No matching budget table found for query: '{query}'."

    return (
        f"### {res['caption']} (Page {res['page_number']})\n"
        f"**Source Table**: `{res['table_name']}`\n\n"
        f"{res['data_markdown']}"
    )


@server.tool()
def search_budget_narrative(query: str, top_k: int = 3) -> str:
    """
    Performs pgvector semantic vector search across the 223 White Paper section chunks.
    Returns matched narrative excerpts with chapter, section, and page metadata.
    """
    chunks = retrieve_narrative_context(query, top_k=top_k)
    if not chunks:
        return f"No relevant narrative sections found for query: '{query}'."

    output_blocks = []
    for i, c in enumerate(chunks, 1):
        output_blocks.append(
            f"### Result {i}: {c['citation']}\n"
            f"- **Chapter**: {c['chapter']}\n"
            f"- **Section**: {c['section']}\n"
            f"- **Pages**: {c['page_numbers']}\n\n"
            f"{c['text']}\n"
        )
    return "\n---\n".join(output_blocks)


@server.tool()
def run_financial_analyst_agent(user_question: str) -> str:
    """
    Executes the full LangGraph multi-agent RAG workflow.
    Plans retrieval, queries tables and pgvector chunks, verifies facts, and returns an attributed answer.
    """
    result = run_graph_chat(user_question)
    citations = result.get("citations", [])

    citation_lines = []
    for c in citations:
        c_type = c.get("type", "source").upper()
        citation_lines.append(f"- **[{c_type}]** {c['label']}")

    citations_formatted = "\n".join(citation_lines) if citation_lines else "None"

    return (
        f"**Routing Strategy**: `{result['strategy']}`\n\n"
        f"### Analysis\n"
        f"{result['answer']}\n\n"
        f"### Verifiable Citations\n"
        f"{citations_formatted}"
    )


if __name__ == "__main__":
    # Runs over stdio by default for MCP client connection
    server.run()
