import { MapPin, Calendar, Briefcase, GraduationCap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import type { CandidateProfile, ProfileFormData } from "~/lib/profile-types"

interface IdentityCardProps {
  profile: CandidateProfile
  formData: ProfileFormData
  isEditing: boolean
  onFormChange: (field: keyof ProfileFormData, value: any) => void
}

export function IdentityCard({
  profile,
  formData,
  isEditing,
  onFormChange,
}: IdentityCardProps) {
  const initials = formData.displayName
    ? formData.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?"

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Avatar size="lg" className="size-20 sm:size-24 border-2 border-background shadow-sm">
          {profile.photoURL ? (
            <AvatarImage src={profile.photoURL} alt={formData.displayName} />
          ) : null}
          <AvatarFallback className="text-xl sm:text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            {isEditing ? (
              <Input
                value={formData.displayName}
                onChange={(e) => onFormChange("displayName", e.target.value)}
                placeholder="Full Name"
                className="text-xl font-bold sm:text-2xl h-10 sm:h-12 w-full max-w-sm"
              />
            ) : (
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                {formData.displayName || "Add your name"}
              </h2>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {isEditing ? (
                <div className="flex items-center gap-1.5 w-full max-w-sm">
                  <Briefcase className="size-4 shrink-0 text-muted-foreground/70" />
                  <Input
                    value={formData.targetRole}
                    onChange={(e) => onFormChange("targetRole", e.target.value)}
                    placeholder="Target Role (e.g. Frontend Engineer)"
                    className="h-8 text-sm"
                  />
                </div>
              ) : (
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Briefcase className="size-4 shrink-0 text-primary/70" />
                  {formData.targetRole || "Add target role"}
                </span>
              )}

              {isEditing ? (
                <div className="flex items-center gap-1.5 w-full max-w-sm">
                  <GraduationCap className="size-4 shrink-0 text-muted-foreground/70" />
                  <Input
                    value={formData.university}
                    onChange={(e) => onFormChange("university", e.target.value)}
                    placeholder="University or Institution"
                    className="h-8 text-sm"
                  />
                </div>
              ) : formData.university ? (
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="size-4 shrink-0" />
                  {formData.university}
                </span>
              ) : null}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/50">
            {isEditing ? (
              <Textarea
                value={formData.bio}
                onChange={(e) => onFormChange("bio", e.target.value)}
                placeholder="Write a short professional bio highlighting your experience and goals..."
                className="min-h-[100px] text-sm"
              />
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {formData.bio || "Add a short bio highlighting your experience and goals."}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
            {isEditing ? (
              <div className="flex items-center gap-1.5 w-full max-w-xs">
                <MapPin className="size-3.5 shrink-0" />
                <Input
                  value={formData.location}
                  onChange={(e) => onFormChange("location", e.target.value)}
                  placeholder="Location (e.g. San Francisco, CA)"
                  className="h-7 text-xs"
                />
              </div>
            ) : formData.location ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" />
                {formData.location}
              </span>
            ) : null}

            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" />
              Joined {profile.joinDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
