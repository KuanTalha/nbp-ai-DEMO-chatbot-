export type Language = "en" | "ur";

export interface SourceCitation {
  document: string;
  page?: number;
  url?: string;
  source_type: "pdf" | "docx" | "txt" | "website";
  chunk_text?: string;
  score?: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  sources?: SourceCitation[];
  timestamp: string;
  latency_ms?: number;
  error?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface IndexedDocument {
  id: string;
  document: string;
  source_type: "pdf" | "docx" | "txt" | "website";
  url?: string;
  chunks_count: number;
  created_at: string;
  sample_preview?: string;
}

export interface HealthStatus {
  status: string;
  provider: string;
  collection: string;
  total_chunks: number;
  documents_count: number;
  vector_store_status: string;
  embedding_dim: number;
  timestamp: string;
}

export interface SampleQuery {
  category: string;
  query: string;
  tag: string;
}
