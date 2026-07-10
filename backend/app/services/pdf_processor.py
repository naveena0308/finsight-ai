"""
PDF Text Extraction Service

WHY THIS EXISTS:
================
This is Step 2 of our pipeline. We need to extract text from the TN Budget PDF
in a way that preserves document structure (chapters, sections, paragraphs).

HOW IT WORKS:
=============
1. PyMuPDF (fitz) reads each page and extracts raw text
2. We strip headers/footers (every page has "White Paper on..." + page number)
3. We detect chapter boundaries and section headings
4. We split into "chunks" that are semantically meaningful — not arbitrary 500-char blocks

WHY NOT JUST DUMP ALL TEXT?
===========================
If you chunk blindly (every 500 chars), you'll split sentences mid-thought,
separate a table caption from its data, or merge two unrelated sections.
That means when a user asks "What is TN's debt-to-GSDP ratio?", the retriever
might pull a chunk that has half the answer + half of some other paragraph.

Our approach: chunk by SECTION (using heading detection), so each chunk is a
complete, coherent unit of information.
"""

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional

import fitz  # PyMuPDF


@dataclass
class TextChunk:
    """
    A single chunk of extracted text with metadata.
    
    WHY METADATA MATTERS:
    When the LLM cites something, we want to say "Source: Chapter 2, Section 2.3, Page 25"
    — not just "somewhere in the PDF." This metadata makes citations possible.
    """
    text: str
    page_numbers: List[int]      # Which pages this chunk spans
    chapter: Optional[str] = None  # e.g., "Chapter 2: Unsustainable Debt Levels"
    section: Optional[str] = None  # e.g., "2.3 The Debt Trajectory"
    chunk_type: str = "paragraph"  # "paragraph", "executive_summary", "preface", "abbreviation"
    source_doc: str = ""           # Which PDF this came from (for multi-doc support later)
    

@dataclass
class ExtractionResult:
    """Container for all extraction results from a PDF."""
    chunks: List[TextChunk] = field(default_factory=list)
    total_pages: int = 0
    chapters_found: List[str] = field(default_factory=list)
    source_file: str = ""


# --- Header/Footer patterns to strip ---
# Every page has these — they're noise for our purposes
HEADER_PATTERN = re.compile(
    r"White Paper on the Fiscal Management of Tamil Nadu",
    re.IGNORECASE
)
PAGE_NUM_PATTERN = re.compile(r"^\s*Page\s+\d+\s*$", re.MULTILINE)

# --- Chapter and section detection ---
CHAPTER_PATTERN = re.compile(
    r"^Chapter\s+(\d+)\s*:\s*(.+)$", re.MULTILINE
)
SECTION_PATTERN = re.compile(
    r"^(\d+\.\d+)\s+(.+)$", re.MULTILINE
)
# TOC trailing dots + page numbers (e.g., "Introduction ............. 18")
TOC_TRAIL_PATTERN = re.compile(r"\s*[\.]{3,}\s*\d*\s*$")
# Numbered paragraphs like "2.5." or "2.13."
PARA_NUM_PATTERN = re.compile(r"^(\d+\.\d+)\.\s*$", re.MULTILINE)


def clean_page_text(text: str) -> str:
    """
    Remove headers, footers, and page numbers from a single page's text.
    
    WHY: Every page starts with "White Paper on the Fiscal Management of Tamil Nadu"
    and has "Page XX" — this is noise that would pollute our embeddings.
    """
    # Remove the document header
    text = HEADER_PATTERN.sub("", text)
    
    # Remove standalone page numbers
    text = PAGE_NUM_PATTERN.sub("", text)
    
    # Remove excessive whitespace but keep paragraph breaks
    text = re.sub(r"\n{3,}", "\n\n", text)
    
    return text.strip()


def extract_text_by_page(pdf_path: str) -> List[dict]:
    """
    Extract text from each page with page number metadata.
    
    Returns a list of {page_num, text} dicts — raw building blocks before chunking.
    """
    doc = fitz.open(pdf_path)
    pages = []
    
    for i in range(doc.page_count):
        page = doc[i]
        raw_text = page.get_text()
        cleaned = clean_page_text(raw_text)
        
        if cleaned:  # Skip empty pages
            pages.append({
                "page_num": i + 1,  # 1-indexed for human readability
                "text": cleaned,
            })
    
    doc.close()
    return pages


def detect_chapters(full_text: str) -> List[dict]:
    """
    Find all chapter headings and their positions in the text.
    
    Returns: [{"chapter_num": 1, "title": "Introduction and Context", "start": 1234}, ...]
    """
    chapters = []
    for match in CHAPTER_PATTERN.finditer(full_text):
        # Clean TOC artifacts like "Introduction ................... 18"
        raw_title = match.group(2).strip()
        clean_title = TOC_TRAIL_PATTERN.sub("", raw_title).strip()
        chapters.append({
            "chapter_num": int(match.group(1)),
            "title": f"Chapter {match.group(1)}: {clean_title}",
            "start": match.start(),
        })
    
    # Deduplicate: keep the LAST occurrence of each chapter number.
    # WHY LAST? The FIRST occurrence is in the Table of Contents (page 2-3).
    # The LAST occurrence is the actual chapter heading in the body.
    # If we keep the first, all body content gets assigned to whatever chapter
    # appears last in the TOC (Chapter 10), which is completely wrong.
    last_seen = {}
    for ch in chapters:
        last_seen[ch["chapter_num"]] = ch  # Later ones overwrite earlier ones
    
    unique = sorted(last_seen.values(), key=lambda x: x["start"])
    
    return unique


def chunk_by_sections(
    pages: List[dict],
    max_chunk_size: int = 1500,
    min_chunk_size: int = 100,
) -> List[TextChunk]:
    """
    Split extracted pages into semantically meaningful chunks.
    
    HOW THIS WORKS:
    ===============
    1. We concatenate all pages into one big text (tracking page boundaries)
    2. We find chapter headings → these are major boundaries
    3. Within chapters, we find section headings (e.g., "2.3 The Debt Trajectory")
    4. Each section becomes a chunk
    5. If a section is too long (> max_chunk_size), we split at paragraph boundaries
    6. If a section is too short (< min_chunk_size), we merge it with the next one
    
    WHY 1500 CHARS?
    Most embedding models work best with chunks of 500-2000 characters.
    Too small → not enough context for meaningful embedding.
    Too large → embedding becomes too "averaged out" and loses specificity.
    1500 is a sweet spot for financial documents.
    """
    chunks = []
    
    # Track which pages each character position maps to
    full_text = ""
    char_to_page = {}
    
    for page in pages:
        start_pos = len(full_text)
        full_text += page["text"] + "\n\n"
        for i in range(start_pos, len(full_text)):
            char_to_page[i] = page["page_num"]
    
    # Detect chapters
    chapters = detect_chapters(full_text)
    
    # Find all section boundaries
    section_boundaries = []
    
    for match in SECTION_PATTERN.finditer(full_text):
        raw_section = match.group(2).strip()
        clean_section = TOC_TRAIL_PATTERN.sub("", raw_section).strip()
        section_boundaries.append({
            "title": f"{match.group(1)} {clean_section}",
            "start": match.start(),
        })
    
    # Add chapter starts as boundaries too
    for ch in chapters:
        section_boundaries.append({
            "title": ch["title"],
            "start": ch["start"],
        })
    
    # Sort all boundaries by position
    section_boundaries.sort(key=lambda x: x["start"])
    
    # Deduplicate boundaries that are very close together
    filtered_boundaries = []
    for b in section_boundaries:
        if not filtered_boundaries or b["start"] - filtered_boundaries[-1]["start"] > 50:
            filtered_boundaries.append(b)
    
    # Handle text before first boundary (preface, executive summary, etc.)
    if filtered_boundaries and filtered_boundaries[0]["start"] > min_chunk_size:
        pre_text = full_text[:filtered_boundaries[0]["start"]].strip()
        if len(pre_text) > min_chunk_size:
            # Determine chunk type
            chunk_type = "preface"
            if "executive summary" in pre_text.lower()[:200]:
                chunk_type = "executive_summary"
            elif "abbreviation" in pre_text.lower()[:200]:
                chunk_type = "abbreviation"
            
            page_nums = _get_page_range(0, filtered_boundaries[0]["start"], char_to_page)
            chunks.append(TextChunk(
                text=pre_text,
                page_numbers=page_nums,
                chunk_type=chunk_type,
                source_doc="TN_Budget_2026",
            ))
    
    # Create chunks from section boundaries
    current_chapter = None
    
    for i, boundary in enumerate(filtered_boundaries):
        # Update current chapter
        if boundary["title"].startswith("Chapter"):
            current_chapter = boundary["title"]
        
        # Get text until next boundary (or end of document)
        start = boundary["start"]
        end = filtered_boundaries[i + 1]["start"] if i + 1 < len(filtered_boundaries) else len(full_text)
        section_text = full_text[start:end].strip()
        
        if len(section_text) < min_chunk_size:
            continue
        
        page_nums = _get_page_range(start, end, char_to_page)
        
        # If section is within size limit, keep as one chunk
        if len(section_text) <= max_chunk_size:
            chunks.append(TextChunk(
                text=section_text,
                page_numbers=page_nums,
                chapter=current_chapter,
                section=boundary["title"],
                chunk_type="paragraph",
                source_doc="TN_Budget_2026",
            ))
        else:
            # Split large sections at paragraph boundaries (double newline)
            sub_chunks = _split_large_section(
                section_text, max_chunk_size, min_chunk_size
            )
            for j, sub_text in enumerate(sub_chunks):
                sub_pages = _get_page_range(
                    start, start + len(sub_text), char_to_page
                )
                chunks.append(TextChunk(
                    text=sub_text,
                    page_numbers=sub_pages if sub_pages else page_nums,
                    chapter=current_chapter,
                    section=f"{boundary['title']} (part {j+1})",
                    chunk_type="paragraph",
                    source_doc="TN_Budget_2026",
                ))
    
    return chunks


def _get_page_range(start: int, end: int, char_to_page: dict) -> List[int]:
    """Get the unique page numbers that a character range spans."""
    pages = set()
    for pos in range(start, min(end, max(char_to_page.keys()) + 1)):
        if pos in char_to_page:
            pages.add(char_to_page[pos])
    return sorted(pages)


def _split_large_section(
    text: str,
    max_size: int,
    min_size: int,
) -> List[str]:
    """
    Split a large section at paragraph boundaries.
    Falls back to sentence boundaries if paragraphs are too large.
    """
    paragraphs = text.split("\n\n")
    result_chunks = []
    current = ""
    
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        
        if len(current) + len(para) + 2 <= max_size:
            current = f"{current}\n\n{para}" if current else para
        else:
            if current and len(current) >= min_size:
                result_chunks.append(current.strip())
            current = para
    
    if current and len(current) >= min_size:
        result_chunks.append(current.strip())
    elif current and result_chunks:
        # Merge tiny trailing text with last chunk
        result_chunks[-1] = f"{result_chunks[-1]}\n\n{current.strip()}"
    
    return result_chunks if result_chunks else [text]


def process_pdf(pdf_path: str) -> ExtractionResult:
    """
    Main entry point: process a PDF and return structured chunks.
    
    This is what gets called from the pipeline:
        result = process_pdf("data/raw/TN_White_Paper_English-2026.pdf")
        chunks = result.chunks  # Ready for embedding
    """
    path = Path(pdf_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    
    print(f"[PDF] Processing: {path.name}")
    
    # Step 1: Extract text by page
    pages = extract_text_by_page(str(path))
    print(f"   Extracted text from {len(pages)} pages")
    
    # Step 2: Chunk by sections
    chunks = chunk_by_sections(pages)
    print(f"   Created {len(chunks)} chunks")
    
    # Step 3: Get chapter list
    full_text = "\n".join(p["text"] for p in pages)
    chapters = detect_chapters(full_text)
    chapter_titles = [ch["title"] for ch in chapters]
    print(f"   Found {len(chapter_titles)} chapters")
    
    # Stats
    sizes = [len(c.text) for c in chunks]
    print(f"   Chunk sizes: min={min(sizes)}, max={max(sizes)}, avg={sum(sizes)//len(sizes)}")
    
    return ExtractionResult(
        chunks=chunks,
        total_pages=len(pages),
        chapters_found=chapter_titles,
        source_file=str(path),
    )


# Allow running directly for testing
if __name__ == "__main__":
    result = process_pdf("data/raw/TN_White_Paper_English-2026.pdf")
    
    print(f"\n{'='*60}")
    print(f"EXTRACTION SUMMARY")
    print(f"{'='*60}")
    print(f"Total chunks: {len(result.chunks)}")
    print(f"Chapters: {len(result.chapters_found)}")
    
    print(f"\nChapters found:")
    for ch in result.chapters_found:
        print(f"  > {ch}")
    
    print(f"\nSample chunks:")
    for i, chunk in enumerate(result.chunks[:5]):
        print(f"\n--- Chunk {i+1} ---")
        print(f"  Chapter: {chunk.chapter}")
        print(f"  Section: {chunk.section}")
        print(f"  Pages: {chunk.page_numbers}")
        print(f"  Type: {chunk.chunk_type}")
        print(f"  Text: {chunk.text[:200]}...")
