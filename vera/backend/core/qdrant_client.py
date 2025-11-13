# qdrant client

from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams

from core.config import (
    QDRANT_VECTOR_SIZE,
    qdrant_api_key,
    qdrant_collection,
    qdrant_url,
)
from core.logger import get_logger

logger = get_logger("vera.qdrant_client")

# Initialize Qdrant client with API key if provided (for cloud instances)
if qdrant_api_key:
    client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
    logger.info("Qdrant client initialized with API key (cloud instance)")
else:
    client = QdrantClient(url=qdrant_url)
    logger.info("Qdrant client initialized without API key (local instance)")


def ensure_collection() -> None:
    """
    Ensure the configured collection exists and respects the expected 768-d
    vector size used by Gemini embeddings.
    """

    exists = client.collection_exists(qdrant_collection)
    if not exists:
        logger.info(
            "Creating qdrant collection '%s' with dimensions: %s",
            qdrant_collection,
            QDRANT_VECTOR_SIZE,
        )
        client.recreate_collection(
            collection_name=qdrant_collection,
            vectors_config=VectorParams(size=QDRANT_VECTOR_SIZE, distance=Distance.COSINE),
        )
        return

    info = client.get_collection(qdrant_collection)
    existing_dim = info.config.params.vectors.size
    if existing_dim != QDRANT_VECTOR_SIZE:
        raise RuntimeError(
            f"Qdrant collection '{qdrant_collection}' has dimension={existing_dim}, "
            f"expected {QDRANT_VECTOR_SIZE}. Drop/recreate the collection or use a new name."
        )

