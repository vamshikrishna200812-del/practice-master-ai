import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Settings, Trash2, Download, Paperclip, Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import SettingsPanel from "./SettingsPanel";
import { ChatMessage, ChatWidgetConfig, ChatWidgetSettings } from "./types";

const DEFAULT_GREETING = "Hi! I'm your AI assistant. How can I help you today?";

const ChatWidget: React.FC<ChatWidgetConfig> = ({
  onSendMessage,
  greeting = DEFAULT_GREETING,
  title = "AI Assistant",
  position = "bottom-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [greeting]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

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

    // Auto-resize textarea back
    if (inputRef.current) inputRef.current.style.height = "auto";

    try {
      if (onSendMessage) {
        const result = await onSendMessage(updatedMessages, settings);

        if (typeof result === "string") {
          // Instant response
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "assistant", content: result, timestamp: new Date() },
          ]);
        } else if (result && typeof result.getReader === "function") {
          // Streaming response
          const assistantId = crypto.randomUUID();
          setMessages((prev) => [
            ...prev,
            { id: assistantId, role: "assistant", content: "", timestamp: new Date(), isStreaming: true },
          ]);

          const reader = result.getReader();
          const decoder = new TextDecoder();
          let fullContent = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            // Parse SSE format
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
                    prev.map((m) =>
                      m.id === assistantId ? { ...m, content: fullContent, isStreaming: true } : m
                    )
                  );
                } catch {
                  // Not JSON, treat as plain text
                  fullContent += data;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId ? { ...m, content: fullContent, isStreaming: true } : m
                    )
                  );
                }
              }
            }
          }

          // Mark streaming done
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, isStreaming: false } : m
            )
          );
        }
      } else {
        // Demo mode - simulate response
        await new Promise((r) => setTimeout(r, 1000));
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `This is a demo response. Connect your API using the \`onSendMessage\` callback to get real AI responses.\n\n\`\`\`javascript\n<ChatWidget\n  onSendMessage={async (messages, settings) => {\n    // Call your OpenAI API here\n    return response.body; // Return stream\n  }}\n/>\n\`\`\``,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading, settings, onSendMessage]);

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
      { id: "greeting", role: "assistant", content: greeting, timestamp: new Date() },
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
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const positionClass = position === "bottom-left" ? "left-5" : "right-5";

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-5 ${positionClass} z-[9999] w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 group`}
        >
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-5 ${positionClass} z-[9999] w-[380px] max-w-[calc(100vw-40px)] h-[600px] max-h-[calc(100vh-40px)] bg-white rounded-2xl shadow-2xl shadow-black/15 flex flex-col overflow-hidden border border-gray-200/60`}
          style={{
            animation: "slideUpFadeIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{title}</h3>
                <p className="text-blue-100 text-xs">
                  {isLoading ? "Thinking..." : "Online"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={exportChat}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Export chat"
              >
                <Download className="w-4 h-4 text-white/80" />
              </button>
              <button
                onClick={clearChat}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4 text-white/80" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-colors ${showSettings ? "bg-white/20" : "hover:bg-white/10"}`}
                title="Settings"
              >
                <Settings className="w-4 h-4 text-white/80" />
              </button>
              <button
                onClick={() => { setIsOpen(false); setShowSettings(false); }}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </div>

          {/* Settings Panel (overlay) */}
          {showSettings && (
            <SettingsPanel
              settings={settings}
              onChange={setSettings}
              onClose={() => setShowSettings(false)}
            />
          )}

          {/* Messages */}
          {!showSettings && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <TypingIndicator />
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-3 bg-white flex-shrink-0">
                <div className="flex items-end gap-2">
                  {/* File upload */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".js,.ts,.tsx,.jsx,.py,.html,.css,.json,.md,.txt,.csv,.xml,.yaml,.yml,.sql,.sh,.go,.rs,.java,.c,.cpp,.h,.rb,.php,.swift,.kt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
                    title="Upload code file"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Textarea */}
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleTextareaInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 placeholder:text-gray-400 transition-all max-h-[120px]"
                  />

                  {/* Send */}
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Personality badge */}
                <div className="mt-2 flex items-center justify-between">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                  >
                    <span>
                      {settings.personality === "professional" && "💼"}
                      {settings.personality === "friendly" && "😊"}
                      {settings.personality === "teacher" && "📚"}
                      {settings.personality === "code-expert" && "💻"}
                    </span>
                    {settings.personality.charAt(0).toUpperCase() + settings.personality.slice(1)} mode
                  </button>
                  <span className="text-[11px] text-gray-300">Shift+Enter for new line</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes slideUpFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
