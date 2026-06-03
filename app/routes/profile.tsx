import { useState } from "react"
import { useAuth } from "~/contexts/auth-provider"
import { ProfileHeader } from "~/components/profile/profile-header"
import { IdentityCard } from "~/components/profile/identity-card"
import { ProfessionalPresence } from "~/components/profile/professional-presence"
import { SkillsGrid } from "~/components/profile/skills-grid"
import { InterviewPreferencesSection } from "~/components/profile/interview-preferences"
import { AchievementsSection } from "~/components/profile/achievements-section"
import { RecruiterCard } from "~/components/profile/recruiter-card"
import { PublicVisibility } from "~/components/profile/public-visibility"
import { RecruiterPreviewSheet } from "~/components/profile/recruiter-preview-sheet"
import type { CandidateProfile, ProfileFormData } from "~/lib/profile-types"
import { getUserDisplayName } from "~/lib/user-display"

// Mock data initialized with the logged-in user details where possible
const getMockProfile = (displayName: string, email: string | null): CandidateProfile => ({
  displayName: displayName !== "there" ? displayName : "Alex Developer",
  targetRole: "Frontend Engineer",
  university: "University of Technology",
  bio: "Passionate frontend engineer with 3 years of experience building scalable web applications. Focused on React ecosystem, performance optimization, and creating accessible user interfaces.",
  location: "San Francisco, CA",
  joinDate: "June 2024",
  photoURL: null,
  resume: {
    status: "uploaded",
    fileName: "Alex_Resume_2026.pdf",
    uploadedAt: "2 days ago",
  },
  socialLinks: {
    github: "https://github.com/alexdev",
    linkedin: "https://linkedin.com/in/alexdev",
    portfolio: "https://alexdev.com",
  },
  primarySkills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
  technologies: ["Node.js", "GraphQL", "Jest", "Figma", "Docker"],
  areasOfInterest: ["System Design", "WebGL", "Accessibility"],
  currentStreak: 3,
  longestStreak: 12,
  totalInterviews: 15,
  achievements: [
    {
      id: "first-interview",
      label: "First Steps",
      description: "Complete your first practice interview.",
      earnedAt: "June 15, 2024",
      icon: "Target",
    },
    {
      id: "perfect-score",
      label: "Flawless Execution",
      description: "Score 10/10 in a technical assessment.",
      earnedAt: "Oct 2, 2025",
      icon: "Award",
    },
    {
      id: "streak-7",
      label: "7-Day Streak",
      description: "Practice for 7 consecutive days.",
      earnedAt: "Jan 14, 2026",
      icon: "Flame",
    },
    {
      id: "top-10-percent",
      label: "Top 10% Communicator",
      description: "Rank in the top 10% for communication skills globally.",
      earnedAt: null,
      icon: "Trophy",
    },
    {
      id: "speed-demon",
      label: "Speed Demon",
      description: "Complete a hard DSA problem in under 15 minutes.",
      earnedAt: null,
      icon: "Zap",
    },
  ],
  isPublic: false,
  shareableUrl: "https://interviewroyale.com/p/alex-dev-a7b2",
  interviewPreferences: {
    domains: ["Frontend", "System Design"],
    difficulty: "Medium",
    aiBehavior: "Challenging",
  },
})

export default function ProfilePage() {
  const { user } = useAuth()
  
  const [profile, setProfile] = useState<CandidateProfile>(
    getMockProfile(getUserDisplayName(user), user?.email ?? null)
  )
  
  const [isEditing, setIsEditing] = useState(false)
  const [showPreviewSheet, setShowPreviewSheet] = useState(false)
  
  // Separate state for the form edits so we can cancel
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: profile.displayName,
    targetRole: profile.targetRole,
    university: profile.university,
    bio: profile.bio,
    location: profile.location,
    socialLinks: profile.socialLinks,
    primarySkills: profile.primarySkills,
    technologies: profile.technologies,
    areasOfInterest: profile.areasOfInterest,
    interviewPreferences: profile.interviewPreferences,
  })

  const handleFormChange = (field: keyof ProfileFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleToggleVisibility = (isPublic: boolean) => {
    setProfile((prev) => ({ ...prev, isPublic }))
  }

  const handleEditToggle = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    // Revert form data to match current profile
    setFormData({
      displayName: profile.displayName,
      targetRole: profile.targetRole,
      university: profile.university,
      bio: profile.bio,
      location: profile.location,
      socialLinks: profile.socialLinks,
      primarySkills: profile.primarySkills,
      technologies: profile.technologies,
      areasOfInterest: profile.areasOfInterest,
      interviewPreferences: profile.interviewPreferences,
    })
    setIsEditing(false)
  }

  const handleSave = () => {
    // In a real app, save to backend here
    setProfile((prev) => ({
      ...prev,
      ...formData,
    }))
    setIsEditing(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
      <ProfileHeader
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Main Content Column */}
        <div className="flex flex-col gap-6">
          <IdentityCard
            profile={profile}
            formData={formData}
            isEditing={isEditing}
            onFormChange={handleFormChange}
          />
          
          <ProfessionalPresence
            profile={profile}
            formData={formData}
            isEditing={isEditing}
            onFormChange={handleFormChange}
          />
          
          <SkillsGrid
            profile={profile}
            formData={formData}
            isEditing={isEditing}
            onFormChange={handleFormChange}
          />
          
          <InterviewPreferencesSection
            profile={profile}
            formData={formData}
            isEditing={isEditing}
            onFormChange={handleFormChange}
          />
          
          <AchievementsSection profile={profile} />
        </div>

        {/* Right Sidebar Column */}
        <div className="flex flex-col gap-6">
          <PublicVisibility 
            profile={profile} 
            isEditing={isEditing} 
            onToggleVisibility={handleToggleVisibility} 
          />
          
          {/* We pass the formData to RecruiterCard when editing so the preview updates in real-time */}
          <RecruiterCard 
            profile={isEditing ? { ...profile, ...formData } : profile} 
            onViewFullPreview={() => setShowPreviewSheet(true)} 
          />
        </div>
      </div>

      <RecruiterPreviewSheet 
        profile={isEditing ? { ...profile, ...formData } : profile}
        open={showPreviewSheet}
        onOpenChange={setShowPreviewSheet}
      />
    </div>
  )
}
