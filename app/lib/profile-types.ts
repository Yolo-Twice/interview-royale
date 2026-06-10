export type ProfileUIState = "loading" | "viewing" | "editing" | "saving"

export type ResumeStatus = "none" | "uploading" | "uploaded"

export interface SocialLinks {
  github: string
  linkedin: string
  portfolio: string
}

export interface ResumeInfo {
  status: ResumeStatus
  fileName: string | null
  uploadedAt: string | null
  storedFileName?: string | null
  url?: string | null
}

export type InterviewDomain =
  | "Frontend"
  | "Backend"
  | "Full Stack"
  | "System Design"
  | "DSA"
  | "Behavioral"
  | "DevOps"
  | "Mobile"

export type DifficultyPreference = "Easy" | "Medium" | "Hard" | "Mixed"

export type AIBehavior = "Encouraging" | "Neutral" | "Challenging" | "Realistic"

export interface InterviewPreferences {
  domains: InterviewDomain[]
  difficulty: DifficultyPreference
  aiBehavior: AIBehavior
}

export interface AchievementBadge {
  id: string
  label: string
  description: string
  earnedAt: string | null // null = locked
  icon: string // lucide icon name
}

export interface CandidateProfile {
  // Identity
  displayName: string
  targetRole: string
  university: string
  bio: string
  location: string
  joinDate: string
  photoURL: string | null

  // Professional presence
  resume: ResumeInfo
  socialLinks: SocialLinks

  // Skills
  primarySkills: string[]
  technologies: string[]
  areasOfInterest: string[]

  // Achievements
  currentStreak: number
  longestStreak: number
  totalInterviews: number
  achievements: AchievementBadge[]

  // Public profile
  isPublic: boolean
  shareableUrl: string

  // Preferences
  interviewPreferences: InterviewPreferences
}

export interface ProfileFormData {
  displayName: string
  targetRole: string
  university: string
  bio: string
  location: string
  socialLinks: SocialLinks
  primarySkills: string[]
  technologies: string[]
  areasOfInterest: string[]
  interviewPreferences: InterviewPreferences
}
