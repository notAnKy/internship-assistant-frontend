import { ArrowRight, Loader2, Lock } from "lucide-react";
import type { ReactNode } from "react";

interface AnalysisCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  disabled?: boolean;
  disabledReason?: string;
  loading?: boolean;
  onClick: () => void;
}

export default function AnalysisCard({
  title,
  description,
  icon,
  iconBg,
  iconColor,
  disabled = false,
  disabledReason = "",
  loading = false,
  onClick,
}: AnalysisCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`group relative text-left p-6 rounded-2xl border transition-all w-full ${
        disabled
          ? "bg-subtle border-default cursor-not-allowed opacity-60"
          : "bg-card border-default hover:border-brand-500 hover:shadow-lg hover:scale-[1.01] cursor-pointer"
      }`}
    >
      {/* Lock badge if disabled */}
      {disabled && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-muted bg-card px-2 py-1 rounded-md border border-default">
          <Lock className="w-3 h-3" />
          <span>Locked</span>
        </div>
      )}

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBg} ${iconColor}`}
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : icon}
      </div>

      {/* Title + description */}
      <h3 className="text-lg font-bold text-primary mb-1.5">{title}</h3>
      <p className="text-sm text-secondary mb-4 leading-relaxed">
        {disabled ? disabledReason : description}
      </p>

      {/* Action indicator */}
      {!disabled && (
        <div className="flex items-center gap-1.5 text-sm font-medium text-brand-600 group-hover:gap-2.5 transition-all">
          <span>{loading ? "Analyzing..." : "Run analysis"}</span>
          {!loading && <ArrowRight className="w-4 h-4" />}
        </div>
      )}
    </button>
  );
}