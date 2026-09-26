"""
Table SQL Agent for FinSight AI

Handles:
1. Scanning table_metadata in Neon Postgres to select relevant tables
2. Generating precise SQL queries
3. Executing queries against Neon tables and extracting exact financial figures
4. Formatting table citations
"""

import json
import logging
import re
from typing import Any, Dict, List, Optional

import pandas as pd

from app.services.llm_service import llm_service
from app.services.postgres_service import get_pg_connection

logger = logging.getLogger("finsight.table_agent")


def get_all_table_metadata() -> List[Dict[str, Any]]:
    """Fetch metadata catalog for all available budget tables."""
    con = get_pg_connection()
    try:
        rows = con.run("""
            SELECT table_id, caption, page_number, chapter, num_rows, column_names, sql_table_name
            FROM table_metadata
            ORDER BY page_number ASC;
        """)
        catalog = []
        for r in rows:
            catalog.append({
                "table_id": r[0],
                "caption": r[1] or r[0],
                "page_number": r[2],
                "chapter": r[3] or "",
                "num_rows": r[4],
                "columns": json.loads(r[5]) if r[5] else [],
                "sql_table_name": r[6],
            })
        return catalog
    finally:
        con.close()


def query_table_data(user_query: str) -> Optional[Dict[str, Any]]:
    """
    Given a user question requiring numbers or financial tables:
    1. Finds the most relevant table(s) from metadata catalog
    2. Runs SQL against Neon Postgres
    3. Returns formatted tabular findings and citation
    """
    catalog = get_all_table_metadata()
    if not catalog:
        return None

    # Format table catalog for the LLM router
    catalog_summary = "\n".join([
        f"- Table `{t['sql_table_name']}` (Page {t['page_number']}): {t['caption']} | Columns: {t['columns']}"
        for t in catalog
    ])

    selector_prompt = f"""
You are a financial database router. Based on the user's question, pick the single most relevant SQL table name from the catalog below.
Return ONLY valid JSON in this format: {{"sql_table_name": "...", "reasoning": "..."}}

Table Catalog:
{catalog_summary}

User Question: {user_query}
"""

    try:
        selection_resp = llm_service.generate(selector_prompt)
        m = re.search(r"\{.*\}", selection_resp, re.DOTALL)
        if not m:
            return None
        selected = json.loads(m.group(0))
        table_name = selected.get("sql_table_name")
    except Exception as e:
        logger.warning(f"[TableAgent] Table selection failed: {e}")
        return None

    matched_meta = next((t for t in catalog if t["sql_table_name"] == table_name), None)
    if not matched_meta:
        return None

    con = get_pg_connection()
    try:
        raw_rows = con.run(f'SELECT * FROM "{table_name}";')
        cols = matched_meta["columns"]
        df = pd.DataFrame(raw_rows, columns=cols if len(cols) == (len(raw_rows[0]) if raw_rows else 0) else None)
        table_markdown = df.to_markdown(index=False)
    except Exception as e:
        logger.warning(f"[TableAgent] Querying table {table_name} failed: {e}")
        return None
    finally:
        con.close()

    caption = matched_meta["caption"]
    page = matched_meta["page_number"]
    citation = f"{caption} (Page {page})"

    return {
        "table_name": table_name,
        "caption": caption,
        "page_number": page,
        "citation": citation,
        "data_markdown": table_markdown,
        "row_count": len(raw_rows),
    }
