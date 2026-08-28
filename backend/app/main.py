import os
import shutil
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .models.schemas import (
    ChatRequest,
    ChatResponse,
    SourceCitation,
    IngestWebsiteRequest,
    HealthResponse
)
from .llm.gemini import GeminiService
from .llm.openai import OpenAIService
from .services.vector_store import QdrantVectorStore
from .services.document_loader import DocumentLoader
from .rag.pipeline import RAGPipeline

load_dotenv()

app = FastAPI(
    title="NBP AI - RAG Knowledge Assistant API",
    description="FastAPI Backend for RAG Chatbot grounded on National Bank of Pakistan (NBP) public knowledge.",
    version="1.0.0"
)

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
llm_provider = os.getenv("LLM_PROVIDER", "gemini").lower()
if llm_provider == "openai":
    llm_service = OpenAIService()
    embedding_dim = 1536
else:
    llm_service = GeminiService()
    embedding_dim = 768

vector_store = QdrantVectorStore()
doc_loader = DocumentLoader(
    chunk_size=int(os.getenv("CHUNK_SIZE", 1000)),
    chunk_overlap=int(os.getenv("CHUNK_OVERLAP", 150))
)
rag_pipeline = RAGPipeline(
    llm_service=llm_service,
    vector_store=vector_store,
    top_k=int(os.getenv("TOP_K", 5)),
    similarity_threshold=float(os.getenv("SIMILARITY_THRESHOLD", 0.35))
)

@app.on_event("startup")
def startup_event():
    try:
        vector_store.init_collection(dim=embedding_dim)
        print(f"Qdrant collection '{vector_store.collection_name}' initialized with dim {embedding_dim}.")
    except Exception as e:
        print(f"Notice: Qdrant startup check: {e}")

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    total_chunks = vector_store.count_chunks()
    return HealthResponse(
        status="healthy",
        provider=llm_provider,
        collection=vector_store.collection_name,
        total_chunks=total_chunks,
        vector_store_status="online" if total_chunks >= 0 else "degraded"
    )

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Query message cannot be empty.")
    
    try:
        answer, sources = rag_pipeline.answer_question(
            query=request.message,
            top_k=request.top_k
        )
        return ChatResponse(
            answer=answer,
            sources=sources,
            conversation_id=request.conversation_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG query failed: {str(e)}")

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()
    
    if ext not in [".pdf", ".docx", ".txt"]:
        raise HTTPException(status_code=400, detail=f"Unsupported file format '{ext}'. Supported: .pdf, .docx, .txt")
    
    temp_dir = "/tmp/rag_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, filename)
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        if ext == ".pdf":
            chunks = doc_loader.load_pdf(temp_path, filename)
        elif ext == ".docx":
            chunks = doc_loader.load_docx(temp_path, filename)
        else:
            chunks = doc_loader.load_txt(temp_path, filename)
            
        if not chunks:
            raise HTTPException(status_code=400, detail="No readable text extracted from document.")
            
        texts = [c["chunk_text"] for c in chunks]
        vectors = llm_service.embed_documents(texts)
        vector_store.insert_chunks(chunks, vectors)
        
        return {
            "status": "success",
            "document": filename,
            "chunks_indexed": len(chunks),
            "source_type": ext.replace(".", "")
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/api/website/ingest")
def ingest_website(request: IngestWebsiteRequest):
    if not request.url or not request.url.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid website URL.")
        
    try:
        chunks = doc_loader.load_website(request.url)
        if not chunks:
            raise HTTPException(status_code=400, detail="No readable content found on the page.")
            
        texts = [c["chunk_text"] for c in chunks]
        vectors = llm_service.embed_documents(texts)
        vector_store.insert_chunks(chunks, vectors)
        
        return {
            "status": "success",
            "url": request.url,
            "chunks_indexed": len(chunks),
            "source_type": "website"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Website ingestion failed: {str(e)}")

@app.delete("/api/documents/{doc_name}")
def delete_document(doc_name: str):
    try:
        vector_store.delete_by_document(doc_name)
        return {"status": "deleted", "document": doc_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
