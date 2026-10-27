
import { useEffect, useState, type FormEvent } from 'react'
import {
  createJobDescription,
  getJobDescriptions,
  type JobDescription,
} from '../services/jobDescriptionService'

export default function JobDescriptions() {
  const [jobs, setJobs] = useState<JobDescription[]>([])
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadJobs() {
    setLoading(true)
    setError('')

    try {
      const data = await getJobDescriptions()
      setJobs(data)
    } catch {
      setError('Could not load job descriptions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadJobs()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const saved = await createJobDescription({
        title: title.trim(),
        company: company.trim(),
        description: description.trim(),
      })

      setJobs((current) => [saved, ...current])
      setTitle('')
      setCompany('')
      setDescription('')
      setSuccess('Job description saved successfully.')
    } catch {
      setError('Could not save this job description. Check your input and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-sm font-medium text-violet-400">CAREERAI WORKSPACE</p>
        <h1 className="mt-2 text-3xl font-bold">Job Descriptions</h1>
        <p className="mt-2 text-zinc-400">
          Save job openings to use later for resume matching.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <h2 className="text-xl font-semibold">Add a job description</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-zinc-300">
            Job title
            <input
              required
              maxLength={150}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Java Backend Developer"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-violet-500"
            />
          </label>

          <label className="space-y-2 text-sm text-zinc-300">
            Company
            <input
              required
              maxLength={150}
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="e.g. Example Technologies"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-violet-500"
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm text-zinc-300">
          Full job description
          <textarea
            required
            rows={7}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Paste the job responsibilities, requirements, and skills..."
            className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-violet-500"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-400">{error}</p>
        )}

        {success && (
          <p role="status" className="text-sm text-emerald-400">{success}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save job description'}
        </button>
      </form>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Saved job descriptions</h2>
          <button
            type="button"
            onClick={() => void loadJobs()}
            disabled={loading}
            className="text-sm text-violet-400 hover:text-violet-300 disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-zinc-400">Loading job descriptions...</p>
        ) : jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center">
            <p className="font-medium">No job descriptions saved yet</p>
            <p className="mt-2 text-sm text-zinc-400">
              Add your first job description using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="mt-1 text-sm text-violet-400">{job.company}</p>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-300">
                  {job.description}
                </p>
                <p className="mt-4 text-xs text-zinc-500">
                  {job.createdAt
                    ? `Saved ${new Date(job.createdAt).toLocaleString()}`
                    : ''}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
