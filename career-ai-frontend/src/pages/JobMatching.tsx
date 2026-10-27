
import { useEffect, useState } from 'react'
import {
  getMyResumes,
  analyzeAtsMatch,
  getResumeJobMatches,
  type ResumeResponse,
  type JobDescriptionResponse,
  type JobMatchResponse,
} from '../services/resumeService'
import { getJobDescriptions } from '../services/jobDescriptionService'

export default function JobMatching() {
  const [resumes, setResumes] = useState<ResumeResponse[]>([])
  const [jobs, setJobs] = useState<JobDescriptionResponse[]>([])
  const [resumeId, setResumeId] = useState('')
  const [jobId, setJobId] = useState('')
  const [result, setResult] = useState<JobMatchResponse | null>(null)
  const [history, setHistory] = useState<JobMatchResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadOptions() {
      setLoading(true)
      setError('')

      try {
        const [resumeData, jobData] = await Promise.all([
          getMyResumes(),
          getJobDescriptions(),
        ])

        setResumes(resumeData)
        setJobs(jobData)
      } catch {
        setError('Could not load resumes or job descriptions. Check that the backend is running.')
      } finally {
        setLoading(false)
      }
    }

    void loadOptions()
  }, [])

  async function handleMatch() {
    if (!resumeId || !jobId) {
      setError('Please select a resume and a job description.')
      return
    }

    setMatching(true)
    setError('')
    setResult(null)

    try {
      const match = await analyzeAtsMatch(Number(resumeId), Number(jobId))
      setResult(match)

      const previousMatches = await getResumeJobMatches(Number(resumeId))
      setHistory(previousMatches)
    } catch {
      setError('Matching failed. Please check your selection and try again.')
    } finally {
      setMatching(false)
    }
  }

  function renderList(value: string) {
    const items = value
      .split(/\r?\n|,(?![^[]*\])/)
      .map((item) => item.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean)

    if (items.length === 0) {
      return <p className="text-sm text-zinc-400">No items returned.</p>
    }

    return (
      <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">
        {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
      </ul>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-sm font-medium text-violet-400">CAREERAI WORKSPACE</p>
        <h1 className="mt-2 text-3xl font-bold">Job Matching</h1>
        <p className="mt-2 text-zinc-400">
          Compare your resume against a saved job description.
        </p>
      </div>

      <section className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold">Match your resume</h2>

        {loading ? (
          <p className="text-sm text-zinc-400">Loading your resumes and job descriptions...</p>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-zinc-300">
                Select resume
                <select
                  value={resumeId}
                  onChange={(event) => {
                    setResumeId(event.target.value)
                    setResult(null)
                    setHistory([])
                  }}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
                >
                  <option value="">Choose a resume</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.fileName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-zinc-300">
                Select job description
                <select
                  value={jobId}
                  onChange={(event) => {
                    setJobId(event.target.value)
                    setResult(null)
                  }}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
                >
                  <option value="">Choose a job description</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} — {job.company}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {resumes.length === 0 && (
              <p className="text-sm text-amber-400">
                Upload a resume in Resume Analysis before matching.
              </p>
            )}

            {jobs.length === 0 && (
              <p className="text-sm text-amber-400">
                Add a job description before matching.
              </p>
            )}

            <button
              type="button"
              onClick={() => void handleMatch()}
              disabled={matching || resumes.length === 0 || jobs.length === 0}
              className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {matching ? 'Analyzing match...' : 'Match Resume'}
            </button>
          </>
        )}

        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      </section>

      {result && (
        <section className="space-y-5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">Resume match score</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-5xl font-bold text-violet-400">
                {result.matchScore.toFixed(1)}%
              </span>
              <span className="pb-1 text-sm text-zinc-500">match</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-violet-500"
                style={{ width: `${Math.min(100, Math.max(0, result.matchScore))}%` }}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-4 font-semibold text-emerald-400">Matched requirements</h2>
              {renderList(result.matchedRequirements)}
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-4 font-semibold text-amber-400">Missing requirements</h2>
              {renderList(result.missingRequirements)}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 font-semibold">Recommendations</h2>
            {renderList(result.recommendations)}
          </div>
        </section>
      )}

      {history.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Previous matches for this resume</h2>
          {history.map((match) => {
            const job = jobs.find((item) => item.id === match.jobDescriptionId)

            return (
              <div key={match.id} className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div>
                  <p className="font-medium">{job?.title ?? `Job #${match.jobDescriptionId}`}</p>
                  <p className="text-sm text-zinc-400">{job?.company ?? 'Saved job'}</p>
                </div>
                <span className="font-semibold text-violet-400">
                  {match.matchScore.toFixed(1)}%
                </span>
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}
