# gemini client

from typing import Any
import google.generativeai as genai
from core.config import gemini_api_key, gemini_model, gemini_embedding_model
import time
from core.logger import get_logger

logger = get_logger("vera.gemini_client")

class EmbeddingError(RuntimeError):
    pass

class GenerationError(RuntimeError):
    pass


# SDK configuration
if not gemini_api_key:
    raise RuntimeError("GEMINI_API_KEY is not set in environment variables")

genai.configure(api_key=gemini_api_key)


# ------------- Embedding Batched file chunks -------------

def parse_embedding_response(response: Any) -> list[list[float]]:
    """Parse embedding response and return list of vectors or raise error -> context"""
    # SDK returns result.embeddings where each item may have '.values' attribute.

    embeddings = getattr(response, "embeddings", None)
    if not embeddings or not isinstance(embeddings, list):
        raise EmbeddingError("Gemini returned invalid embedding response")

    vectors = []
    for i, e in enumerate(embeddings):
        vec = getattr(e, "values", None) or getattr(e, "embedding", None)
        if not vec or not isinstance(vec, list) or not all(isinstance(x, (int, float)) for x in vec):
            raise EmbeddingError(f"Invalid vector format at index {i}: {vec}")

        vectors.append(vec)

    if not vectors:
        raise EmbeddingError("No valid vectors found in response")
    return vectors

def embed_chunks_batched(
    chunks: list[str], 
    batch_size: int = 50, 
    retries: int = 3, 
    backoff: float = 2.0) -> list[list[float]]:

    """
    embeds a list of strings in batches with validation and retry logic.
    Returns list of embeddings or raise EmbeddingError.
    """

    if not chunks:
        raise EmbeddingError("No chunks provided to embedding.")

    all_vectors: list[list[float]] = []
    for start in range(0, len(chunks), batch_size):
        batch = chunks[start:start + batch_size]

        last_error = None
        for attempt in range(retries):
            try:
                logger.info(f"Embedding batch {start}-{start+len(batch)-1} (size={len(batch)}) attempt {attempt}/{retries}")
                result = genai.embed_content(
                    model=gemini_embedding_model,
                    content=batch
                )
                vectors = parse_embedding_response(result)
                if len(vectors) != len(batch):
                    raise EmbeddingError(f"mismatch: got {len(vectors)} vectors, expected {len(batch)} input")
                
                all_vectors.extend(vectors)
                break
            
            except Exception as e:
                last_error = e
                logger.warning(f"Embedding batch failed: (attempt: {attempt}/{retries}): {str(e)}")

                if attempt < retries:
                    time.sleep(backoff * attempt)
        
        else:
            # exhausted all retries ->
            raise EmbeddingError(f"Failed to embed batch after {retries} attempts: {last_error}")

    # basic dimensional sanity check
    dim = len(all_vectors[0])
    if any(len(v) != dim for v in all_vectors):
        raise EmbeddingError("Inconsistent emmbedding dimensions across results.")

    logger.info(f"Successfully embedded {len(all_vectors)} chunks in {len(all_vectors) // batch_size} batches, dimension: {dim}")
    return all_vectors


def generate_response(prompt: str):
    """Generate a contextual response from gemini model"""

    try:
        model = genai.GenerativeModel(gemini_model)
        response = model.generate_content(prompt=prompt)
        text = getattr(response, "text", None)
        
        if not text or not text.strip():
            raise GenerationError("Gemini returned empty or invalid response")
        return text

    except Exception as e:
        logger.error(f"Generation failed: {str(e)}")
        raise GenerationError(f"Failed to generate: {str(e)}")

