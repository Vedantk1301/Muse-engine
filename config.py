"""
Central configuration sourced from environment variables.
"""

from __future__ import annotations

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    AGENT_MODEL = os.getenv("AGENT_MODEL", "gpt-5-mini")
    FAST_MODEL = os.getenv("NANO_MODEL", "gpt-5-nano")
    WEATHER_MODEL = os.getenv("WEATHER_MODEL", FAST_MODEL)
    EMB_MODEL_CATALOG = os.getenv("EMB_MODEL_CATALOG", os.getenv("MEM_EMB_MODEL", "Qwen/Qwen3-Embedding-4B"))
    EMB_DIM_CATALOG = int(
        os.getenv(
            "EMB_DIM_CATALOG",
            os.getenv("EXPECTED_EMBEDDING_DIM", os.getenv("MEM_EMB_DIM", "3840")),
        )
    )

    QDRANT_URL = os.getenv("QDRANT_URL")
    QDRANT_KEY = os.getenv("QDRANT_KEY")
    CATALOG_COLLECTION = os.getenv("CATALOG_COLLECTION", "new_qwen_embeddings")
    HNSW_EF = int(os.getenv("HNSW_EF", "256"))

    RERANK_TOP_K = int(os.getenv("RERANK_TOP_K", "12"))
    SEARCH_LIMIT = int(os.getenv("PRODUCTS_PER_QUERY", "40"))
    SEARCH_RERANK_LIMIT = int(os.getenv("RERANK_PER_QUERY", "15"))
    MIN_POOLED_ITEMS = int(os.getenv("MIN_POOLED_ITEMS", "8"))

    WEATHER_CACHE_SECONDS = int(os.getenv("WEATHER_CACHE_TTL_SECONDS", "600"))
    
    # Trends
    TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
    TRENDS_CACHE_TTL = int(os.getenv("TRENDS_CACHE_TTL", "86400")) # 24 hours
    
    DEBUG = os.getenv("MUSEBOT_DEBUG", "1") == "1"
