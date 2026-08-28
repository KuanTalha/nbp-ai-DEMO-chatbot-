# Simple RAG AI Chatbot — National Bank of Pakistan (NBP) Demo

> **Disclaimer**: This is a demo reference implementation of a Retrieval-Augmented Generation (RAG) system using publicly available National Bank of Pakistan (NBP) information. It is not an official NBP product.

## Architecture

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Lucide Icons, Axios.
- **Backend (Python)**: FastAPI, LangChain, Qdrant Vector Store, Gemini & OpenAI LLM abstractions.
- **Fullstack Runtime (Live Preview)**: Node.js / Express TypeScript server with complete RAG vector embedding engine, document parsers (PDF, DOCX, TXT), website scraping, and server-side `@google/genai` integration.

## Quick Start (Docker Compose)

```bash
# 1. Clone and navigate to repo
git clone https://github.com/example/simple-rag-chatbot.git
cd simple-rag-chatbot

# 2. Configure environment
cp .env.example .env
# Add your GEMINI_API_KEY in .env

# 3. Start Qdrant and FastAPI Backend
docker-compose up -d

# 4. Ingest Documents into Qdrant
python backend/scripts/ingest.py

# 5. Start Frontend
cd frontend && npm install && npm run dev
```

## API Endpoints

- `POST /api/chat` - Query the knowledge base with grounded RAG response
- `POST /api/documents/upload` - Ingest PDF, DOCX, or TXT documents
- `POST /api/website/ingest` - Fetch, clean, chunk, and embed website content
- `GET /api/documents` - List all indexed documents and chunk statistics
- `DELETE /api/documents/:id` - Delete a document and its vector embeddings
- `GET /api/health` - Check health status of vector store and LLM provider
