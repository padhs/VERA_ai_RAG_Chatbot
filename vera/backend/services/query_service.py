# query handler service

from core.logger import get_logger
from core.qdrant_client import client
from core.config import qdrant_collection
from core.gemini_client import generate_response, embed_chunks_batched


logger = get_logger("vera.query_service")

async def handle_query(question: str):
    """Handle a user query and return a response from LLM call"""
    try:
        vectors = embed_chunks_batched([question], batch_size=1)
        query_vector = vectors[0]

        results = client.search(
            collection_name=qdrant_collection,
            query_vector=query_vector,
            limit=3
        )

        if not results:
            # TODO: Make a normal LLM call to Gemini for fallback response. 
            """Show whatever contextual response we can provide for that.
                Pass on that context in the next LLM call. Maintain context consistency and continuity.
            """
            return {"answer": "I'm sorry, I don't have any information on that topic", 
            "sources": []}
        
        retrieved_chunks = [hit.payload.get("text", "") for hit in results if hit.payload]
        context = "\n\n".join(retrieved_chunks).strip()

        prompt = f"""
        You are VERA AI, a legal research assistant. You are given a question and a context. Answer strictly based on the 
        context provided. If the context is not relevant to the question, answer with "I'm sorry, I don't have any information on that topic".
        Question: {question}
        Context: {context or "[no context]"}
        """

        answer = generate_response(prompt)
        return {"answer": answer, "sources": retrieved_chunks}

    except Exception as e:
        logger.exception(f"Query service failed: {str(e)}")
        return {"status": "error", "message": str(e)}


