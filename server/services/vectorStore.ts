import { DocumentChunk, INITIAL_NBP_DOCUMENTS } from "../data/nbp_knowledge";

// Helper: Cosine similarity
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Synonyms map to expand queries for higher banking domain recall
const SYNONYMS: Record<string, string[]> = {
  loan: ["loans", "financing", "advance", "credit", "borrow", "borrowing", "personal loan", "salary"],
  loans: ["loan", "financing", "advance", "credit", "borrow", "borrowing", "advance plus", "saibaan"],
  borrow: ["loan", "loans", "financing", "advance", "credit"],
  card: ["cards", "debit", "atm", "visa", "paypak", "unionpay", "classic", "gold", "platinum"],
  cards: ["card", "debit", "atm", "visa", "paypak", "unionpay", "classic", "gold", "platinum"],
  debit: ["card", "cards", "atm", "pos", "visa", "paypak"],
  limit: ["limits", "allowance", "maximum", "cap", "withdrawal", "transaction"],
  limits: ["limit", "allowance", "maximum", "cap", "withdrawal", "transaction"],
  app: ["digital", "mobile", "application", "nbp digital", "login", "online", "banking"],
  digital: ["app", "mobile", "application", "nbp digital", "raast", "ibft", "online"],
  mobile: ["app", "digital", "phone", "nbp digital"],
  transfer: ["transfers", "ibft", "raast", "funds", "send money", "payment"],
  transfers: ["transfer", "ibft", "raast", "funds", "send money", "payment"],
  account: ["accounts", "deposit", "deposits", "current", "savings", "asaan", "open"],
  accounts: ["account", "deposit", "deposits", "current", "savings", "asaan", "open"],
  islamic: ["aitemaad", "shariah", "halal", "mudarabah", "ijarah", "murabaha"],
  aitemaad: ["islamic", "shariah", "mudarabah", "halal"],
  help: ["support", "helpline", "contact", "phone", "email", "customer care"],
  contact: ["helpline", "phone", "support", "email", "call"],
  helpline: ["contact", "phone", "support", "email", "call", "111-627-627"],
};

// Simple deterministic hash-based embedding
export function generateLocalEmbedding(text: string, dim: number = 768): number[] {
  const vector = new Array(dim).fill(0);
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  
  if (words.length === 0) return vector;

  words.forEach((word, idx) => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    const pos = Math.abs(hash) % dim;
    vector[pos] += 1.0 / Math.sqrt(words.length);
    // Add sub-feature for bigrams
    if (idx > 0) {
      const bigramHash = (hash * 31 + words[idx - 1].charCodeAt(0)) | 0;
      const biPos = Math.abs(bigramHash) % dim;
      vector[biPos] += 0.5 / Math.sqrt(words.length);
    }
  });

  // Normalize
  let norm = 0;
  for (let i = 0; i < dim; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dim; i++) {
      vector[i] /= norm;
    }
  }
  return vector;
}

export class VectorStoreService {
  private chunks: DocumentChunk[] = [];
  public collectionName: string = "company_knowledge";

  constructor() {
    this.resetToDefaults();
  }

  public resetToDefaults() {
    this.chunks = [];
    INITIAL_NBP_DOCUMENTS.forEach((doc) => {
      doc.pages.forEach((p) => {
        const chunkId = `${doc.id}-p${p.page}`;
        const vec = generateLocalEmbedding(p.content);
        this.chunks.push({
          id: chunkId,
          doc_id: doc.id,
          document: doc.title,
          page: p.page,
          url: (doc as any).url,
          source_type: doc.source_type,
          chunk_text: p.content,
          vector: vec,
          created_at: new Date().toISOString()
        });
      });
    });
  }

  public addChunks(newChunks: Omit<DocumentChunk, "id" | "created_at">[]): DocumentChunk[] {
    const created: DocumentChunk[] = [];
    for (const item of newChunks) {
      const id = "chk-" + Math.random().toString(36).substring(2, 9);
      const vector = item.vector && item.vector.length > 0 ? item.vector : generateLocalEmbedding(item.chunk_text);
      const chunk: DocumentChunk = {
        ...item,
        id,
        vector,
        created_at: new Date().toISOString()
      };
      this.chunks.push(chunk);
      created.push(chunk);
    }
    return created;
  }

  public search(
    query: string,
    queryVector?: number[],
    topK: number = 5,
    similarityThreshold: number = 0.05
  ): { chunk: DocumentChunk; score: number }[] {
    const localQVec = generateLocalEmbedding(query);
    const queryLower = query.toLowerCase();
    
    // Extract core query tokens
    const rawTokens = queryLower
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1 && !["the", "and", "for", "with", "what", "how", "are", "is", "does", "explain", "tell", "about", "give", "can", "you", "please"].includes(t));

    // Expand with domain synonyms
    const expandedTokens = new Set<string>(rawTokens);
    for (const token of rawTokens) {
      if (SYNONYMS[token]) {
        SYNONYMS[token].forEach((syn) => expandedTokens.add(syn));
      }
    }
    const tokenList = Array.from(expandedTokens);

    const scored = this.chunks.map((chunk) => {
      let vecScore = 0;
      if (chunk.vector && localQVec) {
        vecScore = cosineSimilarity(localQVec, chunk.vector);
      }

      const lowerChunk = chunk.chunk_text.toLowerCase();
      const lowerDoc = (chunk.document || "").toLowerCase();
      
      let termMatches = 0;
      for (const term of tokenList) {
        if (lowerChunk.includes(term)) {
          termMatches += 1;
        }
        if (lowerDoc.includes(term)) {
          termMatches += 0.8;
        }
      }

      // Exact phrase bonus
      let phraseBonus = 0;
      if (rawTokens.length >= 2) {
        const bigram = rawTokens.slice(0, 2).join(" ");
        if (lowerChunk.includes(bigram)) {
          phraseBonus = 0.25;
        }
      }

      const lexicalScore = tokenList.length > 0 ? (termMatches / (tokenList.length * 1.2)) : 0;
      const finalScore = (vecScore * 0.4) + (lexicalScore * 0.45) + phraseBonus;

      return {
        chunk,
        score: Math.min(1.0, Math.max(0.0, finalScore)),
      };
    });

    const sorted = scored.sort((a, b) => b.score - a.score);

    // If matches exceed threshold, filter them; otherwise return the top 2 candidate chunks so LLM is never left without context
    const filtered = sorted.filter((item) => item.score >= Math.min(similarityThreshold, 0.08));
    if (filtered.length > 0) {
      return filtered.slice(0, topK);
    }

    return sorted.slice(0, Math.min(topK, 2));
  }

  public getDocumentsList() {
    const docMap = new Map<string, {
      id: string;
      document: string;
      source_type: string;
      url?: string;
      chunks_count: number;
      created_at: string;
      sample_preview: string;
    }>();

    this.chunks.forEach((c) => {
      const key = c.doc_id || c.document;
      if (!docMap.has(key)) {
        docMap.set(key, {
          id: c.doc_id || c.document,
          document: c.document,
          source_type: c.source_type,
          url: c.url,
          chunks_count: 1,
          created_at: c.created_at,
          sample_preview: c.chunk_text.substring(0, 160) + "..."
        });
      } else {
        const existing = docMap.get(key)!;
        existing.chunks_count += 1;
      }
    });

    return Array.from(docMap.values());
  }

  public deleteDocument(docIdentifier: string): boolean {
    const initialLen = this.chunks.length;
    this.chunks = this.chunks.filter(
      (c) => c.doc_id !== docIdentifier && c.document !== docIdentifier && c.id !== docIdentifier
    );
    return this.chunks.length < initialLen;
  }

  public getCount(): number {
    return this.chunks.length;
  }

  public getAllChunks(): DocumentChunk[] {
    return this.chunks;
  }
}

export const vectorStore = new VectorStoreService();
