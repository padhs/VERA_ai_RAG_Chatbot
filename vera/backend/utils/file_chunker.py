# file chunker
def chunk_file(text: str, chunk_size: int = 1000, chunk_overlap: int = 150):
    """Split text into overlapping chunks for embeddings.
        Works at the sentence level and preserves context continuity.

        Returns: a list of text chunks
        Raises: ValueError if text is empty or chunking fails
    """

    """
    | Parameter       | Recommended Value                           |
    | --------------- | ------------------------------------------- |
    | Chunk length    | **~800–1,000 characters (~150–250 tokens)** |
    | Overlap         | **100–150 characters**                      |
    | Embedding model | `gemini-embedding-001`                      |
    | Batch size      | 50 chunks per call                          |
    | Retrieval top-K | 3–5 most similar chunks                     |

    """

    if not text or not text.strip():
        raise ValueError("No text available to chunk. Empty file ?")
    
    try:
        sentences = text.split(".")
        if not sentences or len(sentences) == 0:
            raise ValueError("Failed to split text into sentences.")
        chunks, current_chunk = [], ""

        for sentence in sentences:
            if len(current_chunk) + len(sentence) < chunk_size:
                current_chunk += sentence + "."
            else:
                chunks.append(current_chunk.strip())
                # carry overlap for context continuity
                current_chunk = current_chunk[-chunk_overlap:] + sentence + "."

        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        if not chunks:
            raise ValueError("failed to create any chunks from text.")

        return chunks

    except Exception as e:
        raise ValueError(f"Error during chunking: {str(e)}")

