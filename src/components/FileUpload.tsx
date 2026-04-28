import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import type { DocType } from "../types";

interface FileUploadProps {
  docType: DocType;
  title: string;
  description: string;
  icon: React.ReactNode;
  onUpload: (file: File, docType: DocType) => Promise<void>;
  isUploaded: boolean;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export default function FileUpload({
  docType,
  title,
  description,
  icon,
  onUpload,
  isUploaded,
}: FileUploadProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
        setErrorMsg("Only PDF files are accepted.");
        setState("error");
        return;
    }

    setFilename(file.name);
    setState("uploading");
    setErrorMsg("");

    try {
        await onUpload(file, docType);
        setState("success");
        setTimeout(() => setState("idle"), 2000);
    } catch (err: any) {
        // If user cancelled the replace prompt, silently return to idle
        if (err?.message === "Upload cancelled by user.") {
        setState("idle");
        return;
        }
        const msg = err?.response?.data?.detail || err?.message || "Upload failed.";
        setErrorMsg(msg);
        setState("error");
    }
    };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const openFilePicker = () => inputRef.current?.click();

  // Border + bg classes based on state
  const getBoxStyles = () => {
    if (state === "success" || isUploaded) {
      return "border-2 border-success-500 bg-success-50";
    }
    if (state === "error") {
      return "border-2 border-danger-500 bg-danger-50";
    }
    if (dragActive) {
      return "border-2 border-brand-500 bg-brand-50 scale-[1.02]";
    }
    return "border-2 border-dashed border-strong bg-card hover:border-brand-500 hover:bg-brand-50";
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={state === "idle" ? openFilePicker : undefined}
      className={`relative rounded-2xl p-8 transition-all duration-300 ${getBoxStyles()} ${
        state === "idle" ? "cursor-pointer" : ""
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="flex flex-col items-center text-center gap-3">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600">
          {state === "uploading" ? (
            <Loader2 className="w-7 h-7 animate-spin" />
          ) : state === "success" || isUploaded ? (
            <CheckCircle2 className="w-7 h-7 text-success-500" />
          ) : state === "error" ? (
            <AlertCircle className="w-7 h-7 text-danger-500" />
          ) : (
            icon
          )}
        </div>

        {/* Title + description */}
        <div>
          <h3 className="font-bold text-lg text-primary mb-1">{title}</h3>
          <p className="text-sm text-muted">{description}</p>
        </div>

        {/* State-specific content */}
        {state === "idle" && !isUploaded && (
          <div className="mt-2 flex items-center gap-2 text-sm text-brand-600 font-medium">
            <Upload className="w-4 h-4" />
            <span>Click or drag a PDF here</span>
          </div>
        )}

        {state === "uploading" && (
          <div className="mt-2 text-sm text-muted">
            Uploading <span className="font-medium text-primary">{filename}</span>...
          </div>
        )}

        {state === "success" && (
          <div className="mt-2 text-sm text-success-700 font-medium animate-fadeIn">
            ✓ Upload successful!
          </div>
        )}

        {isUploaded && state === "idle" && (
          <div className="mt-2 flex items-center gap-2 text-sm text-success-700 font-medium">
            <FileText className="w-4 h-4" />
            <span>Document uploaded</span>
          </div>
        )}

        {state === "error" && (
          <div className="mt-2 max-w-sm animate-fadeIn">
            <p className="text-sm text-danger-700 font-medium mb-2">{errorMsg}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setState("idle");
                setErrorMsg("");
              }}
              className="text-xs text-brand-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}