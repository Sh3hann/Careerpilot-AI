"use client";
import { useState } from "react";
import {
  Globe, Plus, Trash2, ArrowRight, ArrowLeft, Sparkles, Download,
  CheckCircle, Code, Palette, Minimize2, ExternalLink, Copy
} from "lucide-react";
import toast from "react-hot-toast";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  url: string;
  github: string;
}

interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  year: string;
}

interface FormData {
  name: string;
  title: string;
  about: string;
  email: string;
  github: string;
  linkedin: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  theme: "developer" | "designer" | "minimal";
}

interface GeneratedPortfolio {
  id: string;
  shareId: string;
  aiAbout: string;
  enhancedProjects: Array<Project & { aiDescription: string }>;
  enhancedExperience: Array<Experience & { aiDescription: string }>;
  theme: string;
}

const THEMES = [
  {
    id: "developer",
    icon: <Code className="w-5 h-5" />,
    label: "Developer",
    description: "Dark theme with code aesthetics",
    preview: "bg-gradient-to-br from-gray-900 via-violet-900/20 to-gray-900",
  },
  {
    id: "designer",
    icon: <Palette className="w-5 h-5" />,
    label: "Designer",
    description: "Creative & colorful layout",
    preview: "bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-blue-900/20",
  },
  {
    id: "minimal",
    icon: <Minimize2 className="w-5 h-5" />,
    label: "Minimal",
    description: "Clean & professional",
    preview: "bg-gradient-to-br from-slate-900 to-slate-800",
  },
];

const STEPS = ["Basic Info", "Skills", "Projects", "Experience", "Theme"];

export default function PortfolioGeneratorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPortfolio, setGeneratedPortfolio] = useState<GeneratedPortfolio | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [techInput, setTechInput] = useState<Record<number, string>>({});

  const [formData, setFormData] = useState<FormData>({
    name: "",
    title: "",
    about: "",
    email: "",
    github: "",
    linkedin: "",
    skills: [],
    projects: [{ name: "", description: "", technologies: [], url: "", github: "" }],
    experience: [{ company: "", role: "", duration: "", description: "" }],
    education: [{ institution: "", degree: "", year: "" }],
    theme: "developer",
  });

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const addTech = (projectIndex: number) => {
    const tech = techInput[projectIndex]?.trim();
    if (tech) {
      const updatedProjects = [...formData.projects];
      if (!updatedProjects[projectIndex].technologies.includes(tech)) {
        updatedProjects[projectIndex].technologies = [...updatedProjects[projectIndex].technologies, tech];
        setFormData({ ...formData, projects: updatedProjects });
        setTechInput({ ...techInput, [projectIndex]: "" });
      }
    }
  };

  const handleGenerate = async () => {
    if (!formData.name || !formData.title || !formData.about) {
      toast.error("Please fill in your name, title, and about section");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          title: formData.title,
          about: formData.about,
          skills: formData.skills,
          projects: formData.projects.filter((p) => p.name),
          experience: formData.experience.filter((e) => e.company),
          education: formData.education.filter((e) => e.institution),
          contact: {
            email: formData.email,
            github: formData.github,
            linkedin: formData.linkedin,
          },
          theme: formData.theme,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Generation failed");
        return;
      }

      setGeneratedPortfolio(data.portfolio);
      toast.success("Portfolio generated successfully! 🎉");
    } catch {
      toast.error("Failed to generate portfolio. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateHTML = () => {
    if (!generatedPortfolio) return "";
    const p = generatedPortfolio;
    const themeStyles = {
      developer: `
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
          background: #030712; 
          color: #f1f5f9; 
          line-height: 1.7;
          -webkit-font-smoothing: antialiased;
        }
        nav { 
          background: rgba(3, 7, 18, 0.8) !important; 
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important; 
        }
        .hero { 
          background: radial-gradient(circle at top, rgba(99, 102, 241, 0.15) 0%, transparent 60%); 
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .accent { 
          background: linear-gradient(135deg, #a78bfa 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }
        .section-bg { 
          background: rgba(17, 24, 39, 0.4); 
          border: 1px solid rgba(255, 255, 255, 0.05); 
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        .section-bg:hover {
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.05);
          transform: translateY(-2px);
        }
        .skill-tag { 
          background: rgba(99, 102, 241, 0.1); 
          color: #818cf8; 
          border: 1px solid rgba(99, 102, 241, 0.2); 
          font-family: 'Fira Code', monospace;
        }
        .project-links a { 
          background: rgba(99, 102, 241, 0.1); 
          border: 1px solid rgba(99, 102, 241, 0.25); 
          color: #818cf8; 
          transition: all 0.2s ease;
        }
        .project-links a:hover {
          background: #6366f1;
          color: white;
        }
        footer {
          border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
      `,
      designer: `
        body { 
          font-family: 'Outfit', 'Inter', sans-serif; 
          background: #0b071e; 
          color: #f1f5f9; 
          line-height: 1.7;
          -webkit-font-smoothing: antialiased;
        }
        nav { 
          background: rgba(11, 7, 30, 0.85) !important; 
          border-bottom: 1px solid rgba(236, 72, 153, 0.1) !important; 
        }
        .hero { 
          background: radial-gradient(circle at top right, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 80%);
          border-bottom: 1px solid rgba(236, 72, 153, 0.05);
        }
        .accent { 
          background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }
        .section-bg { 
          background: rgba(26, 18, 50, 0.45); 
          border: 1px solid rgba(139, 92, 246, 0.15); 
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .section-bg:hover {
          border-color: rgba(236, 72, 153, 0.4);
          box-shadow: 0 12px 40px rgba(139, 92, 246, 0.15);
          transform: translateY(-4px);
        }
        .skill-tag { 
          background: rgba(236, 72, 153, 0.08); 
          color: #f472b6; 
          border: 1px solid rgba(236, 72, 153, 0.2); 
          border-radius: 8px !important;
        }
        .project-links a { 
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15)); 
          border: 1px solid rgba(139, 92, 246, 0.3); 
          color: #cbd5e1; 
          border-radius: 8px !important;
          transition: all 0.2s ease;
        }
        .project-links a:hover {
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          color: white;
          border-color: transparent;
        }
        footer {
          border-top: 1px solid rgba(236, 72, 153, 0.1) !important;
        }
      `,
      minimal: `
        body { 
          font-family: 'Inter', sans-serif; 
          background: #fafaf9; 
          color: #1c1917; 
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        h1, h2, h3, .brand {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          color: #1c1917;
        }
        nav { 
          background: rgba(250, 250, 249, 0.9) !important; 
          border-bottom: 1px solid #e7e5e4 !important; 
        }
        .hero { 
          background: #f5f5f4; 
          border-bottom: 1.5px solid #1c1917;
          padding: 100px 24px !important;
        }
        .accent { 
          color: #1c1917;
          border-bottom: 2px solid #1c1917;
          padding-bottom: 2px;
        }
        .section-bg { 
          background: white; 
          border: 1px solid #e7e5e4; 
          border-radius: 8px !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          transition: all 0.2s ease;
        }
        .section-bg:hover {
          border-color: #1c1917;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .skill-tag { 
          background: transparent; 
          color: #44403c; 
          border: 1.5px solid #e7e5e4; 
          border-radius: 4px !important;
          font-weight: 500;
        }
        .skill-tag:hover {
          border-color: #1c1917;
          color: #1c1917;
        }
        .project-links a { 
          background: transparent; 
          border: 1.5px solid #1c1917; 
          color: #1c1917; 
          border-radius: 4px !important;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .project-links a:hover {
          background: #1c1917;
          color: white;
        }
        footer {
          border-top: 1px solid #e7e5e4 !important;
        }
      `,
    };

    const style = themeStyles[formData.theme] || themeStyles.developer;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${formData.name} - Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,500&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
${style}
.container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
.hero { padding: 90px 24px; text-align: center; }
.hero h1 { font-family: 'Outfit', 'Playfair Display', sans-serif; font-size: 40px; font-weight: 900; margin-bottom: 16px; letter-spacing: -0.5px; }
.hero .subtitle { font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; margin-bottom: 24px; }
.hero p { font-size: 15px; max-width: 650px; margin: 0 auto 32px; line-height: 1.8; opacity: 0.85; }
.hero .links { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.hero .links a { padding: 10px 24px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: inherit; text-decoration: none; font-size: 13px; font-weight: 600; transition: all 0.2s; }
.hero .links a:hover { background: rgba(255,255,255,0.15); transform: translateY(-1px); }
section { padding: 70px 24px; border-bottom: 1px solid rgba(255,255,255,0.02); }
section h2 { font-size: 26px; font-weight: 800; margin-bottom: 30px; letter-spacing: -0.5px; }
.section-bg { border-radius: 12px; padding: 26px; margin-bottom: 16px; }
.skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tag { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 500; }
.project-card { margin-bottom: 16px; }
.project-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
.project-card p { font-size: 14px; line-height: 1.7; opacity: 0.8; margin-bottom: 14px; }
.project-links { display: flex; gap: 12px; }
.project-links a { padding: 6px 16px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600; }
.exp-item { margin-bottom: 16px; }
.exp-item h3 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
.exp-item .meta { font-size: 12px; opacity: 0.6; margin-bottom: 10px; font-weight: 600; }
.exp-item p { font-size: 14.5px; line-height: 1.7; opacity: 0.8; }
.contact a { color: inherit; text-decoration: none; opacity: 0.9; font-weight: 600; }
.contact p { font-size: 14px; margin-bottom: 8px; }
nav { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); position: sticky; top: 0; backdrop-filter: blur(12px); z-index: 100; }
nav .brand { font-weight: 800; font-size: 18px; letter-spacing: -0.5px; }
nav .nav-links { display: flex; gap: 20px; }
nav .nav-links a { text-decoration: none; color: inherit; font-size: 13px; font-weight: 500; opacity: 0.8; transition: opacity 0.2s; }
nav .nav-links a:hover { opacity: 1; }
footer { padding: 40px 24px; text-align: center; font-size: 12px; opacity: 0.5; }
@media (max-width: 768px) {
  nav { padding: 12px 16px; flex-direction: column; gap: 10px; text-align: center; }
  nav .nav-links { gap: 16px; justify-content: center; width: 100%; }
  .hero { padding: 60px 16px; }
  .hero h1 { font-size: 32px; }
  .hero .subtitle { font-size: 16px; }
  section { padding: 48px 16px; }
  section h2 { font-size: 22px; margin-bottom: 20px; }
  .section-bg { padding: 20px; }
}
</style>
</head>
<body>
<nav>
  <div class="brand">${formData.name}</div>
  <div class="nav-links">
    <a href="#about">About</a>
    <a href="#skills">Skills</a>
    <a href="#projects">Projects</a>
    <a href="#experience">Experience</a>
    <a href="#contact">Contact</a>
  </div>
</nav>

<div class="hero" id="about">
  <h1><span class="accent">${formData.name}</span></h1>
  <div class="subtitle">${formData.title}</div>
  <p>${p.aiAbout || formData.about}</p>
  <div class="links">
    ${formData.email ? `<a href="mailto:${formData.email}">📧 Email</a>` : ""}
    ${formData.github ? `<a href="${formData.github}" target="_blank">💻 GitHub</a>` : ""}
    ${formData.linkedin ? `<a href="${formData.linkedin}" target="_blank">💼 LinkedIn</a>` : ""}
  </div>
</div>

<section id="skills">
  <div class="container">
    <h2>Skills</h2>
    <div class="skills-grid">
      ${formData.skills.map((s) => `<span class="skill-tag">${s}</span>`).join("")}
    </div>
  </div>
</section>

<section id="projects">
  <div class="container">
    <h2>Projects</h2>
    ${p.enhancedProjects.map((proj) => `
    <div class="section-bg project-card">
      <h3>${proj.name}</h3>
      <p>${proj.aiDescription || proj.description}</p>
      <div class="skills-grid" style="margin-bottom: 14px;">
        ${proj.technologies.map((t: string) => `<span class="skill-tag">${t}</span>`).join("")}
      </div>
      <div class="project-links">
        ${proj.url ? `<a href="${proj.url}" target="_blank">Live Demo</a>` : ""}
        ${proj.github ? `<a href="${proj.github}" target="_blank">GitHub</a>` : ""}
      </div>
    </div>`).join("")}
  </div>
</section>

<section id="experience">
  <div class="container">
    <h2>Experience</h2>
    ${p.enhancedExperience.map((exp) => `
    <div class="section-bg exp-item">
      <h3>${exp.role} at ${exp.company}</h3>
      <div class="meta">${exp.duration}</div>
      <p>${exp.aiDescription || exp.description}</p>
    </div>`).join("")}
  </div>
</section>

<section id="contact">
  <div class="container">
    <h2>Get In Touch</h2>
    <div class="section-bg">
      <p style="font-size: 14px; opacity: 0.8; margin-bottom: 16px;">I'm currently open to new opportunities. Whether you have a project in mind or just want to connect, feel free to reach out!</p>
      <div class="contact">
        ${formData.email ? `<p>📧 <a href="mailto:${formData.email}">${formData.email}</a></p>` : ""}
        ${formData.linkedin ? `<p>💼 <a href="${formData.linkedin}" target="_blank">LinkedIn Profile</a></p>` : ""}
        ${formData.github ? `<p>💻 <a href="${formData.github}" target="_blank">GitHub Profile</a></p>` : ""}
      </div>
    </div>
  </div>
</section>

<footer>
  <p>Built with CareerPilot AI • ${formData.name} © ${new Date().getFullYear()}</p>
</footer>
</body>
</html>`;
  };

  const downloadHTML = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.name.replace(/\s+/g, "-")}-portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Portfolio downloaded!");
  };

  if (generatedPortfolio) {
    return (
      <div className="px-4 py-6 md:p-8 max-w-6xl mx-auto w-full">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "rgba(124, 58, 237, 0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--accent-violet-light)",
          }}>
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-outfit" style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>
              Portfolio Generated! 🎉
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Your AI-powered portfolio is ready. Download or view it below.
            </p>
          </div>
        </div>

        {/* AI About Preview */}
        <div className="glass-card p-5 md:p-6 mb-6">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Sparkles className="w-4 h-4" style={{ color: "var(--accent-violet-light)" }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>AI-Generated Professional Summary</h3>
          </div>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {generatedPortfolio.aiAbout}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
          <button onClick={downloadHTML} className="btn-primary">
            <Download className="w-4 h-4" /> Download HTML
          </button>
          <button
            onClick={() => {
              const html = generateHTML();
              const blob = new Blob([html], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              window.open(url, "_blank");
            }}
            className="btn-secondary"
          >
            <ExternalLink className="w-4 h-4" /> Preview in New Tab
          </button>
          <button
            onClick={() => {
              setGeneratedPortfolio(null);
              setCurrentStep(0);
            }}
            className="btn-ghost"
          >
            Create Another
          </button>
        </div>

        {/* Preview iframe */}
        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <span style={{ fontSize: 12, color: "var(--text-muted)", flex: 1, textAlign: "center" }}>
              Portfolio Preview
            </span>
          </div>
          <iframe
            srcDoc={generateHTML()}
            style={{ width: "100%", height: 600, border: "none" }}
            title="Portfolio Preview"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:p-8 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: "rgba(124, 58, 237, 0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--accent-violet-light)",
        }}>
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-outfit" style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>
            AI Portfolio Generator
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Fill in your details and let AI create your professional portfolio
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator" style={{ marginBottom: 32 }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}>
            <div
              className={`step-dot ${i === currentStep ? "active" : i < currentStep ? "completed" : ""}`}
              onClick={() => i < currentStep && setCurrentStep(i)}
              style={{ cursor: i < currentStep ? "pointer" : "default" }}
              title={step}
            >
              {i < currentStep ? "✓" : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-line ${i < currentStep ? "completed" : ""}`} />
            )}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: -24, marginBottom: 24 }}>
        Step {currentStep + 1} of {STEPS.length}: <strong style={{ color: "var(--text-secondary)" }}>{STEPS[currentStep]}</strong>
      </div>

      {/* Step Content */}
      <div className="glass-card p-5 md:p-8">
        {/* Step 0: Basic Info */}
        {currentStep === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
                  Full Name *
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
                  Professional Title *
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Full Stack Developer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
                About You * <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(AI will enhance this)</span>
              </label>
              <textarea
                className="input-field"
                rows={4}
                placeholder="Tell us about yourself, your passion, and what makes you unique..."
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>Email</label>
                <input className="input-field" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>GitHub URL</label>
                <input className="input-field" placeholder="https://github.com/..." value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>LinkedIn URL</label>
                <input className="input-field" placeholder="https://linkedin.com/..." value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Skills */}
        {currentStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Your Skills</h2>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
                Add Skills (press Enter or click Add)
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  className="input-field"
                  placeholder="e.g. React, Node.js, Python..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  style={{ flex: 1 }}
                />
                <button onClick={addSkill} className="btn-primary" style={{ padding: "12px 20px" }}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {formData.skills.map((skill) => (
                <div key={skill} className="tag">
                  {skill}
                  <button onClick={() => removeSkill(skill)}><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              {formData.skills.length === 0 && (
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>No skills added yet</span>
              )}
            </div>
            <div style={{ padding: 16, background: "rgba(6, 182, 212, 0.05)", border: "1px solid rgba(6, 182, 212, 0.15)", borderRadius: 10 }}>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                💡 <strong>Tip:</strong> Add both technical skills (React, Python, SQL) and soft skills (Leadership, Communication) for a complete profile.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Projects */}
        {currentStep === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>Projects</h2>
              <button
                onClick={() => setFormData({
                  ...formData,
                  projects: [...formData.projects, { name: "", description: "", technologies: [], url: "", github: "" }],
                })}
                className="btn-secondary"
                style={{ fontSize: 13, padding: "8px 16px" }}
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>
            {formData.projects.map((project, i) => (
              <div key={i} className="p-4 md:p-5 bg-white/[0.03] border border-[var(--border-color)] rounded-xl">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-violet-light)" }}>Project {i + 1}</span>
                  {formData.projects.length > 1 && (
                    <button
                      onClick={() => setFormData({ ...formData, projects: formData.projects.filter((_, j) => j !== i) })}
                      className="btn-ghost"
                      style={{ color: "#EF4444", padding: "4px 8px" }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input
                    className="input-field"
                    placeholder="Project Name"
                    value={project.name}
                    onChange={(e) => {
                      const p = [...formData.projects];
                      p[i].name = e.target.value;
                      setFormData({ ...formData, projects: p });
                    }}
                  />
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Brief description (AI will enhance it)"
                    value={project.description}
                    onChange={(e) => {
                      const p = [...formData.projects];
                      p[i].description = e.target.value;
                      setFormData({ ...formData, projects: p });
                    }}
                  />
                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      className="input-field"
                      placeholder="Tech (press Enter)"
                      value={techInput[i] || ""}
                      onChange={(e) => setTechInput({ ...techInput, [i]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech(i))}
                      style={{ flex: 1 }}
                    />
                    <button onClick={() => addTech(i)} className="btn-secondary" style={{ padding: "10px 16px" }}>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {project.technologies.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {project.technologies.map((tech) => (
                        <div key={tech} className="tag">
                          {tech}
                          <button onClick={() => {
                            const p = [...formData.projects];
                            p[i].technologies = p[i].technologies.filter((t) => t !== tech);
                            setFormData({ ...formData, projects: p });
                          }}><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      className="input-field"
                      placeholder="Live URL (optional)"
                      value={project.url}
                      onChange={(e) => {
                        const p = [...formData.projects];
                        p[i].url = e.target.value;
                        setFormData({ ...formData, projects: p });
                      }}
                    />
                    <input
                      className="input-field"
                      placeholder="GitHub URL (optional)"
                      value={project.github}
                      onChange={(e) => {
                        const p = [...formData.projects];
                        p[i].github = e.target.value;
                        setFormData({ ...formData, projects: p });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Experience */}
        {currentStep === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>Experience</h2>
              <button
                onClick={() => setFormData({
                  ...formData,
                  experience: [...formData.experience, { company: "", role: "", duration: "", description: "" }],
                })}
                className="btn-secondary"
                style={{ fontSize: 13, padding: "8px 16px" }}
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {formData.experience.map((exp, i) => (
              <div key={i} className="p-4 md:p-5 bg-white/[0.03] border border-[var(--border-color)] rounded-xl">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-cyan-light)" }}>Experience {i + 1}</span>
                  {formData.experience.length > 1 && (
                    <button onClick={() => setFormData({ ...formData, experience: formData.experience.filter((_, j) => j !== i) })} className="btn-ghost" style={{ color: "#EF4444", padding: "4px 8px" }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className="input-field" placeholder="Company Name" value={exp.company} onChange={(e) => { const ex = [...formData.experience]; ex[i].company = e.target.value; setFormData({ ...formData, experience: ex }); }} />
                    <input className="input-field" placeholder="Your Role" value={exp.role} onChange={(e) => { const ex = [...formData.experience]; ex[i].role = e.target.value; setFormData({ ...formData, experience: ex }); }} />
                  </div>
                  <input className="input-field" placeholder="Duration (e.g. Jan 2023 – Present)" value={exp.duration} onChange={(e) => { const ex = [...formData.experience]; ex[i].duration = e.target.value; setFormData({ ...formData, experience: ex }); }} />
                  <textarea className="input-field" rows={2} placeholder="Describe your responsibilities (AI will enhance it)" value={exp.description} onChange={(e) => { const ex = [...formData.experience]; ex[i].description = e.target.value; setFormData({ ...formData, experience: ex }); }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 4: Theme */}
        {currentStep === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>Choose Your Theme</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {THEMES.map((theme) => (
                <div
                  key={theme.id}
                  className={`theme-card ${formData.theme === theme.id ? "selected" : ""}`}
                  onClick={() => setFormData({ ...formData, theme: theme.id as "developer" | "designer" | "minimal" })}
                >
                  <div style={{
                    height: 80, borderRadius: 10, marginBottom: 14,
                    background: theme.id === "developer" 
                      ? "linear-gradient(135deg, #1a1a2e, #16213e)" 
                      : theme.id === "designer"
                      ? "linear-gradient(135deg, #7C3AED, #EC4899)"
                      : "linear-gradient(135deg, #f9fafb, #e2e8f0)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: theme.id === "minimal" ? "#1a1a2e" : "white",
                  }}>
                    {theme.icon}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>{theme.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{theme.description}</div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ padding: 20, background: "rgba(124, 58, 237, 0.06)", border: "1px solid rgba(124, 58, 237, 0.2)", borderRadius: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
                <Sparkles className="w-4 h-4" style={{ display: "inline", marginRight: 6, color: "var(--accent-violet-light)" }} />
                Portfolio Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-[var(--text-secondary)]">
                <span>👤 {formData.name || "—"}</span>
                <span>💼 {formData.title || "—"}</span>
                <span>🎯 {formData.skills.length} skills</span>
                <span>💻 {formData.projects.filter(p => p.name).length} projects</span>
                <span>🏢 {formData.experience.filter(e => e.company).length} experiences</span>
                <span>🎨 {formData.theme} theme</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[var(--border-color)]">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="btn-secondary"
            style={{ opacity: currentStep === 0 ? 0.4 : 1 }}
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button onClick={() => setCurrentStep(currentStep + 1)} className="btn-primary">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary"
              style={{ minWidth: 180, justifyContent: "center" }}
              id="generate-portfolio-btn"
            >
              {isGenerating ? (
                <>
                  <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Portfolio
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
