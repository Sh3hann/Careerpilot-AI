"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Globe, FileText, Mic, Star, LogOut, Zap, Menu, X
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
  { href: "/portfolio-generator", icon: <Globe className="w-5 h-5" />, label: "Portfolio" },
  { href: "/cv-generator", icon: <FileText className="w-5 h-5" />, label: "CV Builder" },
  { href: "/interview", icon: <Mic className="w-5 h-5" />, label: "Interview" },
  { href: "/profile-review", icon: <Star className="w-5 h-5" />, label: "Review" },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile top bar */}
      <div style={{
        display: "none",
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: 56,
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        zIndex: 200,
      }} id="mobile-nav-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap className="w-4 h-4" style={{ color: "white" }} />
          </div>
          <span className="font-outfit" style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
            CareerPilot AI
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)", padding: 4 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          style={{
            display: "none",
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 150,
          }}
          id="mobile-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div style={{
        display: "none",
        position: "fixed",
        top: 56, left: 0, bottom: 0,
        width: 280,
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-color)",
        zIndex: 180,
        padding: "16px 12px",
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
        flexDirection: "column",
        gap: 4,
      }} id="mobile-drawer">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="nav-item"
          style={{ color: "#EF4444", marginTop: "auto" }}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </>
  );
}
