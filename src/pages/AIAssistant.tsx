import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, Sparkles, Trash2, Download, Settings } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MessageBubble from "@/components/chat-widget/MessageBubble";
import TypingIndicator from "@/components/chat-widget/TypingIndicator";
import SettingsPanel from "@/components/chat-widget/SettingsPanel";
import { ChatMessage, ChatWidgetSettings } from "@/components/chat-widget/types";

const AIAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "greeting",
      role: "assistant",
      content: "👋 Hi! I'm your AI Training Assistant. Ask me anything about interview prep, coding challenges, career advice, or get help with your learning journey!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ChatWidgetSettings>({
    personality: "professional",
    language: "en",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    setIsLoading(true);

    if (inputRef.current) inputRef.current.style.height = "auto";

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-widget`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
            settings,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to get response");

      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date(), isStreaming: true },
      ]);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              fullContent += delta;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: fullContent, isStreaming: true } : m))
              );
            } catch {
              fullContent += data;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: fullContent, isStreaming: true } : m))
              );
            }
          }
        }
      }

      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m)));
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Sorry, something went wrong. Please try again.", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading, settings]);

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

  const exportChat = () => {
    const md = messages
      .filter((m) => m.id !== "greeting")
      .map((m) => `**${m.role === "user" ? "You" : "AI"}** (${m.timestamp.toLocaleTimeString()}):\n\n${m.content}`)
      .join("\n\n---\n\n");
    const blob = new Blob([`# Chat Export\n\n${md}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    setMessages([
      { id: "greeting", role: "assistant", content: "👋 Hi! I'm your AI Training Assistant. Ask me anything!", timestamp: new Date() },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Assistant</h1>
              <p className="text-xs text-muted-foreground">{isLoading ? "Thinking..." : "Online"}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={exportChat} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Export chat">
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={clearChat} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Clear chat">
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${showSettings ? "bg-muted" : "hover:bg-muted"}`}
              title="Settings"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && <SettingsPanel settings={settings} onChange={setSettings} onClose={() => setShowSettings(false)} />}

        {/* Messages */}
        {!showSettings && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 bg-card rounded-b-xl">
              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".js,.ts,.tsx,.jsx,.py,.html,.css,.json,.md,.txt,.csv,.xml,.yaml,.yml,.sql,.sh,.go,.rs,.java,.c,.cpp,.h,.rb,.php,.swift,.kt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground" title="Upload file">
                  <Paperclip className="w-4 h-4" />
                </button>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 resize-none border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background placeholder:text-muted-foreground transition-all max-h-[160px]"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <button onClick={() => setShowSettings(true)} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <span>
                    {settings.personality === "professional" && "💼"}
                    {settings.personality === "friendly" && "😊"}
                    {settings.personality === "teacher" && "📚"}
                    {settings.personality === "code-expert" && "💻"}
                  </span>
                  {settings.personality.charAt(0).toUpperCase() + settings.personality.slice(1)} mode
                </button>
                <span className="text-[11px] text-muted-foreground/50">Shift+Enter for new line</span>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
