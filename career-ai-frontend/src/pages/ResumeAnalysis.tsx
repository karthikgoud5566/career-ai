
import { useEffect, useState, type ChangeEvent } from 'react'

import {
  analyzeResume,
  calculateResumeScore,
  getMyResumes,
  uploadResume,
  createJobDescription,
  analyzeAtsMatch,
  type ResumeAnalysisResponse,
  type ResumeResponse,
  type ResumeScoreResponse,
  type JobMatchResponse,
} from '../services/resumeService'

export default function ResumeAnalysis() {
  const [resumes, setResumes] = useState<ResumeResponse[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [analyzingId, setAnalyzingId] = useState<number | null>(null)
  const [scoringId, setScoringId] = useState<number | null>(null)

  const [analysis, setAnalysis] =
    useState<ResumeAnalysisResponse | null>(null)
  const [score, setScore] = useState<ResumeScoreResponse | null>(null)

  // ATS analysis state
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [selectedResumeId, setSelectedResumeId] = useState<number | ''>('')
  const [atsResult, setAtsResult] = useState<JobMatchResponse | null>(null)
  const [atsLoading, setAtsLoading] = useState(false)

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    void loadResumes()
  }, [])

  async function loadResumes() {
    setLoading(true)
    setError('')

    try {
      const data = await getMyResumes()
      setResumes(data)
    } catch (err) {
      console.error('Failed to load resumes:', err)
      setError('Could not load your resumes. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null

    setError('')
    setMessage('')
    setSelectedFile(null)

    if (!file) return

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf')

    if (!isPdf) {
      setError('Please select a PDF file.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('The PDF file must be 5 MB or smaller.')
      event.target.value = ''
      return
    }

    setSelectedFile(file)
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError('Please select a PDF file first.')
      return
    }

    setUploading(true)
    setError('')
    setMessage('')

    try {
      const uploaded = await uploadResume(selectedFile)

      setResumes((current) => [
        uploaded,
        ...current.filter((resume) => resume.id !== uploaded.id),
      ])

      setSelectedFile(null)
      setAnalysis(null)
      setScore(null)
      setAtsResult(null)
      setMessage('Resume uploaded successfully!')

      const fileInput = document.getElementById(
        'resume-file',
      ) as HTMLInputElement | null

      if (fileInput) fileInput.value = ''
    } catch (err) {
      console.error('Resume upload failed:', err)
      setError('Resume upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function handleAnalyze(resumeId: number) {
    setAnalyzingId(resumeId)
    setAnalysis(null)
    setError('')
    setMessage('')

    try {
      const result = await analyzeResume(resumeId)
      setAnalysis(result)
      setMessage('AI resume analysis completed successfully!')
    } catch (err) {
      console.error('Resume analysis failed:', err)
      setError(
        'Resume analysis failed. Check that the backend and Ollama are running.',
      )
    } finally {
      setAnalyzingId(null)
    }
  }

  async function handleCalculateScore(resumeId: number) {
    setScoringId(resumeId)
    setScore(null)
    setError('')
    setMessage('')

    try {
      const result = await calculateResumeScore(resumeId)
      setScore(result)
      setMessage('Resume score calculated successfully!')
    } catch (err) {
      console.error('Resume scoring failed:', err)
      setError('Could not calculate the resume score. Please try again.')
    } finally {
      setScoringId(null)
    }
  }

  async function handleAtsAnalysis() {
    if (selectedResumeId === '') {
      setError('Please select a resume for ATS analysis.')
      return
    }

    if (
      !jobTitle.trim() ||
      !company.trim() ||
      !jobDescription.trim()
    ) {
      setError(
        'Please enter the job title, company, and job description.',
      )
      return
    }

    setAtsLoading(true)
    setAtsResult(null)
    setError('')
    setMessage('')

    try {
      const job = await createJobDescription(
        jobTitle.trim(),
        company.trim(),
        jobDescription.trim(),
      )

      const result = await analyzeAtsMatch(selectedResumeId, job.id)

      setAtsResult(result)
      setMessage('ATS keyword analysis completed successfully!')
    } catch (err) {
      console.error('ATS analysis failed:', err)
      setError(
        'ATS analysis failed. Check the backend and try again. If the job was saved before the failure, you may have a saved job description without a match result.',
      )
    } finally {
      setAtsLoading(false)
    }
  }

  const scoreCategories = score
    ? [
        { label: 'Contact Information', value: score.contactScore },
        { label: 'Technical Skills', value: score.skillsScore },
        { label: 'Experience', value: score.experienceScore },
        { label: 'Projects', value: score.projectsScore },
        { label: 'Education', value: score.educationScore },
      ]
    : []

  function formatDate(date: string) {
    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return date
    }

    return parsedDate.toLocaleString()
  }

  function renderRequirements(value: string, emptyMessage: string) {
    const requirements = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (requirements.length === 0) {
      return <p className="text-sm text-zinc-400">{emptyMessage}</p>
    }

    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {requirements.map((requirement, index) => (
          <span
            key={`${index}-${requirement}`}
            className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200"
          >
            {requirement}
          </span>
        ))}
      </div>
    )
  }

  return (
    <main className="min-h-full space-y-8 bg-zinc-950 p-4 text-white sm:p-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
          CareerAI
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Resume Analysis
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Upload your resume, review AI-powered insights, evaluate your
          resume score, and compare your resume against a job description.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300"
        >
          {message}
        </div>
      )}

      {/* Resume upload */}
      <section className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div>
          <h2 className="text-xl font-bold">Upload your resume</h2>
          <p className="mt-1 text-sm text-zinc-400">
            PDF format only, up to 5 MB.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            id="resume-file"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-zinc-700"
          />

          <button
            type="button"
            onClick={() => void handleUpload()}
            disabled={!selectedFile || uploading}
            className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </div>

        {selectedFile && (
          <p className="text-sm text-zinc-400">
            Selected: {selectedFile.name}
          </p>
        )}
      </section>

      {/* Resume list */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold">Your resumes</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Analyze a resume or calculate its score.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-sm text-zinc-400">
            Loading your resumes...
          </div>
        ) : resumes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 p-8">
            <p className="font-medium">No resumes uploaded yet</p>
            <p className="mt-2 text-sm text-zinc-400">
              Upload a PDF above to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <article
                key={resume.id}
                className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="break-words font-semibold text-white">
                    {resume.fileName}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Resume ID: {resume.id}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Uploaded: {formatDate(resume.uploadedAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void handleAnalyze(resume.id)}
                    disabled={
                      analyzingId !== null ||
                      scoringId !== null ||
                      uploading ||
                      atsLoading
                    }
                    className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {analyzingId === resume.id
                      ? 'Analyzing...'
                      : 'Analyze Resume'}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleCalculateScore(resume.id)}
                    disabled={
                      scoringId !== null ||
                      analyzingId !== null ||
                      uploading ||
                      atsLoading
                    }
                    className="rounded-lg border border-violet-500 px-4 py-2.5 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {scoringId === resume.id
                      ? 'Calculating...'
                      : 'Calculate Score'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ATS keyword analysis form */}
      <section className="space-y-5 rounded-2xl border border-violet-500/30 bg-zinc-900 p-6 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            CareerAI ATS
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            ATS Keyword Analysis
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Compare your resume with a job description to identify matching
            requirements, missing keywords, and areas to improve.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="ats-resume"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              Select resume
            </label>

            <select
              id="ats-resume"
              value={selectedResumeId}
              onChange={(event) => {
                const value = event.target.value
                setSelectedResumeId(value ? Number(value) : '')
                setAtsResult(null)
                setError('')
                setMessage('')
              }}
              disabled={loading || atsLoading || resumes.length === 0}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500 disabled:opacity-50"
            >
              <option value="">Choose a resume</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.fileName} (ID: {resume.id})
                </option>
              ))}
            </select>

            {resumes.length === 0 && !loading && (
              <p className="mt-2 text-sm text-amber-300">
                Upload a resume before running ATS analysis.
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="job-title"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Job title
              </label>
              <input
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                placeholder="e.g. Java Backend Developer"
                disabled={atsLoading}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="company-name"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Company name
              </label>
              <input
                id="company-name"
                type="text"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="e.g. Example Technologies"
                disabled={atsLoading}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="job-description"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              Job description
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the full job description here, including responsibilities, required skills, qualifications, and experience..."
              rows={8}
              disabled={atsLoading}
              className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 disabled:opacity-50"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Paste the actual job description for a more relevant comparison.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleAtsAnalysis()}
            disabled={
              atsLoading ||
              loading ||
              resumes.length === 0 ||
              selectedResumeId === ''
            }
            className="w-full rounded-lg bg-violet-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {atsLoading ? 'Analyzing ATS Match...' : 'Analyze ATS Match'}
          </button>
        </div>
      </section>

      {/* ATS results */}
      {atsResult && (
        <section className="space-y-6 rounded-2xl border border-violet-500/30 bg-zinc-900 p-6 sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              ATS Results
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Your Resume Match
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Resume ID: {atsResult.resumeId} · Job Description ID:{' '}
              {atsResult.jobDescriptionId}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm text-zinc-400">ATS match score</p>
                <p className="mt-1 text-4xl font-bold text-violet-400">
                  {atsResult.matchScore.toFixed(2)}%
                </p>
              </div>
              <p className="text-xs text-zinc-500">
                Based on the requirements extracted by the current backend.
              </p>
            </div>

            <div
              className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-800"
              role="progressbar"
              aria-label="ATS match score"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.max(
                0,
                Math.min(100, atsResult.matchScore),
              )}
            >
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-500"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, atsResult.matchScore),
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <h3 className="font-semibold text-emerald-300">
                Matched Requirements
              </h3>
              {renderRequirements(
                atsResult.matchedRequirements,
                'No matched requirements were returned.',
              )}
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h3 className="font-semibold text-amber-300">
                Missing Requirements
              </h3>
              {renderRequirements(
                atsResult.missingRequirements,
                'No missing requirements were returned.',
              )}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 p-5">
            <h3 className="font-semibold">Recommendations</h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
              {atsResult.recommendations ||
                'No recommendations were returned.'}
            </p>
          </div>

          <p className="text-xs leading-5 text-zinc-500">
            This score is an estimate based on the requirements identified by
            your current ATS analysis service. It is not a guarantee of
            interview selection. Add missing skills to your resume only when
            they accurately reflect your experience.
          </p>
        </section>
      )}

      {/* AI resume analysis results */}
      {analysis && (
        <section className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              AI-powered insights
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Resume Analysis Results
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Resume ID: {analysis.resumeId}
            </p>
          </div>

          {[
            {
              title: 'Professional Summary',
              content: analysis.summary,
            },
            {
              title: 'Verified Skills',
              content: analysis.skills,
            },
            {
              title: 'Experience',
              content: analysis.experienceSummary,
            },
            {
              title: 'Projects',
              content: analysis.projectSummary,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-800 p-5"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                {item.content}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Resume score results */}
      {score && (
        <section className="space-y-6 rounded-2xl border border-violet-500/30 bg-zinc-900 p-6 sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              Resume score
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Resume Score Results
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Resume ID: {score.resumeId}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-300">Overall score</span>
              <span className="text-3xl font-bold text-violet-400">
                {score.overallScore}/100
              </span>
            </div>

            <div
              className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800"
              role="progressbar"
              aria-label="Overall resume score"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.max(
                0,
                Math.min(100, score.overallScore),
              )}
            >
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-500"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, score.overallScore),
                  )}%`,
                }}
              />
            </div>

            <p className="mt-3 text-xs leading-5 text-zinc-500">
              This is a preliminary rule-based score, not an official ATS
              ranking or a prediction of hiring outcomes.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {scoreCategories.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-zinc-800 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-zinc-300">
                    {item.label}
                  </span>
                  <span className="font-semibold text-white">
                    {item.value}/100
                  </span>
                </div>

                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800"
                  role="progressbar"
                  aria-label={item.label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.max(
                    0,
                    Math.min(100, item.value),
                  )}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.value < 50
                        ? 'bg-amber-500'
                        : 'bg-violet-500'
                    }`}
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, item.value),
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-zinc-800 p-5">
            <h3 className="font-semibold">Recommendations</h3>

            {score.recommendations.length > 0 ? (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">
                {score.recommendations.map((recommendation, index) => (
                  <li key={`${index}-${recommendation}`}>
                    {recommendation}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-zinc-400">
                No recommendations were returned by the current scoring rules.
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  )
}
