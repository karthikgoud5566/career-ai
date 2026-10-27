
export interface DashboardData {
  totalApplications: number
  interviews: number
  offers: number
  rejected: number
  assessments: number
  resumesUploaded: number
  applicationsByStatus: Record<string, number>
}
