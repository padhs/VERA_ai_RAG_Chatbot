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

# Use new Client-based API for embeddings
try:
    from google import genai as genai_new
    embedding_client = genai_new.Client(api_key=gemini_api_key)
except (ImportError, AttributeError) as e:
    logger.error(f"Failed to import new genai client: {e}. Please ensure 'google-genai' package is installed.")
    raise RuntimeError(f"Failed to initialize embedding client: {e}")

# Keep old API for generation
genai.configure(api_key=gemini_api_key)


# ------------- Embedding Batched file chunks -------------

def parse_embedding_response(response: Any) -> list[list[float]]:
    """Parse embedding response and return list of vectors or raise error -> context"""
    # New API returns result.embeddings which is iterable
    # Each embedding in result.embeddings may be the vector directly or have attributes
    
    embeddings = getattr(response, "embeddings", None)
    # Check if embeddings is None or empty
    if embeddings is None:
        logger.error(f"Response has no 'embeddings' attribute. Type: {type(response)}, dir: {[x for x in dir(response) if not x.startswith('_')][:10]}")
        raise EmbeddingError("Gemini returned invalid embedding response: no 'embeddings' attribute")
    
    # Handle case where embeddings might be empty
    try:
        # Try to get length to check if it's iterable and has items
        if hasattr(embeddings, "__len__") and len(embeddings) == 0:
            raise EmbeddingError("Gemini returned empty embeddings list")
    except (TypeError, AttributeError):
        # If it doesn't have length, it might not be iterable
        pass

    vectors = []
    for i, embedding in enumerate(embeddings):
        # Each embedding might be the vector directly (list) or an object with attributes
        if isinstance(embedding, list):
            vec = embedding
        elif isinstance(embedding, dict):
            vec = embedding.get("values") or embedding.get("embedding")
        else:
            # Object with attributes - try common attribute names
            vec = getattr(embedding, "values", None) or getattr(embedding, "embedding", None)
            # If still None, the embedding itself might be the vector (check if it's iterable and numeric)
            if vec is None and hasattr(embedding, "__iter__"):
                try:
                    # Try to convert to list if it's iterable
                    vec = list(embedding)
                    # Verify it's numeric
                    if not all(isinstance(x, (int, float)) for x in vec):
                        vec = None
                except (TypeError, ValueError):
                    vec = None
        
        if not vec or not isinstance(vec, list):
            logger.error(f"Could not extract vector from embedding at index {i}: {type(embedding)}, value: {embedding}")
            raise EmbeddingError(f"Invalid vector format at index {i}: could not extract vector")
        
        if not all(isinstance(x, (int, float)) for x in vec):
            logger.error(f"Vector at index {i} contains non-numeric values")
            raise EmbeddingError(f"Invalid vector format at index {i}: contains non-numeric values")

        vectors.append(vec)

    if not vectors:
        raise EmbeddingError("No valid vectors found in response")
    return vectors

def embed_chunks_batched(
    chunks: list[str], 
    batch_size: int = 50, 
    retries: int = 3, 
    backoff: float = 2.0,
    task_type: str | None = None,
    output_dimensionality: int | None = None) -> list[list[float]]:

    """
    embeds a list of strings in batches with validation and retry logic.
    Returns list of embeddings or raise EmbeddingError.
    
    Args:
        chunks: List of text strings to embed
        batch_size: Number of chunks to process per batch
        retries: Number of retry attempts per batch
        backoff: Backoff multiplier for retries
        task_type: Optional task type (e.g., "QUESTION_ANSWERING", "SEMANTIC_SIMILARITY")
        output_dimensionality: Optional output dimension (768, 1536, or 3072)
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
                
                # Use Client-based API: client.models.embed_content with contents parameter
                # Note: task_type and output_dimensionality are not supported by this API
                result = embedding_client.models.embed_content(
                    model=gemini_embedding_model,
                    contents=batch
                )
                
                # Log the result type and structure for debugging
                logger.info(f"Embedding response type: {type(result)}, has embeddings attr: {hasattr(result, 'embeddings')}, dir: {[x for x in dir(result) if not x.startswith('_')][:10]}")
                if hasattr(result, 'embeddings'):
                    logger.info(f"embeddings type: {type(result.embeddings)}, is list: {isinstance(result.embeddings, list)}")
                
                vectors = parse_embedding_response(result)
                if len(vectors) != len(batch):
                    raise EmbeddingError(f"mismatch: got {len(vectors)} vectors, expected {len(batch)} input")
                
                all_vectors.extend(vectors)
                break
            
            except Exception as e:
                last_error = e
                logger.warning(f"Embedding batch failed: (attempt: {attempt}/{retries}): {str(e)}")
                # Log more details on the last attempt
                if attempt == retries - 1:
                    logger.error(f"Final attempt failed. Error type: {type(e)}, Error: {e}")

                if attempt < retries - 1:
                    time.sleep(backoff * (attempt + 1))
        
        else:
            # exhausted all retries ->
            raise EmbeddingError(f"Failed to embed batch after {retries} attempts: {last_error}")

    # Check if we got any vectors
    if not all_vectors:
        raise EmbeddingError("No vectors were generated from any batch")

    # basic dimensional sanity check
    dim = len(all_vectors[0])
    if any(len(v) != dim for v in all_vectors):
        raise EmbeddingError("Inconsistent emmbedding dimensions across results.")

    num_batches = (len(all_vectors) + batch_size - 1) // batch_size if batch_size > 0 else 1
    logger.info(f"Successfully embedded {len(all_vectors)} chunks in {num_batches} batches, dimension: {dim}")
    return all_vectors


def generate_response(prompt: str):
    """Generate a contextual response from gemini model"""

    try:
        model = genai.GenerativeModel(gemini_model)
        # generate_content accepts the prompt as a positional argument or contents parameter
        response = model.generate_content(prompt)
        text = getattr(response, "text", None)
        
        if not text or not text.strip():
            raise GenerationError("Gemini returned empty or invalid response")
        return text

    except Exception as e:
        logger.error(f"Generation failed: {str(e)}")
        raise GenerationError(f"Failed to generate: {str(e)}")

