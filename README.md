# Rezumely 🤖⚡ — Next-Gen AI-Powered Resume Builder & Career Intelligence Suite

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![React](https://img.shields.io/badge/React-18.3-blue.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)]()
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)]()
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)]()
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791.svg)]()
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini-orange.svg)]()

> **Transform your job search with AI-driven career intelligence.** Rezumely is an advanced, full-stack, AI-first resume building platform designed to eliminate writer's block, bypass Applicant Tracking Systems (ATS), and craft high-converting, recruiter-ready resumes and cover letters in minutes.

---

## 🌟 Key Highlights & AI Capabilities

| AI Superpower | Purpose & Description | Processing Engine |
| :--- | :--- | :--- |
| 🧠 **AI Executive Summary Generator** | Generates 3 tailored, high-impact professional summary options for any target role | Gemini AI NLP Model |
| ⚡ **AI Work Experience Bullet Generator** | Auto-generates quantifiable, STAR-formatted achievement bullet points | Action-Verb AI Engine |
| 🎯 **AI ATS Matcher & Keyword Gap Analyzer** | Scores resume compatibility against target Job Descriptions and extracts missing keywords | Semantic Vector Gap Analysis |
| ✏️ **AI Content Enhancer & Tone Polish** | Rewrites weak descriptions for maximum impact, conciseness, and executive tone | Multi-Pass Tone Refinement |
| ✉️ **AI Tailored Cover Letter Generator** | Generates bespoke cover letters matching job requirements and resume experience | Contextual LLM Synthesis |
| 📊 **Real-Time ATS Health Scorecard** | Computes live ATS readability, section completeness, and keyword density metrics | Intelligent Audit Engine |

---

## 🤖 Deep Dive: The Rezumely AI Intelligence Suite

Rezumely is built from the ground up as an **AI-first platform**. AI tools are deeply integrated into every step of the editor flow, providing real-time assistance as you type.

```
                  ┌─────────────────────────────────────────┐
                  │    Rezumely AI Intelligence Engine      │
                  └────────────────────┬────────────────────┘
                                       │
      ┌──────────────────┬─────────────┴────────────┬──────────────────┐
      ▼                  ▼                          ▼                  ▼
┌───────────┐    ┌──────────────┐          ┌────────────────┐  ┌──────────────┐
│AI Summary │    │ AI Experience│          │ AI ATS Matcher │  │AI Cover      │
│ Copilot   │    │ Bullet Points│          │ & Keyword Gap  │  │Letter Engine │
└───────────┘    └──────────────┘          └────────────────┘  └──────────────┘
```

### 1. 📝 AI Executive Summary Copilot
- Type your target job title (e.g., *"Senior Full-Stack Developer"* or *"Product Manager"*).
- The AI analyzes industry-specific keywords and crafts **3 distinct summary variants** (Executive, Metric-Focused, and Technical/Skills-Oriented).
- One-click insertion directly into your resume draft.

### 2. 🎯 AI ATS Matcher & Keyword Gap Analysis
- Paste any job posting (from LinkedIn, Indeed, Glassdoor, Greenhouse, Lever, etc.).
- Rezumely performs semantic analysis to provide:
  - **Overall ATS Match Score (%)**
  - **Identified Hard & Soft Skill Keywords**
  - **Critical Keyword Gaps** (Missing skills to add to pass ATS filters)
  - **Actionable Optimization Recommendations**

### 3. ⚡ AI Metric-Driven Achievement Bullet Generator
- Select any work experience entry and click **"Generate Points with AI"**.
- Rezumely produces high-impact, STAR-formatted (Situation, Task, Action, Result) accomplishments with quantifiable metrics (e.g., *"Architected microservices infrastructure reducing deployment time by 60%"*).

### 4. ✏️ AI Content Enhancer & Grammar Polish
- Instantly rewrite draft text to eliminate passive voice, fix grammatical errors, and elevate vocabulary into executive-grade phrasing.

### 5. ✉️ AI Contextual Cover Letter Generator
- Auto-synthesizes your resume experience with the target job posting to produce a personalized, compelling cover letter in seconds.

---

## 🎨 Structured 3-Step Builder Workflow

Rezumely replaces overwhelming single-page clutter with a clean, structured multi-step builder interface:

```
[ Step 1: Select Template ] ──► [ Step 2: Fill Content + AI Assist ] ──► [ Step 3: Customize Style & Export ]
```

1. **Step 1 — Template Selection**: Choose from 8 ATS-engineered layout presets with live preview thumbnails.
2. **Step 2 — Content Entry & AI Assist**: Fill personal details, work history, education, skills, projects, and certifications with contextual AI helpers built into every field.
3. **Step 3 — Customization & Live Preview**: Live preview pane with scale controls (*Fit Page*, *Fit Width*, *Custom Zoom*), color palettes, font selectors, spacing controls, and section reordering.

---

## 📄 8 ATS-Engineered Templates

| Template Name | Design Style | Target Audience & Industry |
| :--- | :--- | :--- |
| 🔹 **Modern** | Two-column sidebar layout with avatar header | Tech, Engineering, Product & Startup roles |
| 🏛️ **Classic** | Timeless single-column serif design | Corporate, Finance, Law & Legal |
| 🌿 **Minimal** | Ultra-clean layout with generous whitespace | Design, Architecture, Copywriting & Media |
| 🎨 **Creative** | Bold color accents & dynamic header section | Marketing, UX/UI, Content Strategy & Arts |
| 💼 **Professional** | Structured corporate headers with dividers | Management, Consulting & Operations |
| 👔 **Executive** | Refined typography with prominent leadership summary | C-Suite, VP, Directors & Senior Management |
| 💻 **Developer** | Monospace tech stack tags & project links focus | Software Engineers, DevOps & Data Science |
| 🎓 **Academic** | Research & publication friendly detailed structure | Research, Higher Education & Scientific Roles |

---

## 🖨️ Pixel-Perfect PDF Export & Dynamic Naming

- **1:1 WYSIWYG Rendering Engine**: Utilizes custom `print-color-adjust` rendering pipeline ensuring zero color loss, background stripping, or layout distortion.
- **Dynamic File Naming**: Automatically titles generated PDFs using your custom Resume Title (e.g., `Software_Developer_Resume.pdf`).
- **Standard A4 & Letter Formatting**: Zero page clipping or broken layouts.

---

## 💾 Dual Storage & State Retention

```
                       ┌──────────────────────────────────────────┐
                       │           Zustand State Store            │
                       └────────────────────┬─────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
       ┌────────────────────────┐                      ┌────────────────────────┐
       │   Guest / Offline Mode │                      │  Authenticated Cloud   │
       │ LocalStorage (Persist) │                      │ PostgreSQL + Prisma    │
       └────────────────────────┘                      └────────────────────────┘
```

- **Guest Mode**: All progress is automatically persisted in browser `localStorage` via Zustand middleware—survives page refreshes with zero data loss.
- **Authenticated Cloud Sync**: Manual save workflow syncs resume JSON data directly to PostgreSQL database via Node/Express REST API.

---

## 🛠️ Technology Stack

### **Frontend**
- **Core Framework**: React 18.3, Vite 5.4, TypeScript 5.5
- **Styling**: Tailwind CSS 3.4, Vanilla CSS Design System Tokens
- **State Management**: Zustand 4.5 (with `devtools` and `persist` middleware)
- **UI Components & Icons**: Radix UI primitives, Lucide React, Framer Motion

### **Backend & Database**
- **Runtime & Server**: Node.js, Express.js (TypeScript)
- **ORM & Database**: Prisma ORM, PostgreSQL Database
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs` password encryption
- **AI Integrations**: Google Gemini API via server service

---

## 📂 Repository Structure

```
rezumely/
├── src/
│   ├── components/
│   │   ├── editor/          # Step-by-step editor (ContentStep, CustomizeStep, TemplateSelector, etc.)
│   │   ├── templates/       # 8 Resume Templates (Modern, Classic, Minimal, Creative, etc.)
│   │   ├── dashboard/       # Dashboard & AI tools (ATSScore, JobMatcher, CoverLetterGenerator)
│   │   └── ui/              # Reusable UI primitives (CustomInput, CustomButton, Card, etc.)
│   ├── data/                # Data schemas & template metadata
│   ├── pages/               # Application Pages (Editor, Dashboard, PublicResume, TemplatesPage, etc.)
│   ├── services/            # Axios HTTP Client
│   ├── store/               # State Stores (resumeStore, authStore, settingsStore)
│   └── utils/               # PDF Export engine & formatters
└── server/
    ├── prisma/              # Prisma DB Schema & Migrations
    └── src/
        ├── controllers/     # Route Controllers (ai, auth, resume, job)
        ├── routes/          # Express Route Handlers
        ├── services/        # AI Prompt Execution Services
        ├── middleware/      # Auth & Error Middleware
        └── lib/             # Prisma Singleton Client
```

---

## 🚀 Installation & Local Setup

### **Prerequisites**
- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn**
- **PostgreSQL Database** (Local instance or cloud provider like Neon / Supabase)

### **Setup Guide**

1. **Clone Repository**:
   ```bash
   git clone https://github.com/dakshn15/remix-of-resume-craft-pro.git
   cd rezumely
   ```

2. **Install Client & Server Dependencies**:
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

3. **Configure Environment Variables**:

   Create `.env` in root folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   Create `.env` in `server/` folder:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:password@localhost:5432/rezumely?schema=public"
   JWT_SECRET="your_secure_jwt_secret_key"
   GEMINI_API_KEY="your_gemini_api_key"
   FRONTEND_URL="http://localhost:5173"
   ```

4. **Initialize Database Schema**:
   ```bash
   cd server
   npx prisma migrate dev --name init
   cd ..
   ```

5. **Launch Application Concurrently**:
   ```bash
   npm run dev
   ```
   - **Frontend UI**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000/api`

---

## 🧪 Verification & Build Commands

```bash
# Verify Frontend TypeScript Compilation
npx tsc -p tsconfig.app.json --noEmit

# Verify Backend Server TypeScript Compilation
npx tsc -p server/tsconfig.json --noEmit

# Production Build Bundle
npm run build
```

---

## 📜 License

*© 2026 Rezumely. All rights reserved. Created and maintained as an AI-powered full-stack career platform.*
