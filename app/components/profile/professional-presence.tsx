import { useRef } from "react"
import { FileText, Code, Briefcase, Globe, UploadCloud } from "lucide-react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import type { CandidateProfile, ProfileFormData } from "~/lib/profile-types"

interface ProfessionalPresenceProps {
  profile: CandidateProfile
  formData: ProfileFormData
  isEditing: boolean
  onFormChange: (field: keyof ProfileFormData, value: any) => void
  onResumeUpload?: (file: File) => void
  onResumeRemove?: () => void
  uploadError?: string | null
}

export function ProfessionalPresence({
  profile,
  formData,
  isEditing,
  onFormChange,
  onResumeUpload,
  onResumeRemove,
  uploadError,
}: ProfessionalPresenceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSocialChange = (network: keyof ProfileFormData["socialLinks"], value: string) => {
    onFormChange("socialLinks", {
      ...formData.socialLinks,
      [network]: value,
    })
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onResumeUpload) {
      onResumeUpload(file)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Professional Presence</h3>
      
      <div className="space-y-6">
        {/* Resume Section */}
        <div>
          <label className="mb-2 block text-sm font-medium">Resume</label>
          <div className="flex items-center gap-4 rounded-xl border border-dashed border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {profile.resume.status === "uploaded" ? (
                <FileText className="size-5" />
              ) : (
                <UploadCloud className="size-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {profile.resume.status === "uploaded" ? (
                <>
                  <p className="truncate text-sm font-medium text-foreground">
                    {profile.resume.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded on {profile.resume.uploadedAt}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">
                    No resume uploaded
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF or Word document, max 5MB
                  </p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              {profile.resume.status === "uploaded" ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => profile.resume.url && window.open(profile.resume.url, "_blank")}
                  >
                    View Resume
                  </Button>
                  <Button size="sm" onClick={handleUploadClick}>
                    Replace Resume
                  </Button>
                  {onResumeRemove ? (
                    <Button variant="destructive" size="sm" onClick={onResumeRemove}>
                      Remove
                    </Button>
                  ) : null}
                </>
              ) : profile.resume.status === "uploading" ? (
                <Button size="sm" disabled>
                  Uploading...
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={handleUploadClick}>
                  Upload
                </Button>
              )}
            </div>
          </div>
          {uploadError ? (
            <p className="mt-2 text-sm text-destructive">{uploadError}</p>
          ) : null}
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">External Links</label>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex w-24 shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                <Code className="size-4" />
                <span>GitHub</span>
              </div>
              {isEditing ? (
                <Input
                  value={formData.socialLinks.github}
                  onChange={(e) => handleSocialChange("github", e.target.value)}
                  placeholder="https://github.com/username"
                  className="h-8"
                />
              ) : (
                <div className="flex-1 text-sm">
                  {formData.socialLinks.github ? (
                    <a href={formData.socialLinks.github} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate block">
                      {formData.socialLinks.github.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex w-24 shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="size-4" />
                <span>LinkedIn</span>
              </div>
              {isEditing ? (
                <Input
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="h-8"
                />
              ) : (
                <div className="flex-1 text-sm">
                  {formData.socialLinks.linkedin ? (
                    <a href={formData.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate block">
                      {formData.socialLinks.linkedin.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex w-24 shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                <Globe className="size-4" />
                <span>Portfolio</span>
              </div>
              {isEditing ? (
                <Input
                  value={formData.socialLinks.portfolio}
                  onChange={(e) => handleSocialChange("portfolio", e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="h-8"
                />
              ) : (
                <div className="flex-1 text-sm">
                  {formData.socialLinks.portfolio ? (
                    <a href={formData.socialLinks.portfolio} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate block">
                      {formData.socialLinks.portfolio.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
