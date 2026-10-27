
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const navigation = [
  { label: 'Dashboard', path: '/', icon: '▦' },
  { label: 'Resume Analysis', path: '/resumes', icon: '▤' },
  { label: 'Job Matching', path: '/job-matching', icon: '◎' },
  { label: 'Applications', path: '/applications', icon: '✓' },
  { label: 'Job Descriptions', path: '/jobs', icon: '⌕' },
]

export default function AppLayout() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('careerai_token')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 md:flex">
      <aside className="flex flex-col border-b border-zinc-800 bg-zinc-900 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="border-b border-zinc-800 p-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Career<span className="text-violet-400">AI</span>
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Your intelligent career companion
          </p>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-3 md:flex-col md:p-4">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-violet-600 text-white'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden p-4 md:block">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-sm font-semibold">Career growth starts here</p>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Analyze your resume, discover skill gaps, and organize your job search.
            </p>
          </div>
        </div>

        <div className="mt-auto p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-zinc-700 px-4 py-3 text-left text-sm font-medium text-zinc-300 transition hover:border-red-500 hover:bg-red-950 hover:text-red-300"
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-5 md:px-8">
          <p className="text-sm text-zinc-400">Career workspace</p>
          <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
            AI-powered
          </span>
        </header>

        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
