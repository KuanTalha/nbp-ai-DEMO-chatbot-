import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar.js";
import { ChatArea } from "./components/ChatArea.js";
import { ChatSession, ChatMessage, Language } from "./types/index.js";
import { ragApi } from "./services/api.js";
import { SAMPLE_QUERIES_BY_LANG } from "./utils/translations.js";

export default function App() {
  // Language Management (English / اردو)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("nbp_language");
    if (saved === "en" || saved === "ur") return saved;
    return "en";
  });

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ur" : "en"));
  };

  useEffect(() => {
    localStorage.setItem("nbp_language", language);
    document.documentElement.lang = language;
  }, [language]);

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("nbp_rag_sessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved sessions", e);
      }
    }
    const initialId = "session-" + Date.now();
    return [
      {
        id: initialId,
        title: language === "ur" ? "نئی گفتگو" : "New Conversation",
        createdAt: new Date().toISOString(),
        messages: [],
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => sessions[0]?.id || "session-1");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Theme Management (Light / Dark)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("nbp_theme");
    if (saved === "light" || saved === "dark") return saved;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("nbp_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Persist sessions to local storage
  useEffect(() => {
    localStorage.setItem("nbp_rag_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || {
    id: "session-fallback",
    title: language === "ur" ? "نئی گفتگو" : "New Conversation",
    createdAt: new Date().toISOString(),
    messages: [],
  };

  const handleNewChat = () => {
    const newSessionId = "session-" + Date.now();
    const newSession: ChatSession = {
      id: newSessionId,
      title: language === "ur" ? "نئی گفتگو" : "New Conversation",
      createdAt: new Date().toISOString(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter((s) => s.id !== id);
    if (filtered.length === 0) {
      const freshId = "session-" + Date.now();
      const freshSession: ChatSession = {
        id: freshId,
        title: language === "ur" ? "نئی گفتگو" : "New Conversation",
        createdAt: new Date().toISOString(),
        messages: [],
      };
      setSessions([freshSession]);
      setActiveSessionId(freshId);
    } else {
      setSessions(filtered);
      if (activeSessionId === id) {
        setActiveSessionId(filtered[0].id);
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    // Update session with user message and set title if first message
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          const isFirstMessage = s.messages.length === 0;
          return {
            ...s,
            title: isFirstMessage ? text.trim().slice(0, 36) + (text.length > 36 ? "..." : "") : s.title,
            messages: [...s.messages, userMessage],
          };
        }
        return s;
      })
    );

    setIsLoading(true);

    try {
      const response = await ragApi.sendChat(text.trim(), activeSessionId, 5, 0.25);

      const aiMessage: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        sender: "ai",
        text: response.answer,
        sources: response.sources,
        timestamp: new Date().toISOString(),
        latency_ms: response.execution_time_ms,
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, aiMessage],
            };
          }
          return s;
        })
      );
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        sender: "ai",
        text: err.response?.data?.error || err.message || (language === "ur" ? "معلومات تلاش کرتے وقت ایک خرابی پیش آگئی۔" : "An error occurred while retrieving knowledge from the RAG pipeline."),
        timestamp: new Date().toISOString(),
        error: true,
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, errorMessage],
            };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="app-root-container"
      className={`flex h-screen w-screen overflow-hidden bg-[#f0f2f5] dark:bg-[#000000] font-sans text-gray-900 dark:text-neutral-100 antialiased select-text transition-colors duration-200 ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isOpenDesktop={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Chat Content */}
      <ChatArea
        session={activeSession}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
        sampleQueries={SAMPLE_QUERIES_BY_LANG[language] || SAMPLE_QUERIES_BY_LANG.en}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />
    </div>
  );
}

