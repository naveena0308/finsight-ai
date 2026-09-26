"""
Application configuration loaded from environment variables.
"""

from pathlib import Path
from typing import List

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings

# Project root (backend/)
BACKEND_ROOT = Path(__file__).parent.parent.parent

# Load .env file explicitly
load_dotenv(BACKEND_ROOT / ".env")


class Settings(BaseSettings):
    """Application settings from environment variables."""

    # --- LLM ---
    gemini_api_key: str = Field(default="", alias="GEMINI_API_KEY")
    openai_api_key: str = Field(default="", alias="OPENAI_API_KEY")
    primary_llm_model: str = Field(default="gemini-3.8-flash", alias="PRIMARY_LLM_MODEL")
    embedding_model: str = Field(default="gemini-embedding-001", alias="EMBEDDING_MODEL")

    # --- Database (Neon Postgres) ---
    database_url: str = Field(default="", alias="DATABASE_URL")
    database_url_unpooled: str = Field(default="", alias="DATABASE_URL_UNPOOLED")
    neon_branch: str = Field(default="production", alias="NEON_BRANCH")

    # --- Vector Store ---
    chroma_persist_dir: str = Field(
        default=str(BACKEND_ROOT / "chroma_db"), alias="CHROMA_PERSIST_DIR"
    )

    # --- Server ---
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    cors_origins: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
        ],
        alias="CORS_ORIGINS",
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
        env_file = str(BACKEND_ROOT / ".env")
        populate_by_name = True
        extra = "ignore"


settings = Settings()
