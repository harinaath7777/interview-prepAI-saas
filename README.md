# InterviewPrep AI: Autonomous Career Intelligence and Technical Interview Readiness Platform

An autonomous, end-to-end interview intelligence SaaS designed for multi-modal candidate profiling, semantic skill gap identification, automated 30-day curriculum synthesis, and deterministic single-page ATS resume compilation. Built on a decoupled micro-service-ready architecture utilizing React 19, Express 5, Google Gemini neural reasoning models (`gemini-3.5-flash-lite`), headless Puppeteer PDF virtualization, and stateless JSON Web Token (JWT) authentication with database-backed token revocation.

---

## Architectural Overview

InterviewPrep AI decouples the career intelligence lifecycle into deterministic, verifiable stages:

1. **Ingestion and Extraction Layer:** Ingests multi-modal candidate assets including unstructured PDF binary streams via Multer and `pdf-parse`, free-form candidate self-descriptions, and raw job specifications.
2. **Semantic Profiling and Schema Enforcement:** Validates and normalizes candidate experience and target job requirements using strict Zod schemas, guaranteeing type-safe inference pipelines and consistent structured LLM outputs.
3. **Neural Gap Analysis and Match Scoring:** Leverages Google Gemini multi-model fallback topologies (`gemini-3.5-flash-lite`, `gemini-flash-latest`, `gemini-2.5-flash`) to compute profile-to-role alignment, deriving an objective match score (0–100) and discrete severity-ranked skill deficits (`high`, `medium`, `low`).
4. **Curriculum Synthesis Engine:** Synthesizes an intensive, deterministic 30-day preparation roadmap (Day 1 through Day 30) systematically targeting each identified skill gap with structured conceptual study, hands-on coding, and behavioral STAR-method milestones.
5. **Headless ATS Resume Virtualization:** Compiles semantic candidate achievements into strict, single-page A4 CSS print layouts, rendered headlessly via Chromium (Puppeteer) into ATS-compliant PDFs and delivered over streaming Data URL / Base64 channels to eliminate browser UUID sandbox limitations.
6. **Persistence and Data Isolation:** Enforces multi-tenant data isolation in MongoDB Atlas via Mongoose relational models, scoping all analytical reports, preparation plans, and generated resumes strictly to the authenticated `user_id`.

---

## Technical Specifications

### Core Engine Modes and Intelligence Modules
- **Profile vs. Job Description Match Engine:** Rigorous scoring algorithm evaluating candidate background against job requirements with detailed breakdown metrics.
- **Hierarchical Skill Gap Classifier:** Multi-tier taxonomy categorizing technical, architectural, and domain deficiencies by severity (`high`, `medium`, `low`).
- **Comprehensive 30-Day Preparation Roadmap:** Exhaustive 30-day structured curriculum:
  - **Days 1–7 (Week 1):** Core Foundations and High-Severity Gap Remediation.
  - **Days 8–15 (Week 2):** Medium-Severity Deficit Deep Dives and Practical Implementation.
  - **Days 16–22 (Week 3):** Advanced Architecture, Systems Design, and Mini-Projects.
  - **Days 23–28 (Week 4):** Testing, Low-Severity Gaps, and Behavioral STAR Frameworks.
  - **Days 29–30:** Full Mock Interview Simulation and Executive Portfolio Polish.
- **Adaptive Technical and Behavioral Q&A Generator:** Synthesizes tailored interview questions paired with interviewer psychological intention and comprehensive model answers.
- **Deterministic Single-Page ATS Resume Compiler:** Puppeteer-powered headless A4 engine enforcing physical page boundaries (`pageRanges: "1"`, 8mm margins, micro-typography) guaranteeing single-page ATS parsing compliance.
- **Dual-Transport Resume Streaming:** Hybrid delivery supporting both in-browser responsive iframe/embed previews and instant Data URL client-side downloads without filesystem artifacts.

---

## Project Structure

```
interview-prepAI-saas/
├── backend/
│   ├── src/
│   │   ├── config/              # Runtime configurations & database connection
│   │   ├── controllers/         # HTTP request orchestration & endpoint handlers
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   ├── db/                  # MongoDB Mongoose connection client
│   │   │   └── db.js
│   │   ├── middlewares/         # JWT verification, cookie parsing, Multer file upload
│   │   │   ├── auth.middleware.js
│   │   │   └── file.middleware.js
│   │   ├── models/              # Relational schemas (Users, Reports, Blacklist)
│   │   │   ├── blacklist.model.js
│   │   │   ├── interviewReport.model.js
│   │   │   └── user.model.js
│   │   ├── routes/              # Express API route declarations
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   ├── services/            # Google Gemini AI reasoning & Puppeteer PDF rendering
│   │   │   └── ai.service.js
│   │   └── app.js               # Express application initialization & middleware stack
│   ├── .env.example             # Template environment configuration
│   ├── .gitignore               # Backend environment and dependency ignores
│   ├── package.json             # Backend dependencies and scripts
│   └── server.js                # HTTP server bootstrap entry point (Port 3001)
├── frontend/
│   ├── public/                  # Static assets and application branding
│   │   ├── favicon.svg          # Custom SVG AI neural network logo
│   │   └── icons.svg            # UI vector icons
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/            # Authentication state, context, login/register pages
│   │   │   │   ├── components/  # Protected route guards
│   │   │   │   ├── hooks/       # useAuth custom hook
│   │   │   │   ├── pages/       # Login and Register views
│   │   │   │   └── services/    # Axios auth HTTP client
│   │   │   └── interview/       # Core interview assessment, dashboard & roadmap views
│   │   │       ├── hooks/       # useInterview custom hook
│   │   │       ├── pages/       # Home dashboard and Interview report viewer
│   │   │       ├── services/    # Interview API client & Data URL download engine
│   │   │       └── style/       # SCSS module stylesheets
│   │   ├── App.jsx              # Application root provider tree
│   │   ├── app.routes.jsx       # Client-side routing definitions (React Router v7)
│   │   ├── main.jsx             # React 19 DOM bootstrap
│   │   └── style.scss           # Global glassmorphic design system & color tokens
│   ├── index.html               # SPA entrypoint with custom branding & metadata
│   ├── package.json             # Frontend dependencies and Vite configuration
│   └── vite.config.js           # Vite build and development configuration
├── .gitignore                   # Root repository ignore rules
└── README.md                    # System architecture documentation and guide
```

---

## Prerequisites

- **Node.js:** v18.0.0 or higher
- **MongoDB:** v6.0 or higher (Local instance or MongoDB Atlas cluster)
- **Google Gemini API Key:** Access to Google AI Studio API (`gemini-3.5-flash-lite`, `gemini-2.5-flash`)
- **Chromium:** Supported headless environment (installed automatically via Puppeteer)

---

## Installation and Setup

### 1. Repository Acquisition

```bash
git clone https://github.com/harinaath7777/interview-prepAI-saas.git
cd interview-prepAI-saas
```

### 2. Backend Configuration and Startup

Navigate to the `backend` workspace:

```bash
cd backend
npm install
```

Configure environment variables:

```bash
cp .env.example .env
```

Populate the `.env` file with your credentials:

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
```

Launch the backend daemon:

```bash
npm start
```

The backend server initializes on `http://localhost:3001`.

### 3. Frontend Configuration and Startup

In a separate terminal, navigate to the `frontend` workspace:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The application interface is accessible at `http://localhost:5173`.

---

## API Specification

### Authentication Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Registers a new user account with bcrypt password hashing |
| POST | `/api/auth/login` | Validates credentials and returns signed JWT in HTTP-only cookie and payload |
| GET | `/api/auth/logout` | Clears cookie session and commits token to database blacklist |
| GET | `/api/auth/get-me` | Validates active session token and returns authenticated principal |

### Interview Intelligence and Synthesis Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/interview/` | Ingests candidate profile, resume PDF, and job description; returns structured report |
| GET | `/api/interview/` | Retrieves all historical interview reports scoped to authenticated caller |
| GET | `/api/interview/report/:interviewId` | Fetches a specific interview report with 30-day roadmap and question banks |

### Resume Virtualization and Export Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/interview/resume/pdf/:interviewReportId` | Generates an ATS-optimized, single-page PDF resume using headless Puppeteer |
| GET | `/api/interview/resume/pdf/:interviewReportId` | Fetches and streams compiled PDF binary buffer for browser viewing and download |

---

## Security and Data Isolation

- **Token Governance:** Stateless JSON Web Tokens signed with HMAC-SHA256 (`HS256`) and distributed via secure HTTP cookies and Authorization headers.
- **Token Blacklisting:** Explicit logout operations commit token signatures to an indexed `Blacklist` collection in MongoDB with automatic expiration.
- **Password Hashing:** Passwords hashed with salted bcrypt rounds prior to database persistence.
- **Tenant Scoping:** All Mongoose queries strictly enforce parameterized tenant boundaries scoped to the authenticated caller identifier (`req.user._id`).
- **Push Protection and Key Isolation:** Strict repository `.gitignore` hygiene preventing accidental transmission of `.env` files or cloud credentials to remote version control.

---

## License

This project is distributed under the terms of the ISC License.
