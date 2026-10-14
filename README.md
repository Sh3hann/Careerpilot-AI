<div align="center">

# 🚀 CareerPilot AI
### SaaS-Grade AI Career Navigation, Portfolio Architect & Interview Simulator

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<p align="center">
  <b>CareerPilot AI</b> is an intelligent, full-stack career acceleration suite that empowers developers and job seekers to architect ATS-proof CVs, generate live bespoke portfolio websites, undergo rigorous AI technical interviews, and receive real-time recruiter scorecards.
</p>

</div>

---

## ✨ Features

- **🔐 Secure Authentication**: Multi-provider authentication with NextAuth.js (Email/Password + Google OAuth).
- **🧑‍💻 Dynamic User Dashboard**: Real-time activity analytics, recent portfolio builds, ATS scan histories, and quick-action toolbars.
- **🌐 AI Portfolio Architect**:
  - 5-step interactive wizard mapping technical background, experience, and custom domains.
  - Multi-theme generation (Modern Dark, Minimalist Light, Creative Neon).
  - Live interactive sandbox preview with instantaneous static export & shareable URL creation.
- **📄 ATS-Optimized CV Builder**:
  - Split-screen live markdown and typography preview.
  - ATS scoring engine highlighting action verbs, quantifiable metrics, and missing keywords.
  - Direct vector PDF export.
- **💬 Real-Time AI Interview Simulator**:
  - Role-specific dynamic questioning spanning junior to staff software engineering roles.
  - Adaptive difficulty calibration based on candidate answer depth.
  - End-of-session hiring scorecard with breakdown of strengths, growth areas, and hiring recommendations.
- **🔍 Profile & Resume Scanner**:
  - Upload PDF resumes or input portfolio URLs for instant evaluation.
  - Evaluates Readability, Quantifiable Impact, and Technical Keyword Match.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Motion**: React 19, CSS Modules, Framer Motion
- **Database**: MongoDB via Mongoose ODM
- **AI Intelligence**: OpenAI GPT-4 API (with offline mock fallback engine)
- **Authentication**: NextAuth.js v4
- **Document Processing**: pdfjs-dist for client-side resume extraction

---

## 🚀 Getting Started

### 1. Clone the repository
`ash
git clone https://github.com/Sh3hann/Careerpilot-AI.git
cd Careerpilot-AI
`

### 2. Configure Environment Variables
Create a .env.local file in the root directory:
`env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/careerpilot
OPENAI_API_KEY=your-openai-api-key-here
NEXTAUTH_SECRET=careerpilot-ai-dev-secret-change-in-production-32chars
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
`

### 3. Install Dependencies & Launch
`ash
npm install
npm run dev
`

Visit [http://localhost:3000](http://localhost:3000) to start using CareerPilot AI.

---

## 👤 Author

**Akil Shehan**
- Portfolio: [itzshehan.xyz](https://itzshehan.xyz/)
- GitHub: [@Sh3hann](https://github.com/Sh3hann)
- LinkedIn: [Akil Shehan](https://www.linkedin.com/in/akil-shehan-b808b340b)

---

## 📄 License
This project is licensed under the MIT License.