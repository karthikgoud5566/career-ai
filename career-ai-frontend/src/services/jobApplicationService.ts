
import api from './api'

export type ApplicationStatus =
  | 'APPLIED'
  | 'ASSESSMENT'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN'

export interface JobApplication {
  id: number
  jobTitle: string
  company: string
  jobUrl: string | null
  status: ApplicationStatus
  applicationDate: string
  notes: string | null
}

export interface JobApplicationRequest {
  jobTitle: string
  company: string
  jobUrl: string
  status: ApplicationStatus
  applicationDate: string
  notes: string
}

export async function getMyApplications(): Promise<JobApplication[]> {
  const response = await api.get<JobApplication[]>('/job-applications')
  return response.data
}

export async function createApplication(
  data: JobApplicationRequest,
): Promise<JobApplication> {
  const response = await api.post<JobApplication>('/job-applications', data)
  return response.data
}

export async function updateApplication(
  id: number,
  data: JobApplicationRequest,
): Promise<JobApplication> {
  const response = await api.put<JobApplication>(`/job-applications/${id}`, data)
  return response.data
}

export async function deleteApplication(id: number): Promise<void> {
  await api.delete(`/job-applications/${id}`)
}
