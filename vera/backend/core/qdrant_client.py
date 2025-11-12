# qdrant client

from qdrant_client import QdrantClient
from core.config import qdrant_url, qdrant_api_key, qdrant_collection
from qdrant_client.http.models import Distance, VectorParams
from core.logger import get_logger

logger = get_logger("vera.qdrant_client")

# Initialize Qdrant client with API key if provided (for cloud instances)
if qdrant_api_key:
    client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
    logger.info("Qdrant client initialized with API key (cloud instance)")
else:
    client = QdrantClient(url=qdrant_url)
    logger.info("Qdrant client initialized without API key (local instance)")

def ensure_collection(dim: int):
    """
    Ensure the collection exists and has the correct vector size.
    If collection exist with a different vector size, raise (explicit fail-fast) error
    """

    exists = client.collection_exists(qdrant_collection)
    if not exists:
        logger.info(f"creating qdrant collection: {qdrant_collection} with dimensions: {dim}")
        client.recreate_collection(
            collection_name=qdrant_collection,
            vectors_config=VectorParams(size=dim, distance=Distance.COSINE)
        )

        return

    info = client.get_collection(qdrant_collection)
    existing_dim = info.config.params.vectors.size
    if existing_dim != dim:
        raise RuntimeError(
        f"Qdrant collection '{qdrant_collection}' has dimension={existing_dim}, expected {dim}. "
        f"Drop/recreate the collection or use a new collection name."
    )

