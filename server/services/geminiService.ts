import { GoogleGenAI } from "@google/genai";

let genAIClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

export async function generateGeminiEmbedding(text: string): Promise<number[] | null> {
  const client = getGeminiClient();
  if (!client) return null;

  try {
    const result = await client.models.embedContent({
      model: "gemini-embedding-2-preview",
      contents: text,
    });
    const resAny = result as any;
    if (resAny?.embedding?.values) {
      return resAny.embedding.values;
    }
    if (resAny?.embeddings?.[0]?.values) {
      return resAny.embeddings[0].values;
    }
  } catch (err) {
    console.warn("Gemini embedding API call fallback to local semantic vectorizer:", err);
  }
  return null;
}

export async function generateGroundedResponse(
  userQuery: string,
  contextStr: string,
  systemPrompt: string
): Promise<string> {
  const client = getGeminiClient();

  if (!client) {
    return fallbackGroundedAnswer(userQuery, contextStr);
  }

  const prompt = `Context from company knowledge base:
${contextStr}

User Question: ${userQuery}

Please answer the question accurately, clearly, and concisely based on the context above. Include direct references to the source documents and page numbers where applicable.`;

  // Try fast flash-lite model first for sub-second responses, with fallbacks
  const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"];

  for (const modelName of candidateModels) {
    try {
      const response = await client.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
        },
      });

      if (response.text && response.text.trim().length > 0) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Gemini model ${modelName} encountered error:`, err?.message || err);
    }
  }

  return fallbackGroundedAnswer(userQuery, contextStr);
}

function fallbackGroundedAnswer(query: string, contextStr: string): string {
  if (!contextStr || contextStr.trim().length === 0) {
    return "I couldn't find specific information regarding your question in the currently indexed National Bank of Pakistan (NBP) documents. You can upload additional PDF, Word, or text files using the Knowledge Manager to expand the knowledge base.";
  }

  const cleanChunks = contextStr
    .split("\n\n---\n\n")
    .map((chunk) => chunk.replace(/^\[Source \d+:[^\]]+\]\n/, "").trim())
    .filter(Boolean);

  if (cleanChunks.length === 0) {
    return "I couldn't find specific information regarding your question in the available company knowledge base.";
  }

  return `Based on the official National Bank of Pakistan (NBP) company knowledge base:\n\n${cleanChunks
    .slice(0, 3)
    .map((c) => `• ${c}`)
    .join("\n\n")}\n\n*(Grounded response synthesized from retrieved NBP company documentation)*`;
}
