
import api from './api'

export interface JobMatch {
  id: number
  resumeId: number
  jobDescriptionId: number
  matchScore: number
  matchedRequirements: string
  missingRequirements: string
  recommendations: string
  createdAt: string
}

export async function matchResumeToJob(
  resumeId: number,
  jobDescriptionId: number,
): Promise<JobMatch> {
  const response = await api.post<JobMatch>(
    `/job-matches/resume/${resumeId}/job/${jobDescriptionId}`,
  )

  return response.data
}

export async function getMatchesForResume(
  resumeId: number,
): Promise<JobMatch[]> {
  const response = await api.get<JobMatch[]>(
    `/job-matches/resume/${resumeId}`,
  )

  return response.data
}
