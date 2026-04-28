import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Briefcase, Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import FileUpload from "../components/FileUpload";
import DocumentCard from "../components/DocumentCard";
import ConfirmDialog from "../components/ConfirmDialog";
import { uploadDocument, getDocuments, deleteDocument } from "../api/client";
import type { DocumentInfo, DocType } from "../types";

export default function Home() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Confirm dialog state
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    variant: "default" | "danger";
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    variant: "default",
    onConfirm: () => {},
  });

  const closeConfirm = () =>
    setConfirmState({
      open: false,
      title: "",
      message: "",
      confirmLabel: "Confirm",
      variant: "default",
      onConfirm: () => {},
    });

  const loadDocuments = async () => {
    try {
      setError("");
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err: any) {
      setError("Could not connect to the backend. Is it running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // Helper that wraps the browser confirm in our custom dialog (returns a Promise<boolean>)
  const askConfirm = (
    title: string,
    message: string,
    options: { confirmLabel?: string; variant?: "default" | "danger" } = {}
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        open: true,
        title,
        message,
        confirmLabel: options.confirmLabel || "Confirm",
        variant: options.variant || "default",
        onConfirm: () => {
          closeConfirm();
          resolve(true);
        },
      });
      (window as any).__cancelConfirm = () => {
        closeConfirm();
        resolve(false);
      };
    });
  };

  const handleUpload = async (file: File, docType: DocType) => {
    // Check if a document of this type already exists
    const existing = documents.find((d) => d.doc_type === docType);

    if (existing) {
      const typeLabel = docType === "cv" ? "CV" : "job description";
      const confirmed = await askConfirm(
        `Replace existing ${typeLabel}?`,
        `You already have "${existing.filename}" uploaded.\n\nDo you want to replace it with "${file.name}"?`,
        { confirmLabel: "Replace", variant: "default" }
      );
      if (!confirmed) {
        throw new Error("Upload cancelled by user.");
      }
      // Delete the old one first
      await deleteDocument(existing.doc_id);
    }

    // Upload the new one
    await uploadDocument(file, docType);
    await loadDocuments();
  };

  const handleDelete = async (docId: string) => {
    const doc = documents.find((d) => d.doc_id === docId);
    const confirmed = await askConfirm(
      "Delete document?",
      `Are you sure you want to delete "${doc?.filename}"?\n\nThis action cannot be undone.`,
      { confirmLabel: "Delete", variant: "danger" }
    );
    if (!confirmed) return;

    await deleteDocument(docId);
    await loadDocuments();
  };

  const hasCv = documents.some((d) => d.doc_type === "cv");
  const hasJob = documents.some((d) => d.doc_type === "job_description");
  const isReady = hasCv && hasJob;

  return (
    <div className="px-6 py-12">
      {/* Hero section */}
      <div className="text-center mb-12 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>AI-powered career assistant</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 tracking-tight">
          Land your dream <span className="text-brand-600">internship</span>
        </h1>
        <p className="text-lg text-secondary max-w-2xl mx-auto">
          Upload your CV and the job description. Get personalized analysis,
          skill gap insights, and interview prep — all grounded in YOUR documents.
        </p>
      </div>

      {/* Upload zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <FileUpload
          docType="cv"
          title="Upload your CV"
          description="Your resume in PDF format"
          icon={<FileText className="w-7 h-7" />}
          onUpload={handleUpload}
          isUploaded={hasCv}
        />
        <FileUpload
          docType="job_description"
          title="Upload job description"
          description="The role you're applying for"
          icon={<Briefcase className="w-7 h-7" />}
          onUpload={handleUpload}
          isUploaded={hasJob}
        />
      </div>

      {/* CTA when both uploaded */}
      {isReady && (
        <div className="mb-10 animate-fadeIn">
          <Link
            to="/analysis"
            className="block bg-brand-500 hover:bg-brand-600 text-white rounded-2xl p-6 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white opacity-80 mb-1">
                  ✨ You're all set
                </p>
                <p className="text-xl font-bold">Start your analysis</p>
              </div>
              <ArrowRight className="w-6 h-6" />
            </div>
          </Link>
        </div>
      )}

      {/* Documents list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary">Your documents</h2>
          <button
            onClick={loadDocuments}
            disabled={loading}
            className="p-2 rounded-lg text-muted hover:text-primary hover:bg-subtle transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-danger-50 text-danger-700 text-sm mb-4">
            {error}
          </div>
        )}

        {loading && documents.length === 0 ? (
          <div className="text-center py-12 text-muted">Loading...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-subtle">
            <FileText className="w-10 h-10 mx-auto text-muted mb-3" />
            <p className="text-secondary font-medium">No documents yet</p>
            <p className="text-sm text-muted mt-1">
              Upload a CV or job description to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <DocumentCard key={doc.doc_id} doc={doc} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        variant={confirmState.variant}
        cancelLabel="Cancel"
        onConfirm={confirmState.onConfirm}
        onCancel={() => {
          closeConfirm();
          (window as any).__cancelConfirm?.();
        }}
      />
    </div>
  );
}