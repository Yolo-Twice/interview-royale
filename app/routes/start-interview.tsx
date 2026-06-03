import { useState } from "react"
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

export default function ConfigureInterviewPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState("Frontend Developer")
  const [focus, setFocus] = useState("React")
  const [difficulty, setDifficulty] = useState("Mid-Level")

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
                    setRole(e.target.value);
                    if (e.target.value === "Frontend Developer") {
                      setFocus("React");
                    } else if (e.target.value === "Backend Developer") {
                      setFocus("Node.js");
                    }
                  }}
                  className="flex h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
                >
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="focus">Key Focus Areas</FieldLabel>
                <select
                  id="focus"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="flex h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
                >
                  {role === "Frontend Developer" && (
                    <option value="React">React</option>
                  )}
                  {role === "Backend Developer" && (
                    <option value="Node.js">Node.js</option>
                  )}
                </select>
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
          <Button type="submit" form="configure-interview-form">
            <Play className="mr-2 size-4" />
            Start Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
