import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

let pdfParse: any = null;
try {
  const mod = require("pdf-parse");
  pdfParse = mod.default || mod;
} catch (e) {
  console.warn("Could not require pdf-parse:", e);
}

let mammoth: any = null;
try {
  const mod = require("mammoth");
  mammoth = mod.default || mod;
} catch (e) {
  console.warn("Could not require mammoth:", e);
}

export interface ParsedChunk {
  chunk_text: string;
  document: string;
  page?: number;
  url?: string;
  source_type: "pdf" | "docx" | "txt" | "website";
}

export class DocumentParser {
  private chunkSize: number;
  private chunkOverlap: number;

  constructor(chunkSize: number = 1000, chunkOverlap: number = 150) {
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
  }

  public splitText(text: string): string[] {
    if (!text || text.trim().length === 0) return [];
    
    const chunks: string[] = [];
    const paragraphs = text.split(/\n\s*\n/);
    let currentChunk = "";

    for (const para of paragraphs) {
      const cleanPara = para.trim();
      if (!cleanPara) continue;

      if ((currentChunk.length + cleanPara.length) <= this.chunkSize) {
        currentChunk += (currentChunk ? "\n\n" : "") + cleanPara;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          // Add overlap from the end of currentChunk if possible
          const words = currentChunk.split(/\s+/);
          const overlapWords = words.slice(Math.max(0, words.length - 20)).join(" ");
          currentChunk = overlapWords + "\n\n" + cleanPara;
        } else {
          // If single paragraph is larger than chunkSize, split by sentences/length
          for (let i = 0; i < cleanPara.length; i += (this.chunkSize - this.chunkOverlap)) {
            chunks.push(cleanPara.substring(i, i + this.chunkSize).trim());
          }
          currentChunk = "";
        }
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.filter(c => c.length > 20);
  }

  public async parsePdfBuffer(buffer: Buffer, filename: string): Promise<ParsedChunk[]> {
    if (!pdfParse) {
      throw new Error("PDF parser library is not loaded.");
    }
    const data = await pdfParse(buffer);
    const fullText = data.text || "";
    const totalPages = data.numpages || 1;
    
    const rawChunks = this.splitText(fullText);
    const chunks: ParsedChunk[] = [];
    
    rawChunks.forEach((chunkText, idx) => {
      const approxPage = Math.min(totalPages, Math.floor((idx / Math.max(1, rawChunks.length)) * totalPages) + 1);
      chunks.push({
        chunk_text: chunkText,
        document: filename,
        page: approxPage,
        source_type: "pdf"
      });
    });

    return chunks;
  }

  public async parseDocxBuffer(buffer: Buffer, filename: string): Promise<ParsedChunk[]> {
    if (!mammoth) {
      throw new Error("DOCX parser library is not loaded.");
    }
    const result = await mammoth.extractRawText({ buffer });
    const fullText = result.value || "";
    const rawChunks = this.splitText(fullText);
    
    return rawChunks.map((chunkText, idx) => ({
      chunk_text: chunkText,
      document: filename,
      page: (idx >> 1) + 1,
      source_type: "docx"
    }));
  }

  public parseTxtString(text: string, filename: string): ParsedChunk[] {
    const rawChunks = this.splitText(text);
    return rawChunks.map((chunkText, idx) => ({
      chunk_text: chunkText,
      document: filename,
      page: (idx >> 1) + 1,
      source_type: "txt"
    }));
  }

  public async parseWebsiteUrl(url: string): Promise<{ title: string; chunks: ParsedChunk[] }> {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL ${url} - Status ${response.status}`);
    }

    const html = await response.text();
    
    // Simple HTML cleaner
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : url;

    // Strip scripts, styles, navigation, footer tags
    const cleanHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "");

    // Strip remaining tags
    const cleanText = cleanHtml
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

    const rawChunks = this.splitText(cleanText);

    const chunks = rawChunks.map((chunkText) => ({
      chunk_text: chunkText,
      document: pageTitle,
      url,
      source_type: "website" as const,
    }));

    return { title: pageTitle, chunks };
  }
}

export const documentParser = new DocumentParser(1000, 150);
