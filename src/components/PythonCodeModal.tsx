import React, { useState } from "react";
import { X, Copy, Check, Terminal, FileCode, Server, Layers } from "lucide-react";

interface PythonCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonCodeModal: React.FC<PythonCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"fastapi" | "rag" | "qdrant" | "gemini" | "ingest" | "docker">("fastapi");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippets: Record<string, { filename: string; code: string; desc: string }> = {
    fastapi: {
      filename: "backend/app/main.py",
      desc: "FastAPI REST Server with /api/chat, /api/documents/upload, /api/website/ingest, and /api/health",
      code: `import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .models.schemas import ChatRequest, ChatResponse, HealthResponse
from .llm.gemini import GeminiService
from .services.vector_store import QdrantVectorStore
from .services.document_loader import DocumentLoader
from .rag.pipeline import RAGPipeline

load_dotenv()

app = FastAPI(title="NBP AI - RAG Knowledge Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm_service = GeminiService()
vector_store = QdrantVectorStore()
doc_loader = DocumentLoader(chunk_size=1000, chunk_overlap=150)
rag_pipeline = RAGPipeline(llm_service=llm_service, vector_store=vector_store)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "chunks": vector_store.count_chunks()}

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    answer, sources = rag_pipeline.answer_question(query=request.message, top_k=request.top_k)
    return ChatResponse(answer=answer, sources=sources, conversation_id=request.conversation_id)`
    },
    rag: {
      filename: "backend/app/rag/pipeline.py",
      desc: "LangChain Grounded RAG Pipeline with system prompt and vector retrieval",
      code: `SYSTEM_PROMPT = """You are a company knowledge assistant for National Bank of Pakistan (NBP).
Answer questions using the provided context.
Use the retrieved context as the primary source of truth.
Do not invent company-specific information.
If the answer cannot be found in the provided context, clearly say:
"I couldn't find that information in the available company knowledge base."
Keep answers clear, concise and helpful.
When possible, mention the source used for the answer."""

class RAGPipeline:
    def __init__(self, llm_service, vector_store, top_k=5, similarity_threshold=0.35):
        self.llm_service = llm_service
        self.vector_store = vector_store
        self.top_k = top_k
        self.similarity_threshold = similarity_threshold

    def answer_question(self, query: str, top_k: int = 5):
        query_vector = self.llm_service.embed_text(query)
        chunks = self.vector_store.search(query_vector, top_k=top_k, score_threshold=self.similarity_threshold)
        
        if not chunks:
            return "I couldn't find that information in the available company knowledge base.", []
            
        context_str = "\\n\\n---\\n\\n".join([f"[{c['document']} (Page {c['page']})]\\n{c['chunk_text']}" for c in chunks])
        prompt = f"Context:\\n{context_str}\\n\\nUser Question: {query}"
        
        answer = self.llm_service.generate(prompt=prompt, system_instruction=SYSTEM_PROMPT)
        return answer, chunks`
    },
    qdrant: {
      filename: "backend/app/services/vector_store.py",
      desc: "Qdrant Vector Database Client and Similarity Search Service",
      code: `from qdrant_client import QdrantClient
from qdrant_client.http import models
import uuid

class QdrantVectorStore:
    def __init__(self, url="http://localhost:6333", collection_name="company_knowledge"):
        self.client = QdrantClient(url=url)
        self.collection_name = collection_name

    def init_collection(self, dim=768):
        self.client.create_collection(
            collection_name=self.collection_name,
            vectors_config=models.VectorParams(size=dim, distance=models.Distance.COSINE)
        )

    def insert_chunks(self, chunks, vectors):
        points = [
            models.PointStruct(id=str(uuid.uuid4()), vector=vec, payload=chunk)
            for chunk, vec in zip(chunks, vectors)
        ]
        self.client.upsert(collection_name=self.collection_name, points=points)

    def search(self, query_vector, top_k=5, score_threshold=0.35):
        return self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k,
            score_threshold=score_threshold
        )`
    },
    gemini: {
      filename: "backend/app/llm/gemini.py",
      desc: "Gemini Model & Embedding Provider Abstraction",
      code: `from google import genai
import os

class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = "gemini-3.7-flash"
        self.embedding_model = "gemini-embedding-2-preview"

    def generate(self, prompt: str, system_instruction: str = "") -> str:
        config = {"system_instruction": system_instruction} if system_instruction else {}
        res = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=config
        )
        return res.text or ""

    def embed_text(self, text: str):
        res = self.client.models.embed_content(
            model=self.embedding_model,
            contents=text
        )
        return res.embedding.values`
    },
    ingest: {
      filename: "backend/scripts/ingest.py",
      desc: "CLI Script to recursively process data/ (PDF, DOCX, TXT) and index to Qdrant",
      code: `#!/usr/bin/env python3
import os, glob
from app.llm.gemini import GeminiService
from app.services.vector_store import QdrantVectorStore
from app.services.document_loader import DocumentLoader

def main():
    llm = GeminiService()
    vector_store = QdrantVectorStore()
    loader = DocumentLoader()
    
    files = glob.glob("backend/data/**/*.*", recursive=True)
    for f in files:
        chunks = loader.load_pdf(f) if f.endswith(".pdf") else loader.load_txt(f)
        texts = [c["chunk_text"] for c in chunks]
        vectors = [llm.embed_text(t) for t in texts]
        vector_store.insert_chunks(chunks, vectors)
        print(f"Indexed {f}: {len(chunks)} chunks.")

if __name__ == "__main__":
    main()`
    },
    docker: {
      filename: "docker-compose.yml",
      desc: "Production container orchestration for Qdrant and FastAPI backend",
      code: `version: '3.8'

services:
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_storage:/qdrant/storage

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - LLM_PROVIDER=gemini
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - QDRANT_URL=http://qdrant:6333
      - QDRANT_COLLECTION=company_knowledge
    depends_on:
      - qdrant

volumes:
  qdrant_storage:`
    }
  };

  const current = codeSnippets[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="python-code-modal"
        className="bg-slate-900 text-slate-100 w-full max-w-4xl rounded-xl shadow-2xl border border-slate-800 flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/60">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Python FastAPI & Qdrant Codebase
              </h2>
              <p className="text-xs text-slate-400">
                Modular LangChain RAG pipeline, Qdrant vector store, and ingestion scripts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-4 pt-2.5 border-b border-slate-800 flex flex-wrap gap-2 bg-slate-950/40">
          {[
            { id: "fastapi", label: "FastAPI main.py" },
            { id: "rag", label: "RAG pipeline.py" },
            { id: "qdrant", label: "Qdrant Store" },
            { id: "gemini", label: "Gemini Provider" },
            { id: "ingest", label: "ingest.py Script" },
            { id: "docker", label: "docker-compose.yml" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-slate-800 text-emerald-400 font-semibold border-t-2 border-emerald-500"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Description & Action Bar */}
        <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <span className="text-emerald-400">{current.filename}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{current.desc}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-slate-200 bg-slate-950/80 leading-relaxed">
          <pre className="whitespace-pre">{current.code}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>All files are fully generated and saved in the project repository.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
