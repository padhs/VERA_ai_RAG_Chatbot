# API routes

from fastapi import APIRouter, UploadFile, Body
from services.ingest_service import process_pdf
from services.query_service import handle_query

router = APIRouter(prefix="/api/v1")

# ------------ Health Check ------------
@router.get("/health")
def health():
    # health check endpoint
    return {"status": "VERA[backend]: Legal AI Assistant is running 🚀"}

# ------------ Ingest ------------
@router.post("/ingest")
async def ingest(file: UploadFile):
    # upload and process pdf file
    return await process_pdf(file)

# ------------ Query ------------
@router.post("/chat")
async def chat(question: str = Body(..., embed=True)):
    # handle user query and return response
    return await handle_query(question)

