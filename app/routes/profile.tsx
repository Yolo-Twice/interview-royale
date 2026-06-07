import { useState, useEffect } from "react"
import { useAuth } from "~/contexts/auth-provider"
import { getUserProfile, updateUserProfile, uploadPhoto, uploadResume } from "~/lib/api/users"
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
const getMockProfile = (displayName: string, email: string | null, defaultPhotoURL: string | null): CandidateProfile => ({
  displayName: displayName !== "there" ? displayName : "Alex Developer",
  targetRole: "Frontend Engineer",
  university: "University of Technology",
  bio: "Passionate frontend engineer with 3 years of experience building scalable web applications. Focused on React ecosystem, performance optimization, and creating accessible user interfaces.",
  location: "San Francisco, CA",
  joinDate: "June 2024",
  photoURL: defaultPhotoURL,
  resume: {
    status: "none",
    fileName: null,
    uploadedAt: null,
  },
  socialLinks: {
    github: "",
    linkedin: "",
    portfolio: "",
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
  const [loading, setLoading] = useState(true)
  
  const [profile, setProfile] = useState<CandidateProfile>(
    getMockProfile(getUserDisplayName(user), user?.email ?? null, user?.photoURL ?? null)
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

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false)
        return
      }
      try {
        const data = await getUserProfile(user.uid)
        if (data) {
          // Remove empty strings from data so it doesn't overwrite defaults
          const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== "" && v !== null && (Array.isArray(v) ? v.length > 0 : true))
          );
          
          const loadedProfile = {
            ...getMockProfile(getUserDisplayName(user), user.email, user.photoURL),
            ...cleanData,
            // Ensure nested objects aren't lost
            socialLinks: cleanData.socialLinks || data.socialLinks || { github: "", linkedin: "", portfolio: "" },
            primarySkills: cleanData.primarySkills || data.primarySkills || [],
            technologies: cleanData.technologies || data.technologies || [],
            areasOfInterest: cleanData.areasOfInterest || data.areasOfInterest || [],
            interviewPreferences: cleanData.interviewPreferences || data.interviewPreferences || {
              domains: ["Frontend"],
              difficulty: "Medium",
              aiBehavior: "Neutral",
            }
          }
          setProfile(loadedProfile as any) // Temporary cast to match mock signature if required
          setFormData({
            displayName: loadedProfile.displayName || "",
            targetRole: loadedProfile.targetRole || "",
            university: loadedProfile.university || "",
            bio: loadedProfile.bio || "",
            location: loadedProfile.location || "",
            socialLinks: loadedProfile.socialLinks,
            primarySkills: loadedProfile.primarySkills,
            technologies: loadedProfile.technologies,
            areasOfInterest: loadedProfile.areasOfInterest,
            interviewPreferences: loadedProfile.interviewPreferences as any,
          })
        }
      } catch (err) {
        console.error("Failed to load profile:", err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [user])

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

  const handleSave = async () => {
    if (!user) return
    try {
      await updateUserProfile(user.uid, formData)
      setProfile((prev) => ({
        ...prev,
        ...formData,
      }))
      setIsEditing(false)
    } catch (err) {
      console.error("Failed to save profile:", err)
    }
  }

  const handlePhotoUpload = async (file: File) => {
    if (!user) return
    try {
      const response = await uploadPhoto(user.uid, file)
      setProfile((prev) => ({ ...prev, photoURL: response.photoURL }))
    } catch (err) {
      console.error("Failed to upload photo:", err)
    }
  }

  const handleResumeUpload = async (file: File) => {
    if (!user) return
    try {
      const response = await uploadResume(user.uid, file)
      setProfile((prev) => ({ ...prev, resume: response.resume }))
    } catch (err) {
      console.error("Failed to upload resume:", err)
    }
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
            onPhotoUpload={handlePhotoUpload}
          />
          
          <ProfessionalPresence
            profile={profile}
            formData={formData}
            isEditing={isEditing}
            onFormChange={handleFormChange}
            onResumeUpload={handleResumeUpload}
          />
          
          <SkillsGrid
            profile={profile}
            formData={formData}
            isEditing={isEditing}
            onFormChange={handleFormChange}
          />
        </div>

        {/* Right Sidebar Column */}
        <div className="flex flex-col gap-6">
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
