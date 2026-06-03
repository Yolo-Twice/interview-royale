import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import type { CandidateProfile, ProfileFormData } from "~/lib/profile-types"

interface SkillsGridProps {
  profile: CandidateProfile
  formData: ProfileFormData
  isEditing: boolean
  onFormChange: (field: keyof ProfileFormData, value: any) => void
}

export function SkillsGrid({
  formData,
  isEditing,
  onFormChange,
}: SkillsGridProps) {
  const [newSkillInput, setNewSkillInput] = useState({
    primarySkills: "",
    technologies: "",
    areasOfInterest: "",
  })

  const handleAddSkill = (field: "primarySkills" | "technologies" | "areasOfInterest") => {
    const value = newSkillInput[field].trim()
    if (value && !formData[field].includes(value)) {
      onFormChange(field, [...formData[field], value])
    }
    setNewSkillInput((prev) => ({ ...prev, [field]: "" }))
  }

  const handleRemoveSkill = (field: "primarySkills" | "technologies" | "areasOfInterest", indexToRemove: number) => {
    onFormChange(
      field,
      formData[field].filter((_, i) => i !== indexToRemove)
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent, field: "primarySkills" | "technologies" | "areasOfInterest") => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSkill(field)
    }
  }

  const renderSkillSection = (
    title: string,
    field: "primarySkills" | "technologies" | "areasOfInterest",
    placeholder: string
  ) => (
    <div>
      <label className="mb-2 block text-sm font-medium">{title}</label>
      <div className="flex flex-wrap items-center gap-2">
        {formData[field].map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs shadow-sm"
          >
            {skill}
            {isEditing && (
              <button
                type="button"
                onClick={() => handleRemoveSkill(field, index)}
                className="ml-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground p-0.5"
              >
                <X className="size-3" />
                <span className="sr-only">Remove {skill}</span>
              </button>
            )}
          </span>
        ))}

        {isEditing && (
          <div className="flex items-center gap-1">
            <Input
              value={newSkillInput[field]}
              onChange={(e) => setNewSkillInput((prev) => ({ ...prev, [field]: e.target.value }))}
              onKeyDown={(e) => handleKeyDown(e, field)}
              placeholder={placeholder}
              className="h-7 w-32 px-2 text-xs rounded-md"
            />
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              onClick={() => handleAddSkill(field)}
              className="size-7 rounded-md"
            >
              <Plus className="size-3" />
              <span className="sr-only">Add</span>
            </Button>
          </div>
        )}

        {!isEditing && formData[field].length === 0 && (
          <span className="text-sm text-muted-foreground italic">None added yet</span>
        )}
      </div>
    </div>
  )

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Skills & Competencies</h3>
      
      <div className="space-y-6">
        {renderSkillSection("Primary Skills", "primarySkills", "e.g. React")}
        {renderSkillSection("Technologies & Tools", "technologies", "e.g. Next.js, Docker")}
        {renderSkillSection("Areas of Interest", "areasOfInterest", "e.g. AI, WebGL")}
      </div>
    </div>
  )
}
