import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import { Copy, Check, Clock, AlertCircle, Volume2, Square, VolumeX } from "lucide-react";
import { ChatMessage, Language } from "../types/index.js";
import { NbpEmblem } from "./NbpLogo.js";
import { TRANSLATIONS } from "../utils/translations.js";
import { speakText, stopSpeaking, isSpeechSynthesisSupported } from "../utils/voiceUtils.js";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  language?: Language;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  language = "en",
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isUser = message.sender === "user";
  const t = TRANSLATIONS[language];
  const isUrdu = language === "ur";
  const hasTTS = isSpeechSynthesisSupported();

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        stopSpeaking();
      }
    };
  }, [isSpeaking]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakText(
        message.text,
        language,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        (err) => {
          console.warn("Speech error:", err);
          setIsSpeaking(false);
        }
      );
    }
  };

  if (isUser) {
    return (
      <div id={`msg-bubble-${message.id}`} className="flex justify-end">
        <div className="max-w-[85%] sm:max-w-[80%] bg-[#006a4e] text-white p-4 sm:p-5 rounded-2xl rounded-tr-none shadow-xs text-sm leading-relaxed">
          <div className="whitespace-pre-wrap">{message.text}</div>
          <div className="text-[10px] text-emerald-200 mt-1.5 text-right font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={`msg-bubble-${message.id}`} className="flex justify-start gap-3.5">
      {/* Bot Avatar */}
      <div className="w-8 h-8 rounded-full bg-white dark:bg-[#141414] border border-emerald-300 dark:border-emerald-600/60 p-0.5 flex items-center justify-center shadow-xs shrink-0 mt-0.5">
        <NbpEmblem className="w-6 h-6" />
      </div>

      {/* Bubble Container */}
      <div className="bg-white dark:bg-[#121212] p-4 sm:p-5 rounded-2xl rounded-tl-none shadow-xs border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-neutral-100 text-sm leading-relaxed max-w-[92%] sm:max-w-[90%] space-y-2.5 transition-colors duration-200">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-[#222222] pb-2">
          <div className="flex items-center gap-2">
            <span
              className="font-bold text-xs text-[#004d39] dark:text-emerald-400"
              style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}
            >
              {t.botLabel}
            </span>
            {message.latency_ms !== undefined && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-neutral-500 font-mono">
                <Clock className="w-3 h-3" />
                {message.latency_ms}ms
              </span>
            )}
          </div>

          {!message.error && (
            <div className="flex items-center gap-1">
              {/* Listen / Voice Output Button */}
              {hasTTS && (
                <button
                  id={`btn-listen-${message.id}`}
                  onClick={handleToggleSpeak}
                  title={isSpeaking ? t.stopListening : t.listen}
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-all cursor-pointer ${
                    isSpeaking
                      ? "bg-emerald-100 dark:bg-emerald-950/70 text-[#006a4e] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 hover:bg-gray-100 dark:hover:bg-[#1e1e1e]"
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <div className="flex items-center gap-0.5 h-3 px-0.5">
                        <span className="w-0.5 h-2 bg-[#006a4e] dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-0.5 h-3 bg-[#006a4e] dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-0.5 h-1.5 bg-[#006a4e] dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#006a4e] dark:text-emerald-300" style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}>
                        {t.stopListening}
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#006a4e] dark:text-emerald-400" />
                      <span className="text-[11px]" style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}>
                        {t.listen}
                      </span>
                    </>
                  )}
                </button>
              )}

              {/* Copy Button */}
              <button
                id={`btn-copy-${message.id}`}
                onClick={handleCopy}
                title={t.copyAnswer}
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#1e1e1e] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#006a4e] dark:text-emerald-400" />
                    <span className="text-[11px] text-[#006a4e] dark:text-emerald-400 font-medium">{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{t.copyAnswer}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Message Text with Markdown */}
        <div className="text-sm text-gray-800 dark:text-neutral-200 leading-relaxed break-words">
          {message.error ? (
            <div className="flex items-start gap-2 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-lg border border-rose-200 dark:border-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div>{message.text}</div>
            </div>
          ) : (
            <div className="markdown-body">
              <Markdown>{message.text}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

