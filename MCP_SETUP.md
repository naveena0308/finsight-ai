# FinSight AI — Model Context Protocol (MCP) Server Setup

FinSight AI includes a built-in Model Context Protocol (MCP) server exposing financial budget analysis tools to external LLM clients (such as Claude Desktop, Cursor, Antigravity, or custom agent frameworks).

---

## 🛠️ Exposed Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `list_budget_tables` | None | Returns the full metadata catalog of all 42 extracted budget tables in Neon Postgres/SQLite. |
| `query_budget_table` | `query: str` | Automatically selects and executes SQL against the most relevant budget table (e.g. Debt, Deficit, SoTR). |
| `search_budget_narrative` | `query: str`, `top_k: int = 3` | Performs `pgvector` semantic vector search across 223 White Paper section chunks with chapter and page citations. |
| `run_financial_analyst_agent` | `user_question: str` | Runs the full **LangGraph StateGraph** multi-agent pipeline with query planning, table lookup, vector search, and citation verification. |

---

## 🚀 Running the MCP Server Directly

Run from the `backend/` directory:

```bash
cd backend
python -m app.mcp_server
```

---

## ⚙️ Connecting to External Clients

### 1. Claude Desktop Configuration
Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "finsight-ai": {
      "command": "python",
      "args": [
        "-m",
        "app.mcp_server"
      ],
      "cwd": "d:/Naveena Natarajan/Personal/finsight-ai/backend",
      "env": {
        "PYTHONPATH": "d:/Naveena Natarajan/Personal/finsight-ai/backend"
      }
    }
  }
}
```

### 2. Cursor IDE Configuration
In Cursor Settings > Features > MCP Servers:
- **Name**: `FinSight-AI`
- **Type**: `command`
- **Command**: `python -m app.mcp_server`
- **Directory**: `d:/Naveena Natarajan/Personal/finsight-ai/backend`
