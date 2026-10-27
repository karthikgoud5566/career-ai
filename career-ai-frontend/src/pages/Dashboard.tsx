
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../services/dashboardService'
import type { DashboardData } from '../types/dashboard'

const quickActions = [
  {
    title: 'Analyze your resume',
    description: 'Discover your skills and get AI-powered resume insights.',
    path: '/resumes',
    icon: '▤',
  },
  {
    title: 'Match a job description',
    description: 'Compare your resume against a job and identify skill gaps.',
    path: '/job-matching',
    icon: '◎',
  },
  {
    title: 'Track applications',
    description: 'Organize applications and follow your job search progress.',
    path: '/applications',
    icon: '✓',
  },
]

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError('')
        const result = await getDashboard()
        setData(result)
      } catch {
        setError(
          'Unable to load dashboard data. Check that the backend is running and you are logged in.',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  const stats = [
    {
      label: 'Applications',
      value: data?.totalApplications ?? 0,
      detail: 'Jobs you have applied to',
    },
    {
      label: 'Interviews',
      value: data?.interviews ?? 0,
      detail: 'Interview-stage applications',
    },
    {
      label: 'Offers',
      value: data?.offers ?? 0,
      detail: 'Offers received',
    },
    {
      label: 'Resumes',
      value: data?.resumesUploaded ?? 0,
      detail: 'Resumes uploaded',
    },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="text-sm font-medium text-violet-400">
          YOUR CAREER WORKSPACE
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Build your next career move.
        </h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Analyze your resume, find relevant opportunities, and manage your
          applications—all in one place.
        </p>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <p className="text-sm text-zinc-400">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold">
              {loading ? '—' : stat.value}
            </p>
            <p className="mt-2 text-xs text-zinc-500">{stat.detail}</p>
          </article>
        ))}
      </section>

      {loading && (
        <p role="status" className="text-sm text-zinc-400">
          Loading your dashboard...
        </p>
      )}

      <section>
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Get started</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Choose what you want to work on today.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-violet-500/60 hover:bg-zinc-800/70"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-xl text-violet-400">
                {action.icon}
              </span>
              <h4 className="mt-5 font-semibold group-hover:text-violet-300">
                {action.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {action.description}
              </p>
              <p className="mt-5 text-sm font-medium text-violet-400">
                Explore feature →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-zinc-700 p-6 sm:p-8">
        <h3 className="text-lg font-semibold">Your journey starts here</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Your dashboard statistics update from your CareerAI account data.
          Start by analyzing a resume or tracking an application.
        </p>
      </section>
    </div>
  )
}
