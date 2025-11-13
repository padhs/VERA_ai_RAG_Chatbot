# collection management services

from __future__ import annotations

from typing import Optional

from fastapi import HTTPException

from core.logger import get_logger
from core.qdrant_client import client

logger = get_logger("vera.collections")


def list_collections() -> list[dict]:
    """Return all available collections in Qdrant."""
    try:
        response = client.get_collections()
        collections = response.collections or []
        return [collection.dict() for collection in collections]
    except Exception as exc:
        logger.exception("Failed to list collections: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to list collections") from exc


def get_collection(collection_id: str) -> dict:
    """Return information for a specific collection."""
    try:
        if not client.collection_exists(collection_id):
            raise HTTPException(
                status_code=404,
                detail=f"Collection '{collection_id}' not found.",
            )
        info = client.get_collection(collection_id)
        return info.dict()
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to fetch collection '%s': %s", collection_id, exc)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch collection '{collection_id}'",
        ) from exc


def delete_collections(collection_id: Optional[str] = None) -> dict:
    """Delete a specific collection or all collections if none provided."""
    try:
        if collection_id:
            if not client.collection_exists(collection_id):
                raise HTTPException(
                    status_code=404,
                    detail=f"Collection '{collection_id}' not found.",
                )
            client.delete_collection(collection_id)
            logger.info("Deleted qdrant collection: %s", collection_id)
            return {
                "message": f"Deleted collection '{collection_id}'",
                "status": "success",
                "deleted_collections": [collection_id],
            }

        response = client.get_collections()
        collections = response.collections or []
        if not collections:
            return {
                "message": "No collections found to delete",
                "status": "noop",
                "deleted_collections": [],
            }

        deleted = []
        for collection in collections:
            name = collection.name
            client.delete_collection(name)
            deleted.append(name)
            logger.info("Deleted qdrant collection: %s", name)

        return {
            "message": "Deleted all collections",
            "status": "success",
            "deleted_collections": deleted,
        }

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to delete collections: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to delete collections") from exc

