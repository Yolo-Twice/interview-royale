import {
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  FileText,
  Calendar,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { Separator } from "~/components/ui/separator"
import type { CandidateProfile } from "~/lib/profile-types"

interface RecruiterPreviewSheetProps {
  profile: CandidateProfile
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecruiterPreviewSheet({
  profile,
  open,
  onOpenChange,
}: RecruiterPreviewSheetProps) {
  const initials = profile.displayName
    ? profile.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
    : "?"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto p-0 sm:max-w-xl"
      >
        <div className="flex-shrink-0 bg-muted/30 p-6 sm:p-8">
          <SheetHeader className="mb-6 p-0 text-left">
            <SheetTitle>Public Profile Preview</SheetTitle>
            <SheetDescription>
              This is exactly what recruiters and hiring managers see when they
              visit your public link.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Avatar className="size-20 border-2 border-background shadow-sm sm:size-24">
              {profile.photoURL ? (
                <AvatarImage src={profile.photoURL} alt={profile.displayName} />
              ) : null}
              <AvatarFallback className="text-xl sm:text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {profile.displayName || "Candidate Name"}
              </h2>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Briefcase className="size-4 shrink-0 text-primary/70" />
                  {profile.targetRole || "Target Role"}
                </span>
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 shrink-0" />
                    {profile.location}
                  </span>
                )}
                {profile.university && (
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="size-4 shrink-0" />
                    {profile.university}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8 p-6 sm:p-8">
          {profile.bio && (
            <section>
              <h3 className="mb-3 text-lg font-semibold">About</h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {profile.bio}
              </p>
            </section>
          )}

          <section>
            <h3 className="mb-3 text-lg font-semibold">Skills & Expertise</h3>
            <div className="space-y-4">
              {profile.primarySkills.length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Core Competencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.primarySkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-secondary px-2.5 py-1 text-sm font-medium text-secondary-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.technologies.length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Technologies & Tools
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border bg-background px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="mb-4 text-lg font-semibold">
              Interview Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border bg-card p-4">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Total Interviews Completed
                </p>
                <p className="text-2xl font-bold">{profile.totalInterviews}</p>
              </div>
              <div className="rounded-xl border bg-card p-4">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Top Skill Area
                </p>
                <p className="text-xl font-bold text-primary">
                  {profile.primarySkills[0] || "General"}
                </p>
              </div>
            </div>
          </section>


        </div>
      </SheetContent>
    </Sheet>
  )
}
