import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  AlertTriangle,
  MessageCircle,
  BookOpen,
  Sparkles,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import AnalysisCard from "../components/AnalysisCard";
import MarkdownRenderer from "../components/MarkdownRenderer";
import SourceCitation from "../components/SourceCitation";
import {
  getDocuments,
  analyzeCv,
  analyzeSkillGap,
  analyzeInterview,
} from "../api/client";
import type { DocumentInfo, AnalyzeResponse } from "../types";

type AnalysisType = "cv" | "skill-gap" | "interview";

export default function Analysis() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisType | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [resultType, setResultType] = useState<AnalysisType | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hasCv = documents.some((d) => d.doc_type === "cv");
  const hasJob = documents.some((d) => d.doc_type === "job_description");

  const runAnalysis = async (type: AnalysisType) => {
    setActiveAnalysis(type);
    setError("");
    setResult(null);

    try {
      let response: AnalyzeResponse;
      if (type === "cv") {
        response = await analyzeCv({ top_k: 8 });
      } else if (type === "skill-gap") {
        response = await analyzeSkillGap({ top_k: 8 });
      } else {
        response = await analyzeInterview({ top_k: 8 });
      }
      setResult(response);
      setResultType(type);
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById("analysis-result")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Analysis failed.";
      setError(msg);
    } finally {
      setActiveAnalysis(null);
    }
  };

  const getResultTitle = () => {
    if (resultType === "cv") return "CV Analysis";
    if (resultType === "skill-gap") return "Skill Gap Analysis";
    if (resultType === "interview") return "Interview Preparation";
    return "Analysis";
  };

  // No documents at all
  if (!loading && documents.length === 0) {
    return (
      <div className="px-6 py-20 text-center">
        <BookOpen className="w-16 h-16 mx-auto text-muted mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">No documents yet</h2>
        <p className="text-secondary mb-6">
          Upload at least a CV to start analyzing.
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
    <div className="px-6 py-12">
      {/* Header */}
      <div className="mb-10 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500 bg-opacity-10 text-accent-600 text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4" />
          <span>AI-powered analysis</span>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-3">
          Analyze your application
        </h1>
        <p className="text-lg text-secondary">
          Pick an analysis below. Each one runs the AI on your documents and
          returns insights with source citations.
        </p>
      </div>

      {/* Status banner */}
      <div className="mb-8 p-4 rounded-xl bg-subtle border border-default">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${hasCv ? "bg-success-500" : "bg-warning-500"}`}
            ></span>
            <span className="text-secondary">
              CV: <span className="font-semibold text-primary">{hasCv ? "Uploaded" : "Missing"}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${hasJob ? "bg-success-500" : "bg-warning-500"}`}
            ></span>
            <span className="text-secondary">
              Job description:{" "}
              <span className="font-semibold text-primary">
                {hasJob ? "Uploaded" : "Missing"}
              </span>
            </span>
          </div>
          {(!hasCv || !hasJob) && (
            <Link
              to="/"
              className="ml-auto text-brand-600 hover:underline font-medium"
            >
              Upload missing documents →
            </Link>
          )}
        </div>
      </div>

      {/* Analysis cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <AnalysisCard
          title="CV Analysis"
          description="Strengths, weaknesses, and concrete recommendations to improve your CV."
          icon={<Target className="w-6 h-6" />}
          iconBg="bg-brand-50"
          iconColor="text-brand-600"
          disabled={!hasCv}
          disabledReason="Upload a CV to unlock this analysis."
          loading={activeAnalysis === "cv"}
          onClick={() => runAnalysis("cv")}
        />
        <AnalysisCard
          title="Skill Gap"
          description="Compare your CV against the job description. See match score, gaps, and an action plan."
          icon={<AlertTriangle className="w-6 h-6" />}
          iconBg="bg-warning-50"
          iconColor="text-warning-700"
          disabled={!hasCv || !hasJob}
          disabledReason={
            !hasCv && !hasJob
              ? "Upload a CV and job description first."
              : !hasCv
                ? "Upload a CV first."
                : "Upload a job description first."
          }
          loading={activeAnalysis === "skill-gap"}
          onClick={() => runAnalysis("skill-gap")}
        />
        <AnalysisCard
          title="Interview Prep"
          description="Likely interview questions, talking points, and tricky questions to expect."
          icon={<MessageCircle className="w-6 h-6" />}
          iconBg="bg-accent-500 bg-opacity-10"
          iconColor="text-accent-600"
          disabled={!hasCv && !hasJob}
          disabledReason="Upload at least a CV or job description."
          loading={activeAnalysis === "interview"}
          onClick={() => runAnalysis("interview")}
        />
      </div>

      {/* Loading state */}
      {activeAnalysis && (
        <div className="p-8 rounded-2xl bg-card border border-default text-center animate-fadeIn">
          <div className="mx-auto w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-3 animate-pulseGlow">
            <Sparkles className="w-6 h-6 text-brand-600" />
          </div>
          <p className="text-primary font-semibold">AI is analyzing your documents...</p>
          <p className="text-sm text-muted mt-1">This usually takes 5-15 seconds.</p>
        </div>
      )}

      {/* Error state */}
      {error && !activeAnalysis && (
        <div className="p-4 rounded-xl bg-danger-50 text-danger-700 mb-6 animate-fadeIn">
          <p className="font-semibold mb-1">Analysis failed</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && !activeAnalysis && (
        <div id="analysis-result" className="animate-fadeIn">
          <div className="bg-card rounded-2xl border border-default p-6 sm:p-8 mb-6">
            {/* Result header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-default">
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
                  Result
                </p>
                <h2 className="text-2xl font-bold text-primary">{getResultTitle()}</h2>
              </div>
              <button
                onClick={() => resultType && runAnalysis(resultType)}
                className="p-2 rounded-lg text-muted hover:text-primary hover:bg-subtle transition-all"
                title="Re-run analysis"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Markdown content */}
            <MarkdownRenderer content={result.answer} />
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-muted" />
                Sources ({result.sources.length})
              </h3>
              <p className="text-sm text-muted mb-4">
                These are the chunks from your documents the AI used to generate this analysis.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sources.map((source, idx) => (
                  <SourceCitation key={idx} source={source} index={idx} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}