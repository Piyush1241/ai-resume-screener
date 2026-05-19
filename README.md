# 🤖 AI Resume Screener

An intelligent full-stack web application that uses AI to automatically screen and rank candidates by analyzing uploaded resumes against job descriptions — built with Node.js, React, MongoDB, PostgreSQL, and Groq (LLaMA 3.3).

**Live Demo:** [ai-resume-screener-nu.vercel.app](https://ai-resume-screener-nu.vercel.app)

---

## ✨ Features

- **JWT Authentication** — Secure login/register with role-based access (admin, recruiter, hiring manager)
- **Job Management** — Create, view, and delete job listings with required skills and experience level
- **PDF Resume Upload** — Upload candidate resumes as PDFs; text is extracted automatically using `pdf-parse`
- **AI-Powered Scoring** — Each resume is analyzed by LLaMA 3.3 (via Groq) and scored against the job description
- **Detailed Analysis** — Match percentage, matched/missing skills, experience summary, red flags, and hire recommendation
- **Glassmorphism UI** — Polished dark-themed frontend with purple/blue gradients and frosted glass cards

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js |
| Auth DB | PostgreSQL (Neon) |
| Jobs/Resumes DB | MongoDB Atlas (Mongoose) |
| AI Scoring | Groq API — LLaMA 3.3 70B |
| PDF Parsing | pdf-parse, Multer |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🏗 Architecture

```
ai-resume-screener/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── context/         # AuthContext (JWT + axios)
│   │   ├── pages/           # Login, Dashboard, Jobs, Candidates
│   │   └── components/      # Layout, Navbar
│   └── vercel.json          # SPA routing config
│
└── server/                  # Express backend
    ├── config/              # MongoDB + PostgreSQL connections
    ├── controllers/         # auth, jobs, resumes, score
    ├── middleware/           # JWT auth guard, Multer upload
    ├── models/              # Mongoose schemas (Job, Resume)
    ├── routes/              # API route definitions
    └── server.js            # Entry point
```

**Data flow:**
1. User logs in → JWT stored in `httpOnly` cookie
2. Recruiter creates a job with required skills
3. PDF resume uploaded → text extracted with `pdf-parse`
4. Raw text + job description sent to Groq (LLaMA 3.3)
5. AI returns structured JSON: match %, skills, red flags, recommendation
6. Results stored in MongoDB and displayed ranked by score

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Neon PostgreSQL account
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repo

```bash
git clone https://github.com/Piyush1241/ai-resume-screener.git
cd ai-resume-screener
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=8000
NODE_ENV=development

MONGODB_URI=your_mongodb_atlas_uri
DATABASE_URL=your_neon_postgres_url

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

GROQ_API_KEY=your_groq_api_key
```

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd ../client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT cookie |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Get current user |

### Jobs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | List all active jobs |
| POST | `/api/jobs` | Create a new job |
| GET | `/api/jobs/:id` | Get job by ID |
| DELETE | `/api/jobs/:id` | Archive a job (admin only) |

### Resumes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resumes/upload` | Upload PDF resume (multipart/form-data) |
| GET | `/api/resumes/job/:jobId` | Get all resumes for a job |
| GET | `/api/resumes/:id` | Get single resume |

### AI Scoring
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/score/resume/:resumeId` | Score a single resume with AI |
| POST | `/api/score/batch/:jobId` | Score all unscored resumes for a job |

---

## 🤖 AI Scoring Schema

The Groq model returns structured JSON for each resume:

```json
{
  "match_percentage": 78,
  "matched_skills": ["Node.js", "MongoDB", "REST APIs"],
  "missing_skills": ["Docker", "Kubernetes"],
  "experience_summary": "5 years of backend experience with strong Node.js skills.",
  "red_flags": [],
  "recommendation": "Strong Yes"
}
```

Recommendations: `Strong Yes` · `Yes` · `Maybe` · `No`

---

## 🌐 Deployment

### Backend → Render

| Field | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `node server.js` |

Add all env vars from `.env` in Render's environment settings.

### Frontend → Vercel

| Field | Value |
|---|---|
| Root Directory | `client` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com`

---

## 📄 License

MIT

---

*Built by [Piyush](https://github.com/Piyush1241)*
