import express from "express";
import path from "path";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { vectorStore } from "./server/services/vectorStore";
import { ragPipeline } from "./server/services/ragPipeline";
import { documentParser } from "./server/services/documentParser";
import { getGeminiClient } from "./server/services/geminiService";

dotenv.config();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ==========================================
  // API Endpoints
  // ==========================================

  // 1. Health Check Endpoint
  app.get("/api/health", (req, res) => {
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
    const totalChunks = vectorStore.getCount();
    res.json({
      status: "healthy",
      provider: hasGeminiKey ? "gemini (gemini-3.7-flash)" : "hybrid-rag-engine",
      collection: vectorStore.collectionName,
      total_chunks: totalChunks,
      documents_count: vectorStore.getDocumentsList().length,
      vector_store_status: "online",
      embedding_dim: 768,
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Chat Endpoint (RAG Query)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversation_id, top_k, similarity_threshold } = req.body;

      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Query message cannot be empty." });
      }

      const result = await ragPipeline.answerQuestion(message.trim(), {
        conversation_id,
        top_k: Number(top_k) || 5,
        similarity_threshold: similarity_threshold !== undefined ? Number(similarity_threshold) : 0.25,
      });

      return res.json({
        answer: result.answer,
        sources: result.sources,
        conversation_id: result.conversation_id,
        execution_time_ms: result.execution_time_ms,
      });
    } catch (err: any) {
      console.error("Chat error:", err);
      return res.status(500).json({ error: "Failed to process chat query: " + err.message });
    }
  });

  // 3. Document Ingestion via File Upload (PDF, DOCX, TXT)
  app.post("/api/documents/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file was uploaded." });
      }

      const originalName = req.file.originalname;
      const ext = path.extname(originalName).toLowerCase();
      const docId = "doc-" + Date.now();

      let parsedChunks: any[] = [];

      if (ext === ".pdf") {
        parsedChunks = await documentParser.parsePdfBuffer(req.file.buffer, originalName);
      } else if (ext === ".docx") {
        parsedChunks = await documentParser.parseDocxBuffer(req.file.buffer, originalName);
      } else if (ext === ".txt") {
        const textContent = req.file.buffer.toString("utf-8");
        parsedChunks = documentParser.parseTxtString(textContent, originalName);
      } else {
        return res.status(400).json({
          error: `Unsupported file format '${ext}'. Supported formats: .pdf, .docx, .txt`,
        });
      }

      if (parsedChunks.length === 0) {
        return res.status(400).json({ error: "No readable text content extracted from the document." });
      }

      const chunksToInsert = parsedChunks.map((chunk) => ({
        doc_id: docId,
        document: chunk.document,
        page: chunk.page,
        source_type: chunk.source_type,
        chunk_text: chunk.chunk_text,
      }));

      const added = vectorStore.addChunks(chunksToInsert);

      return res.json({
        status: "success",
        doc_id: docId,
        document: originalName,
        source_type: ext.replace(".", ""),
        chunks_indexed: added.length,
        total_chunks: vectorStore.getCount(),
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: "Failed to process document: " + err.message });
    }
  });

  // 4. Website Ingestion Endpoint
  app.post("/api/website/ingest", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== "string" || !url.startsWith("http")) {
        return res.status(400).json({ error: "Invalid URL provided. Must start with http:// or https://" });
      }

      const { title, chunks } = await documentParser.parseWebsiteUrl(url);

      if (chunks.length === 0) {
        return res.status(400).json({ error: "No readable content could be extracted from this webpage." });
      }

      const docId = "web-" + Date.now();
      const chunksToInsert = chunks.map((c) => ({
        doc_id: docId,
        document: title || url,
        url: url,
        source_type: "website" as const,
        chunk_text: c.chunk_text,
      }));

      const added = vectorStore.addChunks(chunksToInsert);

      return res.json({
        status: "success",
        doc_id: docId,
        title: title || url,
        url,
        source_type: "website",
        chunks_indexed: added.length,
        total_chunks: vectorStore.getCount(),
      });
    } catch (err: any) {
      console.error("Website ingestion error:", err);
      return res.status(500).json({ error: "Website ingestion failed: " + err.message });
    }
  });

  // 5. Get Documents List
  app.get("/api/documents", (req, res) => {
    const list = vectorStore.getDocumentsList();
    return res.json({
      documents: list,
      total_documents: list.length,
      total_chunks: vectorStore.getCount(),
    });
  });

  // 6. Delete Document Endpoint
  app.delete("/api/documents/:id", (req, res) => {
    const { id } = req.params;
    const deleted = vectorStore.deleteDocument(id);
    if (!deleted) {
      return res.status(404).json({ error: `Document '${id}' not found.` });
    }
    return res.json({
      status: "deleted",
      id,
      remaining_chunks: vectorStore.getCount(),
    });
  });

  // 7. Reset Knowledge Base to NBP Defaults
  app.post("/api/reset-knowledge", (req, res) => {
    vectorStore.resetToDefaults();
    return res.json({
      status: "success",
      message: "Knowledge base restored to default National Bank of Pakistan (NBP) documents.",
      total_chunks: vectorStore.getCount(),
      documents: vectorStore.getDocumentsList(),
    });
  });

  // 8. Sample Benchmark Queries for NBP
  app.get("/api/sample-queries", (req, res) => {
    res.json({
      queries: [
        {
          category: "Digital Banking",
          query: "What is NBP Digital and what are the daily transaction limits?",
          tag: "NBP Digital FAQ",
        },
        {
          category: "Debit Cards",
          query: "What are the features and withdrawal limits of NBP Visa Platinum Debit Card?",
          tag: "Debit Cards Guide",
        },
        {
          category: "Consumer Loans",
          query: "How does NBP Advance Plus salary loan work and what is the maximum limit?",
          tag: "Loans & Financing",
        },
        {
          category: "Accounts",
          query: "What are the requirements for opening an NBP Asaan Account?",
          tag: "Accounts & Deposits",
        },
        {
          category: "Islamic Banking",
          query: "Explain the Shariah principles and Mudarabah structure of NBP Aitemaad Banking.",
          tag: "Aitemaad Islamic",
        },
        {
          category: "Corporate & Branches",
          query: "What is the historical role of NBP as an agent to the State Bank of Pakistan?",
          tag: "Official Website",
        },
      ],
    });
  });

  // ==========================================
  // Vite Middleware Setup
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[✓] NBP AI RAG Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
