"use client";
import { useState, useRef, useEffect } from "react";
import {
  Mic, Send, Bot, User, Trophy, ChevronDown, BarChart2,
  CheckCircle, AlertCircle, Lightbulb, ArrowRight, RefreshCw, Star
} from "lucide-react";
import toast from "react-hot-toast";

const JOB_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile Developer (React Native)",
  "Product Manager",
  "Software Engineer",
  "Machine Learning Engineer",
  "Cloud Solutions Architect",
  "QA Engineer",
];

const DIFFICULTIES = [
  { id: "easy", label: "Easy", color: "#4ADE80", bg: "rgba(34, 197, 94, 0.12)", border: "rgba(34, 197, 94, 0.4)", desc: "Junior level, fundamentals" },
  { id: "medium", label: "Medium", color: "#FDE047", bg: "rgba(234, 179, 8, 0.12)", border: "rgba(234, 179, 8, 0.4)", desc: "Mid level, problem solving" },
  { id: "hard", label: "Hard", color: "#F87171", bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.4)", desc: "Senior level, system design" },
];

interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

interface Report {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string;
  answerScores: Array<{ question: string; score: number; feedback: string }>;
  hiringDecision: string;
  hiringReason: string;
}

export default function InterviewPage() {
  const [stage, setStage] = useState<"setup" | "interview" | "report">("setup");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startInterview = async () => {
    if (!selectedRole) {
      toast.error("Please select a job role");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          role: selectedRole,
          difficulty: selectedDifficulty,
        }),
      });

      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }

      setInterviewId(data.interviewId);
      setMessages([{ role: "assistant", content: data.message, timestamp: new Date() }]);
      setStage("interview");
      setQuestionCount(1);
    } catch {
      toast.error("Failed to start interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !interviewId || isLoading) return;

    const userMessage = userInput.trim();
    setUserInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          interviewId,
          userMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }

      setMessages((prev) => [...prev, { role: "assistant", content: data.message, timestamp: new Date() }]);
      setQuestionCount((prev) => prev + 1);
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const endInterview = async () => {
    if (!interviewId) return;
    setIsEnding(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end", interviewId }),
      });

      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }

      setReport(data.report);
      setStage("report");
      toast.success("Interview complete! Here's your report 🎉");
    } catch {
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsEnding(false);
    }
  };

  const resetInterview = () => {
    setStage("setup");
    setMessages([]);
    setInterviewId(null);
    setReport(null);
    setUserInput("");
    setQuestionCount(0);
    setSelectedRole("");
  };

  // Setup Stage
  if (stage === "setup") {
    return (
      <div style={{ padding: "32px 28px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "rgba(236, 72, 153, 0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#F472B6",
          }}>
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-outfit" style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>
              AI Interview Simulator
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Practice with a realistic AI recruiter and get scored feedback
            </p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 32 }}>
          {/* Role Selection */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>
              Select Job Role
            </label>
            <div style={{ position: "relative" }}>
              <select
                id="role-select"
                className="input-field"
                style={{ appearance: "none", paddingRight: 40, cursor: "pointer" }}
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">-- Choose a role --</option>
                {JOB_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4" style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                color: "var(--text-muted)", pointerEvents: "none",
              }} />
            </div>
          </div>

          {/* Difficulty Selection */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>
              Difficulty Level
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.id}
                  id={`difficulty-${diff.id}`}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  style={{
                    padding: "16px 12px",
                    borderRadius: 12,
                    border: `1px solid ${selectedDifficulty === diff.id ? diff.border : "var(--border-color)"}`,
                    background: selectedDifficulty === diff.id ? diff.bg : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 6 }}>
                    {diff.id === "easy" ? "🟢" : diff.id === "medium" ? "🟡" : "🔴"}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: selectedDifficulty === diff.id ? diff.color : "var(--text-primary)", marginBottom: 4 }}>
                    {diff.label}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{diff.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* What to Expect */}
          <div style={{ padding: 20, background: "rgba(124, 58, 237, 0.05)", border: "1px solid rgba(124, 58, 237, 0.15)", borderRadius: 12, marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
              What to expect:
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "The AI recruiter will ask you questions one by one",
                "Answer each question naturally in the chat",
                "After 5-7 questions, end the interview to get your report",
                "Receive a detailed score and improvement suggestions",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent-cyan-light)", marginTop: 1 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={startInterview}
            disabled={isLoading || !selectedRole}
            className="btn-primary"
            id="start-interview-btn"
            style={{ width: "100%", justifyContent: "center", padding: "14px 24px", fontSize: 16 }}
          >
            {isLoading ? (
              <><div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} /> Starting Interview...</>
            ) : (
              <>Start Interview <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Interview Chat Stage
  if (stage === "interview") {
    const difficulty = DIFFICULTIES.find((d) => d.id === selectedDifficulty);

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "0" }}>
        {/* Interview Header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "rgba(236, 72, 153, 0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#F472B6",
            }}>
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                AI Recruiter
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Interviewing for <strong style={{ color: "var(--text-secondary)" }}>{selectedRole}</strong>
                {" · "}
                <span style={{ color: difficulty?.color }}>{difficulty?.label}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {questionCount} exchanges
            </span>
            <button
              onClick={endInterview}
              disabled={isEnding || messages.length < 3}
              className="btn-danger"
              id="end-interview-btn"
              style={{ opacity: messages.length < 3 ? 0.5 : 1 }}
            >
              {isEnding ? (
                <><div style={{ width: 14, height: 14, border: "2px solid rgba(239,68,68,0.3)", borderTopColor: "#EF4444", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} /> Generating Report...</>
              ) : (
                <><Trophy className="w-4 h-4" /> End & Get Report</>
              )}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: 12, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: msg.role === "assistant"
                  ? "linear-gradient(135deg, #EC4899, #7C3AED)"
                  : "linear-gradient(135deg, #06B6D4, #22C55E)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white",
              }}>
                {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div style={{ maxWidth: "75%" }}>
                <div className={msg.role === "assistant" ? "chat-bubble-ai" : "chat-bubble-user"}>
                  {msg.content}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, textAlign: msg.role === "user" ? "right" : "left" }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #EC4899, #7C3AED)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "white",
              }}>
                <Bot className="w-4 h-4" />
              </div>
              <div className="chat-bubble-ai">
                <div className="typing-indicator">
                  <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <textarea
              id="interview-input"
              className="input-field"
              style={{ flex: 1, minHeight: 52, maxHeight: 150, resize: "none" }}
              placeholder="Type your answer here... (Shift+Enter for new line)"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isLoading}
              rows={2}
            />
            <button
              onClick={sendMessage}
              disabled={!userInput.trim() || isLoading}
              className="btn-primary"
              id="send-answer-btn"
              style={{ padding: "14px 20px", flexShrink: 0, opacity: !userInput.trim() || isLoading ? 0.5 : 1 }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
            Press Enter to send · Shift+Enter for new line · End interview when ready to see your report
          </p>
        </div>
      </div>
    );
  }

  // Report Stage
  if (stage === "report" && report) {
    const hiringColor = report.hiringDecision?.includes("Strong Yes") ? "#4ADE80"
      : report.hiringDecision?.includes("Yes") ? "#22D3EE"
      : report.hiringDecision?.includes("Maybe") ? "#FDE047"
      : "#F87171";

    return (
      <div style={{ padding: "32px 28px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "rgba(236, 72, 153, 0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#F472B6",
          }}>
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-outfit" style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>
              Interview Report
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              {selectedRole} · {DIFFICULTIES.find((d) => d.id === selectedDifficulty)?.label} difficulty
            </p>
          </div>
        </div>

        {/* Score Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, marginBottom: 28, alignItems: "center" }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            color: "white", boxShadow: "0 0 30px rgba(124, 58, 237, 0.4)",
          }}>
            <div className="font-outfit" style={{ fontSize: 32, fontWeight: 900 }}>{report.overallScore}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>/ 10</div>
          </div>
          <div>
            <div className="font-outfit" style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
              Overall Performance
            </div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {report.summary}
            </p>
          </div>
          <div style={{
            padding: "12px 20px",
            background: `${hiringColor}15`,
            border: `1px solid ${hiringColor}50`,
            borderRadius: 12, textAlign: "center",
          }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Hiring Decision</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: hiringColor }}>{report.hiringDecision}</div>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div className="review-section strengths">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontWeight: 700, fontSize: 14, color: "#4ADE80" }}>
              <CheckCircle className="w-4 h-4" /> Strengths
            </div>
            {report.strengths?.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                <span style={{ color: "#4ADE80", flexShrink: 0 }}>✓</span> {s}
              </div>
            ))}
          </div>
          <div className="review-section weaknesses">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontWeight: 700, fontSize: 14, color: "#F87171" }}>
              <AlertCircle className="w-4 h-4" /> Areas to Improve
            </div>
            {report.improvements?.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                <span style={{ color: "#F87171", flexShrink: 0 }}>↗</span> {s}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="review-section suggestions" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontWeight: 700, fontSize: 14, color: "var(--accent-cyan-light)" }}>
            <Lightbulb className="w-4 h-4" /> Recommendations
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {report.recommendations}
          </p>
        </div>

        {/* Per-Question Scores */}
        {report.answerScores && report.answerScores.length > 0 && (
          <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
              <BarChart2 className="w-4 h-4" style={{ color: "var(--accent-violet-light)" }} /> Question-by-Question Breakdown
            </div>
            {report.answerScores.map((ans, i) => (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < report.answerScores.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", flex: 1, marginRight: 12 }}>
                    Q{i + 1}: {ans.question}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Star className="w-3 h-3" style={{ color: "#FDE047", fill: "#FDE047" }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: ans.score >= 7 ? "#4ADE80" : ans.score >= 5 ? "#FDE047" : "#F87171" }}>
                      {ans.score}/10
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${ans.score * 10}%` }} />
                </div>
                {ans.feedback && (
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6, fontStyle: "italic" }}>
                    {ans.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={resetInterview} className="btn-primary">
            <RefreshCw className="w-4 h-4" /> Practice Again
          </button>
          <button onClick={() => setStage("interview")} className="btn-secondary">
            View Conversation
          </button>
        </div>
      </div>
    );
  }

  return null;
}
