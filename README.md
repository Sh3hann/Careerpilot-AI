<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,38&height=200&section=header&text=🚀%20CareerPilot%20AI&fontSize=46&fontAlignY=36&desc=SaaS-Grade%20AI%20Career%20Architect%20%7C%20Interview%20Simulator%20%7C%20ATS%20Engine&descAlignY=58&descSize=16&fontColor=ffffff" width="100%" alt="CareerPilot AI Header" />

  <p align="center">
    <b>An intelligent career acceleration suite empowering developers to architect ATS-proof resumes, generate live custom portfolios, and practice with real-time AI technical interview simulations.</b>
  </p>

  <p align="center">
    <a href="https://github.com/Sh3hann/Careerpilot-AI">
      <img src="https://img.shields.io/badge/💻_Source_Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="Source Code" />
    </a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=flat-square&logo=openai&logoColor=white" alt="OpenAI" />
    <img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="License" />
  </p>

</div>

---

## ⚡ Core Platform Capabilities

<div align="center">

| Capability | Scope | Output |
|:---|:---|:---|
| 🌐 **AI Portfolio Architect** | 5-step wizard capturing technical trajectory, GitHub highlights, and projects with real-time sandbox previews. | Live responsive portfolio with instant static HTML and shareable export. |
| 📄 **ATS-Optimized CV Engine** | Split-screen live typography editor with ATS scoring algorithms detecting action verbs and impact metrics. | High-fidelity vector PDF ready for job applications. |
| 💬 **AI Technical Interviewer** | Dynamic interview simulator adapting questions based on difficulty level and candidate depth. | Comprehensive recruiter hiring scorecard with actionable feedback. |
| 🔍 **Profile & Resume Auditor** | In-depth audit tool evaluating uploaded CVs and portfolio links for keyword match and readability. | Dynamic ATS impact score and inline professional rewriting suggestions. |
| 🔐 **Enterprise Auth & Security** | Frictionless onboarding via NextAuth.js supporting OAuth (Google) and credential authentication. | Secure personal dashboard tracking generation history and interview metrics. |

</div>

---

## 🏗️ Intelligence Pipeline Architecture

`mermaid
flowchart TD
    subgraph Input ["User Input & Profile Engine"]
        A["Developer Background & Skills"]
        B["Target Role & Seniority Level"]
        C["Existing CV Upload (PDF Parser)"]
    end

    subgraph CoreEngine ["Next.js & AI Reasoning Layer"]
        D["Context Aggregator & Prompt Builder"]
        E["OpenAI GPT-4 Intelligence Core"]
        F["ATS Optimization & Keyword Matching"]
    end

    subgraph Deliverables ["Bespoke Career Deliverables"]
        G["Live Portfolio Website Generation"]
        H["High-Scoring ATS-Proof Vector CV"]
        I["Interactive AI Interview & Recruiter Scorecard"]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    F --> I
`

<details>
<summary><b>📂 View Modular Codebase Organization</b></summary>

`
Careerpilot-AI/
├── app/                      # Next.js App Router (dashboard, portfolio, cv-builder, interview)
├── components/               # Modular UI widgets, editor splits & motion controls
├── lib/                      # OpenAI client gateway & ATS scoring heuristics
├── models/                   # Mongoose schemas (User, Portfolio, Resume, Interview)
└── types/                    # Shared TypeScript domain contracts
`

</details>

---

## 🚀 Getting Started

### 1. Clone the repository
`ash
git clone https://github.com/Sh3hann/Careerpilot-AI.git
cd Careerpilot-AI
npm install
`

### 2. Configure Environment Variables
Create a .env.local file in the project root:
`env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/careerpilot
OPENAI_API_KEY=your_openai_api_key_here
NEXTAUTH_SECRET=careerpilot-secret-change-in-prod-32chars
NEXTAUTH_URL=http://localhost:3000
`

### 3. Run Development Server
`ash
npm run dev
`
Open **http://localhost:3000** in your browser.

---

<div align="center">

### 👨‍💻 Developed with Precision by [Akil Shehan](https://github.com/Sh3hann)

[![Website](https://img.shields.io/badge/Portfolio-itzshehan.xyz-f59e0b?style=flat-square&logo=google-chrome&logoColor=white)](https://itzshehan.xyz/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Akil_Shehan-0077b5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/akil-shehan-b808b340b)
[![GitHub](https://img.shields.io/badge/GitHub-@Sh3hann-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Sh3hann)

<sub>© 2026 CareerPilot AI. Released under the MIT License.</sub>

</div>