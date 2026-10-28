
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'

import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ResumeAnalysis from './pages/ResumeAnalysis'
import JobDescriptions from './pages/JobDescriptions'
import JobMatching from './pages/JobMatching'
import Applications from './pages/Applications'

function ProtectedRoute() {
  const token = localStorage.getItem('careerai_token')
  return token ? <Outlet /> : <Navigate to="/login" replace />
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
