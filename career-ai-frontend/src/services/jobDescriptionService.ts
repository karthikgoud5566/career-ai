
import api from './api'

export interface JobDescription {
  id: number
  title: string
  company: string
  description: string
  createdAt: string
}

export interface CreateJobDescriptionRequest {
  title: string
  company: string
  description: string
}

export async function getJobDescriptions(): Promise<JobDescription[]> {
  const response = await api.get<JobDescription[]>('/job-descriptions')
  return response.data
}

export async function createJobDescription(
  data: CreateJobDescriptionRequest,
): Promise<JobDescription> {
  const response = await api.post<JobDescription>(
  '/job-descriptions',
  data,
)

  return response.data
}
