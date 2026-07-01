"use client";
import { useState } from "react";
import {
  Star, Sparkles, Copy, CheckCircle, AlertCircle, Lightbulb,
  TrendingUp, Target, FileText, ChevronDown, ChevronUp
} from "lucide-react";
import toast from "react-hot-toast";

interface ReviewResult {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestions: string[];
  atsScore: number;
  readabilityScore: number;
  impactScore: number;
  rewrittenVersion: string;
  keywordsMissing: string[];
  topPriority: string;
}

const SCORE_COLOR = (score: number) => {
  if (score >= 80) return "#4ADE80";
  if (score >= 60) return "#FDE047";
  return "#F87171";
};

export default function ProfileReviewPage() {
  const [text, setText] = useState("");
  const [type, setType] = useState<"cv" | "portfolio">("cv");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [showRewritten, setShowRewritten] = useState(false);
  const [copiedRewritten, setCopiedRewritten] = useState(false);

  // New features states
  const [urlInput, setUrlInput] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "url">("text");
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);

  // Dynamic loading of pdf.js from CDN
  const loadPdfJs = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
      script.onload = () => {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
        resolve((window as any).pdfjsLib);
      };
      script.onerror = () => reject(new Error("Failed to load PDF parser."));
      document.head.appendChild(script);
    });
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsExtractingPdf(true);
    const loadingToast = toast.loading("Extracting text from PDF...");

    try {
      const pdfjs = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        extractedText += strings.join(" ") + "\n";
      }

      if (extractedText.trim().length < 50) {
        toast.dismiss(loadingToast);
        toast.error("Extracted text is too short. Please copy/paste manually.");
        return;
      }

      setText(extractedText.trim());
      setInputMode("text");
      toast.dismiss(loadingToast);
      toast.success("Text extracted from CV PDF! 🎉");
    } catch (err: any) {
      console.error("PDF Extraction error:", err);
      toast.dismiss(loadingToast);
      toast.error(`Failed to parse PDF: ${err.message || err}`);
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleAnalyze = async () => {
    const isUrlMode = type === "portfolio" && inputMode === "url";

    if (isUrlMode) {
      if (!urlInput.trim()) {
        toast.error("Please enter your portfolio link");
        return;
      }
    } else {
      if (!text.trim() || text.trim().length < 50) {
        toast.error("Please enter at least 50 characters of CV or portfolio text");
        return;
      }
    }

    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await fetch("/api/profile-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: isUrlMode ? undefined : text,
          url: isUrlMode ? urlInput : undefined,
          type
        }),
      });

      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Analysis failed"); return; }

      setResult(data.review);
      toast.success("Analysis complete! 🎉");
    } catch {
      toast.error("Failed to analyze. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyRewritten = async () => {
    if (!result?.rewrittenVersion) return;
    await navigator.clipboard.writeText(result.rewrittenVersion);
    setCopiedRewritten(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedRewritten(false), 2000);
  };

  return (
    <div className="px-4 py-6 md:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: "rgba(234, 179, 8, 0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#FDE047",
        }}>
          <Star className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-outfit" style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>
            AI Profile Reviewer
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Upload your CV PDF, paste your text, or enter your portfolio link to get detailed AI feedback
          </p>
        </div>
      </div>

      <div className={`grid gap-6 items-start ${result ? "grid-cols-1 lg:grid-cols-5" : "grid-cols-1"}`}>
        {/* Input Panel */}
        <div className={result ? "lg:col-span-2" : ""}>
          <div className="glass-card p-5 md:p-6">
            {/* Type Toggle */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {(["cv", "portfolio"] as const).map((t) => (
                <button
                  key={t}
                  id={`type-${t}`}
                  onClick={() => {
                    setType(t);
                    setInputMode("text");
                  }}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 10,
                    border: `1px solid ${type === t ? "var(--accent-violet-light)" : "var(--border-color)"}`,
                    background: type === t ? "rgba(124, 58, 237, 0.12)" : "transparent",
                    color: type === t ? "var(--accent-violet-light)" : "var(--text-secondary)",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {t === "cv" ? <FileText className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                  {t === "cv" ? "CV / Resume" : "Portfolio"}
                </button>
              ))}
            </div>

            {/* CV PDF upload container */}
            {type === "cv" && (
              <div style={{ marginBottom: 18, padding: 14, background: "rgba(255,255,255,0.02)", border: "1px dashed var(--border-color)", borderRadius: 10 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                  📄 Upload CV PDF
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  disabled={isExtractingPdf}
                  style={{ fontSize: 12, color: "var(--text-secondary)", width: "100%" }}
                />
              </div>
            )}

            {/* Portfolio Mode toggle (text vs url) */}
            {type === "portfolio" && (
              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                <button
                  onClick={() => setInputMode("text")}
                  className="btn-secondary"
                  style={{
                    padding: "6px 14px",
                    fontSize: 12,
                    background: inputMode === "text" ? "rgba(124, 58, 237, 0.12)" : "transparent",
                    borderColor: inputMode === "text" ? "var(--accent-violet-light)" : "var(--border-color)",
                    color: inputMode === "text" ? "var(--accent-violet-light)" : "var(--text-secondary)",
                  }}
                >
                  📝 Paste Text
                </button>
                <button
                  onClick={() => setInputMode("url")}
                  className="btn-secondary"
                  style={{
                    padding: "6px 14px",
                    fontSize: 12,
                    background: inputMode === "url" ? "rgba(124, 58, 237, 0.12)" : "transparent",
                    borderColor: inputMode === "url" ? "var(--accent-violet-light)" : "var(--border-color)",
                    color: inputMode === "url" ? "var(--accent-violet-light)" : "var(--text-secondary)",
                  }}
                >
                  🌐 Scan Website URL
                </button>
              </div>
            )}

            {inputMode === "text" ? (
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
                  {type === "cv" ? "Paste your CV/resume text here" : "Paste your portfolio text here"}
                </label>
                <textarea
                  id="review-text-input"
                  className="input-field"
                  rows={16}
                  placeholder={
                    type === "cv"
                      ? "Paste your complete CV or resume text here. Include your experience, education, skills, and any other sections..."
                      : "Paste your portfolio description, about section, project descriptions, or any portfolio content here..."
                  }
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{ resize: "vertical", minHeight: 250 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {text.length} characters {text.length < 50 && text.length > 0 ? " (need at least 50)" : ""}
                  </span>
                  <button
                    onClick={() => setText("")}
                    className="btn-ghost"
                    style={{ fontSize: 12, padding: "2px 8px" }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
                  Portfolio Website Link
                </label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="e.g. https://myportfolio.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  style={{ marginBottom: 10 }}
                />
                <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                  AI will connect to this website, scan its visual copy and project descriptions, and provide feedback.
                </p>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (inputMode === "text" ? text.length < 50 : !urlInput)}
              className="btn-primary"
              id="analyze-btn"
              style={{
                width: "100%", justifyContent: "center", marginTop: 16,
                padding: "13px", fontSize: 15,
                opacity: (inputMode === "text" ? text.length < 50 : !urlInput) ? 0.6 : 1,
              }}
            >
              {isAnalyzing ? (
                <><div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} /> Analyzing with AI...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Analyze My {type === "cv" ? "CV" : "Portfolio"}</>
              )}
            </button>

            <div style={{ marginTop: 16, padding: 14, background: "rgba(6, 182, 212, 0.05)", border: "1px solid rgba(6, 182, 212, 0.15)", borderRadius: 10 }}>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                🔒 <strong>Privacy:</strong> Your text is processed securely. We don&apos;t store the original text, only your review results.
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        {result && (
          <div className="lg:col-span-3" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Score Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {[
                { label: "Overall Score", value: result.overallScore, icon: <TrendingUp className="w-4 h-4" /> },
                { label: "ATS Score", value: result.atsScore, icon: <Target className="w-4 h-4" /> },
                { label: "Readability", value: result.readabilityScore, icon: <CheckCircle className="w-4 h-4" /> },
                { label: "Impact Score", value: result.impactScore, icon: <Sparkles className="w-4 h-4" /> },
              ].map((sc, i) => (
                <div key={i} className="glass-card" style={{ padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
                      <span style={{ color: SCORE_COLOR(sc.value || 0) }}>{sc.icon}</span>
                      {sc.label}
                    </div>
                    <div className="font-outfit" style={{ fontSize: 24, fontWeight: 700, color: SCORE_COLOR(sc.value || 0) }}>
                      {sc.value || "—"}
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${sc.value || 0}%`, background: SCORE_COLOR(sc.value || 0) }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Top Priority */}
            {result.topPriority && (
              <div style={{ padding: 16, background: "rgba(124, 58, 237, 0.08)", border: "1px solid rgba(124, 58, 237, 0.25)", borderRadius: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <AlertCircle className="w-4 h-4" style={{ color: "var(--accent-violet-light)", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-violet-light)", marginBottom: 4 }}>
                      #1 Priority
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{result.topPriority}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Strengths */}
            <div className="review-section strengths">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontWeight: 700, fontSize: 14, color: "#4ADE80" }}>
                <CheckCircle className="w-4 h-4" /> Strengths ({result.strengths?.length || 0})
              </div>
              {result.strengths?.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                  <span style={{ color: "#4ADE80", flexShrink: 0 }}>✓</span> {s}
                </div>
              ))}
            </div>

            {/* Weaknesses */}
            <div className="review-section weaknesses">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontWeight: 700, fontSize: 14, color: "#F87171" }}>
                <AlertCircle className="w-4 h-4" /> Weaknesses ({result.weaknesses?.length || 0})
              </div>
              {result.weaknesses?.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                  <span style={{ color: "#F87171", flexShrink: 0 }}>⚠</span> {w}
                </div>
              ))}
            </div>

            {/* Missing Skills */}
            {result.missingSkills && result.missingSkills.length > 0 && (
              <div className="review-section missing">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontWeight: 700, fontSize: 14, color: "#FDE047" }}>
                  <Target className="w-4 h-4" /> Missing Skills / Sections
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {result.missingSkills.map((s, i) => (
                    <span key={i} className="badge badge-yellow">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords Missing */}
            {result.keywordsMissing && result.keywordsMissing.length > 0 && (
              <div style={{ padding: 14, background: "rgba(234, 179, 8, 0.05)", border: "1px solid rgba(234, 179, 8, 0.2)", borderRadius: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#FDE047", marginBottom: 8 }}>ATS Keywords Missing:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {result.keywordsMissing.map((k, i) => (
                    <span key={i} className="badge badge-yellow" style={{ fontSize: 11 }}>{k}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div className="review-section suggestions">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontWeight: 700, fontSize: 14, color: "var(--accent-cyan-light)" }}>
                <Lightbulb className="w-4 h-4" /> Actionable Suggestions
              </div>
              {result.suggestions?.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>
                  <span style={{ color: "var(--accent-cyan-light)", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span> {s}
                </div>
              ))}
            </div>

            {/* Rewritten Version */}
            {result.rewrittenVersion && (
              <div className="review-section rewritten">
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, cursor: "pointer" }}
                  onClick={() => setShowRewritten(!showRewritten)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, color: "var(--accent-violet-light)" }}>
                    <Sparkles className="w-4 h-4" /> AI Rewritten Version
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyRewritten(); }}
                      className="btn-ghost"
                      style={{ padding: "4px 10px", fontSize: 12 }}
                    >
                      {copiedRewritten ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedRewritten ? "Copied!" : "Copy"}
                    </button>
                    {showRewritten ? <ChevronUp className="w-4 h-4" style={{ color: "var(--text-muted)" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
                  </div>
                </div>
                {showRewritten && (
                  <div style={{
                    padding: 16,
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                    maxHeight: 400,
                    overflowY: "auto",
                  }}>
                    {result.rewrittenVersion}
                  </div>
                )}
                {!showRewritten && (
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Click to expand the AI-improved version of your {type === "cv" ? "CV" : "portfolio"}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
