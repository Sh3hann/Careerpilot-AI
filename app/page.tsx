import Link from "next/link";
import { 
  Briefcase, FileText, Mic, Star, ArrowRight, CheckCircle, 
  Zap, Shield, Globe, TrendingUp, Users, Award
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "AI Portfolio Generator",
      description: "Generate stunning, professional portfolio websites in minutes. AI writes your descriptions and structures your work beautifully.",
      badge: "Popular",
      color: "violet",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "ATS CV Builder",
      description: "Create CVs that pass Applicant Tracking Systems. Choose from ATS-optimized or creative templates with PDF export.",
      badge: "Must Have",
      color: "cyan",
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "AI Interview Simulator",
      description: "Practice with an AI recruiter that adapts to your role and difficulty. Get scored feedback after every answer.",
      badge: "Interactive",
      color: "pink",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Profile Reviewer",
      description: "Paste your CV or portfolio text and get instant AI analysis with strengths, gaps, and a professionally rewritten version.",
      badge: "Instant",
      color: "violet",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Career Dashboard",
      description: "Track all your CVs, portfolios, and interview sessions in one place. See your progress and history at a glance.",
      badge: "Dashboard",
      color: "cyan",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your career data is encrypted and private. Only you can access your portfolios, CVs, and interview sessions.",
      badge: "Secure",
      color: "pink",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up in seconds with email or Google. Your free account gives you access to all AI features.",
    },
    {
      number: "02",
      title: "Input Your Information",
      description: "Tell CareerPilot AI about your skills, experience, and goals. The more detail, the better the output.",
    },
    {
      number: "03",
      title: "AI Does the Heavy Lifting",
      description: "Our AI generates professional portfolios, optimized CVs, and conducts realistic interview sessions.",
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Frontend Developer",
      text: "Got my dream job at a FAANG company after using CareerPilot AI. The interview simulator was incredibly realistic.",
      rating: 5,
      avatar: "AC",
    },
    {
      name: "Priya Sharma",
      role: "UI/UX Designer",
      text: "The portfolio generator created something more professional than I could have made in weeks. Absolutely stunning result.",
      rating: 5,
      avatar: "PS",
    },
    {
      name: "Marcus Johnson",
      role: "Backend Engineer",
      text: "My CV's ATS score went from 45% to 89% after using CareerPilot AI. Got 3x more callbacks immediately.",
      rating: 5,
      avatar: "MJ",
    },
  ];

  return (
    <div className="hero-gradient min-h-screen">
      {/* Navigation */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(8, 12, 20, 0.8)",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Zap className="w-5 h-5" style={{ color: "white" }} />
            </div>
            <span className="font-outfit" style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>
              CareerPilot<span className="gradient-text"> AI</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/login" className="btn-ghost">Sign In</Link>
            <Link href="/signup" className="btn-primary" style={{ padding: "10px 20px" }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "100px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Background Orbs */}
        <div style={{
          position: "absolute", top: "10%", left: "20%", width: 400, height: 400,
          borderRadius: "50%", background: "rgba(124, 58, 237, 0.08)",
          filter: "blur(80px)", pointerEvents: "none",
        }} className="animate-pulse-glow" />
        <div style={{
          position: "absolute", top: "30%", right: "15%", width: 300, height: 300,
          borderRadius: "50%", background: "rgba(6, 182, 212, 0.06)",
          filter: "blur(60px)", pointerEvents: "none",
        }} className="animate-float-slow" />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div className="section-tag animate-fade-in">
            <Zap className="w-3 h-3" />
            AI-Powered Career Platform
          </div>

          <h1 className="font-outfit animate-fade-in-up" style={{
            fontSize: "clamp(40px, 7vw, 80px)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 24,
            color: "var(--text-primary)",
            letterSpacing: "-1px",
          }}>
            Launch Your Career{" "}
            <span className="gradient-text">10x Faster</span>
            <br />
            with AI
          </h1>

          <p className="animate-fade-in-up delay-200" style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "var(--text-secondary)",
            maxWidth: 640,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}>
            Build stunning portfolios, create ATS-beating CVs, practice interviews with AI, 
            and get expert feedback — all in one platform designed for ambitious job seekers.
          </p>

          <div className="animate-fade-in-up delay-300" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn-secondary" style={{ fontSize: 16, padding: "14px 32px" }}>
              Sign In
            </Link>
          </div>

          <div className="animate-fade-in-up delay-400" style={{
            display: "flex", gap: 32, justifyContent: "center", marginTop: 48, flexWrap: "wrap"
          }}>
            {[
              { value: "10,000+", label: "Users" },
              { value: "50,000+", label: "CVs Generated" },
              { value: "4.9★", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div className="font-outfit" style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-tag" style={{ justifyContent: "center" }}>
              <Star className="w-3 h-3" />
              Features
            </div>
            <h2 className="font-outfit" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>
              Everything You Need to{" "}
              <span className="gradient-text">Land Your Dream Job</span>
            </h2>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto" }}>
              A complete AI career toolkit built for students and professionals who want to stand out.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 24,
          }}>
            {features.map((feature, i) => (
              <div key={i} className="glass-card" style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                  <div className="feature-icon" style={{
                    background: feature.color === "cyan" 
                      ? "rgba(6, 182, 212, 0.12)" 
                      : feature.color === "pink" 
                      ? "rgba(236, 72, 153, 0.12)"
                      : "rgba(124, 58, 237, 0.12)",
                    borderColor: feature.color === "cyan" 
                      ? "rgba(6, 182, 212, 0.2)" 
                      : feature.color === "pink" 
                      ? "rgba(236, 72, 153, 0.2)"
                      : "rgba(124, 58, 237, 0.2)",
                    color: feature.color === "cyan" 
                      ? "var(--accent-cyan-light)" 
                      : feature.color === "pink" 
                      ? "#F472B6"
                      : "var(--accent-violet-light)",
                  }}>
                    {feature.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>
                        {feature.title}
                      </h3>
                      <span className={`badge badge-${feature.color === "pink" ? "pink" : feature.color === "cyan" ? "cyan" : "violet"}`}>
                        {feature.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-tag" style={{ justifyContent: "center" }}>
              <Briefcase className="w-3 h-3" />
              How It Works
            </div>
            <h2 className="font-outfit" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "var(--text-primary)" }}>
              Get Started in <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(6, 182, 212, 0.15))",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px", fontSize: 24, fontWeight: 800,
                  fontFamily: "Outfit, sans-serif", color: "var(--accent-violet-light)",
                }}>
                  {step.number}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-tag" style={{ justifyContent: "center" }}>
              <Users className="w-3 h-3" />
              Testimonials
            </div>
            <h2 className="font-outfit" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "var(--text-primary)" }}>
              Loved by Job Seekers <span className="gradient-text">Worldwide</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card" style={{ padding: 28 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4" style={{ color: "#FDE047", fill: "#FDE047" }} />
                  ))}
                </div>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: "white",
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            padding: "60px 40px",
            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.05))",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            borderRadius: 24,
          }}>
            <Award className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--accent-violet-light)" }} />
            <h2 className="font-outfit" style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>
              Ready to <span className="gradient-text">Accelerate Your Career?</span>
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", marginBottom: 32, lineHeight: 1.7 }}>
              Join thousands of professionals who landed better jobs faster using CareerPilot AI.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/signup" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 24 }}>
              {["No credit card required", "Free forever", "AI-powered"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
                  <CheckCircle className="w-4 h-4" style={{ color: "var(--accent-cyan-light)" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-color)",
        padding: "32px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Zap className="w-4 h-4" style={{ color: "white" }} />
            </div>
            <span className="font-outfit" style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
              CareerPilot AI
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            © 2025 CareerPilot AI. Built with AI for career excellence.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/login" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Login</Link>
            <Link href="/signup" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
