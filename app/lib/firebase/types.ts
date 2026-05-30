import type { Timestamp } from "firebase/firestore"

export type InterviewType =
  | "Frontend"
  | "Backend"
  | "DSA"
  | "Behavioral"
  | "System Design"
export type Difficulty = "Easy" | "Medium" | "Hard"

export type TranscriptLine = {
  speaker: "AI" | "You"
  line: string
}

export type InterviewSessionDocument = {
  title: string
  type: InterviewType
  topic: string
  difficulty: Difficulty
  dateLabel: string
  dateGroup: "Last 7 days" | "Last month" | "All time"
  duration: string
  score: number
  technical: number
  communication: number
  confidence: number
  weakAreas: string[]
  tags: string[]
  completed: boolean
  transcript: TranscriptLine[]
  recommendation: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type InterviewSessionInput = Omit<
  InterviewSessionDocument,
  "createdAt" | "updatedAt"
>

export type UserProfileDocument = {
  displayName: string | null
  email: string | null
  photoURL: string | null
  targetRole: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}
