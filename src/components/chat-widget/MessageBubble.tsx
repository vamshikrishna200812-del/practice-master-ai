import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import { ChatMessage } from "./types";
import { Bot, User, Copy, Check } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`group flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fade-in`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ring-1 ring-white/10 ${
          isUser
            ? "bg-cyan-500/20 text-cyan-400"
            : "bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-violet-300"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className="relative max-w-[80%]">
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-cyan-500/15 text-white/90 rounded-tr-md border border-cyan-500/20 backdrop-blur-sm"
              : "bg-white/[0.04] text-white/85 rounded-tl-md border border-white/[0.06] backdrop-blur-sm"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-headings:my-2 prose-headings:text-white/90 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:my-0 prose-pre:p-0 prose-pre:bg-transparent prose-strong:text-white/90 prose-a:text-cyan-400 prose-code:text-cyan-300">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");

                    if (match || codeString.includes("\n")) {
                      return <CodeBlock language={match?.[1]}>{codeString}</CodeBlock>;
                    }
                    return (
                      <code className="px-1.5 py-0.5 bg-white/10 text-cyan-300 rounded text-xs font-mono border border-white/5" {...props}>
                        {children}
                      </code>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-2 rounded-lg border border-white/10">
                        <table className="min-w-full text-xs">{children}</table>
                      </div>
                    );
                  },
                  th({ children }) {
                    return <th className="px-3 py-2 bg-white/5 text-left text-white/70 font-medium border-b border-white/10">{children}</th>;
                  },
                  td({ children }) {
                    return <td className="px-3 py-2 border-b border-white/5 text-white/60">{children}</td>;
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-1.5 h-4 bg-cyan-400/80 animate-pulse ml-0.5 align-text-bottom rounded-sm" />
              )}
            </div>
          )}
        </div>

        {/* Copy button - shown on hover for assistant messages */}
        {!isUser && !message.isStreaming && message.content && (
          <button
            onClick={handleCopy}
            className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] text-white/30 hover:text-white/60"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
