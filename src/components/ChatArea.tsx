import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Send,
  Sparkles,
  HelpCircle,
  Building,
  CreditCard,
  Banknote,
  Landmark,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { ChatMessage, ChatSession, Language, SampleQuery } from "../types/index.js";
import { ChatMessageBubble } from "./ChatMessageBubble.js";
import { NbpCorporateHeaderBanner, NbpEmblem, NbpSloganBadge } from "./NbpLogo.js";
import { TRANSLATIONS } from "../utils/translations.js";

interface ChatAreaProps {
  session: ChatSession;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onOpenMobileMenu: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  sampleQueries: SampleQuery[];
  theme: "light" | "dark";
  onToggleTheme: () => void;
  language?: Language;
  onToggleLanguage?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  session,
  onSendMessage,
  isLoading,
  onOpenMobileMenu,
  onToggleSidebar,
  isSidebarOpen = true,
  sampleQueries,
  theme,
  onToggleTheme,
  language = "en",
  onToggleLanguage,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = TRANSLATIONS[language];
  const isUrdu = language === "ur";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes("Digital") || category.includes("ڈیجیٹل")) {
      return <Sparkles className="w-4 h-4 text-[#006a4e] dark:text-emerald-400" />;
    }
    if (category.includes("Card") || category.includes("کارڈ")) {
      return <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
    if (category.includes("Loan") || category.includes("قرض")) {
      return <Banknote className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
    if (category.includes("Islamic") || category.includes("اسلامی")) {
      return <Landmark className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    }
    return <Building className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />;
  };

  const isDark = theme === "dark";

  return (
    <main
      id="main-chat-area"
      className="flex-1 flex flex-col h-full bg-[#f0f2f5] dark:bg-[#000000] overflow-hidden relative transition-colors duration-200"
    >
      {/* Authentic NBP Corporate Header Banner (Clicking logo toggles sidebar) */}
      <NbpCorporateHeaderBanner onLogoClick={onToggleSidebar || onOpenMobileMenu} />

      {/* Top Navbar */}
      <header className="h-12 border-b border-gray-200 dark:border-[#1f1f1f] px-3 sm:px-6 flex items-center justify-between shrink-0 bg-white/95 dark:bg-[#080808]/95 backdrop-blur-xs shadow-2xs z-10 transition-colors duration-200">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Logo / Hamburger Sidebar Toggle Button */}
          <button
            id="btn-sidebar-toggle-navbar"
            onClick={onToggleSidebar || onOpenMobileMenu}
            title={isUrdu ? "فہرست کھولنے یا بند کرنے کے لیے کلک کریں" : "Click logo to toggle sidebar"}
            className="flex items-center gap-2 p-1.5 -ml-1 rounded-lg text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#171717] transition-all"
          >
            <Menu className="w-5 h-5 text-[#006a4e] dark:text-emerald-400" />
            <div className="hidden xs:flex items-center gap-1.5 font-bold text-xs">
              <span className="text-[#007353] dark:text-emerald-400">
                {isUrdu ? "این بی پی" : "NBP"}
              </span>
              <span className="text-gray-400 dark:text-neutral-600">|</span>
              <span
                className="text-gray-600 dark:text-neutral-400 text-[11px] font-medium"
                style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}
              >
                {isSidebarOpen ? t.collapseMenu : t.openMenu}
              </span>
            </div>
          </button>

          <div className="min-w-0 border-l border-gray-200 dark:border-[#222222] pl-2.5 sm:pl-3">
            <h1 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-neutral-100 truncate">
              {session.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <span
            className="hidden md:inline-flex text-xs font-semibold text-[#007353] dark:text-emerald-300 bg-emerald-50 dark:bg-[#142a20] px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60"
            style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}
          >
            {t.assistant24_7}
          </span>

          {/* Language Switcher Pill (English / اردو) */}
          {onToggleLanguage && (
            <button
              id="btn-toggle-language"
              onClick={onToggleLanguage}
              aria-label={isUrdu ? "Switch to English" : "اردو زبان پر منتقل ہوں"}
              title={isUrdu ? "Switch to English interface" : "اردو انٹرفیس منتخب کریں"}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-300/80 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-[#142a20] hover:bg-emerald-100/80 dark:hover:bg-[#1c3a2c] text-[#007353] dark:text-emerald-300 text-xs font-bold transition-all shadow-2xs group cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#007353] dark:text-emerald-400 group-hover:rotate-45 transition-transform" />
              <span className="text-xs font-bold" style={{ fontFamily: isUrdu ? "sans-serif" : "'Noto Nastaliq Urdu', Tahoma, sans-serif" }}>
                {isUrdu ? "EN" : "اردو"}
              </span>
            </button>
          )}

          {/* Theme Switcher Button */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-[#262626] bg-gray-50 dark:bg-[#121212] hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-gray-700 dark:text-neutral-200 text-xs font-medium transition-all shadow-2xs group cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
                <span className="text-[11px] hidden xs:inline">{t.light}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-neutral-600 group-hover:-rotate-12 transition-transform" />
                <span className="text-[11px] hidden xs:inline">{t.dark}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Message List Stream */}
      <div className="flex-1 overflow-y-auto">
        {session.messages.length === 0 ? (
          /* Empty / Welcome State */
          <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 text-center space-y-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div
                onClick={onToggleSidebar || onOpenMobileMenu}
                role="button"
                tabIndex={0}
                title={isUrdu ? "فہرست کھولنے کے لیے کلک کریں" : "Click logo to toggle sidebar"}
                className="cursor-pointer p-3 bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-sm border border-emerald-100/80 dark:border-[#222222] inline-flex items-center gap-3 transition-all hover:scale-102 hover:border-emerald-500/50"
              >
                <NbpEmblem className="w-12 h-12" />
                <div className="text-left pr-2">
                  <span className="font-black text-2xl text-[#007353] dark:text-emerald-400 block leading-none">
                    {isUrdu ? "این بی پی" : "NBP"}
                  </span>
                  <span
                    className="text-xs font-extrabold text-gray-800 dark:text-neutral-200 leading-tight"
                    style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}
                  >
                    {t.officialBank}
                  </span>
                </div>
              </div>
              <NbpSloganBadge className="mt-1" inverted={isDark} />
            </div>

            <div className="space-y-1.5">
              <h2
                className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-100 tracking-tight"
                style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif", lineHeight: "1.8" } : undefined}
              >
                {t.welcomeTitle}
              </h2>
              <p
                className="text-xs sm:text-sm text-gray-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed"
                style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif", lineHeight: "1.9" } : undefined}
              >
                {t.welcomeDescription}
              </p>
            </div>

            {/* Sample Query Suggestions */}
            <div className="pt-2 text-left space-y-2.5">
              <div
                className="text-xs font-semibold text-gray-700 dark:text-neutral-300 flex items-center gap-1.5"
                style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#006a4e] dark:text-emerald-400" />
                <span>{t.faqTitle}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sampleQueries.map((item, idx) => (
                  <button
                    key={idx}
                    id={`sample-query-${idx}`}
                    onClick={() => onSendMessage(item.query)}
                    className="p-3.5 text-left rounded-xl border border-gray-200 dark:border-[#222222] bg-white dark:bg-[#0e0e0e] hover:border-[#006a4e] dark:hover:border-emerald-600 hover:bg-[#f8fbf9] dark:hover:bg-[#161616] transition-all shadow-xs group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(item.category)}
                      <span
                        className="text-[11px] font-bold text-gray-700 dark:text-neutral-300"
                        style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p
                      className="text-xs text-gray-600 dark:text-neutral-400 group-hover:text-[#004d39] dark:group-hover:text-emerald-300 font-medium transition-colors leading-normal"
                      style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif", lineHeight: "1.8" } : undefined}
                    >
                      {item.query}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Chat Message Thread */
          <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
            {session.messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} language={language} />
            ))}

            {isLoading && (
              <div className="flex justify-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-[#141414] border border-emerald-300 dark:border-emerald-600/60 p-0.5 flex items-center justify-center shadow-xs shrink-0 mt-1">
                  <NbpEmblem className="w-6 h-6" />
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 sm:p-5 rounded-2xl rounded-tl-none shadow-xs border border-gray-200 dark:border-[#222222] text-gray-900 dark:text-neutral-100 text-sm max-w-[85%] space-y-2 animate-pulse">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold text-xs text-[#004d39] dark:text-emerald-400"
                      style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}
                    >
                      {t.searchingKnowledge}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3 bg-gray-200 dark:bg-[#222222] rounded w-64" />
                    <div className="h-3 bg-gray-200 dark:bg-[#222222] rounded w-48" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#080808] shrink-0 shadow-2xs transition-colors duration-200">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="relative rounded-xl border border-gray-300 dark:border-[#262626] bg-gray-50 dark:bg-[#0f0f0f] focus-within:bg-white dark:focus-within:bg-[#121212] focus-within:border-[#006a4e] dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-[#006a4e]/20 dark:focus-within:ring-emerald-500/20 transition-all shadow-xs"
          >
            <textarea
              ref={textareaRef}
              id="chat-input-textarea"
              rows={1}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={t.inputPlaceholder}
              style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', 'Segoe UI', Tahoma, sans-serif", fontSize: "13px" } : undefined}
              className="w-full resize-none bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-600 focus:outline-none max-h-44 min-h-[46px]"
            />

            <div className="flex items-center justify-between px-3.5 py-2 border-t border-gray-200 dark:border-[#222222] text-xs text-gray-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] text-gray-400 dark:text-neutral-500 hidden sm:inline"
                  style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}
                >
                  {t.pressEnter}
                </span>
              </div>

              <button
                type="submit"
                id="btn-submit-chat"
                disabled={!input.trim() || isLoading}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#006a4e] hover:bg-[#004d39] disabled:opacity-40 disabled:hover:bg-[#006a4e] text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
              >
                <span style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}>
                  {t.send}
                </span>
                <Send className={`w-3.5 h-3.5 ${isUrdu ? "rotate-180" : ""}`} />
              </button>
            </div>
          </form>

          <p
            className="text-[10px] text-center text-gray-400 dark:text-neutral-500 mt-2"
            style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif", lineHeight: "1.7" } : undefined}
          >
            {t.disclaimer}
          </p>
        </div>
      </div>
    </main>
  );
};

