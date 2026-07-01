# 🚀 CareerPilot AI – AI Career & Portfolio Builder Platform

CareerPilot AI is a premium, SaaS-grade AI career assistant platform. It enables users to generate professional portfolios, build ATS-optimized CVs (downloadable as PDF), practice interactive AI-driven mock interviews, and scan their profiles for optimization scores and suggestions.

---

## ✨ Features

- **🔐 Secure Authentication**: Email + Password sign-in/sign-up and Google OAuth, backed by NextAuth.js.
- **🧑‍💻 User Dashboard**: Visual hub displaying quick stats, recent portfolios/CVs, and fast access to all features.
- **🌐 AI Portfolio Generator**:
  - 5-step wizard to capture background, projects, and skills.
  - Multi-theme generation (Developer, Designer, Minimal).
  - Live sandbox preview, shareable links, and static HTML downloads.
- **📄 AI CV Generator**:
  - Live side-by-side editing and preview.
  - Formats optimized for ATS or Creative styles.
  - High-fidelity PDF export.
- **💬 AI Interview Simulator**:
  - Choose role and difficulty (Easy, Medium, Hard).
  - Employs context-aware dynamic questioning.
  - Provides a comprehensive recruiter scorecard (Strengths, Improvements, and Hiring Decisions).
- **🔍 AI Profile Reviewer**:
  - Scan portfolios via URL or upload CVs as PDF (extracted client-side using `pdf.js`).
  - Displays dynamic scores (Overall, ATS, Readability, Impact).
  - Provides inline professional rewrites and missing keyword highlights.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Vanilla CSS with Framer Motion animations
- **Database**: MongoDB (via Mongoose)
- **AI Engine**: OpenAI API (fallback high-fidelity mock client included)
- **Auth**: NextAuth.js (Credentials & Google Providers)

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection (Atlas or Local)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/careerpilot

# OpenAI API Configuration
OPENAI_API_KEY=your-openai-api-key-here

# NextAuth Configuration
NEXTAUTH_SECRET=careerpilot-ai-dev-secret-change-in-production-32chars
NEXTAUTH_URL=http://localhost:3000

# Optional Google OAuth Keys
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
