import React from 'react'
import "../style/home.scss"

export const Home = () => {
  return (
    <main className="home">
      <header className="home__header">
        <h1 className="home__title">
          Create Your Custom <span className="home__title-accent">Interview Plan</span>
        </h1>
        <p className="home__subtitle">
          Let our AI analyze the job requirements and your unique profile to build a winning strategy.
        </p>
      </header>

      <section className="interview-input-group">
        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__title">
              <span className="panel__icon">🎯</span> Target Job Description
            </h2>
            <span className="badge badge--required">Required</span>
          </div>
          <textarea
            className="panel__textarea"
            name="jobDescription"
            id="jobDescription"
            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
            maxLength={5000}
          ></textarea>
          <div className="panel__counter">0 / 5000 chars</div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__title">
              <span className="panel__icon">👤</span> Your Profile
            </h2>
          </div>

          <div className="upload-group">
            <div className="upload-group__label-row">
              <span className="upload-group__label">Upload Resume</span>
              <span className="badge badge--best">Best Results</span>
            </div>
            <label className="upload-dropzone" htmlFor="resume">
              <span className="upload-dropzone__icon">⬆</span>
              <span className="upload-dropzone__title">Click to upload or drag &amp; drop</span>
              <span className="upload-dropzone__hint">PDF or DOCX (Max 5MB)</span>
              <input hidden type="file" name="resume" id="resume" accept=".pdf,.docx" />
            </label>
          </div>

          <div className="divider"><span>OR</span></div>

          <div className="input-group">
            <label className="input-group__label" htmlFor="selfDescription">Quick Self-Description</label>
            <textarea
              className="panel__textarea panel__textarea--accent"
              name="selfDescription"
              id="selfDescription"
              placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
            ></textarea>
          </div>

          <div className="info-banner">
            <span className="info-banner__icon">ℹ</span>
            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
          </div>
        </div>
      </section>

      <footer className="home__footer">
        <p className="home__footer-note">AI-Powered Strategy Generation · Approx 30s</p>
        <button className="button primary-button">
          <span className="primary-button__icon">★</span> Generate My Interview Strategy
        </button>
      </footer>
    </main>
  )
}

export default Home