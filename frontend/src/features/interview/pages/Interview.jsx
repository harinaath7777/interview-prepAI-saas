import React, { useState } from 'react'
import "../style/interview.scss"

// Sample data - shape matches the AI-generated report; will come from props/state later
const reportData = {
  matchScore: 90,
  technicalQuestions: [
    {
      questions: "Explain how state management works in React applications. What are some common approaches or libraries you've used, and when would you choose one over the other?",
      intention: "To assess the candidate's understanding of core React concepts and architectural decisions.",
      answer: "Discuss useState, useContext, and global state libraries like Redux or Zustand, with trade-offs and when to use each."
    },
    {
      questions: "When designing a RESTful API with Node.js and Express.js, what principles do you follow to keep it robust, secure, and scalable?",
      intention: "To evaluate backend skills and REST best practices.",
      answer: "Cover statelessness, resource-based URLs, modular routes, validation, authentication, and error handling middleware."
    }
  ],
  behavioralQuestions: [
    {
      questions: "Describe a challenging technical problem you encountered in one of your projects. How did you approach debugging and resolve it?",
      intention: "To assess problem-solving skills and debugging methodology.",
      answer: "Use the STAR method: Situation, Task, Action, Result. Highlight root-cause analysis and lessons learned."
    },
    {
      questions: "Tell me about a time you collaborated with others on a project. What was your role?",
      intention: "To evaluate teamwork and communication skills.",
      answer: "Describe the project, your responsibilities, collaboration tools used, and how disagreements were handled."
    }
  ],
  skillGaps: [
    {
      "skill": "Professional MERN Stack Project Experience",
      "severity": "medium"
    },
    {
      "skill": "Advanced Cloud Deployment Strategies",
      "severity": "medium"
    },
    {
      "skill": "CI/CD Practices",
      "severity": "low"
    }
  ],
  preparationPlan: [
    {
      day: 1,
      focus: "React.js Fundamentals & Advanced Features",
      tasks: [
        "Review React hooks and their proper use cases.",
        "Practice building a moderately complex component with local state and props."
      ]
    },
    {
      day: 2,
      focus: "Node.js, Express.js & REST API Development",
      tasks: [
        "Build an Express.js server with multiple RESTful endpoints.",
        "Implement validation and error handling middleware."
      ]
    },
    {
      "day": 3,
      "focus": "MongoDB, Mongoose & Database Operations",
      "tasks": [
        "Deep dive into MongoDB's document model and its advantages/disadvantages compared to relational databases.",
        "Learn advanced Mongoose features: schemas, models, populate, aggregation pipeline, and transactions.",
        "Design a database schema for a medium-complexity application (e.g., e-commerce, social media clone).",
        "Implement CRUD operations and complex queries using Mongoose for the designed schema."
      ]
    },
    {
      "day": 4,
      "focus": "Authentication, Authorization & Deployment Basics",
      "tasks": [
        "Implement JSON Web Token (JWT) based authentication and authorization in an Express.js application.",
        "Understand password hashing (e.g., bcrypt) and secure cookie practices.",
        "Research basic cloud deployment strategies for MERN applications (e.g., using Vercel/Netlify for frontend and Heroku/Render for backend/DB).",
        "Deploy a simple MERN application to a free-tier cloud platform, understanding environment variables."
      ]
    },
    {
      "day": 5,
      "focus": "System Design, Problem Solving & Mock Interview",
      "tasks": [
        "Review common data structures and algorithms, focusing on problems frequently asked in interviews.",
        "Practice explaining the architecture of a MERN stack application, including how different components interact.",
        "Conduct a mock interview (technical and behavioral) to practice answering questions under pressure.",
        "Refine your elevator pitch, project explanations, and prepare questions to ask the interviewer."
      ]
    }
  ]
}

const sections = [
  { id: "technical", label: "Technical Questions", icon: "</>" },
  { id: "behavioral", label: "Behavioral Questions", icon: "💬" },
  { id: "roadmap", label: "Road Map", icon: "🧭" },
]

const matchScoreLabel = (score) => {
  if (score >= 80) return "Strong match for this role"
  if (score >= 60) return "Good match for this role"
  return "Needs improvement for this role"
}

const QuestionCard = ({ index, data, expanded, onToggle }) => (
  <article className="question-card">
    <button className="question-card__header" onClick={onToggle}>
      <span className="question-card__index">Q{index + 1}</span>
      <span className="question-card__question">{data.questions}</span>
      <span className={`question-card__chevron ${expanded ? "question-card__chevron--open" : ""}`}>⌄</span>
    </button>

    {expanded && (
      <div className="question-card__body">
        <span className="tag tag--intention">Intention</span>
        <p className="question-card__text">{data.intention}</p>

        <span className="tag tag--answer">Model Answer</span>
        <p className="question-card__text">{data.answer}</p>
      </div>
    )}
  </article>
)

export const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical")
  const [expandedIds, setExpandedIds] = useState(new Set(["technical-0", "technical-1", "behavioral-0", "behavioral-1"]))

  const toggleQuestion = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const ringCircumference = 2 * Math.PI * 42
  const ringOffset = ringCircumference * (1 - reportData.matchScore / 100)

  return (
    <main className="interview">
      <aside className="interview__sidebar interview__sidebar--left">
        <span className="sidebar-label">Sections</span>
        <nav className="interview-nav">
          {sections.map(section => (
            <button
              key={section.id}
              className={`interview-nav__item ${activeSection === section.id ? "interview-nav__item--active" : ""}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="interview-nav__icon">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="interview__main">
        {activeSection === "technical" && (
          <>
            <div className="interview__main-header">
              <h2 className="interview__main-title">Technical Questions</h2>
              <span className="count-badge">{reportData.technicalQuestions.length} questions</span>
            </div>
            <div className="question-list">
              {reportData.technicalQuestions.map((q, i) => (
                <QuestionCard
                  key={i}
                  index={i}
                  data={q}
                  expanded={expandedIds.has(`technical-${i}`)}
                  onToggle={() => toggleQuestion(`technical-${i}`)}
                />
              ))}
            </div>
          </>
        )}

        {activeSection === "behavioral" && (
          <>
            <div className="interview__main-header">
              <h2 className="interview__main-title">Behavioral Questions</h2>
              <span className="count-badge">{reportData.behavioralQuestions.length} questions</span>
            </div>
            <div className="question-list">
              {reportData.behavioralQuestions.map((q, i) => (
                <QuestionCard
                  key={i}
                  index={i}
                  data={q}
                  expanded={expandedIds.has(`behavioral-${i}`)}
                  onToggle={() => toggleQuestion(`behavioral-${i}`)}
                />
              ))}
            </div>
          </>
        )}

        {activeSection === "roadmap" && (
          <>
            <div className="interview__main-header">
              <h2 className="interview__main-title">Preparation Road Map</h2>
              <span className="count-badge">{reportData.preparationPlan.length}-day plan</span>
            </div>
            <div className="roadmap-timeline">
              {reportData.preparationPlan.map(day => (
                <div className="roadmap-item" key={day.day}>
                  <span className="roadmap-item__marker"></span>
                  <div className="roadmap-item__content">
                    <span className="roadmap-item__day">Day {day.day}</span>
                    <h3 className="roadmap-item__focus">{day.focus}</h3>
                    <ul className="roadmap-item__tasks">
                      {day.tasks.map((task, i) => <li key={i}>{task}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <aside className="interview__sidebar interview__sidebar--right">
        <div className="match-score-card">
          <span className="sidebar-label">Match Score</span>
          <div className="match-score-ring">
            <svg viewBox="0 0 100 100">
              <circle className="match-score-ring__bg" cx="50" cy="50" r="42" />
              <circle
                className="match-score-ring__fill"
                cx="50" cy="50" r="42"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
              />
            </svg>
            <span className="match-score-ring__value">{reportData.matchScore}<small>%</small></span>
          </div>
          <p className="match-score-card__caption">{matchScoreLabel(reportData.matchScore)}</p>
        </div>

        <div className="skill-gaps-card">
          <span className="sidebar-label">Skill Gaps</span>
          <div className="skill-gap-list">
            {reportData.skillGaps.map((gap, i) => (
              <div key={i} className={`skill-gap-pill skill-gap-pill--${gap.severity}`}>
                {gap.skill}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </main>
  )
}

export default Interview