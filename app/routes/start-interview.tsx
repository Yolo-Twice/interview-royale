import { useMemo, useState } from "react"
import {
  ArrowRight,
  AudioLines,
  Camera,
  ChevronDown,
  Gauge,
  Mic,
  ShieldCheck,
  Sparkles,
  Timer,
  Wifi,
} from "lucide-react"
import { Link } from "react-router"

import { Button } from "~/components/ui/button"

const roles = [
  "Frontend Developer",
  "Backend Engineer",
  "Fullstack Developer",
  "Machine Learning Engineer",
]

const levels = ["Fresher", "Junior", "Mid", "Senior"]

const focusAreas = [
  "DSA",
  "System Design",
  "Behavioral",
  "Core CS",
  "React",
  "Node.js",
  "DBMS",
  "OS",
]

const interviewModes = [
  { id: "voice", label: "Voice Interview", icon: AudioLines },
  { id: "chat", label: "Chat Interview", icon: Sparkles },
  { id: "video", label: "Video Simulation", icon: Camera },
  { id: "rapid", label: "Rapid Fire", icon: Timer },
]

const companyStyles = ["Google", "Amazon", "Startup", "Product-based", "Service-based"]

const interviewers = [
  {
    name: "Ava Chen",
    role: "Senior Frontend Engineer at a Product Company",
    style: "Direct • Technical • Fast-paced",
  },
  {
    name: "Gurjonderpreet Singh",
    role: "Staff Engineer, Consumer Platform",
    style: "Collaborative • Deep-diving • Structured",
  },
  {
    name: "Maya Kapoor",
    role: "Engineering Manager, Growth Team",
    style: "Calm • Scenario-based • Feedback-oriented",
  },
]

function badgeTone(score: number) {
  if (score <= 3) return "Easy"
  if (score <= 6) return "Medium"
  if (score <= 8) return "Intermediate"
  return "Hard"
}

export default function StartInterviewPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0])
  const [selectedLevel, setSelectedLevel] = useState(levels[2])
  const [selectedFocus, setSelectedFocus] = useState<string[]>(["React", "DSA", "Behavioral"])
  const [difficulty, setDifficulty] = useState(7)
  const [selectedMode, setSelectedMode] = useState("voice")
  const [selectedCompanyStyle, setSelectedCompanyStyle] = useState(companyStyles[3])

  const interviewer = useMemo(
    () => interviewers[difficulty % interviewers.length],
    [difficulty]
  )

  const duration = difficulty >= 8 ? "60 mins" : "45 mins"
  const expectedRejection = Math.min(90, 35 + difficulty * 6)

  function toggleFocusArea(area: string) {
    setSelectedFocus((prev) =>
      prev.includes(area) ? prev.filter((item) => item !== area) : [...prev, area]
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-background p-6 sm:p-8">
      <section className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              AI Interview Ready
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{selectedRole} Interview</h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Behavioral + DSA + React System Design. Configure your interview simulation and enter
              the arena with a personalized AI interviewer.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
              <Timer className="size-3.5" />
              {duration}
              <span className="text-foreground/40">•</span>
              {badgeTone(difficulty)}
              <span className="text-foreground/40">•</span>
              {selectedMode === "voice" ? "AI Voice Interview" : "AI Guided Interview"}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline">Preview Questions</Button>
              <Button>
                Start Interview <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold">Role Selection</p>
            <div className="mt-3 flex items-center justify-between rounded-xl border bg-background px-4 py-3">
              <span className="text-sm">{selectedRole}</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    selectedRole === role
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold">Experience Level</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-4">
              {levels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedLevel(level)}
                  className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                    selectedLevel === level
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold">Interview Focus</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {focusAreas.map((area) => {
                const isActive = selectedFocus.includes(area)
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocusArea(area)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      isActive
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {area}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Difficulty</p>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary">
                {difficulty}/10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={difficulty}
              onChange={(event) => setDifficulty(Number(event.target.value))}
              className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
            />
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p>
                Comparable to <span className="text-foreground">Tier-1 product company screening</span>
              </p>
              <p>
                Estimated rejection rate:{" "}
                <span className="font-medium text-foreground">{expectedRejection}%</span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold">Interview Mode</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {interviewModes.map((mode) => {
                const Icon = mode.icon
                const isActive = selectedMode === mode.id
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedMode(mode.id)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                      isActive
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="text-sm font-medium">{mode.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold">AI Interviewer</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-lg font-semibold text-primary">
                {interviewer.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <div>
                <p className="font-medium">{interviewer.name}</p>
                <p className="text-sm text-muted-foreground">{interviewer.role}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Interview Style: {interviewer.style}</p>
          </div>

          <div className="sticky top-4 z-10 rounded-2xl border border-primary/20 bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold">Session Summary</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium">{selectedRole}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Experience</dt>
                <dd className="font-medium">{selectedLevel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Focus</dt>
                <dd className="max-w-[16rem] text-right font-medium">
                  {selectedFocus.length ? selectedFocus.join(", ") : "None selected"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Difficulty</dt>
                <dd className="font-medium">{badgeTone(difficulty)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="font-medium">{duration}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Mode</dt>
                <dd className="font-medium">
                  {interviewModes.find((mode) => mode.id === selectedMode)?.label}
                </dd>
              </div>
            </dl>
            <Button className="mt-5 w-full">Start Interview</Button>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold">Smart Preparation Tips</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>- Avoid overexplaining simple concepts.</li>
              <li>- Narrate your thought process during coding.</li>
              <li>- Call out edge cases before implementing.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-2">
          <p className="text-sm font-semibold">Interview Environment Preview</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm">
              <Camera className="size-4 text-green-500" />
              Webcam enabled
            </div>
            <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm">
              <Mic className="size-4 text-green-500" />
              Microphone detected
            </div>
            <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm">
              <Wifi className="size-4 text-green-500" />
              Stable connection
            </div>
            <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm">
              <ShieldCheck className="size-4 text-amber-500" />
              Quiet environment recommended
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-sm font-semibold">Previous Performance Snapshot</p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>
              Last Attempt: <span className="font-medium text-foreground">React Interview</span>
            </p>
            <p>
              Score: <span className="font-medium text-foreground">78%</span>
            </p>
            <p>
              Weak Area: <span className="font-medium text-foreground">State Management</span>
            </p>
          </div>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link to="/dashboard">
              View Full Report <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Company Style Simulation</p>
            <p className="text-sm text-muted-foreground">
              Adjust pacing, strictness, and follow-up depth by company archetype.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {companyStyles.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setSelectedCompanyStyle(style)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  selectedCompanyStyle === style
                    ? "border-primary/50 bg-primary/15 text-primary"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
          <Gauge className="size-4 text-primary" />
          Active simulation profile: <span className="font-medium text-foreground">{selectedCompanyStyle}</span>
        </div>
      </section>
    </div>
  )
}
