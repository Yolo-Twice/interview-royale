import { useEffect, useState } from "react"
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
import { getProfileSkillOptions } from "~/lib/profile-skill-options"

export default function ConfigureInterviewPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [interviewFocus, setInterviewFocus] = useState("")
  const [technology, setTechnology] = useState("")
  const [difficulty, setDifficulty] = useState("Mid-Level")
  const [interviewFocusOptions, setInterviewFocusOptions] = useState<string[]>([])
  const [technologyOptions, setTechnologyOptions] = useState<string[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  useEffect(() => {
    async function loadProfileFocusAreas() {
      if (!user) {
        setInterviewFocusOptions([])
        setTechnologyOptions([])
        setLoadingOptions(false)
        return
      }

      try {
        const profile = await getUserProfile()
        const { interviewFocusOptions, technologyOptions } =
          getProfileSkillOptions(profile)

        setInterviewFocusOptions(interviewFocusOptions)
        setTechnologyOptions(technologyOptions)
        setInterviewFocus((current) =>
          current && interviewFocusOptions.includes(current)
            ? current
            : (interviewFocusOptions[0] ?? "")
        )
        setTechnology((current) =>
          current && technologyOptions.includes(current)
            ? current
            : (technologyOptions[0] ?? "")
        )
      } catch (error) {
        console.error("Failed to load profile configuration options:", error)
        setInterviewFocusOptions([])
        setTechnologyOptions([])
        setInterviewFocus("")
        setTechnology("")
      } finally {
        setLoadingOptions(false)
      }
    }

    void loadProfileFocusAreas()
  }, [user])

  const hasInterviewFocusOptions = interviewFocusOptions.length > 0
  const hasTechnologyOptions = technologyOptions.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate to the live interview and pass configuration via router state
    navigate("/interview", {
      state: { interviewFocus, technology, difficulty },
    })
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Configure Interview</CardTitle>
          <CardDescription>
            Customize your AI interview session. Tailor the interview focus,
            technology, and difficulty to match your goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="configure-interview-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="interviewFocus">Interview Focus</FieldLabel>
                {loadingOptions ? (
                  <p className="text-sm text-muted-foreground">
                    Loading your profile options…
                  </p>
                ) : (
                  <>
                    {hasInterviewFocusOptions ? (
                      <select
                        id="interviewFocus"
                        value={interviewFocus}
                        onChange={(e) => setInterviewFocus(e.target.value)}
                        className="flex h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
                      >
                        {interviewFocusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <select
                          id="interviewFocus"
                          value=""
                          disabled
                          className="flex h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base text-muted-foreground transition-[color,box-shadow,background-color] outline-none md:text-sm"
                        >
                          <option value="">
                            Select an interview focus after adding profile skills
                          </option>
                        </select>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Add skills to your profile to configure interview focus.
                        </p>
                      </>
                    )}
                  </>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="technology">Technology</FieldLabel>
                {loadingOptions ? (
                  <p className="text-sm text-muted-foreground">
                    Loading your profile options…
                  </p>
                ) : (
                  <>
                    {hasTechnologyOptions ? (
                      <select
                        id="technology"
                        value={technology}
                        onChange={(e) => setTechnology(e.target.value)}
                        className="flex h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
                      >
                        {technologyOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <select
                          id="technology"
                          value=""
                          disabled
                          className="flex h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base text-muted-foreground transition-[color,box-shadow,background-color] outline-none md:text-sm"
                        >
                          <option value="">
                            Select a technology after adding profile tools
                          </option>
                        </select>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Add tools to your profile to configure interview technology.
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
          <Button
            type="submit"
            form="configure-interview-form"
            className="gap-1.5"
          >
            <Play className="size-4" />
            Start now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
