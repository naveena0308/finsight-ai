"""
Application configuration loaded from environment variables.
"""

import os
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings

# Load .env file
load_dotenv()

# Project root (backend/)
BACKEND_ROOT = Path(__file__).parent.parent.parent


class Settings(BaseSettings):
    """Application settings from environment variables."""

    # --- LLM ---
    gemini_api_key: str = Field(default="", alias="GEMINI_API_KEY")
    openai_api_key: str = Field(default="", alias="OPENAI_API_KEY")
    primary_llm_model: str = Field(default="gemini-2.0-flash", alias="PRIMARY_LLM_MODEL")
    embedding_model: str = Field(default="text-embedding-004", alias="EMBEDDING_MODEL")

    # --- Vector Store ---
    chroma_persist_dir: str = Field(
        default=str(BACKEND_ROOT / "chroma_db"), alias="CHROMA_PERSIST_DIR"
    )

    # --- Server ---
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    cors_origins: List[str] = Field(
        default=["http://localhost:3000"], alias="CORS_ORIGINS"
    )

    # --- Data Paths ---
    raw_data_dir: str = Field(
        default=str(BACKEND_ROOT / "data" / "raw"), alias="RAW_DATA_DIR"
    )
    processed_data_dir: str = Field(
        default=str(BACKEND_ROOT / "data" / "processed"), alias="PROCESSED_DATA_DIR"
    )
    eval_data_dir: str = Field(
        default=str(BACKEND_ROOT / "data" / "eval"), alias="EVAL_DATA_DIR"
    )

    class Config:
        env_file = ".env"
        populate_by_name = True


settings = Settings()
