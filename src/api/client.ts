import axios from "axios";
import type {
  DocumentInfo,
  UploadResponse,
  ChatRequest,
  ChatResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  DocType,
} from "../types";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== Documents =====

export async function uploadDocument(
  file: File,
  docType: DocType
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("doc_type", docType);

  const response = await api.post<UploadResponse>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function getDocuments(): Promise<DocumentInfo[]> {
  const response = await api.get<DocumentInfo[]>("/documents");
  return response.data;
}

export async function deleteDocument(docId: string): Promise<void> {
  await api.delete(`/documents/${docId}`);
}

// ===== Chat =====

export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const response = await api.post<ChatResponse>("/chat", req);
  return response.data;
}

// ===== Analysis =====

export async function analyzeCv(req: AnalyzeRequest = {}): Promise<AnalyzeResponse> {
  const response = await api.post<AnalyzeResponse>("/analyze/cv", req);
  return response.data;
}

export async function analyzeSkillGap(req: AnalyzeRequest = {}): Promise<AnalyzeResponse> {
  const response = await api.post<AnalyzeResponse>("/analyze/skill-gap", req);
  return response.data;
}

export async function analyzeInterview(req: AnalyzeRequest = {}): Promise<AnalyzeResponse> {
  const response = await api.post<AnalyzeResponse>("/analyze/interview", req);
  return response.data;
}

// ===== Health =====

export async function checkHealth(): Promise<{ service: string; status: string }> {
  const response = await api.get("/");
  return response.data;
}

export default api;