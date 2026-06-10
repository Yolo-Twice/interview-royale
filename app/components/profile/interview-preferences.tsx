import { Check } from "lucide-react"
import { cn } from "~/lib/utils"
import type {
  CandidateProfile,
  ProfileFormData,
  InterviewDomain,
  DifficultyPreference,
  AIBehavior,
} from "~/lib/profile-types"

interface InterviewPreferencesProps {
  profile: CandidateProfile
  formData: ProfileFormData
  isEditing: boolean
  onFormChange: (field: keyof ProfileFormData, value: any) => void
}

const DOMAINS: InterviewDomain[] = [
  "Frontend",
  "Backend",
  "Full Stack",
  "System Design",
  "DSA",
  "Behavioral",
  "DevOps",
  "Mobile",
]

const DIFFICULTIES: DifficultyPreference[] = ["Easy", "Medium", "Hard", "Mixed"]

const AI_BEHAVIORS: AIBehavior[] = [
  "Encouraging",
  "Neutral",
  "Challenging",
  "Realistic",
]

export function InterviewPreferencesSection({
  formData,
  isEditing,
  onFormChange,
}: InterviewPreferencesProps) {
  const handleDomainToggle = (domain: InterviewDomain) => {
    if (!isEditing) return
    const current = formData.interviewPreferences.domains
    const next = current.includes(domain)
      ? current.filter((d) => d !== domain)
      : [...current, domain]

    onFormChange("interviewPreferences", {
      ...formData.interviewPreferences,
      domains: next,
    })
  }

  const handleDifficultyChange = (difficulty: DifficultyPreference) => {
    if (!isEditing) return
    onFormChange("interviewPreferences", {
      ...formData.interviewPreferences,
      difficulty,
    })
  }

  const handleBehaviorChange = (aiBehavior: AIBehavior) => {
    if (!isEditing) return
    onFormChange("interviewPreferences", {
      ...formData.interviewPreferences,
      aiBehavior,
    })
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Interview Preferences</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize how the AI conducts your practice sessions.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Preferred Domains
          </label>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((domain) => {
              const isSelected =
                formData.interviewPreferences.domains.includes(domain)
              if (!isEditing && !isSelected) return null // Hide unselected in view mode

              return (
                <button
                  key={domain}
                  type="button"
                  onClick={() => handleDomainToggle(domain)}
                  disabled={!isEditing}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                    isSelected
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted",
                    !isEditing && "cursor-default opacity-100"
                  )}
                >
                  {isSelected && <Check className="size-3" />}
                  {domain}
                </button>
              )
            })}
            {!isEditing &&
              formData.interviewPreferences.domains.length === 0 && (
                <span className="text-sm text-muted-foreground italic">
                  No domains selected
                </span>
              )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Default Difficulty
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DIFFICULTIES.map((diff) => {
                const isSelected =
                  formData.interviewPreferences.difficulty === diff
                if (!isEditing && !isSelected) return null

                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => handleDifficultyChange(diff)}
                    disabled={!isEditing}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                      isSelected
                        ? "border-primary/40 bg-primary/10 font-medium text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted",
                      !isEditing && "cursor-default"
                    )}
                  >
                    {diff}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">AI Persona</label>
            <div className="flex flex-wrap gap-1.5">
              {AI_BEHAVIORS.map((behavior) => {
                const isSelected =
                  formData.interviewPreferences.aiBehavior === behavior
                if (!isEditing && !isSelected) return null

                return (
                  <button
                    key={behavior}
                    type="button"
                    onClick={() => handleBehaviorChange(behavior)}
                    disabled={!isEditing}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                      isSelected
                        ? "border-primary/40 bg-primary/10 font-medium text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted",
                      !isEditing && "cursor-default"
                    )}
                  >
                    {behavior}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
