import { useMemo, useState } from "react"
import { ArrowUpRight, Search, Sparkles, TrendingUp } from "lucide-react"
import { Link } from "react-router"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"

type InterviewType = "Frontend" | "Backend" | "DSA" | "Behavioral" | "System Design"
type Difficulty = "Easy" | "Medium" | "Hard"
type PerformanceTag = "High Score" | "Weak Areas" | "Incomplete Sessions" | "Strong Communication"

type InterviewSession = {
  id: string
  title: string
  type: InterviewType
  topic: string
  difficulty: Difficulty
  dateLabel: string
  dateGroup: "Last 7 days" | "Last month" | "All time"
  duration: string
  score: number
  technical: number
  communication: number
  confidence: number
  weakAreas: string[]
  tags: PerformanceTag[]
  completed: boolean
  transcript: Array<{ speaker: "AI" | "You"; line: string }>
  recommendation: string
}

const sessions: InterviewSession[] = [
  {
    id: "react-perf-01",
    title: "React Performance Interview",
    type: "Frontend",
    topic: "React Hooks",
    difficulty: "Medium",
    dateLabel: "2 days ago",
    dateGroup: "Last 7 days",
    duration: "28 min",
    score: 8.4,
    technical: 8.2,
    communication: 8.1,
    confidence: 8.4,
    weakAreas: ["Memoization", "Rendering Optimization"],
    tags: ["High Score", "Strong Communication"],
    completed: true,
    transcript: [
      { speaker: "AI", line: "Explain event delegation in React and the DOM." },
      { speaker: "You", line: "Event delegation attaches one listener to a parent and uses bubbling..." },
      { speaker: "AI", line: "When would you avoid useMemo?" },
      { speaker: "You", line: "When the computation is cheap and memo overhead is higher than recalculation." },
    ],
    recommendation: "Revisit rendering bottlenecks in large component trees and profiling workflows.",
  },
  {
    id: "api-design-02",
    title: "API Design Interview",
    type: "Backend",
    topic: "REST + Caching",
    difficulty: "Hard",
    dateLabel: "6 days ago",
    dateGroup: "Last 7 days",
    duration: "41 min",
    score: 7.6,
    technical: 7.8,
    communication: 7.3,
    confidence: 7.2,
    weakAreas: ["Cache Invalidation", "Versioning Strategy"],
    tags: ["Weak Areas"],
    completed: true,
    transcript: [
      { speaker: "AI", line: "How would you version breaking API changes?" },
      { speaker: "You", line: "Path-based versioning with migration docs and sunset windows..." },
    ],
    recommendation: "Practice trade-offs between URL, header, and content-negotiation versioning.",
  },
  {
    id: "dsa-03",
    title: "Sliding Window Drill",
    type: "DSA",
    topic: "Two Pointers",
    difficulty: "Medium",
    dateLabel: "2 weeks ago",
    dateGroup: "Last month",
    duration: "24 min",
    score: 8.0,
    technical: 8.5,
    communication: 7.1,
    confidence: 7.9,
    weakAreas: ["Edge Case Narration"],
    tags: ["Strong Communication"],
    completed: true,
    transcript: [
      { speaker: "AI", line: "What is the invariant in your sliding window?" },
      { speaker: "You", line: "The window always keeps unique elements while maximizing size." },
    ],
    recommendation: "Narrate complexity and edge cases earlier before coding.",
  },
  {
    id: "behavioral-04",
    title: "Leadership Behavioral Round",
    type: "Behavioral",
    topic: "Conflict Resolution",
    difficulty: "Easy",
    dateLabel: "3 weeks ago",
    dateGroup: "Last month",
    duration: "19 min",
    score: 6.9,
    technical: 6.5,
    communication: 7.5,
    confidence: 6.8,
    weakAreas: ["Outcome Metrics", "Story Structure"],
    tags: ["Weak Areas"],
    completed: true,
    transcript: [
      { speaker: "AI", line: "Describe a conflict and your resolution approach." },
      { speaker: "You", line: "I aligned stakeholders by clarifying priorities and constraints..." },
    ],
    recommendation: "Use STAR more tightly and add measurable outcomes for impact.",
  },
  {
    id: "system-design-05",
    title: "Realtime Chat System Design",
    type: "System Design",
    topic: "WebSockets",
    difficulty: "Hard",
    dateLabel: "2 months ago",
    dateGroup: "All time",
    duration: "52 min",
    score: 0,
    technical: 0,
    communication: 0,
    confidence: 0,
    weakAreas: ["Session was paused"],
    tags: ["Incomplete Sessions"],
    completed: false,
    transcript: [
      { speaker: "AI", line: "Design a scalable pub/sub layer for chat rooms." },
      { speaker: "You", line: "I would start with partitioning by room id..." },
    ],
    recommendation: "Resume this session and complete data consistency and failover sections.",
  },
]

const interviewTypeFilters: Array<InterviewType | "All"> = [
  "All",
  "Frontend",
  "Backend",
  "DSA",
  "Behavioral",
  "System Design",
]
const difficultyFilters: Array<Difficulty | "All"> = ["All", "Easy", "Medium", "Hard"]
const performanceFilters: Array<PerformanceTag | "All"> = [
  "All",
  "High Score",
  "Weak Areas",
  "Incomplete Sessions",
]
const dateFilters: Array<InterviewSession["dateGroup"] | "All"> = [
  "All",
  "Last 7 days",
  "Last month",
  "All time",
]

function scoreTone(score: number) {
  if (score >= 8) return "text-emerald-600"
  if (score >= 7) return "text-amber-600"
  return "text-muted-foreground"
}

export default function InterviewHistoryPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<InterviewType | "All">("All")
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "All">("All")
  const [performanceFilter, setPerformanceFilter] = useState<PerformanceTag | "All">("All")
  const [dateFilter, setDateFilter] = useState<InterviewSession["dateGroup"] | "All">("All")
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const query = search.trim().toLowerCase()
      const searchMatch =
        query.length === 0 ||
        session.title.toLowerCase().includes(query) ||
        session.topic.toLowerCase().includes(query) ||
        session.weakAreas.some((area) => area.toLowerCase().includes(query))

      const typeMatch = typeFilter === "All" || session.type === typeFilter
      const difficultyMatch = difficultyFilter === "All" || session.difficulty === difficultyFilter
      const performanceMatch =
        performanceFilter === "All" || session.tags.includes(performanceFilter)
      const dateMatch = dateFilter === "All" || session.dateGroup === dateFilter

      return searchMatch && typeMatch && difficultyMatch && performanceMatch && dateMatch
    })
  }, [dateFilter, difficultyFilter, performanceFilter, search, typeFilter])

  const selectedSession = useMemo(
    () => filteredSessions.find((session) => session.id === selectedSessionId) ?? null,
    [filteredSessions, selectedSessionId]
  )

  const completedSessions = sessions.filter((session) => session.completed)
  const totalInterviews = sessions.length
  const averageScore = (
    completedSessions.reduce((sum, session) => sum + session.score, 0) / completedSessions.length
  ).toFixed(1)
  const bestDomain = "Frontend"
  const trend = "+12% this month"

  return (
    <div className="flex flex-1 flex-col gap-6 bg-background p-6 sm:p-8">
      <section className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interview History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review previous interviews and track progress across technical and communication skills.
          </p>
        </div>
        <Button asChild>
          <Link to="/start-interview">Start New Interview</Link>
        </Button>
      </section>

      <section className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
              placeholder="Search interviews, topics, weak areas..."
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as InterviewType | "All")}
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
          >
            {interviewTypeFilters.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "Role: All" : option}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(event) => setDifficultyFilter(event.target.value as Difficulty | "All")}
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
          >
            {difficultyFilters.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "Difficulty: All" : option}
              </option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value as InterviewSession["dateGroup"] | "All")
            }
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
          >
            {dateFilters.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "Date: All" : option}
              </option>
            ))}
          </select>

          <select
            value={performanceFilter}
            onChange={(event) =>
              setPerformanceFilter(event.target.value as PerformanceTag | "All")
            }
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
          >
            {performanceFilters.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "Score: All" : option}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Total Interviews</p>
          <p className="mt-2 text-2xl font-semibold">{totalInterviews} Interviews</p>
        </article>
        <article className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Average Score</p>
          <p className="mt-2 text-2xl font-semibold">{averageScore} / 10</p>
        </article>
        <article className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Best Domain</p>
          <p className="mt-2 text-2xl font-semibold">{bestDomain}</p>
        </article>
        <article className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Improvement Trend</p>
          <p className="mt-2 flex items-center gap-1 text-2xl font-semibold text-emerald-600">
            <TrendingUp className="size-5" />
            {trend}
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
              No interviews match these filters. Try broadening your search.
            </div>
          ) : (
            filteredSessions.map((session) => (
              <article
                key={session.id}
                className="rounded-2xl border bg-card p-5 shadow-sm transition hover:border-primary/40"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{session.type}</span>
                  <span>•</span>
                  <span>{session.difficulty}</span>
                  <span>•</span>
                  <span>{session.dateLabel}</span>
                  <span>•</span>
                  <span>{session.duration}</span>
                </div>

                <h2 className="mt-2 text-lg font-semibold">{session.title}</h2>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <p>
                    Technical:{" "}
                    <span className={session.completed ? scoreTone(session.technical) : "text-muted-foreground"}>
                      {session.completed ? session.technical.toFixed(1) : "--"}
                    </span>
                  </p>
                  <p>
                    Communication:{" "}
                    <span
                      className={session.completed ? scoreTone(session.communication) : "text-muted-foreground"}
                    >
                      {session.completed ? session.communication.toFixed(1) : "--"}
                    </span>
                  </p>
                  <p>
                    Confidence:{" "}
                    <span className={session.completed ? scoreTone(session.confidence) : "text-muted-foreground"}>
                      {session.completed ? session.confidence.toFixed(1) : "--"}
                    </span>
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {session.weakAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {area}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {session.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => setSelectedSessionId(session.id)}>
                    View Report
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedSessionId(session.id)}>
                    Replay Transcript
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/start-interview" className="inline-flex items-center gap-1">
                      Resume Practice <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Detailed History</h3>
          <div className="mt-4 space-y-3">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{session.topic}</p>
                  <p className="text-xs text-muted-foreground">{session.dateLabel}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${session.completed ? scoreTone(session.score) : "text-muted-foreground"}`}>
                    {session.completed ? `${session.score.toFixed(1)} / 10` : "Incomplete"}
                  </p>
                  <p className="text-xs text-muted-foreground">{session.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Sheet open={Boolean(selectedSession)} onOpenChange={(open) => !open && setSelectedSessionId(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          {selectedSession ? (
            <>
              <SheetHeader>
                <SheetTitle>Interview Details</SheetTitle>
                <SheetDescription>
                  {selectedSession.title} · {selectedSession.type} · {selectedSession.dateLabel}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 px-6 pb-6">
                <section>
                  <h4 className="text-sm font-semibold">Transcript Replay</h4>
                  <div className="mt-3 space-y-2 rounded-xl border bg-background p-3">
                    {selectedSession.transcript.map((line, index) => (
                      <p key={`${line.speaker}-${index}`} className="text-sm">
                        <span className="font-medium">{line.speaker}:</span> {line.line}
                      </p>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-sm font-semibold">AI Feedback</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedSession.recommendation}
                  </p>
                </section>

                <section className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Technical Breakdown</p>
                    <p className="mt-1 text-lg font-semibold">
                      {selectedSession.completed ? selectedSession.technical.toFixed(1) : "--"} / 10
                    </p>
                  </div>
                  <div className="rounded-xl border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Communication Analysis</p>
                    <p className="mt-1 text-lg font-semibold">
                      {selectedSession.completed ? selectedSession.communication.toFixed(1) : "--"} / 10
                    </p>
                  </div>
                </section>

                <section className="rounded-xl border border-primary/25 bg-primary/5 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Sparkles className="size-4" />
                    Recommended Practice
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{selectedSession.recommendation}</p>
                  <Button className="mt-4" asChild>
                    <Link to="/start-interview">Resume Practice</Link>
                  </Button>
                </section>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
