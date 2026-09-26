"""
Unified LLM Service with Gemini Primary, Retry Logic, and OpenAI Fallback

Guarantees high availability:
- Primary: Gemini (gemini-3.8-flash / gemini-3.5-flash-lite) with automatic backoff retry on 503/429
- Fallback: OpenAI (gpt-4o-mini / gpt-4o) if Gemini fails
"""

import logging
import time
from typing import Any, Dict, List, Optional

import openai
from google import genai

from app.core.config import settings

logger = logging.getLogger("finsight.llm")


class LLMService:
    def __init__(self):
        self.gemini_key = settings.gemini_api_key
        self.openai_key = settings.openai_api_key
        self.gemini_model = settings.primary_llm_model or "gemini-3.8-flash"
        self.openai_model = "gpt-4o-mini"
        self.gemini_exhausted = False  # Circuit breaker: skips Gemini if daily quota exceeded

        # Initialize clients
        self.gemini_client = genai.Client(api_key=self.gemini_key) if self.gemini_key else None
        self.openai_client = openai.OpenAI(api_key=self.openai_key) if self.openai_key else None

    def generate(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
        max_output_tokens: int = 1500,
        retries: int = 2,
    ) -> str:
        """
        Generate text response with automatic retry on temporary demand spikes (503)
        and immediate fallback to OpenAI if Gemini fails or hits daily quota.
        """
        full_prompt = f"System: {system_instruction}\n\nUser Question/Task:\n{prompt}" if system_instruction else prompt

        # 1. Try Primary: Gemini (if not marked quota-exhausted)
        if self.gemini_client and not self.gemini_exhausted:
            for attempt in range(retries + 1):
                try:
                    response = self.gemini_client.models.generate_content(
                        model=self.gemini_model,
                        contents=full_prompt,
                    )
                    if response and response.text:
                        return response.text.strip()
                except Exception as e:
                    err_msg = str(e)
                    is_quota = "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg or "quota" in err_msg.lower()
                    if is_quota:
                        logger.warning("[LLM] Gemini quota reached (429). Activating OpenAI fallback immediately...")
                        self.gemini_exhausted = True
                        break

                    is_transient = "503" in err_msg or "high demand" in err_msg
                    if is_transient and attempt < retries:
                        sleep_time = 1.0 * (attempt + 1)
                        logger.info(f"[LLM] Gemini busy (503). Retrying in {sleep_time}s...")
                        time.sleep(sleep_time)
                        continue
                    else:
                        logger.warning(f"[LLM] Gemini generation failed: {e}. Switching to OpenAI...")
                        break

        # 2. Try Fallback: OpenAI (gpt-4o-mini)
        if self.openai_client and self.openai_key:
            try:
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})

                response = self.openai_client.chat.completions.create(
                    model=self.openai_model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_output_tokens,
                )
                logger.info("[LLM] OpenAI fallback generated response successfully.")
                return response.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"[LLM] OpenAI fallback failed: {e}")

        # If both fail
        raise RuntimeError(
            "Both primary (Gemini) and fallback (OpenAI) LLM generation failed. "
            "Please check API keys and connectivity."
        )


llm_service = LLMService()
