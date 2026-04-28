import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Trash2, Bot, FileText, ArrowLeft, MessageSquareText } from "lucide-react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import ConfirmDialog from "../components/ConfirmDialog";
import { sendChatMessage, getDocuments } from "../api/client";
import type { ChatMessage as ChatMessageType, DocumentInfo } from "../types";

const SUGGESTED_QUESTIONS = [
  "What are my strongest skills based on my CV?",
  "How well does my profile match the job description?",
  "What experience should I highlight in my application?",
  "What are the main weaknesses of my CV?",
];

export default function Chat() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>("");
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setDocsLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || sending) return;

    setError("");
    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const response = await sendChatMessage({
        question: text.trim(),
        top_k: 5,
      });

      const assistantMsg: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.answer,
        sources: response.sources,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to get response.";
      setError(msg);
      // Remove the user message since we couldn't process it
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setInput(text); // Restore the input so the user doesn't lose it
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const clearChat = () => {
    setMessages([]);
    setError("");
    setConfirmClearOpen(false);
  };

  const hasDocuments = documents.length > 0;

  // Empty state — no documents at all
  if (!docsLoading && !hasDocuments) {
    return (
      <div className="px-6 py-20 text-center">
        <FileText className="w-16 h-16 mx-auto text-muted mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">No documents yet</h2>
        <p className="text-secondary mb-6">
          Upload at least a CV to start chatting with the AI.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to documents</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 flex flex-col" style={{ minHeight: "calc(100vh - 4rem)" }}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500 bg-opacity-10 text-accent-600 text-xs font-medium mb-2">
            <Sparkles className="w-3 h-3" />
            <span>AI chat</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Ask anything</h1>
          <p className="text-sm text-secondary mt-0.5">
            The AI will only answer questions related to your CV, the job, or career advice.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => setConfirmClearOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:text-danger-700 hover:bg-danger-50 border border-default transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear chat</span>
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          // Welcome state
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent-500 bg-opacity-10 text-accent-600 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              How can I help?
            </h3>
            <p className="text-secondary mb-8 max-w-md">
              Ask questions about your CV, the job description, or get career
              advice. I'll cite the exact sources in my answers.
            </p>

            {/* Suggested questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl w-full">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
                  className="text-left p-3 rounded-xl border border-default hover:border-brand-500 hover:bg-brand-50 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <MessageSquareText className="w-4 h-4 text-muted group-hover:text-brand-600 mt-0.5 shrink-0 transition-colors" />
                    <span className="text-sm text-secondary group-hover:text-brand-700 transition-colors">
                      {q}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {sending && (
              <div className="flex gap-3 animate-fadeIn">
                <div className="w-9 h-9 rounded-xl bg-accent-500 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-card border border-default rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 p-3 rounded-xl bg-danger-50 text-danger-700 text-sm animate-fadeIn">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 bg-page py-2">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          loading={sending}
          placeholder="Ask about your CV or the job..."
        />
        <p className="text-xs text-muted mt-2 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-subtle rounded text-xs font-medium">Enter</kbd> to send,{" "}
          <kbd className="px-1.5 py-0.5 bg-subtle rounded text-xs font-medium">Shift+Enter</kbd> for new line
        </p>
      </div>

      {/* Clear chat confirmation */}
      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear chat history?"
        message="This will delete all messages in this conversation. Your documents won't be affected."
        confirmLabel="Clear"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={clearChat}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}