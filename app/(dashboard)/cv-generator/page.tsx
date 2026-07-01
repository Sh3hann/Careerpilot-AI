"use client";
import { useState } from "react";
import {
  FileText, Plus, Trash2, Sparkles, Download, Eye,
  CheckCircle, AlertCircle, X
} from "lucide-react";
import toast from "react-hot-toast";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  title: string;
  summary: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  responsibilities: string;
  aiResponsibilities?: string;
}

interface Skills {
  technical: string[];
  soft: string[];
  tools: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  url: string;
}

interface GeneratedCV {
  id: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skills;
  projects: Project[];
  version: string;
  atsScore: number;
  improvements: string[];
  keySkillsHighlight: string[];
}

const TABS = ["Personal Info", "Education", "Experience", "Skills", "Projects"];

export default function CVGeneratorPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [version, setVersion] = useState<"ats" | "creative">("ats");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<GeneratedCV | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [skillInput, setSkillInput] = useState({ technical: "", soft: "", tools: "" });

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "", email: "", phone: "", location: "", linkedin: "",
    github: "", website: "", title: "", summary: "",
  });
  const [education, setEducation] = useState<Education[]>([
    { institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" },
  ]);
  const [experience, setExperience] = useState<Experience[]>([
    { company: "", role: "", startDate: "", endDate: "", location: "", responsibilities: "" },
  ]);
  const [skills, setSkills] = useState<Skills>({ technical: [], soft: [], tools: [] });
  const [projects, setProjects] = useState<Project[]>([
    { name: "", description: "", technologies: [], url: "" },
  ]);

  const addSkill = (type: keyof Skills) => {
    const val = skillInput[type].trim();
    if (val && !skills[type].includes(val)) {
      setSkills({ ...skills, [type]: [...skills[type], val] });
      setSkillInput({ ...skillInput, [type]: "" });
    }
  };

  const handleGenerate = async () => {
    if (!personalInfo.name || !personalInfo.email || !personalInfo.title) {
      toast.error("Please fill in your name, email, and professional title");
      setActiveTab(0);
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalInfo,
          education: education.filter((e) => e.institution),
          experience: experience.filter((e) => e.company),
          skills,
          projects: projects.filter((p) => p.name),
          version,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Generation failed");
        return;
      }

      setGeneratedCV(data.cv);
      setShowPreview(true);
      toast.success(`${version.toUpperCase()} CV generated! 🎉`);
    } catch {
      toast.error("Failed to generate CV. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePrintableHTML = (cv: GeneratedCV) => {
    const isATS = cv.version === "ats";
    
    if (isATS) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${cv.personalInfo.name} - Resume</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
    color: #111827; 
    background: white; 
    font-size: 10pt; 
    line-height: 1.5; 
    -webkit-font-smoothing: antialiased;
  }
  .page { 
    max-width: 800px; 
    margin: 0 auto; 
    padding: 40px 50px; 
  }
  .header { 
    text-align: center;
    border-bottom: 2px solid #111827; 
    padding-bottom: 16px; 
    margin-bottom: 20px; 
  }
  .name { 
    font-size: 22pt; 
    font-weight: 700; 
    letter-spacing: -0.5px;
    color: #111827;
  }
  .title-line { 
    font-size: 12pt; 
    font-weight: 600;
    color: #4b5563; 
    margin-top: 4px; 
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .contact-row { 
    display: flex; 
    flex-wrap: wrap; 
    gap: 12px; 
    justify-content: center;
    font-size: 9pt; 
    color: #4b5563; 
  }
  .contact-row span { 
    display: flex; 
    align-items: center; 
  }
  .contact-row span:not(:last-child)::after {
    content: "|";
    margin-left: 12px;
    color: #d1d5db;
  }
  .section { 
    margin-bottom: 18px; 
  }
  .section-title { 
    font-size: 11pt; 
    font-weight: 700; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    color: #111827; 
    border-bottom: 1.5px solid #111827; 
    padding-bottom: 3px; 
    margin-bottom: 10px; 
  }
  .summary { 
    font-size: 9.5pt; 
    color: #374151; 
    line-height: 1.6; 
  }
  .exp-item { 
    margin-bottom: 12px; 
  }
  .exp-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: baseline; 
    margin-bottom: 2px;
  }
  .exp-role { 
    font-weight: 700; 
    font-size: 10.5pt;
    color: #111827;
  }
  .exp-dates { 
    font-size: 9.5pt; 
    color: #4b5563; 
    font-weight: 500;
  }
  .exp-company { 
    font-size: 9.5pt; 
    font-style: italic; 
    color: #374151; 
    margin-bottom: 4px; 
  }
  .exp-desc { 
    font-size: 9.5pt; 
    color: #374151; 
    white-space: pre-line; 
    line-height: 1.5; 
    padding-left: 12px;
  }
  .edu-item { 
    margin-bottom: 10px; 
  }
  .skills-list {
    font-size: 9.5pt;
    color: #374151;
    line-height: 1.6;
  }
  .skills-list strong {
    color: #111827;
  }
  .proj-item { 
    margin-bottom: 10px; 
  }
  .proj-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2px;
  }
  .proj-name { 
    font-weight: 700; 
    font-size: 10.5pt;
    color: #111827;
  }
  .proj-url {
    font-size: 9pt;
    color: #2563eb;
    text-decoration: none;
  }
  .proj-desc {
    font-size: 9.5pt;
    color: #374151;
    line-height: 1.5;
  }
  @media print {
    body { font-size: 9pt; }
    .page { padding: 20px 30px; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="name">${cv.personalInfo.name}</div>
    <div class="title-line">${cv.personalInfo.title}</div>
    <div class="contact-row">
      ${cv.personalInfo.email ? `<span>${cv.personalInfo.email}</span>` : ""}
      ${cv.personalInfo.phone ? `<span>${cv.personalInfo.phone}</span>` : ""}
      ${cv.personalInfo.location ? `<span>${cv.personalInfo.location}</span>` : ""}
      ${cv.personalInfo.linkedin ? `<span>LinkedIn</span>` : ""}
      ${cv.personalInfo.github ? `<span>GitHub</span>` : ""}
    </div>
  </div>

  ${cv.personalInfo.summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary">${cv.personalInfo.summary}</p>
  </div>` : ""}

  ${cv.experience.length > 0 && cv.experience[0].company ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${cv.experience.map((exp) => `
    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-role">${exp.role}</span>
        <span class="exp-dates">${exp.startDate} – ${exp.endDate}</span>
      </div>
      <div class="exp-company">${exp.company}${exp.location ? ` • ${exp.location}` : ""}</div>
      <div class="exp-desc">${exp.aiResponsibilities || exp.responsibilities}</div>
    </div>`).join("")}
  </div>` : ""}

  ${cv.education.length > 0 && cv.education[0].institution ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${cv.education.map((edu) => `
    <div class="edu-item">
      <div class="exp-header">
        <span class="exp-role">${edu.degree}${edu.field ? ` in ${edu.field}` : ""}</span>
        <span class="exp-dates">${edu.startDate} – ${edu.endDate}</span>
      </div>
      <div class="exp-company">${edu.institution}${edu.gpa ? ` • GPA: ${edu.gpa}` : ""}</div>
    </div>`).join("")}
  </div>` : ""}

  ${cv.skills.technical.length > 0 ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills-list">
      ${cv.skills.technical.length > 0 ? `<div style="margin-bottom: 4px;"><strong>Technical Skills:</strong> ${cv.skills.technical.join(", ")}</div>` : ""}
      ${cv.skills.soft?.length > 0 ? `<div style="margin-bottom: 4px;"><strong>Soft Skills:</strong> ${cv.skills.soft.join(", ")}</div>` : ""}
      ${cv.skills.tools?.length > 0 ? `<div><strong>Tools & Technologies:</strong> ${cv.skills.tools.join(", ")}</div>` : ""}
    </div>
  </div>` : ""}

  ${cv.projects && cv.projects.length > 0 && cv.projects[0].name ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${cv.projects.map((proj) => `
    <div class="proj-item">
      <div class="proj-header">
        <span class="proj-name">${proj.name}</span>
        ${proj.url ? `<a href="${proj.url}" class="proj-url" target="_blank">${proj.url.replace(/^https?:\/\/(www\.)?/, '')}</a>` : ""}
      </div>
      <div class="proj-desc">${proj.description}</div>
    </div>`).join("")}
  </div>` : ""}
</div>
</body>
</html>`;
    } else {
      // Creative Premium Two-Column Layout
      return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${cv.personalInfo.name} - Portfolio CV</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: 'Inter', sans-serif; 
    color: #1f2937; 
    background: #f9fafb; 
    line-height: 1.5;
  }
  .page { 
    max-width: 850px; 
    margin: 0 auto; 
    background: white;
    display: flex;
    min-height: 11in;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .sidebar { 
    width: 33%; 
    background: #0f172a; 
    color: #f1f5f9; 
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  .main-content { 
    width: 67%; 
    padding: 40px 36px;
    display: flex;
    flex-direction: column;
    gap: 26px;
  }
  .name { 
    font-family: 'Outfit', sans-serif;
    font-size: 24pt; 
    font-weight: 800; 
    color: white;
    line-height: 1.1;
  }
  .title-line { 
    font-family: 'Outfit', sans-serif;
    font-size: 11pt; 
    font-weight: 600;
    color: #38bdf8; 
    margin-top: 6px; 
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .sidebar-section-title {
    font-family: 'Outfit', sans-serif;
    font-size: 10pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #38bdf8;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    padding-bottom: 6px;
    margin-bottom: 12px;
  }
  .contact-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .contact-item {
    font-size: 9pt;
    color: #cbd5e1;
    word-break: break-all;
  }
  .skills-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .skills-subgroup-title {
    font-size: 8.5pt;
    font-weight: 700;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 6px;
  }
  .skills-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .skill-pill { 
    padding: 4px 10px; 
    border-radius: 6px; 
    font-size: 8.5pt; 
    background: rgba(255,255,255,0.08); 
    color: #e2e8f0; 
    border: 1px solid rgba(255,255,255,0.15);
    font-weight: 500;
  }
  .edu-item {
    margin-bottom: 12px;
  }
  .edu-degree {
    font-size: 9.5pt;
    font-weight: 700;
    color: white;
  }
  .edu-inst {
    font-size: 8.5pt;
    color: #cbd5e1;
    margin-top: 2px;
  }
  .edu-dates {
    font-size: 8pt;
    color: #94a3b8;
    margin-top: 1px;
  }
  .main-section-title {
    font-family: 'Outfit', sans-serif;
    font-size: 13pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #0f172a;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 4px;
    margin-bottom: 14px;
  }
  .main-section-title span {
    border-bottom: 2.5px solid #0284c7;
    padding-bottom: 4px;
    display: inline-block;
    margin-bottom: -6.5px;
  }
  .summary { 
    font-size: 9.5pt; 
    color: #4b5563; 
    line-height: 1.6; 
  }
  .exp-item { 
    margin-bottom: 18px; 
  }
  .exp-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .exp-role { 
    font-weight: 700; 
    font-size: 11pt;
    color: #0f172a;
  }
  .exp-company { 
    font-size: 9.5pt; 
    color: #0284c7; 
    font-weight: 600;
    margin-top: 2px;
    margin-bottom: 6px;
  }
  .exp-dates { 
    font-size: 8.5pt; 
    color: #6b7280; 
    font-weight: 500;
  }
  .exp-desc { 
    font-size: 9pt; 
    color: #374151; 
    white-space: pre-line; 
    line-height: 1.5; 
  }
  .proj-item {
    margin-bottom: 14px;
  }
  .proj-name {
    font-weight: 700;
    font-size: 10.5pt;
    color: #0f172a;
    display: inline-block;
  }
  .proj-url {
    font-size: 8.5pt;
    color: #0284c7;
    text-decoration: none;
    margin-left: 8px;
    font-weight: 500;
  }
  .proj-desc {
    font-size: 9pt;
    color: #4b5563;
    margin-top: 3px;
    line-height: 1.5;
  }
</style>
</head>
<body>
<div class="page">
  <div class="sidebar">
    <div>
      <div class="name">${cv.personalInfo.name}</div>
      <div class="title-line">${cv.personalInfo.title}</div>
    </div>

    <div>
      <div class="sidebar-section-title">Contact</div>
      <div class="contact-list">
        ${cv.personalInfo.email ? `<div class="contact-item">✉ ${cv.personalInfo.email}</div>` : ""}
        ${cv.personalInfo.phone ? `<div class="contact-item">📱 ${cv.personalInfo.phone}</div>` : ""}
        ${cv.personalInfo.location ? `<div class="contact-item">📍 ${cv.personalInfo.location}</div>` : ""}
        ${cv.personalInfo.linkedin ? `<div class="contact-item">💼 ${cv.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</div>` : ""}
        ${cv.personalInfo.github ? `<div class="contact-item">💻 ${cv.personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</div>` : ""}
        ${cv.personalInfo.website ? `<div class="contact-item">🌐 ${cv.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</div>` : ""}
      </div>
    </div>

    <div>
      <div class="sidebar-section-title">Skills</div>
      <div class="skills-list">
        ${cv.skills.technical.length > 0 ? `
        <div>
          <div class="skills-subgroup-title">Technical</div>
          <div class="skills-tags">
            ${cv.skills.technical.map((s) => `<span class="skill-pill">${s}</span>`).join("")}
          </div>
        </div>` : ""}
        ${cv.skills.soft?.length > 0 ? `
        <div>
          <div class="skills-subgroup-title">Soft Skills</div>
          <div class="skills-tags">
            ${cv.skills.soft.map((s) => `<span class="skill-pill">${s}</span>`).join("")}
          </div>
        </div>` : ""}
        ${cv.skills.tools?.length > 0 ? `
        <div>
          <div class="skills-subgroup-title">Tools</div>
          <div class="skills-tags">
            ${cv.skills.tools.map((s) => `<span class="skill-pill">${s}</span>`).join("")}
          </div>
        </div>` : ""}
      </div>
    </div>

    ${cv.education.length > 0 && cv.education[0].institution ? `
    <div>
      <div class="sidebar-section-title">Education</div>
      ${cv.education.map((edu) => `
      <div class="edu-item">
        <div class="edu-degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ""}</div>
        <div class="edu-inst">${edu.institution}${edu.gpa ? ` • GPA: ${edu.gpa}` : ""}</div>
        <div class="edu-dates">${edu.startDate} – ${edu.endDate}</div>
      </div>`).join("")}
    </div>` : ""}
  </div>

  <div class="main-content">
    ${cv.personalInfo.summary ? `
    <div>
      <div class="main-section-title"><span>About Me</span></div>
      <p class="summary">${cv.personalInfo.summary}</p>
    </div>` : ""}

    ${cv.experience.length > 0 && cv.experience[0].company ? `
    <div>
      <div class="main-section-title"><span>Experience</span></div>
      ${cv.experience.map((exp) => `
      <div class="exp-item">
        <div class="exp-header">
          <span class="exp-role">${exp.role}</span>
          <span class="exp-dates">${exp.startDate} – ${exp.endDate}</span>
        </div>
        <div class="exp-company">${exp.company}${exp.location ? ` • ${exp.location}` : ""}</div>
        <div class="exp-desc">${exp.aiResponsibilities || exp.responsibilities}</div>
      </div>`).join("")}
    </div>` : ""}

    ${cv.projects && cv.projects.length > 0 && cv.projects[0].name ? `
    <div>
      <div class="main-section-title"><span>Key Projects</span></div>
      ${cv.projects.map((proj) => `
      <div class="proj-item">
        <div>
          <span class="proj-name">${proj.name}</span>
          ${proj.url ? `<a href="${proj.url}" class="proj-url" target="_blank">Link ↗</a>` : ""}
        </div>
        <div class="proj-desc">${proj.description}</div>
      </div>`).join("")}
    </div>` : ""}
  </div>
</div>
</body>
</html>`;
    }
  };

  const downloadPDF = () => {
    if (!generatedCV) return;
    const html = generatePrintableHTML(generatedCV);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    toast.success("Opening print dialog for PDF export...");
  };

  return (
    <div className="px-4 py-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: "rgba(6, 182, 212, 0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--accent-cyan-light)",
        }}>
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-outfit" style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>
            AI CV Generator
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Create an ATS-optimized or creative CV with AI-enhanced content
          </p>
        </div>
      </div>

      <div className={`grid gap-6 ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Form Panel */}
        <div>
          {/* Version Toggle */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {(["ats", "creative"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVersion(v)}
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  border: `1px solid ${version === v ? "var(--accent-violet-light)" : "var(--border-color)"}`,
                  background: version === v ? "rgba(124, 58, 237, 0.12)" : "transparent",
                  color: version === v ? "var(--accent-violet-light)" : "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {v === "ats" ? "📄 ATS-Optimized" : "🎨 Creative"}
              </button>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="tab-nav" style={{ marginBottom: 24, overflowX: "auto" }}>
            {TABS.map((tab, i) => (
              <button key={i} className={`tab-item ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>
                {tab}
              </button>
            ))}
          </div>

          <div className="glass-card" style={{ padding: 28 }}>
            {/* Tab 0: Personal Info */}
            {activeTab === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Full Name *</label>
                    <input className="input-field" placeholder="John Doe" value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Professional Title *</label>
                    <input className="input-field" placeholder="Frontend Developer" value={personalInfo.title} onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Email *</label>
                    <input className="input-field" type="email" placeholder="john@example.com" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Phone</label>
                    <input className="input-field" placeholder="+1 234 567 8900" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Location</label>
                    <input className="input-field" placeholder="New York, NY" value={personalInfo.location} onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>LinkedIn</label>
                    <input className="input-field" placeholder="linkedin.com/in/johndoe" value={personalInfo.linkedin} onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>GitHub</label>
                    <input className="input-field" placeholder="github.com/johndoe" value={personalInfo.github} onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Website</label>
                    <input className="input-field" placeholder="johndoe.com" value={personalInfo.website} onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>
                    Professional Summary <span style={{ color: "var(--text-muted)" }}>(AI will enhance)</span>
                  </label>
                  <textarea className="input-field" rows={3} placeholder="Brief overview of your professional background and goals..." value={personalInfo.summary} onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })} />
                </div>
              </div>
            )}

            {/* Tab 1: Education */}
            {activeTab === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {education.map((edu, i) => (
                  <div key={i} style={{ padding: 16, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-cyan-light)" }}>Education {i + 1}</span>
                      {education.length > 1 && (
                        <button onClick={() => setEducation(education.filter((_, j) => j !== i))} className="btn-ghost" style={{ color: "#EF4444", padding: "2px 6px" }}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input className="input-field" placeholder="Institution" value={edu.institution} onChange={(e) => { const ed = [...education]; ed[i].institution = e.target.value; setEducation(ed); }} style={{ gridColumn: "1/-1" }} />
                      <input className="input-field" placeholder="Degree (e.g. B.Sc.)" value={edu.degree} onChange={(e) => { const ed = [...education]; ed[i].degree = e.target.value; setEducation(ed); }} />
                      <input className="input-field" placeholder="Field of Study" value={edu.field} onChange={(e) => { const ed = [...education]; ed[i].field = e.target.value; setEducation(ed); }} />
                      <input className="input-field" placeholder="Start Year" value={edu.startDate} onChange={(e) => { const ed = [...education]; ed[i].startDate = e.target.value; setEducation(ed); }} />
                      <input className="input-field" placeholder="End Year (or Present)" value={edu.endDate} onChange={(e) => { const ed = [...education]; ed[i].endDate = e.target.value; setEducation(ed); }} />
                      <input className="input-field" placeholder="GPA (optional)" value={edu.gpa} onChange={(e) => { const ed = [...education]; ed[i].gpa = e.target.value; setEducation(ed); }} />
                    </div>
                  </div>
                ))}
                <button onClick={() => setEducation([...education, { institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }])} className="btn-secondary" style={{ alignSelf: "flex-start" }}>
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>
            )}

            {/* Tab 2: Experience */}
            {activeTab === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {experience.map((exp, i) => (
                  <div key={i} style={{ padding: 16, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-violet-light)" }}>Experience {i + 1}</span>
                      {experience.length > 1 && (
                        <button onClick={() => setExperience(experience.filter((_, j) => j !== i))} className="btn-ghost" style={{ color: "#EF4444", padding: "2px 6px" }}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input className="input-field" placeholder="Company" value={exp.company} onChange={(e) => { const ex = [...experience]; ex[i].company = e.target.value; setExperience(ex); }} />
                      <input className="input-field" placeholder="Role / Title" value={exp.role} onChange={(e) => { const ex = [...experience]; ex[i].role = e.target.value; setExperience(ex); }} />
                      <input className="input-field" placeholder="Start (e.g. Jan 2022)" value={exp.startDate} onChange={(e) => { const ex = [...experience]; ex[i].startDate = e.target.value; setExperience(ex); }} />
                      <input className="input-field" placeholder="End (or Present)" value={exp.endDate} onChange={(e) => { const ex = [...experience]; ex[i].endDate = e.target.value; setExperience(ex); }} />
                      <input className="input-field" placeholder="Location" value={exp.location} onChange={(e) => { const ex = [...experience]; ex[i].location = e.target.value; setExperience(ex); }} style={{ gridColumn: "1/-1" }} />
                      <textarea className="input-field" rows={3} placeholder="Key responsibilities and achievements (AI will enhance with action verbs and metrics)" value={exp.responsibilities} onChange={(e) => { const ex = [...experience]; ex[i].responsibilities = e.target.value; setExperience(ex); }} style={{ gridColumn: "1/-1" }} />
                    </div>
                  </div>
                ))}
                <button onClick={() => setExperience([...experience, { company: "", role: "", startDate: "", endDate: "", location: "", responsibilities: "" }])} className="btn-secondary" style={{ alignSelf: "flex-start" }}>
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>
            )}

            {/* Tab 3: Skills */}
            {activeTab === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {(["technical", "soft", "tools"] as const).map((type) => (
                  <div key={type}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 10, textTransform: "capitalize" }}>
                      {type === "technical" ? "Technical Skills" : type === "soft" ? "Soft Skills" : "Tools & Technologies"}
                    </label>
                    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <input
                        className="input-field"
                        placeholder={`Add ${type} skill...`}
                        value={skillInput[type]}
                        onChange={(e) => setSkillInput({ ...skillInput, [type]: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(type))}
                        style={{ flex: 1 }}
                      />
                      <button onClick={() => addSkill(type)} className="btn-secondary" style={{ padding: "10px 16px" }}>
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {skills[type].map((s) => (
                        <div key={s} className="tag">
                          {s}
                          <button onClick={() => setSkills({ ...skills, [type]: skills[type].filter((sk) => sk !== s) })}><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Projects */}
            {activeTab === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {projects.map((proj, i) => (
                  <div key={i} style={{ padding: 16, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-violet-light)" }}>Project {i + 1}</span>
                      {projects.length > 1 && (
                        <button onClick={() => setProjects(projects.filter((_, j) => j !== i))} className="btn-ghost" style={{ color: "#EF4444", padding: "2px 6px" }}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <input className="input-field" placeholder="Project Name" value={proj.name} onChange={(e) => { const p = [...projects]; p[i].name = e.target.value; setProjects(p); }} />
                      <textarea className="input-field" rows={2} placeholder="Description" value={proj.description} onChange={(e) => { const p = [...projects]; p[i].description = e.target.value; setProjects(p); }} />
                      <input className="input-field" placeholder="Project URL (optional)" value={proj.url} onChange={(e) => { const p = [...projects]; p[i].url = e.target.value; setProjects(p); }} />
                    </div>
                  </div>
                ))}
                <button onClick={() => setProjects([...projects, { name: "", description: "", technologies: [], url: "" }])} className="btn-secondary" style={{ alignSelf: "flex-start" }}>
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
            )}

            {/* Generate Buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border-color)", flexWrap: "wrap" }}>
              <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary" id="generate-cv-btn">
                {isGenerating ? (
                  <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} /> Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate {version.toUpperCase()} CV</>
                )}
              </button>
              {generatedCV && (
                <>
                  <button onClick={() => setShowPreview(!showPreview)} className="btn-secondary">
                    <Eye className="w-4 h-4" /> {showPreview ? "Hide Preview" : "Show Preview"}
                  </button>
                  <button onClick={downloadPDF} className="btn-secondary">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && generatedCV && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>CV Preview</h2>
              <div style={{ display: "flex", gap: 8 }}>
                {generatedCV.atsScore && (
                  <span className="badge badge-green">
                    ATS Score: {generatedCV.atsScore}%
                  </span>
                )}
                <button onClick={downloadPDF} className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
                  <Download className="w-4 h-4" /> Print/PDF
                </button>
              </div>
            </div>

            {/* ATS Improvements */}
            {generatedCV.improvements && generatedCV.improvements.length > 0 && (
              <div style={{ marginBottom: 16, padding: 16, background: "rgba(6, 182, 212, 0.05)", border: "1px solid rgba(6, 182, 212, 0.15)", borderRadius: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 13, fontWeight: 700, color: "var(--accent-cyan-light)" }}>
                  <AlertCircle className="w-4 h-4" /> AI Suggestions
                </div>
                {generatedCV.improvements.slice(0, 2).map((imp, i) => (
                  <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>• {imp}</div>
                ))}
              </div>
            )}

            {/* CV Preview */}
            <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden", maxHeight: 700, overflowY: "auto" }}>
              <iframe
                srcDoc={generatePrintableHTML(generatedCV)}
                style={{ width: "100%", height: 700, border: "none", background: "white" }}
                title="CV Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
