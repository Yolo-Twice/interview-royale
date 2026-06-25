import { useState, useEffect } from "react"
import { useAuth } from "~/contexts/auth-provider"

import {
  getUserProfile,
  updateUserProfile,
  uploadPhoto,
  uploadResume,
  getResume,
  removeResume,
} from "~/lib/api/users"
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
const getMockProfile = (
  displayName: string,
  email: string | null,
  defaultPhotoURL: string | null
): CandidateProfile => ({
  displayName: displayName !== "there" ? displayName : "Alex Developer",
  targetRole: "Frontend Engineer",
  university: "University of Technology",
  bio: "Passionate frontend engineer with 3 years of experience building scalable web applications. Focused on React ecosystem, performance optimization, and creating accessible user interfaces.",
  location: "San Francisco, CA",
  joinDate: "June 2024",
  photoURL: defaultPhotoURL,
  profilePictureUrl: defaultPhotoURL,
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
  skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
  technologies: ["Node.js", "GraphQL", "Jest", "Figma", "Docker"],
  tools: ["Node.js", "GraphQL", "Jest", "Figma", "Docker"],
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
    getMockProfile(
      getUserDisplayName(user),
      user?.email ?? null,
      user?.photoURL ?? null
    )
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
    skills: profile.skills || profile.primarySkills,
    technologies: profile.technologies,
    tools: profile.tools || profile.technologies,
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
            Object.entries(data).filter(
              ([_, v]) =>
                v !== "" &&
                v !== null &&
                (Array.isArray(v) ? v.length > 0 : true)
            )
          )

          const loadedProfile = {
            ...getMockProfile(
              getUserDisplayName(user),
              user.email,
              user.photoURL
            ),
            ...cleanData,
            // Ensure nested objects aren't lost
            socialLinks: cleanData.socialLinks ||
              data.socialLinks || { github: "", linkedin: "", portfolio: "" },
            primarySkills:
              cleanData.primarySkills || data.primarySkills || data.skills || [],
            skills:
              cleanData.skills || data.skills || data.primarySkills || [],
            technologies:
              cleanData.technologies || data.technologies || data.tools || [],
            tools:
              cleanData.tools || data.tools || data.technologies || [],
            areasOfInterest:
              cleanData.areasOfInterest || data.areasOfInterest || [],
            interviewPreferences: cleanData.interviewPreferences ||
              data.interviewPreferences || {
                domains: ["Frontend"],
                difficulty: "Medium",
                aiBehavior: "Neutral",
              },
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
            skills: loadedProfile.skills,
            technologies: loadedProfile.technologies,
            tools: loadedProfile.tools,
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
      skills: profile.skills || profile.primarySkills,
      technologies: profile.technologies,
      tools: profile.tools || profile.technologies,
      areasOfInterest: profile.areasOfInterest,
      interviewPreferences: profile.interviewPreferences,
    })
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!user) return
    try {
      const payload = {
        ...formData,
        primarySkills: formData.primarySkills,
        skills: formData.primarySkills,
        technologies: formData.technologies,
        tools: formData.technologies,
      }

      await updateUserProfile(user.uid, payload)
      setProfile((prev) => ({
        ...prev,
        ...formData,
        skills: formData.primarySkills,
        tools: formData.technologies,
        profilePictureUrl: profile.profilePictureUrl || profile.photoURL,
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

    // Client-side validation
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedExt = [".pdf", ".doc", ".docx"]
    const name = file.name.toLowerCase()
    const hasValidExt = allowedExt.some((ext) => name.endsWith(ext))
    if (!hasValidExt) {
      setUploadError(
        "Invalid file type. Please upload a PDF or Word document (.pdf, .doc, .docx)."
      )
      return
    }
    if (file.size > maxSize) {
      setUploadError("File is too large. Maximum size is 5MB.")
      return
    }

    setUploadError(null)

    // Use profile.userId if available, otherwise fallback to Firebase uid
    const apiUserId = (profile as any).userId || user.uid

    try {
      setProfile((prev) => ({
        ...prev,
        resume: { ...(prev.resume || {}), status: "uploading" } as any,
      }))

      await uploadResume(apiUserId, file)

      // Refresh resume info from backend
      const resumeResp = await getResume(apiUserId)
      if (resumeResp && resumeResp.resume) {
        setProfile((prev) => ({ ...prev, resume: resumeResp.resume }))
      }
    } catch (err: any) {
      console.error("Failed to upload resume:", err)
      setUploadError(err?.message || "Upload failed. Please try again.")
      setProfile((prev) => ({
        ...prev,
        resume: { ...(prev.resume || {}), status: "none" } as any,
      }))
    }
  }

  const handleResumeRemove = async () => {
    if (!user) return
    if (!confirm("Remove your uploaded resume? This cannot be undone.")) {
      return
    }

    setUploadError(null)
    const apiUserId = (profile as any).userId || user.uid

    try {
      await removeResume(apiUserId)
      setProfile(
        (prev) =>
          ({
            ...prev,
            resume: {
              status: "none",
              fileName: null,
              uploadedAt: null,
              url: null,
            },
          }) as any
      )
    } catch (err: any) {
      console.error("Failed to remove resume:", err)
      setUploadError(
        err?.message || "Could not remove resume. Please try again."
      )
    }
  }

  const [uploadError, setUploadError] = useState<string | null>(null)

  // Fetch resume info separately so the UI can reflect uploaded resume
  useEffect(() => {
    async function loadResume() {
      if (!user) return
      const apiUserId = (profile as any).userId || user.uid
      try {
        const resumeResp = await getResume(apiUserId)
        if (resumeResp && resumeResp.resume) {
          setProfile((prev) => ({ ...prev, resume: resumeResp.resume }))
        }
      } catch (err) {
        // non-fatal - resume may not exist
        console.debug("No resume info available:", err)
      }
    }
    loadResume()
  }, [user])

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
            onResumeRemove={handleResumeRemove}
            uploadError={uploadError}
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
