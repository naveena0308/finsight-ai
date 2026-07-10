"""
Table Extraction Service — Extracting structured budget data from PDF tables.

WHY THIS EXISTS:
================
Budget documents are 50% text and 50% tables. The TEXT tells you the story
("TN's debt has been growing"), but the TABLES have the actual numbers
("Rs. 9,99,832 crore in 2025-26"). If you only do text-based RAG, you'll
get vague answers. With structured tables in SQLite, our Table Lookup Agent
can answer "What was TN's debt in 2024-25?" with a precise SQL query.

HOW IT WORKS:
=============
1. PyMuPDF's built-in `page.find_tables()` detects table boundaries on each page
2. We extract each table as a pandas DataFrame
3. We clean up the DataFrame (remove empty columns from merged cells, fix headers)
4. We try to match each table to its caption (e.g., "Table 2.1: Outstanding Debt...")
5. We store everything in a SQLite database with metadata

WHY SQLITE (not PostgreSQL/MongoDB)?
=====================================
- Zero infrastructure — no server to run, just a file
- SQL queries work great for structured budget lookups
- Easy to deploy (the .db file goes with your app)
- Perfect for our scale (~45 tables, ~500 rows total)
- Later, our Table Lookup Agent will generate SQL queries against this
"""

import json
import re
import sqlite3
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import fitz  # PyMuPDF
import pandas as pd


@dataclass
class ExtractedTable:
    """
    A single table extracted from the PDF with its metadata.
    
    WHY ALL THIS METADATA?
    When the agent cites a number, we want to say:
    "Rs. 9,99,832 crore (Table 2.1: Outstanding Debt, Page 27)"
    The metadata makes this possible.
    """
    table_id: str              # e.g., "table_2_1" or "page_27_table_1"
    caption: Optional[str]     # e.g., "Table 2.1: Outstanding Debt and Liabilities"
    page_number: int           # 1-indexed
    dataframe: pd.DataFrame    # The actual data
    chapter: Optional[str]     # Which chapter this table belongs to
    source_doc: str            # For multi-doc support later


@dataclass
class TableExtractionResult:
    """Container for all table extraction results."""
    tables: List[ExtractedTable] = field(default_factory=list)
    total_pages_scanned: int = 0
    source_file: str = ""


# ============================================================
# TABLE CAPTION DETECTION
# ============================================================
# Budget PDFs label their tables as "Table 2.1: Some Title"
# We need to match each extracted table with its caption.

TABLE_CAPTION_PATTERN = re.compile(
    r"Table\s+(\d+)\.(\d+)\s*:?\s*(.*?)(?:\n|$)",
    re.IGNORECASE
)

# Columns that are artifacts of merged cells — PyMuPDF creates empty "Col1", "Col3" etc.
EMPTY_COL_PATTERN = re.compile(r"^Col\d+$")


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean a raw extracted DataFrame.
    
    WHY THIS IS NEEDED:
    PyMuPDF table extraction from PDFs with merged cells creates phantom columns
    like "Col1", "Col3", "Col5" that are completely empty. These are artifacts
    of how PDF tables store merged cells internally. We strip them.
    
    We also:
    - Remove completely empty rows
    - Strip whitespace from all cells
    - Replace newlines within cells (from multi-line headers) with spaces
    """
    # Step 1: Identify and remove phantom columns (ColN pattern with mostly empty values)
    cols_to_drop = []
    for col in df.columns:
        if EMPTY_COL_PATTERN.match(str(col)):
            # Check if column is mostly empty/NaN
            non_empty = df[col].dropna().astype(str).str.strip().str.len().sum()
            if non_empty == 0:
                cols_to_drop.append(col)
    
    if cols_to_drop:
        df = df.drop(columns=cols_to_drop)
    
    # Step 2: Clean cell values
    for col in df.columns:
        if df[col].dtype == object:
            df[col] = (
                df[col]
                .astype(str)
                .str.replace("\n", " ", regex=False)
                .str.strip()
                .replace({"nan": None, "None": None, "": None})
            )
    
    # Step 3: Clean column names (replace newlines)
    df.columns = [
        str(c).replace("\n", " ").strip() 
        for c in df.columns
    ]
    
    # Step 4: Remove completely empty rows
    df = df.dropna(how="all").reset_index(drop=True)
    
    return df


def find_table_caption(page_text: str, page_num: int) -> List[dict]:
    """
    Find table captions in the page text.
    
    WHY SEPARATE FROM TABLE EXTRACTION?
    PyMuPDF extracts the table DATA but not the caption above it.
    The caption (e.g., "Table 2.1: Outstanding Debt...") is just regular text.
    We find it by regex matching on the page text.
    """
    captions = []
    for match in TABLE_CAPTION_PATTERN.finditer(page_text):
        chapter_num = int(match.group(1))
        table_num = int(match.group(2))
        title = match.group(3).strip()
        
        # Clean title: remove trailing dots, page numbers from TOC
        title = re.sub(r"[\.\s]+\d*\s*$", "", title).strip()
        
        captions.append({
            "table_ref": f"Table {chapter_num}.{table_num}",
            "table_id": f"table_{chapter_num}_{table_num}",
            "full_caption": f"Table {chapter_num}.{table_num}: {title}" if title else f"Table {chapter_num}.{table_num}",
            "chapter_num": chapter_num,
        })
    
    return captions


# Chapter mapping for labeling tables
CHAPTER_MAP = {
    1: "Introduction and Context",
    2: "Unsustainable Debt Levels",
    3: "The Soaring Revenue Deficit",
    4: "The Collapse in Revenue Receipts",
    5: "Committed Expenditure and Crowding Out",
    6: "Fiscal Deficit and Fiscal Responsibility",
    7: "Contingent Liabilities and PSUs",
    8: "Post-COVID Consolidation Failure",
    9: "Way Forward",
    10: "Conclusion",
}

# Pages to skip (TOC, abbreviations — not real data tables)
SKIP_PAGES = {1, 2, 3, 4, 5, 6, 7}  # 1-indexed


def extract_tables_from_pdf(pdf_path: str) -> TableExtractionResult:
    """
    Main entry point: Extract ALL tables from a PDF.
    
    Returns a list of ExtractedTable objects with clean DataFrames and metadata.
    """
    path = Path(pdf_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    
    print(f"[TABLE] Extracting tables from: {path.name}")
    
    doc = fitz.open(str(path))
    all_tables: List[ExtractedTable] = []
    
    for pg_idx in range(doc.page_count):
        page_num = pg_idx + 1  # 1-indexed
        
        if page_num in SKIP_PAGES:
            continue
        
        page = doc[pg_idx]
        page_tables = page.find_tables()
        
        if not page_tables.tables:
            continue
        
        # Get page text to find captions
        page_text = page.get_text()
        captions = find_table_caption(page_text, page_num)
        
        for t_idx, table in enumerate(page_tables.tables):
            df = table.to_pandas()
            
            # Skip tiny tables (likely artifacts — headers, footers parsed as tables)
            if df.shape[0] < 2 or df.shape[1] < 2:
                continue
            
            # Clean the DataFrame
            df = clean_dataframe(df)
            
            # Skip if cleaning left us with nothing useful
            if df.empty or df.shape[1] < 2:
                continue
            
            # Match with caption (if we found one on this page)
            caption = None
            table_id = f"page_{page_num}_table_{t_idx + 1}"
            chapter = None
            
            if captions:
                # Use the caption that matches this table's position
                cap_idx = min(t_idx, len(captions) - 1)
                cap = captions[cap_idx]
                caption = cap["full_caption"]
                table_id = cap["table_id"]
                chapter_num = cap["chapter_num"]
                chapter = f"Chapter {chapter_num}: {CHAPTER_MAP.get(chapter_num, 'Unknown')}"
            
            all_tables.append(ExtractedTable(
                table_id=table_id,
                caption=caption,
                page_number=page_num,
                dataframe=df,
                chapter=chapter,
                source_doc="TN_Budget_2026",
            ))
    
    total_pages = doc.page_count
    doc.close()
    
    print(f"   Extracted {len(all_tables)} tables from {total_pages} pages")
    
    return TableExtractionResult(
        tables=all_tables,
        total_pages_scanned=total_pages,
        source_file=str(path),
    )


# ============================================================
# SQLITE STORAGE
# ============================================================
# WHY SQLITE?
# Our Table Lookup Agent needs to answer questions like:
#   "What was TN's outstanding debt in 2024-25?"
# It does this by generating a SQL query against our structured data.
# SQLite is perfect because:
#   - No server needed (just a .db file)
#   - Full SQL support (WHERE, JOIN, GROUP BY, etc.)
#   - Python's sqlite3 module is built-in
#   - Easy to deploy alongside the app

def store_tables_in_sqlite(
    tables: List[ExtractedTable],
    db_path: str = "data/processed/budget_tables.db",
) -> str:
    """
    Store all extracted tables in a SQLite database.
    
    Each table gets stored as its own SQL table, plus a metadata table
    that indexes all tables with their captions and page numbers.
    
    WHY A METADATA TABLE?
    When the Table Lookup Agent receives a query, it first checks the metadata
    to find WHICH table is relevant, then queries that specific table.
    Without metadata, the agent would have to scan every table — slow and imprecise.
    """
    db_path = Path(db_path)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Delete existing DB (fresh extraction each time)
    if db_path.exists():
        db_path.unlink()
    
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    # Create metadata table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS table_metadata (
            table_id TEXT PRIMARY KEY,
            caption TEXT,
            page_number INTEGER,
            chapter TEXT,
            source_doc TEXT,
            num_rows INTEGER,
            num_cols INTEGER,
            column_names TEXT,
            sql_table_name TEXT
        )
    """)
    
    stored_count = 0
    
    for table in tables:
        # Create a safe SQL table name
        sql_name = re.sub(r"[^a-zA-Z0-9_]", "_", table.table_id)
        
        try:
            # Store the DataFrame as a SQL table
            table.dataframe.to_sql(sql_name, conn, if_exists="replace", index=False)
            
            # Store metadata
            cursor.execute("""
                INSERT OR REPLACE INTO table_metadata 
                (table_id, caption, page_number, chapter, source_doc, 
                 num_rows, num_cols, column_names, sql_table_name)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                table.table_id,
                table.caption,
                table.page_number,
                table.chapter,
                table.source_doc,
                len(table.dataframe),
                len(table.dataframe.columns),
                json.dumps(list(table.dataframe.columns)),
                sql_name,
            ))
            
            stored_count += 1
            
        except Exception as e:
            print(f"   Warning: Could not store {table.table_id}: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"   Stored {stored_count} tables in {db_path}")
    return str(db_path)


def query_table(
    db_path: str,
    sql_query: str,
) -> pd.DataFrame:
    """
    Run a SQL query against the budget tables database.
    
    This is what the Table Lookup Agent will use:
        result = query_table("budget_tables.db", "SELECT * FROM table_2_1 WHERE Year = '2024-25'")
    
    WHY RAW SQL AND NOT AN ORM?
    Because the LLM agent will GENERATE the SQL query based on the user's question.
    It's easier for the LLM to write raw SQL than to generate ORM code.
    """
    conn = sqlite3.connect(db_path)
    try:
        df = pd.read_sql_query(sql_query, conn)
        return df
    finally:
        conn.close()


def get_table_metadata(db_path: str) -> pd.DataFrame:
    """
    Get metadata for all stored tables.
    
    The agent uses this to decide WHICH table to query:
    "User asked about debt → scan metadata → Table 2.1 is about Outstanding Debt → query that"
    """
    return query_table(db_path, "SELECT * FROM table_metadata")


# ============================================================
# MAIN ENTRY POINT
# ============================================================

def process_and_store_tables(
    pdf_path: str,
    db_path: str = "data/processed/budget_tables.db",
) -> Tuple[TableExtractionResult, str]:
    """
    Complete pipeline: Extract tables from PDF → Clean → Store in SQLite.
    
    Returns the extraction result and the database path.
    """
    # Step 1: Extract
    result = extract_tables_from_pdf(pdf_path)
    
    # Step 2: Store
    db_file = store_tables_in_sqlite(result.tables, db_path)
    
    return result, db_file


# Allow running directly for testing
if __name__ == "__main__":
    result, db_path = process_and_store_tables(
        "data/raw/TN_White_Paper_English-2026.pdf"
    )
    
    print(f"\n{'='*60}")
    print("TABLE EXTRACTION SUMMARY")
    print(f"{'='*60}")
    print(f"Total tables: {len(result.tables)}")
    
    print("\nAll tables:")
    for t in result.tables:
        print(f"  {t.table_id}: {t.caption} (Page {t.page_number}, {t.dataframe.shape[0]}x{t.dataframe.shape[1]})")
    
    # Test a SQL query
    print(f"\n{'='*60}")
    print("TEST QUERY: Outstanding Debt from Table 2.1")
    print(f"{'='*60}")
    
    # First, check what tables we have
    metadata = get_table_metadata(db_path)
    print("\nAvailable tables:")
    for _, row in metadata.iterrows():
        print(f"  {row['sql_table_name']}: {row['caption']} ({row['num_rows']} rows)")
    
    # Try querying the debt table
    try:
        debt_df = query_table(db_path, "SELECT * FROM table_2_1")
        print("\nTable 2.1 data:")
        print(debt_df.to_string())
    except Exception as e:
        print(f"\nCould not query table_2_1: {e}")
        # Try listing all SQL tables
        tables_list = query_table(db_path, "SELECT name FROM sqlite_master WHERE type='table'")
        print("Available SQL tables:", list(tables_list['name']))
