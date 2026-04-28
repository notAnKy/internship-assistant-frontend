// Document types
export type DocType = "cv" | "job_description";

export interface DocumentInfo {
  doc_id: string;
  filename: string;
  doc_type: DocType;
  num_chunks: number;
}

export interface UploadResponse {
  doc_id: string;
  filename: string;
  doc_type: DocType;
  num_chunks: number;
  num_pages: number;
}

// Chat types
export interface ChatRequest {
  question: string;
  top_k?: number;
  doc_ids?: string[];
}

export interface SourceInfo {
  filename: string;
  doc_type: DocType;
  page: number;
  score: number;
  preview: string;
}

export interface ChatResponse {
  question: string;
  answer: string;
  sources: SourceInfo[];
}

// Analysis types
export interface AnalyzeRequest {
  top_k?: number;
  doc_ids?: string[];
}

export interface AnalyzeResponse {
  answer: string;
  sources: SourceInfo[];
}

// Chat message (frontend-only — for the chat UI)
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceInfo[];
  timestamp: number;
}