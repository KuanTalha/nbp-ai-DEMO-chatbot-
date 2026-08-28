import React from "react";
import {
  MessageSquarePlus,
  MessageSquare,
  Trash2,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { ChatSession, Language } from "../types/index.js";
import { NbpEmblem } from "./NbpLogo.js";
import { TRANSLATIONS } from "../utils/translations.js";

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isOpenDesktop?: boolean;
  onToggleSidebar?: () => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
  language?: Language;
  onToggleLanguage?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpenMobile,
  onCloseMobile,
  isOpenDesktop = true,
  onToggleSidebar,
  theme = "light",
  onToggleTheme,
  language = "en",
  onToggleLanguage,
}) => {
  const isDark = theme === "dark";
  const t = TRANSLATIONS[language];
  const isUrdu = language === "ur";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed md:static inset-y-0 ${
          isUrdu ? "right-0 border-l" : "left-0 border-r"
        } z-50 shrink-0 overflow-hidden bg-[#004d39] dark:bg-[#0a0a0a] text-white flex flex-col border-[#003829] dark:border-[#1f1f1f] transition-all duration-300 ease-in-out ${
          isOpenMobile ? "translate-x-0 w-72" : isUrdu ? "translate-x-full w-72 md:translate-x-0" : "-translate-x-full w-72 md:translate-x-0"
        } ${
          isOpenDesktop
            ? "md:w-72 md:opacity-100"
            : "md:w-0 md:opacity-0 md:pointer-events-none md:border-0"
        }`}
      >
        <div className="w-72 flex flex-col h-full shrink-0">
          {/* Sidebar Header (Clickable Logo to Toggle/Close) */}
          <div className="p-4 sm:p-5 flex flex-col gap-1 border-b border-[#003829] dark:border-[#1f1f1f]">
            <div
              id="sidebar-header-logo"
              onClick={onToggleSidebar || onCloseMobile}
              title={isUrdu ? "فہرست بند کرنے کے لیے لوگو پر کلک کریں" : "Click logo to collapse sidebar"}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (onToggleSidebar) onToggleSidebar();
                  else onCloseMobile();
                }
              }}
              className="flex items-center gap-3 cursor-pointer p-1 -m-1 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors group select-none"
            >
              <div className="w-10 h-10 bg-white/10 dark:bg-white/5 p-1 rounded-xl flex items-center justify-center border border-white/20 dark:border-white/10 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <NbpEmblem className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-black text-lg tracking-tight text-white leading-tight">
                    {isUrdu ? "این بی پی" : "NBP"}
                  </span>
                  <span className="text-xs font-semibold text-[#a8d5ba] dark:text-emerald-400 truncate">
                    {t.appTitle}
                  </span>
                </div>
                <span
                  className="text-[11px] text-emerald-200 dark:text-emerald-300 block font-medium mt-0.5"
                  style={{ fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', Tahoma, sans-serif" }}
                  dir="rtl"
                >
                  نیشنل بینک آف پاکستان
                </span>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="px-3.5 py-3">
            <button
              id="btn-new-chat"
              onClick={() => {
                onNewChat();
                onCloseMobile();
              }}
              className="w-full bg-[#006a4e] hover:bg-[#007d5c] dark:bg-[#142a20] dark:hover:bg-[#1c3a2c] border border-[#008c6a] dark:border-[#224838] rounded-lg py-2.5 px-3.5 flex items-center justify-between text-sm font-medium text-white transition-all shadow-xs group"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquarePlus className="w-4 h-4 text-[#a8d5ba] dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className={isUrdu ? "font-urdu text-sm" : "font-medium"}>{t.newChat}</span>
              </div>
              <span className="text-[11px] bg-[#003829]/60 dark:bg-[#0a0a0a] px-2 py-0.5 rounded text-[#a8d5ba] dark:text-emerald-400 border border-[#008c6a]/50 dark:border-[#224838]">
                ⌘K
              </span>
            </button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-3">
            <div>
              <div className="px-2 py-1 text-[11px] uppercase font-bold text-[#a8d5ba] dark:text-emerald-400 opacity-80 tracking-wider">
                {t.conversations}
              </div>

              <div className="space-y-1 mt-1">
                {sessions.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-[#a8d5ba]/70 dark:text-neutral-500">
                    {t.noConversations}
                  </div>
                ) : (
                  sessions.map((session) => {
                    const isActive = session.id === activeSessionId;
                    return (
                      <div
                        key={session.id}
                        id={`chat-session-${session.id}`}
                        onClick={() => {
                          onSelectSession(session.id);
                          onCloseMobile();
                        }}
                        className={`group relative flex items-center justify-between px-3 py-2 rounded-md text-xs cursor-pointer transition-colors ${
                          isActive
                            ? "bg-[#ffffff18] dark:bg-[#16251d] text-white font-medium border-l-4 border-white dark:border-emerald-400 shadow-xs"
                            : "text-[#e0f2f1] dark:text-neutral-300 hover:bg-[#ffffff0e] dark:hover:bg-[#151515] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <MessageSquare
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActive ? "text-white dark:text-emerald-400" : "text-[#a8d5ba] dark:text-neutral-500 opacity-70"
                            }`}
                          />
                          <span className="truncate">{session.title}</span>
                        </div>

                        <button
                          id={`btn-delete-session-${session.id}`}
                          onClick={(e) => onDeleteSession(session.id, e)}
                          title={t.deleteConversation}
                          className="opacity-0 group-hover:opacity-100 text-[#a8d5ba] dark:text-neutral-400 hover:text-rose-300 dark:hover:text-rose-400 p-1 rounded transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer with Language & Theme Switches & Official Branding */}
          <div className="p-3.5 border-t border-[#003829] dark:border-[#1f1f1f] bg-[#003829]/90 dark:bg-[#080808] space-y-2">
            {/* Language Switch Button */}
            {onToggleLanguage && (
              <button
                id="btn-sidebar-lang-toggle"
                onClick={onToggleLanguage}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#004d39]/70 dark:bg-[#121212] hover:bg-[#004d39] dark:hover:bg-[#1a1a1a] text-[#a8d5ba] dark:text-neutral-300 hover:text-white text-xs font-medium border border-[#005c45] dark:border-[#262626] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{t.language}</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-700/60 dark:bg-[#1e3427] text-white dark:text-emerald-300 border border-emerald-500/40">
                  {isUrdu ? "اردو (Urdu)" : "English"}
                </span>
              </button>
            )}

            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                id="btn-sidebar-theme-toggle"
                onClick={onToggleTheme}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#004d39]/70 dark:bg-[#121212] hover:bg-[#004d39] dark:hover:bg-[#1a1a1a] text-[#a8d5ba] dark:text-neutral-300 hover:text-white text-xs font-medium border border-[#005c45] dark:border-[#262626] transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isDark ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-[#a8d5ba]" />
                  )}
                  <span>{t.theme}</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/20 dark:bg-[#1e1e1e] text-[#a8d5ba] dark:text-emerald-400">
                  {isDark ? t.dark : t.light}
                </span>
              </button>
            )}

            <div className="text-center pt-0.5">
              <p
                className="text-[11px] text-[#a8d5ba] dark:text-emerald-400 font-semibold"
                style={isUrdu ? { fontFamily: "'Noto Nastaliq Urdu', Tahoma, sans-serif" } : undefined}
              >
                {t.officialBank}
              </p>
              <p className="text-[10px] text-[#a8d5ba]/70 dark:text-neutral-500 mt-0.5">
                {t.officialFooterSub}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

