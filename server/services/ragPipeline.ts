import { vectorStore } from "./vectorStore";
import { generateGeminiEmbedding, generateGroundedResponse } from "./geminiService";

export const SYSTEM_PROMPT = `You are an expert AI Company Knowledge Assistant for National Bank of Pakistan (NBP).

Your purpose is to assist customers, employees, and users with accurate information about NBP products, digital banking, debit cards, consumer financing, Islamic banking, account opening, and corporate services based on the provided company knowledge base.

Guidelines:
1. Use the retrieved context as the primary source of truth.
2. Structure your answers with clear headings, bullet points, and highlight key terms (e.g., transaction limits, eligibility, required documents).
3. Always cite specific source documents and page numbers where applicable.
4. Keep answers professional, courteous, and actionable.
5. If specific detail is not present in the documents, state what is known and guide the user on how they can contact NBP Helpline (021-111-627-627) or visit a branch.`;

export interface SourceCitation {
  document: string;
  page?: number;
  url?: string;
  source_type: "pdf" | "docx" | "txt" | "website";
  chunk_text?: string;
  score?: number;
}

export interface RAGAnswerResult {
  answer: string;
  sources: SourceCitation[];
  conversation_id?: string;
  query: string;
  execution_time_ms: number;
}

const GREETING_PATTERNS = [
  /^hi\b/i,
  /^hello\b/i,
  /^hey\b/i,
  /^assalam\b/i,
  /^salam\b/i,
  /^good\s+(morning|afternoon|evening|day)\b/i,
  /^who\s+are\s+you/i,
  /^what\s+can\s+you\s+do/i,
  /^how\s+can\s+you\s+help/i,
  /^help\b/i,
  /^thank\s+you/i,
  /^thanks/i,
];

function isGreetingOrMetaQuery(q: string): boolean {
  const trimmed = q.trim().toLowerCase();
  if (trimmed.length <= 4 && ["hi", "hey", "hola", "salam"].includes(trimmed)) return true;
  return GREETING_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function getGreetingResponse(q: string): string {
  const trimmed = q.trim().toLowerCase();
  if (trimmed.includes("thank")) {
    return "You're very welcome! If you have any other questions regarding National Bank of Pakistan (NBP) services, debit cards, loans, or digital banking, feel free to ask.";
  }

  return `### Hello! Welcome to the **NBP AI Knowledge Assistant**.

I am your intelligent assistant for **National Bank of Pakistan (NBP)**, powered by Retrieval-Augmented Generation (RAG). I can assist you with official information from indexed company documents, including:

* **📱 NBP Digital Mobile Banking:** Registration, Raast instant transfers, bill payments, and daily limits.
* **💳 Debit Cards Portfolio:** PayPak, Visa Classic, Gold, and Platinum features and ATM/POS limits.
* **💼 Consumer Financing & Loans:** NBP Advance Plus (salary advance loan), Saibaan Home Loans, and SME credit lines.
* **🏦 Accounts & Deposits:** NBP Asaan Account opening, Current Accounts, PLS Savings, and Term Deposits.
* **🌙 NBP Aitemaad Islamic Banking:** Shariah-compliant Mudarabah accounts, Ijarah auto finance, and Murabaha trade.
* **📄 Custom Knowledge Ingestion:** You can also upload your own company PDFs, Word docs, or website URLs via the **Knowledge Manager**.

---
**Try asking a question or selecting one of these examples:**
- *"What is NBP Digital and what are the daily transaction limits?"*
- *"What are the withdrawal limits on NBP Visa Platinum card?"*
- *"What are the eligibility criteria for NBP Advance Plus salary loan?"*
- *"How can I open an NBP Asaan Account?"*`;
}

export class RAGPipelineService {
  public async answerQuestion(
    query: string,
    options: {
      conversation_id?: string;
      top_k?: number;
      similarity_threshold?: number;
    } = {}
  ): Promise<RAGAnswerResult> {
    const startTime = Date.now();
    const cleanQuery = (query || "").trim();

    if (!cleanQuery) {
      return {
        answer: "Please enter a question or query to search the NBP company knowledge base.",
        sources: [],
        conversation_id: options.conversation_id,
        query: cleanQuery,
        execution_time_ms: Date.now() - startTime,
      };
    }

    // Check for greetings and meta conversational queries
    if (isGreetingOrMetaQuery(cleanQuery)) {
      return {
        answer: getGreetingResponse(cleanQuery),
        sources: [],
        conversation_id: options.conversation_id,
        query: cleanQuery,
        execution_time_ms: Date.now() - startTime,
      };
    }

    const topK = options.top_k || 5;
    const threshold = options.similarity_threshold !== undefined ? options.similarity_threshold : 0.05;

    // 1. Vector & Lexical Hybrid Search
    const searchResults = vectorStore.search(
      cleanQuery,
      undefined,
      topK,
      threshold
    );

    if (searchResults.length === 0) {
      return {
        answer: "I couldn't find specific information regarding your query in the available company knowledge base. You can try rephrasing your question or upload the relevant document in the Knowledge Manager.",
        sources: [],
        conversation_id: options.conversation_id,
        query: cleanQuery,
        execution_time_ms: Date.now() - startTime,
      };
    }

    // 2. Format Context and Citations
    const contextBlocks: string[] = [];
    const sources: SourceCitation[] = [];

    searchResults.forEach((item, index) => {
      const c = item.chunk;
      let citeLabel = `Source ${index + 1}: ${c.document}`;
      if (c.page) citeLabel += ` (Page ${c.page})`;
      if (c.url) citeLabel += ` (${c.url})`;

      contextBlocks.push(`[${citeLabel}]\n${c.chunk_text}`);

      sources.push({
        document: c.document,
        page: c.page,
        url: c.url,
        source_type: c.source_type,
        chunk_text: c.chunk_text,
        score: Math.round(item.score * 100) / 100,
      });
    });

    const contextStr = contextBlocks.join("\n\n---\n\n");

    // 3. Grounded answer generation via Gemini LLM with instant local fallback
    const answer = await generateGroundedResponse(cleanQuery, contextStr, SYSTEM_PROMPT);

    return {
      answer,
      sources,
      conversation_id: options.conversation_id,
      query: cleanQuery,
      execution_time_ms: Date.now() - startTime,
    };
  }
}

export const ragPipeline = new RAGPipelineService();
