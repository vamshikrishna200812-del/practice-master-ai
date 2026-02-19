import React from "react";
import { Bot } from "lucide-react";

const TypingIndicator: React.FC = () => (
  <div className="flex gap-2.5 animate-fade-in">
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <Bot className="w-4 h-4" />
    </div>
    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-md">
      <div className="flex gap-1.5 items-center">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  </div>
);

export default TypingIndicator;
