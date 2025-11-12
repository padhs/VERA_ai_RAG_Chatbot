# pdf & weblink ingestion service


from typing import Any


import pdfplumber
import uuid
import os
import tempfile
from fastapi import UploadFile
from core.qdrant_client import client
from core.config import qdrant_collection
from core.gemini_client import embed_chunks_batched
from utils.file_chunker import chunk_file

async def process_pdf(file: UploadFile):
    """Parse pdf ->  extract text -> chunk -> embed -> ingest into Qdrant"""
    tmp_path = None

    try:
        # create a temporary file path
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # extract text from pdf
        text_content = extract_text_from_pdf(tmp_path)
        chunks = chunk_file(text_content)

        # batch embed and store
        all_points = []
        batch_size = 50                             # chunks per batch

        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i + batch_size]
            vectors = embed_chunks_batched(batch, batch_size=len(batch))
            
            for vec, chunk in zip[tuple[list[float], Any]](vectors, batch):
                all_points.append({
                    "id": str(uuid.uuid4()),
                    "vector": vec,
                    "payload": {"text": chunk, "source": file.filename},
                })
            
            # upsert each batch to Qdrant (for memory safety)
            client.upsert(collection_name=qdrant_collection, points=all_points[-len(batch):])

        return {"status": "success", "message": "chunks_stored_successfully", "total_chunks": len(all_points)}

    except Exception as e:
        return {"status": "error", "message": f"Failed to ingest document: {str(e)}"}

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path) # remove temporary file


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a pdf file"""

    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    
    return text