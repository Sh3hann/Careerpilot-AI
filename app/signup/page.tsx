"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Zap, ArrowRight, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 1, label: "Too short", color: "#EF4444" };
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return { strength: 2, label: "Weak", color: "#F59E0B" };
    }
    if (password.length < 12) return { strength: 3, label: "Good", color: "#06B6D4" };
    return { strength: 4, label: "Strong", color: "#22C55E" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Signup failed");
        return;
      }

      toast.success("Account created! Signing you in...");

      // Auto sign in
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Account created! Please sign in.");
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      background: "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(124, 58, 237, 0.12) 0%, transparent 60%), var(--bg-primary)",
    }}>
      <div style={{
        position: "fixed", top: "30%", right: "10%", width: 300, height: 300,
        borderRadius: "50%", background: "rgba(6, 182, 212, 0.05)",
        filter: "blur(60px)", pointerEvents: "none",
      }} className="animate-float-medium" />

      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Zap className="w-6 h-6" style={{ color: "white" }} />
            </div>
            <span className="font-outfit" style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>
              CareerPilot <span className="gradient-text">AI</span>
            </span>
          </Link>
        </div>

        <div className="glass-card animate-fade-in-up" style={{ padding: 40 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, fontFamily: "Outfit, sans-serif" }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>
            Start building your AI-powered career today — free forever
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User className="w-4 h-4" style={{
                  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                  color: "var(--text-muted)", pointerEvents: "none",
                }} />
                <input
                  type="text"
                  id="name"
                  className="input-field"
                  style={{ paddingLeft: 40 }}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail className="w-4 h-4" style={{
                  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                  color: "var(--text-muted)", pointerEvents: "none",
                }} />
                <input
                  type="email"
                  id="signup-email"
                  className="input-field"
                  style={{ paddingLeft: 40 }}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock className="w-4 h-4" style={{
                  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                  color: "var(--text-muted)", pointerEvents: "none",
                }} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="signup-password"
                  className="input-field"
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                    display: "flex", alignItems: "center",
                  }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password Strength */}
              {formData.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map((level) => (
                      <div key={level} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: level <= passwordStrength.strength
                          ? passwordStrength.color
                          : "var(--border-color)",
                        transition: "background 0.3s ease",
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              id="signup-submit"
              disabled={isLoading}
              className="btn-primary"
              style={{ justifyContent: "center", marginTop: 8, padding: "13px 24px", fontSize: 15 }}
            >
              {isLoading ? (
                <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
              ) : (
                <>Create Free Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)", marginTop: 24 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--accent-violet-light)", textDecoration: "none", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
