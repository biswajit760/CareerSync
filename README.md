# CareerSync — AI-Powered ATS Resume Analyzer & Job Matcher

> Final Year Project | BCA | Netaji Subhas University, Jamshedpur | 2023–2026

CareerSync is a full-stack web platform that helps job seekers understand why their resumes get rejected by Applicant Tracking Systems (ATS), and matches them to real live job listings using AI.

---

## Team

| Name | Roll No | Role | GitHub |
|------|---------|------|--------|
| Biswajit Mahanty | 2303063 | Full Stack Developer | [@biswajit](https://github.com/biswajit760) |
| MD Shad Alam | 2303133 | Full Stack Developer | [@shad](https://github.com) |
| Navin Dey | 2303148 | Database Specialist | [@navin](https://github.com) |

> **Guide:** Prof. Ritesh Kumar Jha, Assistant Professor, Dept. of IT

---

## What It Does

- Uploads a PDF resume and parses it using **Google Gemini 1.5 Flash AI**
- Computes a **0–100 ATS compatibility score** across 3 components — keyword match (40pts), experience alignment (30pts), formatting (30pts)
- Performs **semantic gap analysis** to find missing and implied skills
- Fetches **live job listings** from the Adzuna API ranked by relevance
- Displays everything on a **SaaS dashboard** with 4 interactive Recharts (Gauge, Radar, Bar, Donut)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, Tailwind CSS, Recharts, shadcn/ui |
| Backend | Node.js, Express.js |
| AI Engine | Google Gemini 1.5 Flash |
| Database | MongoDB Atlas (Mongoose ODM) |
| File Storage | Cloudinary CDN |
| Jobs API | Adzuna API |
| Auth | JWT + bcryptjs |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Project Structure

```
CareerSync/
├── client/                   # Next.js 14 frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   │   ├── dashboard/    # Main dashboard with charts
│   │   │   ├── login/        # Login page
│   │   │   ├── register/     # Register page
│   │   │   └── upload/       # Resume upload page
│   │   ├── components/       # Reusable UI components
│   │   │   ├── charts/       # Recharts components
│   │   │   ├── layout/       # Navbar, sidebar
│   │   │   └── ui/           # Buttons, inputs, cards
│   │   ├── lib/              # API helpers, utilities
│   │   └── types/            # TypeScript types
│   ├── .env.local            # Frontend env variables (gitignored)
│   └── package.json
│
├── server/                   # Express.js backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/          # Route handler logic
│   ├── middleware/           # JWT auth middleware
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Resume.js
│   │   └── JobCache.js
│   ├── routes/               # API route definitions
│   ├── .env.example          # Environment variable template
│   └── index.js              # Server entry point
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB Atlas account (free M0 cluster)
- A Google Gemini API key (free tier)
- An Adzuna API account (free tier)
- A Cloudinary account (free tier)

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/CareerSync.git
cd CareerSync
```

---

### 2. Set up the backend

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create your `.env` file from the example:

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
```

Start the backend:

```bash
npm run dev
```

You should see:
```
Server running on http://localhost:5000
MongoDB connected: cluster0.xxx.mongodb.net
```

---

### 3. Set up the frontend

Open a new terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create your `.env.local` file:

```bash
# create a new file called .env.local inside client/
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create new account | Public |
| POST | `/api/auth/login` | Login, receive JWT | Public |
| POST | `/api/resume/upload` | Upload PDF, trigger AI | JWT |
| POST | `/api/resume/analyze` | Run ATS scoring | JWT |
| GET | `/api/resume/:id` | Get a resume result | JWT |
| GET | `/api/resume/history` | All scans for user | JWT |
| GET | `/api/jobs/search` | Fetch matched jobs | JWT |
| POST | `/api/jobs/save` | Save a job | JWT |
| GET | `/api/jobs/saved` | Get saved jobs | JWT |
| GET | `/api/health` | Server health check | Public |

---

## How to Contribute (Team Guide)

### Step 1 — Never work directly on `main`

Always create a new branch for your feature:

```bash
git checkout -b feature/your-feature-name
```

Branch naming examples:
```
feature/auth-routes
feature/resume-upload
feature/dashboard-charts
feature/mongoose-models
fix/mongodb-connection
```

---

### Step 2 — Make your changes, then commit

```bash
git add .
git commit -m "feat: add login and register API routes"
```

**Commit message format:**
```
feat:     new feature
fix:      bug fix
refactor: code cleanup, no feature change
docs:     README or comments update
style:    formatting only
```

---

### Step 3 — Push your branch

```bash
git push origin feature/your-feature-name
```

---

### Step 4 — Open a Pull Request

1. Go to the GitHub repo
2. Click **"Compare & pull request"**
3. Write a short description of what you built
4. Assign **Biswajit** as reviewer
5. Wait for review before merging into `main`

---

### Step 5 — Keep your branch updated

Before starting new work, always pull the latest `main`:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-next-feature
```

---

## Environment Variables Reference

### Backend (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `CLIENT_URL` | Frontend URL for CORS |
| `GEMINI_API_KEY` | Google Gemini AI API key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADZUNA_APP_ID` | Adzuna Jobs API app ID |
| `ADZUNA_APP_KEY` | Adzuna Jobs API app key |

### Frontend (`client/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## Important Rules

- **Never push `.env` or `.env.local` to GitHub** — these contain secret keys
- **Never push `node_modules/`** — teammates run `npm install` themselves
- **Always test your code locally** before opening a Pull Request
- **Always pull latest `main`** before starting new work to avoid merge conflicts

---

## Project Timeline

| Week | Phase | Goal |
|------|-------|------|
| 1–2 | Setup | Project init, MongoDB, folder structure |
| 3–4 | Phase 1 | PDF upload → Gemini parsing pipeline |
| 5–6 | Phase 2 | ATS scoring + semantic analysis |
| 7–8 | Phase 3 | Adzuna job matching + caching |
| 9–10 | Phase 4 | Next.js dashboard + 4 Recharts |
| 11 | Auth | JWT auth + scan history |
| 12 | Polish | Responsive design + error handling |
| 13 | Testing | Jest unit tests (>80% coverage) |
| 14 | Deploy | Railway + Vercel |
| 15–16 | Docs | README, report, demo video |

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | Auto-deploys from `main` branch |
| Backend | Railway | `https://careersync-api.railway.app` |
| Database | MongoDB Atlas | Free M0 cluster |

---

*Built with love by Team CareerSync — NSU Jamshedpur, 2026*
