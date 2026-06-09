import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { Play } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card"
import { Field, FieldLabel, FieldGroup } from "~/components/ui/field"
import { useAuth } from "~/contexts/auth-provider"
import { getUserProfile } from "~/lib/api/users"
import { getProfileFocusAreas } from "~/lib/profile-skill-options"

export default function ConfigureInterviewPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [role, setRole] = useState("Frontend Developer")
  const [focus, setFocus] = useState("")
  const [difficulty, setDifficulty] = useState("Mid-Level")
  const [focusOptions, setFocusOptions] = useState<string[]>([])
  const [loadingFocusOptions, setLoadingFocusOptions] = useState(true)

  useEffect(() => {
    async function loadProfileFocusAreas() {
      if (!user) {
        setFocusOptions([])
        setLoadingFocusOptions(false)
        return
      }

      try {
        const profile = await getUserProfile(user.uid)
        const nextOptions = getProfileFocusAreas(profile?.primarySkills, profile?.technologies)
        setFocusOptions(nextOptions)
        setFocus((current) => (current && nextOptions.includes(current) ? current : nextOptions[0] ?? ""))
      } catch (error) {
        console.error("Failed to load profile focus areas:", error)
        setFocusOptions([])
        setFocus("")
      } finally {
        setLoadingFocusOptions(false)
      }
    }

    void loadProfileFocusAreas()
  }, [user])

  const hasFocusOptions = focusOptions.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate to the live interview and pass configuration via router state
    navigate("/interview", {
      state: { role, focus, difficulty },
    })
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Configure Interview</CardTitle>
          <CardDescription>
            Customize your AI interview session. Tailor the role, focus areas, and difficulty to match your goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="configure-interview-form" onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="role">Job Role</FieldLabel>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value)
                    setFocus((current) => (focusOptions.includes(current) ? current : focusOptions[0] ?? ""))
                  }}
                  className="flex h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
                >
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="focus">Key Focus Areas</FieldLabel>
                {loadingFocusOptions ? (
                  <p className="text-sm text-muted-foreground">Loading your profile focus areas…</p>
                ) : (
                  <>
                    {hasFocusOptions ? (
                      <select
                        id="focus"
                        value={focus}
                        onChange={(e) => setFocus(e.target.value)}
                        className="flex h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
                      >
                        {focusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <select
                          id="focus"
                          value=""
                          disabled
                          className="flex h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base text-muted-foreground transition-[color,box-shadow,background-color] outline-none md:text-sm"
                        >
                          <option value="">Select focus areas after adding profile skills</option>
                        </select>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Add skills and technologies to your profile to configure interview focus areas.
                        </p>
                      </>
                    )}
                  </>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="difficulty">Difficulty</FieldLabel>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="flex h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
                >
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead/Staff">Lead / Staff</option>
                </select>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" form="configure-interview-form" className="gap-1.5">
            <Play className="size-4" />
            Start now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
