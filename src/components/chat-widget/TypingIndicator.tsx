import React from "react";
import { Bot } from "lucide-react";

const TypingIndicator: React.FC = () => (
  <div className="flex gap-3 animate-fade-in">
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-violet-300 ring-1 ring-white/10">
      <Bot className="w-4 h-4" />
    </div>
    <div className="bg-white/[0.04] backdrop-blur-sm px-5 py-3 rounded-2xl rounded-tl-md border border-white/[0.06]">
      <div className="flex gap-1.5 items-center">
        <span className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  </div>
);

export default TypingIndicator;
