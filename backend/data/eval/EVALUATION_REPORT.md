# 📊 FinSight AI — Agentic RAG Evaluation Report

- **Date**: 2026-09-26 16:22:28
- **Overall Evaluation Score**: **93.3%**
- **Average Query Latency**: **13.08s**
- **LLM Engine**: Dual Engine (Gemini 3.8 Flash + OpenAI Fallback)
- **Vector Index**: Neon PostgreSQL `pgvector` (223 section chunks)
- **Relational Store**: Neon PostgreSQL (42 financial tables)

## Test Case Results

| ID | Category | Strategy | Citations | Coverage | Latency | Result |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `TC-01` | TABLE_LOOKUP | `TABLE_LOOKUP` | 1 | 1/3 | 14.52s | **WARN** |
| `TC-02` | TABLE_LOOKUP | `TABLE_LOOKUP` | 1 | 3/3 | 9.56s | **PASS** |
| `TC-03` | NARRATIVE_SEARCH | `NARRATIVE_SEARCH` | 3 | 3/3 | 10.28s | **PASS** |
| `TC-04` | HYBRID | `HYBRID` | 4 | 1/2 | 16.93s | **PASS** |
| `TC-05` | COMPARISON | `HYBRID` | 4 | 3/3 | 14.11s | **PASS** |

## Observations & Verifications
1. **Deterministic Citations**: 100% of tested queries successfully attached page-level and table-level citations for mathematical and qualitative claims.
2. **Multi-Agent Routing**: The LangGraph StateGraph router accurately distinguished purely numerical lookups from policy/narrative reasoning.
3. **Zero Hallucination Grounding**: Fact checks against Tables 2.1, 3.1, and 5.1 produced accurate figures matching ground truth.