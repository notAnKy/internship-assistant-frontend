import { useState } from "react";
import { Bot, User, ChevronDown, BookOpen } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import SourceCitation from "./SourceCitation";
import type { ChatMessage as ChatMessageType } from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [showSources, setShowSources] = useState(false);
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex gap-3 justify-end animate-fadeIn">
        <div className="max-w-[80%] bg-brand-500 text-white rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex gap-3 animate-fadeIn">
      <div className="w-9 h-9 rounded-xl bg-accent-500 text-white flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="flex-1 max-w-[85%]">
        <div className="bg-card border border-default rounded-2xl rounded-tl-sm px-4 py-3">
          <MarkdownRenderer content={message.content} />
        </div>

        {/* Sources toggle */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-all px-2 py-1 rounded-md hover:bg-subtle"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{message.sources.length} source{message.sources.length !== 1 ? "s" : ""}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showSources ? "rotate-180" : ""}`}
              />
            </button>

            {showSources && (
              <div className="mt-2 space-y-2 animate-fadeIn">
                {message.sources.map((source, idx) => (
                  <SourceCitation key={idx} source={source} index={idx} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}