import { ExternalLink, MapPin, Briefcase } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import type { CandidateProfile } from "~/lib/profile-types"

interface RecruiterCardProps {
  profile: CandidateProfile
  onViewFullPreview: () => void
}

export function RecruiterCard({ profile, onViewFullPreview }: RecruiterCardProps) {
  const initials = profile.displayName
    ? profile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?"

  const earnedBadgesCount = profile.achievements.filter(a => a.earnedAt !== null).length

  return (
    <div className="rounded-xl border bg-card shadow-sm sticky top-24 overflow-hidden">
      <div className="h-16 bg-muted/40 w-full" />
      
      <div className="px-6 pb-6 relative">
        <Avatar className="size-16 absolute -top-8 border-4 border-card bg-card shadow-sm">
          {profile.photoURL ? (
            <AvatarImage src={profile.photoURL} alt={profile.displayName} />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="pt-12">
          <h3 className="text-lg font-bold leading-tight">
            {profile.displayName || "Candidate Name"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
            <Briefcase className="size-3.5 shrink-0" />
            {profile.targetRole || "Target Role"}
          </p>
          {profile.location && (
            <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" />
              {profile.location}
            </p>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Top Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.primarySkills.slice(0, 3).map(skill => (
                <span key={skill} className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {skill}
                </span>
              ))}
              {profile.primarySkills.length > 3 && (
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  +{profile.primarySkills.length - 3}
                </span>
              )}
              {profile.primarySkills.length === 0 && (
                <span className="text-xs text-muted-foreground italic">No skills listed</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t pt-4">
            <div className="rounded-lg bg-muted/30 p-2 text-center">
              <p className="text-xs text-muted-foreground mb-0.5">Interviews</p>
              <p className="text-lg font-bold">{profile.totalInterviews}</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-2 text-center">
              <p className="text-xs text-muted-foreground mb-0.5">Badges</p>
              <p className="text-lg font-bold">{earnedBadgesCount}</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-2" 
            onClick={onViewFullPreview}
          >
            <ExternalLink className="mr-2 size-3.5" />
            View Full Preview
          </Button>
        </div>
      </div>
    </div>
  )
}
