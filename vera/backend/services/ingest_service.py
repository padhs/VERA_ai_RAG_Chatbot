# pdf & weblink ingestion service

from __future__ import annotations

import os
import tempfile
import uuid
from typing import Optional

import pdfplumber
from fastapi import HTTPException, UploadFile
from unstructured.partition.auto import partition
from unstructured.partition.html import partition_html
from core.config import QDRANT_VECTOR_SIZE, gemini_embedding_model, qdrant_collection
from core.gemini_client import embed_chunks_batched
from core.qdrant_client import client, ensure_collection
from utils.file_chunker import chunk_file
from utils.metadata import update_metadata

BATCH_SIZE = 50


async def ingest_document(
    *,
    file: Optional[UploadFile] = None,
    url: Optional[str] = None,
    domain: Optional[str] = None,
) -> dict:
    """
    Ingest content from either an uploaded document or a URL.
    """

    if not file and not url:
        raise HTTPException(status_code=400, detail="Either 'file' or 'url' must be provided.")

    source_label: str
    raw_text: str
    tmp_path: Optional[str] = None

    try:
        if file:
            tmp_path = await _persist_upload(file)
            raw_text = _extract_text_from_file(tmp_path, file.filename)
            source_label = file.filename or "uploaded_file"
        else:
            assert url  # mypy/pyright appeasement
            raw_text = _extract_text_from_url(url)
            source_label = url

        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="No textual content could be extracted.")

        chunks = chunk_file(raw_text)
        if not chunks:
            raise HTTPException(status_code=400, detail="Failed to generate chunks from content.")

        ensure_collection()

        total_points = 0
        for start in range(0, len(chunks), BATCH_SIZE):
            batch = chunks[start : start + BATCH_SIZE]
            vectors = embed_chunks_batched(
                batch,
                output_dimensionality=QDRANT_VECTOR_SIZE,
                task_type="SEMANTIC_SIMILARITY"
            )

            if not vectors or len(vectors[0]) != QDRANT_VECTOR_SIZE:
                raise HTTPException(
                    status_code=500,
                    detail=f"Embedding dimension mismatch. Expected {QDRANT_VECTOR_SIZE}-d vectors from Gemini, got {len(vectors[0]) if vectors else 0}.",
                )

            points = [
                {
                    "id": str(uuid.uuid4()),
                    "vector": vector,
                    "payload": {
                        "text": chunk,
                        "source": source_label,
                        "domain": domain or "general",
                    },
                }
                for vector, chunk in zip(vectors, batch)
            ]

            client.upsert(collection_name=qdrant_collection, points=points, wait=True)
            total_points += len(points)

        count_response = client.count(collection_name=qdrant_collection, exact=True)
        total_vectors = getattr(count_response, "count", total_points)

        update_metadata(
            collection=qdrant_collection,
            vectors=total_vectors,
            embed_model=gemini_embedding_model,
            domain=domain or "general",
            source=source_label,
        )

        return {
            "status": "success",
            "message": "content_ingested_successfully",
            "total_chunks": total_points,
            "collection_vectors": total_vectors,
            "collection": qdrant_collection,
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to ingest content: {exc}") from exc
    finally:
        if file and tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


async def _persist_upload(file: UploadFile) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix=_infer_suffix(file.filename)) as tmp:
        tmp.write(await file.read())
        return tmp.name


def _infer_suffix(filename: Optional[str]) -> str:
    if not filename or "." not in filename:
        return ".bin"
    return f".{filename.rsplit('.', 1)[-1]}"


def _extract_text_from_file(path: str, original_name: Optional[str]) -> str:
    suffix = ""
    if original_name and "." in original_name:
        suffix = original_name.rsplit(".", 1)[-1].lower()

    if suffix == "pdf":
        text = _extract_text_from_pdf(path)
        if text.strip():
            return text
        # fall back to unstructured if pdfplumber yielded nothing

    elements = partition(filename=path)
    return "\n".join(element.text for element in elements if getattr(element, "text", None))


def _extract_text_from_pdf(path: str) -> str:
    text_chunks = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            if page_text:
                text_chunks.append(page_text)
    return "\n".join(text_chunks)


def _extract_text_from_url(url: str) -> str:
    elements = partition_html(url=url)
    return "\n".join(element.text for element in elements if getattr(element, "text", None))