# get indexed docs
from utils.metadata import load_metadata
from core.logger import get_logger

logger = get_logger("vera.docs")

def get_indexed_docs():
    try:
        docs = load_metadata()
        return docs

    except Exception as e:
        logger.exception(f"Failed to get indexed docs: {str(e)}")
        return {"status": "error", "message": "Failed to get indexed docs: Internal server error"}

