# load all env variables
from dotenv import load_dotenv
import os

load_dotenv()

qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
qdrant_api_key = os.getenv("QDRANT_API_KEY")
qdrant_collection = os.getenv("QDRANT_COLLECTION", "vera_docs")

# Gemini embedding returns 768-dim vectors. Keep this constant to ensure collection compatibility.
QDRANT_VECTOR_SIZE = 768

gemini_api_key = os.getenv("GEMINI_API_KEY")
gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")
gemini_embedding_model = os.getenv("GEMINI_EMBEDDING_MODEL", "embedding-001")

