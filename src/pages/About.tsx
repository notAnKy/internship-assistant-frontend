import {
  Sparkles,
  Upload,
  Search,
  Bot,
  Quote,
  Shield,
  Zap,
  Database,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const ragSteps = [
  {
    number: 1,
    icon: Upload,
    title: "Upload",
    description:
      "Your CV and the job description are uploaded as PDFs. The system parses each page into text.",
    color: "bg-brand-50 text-brand-700",
  },
  {
    number: 2,
    icon: Database,
    title: "Embed",
    description:
      "Text is split into small chunks. Each chunk is converted into a vector (mathematical representation) and stored in a vector database.",
    color: "bg-accent-500 bg-opacity-10 text-accent-600",
  },
  {
    number: 3,
    icon: Search,
    title: "Retrieve",
    description:
      "When you ask a question, the system finds the most relevant chunks using semantic similarity — not just keyword matching.",
    color: "bg-warning-50 text-warning-700",
  },
  {
    number: 4,
    icon: Bot,
    title: "Generate",
    description:
      "The relevant chunks + your question are sent to an LLM. The AI generates an answer grounded in YOUR documents, with source citations.",
    color: "bg-success-50 text-success-700",
  },
];

const features = [
  {
    icon: Quote,
    title: "Source citations",
    description:
      "Every answer points back to the exact page in your document. No hallucinations — verify everything.",
  },
  {
    icon: Shield,
    title: "3-layer protection",
    description:
      "Upload validation, system prompts, and AI content checks ensure the assistant stays focused on careers only.",
  },
  {
    icon: Zap,
    title: "Fast inference",
    description:
      "Powered by Groq's LPU hardware running Llama 3.3 70B — answers in 2-5 seconds.",
  },
  {
    icon: Sparkles,
    title: "Smart prompts",
    description:
      "Each analysis (CV review, skill gap, interview prep) uses a specialized prompt engineered for that task.",
  },
];

const techStack = {
  Frontend: [
    { name: "React", color: "#61DAFB" },
    { name: "TypeScript", color: "#3178C6" },
    { name: "Vite", color: "#646CFF" },
    { name: "Tailwind CSS", color: "#06B6D4" },
    { name: "React Router", color: "#CA4245" },
    { name: "Axios", color: "#5A29E4" },
    { name: "Lucide Icons", color: "#F97316" },
  ],
  Backend: [
    { name: "Python", color: "#3776AB" },
    { name: "FastAPI", color: "#009688" },
    { name: "Pydantic", color: "#E92063" },
    { name: "Uvicorn", color: "#499848" },
  ],
  "AI / RAG": [
    { name: "Groq API", color: "#F55036" },
    { name: "Llama 3.3 70B", color: "#0467DF" },
    { name: "Sentence Transformers", color: "#FFBF00" },
    { name: "ChromaDB", color: "#FF5722" },
    { name: "PyPDF", color: "#3776AB" },
  ],
};

export default function About() {
  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-16 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>About this project</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 tracking-tight">
          AI-grounded career advice,{" "}
          <span className="text-brand-600">on your terms</span>
        </h1>
        <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
          Internship Assistant uses Retrieval-Augmented Generation (RAG) to give
          you personalized career advice based on your actual CV and the actual
          job description — not generic ChatGPT answers.
        </p>
      </div>

      {/* How RAG works */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
          <span className="w-1 h-6 bg-brand-500 rounded-full"></span>
          How RAG works
        </h2>
        <p className="text-secondary mb-8">
          Four steps that turn a PDF into intelligent, grounded answers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ragSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative p-6 rounded-2xl bg-card border border-default hover:border-strong transition-all"
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${step.color}`}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="font-bold text-primary text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
          <span className="w-1 h-6 bg-brand-500 rounded-full"></span>
          What makes it special
        </h2>
        <p className="text-secondary mb-8">
          Beyond a simple chatbot — built with care for accuracy and trust.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex gap-4 p-5 rounded-2xl bg-card border border-default"
              >
                <div className="w-11 h-11 rounded-xl bg-accent-500 bg-opacity-10 text-accent-600 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">{feature.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
          <span className="w-1 h-6 bg-brand-500 rounded-full"></span>
          Tech stack
        </h2>
        <p className="text-secondary mb-8">
          Modern, open-source tools — and 100% free to run.
        </p>

        <div className="space-y-6">
          {Object.entries(techStack).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-default text-sm font-medium text-primary hover:border-strong transition-all"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tech.color }}
                    ></span>
                    {tech.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code architecture */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
          <span className="w-1 h-6 bg-brand-500 rounded-full"></span>
          Architecture
        </h2>
        <p className="text-secondary mb-6">
          Clean separation of concerns: a Python backend handles the AI work, a
          React frontend handles the user experience. They talk via REST APIs.
        </p>

        <div className="rounded-2xl bg-card border border-default p-6 font-mono text-sm overflow-x-auto">
          <pre className="text-secondary leading-7 whitespace-pre">
{`internship-assistant/
├── backend/                    # Python + FastAPI
│   ├── rag/
│   │   ├── ingestion.py        # PDF → chunks → embeddings
│   │   ├── retrieval.py        # Semantic search
│   │   ├── generation.py       # LLM calls (Groq)
│   │   └── validator.py        # Content validation
│   ├── prompts/                # Specialized AI prompts
│   └── main.py                 # FastAPI endpoints
└── frontend/                   # React + TS + Vite
    ├── src/
    │   ├── pages/              # Home, Analysis, Chat, About
    │   ├── components/         # Reusable UI
    │   ├── api/                # Backend client
    │   └── lib/                # Theme context`}
          </pre>
        </div>
      </section>

      {/* Developer card */}
      <section className="mb-12">
        <div className="rounded-2xl bg-linear-to-br from-brand-500 to-accent-600 p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-xl">
              MJ
            </div>
            <div>
              <p className="text-sm opacity-80">Built by</p>
              <p className="text-xl font-bold">Mohamed Ali Jemmali</p>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed mb-4">
              This project explores how RAG can make AI assistants more accurate and trustworthy by grounding answers in real documents.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:jemmalimohamed0@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-sm font-medium transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-8">
        <h2 className="text-2xl font-bold text-primary mb-3">
          Ready to land that internship?
        </h2>
        <p className="text-secondary mb-6">Upload your CV and let's get started.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium transition-all hover:scale-[1.02]"
        >
          <span>Get started</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}