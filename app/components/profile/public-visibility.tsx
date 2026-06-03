import { useState } from "react"
import { Copy, Check, Globe } from "lucide-react"
import { Button } from "~/components/ui/button"
import type { CandidateProfile } from "~/lib/profile-types"
import { cn } from "~/lib/utils"

interface PublicVisibilityProps {
  profile: CandidateProfile
  isEditing: boolean
  onToggleVisibility: (isPublic: boolean) => void
}

export function PublicVisibility({ profile, isEditing, onToggleVisibility }: PublicVisibilityProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile.shareableUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL", err)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex size-8 items-center justify-center rounded-full",
            profile.isPublic ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
          )}>
            <Globe className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold">Public Profile</h4>
            <p className="text-xs text-muted-foreground">
              {profile.isPublic ? "Visible to recruiters" : "Private"}
            </p>
          </div>
        </div>
        
        {/* Toggle Switch UI */}
        <button
          type="button"
          disabled={!isEditing}
          onClick={() => onToggleVisibility(!profile.isPublic)}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            profile.isPublic ? "bg-primary" : "bg-input"
          )}
          role="switch"
          aria-checked={profile.isPublic}
        >
          <span className="sr-only">Toggle public profile</span>
          <span
            className={cn(
              "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
              profile.isPublic ? "translate-x-2" : "-translate-x-2"
            )}
          />
        </button>
      </div>

      {profile.isPublic && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-1">
          <p className="text-xs font-medium mb-1.5 text-muted-foreground">Shareable Link</p>
          <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
            <span className="flex-1 truncate text-xs text-foreground select-all">
              {profile.shareableUrl}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleCopy}
              className="size-6 shrink-0 text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
              <span className="sr-only">{copied ? "Copied" : "Copy URL"}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
