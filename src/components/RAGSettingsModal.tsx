import React from "react";
import { X, Sliders, Info, Cpu, Database, Check } from "lucide-react";

interface RAGSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topK: number;
  setTopK: (val: number) => void;
  similarityThreshold: number;
  setSimilarityThreshold: (val: number) => void;
}

export const RAGSettingsModal: React.FC<RAGSettingsModalProps> = ({
  isOpen,
  onClose,
  topK,
  setTopK,
  similarityThreshold,
  setSimilarityThreshold,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00261c]/70 backdrop-blur-xs">
      <div
        id="rag-settings-modal"
        className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#e6f4ea] text-[#004d39] border border-[#a8d5ba]/50">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                RAG Pipeline Tuning
              </h2>
              <p className="text-xs text-gray-500">
                Configure context retrieval limits, thresholds, and vector settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="p-5 space-y-5 bg-white">
          {/* Top-K Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
              <span>Top-K Relevant Chunks</span>
              <span className="font-mono bg-[#e6f4ea] text-[#004d39] border border-[#a8d5ba]/50 px-2 py-0.5 rounded font-bold">
                {topK} Chunks
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#006a4e]"
            />
            <p className="text-[11px] text-gray-500">
              Specifies how many top-ranking vector chunks from Qdrant are passed to the Gemini prompt context.
            </p>
          </div>

          {/* Similarity Threshold Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
              <span>Cosine Similarity Threshold</span>
              <span className="font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                {(similarityThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.05"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <p className="text-[11px] text-gray-500">
              Minimum cosine similarity score required for a chunk to be retrieved. Low values allow more broad matches; higher values enforce strict relevance.
            </p>
          </div>

          {/* Configuration Summary Card */}
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-2 text-xs">
            <div className="font-semibold text-gray-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#006a4e]" />
              <span>Active RAG Engine Specs</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
              <div>
                <span className="text-gray-400">LLM Model:</span>{" "}
                <strong className="text-gray-900">gemini-3.7-flash</strong>
              </div>
              <div>
                <span className="text-gray-400">Embedding:</span>{" "}
                <strong className="text-gray-900">gemini-embedding-2-preview</strong>
              </div>
              <div>
                <span className="text-gray-400">Chunk Size:</span>{" "}
                <strong className="text-gray-900">1000 characters</strong>
              </div>
              <div>
                <span className="text-gray-400">Chunk Overlap:</span>{" "}
                <strong className="text-gray-900">150 characters</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#006a4e] hover:bg-[#004d39] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
