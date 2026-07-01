"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard, Globe, FileText, Mic, Star, LogOut, Zap, ChevronRight, User
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
  { href: "/portfolio-generator", icon: <Globe className="w-5 h-5" />, label: "Portfolio Generator" },
  { href: "/cv-generator", icon: <FileText className="w-5 h-5" />, label: "CV Generator" },
  { href: "/interview", icon: <Mic className="w-5 h-5" />, label: "Interview Simulator" },
  { href: "/profile-review", icon: <Star className="w-5 h-5" />, label: "Profile Reviewer" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside style={{
      width: 260,
      background: "var(--bg-secondary)",
      borderRight: "1px solid var(--border-color)",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0,
      zIndex: 50,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: "24px 20px",
        borderBottom: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Zap className="w-5 h-5" style={{ color: "white" }} />
        </div>
        <div>
          <div className="font-outfit" style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
            CareerPilot
          </div>
          <div className="gradient-text" style={{ fontSize: 11, fontWeight: 600 }}>AI Platform</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", padding: "0 8px", marginBottom: 8 }}>
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4" style={{ opacity: 0.6 }} />}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid var(--border-color)" }}>
        {/* User Info */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 10px", marginBottom: 8,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0,
          }}>
            {session?.user?.name
              ? session.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
              : <User className="w-4 h-4" />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {session?.user?.name || "User"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {session?.user?.email || ""}
            </div>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="nav-item"
          style={{ color: "#EF4444", width: "100%" }}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
