import { Language } from "../types/index.js";

/**
 * Strips markdown symbols, asterisks, URLs, bullet markers, etc.,
 * to create a clean, natural string for text-to-speech engines.
 */
export function stripMarkdownForSpeech(text: string): string {
  if (!text) return "";

  return text
    // Remove markdown headers
    .replace(/^#+\s+/gm, "")
    // Remove bold and italic markers (* and _)
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove inline code and code blocks
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    // Remove bullet points / dashes at line starts
    .replace(/^[\s*+-]+\s+/gm, "")
    // Remove numbered lists markers
    .replace(/^\d+\.\s+/gm, "")
    // Remove blockquotes
    .replace(/^>\s+/gm, "")
    // Remove emojis / extra unicode noise if needed or keep standard
    // Replace multiple newlines with single periods for natural pauses
    .replace(/\n+/g, ". ")
    // Clean multiple spaces
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Checks if Speech Synthesis (TTS) is supported
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

/**
 * Checks if Speech Recognition (STT) is supported
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
}

/**
 * Global active utterance reference for speech cancellation tracking
 */
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    } catch (e) {
      console.warn("Error stopping speech synthesis:", e);
    }
  }
}

/**
 * Speak given text in either Urdu or English with proper voice selection
 */
export function speakText(
  text: string,
  language: Language,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): void {
  if (!isSpeechSynthesisSupported()) {
    onError?.(new Error("Speech synthesis not supported in this browser."));
    return;
  }

  // Cancel any ongoing speech first
  stopSpeaking();

  const cleanText = stripMarkdownForSpeech(text);
  if (!cleanText) {
    onEnd?.();
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance = utterance;

    // Detect target language code
    const langCode = language === "ur" ? "ur-PK" : "en-US";
    utterance.lang = langCode;

    // Select the best available voice in browser
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      let matchingVoice: SpeechSynthesisVoice | undefined;

      if (language === "ur") {
        // Look for ur-PK, ur, or hindi/arabic fallback if urdu not natively installed
        matchingVoice =
          voices.find((v) => v.lang.toLowerCase().startsWith("ur")) ||
          voices.find((v) => v.lang.toLowerCase().includes("pk")) ||
          voices.find((v) => v.lang.toLowerCase().startsWith("hi")) ||
          voices.find((v) => v.name.toLowerCase().includes("urdu"));
      } else {
        // Look for en-US, en-GB, en-PK, or high quality English voice
        matchingVoice =
          voices.find((v) => v.lang.toLowerCase() === "en-us" && !v.name.includes("Google")) ||
          voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
          voices.find((v) => v.default);
      }

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    utterance.rate = language === "ur" ? 0.95 : 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      currentUtterance = null;
      if (e.error !== "canceled" && e.error !== "interrupted") {
        onError?.(e);
      } else {
        onEnd?.();
      }
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("SpeechSynthesis error:", err);
    onError?.(err);
  }
}
