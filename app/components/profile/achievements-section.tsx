import { Award, Flame, Lock, Trophy, Target, Zap } from "lucide-react"
import type { CandidateProfile } from "~/lib/profile-types"
import { cn } from "~/lib/utils"

interface AchievementsSectionProps {
  profile: CandidateProfile
}

// Map string icon names to Lucide components
const IconMap: Record<string, React.ElementType> = {
  Award,
  Flame,
  Trophy,
  Target,
  Zap,
}

export function AchievementsSection({ profile }: AchievementsSectionProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">Verified Achievements</h3>
        <p className="text-sm text-muted-foreground">
          Badges earned through practice
        </p>
      </div>

      {/* Stats Summary row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-xl border bg-muted/20 p-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Flame className="size-3.5 text-orange-500" /> Current Streak
          </span>
          <span className="text-2xl font-bold">
            {profile.currentStreak}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              days
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border bg-muted/20 p-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Target className="size-3.5 text-primary" /> Total Interviews
          </span>
          <span className="text-2xl font-bold">{profile.totalInterviews}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border bg-muted/20 p-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Trophy className="size-3.5 text-amber-500" /> Longest Streak
          </span>
          <span className="text-2xl font-bold">
            {profile.longestStreak}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              days
            </span>
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profile.achievements.map((achievement) => {
          const isEarned = achievement.earnedAt !== null
          const Icon = IconMap[achievement.icon] || Award

          return (
            <div
              key={achievement.id}
              className={cn(
                "relative flex flex-col gap-3 rounded-xl border p-4 transition-colors",
                isEarned
                  ? "border-primary/20 bg-primary/5 hover:border-primary/40"
                  : "border-dashed bg-muted/30 hover:bg-muted/50"
              )}
            >
              {!isEarned && (
                <div className="absolute top-3 right-3">
                  <Lock className="size-4 text-muted-foreground/50" />
                </div>
              )}

              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full ring-4",
                  isEarned
                    ? "bg-primary text-primary-foreground ring-primary/10"
                    : "bg-muted text-muted-foreground/50 ring-transparent"
                )}
              >
                <Icon className="size-5" />
              </div>

              <div>
                <h4
                  className={cn(
                    "text-sm font-semibold",
                    !isEarned && "text-muted-foreground"
                  )}
                >
                  {achievement.label}
                </h4>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {achievement.description}
                </p>
                {isEarned && (
                  <p className="mt-2 text-[10px] font-medium tracking-wider text-primary uppercase">
                    Earned {achievement.earnedAt}
                  </p>
                )}
              </div>
            </div>
          )
        })}

        {/* Placeholder for future Certifications feature */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center text-muted-foreground opacity-70">
          <Award className="size-6" />
          <div>
            <p className="text-sm font-medium">Verified Certifications</p>
            <p className="text-xs">Coming soon to Pro members</p>
          </div>
        </div>
      </div>
    </div>
  )
}
