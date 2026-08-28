import axios from "axios";
import { HealthStatus, IndexedDocument, SampleQuery, SourceCitation } from "../types/index.js";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ChatApiResponse {
  answer: string;
  sources: SourceCitation[];
  conversation_id?: string;
  execution_time_ms?: number;
}

export const ragApi = {
  // 1. Health check
  async getHealth(): Promise<HealthStatus> {
    const res = await api.get<HealthStatus>("/health");
    return res.data;
  },

  // 2. Chat query
  async sendChat(
    message: string,
    conversation_id?: string,
    top_k: number = 5,
    similarity_threshold: number = 0.25
  ): Promise<ChatApiResponse> {
    const res = await api.post<ChatApiResponse>("/chat", {
      message,
      conversation_id,
      top_k,
      similarity_threshold,
    });
    return res.data;
  },

  // 3. Get indexed documents
  async getDocuments(): Promise<{ documents: IndexedDocument[]; total_documents: number; total_chunks: number }> {
    const res = await api.get<{ documents: IndexedDocument[]; total_documents: number; total_chunks: number }>("/documents");
    return res.data;
  },

  // 4. Upload document (PDF, DOCX, TXT)
  async uploadDocument(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // 5. Ingest website
  async ingestWebsite(url: string): Promise<any> {
    const res = await api.post("/website/ingest", { url });
    return res.data;
  },

  // 6. Delete document
  async deleteDocument(id: string): Promise<any> {
    const res = await api.delete(`/documents/${encodeURIComponent(id)}`);
    return res.data;
  },

  // 7. Reset knowledge base
  async resetKnowledge(): Promise<any> {
    const res = await api.post("/reset-knowledge");
    return res.data;
  },

  // 8. Get sample queries
  async getSampleQueries(): Promise<{ queries: SampleQuery[] }> {
    const res = await api.get<{ queries: SampleQuery[] }>("/sample-queries");
    return res.data;
  },
};
