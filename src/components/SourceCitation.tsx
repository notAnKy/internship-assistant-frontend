import { FileText, Briefcase } from "lucide-react";
import type { SourceInfo } from "../types";

interface SourceCitationProps {
  source: SourceInfo;
  index: number;
}

export default function SourceCitation({ source, index }: SourceCitationProps) {
  const isCV = source.doc_type === "cv";
  const Icon = isCV ? FileText : Briefcase;
  const typeLabel = isCV ? "CV" : "Job Description";
  const typeColor = isCV
    ? "bg-brand-50 text-brand-700"
    : "bg-success-50 text-success-700";

  // Convert score (0-1) to percentage
  const matchPct = Math.round(source.score * 100);

  return (
    <div className="p-4 rounded-xl bg-card border border-default hover:border-strong transition-all">
      <div className="flex items-start gap-3">
        {/* Index badge */}
        <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center text-sm font-bold shrink-0">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header: type + page + score */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Icon className="w-3.5 h-3.5 text-muted" />
            <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${typeColor}`}>
              {typeLabel}
            </span>
            <span className="text-xs text-muted">•</span>
            <span className="text-xs text-muted">Page {source.page}</span>
            <span className="text-xs text-muted">•</span>
            <span className="text-xs text-muted">{matchPct}% relevant</span>
          </div>

          {/* Filename */}
          <p className="text-sm font-medium text-primary truncate mb-1.5">
            {source.filename}
          </p>

          {/* Preview */}
          <p className="text-xs text-muted leading-relaxed line-clamp-3">
            {source.preview}
          </p>
        </div>
      </div>
    </div>
  );
}