
import { useEffect, useMemo, useState } from 'react'
import {
  createApplication,
  deleteApplication,
  getMyApplications,
  updateApplication,
  type ApplicationStatus,
  type JobApplication,
  type JobApplicationRequest,
} from '../services/jobApplicationService'

const statuses: ApplicationStatus[] = [
  'APPLIED',
  'ASSESSMENT',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
]

const emptyForm: JobApplicationRequest = {
  jobTitle: '',
  company: '',
  jobUrl: '',
  status: 'APPLIED',
  applicationDate: new Date().toLocaleDateString('en-CA'),
  notes: '',
}

const statusStyles: Record<ApplicationStatus, string> = {
  APPLIED: 'bg-blue-500/10 text-blue-400',
  ASSESSMENT: 'bg-cyan-500/10 text-cyan-400',
  INTERVIEW: 'bg-violet-500/10 text-violet-400',
  OFFER: 'bg-emerald-500/10 text-emerald-400',
  REJECTED: 'bg-red-500/10 text-red-400',
  WITHDRAWN: 'bg-zinc-700 text-zinc-300',
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

export default function Applications() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [form, setForm] = useState<JobApplicationRequest>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadApplications() {
    setLoading(true)
    setError('')
    try {
      setApplications(await getMyApplications())
    } catch {
      setError('Could not load applications. Check your login and backend connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadApplications()
  }, [])

  function updateField<K extends keyof JobApplicationRequest>(
    key: K,
    value: JobApplicationRequest[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  function resetForm() {
    setForm({
      ...emptyForm,
      applicationDate: new Date().toLocaleDateString('en-CA'),
    })
    setEditingId(null)
  }

  function startEdit(application: JobApplication) {
    setForm({
      jobTitle: application.jobTitle,
      company: application.company,
      jobUrl: application.jobUrl ?? '',
      status: application.status,
      applicationDate: application.applicationDate,
      notes: application.notes ?? '',
    })
    setEditingId(application.id)
    setError('')
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      if (editingId !== null) {
        await updateApplication(editingId, form)
        setMessage('Application updated successfully.')
      } else {
        await createApplication(form)
        setMessage('Application added successfully.')
      }

      resetForm()
      await loadApplications()
    } catch {
      setError('Could not save the application. Check the fields and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this job application?')) return

    setError('')
    setMessage('')

    try {
      await deleteApplication(id)
      setApplications((previous) => previous.filter((item) => item.id !== id))
      if (editingId === id) resetForm()
      setMessage('Application deleted.')
    } catch {
      setError('Could not delete this application.')
    }
  }

  const filteredApplications = useMemo(
    () => applications.filter(
      (application) => filter === 'ALL' || application.status === filter,
    ),
    [applications, filter],
  )

  const interviewCount = applications.filter(
    (application) => application.status === 'INTERVIEW',
  ).length

  const offerCount = applications.filter(
    (application) => application.status === 'OFFER',
  ).length

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-medium text-violet-400">CAREERAI WORKSPACE</p>
        <h1 className="mt-2 text-3xl font-bold">Application Tracker</h1>
        <p className="mt-2 text-zinc-400">
          Organize your job applications and track every step of your search.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total applications', value: applications.length },
          { label: 'Interviews', value: interviewCount },
          { label: 'Offers', value: offerCount },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">{item.label}</p>
            <p className="mt-2 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold">
          {editingId !== null ? 'Edit application' : 'Add a job application'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm text-zinc-300">
              Job title *
              <input
                required
                maxLength={150}
                value={form.jobTitle}
                onChange={(event) => updateField('jobTitle', event.target.value)}
                placeholder="e.g. Java Backend Developer"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
              />
            </label>

            <label className="space-y-2 text-sm text-zinc-300">
              Company *
              <input
                required
                maxLength={150}
                value={form.company}
                onChange={(event) => updateField('company', event.target.value)}
                placeholder="e.g. Example Technologies"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
              />
            </label>

            <label className="space-y-2 text-sm text-zinc-300">
              Job posting URL
              <input
                type="url"
                value={form.jobUrl}
                onChange={(event) => updateField('jobUrl', event.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
              />
            </label>

            <label className="space-y-2 text-sm text-zinc-300">
              Application date *
              <input
                required
                type="date"
                value={form.applicationDate}
                onChange={(event) => updateField('applicationDate', event.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
              />
            </label>

            <label className="space-y-2 text-sm text-zinc-300">
              Status *
              <select
                required
                value={form.status}
                onChange={(event) => updateField('status', event.target.value as ApplicationStatus)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{formatStatus(status)}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block space-y-2 text-sm text-zinc-300">
            Notes
            <textarea
              maxLength={2000}
              rows={3}
              value={form.notes}
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder="Recruiter details, interview date, follow-up reminders..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
            />
          </label>

          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          {message && <p role="status" className="text-sm text-emerald-400">{message}</p>}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingId !== null ? 'Update application' : 'Save application'}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-zinc-700 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Your applications</h2>
          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Filter applications by status"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
            >
              <option value="ALL">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{formatStatus(status)}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => void loadApplications()}
              className="text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <p className="rounded-xl border border-zinc-800 p-6 text-zinc-400">Loading applications...</p>
        ) : filteredApplications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center">
            <p className="font-semibold">No applications found</p>
            <p className="mt-2 text-sm text-zinc-400">
              Add your first job application using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <article key={application.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{application.company}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      Applied on {application.applicationDate}
                    </p>
                  </div>

                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[application.status]}`}>
                    {formatStatus(application.status)}
                  </span>
                </div>

                {application.jobUrl && (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block break-all text-sm text-violet-400 hover:underline"
                  >
                    View job posting
                  </a>
                )}

                {application.notes && (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                    {application.notes}
                  </p>
                )}

                <div className="mt-4 flex gap-3 border-t border-zinc-800 pt-4">
                  <button
                    type="button"
                    onClick={() => startEdit(application)}
                    className="text-sm font-medium text-violet-400 hover:text-violet-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(application.id)}
                    className="text-sm font-medium text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
