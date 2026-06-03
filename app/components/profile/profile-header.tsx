import { Save, X } from "lucide-react"
import { Button } from "~/components/ui/button"

interface ProfileHeaderProps {
  isEditing: boolean
  onEditToggle: () => void
  onSave: () => void
  onCancel: () => void
}

export function ProfileHeader({
  isEditing,
  onEditToggle,
  onSave,
  onCancel,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information, skills, and recruiter preferences.
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={onCancel}>
              <X className="mr-2 size-4" /> Cancel
            </Button>
            <Button onClick={onSave}>
              <Save className="mr-2 size-4" /> Save Changes
            </Button>
          </>
        ) : (
          <Button onClick={onEditToggle}>
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  )
}
