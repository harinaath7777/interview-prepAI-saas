# interview prepAI 

An end-to-end AI career intelligence and interview preparation platform. It evaluates candidate resumes and profiles against target job descriptions to generate 30-day preparation roadmaps, targeted interview questions, and compiles ATS-optimized single-page PDF resumes using Puppeteer and Google Gemini.

---

##  Features

- **Profile & Job Description Match Scoring:** Instant evaluation calculating match percentage and identifying key competencies.
- **Exhaustive Skill Gap Identification:** Pinpoints missing technical, architectural, and framework skills categorized by severity (High, Medium, Low).
- **30-Day Preparation Roadmap:** Day-by-day targeted schedule (Days 1–30) systematically resolving identified skill gaps with actionable tasks, coding exercises, and mock interviews.
- **Tailored Technical & Behavioral Q&A:** Curated questions specific to the role with interviewer intentions and STAR-method model answers.
- **Single-Page ATS Resume Generation:** Headless Puppeteer engine paired with Google Gemini generating ATS-compliant single-page resumes with clean hierarchy, modern typography, and keyword optimization.
- **In-Browser Preview & Native Download:** Instant PDF preview directly in the browser viewer, plus one-click PDF file download.

---

##  Tech Stack

### Frontend
- **React 19**
- **Vite**
- **React Router v7**
- **Axios**
- **SCSS / Modern Dark Theme**

### Backend
- **Node.js & Express 5**
- **MongoDB & Mongoose**
- **JWT Authentication & Cookie Sessions**
- **Multer & PDF-Parse**

### AI & PDF Engine
- **Google GenAI SDK (`@google/genai`)** - Utilizing `gemini-3.5-flash-lite` with automated multi-model failover.
- **Puppeteer** - Headless Chromium print engine for pixel-perfect A4 PDF generation.
- **Zod v4** - Type-safe structured schema validation for LLM output guarantees.

---

##  Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/harinaath7777/interview-prepAI-saas.git
cd interview-prepAI-saas
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 License
ISC License
