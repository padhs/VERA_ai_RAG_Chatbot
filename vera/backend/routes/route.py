# API routes

from __future__ import annotations
from typing import Optional
from fastapi import APIRouter, Body, File, Form, Query, UploadFile
from services.collections_service import (
    delete_collections,
    get_collection,
    list_collections,
)
from services.docs import get_indexed_docs
from services.ingest_service import ingest_document
from services.query_service import handle_query

router = APIRouter(prefix="/api/v1")


# ------------ Health Check ------------
@router.get("/health")
def health():
    return {"status": "VERA[backend]: Legal AI Assistant is running 🚀"}


# ------------ Ingest ------------
@router.post("/ingest")
@router.post("/upload")  # backwards compatibility for existing clients
async def ingest(
    file: Optional[UploadFile] = File(default=None),
    domain_form: Optional[str] = Form(default=None),
    url: Optional[str] = Query(default=None),
    domain_query: Optional[str] = Query(default=None, alias="domain"),
):
    domain = domain_form or domain_query or "general"
    return await ingest_document(file=file, url=url, domain=domain)


# ------------ Query ------------
@router.post("/chat")
async def chat(question: str = Body(..., embed=True)):
    return await handle_query(question)


# ------------ Indexed Docs ------------
@router.get("/docs")
def get_docs():
    return get_indexed_docs()


# ------------ Collections ------------
@router.get("/collections/all")
def get_all_collections():
    return list_collections()


@router.get("/collections")
def get_collection_with_query(collection_id: Optional[str] = Query(default=None)):
    if collection_id:
        return get_collection(collection_id)
    return list_collections()


@router.get("/collections/{collection_id}")
def get_collection_by_id(collection_id: str):
    return get_collection(collection_id)


@router.delete("/collections")
def delete_collection_endpoint(collection_id: Optional[str] = Query(default=None)):
    return delete_collections(collection_id)
