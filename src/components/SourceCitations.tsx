import React, { useState } from "react";
import { FileText, Globe, FileSpreadsheet, ExternalLink, ChevronDown, ChevronUp, Quote } from "lucide-react";
import { SourceCitation, Language } from "../types/index.js";
import { TRANSLATIONS } from "../utils/translations.js";

interface SourceCitationsProps {
  sources: SourceCitation[];
  language?: Language;
}

export const SourceCitations: React.FC<SourceCitationsProps> = ({
  sources,
  language = "en",
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const t = TRANSLATIONS[language];
  const isUrdu = language === "ur";

  if (!sources || sources.length === 0) return null;

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const getSourceIcon = (sourceType?: string) => {
    switch (sourceType) {
      case "pdf":
        return <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />;
      case "docx":
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case "website":
        return <Globe className="w-3.5 h-3.5 text-[#006a4e] dark:text-emerald-400 shrink-0" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-gray-600 dark:text-neutral-400 shrink-0" />;
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#222222]">
      <div className="flex items-center gap-1.5 mb-2">
        <Quote className="w-3.5 h-3.5 text-[#006a4e] dark:text-emerald-400" />
        <span
          className="text-[11px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider"
          style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}
        >
          {t.sourcesCited} ({sources.length})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sources.map((source, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div
              key={index}
              id={`citation-card-${index}`}
              className="group border border-gray-200 dark:border-[#262626] bg-white dark:bg-[#0e0e0e] rounded-lg p-2.5 transition-all hover:border-[#006a4e] dark:hover:border-emerald-600 hover:bg-[#f8fbf9] dark:hover:bg-[#141414] shadow-2xs"
            >
              <div
                onClick={() => toggleExpand(index)}
                className="flex items-start justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="p-1 rounded bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#2a2a2a]">
                    {getSourceIcon(source.source_type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-gray-900 dark:text-neutral-100 truncate">
                      {source.document}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500 dark:text-neutral-400">
                      {source.page && (
                        <span className="font-semibold text-[#006a4e] dark:text-emerald-400">
                          {t.page} {source.page}
                        </span>
                      )}
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 hover:underline truncate max-w-[110px]"
                        >
                          <span>Website</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      {source.score !== undefined && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-gray-100 dark:bg-[#202020] text-gray-700 dark:text-neutral-300 font-mono font-medium">
                          {Math.round(source.score * 100)}% {t.match}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Toggle chunk preview"
                  className="text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-200 p-0.5"
                >
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Expandable extracted text chunk */}
              {isExpanded && source.chunk_text && (
                <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-[#222222] text-xs text-gray-700 dark:text-neutral-300 bg-gray-50 dark:bg-[#161616] p-2.5 rounded font-sans leading-relaxed whitespace-pre-wrap border border-gray-200/60 dark:border-[#262626]">
                  <div
                    className="text-[10px] uppercase font-bold text-[#004d39] dark:text-emerald-400 mb-1"
                    style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}
                  >
                    {t.extractedContext}
                  </div>
                  {source.chunk_text}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

