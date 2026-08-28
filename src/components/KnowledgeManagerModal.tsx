import React, { useState } from "react";
import {
  X,
  UploadCloud,
  Globe,
  FileText,
  FileSpreadsheet,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  Layers
} from "lucide-react";
import { IndexedDocument } from "../types/index.js";
import { ragApi } from "../services/api.js";

interface KnowledgeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: IndexedDocument[];
  totalChunks: number;
  onRefresh: () => void;
}

export const KnowledgeManagerModal: React.FC<KnowledgeManagerModalProps> = ({
  isOpen,
  onClose,
  documents,
  totalChunks,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<"docs" | "upload" | "website">("docs");
  const [uploading, setUploading] = useState(false);
  const [ingestingUrl, setIngestingUrl] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [resetting, setResetting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setStatusMsg(null);

    try {
      const res = await ragApi.uploadDocument(file);
      setStatusMsg({
        type: "success",
        text: `Successfully ingested '${file.name}' (${res.chunks_indexed} chunks indexed).`,
      });
      onRefresh();
      setActiveTab("docs");
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.response?.data?.error || err.message || "Failed to upload document.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleWebsiteIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;

    setIngestingUrl(true);
    setStatusMsg(null);

    try {
      const res = await ragApi.ingestWebsite(websiteUrl.trim());
      setStatusMsg({
        type: "success",
        text: `Successfully scraped & indexed '${res.title || websiteUrl}' (${res.chunks_indexed} chunks).`,
      });
      setWebsiteUrl("");
      onRefresh();
      setActiveTab("docs");
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.response?.data?.error || err.message || "Failed to ingest website.",
      });
    } finally {
      setIngestingUrl(false);
    }
  };

  const handleDeleteDocument = async (id: string, docName: string) => {
    if (!confirm(`Are you sure you want to delete '${docName}' from the vector database?`)) return;

    try {
      await ragApi.deleteDocument(id);
      setStatusMsg({
        type: "success",
        text: `Deleted '${docName}' and removed its vector embeddings.`,
      });
      onRefresh();
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err.response?.data?.error || "Failed to delete document.",
      });
    }
  };

  const handleResetKnowledge = async () => {
    if (!confirm("Reset knowledge base back to default National Bank of Pakistan (NBP) documents?")) return;

    setResetting(true);
    try {
      await ragApi.resetKnowledge();
      setStatusMsg({
        type: "success",
        text: "Knowledge base restored to default NBP public documents.",
      });
      onRefresh();
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: "Failed to reset knowledge base.",
      });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00261c]/70 backdrop-blur-xs">
      <div
        id="knowledge-modal"
        className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#e6f4ea] text-[#004d39] border border-[#a8d5ba]/50">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Company Knowledge Base
              </h2>
              <p className="text-xs text-gray-500">
                Manage indexed documents, PDF/DOCX/TXT uploads, and website ingestion
              </p>
            </div>
          </div>

          <button
            id="btn-close-knowledge-modal"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-gray-200 flex items-center justify-between bg-[#f8fbf9]">
          <div className="flex gap-2">
            <button
              id="tab-indexed-docs"
              onClick={() => setActiveTab("docs")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === "docs"
                  ? "border-[#006a4e] text-[#006a4e]"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Indexed Documents ({documents.length})
            </button>
            <button
              id="tab-upload-doc"
              onClick={() => setActiveTab("upload")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === "upload"
                  ? "border-[#006a4e] text-[#006a4e]"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Upload Document (PDF/DOCX/TXT)
            </button>
            <button
              id="tab-website-crawler"
              onClick={() => setActiveTab("website")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === "website"
                  ? "border-[#006a4e] text-[#006a4e]"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Ingest Website URL
            </button>
          </div>

          <button
            id="btn-reset-default-knowledge"
            onClick={handleResetKnowledge}
            disabled={resetting}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#006a4e] px-2.5 py-1 rounded hover:bg-gray-200 font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`mx-5 mt-3 p-3 rounded-lg text-xs flex items-center gap-2 ${
              statusMsg.type === "success"
                ? "bg-[#e6f4ea] text-[#004d39] border border-[#a8d5ba]"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#006a4e]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto bg-white">
          {activeTab === "docs" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Total Chunks in Vector Collection: <strong className="text-[#004d39]">{totalChunks}</strong></span>
                <span>Collection: <code className="bg-gray-100 text-[#004d39] px-1.5 py-0.5 rounded text-[11px] font-mono">company_knowledge</code></span>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200 shadow-2xs">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 flex items-start justify-between gap-3 hover:bg-[#f8fbf9] transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="p-2 rounded bg-gray-50 text-gray-700 border border-gray-200 shrink-0">
                        {doc.source_type === "website" ? (
                          <Globe className="w-4 h-4 text-[#006a4e]" />
                        ) : doc.source_type === "docx" ? (
                          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-xs text-gray-900 truncate">
                            {doc.document}
                          </h4>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">
                            {doc.source_type}
                          </span>
                        </div>
                        {doc.url && (
                          <p className="text-[11px] text-sky-700 truncate mt-0.5">
                            {doc.url}
                          </p>
                        )}
                        {doc.sample_preview && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {doc.sample_preview}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                          <span>{doc.chunks_count} chunks indexed</span>
                          <span>•</span>
                          <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`btn-delete-doc-${doc.id}`}
                      onClick={() => handleDeleteDocument(doc.id, doc.document)}
                      title="Delete from Vector DB"
                      className="text-gray-400 hover:text-rose-600 p-1.5 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#006a4e] transition-colors bg-[#f8fbf9]">
                <input
                  type="file"
                  id="file-upload-input"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-[#e6f4ea] text-[#006a4e] flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">
                      Click to upload document
                    </span>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      Supports PDF (.pdf), Word (.docx), and Plain Text (.txt)
                    </span>
                  </div>
                  <span className="text-[11px] text-[#006a4e] bg-[#e6f4ea] px-3 py-1 rounded-full border border-[#a8d5ba]/60 font-medium">
                    Auto-chunking (1000 chars / 150 overlap) & Vector indexing
                  </span>
                </label>
              </div>

              {uploading && (
                <div className="p-4 rounded-lg bg-[#e6f4ea] text-xs text-center text-[#004d39] flex items-center justify-center gap-2 border border-[#a8d5ba]">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#006a4e]" />
                  <span>Extracting text, chunking, and embedding vectors into Qdrant collection...</span>
                </div>
              )}
            </div>
          )}

          {activeTab === "website" && (
            <form onSubmit={handleWebsiteIngest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Target Website URL
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="url"
                      required
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://www.nbp.com.pk/personal-banking"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006a4e]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={ingestingUrl}
                    className="px-4 py-2 bg-[#006a4e] hover:bg-[#004d39] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    {ingestingUrl ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Scraping...</span>
                      </>
                    ) : (
                      <span>Ingest URL</span>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500">
                  The crawler fetches HTML, cleans script/styling, extracts readable body text, splits into vector chunks, and indexes it with source citations.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-700">
                <div className="font-semibold text-gray-900 mb-1">
                  Example NBP Public URLs to test:
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-600 font-mono">
                  <li>https://www.nbp.com.pk</li>
                  <li>https://www.nbp.com.pk/DigitalBanking</li>
                </ul>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
