from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SourceCitation(BaseModel):
    document: str
    page: Optional[int] = None
    url: Optional[str] = None
    source_type: str = "pdf"
    chunk_text: Optional[str] = None
    score: Optional[float] = None

class ChatRequest(BaseModel):
    message: str = Field(..., description="User query")
    conversation_id: Optional[str] = Field(None, description="Optional conversation ID for history")
    top_k: Optional[int] = Field(5, description="Number of context chunks to retrieve")

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceCitation]
    conversation_id: Optional[str] = None

class DocumentMetadata(BaseModel):
    id: str
    document: str
    source_type: str
    total_chunks: int
    created_at: str

class IngestWebsiteRequest(BaseModel):
    url: str

class HealthResponse(BaseModel):
    status: str
    provider: str
    collection: str
    total_chunks: int
    vector_store_status: str
