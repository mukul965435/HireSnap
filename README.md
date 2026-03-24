# HireSnap - AI-Powered Resume Analyzer & Job Matcher 

HireSnap is a production-ready MERN application that helps users optimize their resumes for Applicant Tracking Systems (ATS) and match them with relevant job opportunities using semantic embeddings and AI-driven analysis.

## Features
- **Smart Parsing**: Extract skills, experience, and education from PDF/DOCX.
- **AI Matcher**: Compare your resume vs job descriptions with semantic similarity scoring.
- **ATS Optimizer**: Get AI-generated bullet points and keyword suggestions.
- **Job Recommendations**: Skill-based matching with mock LinkedIn/Instahyre integration.
- **Modern Dashboard**: Premium dark-mode UI inspired by Granola.ai.

##Tech Stack
- **Frontend**: React (Vite), Framer Motion, Chart.js, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **AI**: LLaMA 3 (via Ollama or Groq) for high-performance privacy-focused analysis.
- **Auth**: JWT with Access/Refresh tokens, Bcrypt hashing.

---

## Setup Instructions

### LLaMA Setup (via Ollama)
1. Install [Ollama](https://ollama.com/).
2. Pull the LLaMA 3 model:
   ```bash
   ollama pull llama3
   ```
3. Ensure Ollama is running (typically on `http://localhost:11434`).

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` with your LLaMA configuration:
   - `LLAMA_API_BASE_URL`: Usually `http://localhost:11434/v1` for Ollama.
   - `LLAMA_MODEL`: `llama3` or your preferred model.
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

---

## Folder Structure
```text
HireSnap/
├── backend/
│   ├── ai/             # AI Provider logic (OpenAI/LLaMA)
│   ├── config/         # DB & Environment config
│   ├── controllers/    # Business logic
│   ├── jobs/           # Job recommendation engine
│   ├── middleware/     # Auth & Error middlewares
│   ├── models/         # Mongoose schemas (User, Resume)
│   ├── routes/         # Express API routes
│   ├── services/       # Parsing & Token services
│   └── utils/          # Helper functions (Similarity logic)
└── frontend/
    ├── src/
    │   ├── api/        # Axios client & interceptors
    │   ├── components/ # Reusable UI components
    │   ├── layouts/    # Page wrappers (Auth, Dashboard)
    │   ├── pages/      # View components
    │   ├── context/    # Global state (Auth)
    │   └── assets/     # Images & fonts
```

---

## Deployment Guide

### Backend Deployment (Render/Heroku/Railway)
1. Push your code to a Git repository.
2. Set up a Web Service on your provider.
3. Configure Environment Variables in the provider's dashboard (copy from `.env`).
4. Set build command: `npm install`
5. Set start command: `node server.js`

### Frontend Deployment (Vercel/Netlify)
1. Connect your Git repository.
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables if necessary.

### Database
1. Use **MongoDB Atlas** for a production-grade managed database.
2. Add your server's IP to the Atlas whitelist.
