#!/usr/bin/env python3
"""
National Bank of Pakistan (NBP) - Knowledge Base Ingestion Script
Processes documents from data/ (pdfs, docs, txt) and indexes them into Qdrant.
"""

import os
import glob
import sys
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.llm.gemini import GeminiService
from app.llm.openai import OpenAIService
from app.services.vector_store import QdrantVectorStore
from app.services.document_loader import DocumentLoader

load_dotenv()

def main():
    print("=========================================================")
    print("  NBP AI Knowledge Base Ingestion Pipeline (Qdrant RAG)  ")
    print("=========================================================")
    
    provider = os.getenv("LLM_PROVIDER", "gemini").lower()
    print(f"[*] Initializing LLM Provider: {provider.upper()}")
    
    if provider == "openai":
        llm = OpenAIService()
        dim = 1536
    else:
        llm = GeminiService()
        dim = 768
        
    vector_store = QdrantVectorStore()
    print(f"[*] Initializing Qdrant collection: {vector_store.collection_name}")
    vector_store.init_collection(dim=dim)
    
    loader = DocumentLoader(
        chunk_size=int(os.getenv("CHUNK_SIZE", 1000)),
        chunk_overlap=int(os.getenv("CHUNK_OVERLAP", 150))
    )
    
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir, exist_ok=True)
        
    supported_files = []
    for ext in ["*.pdf", "*.docx", "*.txt"]:
        supported_files.extend(glob.glob(os.path.join(data_dir, "**", ext), recursive=True))
        supported_files.extend(glob.glob(os.path.join(data_dir, ext)))
        
    print(f"[*] Found {len(supported_files)} knowledge documents to ingest.")
    
    total_chunks = 0
    for file_path in supported_files:
        filename = os.path.basename(file_path)
        ext = os.path.splitext(filename)[1].lower()
        print(f"\n[+] Processing: {filename}")
        
        if ext == ".pdf":
            chunks = loader.load_pdf(file_path, filename)
        elif ext == ".docx":
            chunks = loader.load_docx(file_path, filename)
        else:
            chunks = loader.load_txt(file_path, filename)
            
        if not chunks:
            print(f"  [-] Warning: No chunks generated for {filename}")
            continue
            
        print(f"  [>] Extracted {len(chunks)} text chunks. Generating embeddings...")
        texts = [c["chunk_text"] for c in chunks]
        vectors = llm.embed_documents(texts)
        
        print(f"  [>] Indexing into Qdrant collection...")
        vector_store.insert_chunks(chunks, vectors)
        total_chunks += len(chunks)
        print(f"  [✓] Successfully indexed {filename} ({len(chunks)} chunks).")
        
    print("\n=========================================================")
    print(f"Ingestion completed! Total chunks indexed in Qdrant: {total_chunks}")
    print("=========================================================")

if __name__ == "__main__":
    main()
