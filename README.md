# Rezumely

**Your Career, Perfected. 🚀**

Rezumely is a premium, full-stack resume builder designed to help job seekers stand out in today's competitive market. Built from the ground up to empower professionals, it offers an intuitive editing experience, flawless PDF generation, and AI-driven insights to ensure your resume gets noticed.

## ✨ Why Rezumely?

- **Real-Time Editor:** Watch your resume assemble instantly as you type. Sort, edit, and organize your experience with a seamless drag-and-drop interface.
- **ATS-Optimized Templates:** Choose from beautifully crafted templates (Professional, Executive, Classic, and Academic). All templates are rigorously designed to be machine-readable by Applicant Tracking Systems—meaning no unparseable graphics or broken tables.
- **AI Job Matcher:** Paste a targeted job description directly into the editor. Our AI engine instantly analyzes your resume, scores your compatibility, and suggests essential missing keywords.
- **Pixel-Perfect PDF Export:** Say goodbye to awkward page breaks and shifting text. Rezumely utilizes a custom-built rendering engine to deliver a pristine, 1:1 single-page PDF that perfectly mirrors your preview.
- **Secure Cloud Save:** Create an account to securely save your resumes to the cloud. Access, edit, and download your documents from any device, anytime.

## 🛠️ The Technology Behind It

Rezumely was personally developed and engineered as a robust full-stack application.

- **Frontend Ecosystem:** React, Vite, and TypeScript power the responsive UI.
- **Design System:** Built using Tailwind CSS for utility-first styling, Framer Motion for liquid-smooth animations, and Radix UI primitives for accessible component architecture.
- **Backend Architecture:** A scalable Node.js API handles secure authentication, user sessions, and AI service integrations.
- **Data Persistence:** PostgreSQL paired with Prisma ORM ensures fast, reliable, and secure data storage for all user accounts and saved resumes.
- **PDF Generation Engine:** A highly complex, custom-tuned pipeline utilizing `html2canvas` and `jsPDF`.

## � Getting Started (Local Setup)

If you are visiting this repository and would like to run the project locally on your machine, follow these steps.

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A PostgreSQL database (e.g., Neon serverless, local PostgreSQL instance)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rezumely.git
   cd rezumely
   ```

2. **Install dependencies**
   This repository utilizes concurrent scripts to run both the client and server.
   ```bash
   npm install
   # Next, navigate to the server and install its discrete dependencies:
   cd server
   npm install
   cd ..
   ```

3. **Configure Environment Variables**
   Create two `.env` files—one at the root for the frontend, and one inside the `server/` folder for the backend.
   
   **Root `.env` (Frontend):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   **`server/.env` (Backend):**
   ```env
   # Replace with your actual Postgres connection string
   DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
   PORT=5000
   JWT_SECRET="your-super-secret-jwt-key"
   FRONTEND_URL="http://localhost:5173"
   ```

4. **Initialize the Database**
   Push the Prisma schema to your connected PostgreSQL database.
   ```bash
   cd server
   npx prisma migrate dev --name init
   cd ..
   ```

5. **Start the Development Server**
   Start both the Vite frontend client and Node/Express backend simultaneously:
   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:5173`.

## �💼 Built for You

Rezumely is currently deployed and actively helping users achieve their career goals. 

Whether you are looking for your first internship, transitioning into a new industry, or seeking an executive role, Rezumely provides the tools you need to build a compelling narrative.

---

*© 2026 Rezumely. Created and maintained as a proprietary personal project. All rights reserved. Do not clone, distribute, or host without explicit permission.*
