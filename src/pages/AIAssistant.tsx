import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Paperclip,
  Sparkles,
  Trash2,
  Download,
  Settings,
  ChevronDown,
  ArrowDown,
  Zap,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MessageBubble from "@/components/chat-widget/MessageBubble";
import TypingIndicator from "@/components/chat-widget/TypingIndicator";
import SettingsPanel from "@/components/chat-widget/SettingsPanel";
import { ChatMessage, ChatWidgetSettings } from "@/components/chat-widget/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ─── Constants ─── */
const STORAGE_KEY = "ai-assistant-chat-history";
const MAX_CONTEXT_MESSAGES = 40; // Windowing: max messages sent to API

/* ─── Helpers ─── */
const loadPersistedMessages = (): ChatMessage[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
  } catch {}
  return [
    {
      id: "greeting",
      role: "assistant",
      content:
        "👋 Hey! I'm your **AI Training Assistant**.\n\nI can help you with:\n- 🎯 Interview preparation & mock questions\n- 💻 Coding challenges & explanations\n- 📝 Resume & career advice\n- 🧠 Learning strategies\n\nWhat would you like to work on?",
      timestamp: new Date(),
    },
  ];
};

/* ─── Component ─── */
const AIAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(loadPersistedMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ChatWidgetSettings>({
    personality: "professional",
    language: "en",
    temperature: 0.7,
    topP: 0.9,
    systemPrompt: "",
  });
  const [isAtBottom, setIsAtBottom] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  /* ─── Persist messages ─── */
  useEffect(() => {
    const toSave = messages.filter((m) => !m.isStreaming);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [messages]);

  /* ─── Smart scroll: only auto-scroll if user is at bottom ─── */
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const threshold = 80;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    setIsAtBottom(atBottom);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsAtBottom(true);
  };

  /* ─── Send message ─── */
  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsAtBottom(true);
    setIsLoading(true);

    if (inputRef.current) inputRef.current.style.height = "auto";

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Windowed context: send only the last N messages
      const contextMessages = updatedMessages
        .slice(-MAX_CONTEXT_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-widget`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${session?.access_token ?? ""}`,
          },
          body: JSON.stringify({ messages: contextMessages, settings }),
        }
      );

      if (res.status === 429) {
        toast({ title: "Rate limited", description: "Please wait a moment and try again.", variant: "destructive" });
        throw new Error("Rate limited");
      }
      if (res.status === 402) {
        toast({ title: "Credits required", description: "Please add funds to continue using AI features.", variant: "destructive" });
        throw new Error("Payment required");
      }
      if (!res.ok) throw new Error("Failed to get response");

      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date(), isStreaming: true },
      ]);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let sseBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;

        while ((newlineIndex = sseBuffer.indexOf("\n")) !== -1) {
          let line = sseBuffer.slice(0, newlineIndex);
          sseBuffer = sseBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta.length > 0) {
              fullContent += delta;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: fullContent, isStreaming: true } : m
                )
              );
            }
          } catch {
            // Incomplete JSON — put back and wait for more
            sseBuffer = line + "\n" + sseBuffer;
            break;
          }
        }
      }

      // Final flush
      if (sseBuffer.trim()) {
        for (let raw of sseBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: fullContent, isStreaming: true } : m
                )
              );
            }
          } catch {}
        }
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m))
      );
    } catch {
      if (!messages[messages.length - 1]?.isStreaming) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading, settings, toast]);

  /* ─── File upload ─── */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const ext = file.name.split(".").pop() || "txt";
      setInput((prev) => `${prev}\n\nFile: ${file.name}\n\`\`\`${ext}\n${content}\n\`\`\``);
      inputRef.current?.focus();
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  /* ─── Export ─── */
  const exportChat = () => {
    const md = messages
      .filter((m) => m.id !== "greeting")
      .map(
        (m) =>
          `**${m.role === "user" ? "You" : "AI"}** (${m.timestamp.toLocaleTimeString()}):\n\n${m.content}`
      )
      .join("\n\n---\n\n");
    const blob = new Blob([`# Chat Export\n\n${md}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ─── Clear ─── */
  const clearChat = () => {
    const greeting: ChatMessage[] = [
      {
        id: "greeting",
        role: "assistant",
        content:
          "👋 Hey! I'm your **AI Training Assistant**.\n\nI can help you with:\n- 🎯 Interview preparation & mock questions\n- 💻 Coding challenges & explanations\n- 📝 Resume & career advice\n- 🧠 Learning strategies\n\nWhat would you like to work on?",
        timestamp: new Date(),
      },
    ];
    setMessages(greeting);
    localStorage.removeItem(STORAGE_KEY);
  };

  /* ─── Keyboard ─── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
  };

  /* ─── Render ─── */
  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto -mx-4 -my-6 bg-black">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center ring-1 ring-white/10">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white/90 flex items-center gap-2">
                AI Assistant
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-medium uppercase tracking-wider">
                  <Zap className="w-2.5 h-2.5" />
                  Live
                </span>
              </h1>
              <p className="text-[11px] text-white/30">
                {isLoading ? "Generating response..." : `${messages.length - 1} messages`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={exportChat}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Download transcript"
            >
              <Download className="w-4 h-4 text-white/30 hover:text-white/60" />
            </button>
            <button
              onClick={clearChat}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4 text-white/30 hover:text-white/60" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings ? "bg-white/10 text-cyan-400" : "hover:bg-white/5 text-white/30 hover:text-white/60"
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Settings Panel ── */}
        {showSettings && (
          <div className="border-b border-white/[0.06] bg-white/[0.01] backdrop-blur-xl max-h-[50vh] overflow-y-auto">
            <SettingsPanel settings={settings} onChange={setSettings} onClose={() => setShowSettings(false)} />
          </div>
        )}

        {/* ── Messages Area ── */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="absolute inset-0 overflow-y-auto px-5 py-6 space-y-6 scroll-smooth"
            style={{
              background:
                "radial-gradient(ellipse at 20% 0%, rgba(6, 182, 212, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(139, 92, 246, 0.04) 0%, transparent 50%)",
            }}
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* ── Scroll-to-bottom FAB ── */}
          {!isAtBottom && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/60 text-xs hover:bg-white/15 transition-all shadow-lg shadow-black/30 animate-fade-in"
            >
              <ArrowDown className="w-3 h-3" />
              New messages
            </button>
          )}
        </div>

        {/* ── Input Area ── */}
        <div className="border-t border-white/[0.06] p-4 bg-white/[0.02] backdrop-blur-xl flex-shrink-0">
          <div className="flex items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".js,.ts,.tsx,.jsx,.py,.html,.css,.json,.md,.txt,.csv,.xml,.yaml,.yml,.sql,.sh,.go,.rs,.java,.c,.cpp,.h,.rb,.php,.swift,.kt"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-white/25 hover:text-white/50 flex-shrink-0"
              title="Upload file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              className="flex-1 resize-none border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/90 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500/20 bg-white/[0.03] placeholder:text-white/20 transition-all max-h-[180px] backdrop-blur-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-xl hover:opacity-90 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0 shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between px-1">
            <button
              onClick={() => setShowSettings(true)}
              className="text-[11px] text-white/20 hover:text-white/40 transition-colors flex items-center gap-1"
            >
              <span>
                {settings.personality === "professional" && "💼"}
                {settings.personality === "friendly" && "😊"}
                {settings.personality === "teacher" && "📚"}
                {settings.personality === "code-expert" && "💻"}
              </span>
              {settings.personality.charAt(0).toUpperCase() + settings.personality.slice(1)}
              {settings.temperature !== undefined && ` · T:${settings.temperature.toFixed(1)}`}
            </button>
            <span className="text-[11px] text-white/15">Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
