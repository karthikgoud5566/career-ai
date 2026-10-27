
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ResumeAnalysis from './pages/ResumeAnalysis'
import JobDescriptions from './pages/JobDescriptions'
import JobMatching from './pages/JobMatching'
import Applications from './pages/Applications'


import { Outlet } from 'react-router-dom'

function ProtectedRoute() {
  const token = localStorage.getItem('careerai_token')
  return token ? <Outlet /> : <Navigate to="/login" replace />
}


function Placeholder({ title }: { title: string }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
      <p className="text-sm font-medium text-violet-400">CAREERAI WORKSPACE</p>
      <h2 className="mt-3 text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-zinc-400">
        This feature is coming next. We'll connect it to your Spring Boot API.
      </p>
    </section>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/resumes" element={<ResumeAnalysis />} />
           <Route path="/job-matching" element={<JobMatching />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/jobs" element={<JobDescriptions />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
