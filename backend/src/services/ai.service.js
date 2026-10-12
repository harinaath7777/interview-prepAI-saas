const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and model answer"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question using the STAR method, what points to cover etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and model answer"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The specific technical, architectural, or domain skill which the candidate is lacking compared to the job description"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap: high, medium, or low")
    })).describe("Exhaustive list of all identified skill gaps in the candidate's profile compared to the job requirements"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, strictly from 1 up to 30"),
        focus: z.string().describe("The main focus and skill gap addressed on this day (e.g., 'Mastering MongoDB Aggregations & Bridging DB Performance Gap')"),
        tasks: z.array(z.string()).describe("List of concrete, actionable tasks for this day (reading, hands-on coding, building projects, testing, mock interviews) to overcome the target skill gap.")
    })).describe("An intensive, complete 30-DAY day-by-day roadmap (Day 1 through Day 30) systematically covering and eliminating every single identified skill gap."),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

function getJsonSchema(schema) {
    if (typeof z.toJSONSchema === "function") {
        return z.toJSONSchema(schema)
    }
    const { zodToJsonSchema } = require("zod-to-json-schema")
    return zodToJsonSchema(schema)
}

const CANDIDATE_MODELS = [
    process.env.GEMINI_MODEL,
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.5-flash",
    "gemini-2.5-flash"
].filter(Boolean)

async function generateWithFallback({ contents, config }) {
    let lastError = null
    const uniqueModels = [ ...new Set(CANDIDATE_MODELS) ]
    for (const model of uniqueModels) {
        try {
            console.log(`[AI Service] Attempting generateContent with model: ${model}...`)
            const response = await ai.models.generateContent({
                model,
                contents,
                config
            })
            console.log(`[AI Service] Success with model: ${model}`)
            return response
        } catch (err) {
            console.warn(`[AI Service] Model ${model} failed (${err.status || err.message}). Trying next fallback...`)
            lastError = err
        }
    }
    throw lastError
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an elite technical hiring coach, system architect, and principal interviewer.
Analyze the candidate's profile against the target job description and generate an exhaustive, high-impact interview report.

Candidate Resume / Profile:
${resume || "Not provided"}

Candidate Self-Description:
${selfDescription || "Not provided"}

Target Job Description:
${jobDescription || "Not provided"}

STRICT MANDATORY REQUIREMENTS:
1. IDENTIFY ALL SKILL GAPS:
   - Identify ALL concrete missing skills, tools, frameworks, and architecture concepts between the candidate's background and the target job description.
   - Categorize each as "high", "medium", or "low" severity.

2. COMPREHENSIVE 30-DAY PREPARATION ROADMAP ALIGNED WITH SKILL GAPS:
   - You MUST generate an exact 30-day plan covering all 30 days (Day 1 through Day 30). Do NOT stop at 7 or 14 days; provide all 30 days.
   - EVERY SINGLE skill gap identified in "skillGaps" MUST be directly mentioned and systematically targeted in the preparation plan.
   - Organize the 30 days purposefully:
     * Days 1-7 (Week 1): Core Foundations & Closing High-Severity Skill Gaps.
     * Days 8-15 (Week 2): Deep Dive into Medium-Severity Skill Gaps & Hands-on Implementation.
     * Days 16-22 (Week 3): Advanced Architecture, Integration, & Resolving Remaining Gaps with Mini-Projects.
     * Days 23-28 (Week 4): Low-Severity Gaps, Testing, System Design & Behavioral Interview Alignment.
     * Days 29-30: Comprehensive Mock Interviews, Portfolio Polish, and Final Confidence Building.

3. INTERVIEW QUESTIONS:
   - Provide targeted, realistic technical and behavioral interview questions tailored to the candidate and role.
   - Include clear interviewer intentions and in-depth model answers.

4. TITLE & SCORE:
   - Provide a realistic matchScore between 0 and 100, and an accurate job title.
`

    const response = await generateWithFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: getJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)
}

async function generatePdfFromHtml(htmlContent) {
    const puppeteer = require("puppeteer")
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    })
    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, {
            waitUntil: "load"
        })

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            pageRanges: "1", // STRICTLY SINGLE PAGE
            margin: {
                top: "8mm",
                bottom: "8mm",
                left: "10mm",
                right: "10mm"
            }
        })
        return Buffer.from(pdfBuffer)
    } finally {
        await browser.close()
    }
}

function escapeHtml(text) {
    if (!text) return ""
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
}

function buildFallbackResumeHtml({ resume, selfDescription, jobDescription }) {
    const rawText = [ selfDescription, resume ].filter(Boolean).join("\n") || "Candidate Profile"
    const targetTitle = (jobDescription && jobDescription.split("\n")[0].slice(0, 50)) || "Full Stack Software Engineer"
    const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean)
    const name = lines[0]?.length < 40 ? lines[0] : "Candidate Profile"
    const summary = lines.slice(0, 3).join(" ") || "Results-driven engineer with expertise in software engineering, scalable architectures, and modern web applications."

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4 portrait; margin: 8mm 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    font-size: 8.8pt;
    line-height: 1.3;
    padding: 0;
  }
  .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 6px; }
  .name { font-size: 19pt; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: -0.02em; }
  .target-title { font-size: 10.5pt; font-weight: 600; color: #2563eb; margin-top: 1px; }
  .contact-bar { font-size: 8.5pt; color: #64748b; margin-top: 2px; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
  .contact-bar span:not(:last-child)::after { content: "•"; margin-left: 8px; color: #cbd5e1; }
  
  .section { margin-bottom: 6px; }
  .section-title {
    font-size: 9.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #0f172a;
    border-bottom: 1.5px solid #2563eb;
    padding-bottom: 2px;
    margin-bottom: 4px;
  }
  
  .summary { font-size: 8.5pt; color: #334155; line-height: 1.32; text-align: justify; }
  
  .skills-category { font-size: 8.5pt; margin-bottom: 2px; }
  .skills-category strong { color: #0f172a; font-weight: 600; }
  
  .entry { margin-bottom: 5px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; font-size: 8.8pt; }
  .entry-role { font-weight: 700; color: #0f172a; }
  .entry-date { font-size: 8.2pt; color: #64748b; font-weight: 500; }
  .entry-sub { display: flex; justify-content: space-between; font-size: 8.2pt; color: #2563eb; font-style: italic; margin-bottom: 1px; }
  
  ul.bullets { padding-left: 14px; margin-top: 1px; }
  ul.bullets li { font-size: 8.5pt; color: #334155; margin-bottom: 1.5px; line-height: 1.28; }
</style>
</head>
<body>
  <div class="header">
    <div class="name">${escapeHtml(name)}</div>
    <div class="target-title">${escapeHtml(targetTitle)}</div>
    <div class="contact-bar">
      <span>Candidate Profile</span>
      <span>Tailored ATS Resume</span>
      <span>Interview Strategy Verified</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="summary">${escapeHtml(summary)}</div>
  </div>

  <div class="section">
    <div class="section-title">Technical Skills</div>
    <div class="skills-category"><strong>Core Skills:</strong> Full-Stack Development, System Architecture, Algorithms & Data Structures</div>
    <div class="skills-category"><strong>Technologies:</strong> Modern Frameworks, RESTful APIs, Database Design, CI/CD, Git</div>
  </div>

  <div class="section">
    <div class="section-title">Experience & Project Highlights</div>
    <div class="entry">
      <div class="entry-header">
        <span class="entry-role">Software Engineering Highlights</span>
        <span class="entry-date">Recent</span>
      </div>
      <div class="entry-sub">
        <span>Target Role: ${escapeHtml(targetTitle)}</span>
      </div>
      <ul class="bullets">
        ${lines.slice(1, 8).map(l => `<li>${escapeHtml(l)}</li>`).join("") || "<li>Demonstrated key engineering competencies and successful software deliverables.</li>"}
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Target Role Alignment</div>
    <div class="summary">
      Tailored for position: <strong>${escapeHtml(targetTitle)}</strong>. All competencies formatted for high ATS compliance.
    </div>
  </div>
</body>
</html>`
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    let html = ""

    try {
        const resumePdfSchema = z.object({
            html: z.string().describe("A complete, standalone HTML document of the tailored, single-page ATS-friendly resume with embedded CSS inside <style>.")
        })

        const prompt = `You are an elite executive resume writer and ATS optimization expert.
Create a top-tier, 100% ATS-compliant, strictly SINGLE-PAGE tailored resume for the candidate targeting the given job description.

Candidate Resume / Background:
${resume || "Not provided"}

Candidate Self-Description:
${selfDescription || "Not provided"}

Target Job Description:
${jobDescription || "Not provided"}

CRITICAL ATS & LAYOUT CONSTRAINTS:
1. STRICT SINGLE-PAGE BUDGET (EXACTLY 1 A4 PAGE - NEVER OVERFLOW):
   - The entire resume must fit comfortably on ONE single printed A4 page.
   - Professional Summary: exactly 2-3 concise, impactful sentences tailored to the job description keywords.
   - Technical Skills: 3-4 categorized lines (e.g. Languages, Frameworks, Databases & Cloud, Tools & Methodologies).
   - Professional Experience: Limit to the 2-3 most relevant roles, each with 2-3 concise bullets (action verb + what was built/solved + quantified result/metric).
   - Key Projects: 2 strong role-relevant projects, each with technologies used and 2 concise bullets.
   - Education & Certifications: Compact 1-2 lines at the bottom.

2. ATS PARSER OPTIMIZATION:
   - Use universal single-column hierarchy (no sidebars or multi-column grids).
   - Standard section titles: "PROFESSIONAL SUMMARY", "TECHNICAL SKILLS", "PROFESSIONAL EXPERIENCE", "KEY PROJECTS", "EDUCATION & CERTIFICATIONS".
   - Naturally integrate high-value keywords and competencies from the Target Job Description into the skills and bullet points.
   - Strong action verbs at the start of every bullet point (e.g., Architected, Engineered, Developed, Optimized, Integrated).

3. HTML & CSS DESIGN SPECIFICATIONS:
   - Output must be JSON with a single field "html": { "html": "<!DOCTYPE html><html><head><style>...</style></head><body>...</body></html>" }.
   - The <style> tag MUST include:
     * @page { size: A4 portrait; margin: 8mm 10mm; }
     * * { box-sizing: border-box; margin: 0; padding: 0; }
     * body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background: #ffffff; font-size: 8.8pt; line-height: 1.3; padding: 0; }
     * .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 6px; }
     * .name { font-size: 19pt; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: -0.02em; }
     * .target-title { font-size: 10.5pt; font-weight: 600; color: #2563eb; margin-top: 1px; }
     * .contact-bar { font-size: 8.5pt; color: #64748b; margin-top: 2px; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
     * .contact-bar span:not(:last-child)::after { content: "•"; margin-left: 8px; color: #cbd5e1; }
     * .section { margin-bottom: 6px; }
     * .section-title { font-size: 9.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0f172a; border-bottom: 1.5px solid #2563eb; padding-bottom: 2px; margin-bottom: 4px; }
     * .summary { font-size: 8.5pt; color: #334155; line-height: 1.32; text-align: justify; }
     * .skills-category { font-size: 8.5pt; margin-bottom: 2px; }
     * .skills-category strong { color: #0f172a; font-weight: 600; }
     * .entry { margin-bottom: 5px; }
     * .entry-header { display: flex; justify-content: space-between; align-items: baseline; font-size: 8.8pt; }
     * .entry-role { font-weight: 700; color: #0f172a; }
     * .entry-date { font-size: 8.2pt; color: #64748b; font-weight: 500; }
     * .entry-sub { display: flex; justify-content: space-between; font-size: 8.2pt; color: #2563eb; font-style: italic; margin-bottom: 1px; }
     * ul.bullets { padding-left: 14px; margin-top: 1px; }
     * ul.bullets li { font-size: 8.5pt; color: #334155; margin-bottom: 1.5px; line-height: 1.28; }
`

        const response = await generateWithFallback({
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: getJsonSchema(resumePdfSchema),
            }
        })

        const jsonContent = JSON.parse(response.text)
        if (jsonContent && jsonContent.html) {
            html = jsonContent.html
        }
    } catch (err) {
        console.error("[AI Service] AI models failed for resume generation, building fallback ATS resume:", err.message)
        html = buildFallbackResumeHtml({ resume, selfDescription, jobDescription })
    }

    if (!html) {
        html = buildFallbackResumeHtml({ resume, selfDescription, jobDescription })
    }

    const pdfBuffer = await generatePdfFromHtml(html)
    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }