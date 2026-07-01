"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Globe, FileText, Mic, Star, ArrowRight, Clock, TrendingUp,
  Award, BarChart2, Plus, Zap
} from "lucide-react";
import toast from "react-hot-toast";

interface DashboardData {
  stats: {
    portfolioCount: number;
    cvCount: number;
    interviewCount: number;
    avgInterviewScore: string | null;
  };
  recent: {
    portfolios: Array<{ _id: string; name: string; title: string; theme: string; createdAt: string }>;
    cvs: Array<{ _id: string; personalInfo: { name: string; title: string }; version: string; createdAt: string }>;
    interviews: Array<{ _id: string; role: string; difficulty: string; status: string; overallScore: number; createdAt: string }>;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const firstName = session?.user?.name?.split(" ")[0] || "there";

  const actionCards = [
    {
      href: "/portfolio-generator",
      icon: <Globe className="w-7 h-7" />,
      title: "Generate Portfolio",
      description: "Create a stunning AI-powered portfolio website",
      gradient: "linear-gradient(135deg, #7C3AED22, #06B6D422)",
      border: "rgba(124, 58, 237, 0.3)",
      iconColor: "var(--accent-violet-light)",
    },
    {
      href: "/cv-generator",
      icon: <FileText className="w-7 h-7" />,
      title: "Create CV",
      description: "Build ATS-optimized CVs with PDF export",
      gradient: "linear-gradient(135deg, #06B6D422, #22C55E22)",
      border: "rgba(6, 182, 212, 0.3)",
      iconColor: "var(--accent-cyan-light)",
    },
    {
      href: "/interview",
      icon: <Mic className="w-7 h-7" />,
      title: "Practice Interview",
      description: "Simulate real interviews with AI feedback",
      gradient: "linear-gradient(135deg, #EC489922, #7C3AED22)",
      border: "rgba(236, 72, 153, 0.3)",
      iconColor: "#F472B6",
    },
    {
      href: "/profile-review",
      icon: <Star className="w-7 h-7" />,
      title: "AI Profile Review",
      description: "Get expert AI feedback on your CV or portfolio",
      gradient: "linear-gradient(135deg, #F59E0B22, #EF444422)",
      border: "rgba(245, 158, 11, 0.3)",
      iconColor: "#FDE047",
    },
  ];

  const statCards = [
    {
      label: "Portfolios Generated",
      value: data?.stats.portfolioCount ?? "—",
      icon: <Globe className="w-5 h-5" />,
      color: "var(--accent-violet-light)",
    },
    {
      label: "CVs Created",
      value: data?.stats.cvCount ?? "—",
      icon: <FileText className="w-5 h-5" />,
      color: "var(--accent-cyan-light)",
    },
    {
      label: "Interviews Done",
      value: data?.stats.interviewCount ?? "—",
      icon: <Mic className="w-5 h-5" />,
      color: "#F472B6",
    },
    {
      label: "Avg Interview Score",
      value: data?.stats.avgInterviewScore ? `${data.stats.avgInterviewScore}/10` : "—",
      icon: <Award className="w-5 h-5" />,
      color: "#FDE047",
    },
  ];

  return (
    <div style={{ padding: "32px 28px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: 32 }} className="animate-fade-in">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
          <span style={{ fontSize: 12, color: "#4ADE80", fontWeight: 500 }}>Online</span>
        </div>
        <h1 className="font-outfit" style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
          Welcome back, <span className="gradient-text">{firstName}!</span> 👋
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          Ready to accelerate your career? Choose what you&apos;d like to work on today.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
        marginBottom: 32,
      }}>
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${stat.color}20`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: stat.color,
              }}>
                {stat.icon}
              </div>
            </div>
            {isLoading ? (
              <div className="skeleton" style={{ width: 60, height: 32, marginBottom: 8 }} />
            ) : (
              <div className="font-outfit" style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                {stat.value}
              </div>
            )}
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Zap className="w-4 h-4" style={{ color: "var(--accent-violet-light)" }} />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Quick Actions</h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}>
          {actionCards.map((card, i) => (
            <Link key={i} href={card.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: card.gradient,
                border: `1px solid ${card.border}`,
                borderRadius: 16,
                padding: 24,
                cursor: "pointer",
                transition: "all 0.25s ease",
                height: "100%",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${card.border}80`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                }}
              >
                <div style={{ color: card.iconColor, marginBottom: 16 }}>{card.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 16 }}>
                  {card.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: card.iconColor, fontSize: 13, fontWeight: 600 }}>
                  Get started <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {/* Recent CVs */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileText className="w-4 h-4" style={{ color: "var(--accent-cyan-light)" }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Recent CVs</h3>
            </div>
            <Link href="/cv-generator" className="btn-ghost" style={{ fontSize: 12, padding: "4px 10px" }}>
              <Plus className="w-3 h-3" /> New
            </Link>
          </div>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8 }} />)}
            </div>
          ) : data?.recent.cvs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)", fontSize: 13 }}>
              No CVs yet. <Link href="/cv-generator" style={{ color: "var(--accent-violet-light)", textDecoration: "none" }}>Create your first →</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data?.recent.cvs.map((cv) => (
                <div key={cv._id} style={{
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                  border: "1px solid var(--border-color)",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(6, 182, 212, 0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--accent-cyan-light)", flexShrink: 0,
                  }}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {cv.personalInfo?.name || "CV"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {cv.version?.toUpperCase()} • {new Date(cv.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Portfolios */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Globe className="w-4 h-4" style={{ color: "var(--accent-violet-light)" }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Recent Portfolios</h3>
            </div>
            <Link href="/portfolio-generator" className="btn-ghost" style={{ fontSize: 12, padding: "4px 10px" }}>
              <Plus className="w-3 h-3" /> New
            </Link>
          </div>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8 }} />)}
            </div>
          ) : data?.recent.portfolios.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)", fontSize: 13 }}>
              No portfolios yet. <Link href="/portfolio-generator" style={{ color: "var(--accent-violet-light)", textDecoration: "none" }}>Generate one →</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data?.recent.portfolios.map((p) => (
                <div key={p._id} style={{
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                  border: "1px solid var(--border-color)",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(124, 58, 237, 0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--accent-violet-light)", flexShrink: 0,
                  }}>
                    <Globe className="w-4 h-4" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {p.theme} • {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Interviews */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Mic className="w-4 h-4" style={{ color: "#F472B6" }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Recent Interviews</h3>
            </div>
            <Link href="/interview" className="btn-ghost" style={{ fontSize: 12, padding: "4px 10px" }}>
              <Plus className="w-3 h-3" /> New
            </Link>
          </div>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8 }} />)}
            </div>
          ) : data?.recent.interviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)", fontSize: 13 }}>
              No interviews yet. <Link href="/interview" style={{ color: "var(--accent-violet-light)", textDecoration: "none" }}>Practice now →</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data?.recent.interviews.map((iv) => (
                <div key={iv._id} style={{
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                  border: "1px solid var(--border-color)",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(236, 72, 153, 0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#F472B6", flexShrink: 0,
                  }}>
                    <Mic className="w-4 h-4" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {iv.role}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", gap: 8 }}>
                      <span style={{ textTransform: "capitalize" }}>{iv.difficulty}</span>
                      {iv.overallScore && <span>• {iv.overallScore}/10</span>}
                      <span>• {iv.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
