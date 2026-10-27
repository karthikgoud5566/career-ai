
import api from './api'

export interface ResumeResponse {
  id: number
  fileName: string
  fileUrl: string
  uploadedAt: string
}

export async function uploadResume(
  file: File
): Promise<ResumeResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<ResumeResponse>(
    '/resumes',
    formData
  )

  return response.data
}

export async function getMyResumes(): Promise<ResumeResponse[]> {
  const response = await api.get<ResumeResponse[]>('/resumes')
  return response.data
}


export interface ResumeAnalysisResponse {
  id: number
  resumeId: number
  summary: string
  skills: string
  experienceSummary: string
  projectSummary: string
  createdAt: string
}

export async function analyzeResume(
  resumeId: number
): Promise<ResumeAnalysisResponse> {
  const response = await api.post<ResumeAnalysisResponse>(
    `/resume-analyses/${resumeId}`
  )

  return response.data
}



export interface ResumeScoreResponse {
  resumeId: number
  overallScore: number
  contactScore: number
  skillsScore: number
  experienceScore: number
  projectsScore: number
  educationScore: number
  recommendations: string[]
}

export async function calculateResumeScore(
  resumeId: number
): Promise<ResumeScoreResponse> {
  const response = await api.post<ResumeScoreResponse>(
    `/resume-scores/${resumeId}`
  )

  return response.data
}


export interface JobDescriptionResponse {
  id: number
  title: string
  company: string
  description: string
  createdAt: string
}

export interface JobMatchResponse {
  id: number
  resumeId: number
  jobDescriptionId: number
  matchScore: number
  matchedRequirements: string
  missingRequirements: string
  recommendations: string
  createdAt: string
}

export async function createJobDescription(
  title: string,
  company: string,
  description: string
): Promise<JobDescriptionResponse> {
  const response = await api.post<JobDescriptionResponse>(
    '/job-descriptions',
    {
      title,
      company,
      description,
    }
  )

  return response.data
}

export async function analyzeAtsMatch(
  resumeId: number,
  jobDescriptionId: number
): Promise<JobMatchResponse> {
  const response = await api.post<JobMatchResponse>(
    `/job-matches/resume/${resumeId}/job/${jobDescriptionId}`
  )

  return response.data
}

export async function getResumeJobMatches(
  resumeId: number
): Promise<JobMatchResponse[]> {
  const response = await api.get<JobMatchResponse[]>(
    `/job-matches/resume/${resumeId}`
  )

  return response.data
}

