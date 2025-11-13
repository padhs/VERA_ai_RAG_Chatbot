# query handler service

from __future__ import annotations

from typing import List

from core.config import QDRANT_VECTOR_SIZE, qdrant_collection
from core.gemini_client import embed_chunks_batched, generate_response
from core.logger import get_logger
from core.qdrant_client import client, ensure_collection

logger = get_logger("vera.query_service")

TOP_K = 3


async def handle_query(question: str) -> dict:
    """Handle a user query and return a response from LLM call."""
    try:
        ensure_collection()

        # Use QUESTION_ANSWERING task type for queries (optimized for Q&A)
        embeddings = embed_chunks_batched(
            [question], 
            batch_size=1, 
            task_type="QUESTION_ANSWERING",
            output_dimensionality=QDRANT_VECTOR_SIZE
        )
        if not embeddings or len(embeddings[0]) != QDRANT_VECTOR_SIZE:
            logger.error("Embedding vector dimension mismatch for question.")
            return _fallback_response(question, reason="embedding_mismatch")

        query_vector = embeddings[0]

        results = client.search(
            collection_name=qdrant_collection,
            query_vector=query_vector,
            limit=TOP_K,
        )

        retrieved_chunks: List[str] = [
            hit.payload.get("text", "")
            for hit in results
            if hit.payload and hit.payload.get("text")
        ]

        if not retrieved_chunks:
            return _fallback_response(question, reason="no_context")

        context = "\n\n".join(retrieved_chunks).strip()
        prompt = (
            "You are VERA AI, a legal research assistant. You are given a question and a "
            "context. Answer strictly based on the context provided. If the context is not "
            'relevant to the question, answer with "I\'m sorry, I don\'t have any information on that topic".\n'
            f"Question: {question}\n"
            f"Context: {context or '[no context]'}"
        )

        answer = generate_response(prompt)
        return {"answer": answer, "sources": retrieved_chunks}

    except Exception as exc:
        logger.exception("Query service failed: %s", exc)
        return _fallback_response(question, reason="exception", error=str(exc))


def _fallback_response(question: str, *, reason: str, error: str | None = None) -> dict:
    """
    Provide a graceful fallback by making a plain LLM call without context.
    """
    try:
        answer = generate_response(
            f"You are VERA AI, a legal assistant. Provide the best possible answer to:\n{question}"
        )
        response = {"answer": answer, "sources": [], "fallback": True, "reason": reason}
        if error:
            response["error"] = error
        return response
    except Exception as fallback_exc:
        logger.exception("Fallback LLM call failed: %s", fallback_exc)
        message = error or str(fallback_exc)
        return {"status": "error", "message": message}
