import { useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  loading = false,
  placeholder = "Ask anything about your CV or the job...",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !loading) {
        onSend();
      }
    }
  };

  const canSend = value.trim().length > 0 && !loading && !disabled;

  return (
    <div className="bg-card border border-default rounded-2xl p-2 flex items-end gap-2 focus-within:border-brand-500 transition-all">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none bg-transparent px-3 py-2 text-primary placeholder:text-muted focus:outline-none disabled:opacity-50 leading-6"
        style={{ maxHeight: "160px" }}
      />
      <button
        onClick={onSend}
        disabled={!canSend}
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
          canSend
            ? "bg-brand-500 hover:bg-brand-600 text-white"
            : "bg-subtle text-muted cursor-not-allowed"
        }`}
        title="Send (Enter)"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}