import { FileText, Briefcase, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import type { DocumentInfo } from "../types";

interface DocumentCardProps {
  doc: DocumentInfo;
  onDelete: (docId: string) => Promise<void>;
}

export default function DocumentCard({ doc, onDelete }: DocumentCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
        await onDelete(doc.doc_id);
    } catch (err) {
        console.error(err);
        setDeleting(false);
    }
    };

  const isCV = doc.doc_type === "cv";
  const Icon = isCV ? FileText : Briefcase;
  const typeLabel = isCV ? "CV / Resume" : "Job Description";
  const typeColor = isCV
    ? "bg-brand-50 text-brand-700"
    : "bg-success-50 text-success-700";

  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-default hover:border-strong transition-all">
      {/* Icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${typeColor}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-primary truncate">{doc.filename}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${typeColor}`}>
            {typeLabel}
          </span>
          <span className="text-xs text-muted">
            {doc.num_chunks} chunk{doc.num_chunks !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-2 rounded-lg text-muted hover:text-danger-500 hover:bg-danger-50 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-100"
        title="Delete document"
      >
        {deleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}