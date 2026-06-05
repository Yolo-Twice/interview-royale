import { useMemo, useState, useEffect } from "react"
import { ArrowUpRight, Search, Sparkles, TrendingUp } from "lucide-react"
import { Link } from "react-router"
import { useAuth } from "~/contexts/auth-provider"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"

type InterviewType =
  | "Frontend"
  | "Backend"
  | "DSA"
  | "Behavioral"
  | "System Design"
  | string
type Difficulty = "Easy" | "Medium" | "Hard" | "Junior" | "Senior" | "Mid-Level" | string
type PerformanceTag =
  | "High Score"
  | "Weak Areas"
  | "Incomplete Sessions"
  | "Strong Communication"
  | string

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

const interviewTypeFilters: Array<InterviewType | "All"> = [
  "All",
  "Frontend Developer",
  "Backend Developer",
]
const difficultyFilters: Array<Difficulty | "All"> = [
  "All",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead/Staff",
]
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
  const { user } = useAuth()
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`/api/interview-sessions/user/${user?.uid || 'guest'}`)
        const data = await response.json()
        if (data.success && data.data) {
          const mappedSessions: InterviewSession[] = data.data.map((dbSession: any) => {
            const isCompleted = dbSession.status === 'completed'
            const overallScore = dbSession.overallScore ? dbSession.overallScore / 10 : 0
            
            const date = new Date(dbSession.createdAt || Date.now())
            const now = new Date()
            const diffTime = Math.abs(now.getTime() - date.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            let dateGroup: "Last 7 days" | "Last month" | "All time" = "All time"
            if (diffDays <= 7) dateGroup = "Last 7 days"
            else if (diffDays <= 30) dateGroup = "Last month"

            return {
              id: dbSession.sessionId,
              title: `${dbSession.role || 'General'} Interview`,
              type: dbSession.role || 'General',
              topic: dbSession.keyFocusArea || 'General',
              difficulty: dbSession.difficulty || 'Medium',
              dateLabel: date.toLocaleDateString(),
              dateGroup,
              duration: "Completed",
              score: overallScore,
              technical: dbSession.scores?.technical ?? overallScore,
              communication: dbSession.scores?.communication ?? overallScore,
              confidence: dbSession.scores?.confidence ?? overallScore,
              weakAreas: dbSession.weaknesses || [],
              tags: isCompleted ? (overallScore >= 8 ? ["High Score"] : ["Needs Review"]) : ["Incomplete Sessions"],
              completed: isCompleted,
              transcript: (dbSession.questionsAnswers || []).flatMap((qa: any) => [
                { speaker: "AI", line: qa.question },
                { speaker: "You", line: qa.answer }
              ]),
              recommendation: dbSession.summary || "Complete the session to see recommendations."
            }
          })
          setSessions(mappedSessions)
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSessions()
  }, [user])

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<InterviewType | "All">("All")
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "All">(
    "All"
  )
  const [performanceFilter, setPerformanceFilter] = useState<
    PerformanceTag | "All"
  >("All")
  const [dateFilter, setDateFilter] = useState<
    InterviewSession["dateGroup"] | "All"
  >("All")
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  )

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const query = search.trim().toLowerCase()
      const searchMatch =
        query.length === 0 ||
        session.title.toLowerCase().includes(query) ||
        session.topic.toLowerCase().includes(query) ||
        session.weakAreas.some((area) => area.toLowerCase().includes(query))

      const typeMatch = typeFilter === "All" || session.type.toLowerCase().includes(typeFilter.toLowerCase())
      const difficultyMatch =
        difficultyFilter === "All" || session.difficulty === difficultyFilter
      const performanceMatch =
        performanceFilter === "All" || session.tags.includes(performanceFilter)
      const dateMatch = dateFilter === "All" || session.dateGroup === dateFilter

      return (
        searchMatch &&
        typeMatch &&
        difficultyMatch &&
        performanceMatch &&
        dateMatch
      )
    })
  }, [dateFilter, difficultyFilter, performanceFilter, search, typeFilter, sessions])

  const selectedSession = useMemo(
    () =>
      filteredSessions.find((session) => session.id === selectedSessionId) ??
      null,
    [filteredSessions, selectedSessionId]
  )

  const completedSessions = sessions.filter((session) => session.completed)
  const totalInterviews = sessions.length
  const averageScore = completedSessions.length > 0 
    ? (completedSessions.reduce((sum, session) => sum + session.score, 0) / completedSessions.length).toFixed(1)
    : "0.0"
  const bestDomain = "Frontend"
  const trend = "+12% this month"

  return (
    <div className="flex flex-1 flex-col gap-6 bg-background p-6 sm:p-8">
      <section className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Interview History
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review previous interviews and track progress across technical and
            communication skills.
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
            onChange={(event) =>
              setTypeFilter(event.target.value as InterviewType | "All")
            }
            className="h-9 rounded-md border bg-background px-3 text-sm ring-primary/30 transition outline-none focus:ring-2"
          >
            {interviewTypeFilters.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "Role: All" : option}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(event) =>
              setDifficultyFilter(event.target.value as Difficulty | "All")
            }
            className="h-9 rounded-md border bg-background px-3 text-sm ring-primary/30 transition outline-none focus:ring-2"
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
              setDateFilter(
                event.target.value as InterviewSession["dateGroup"] | "All"
              )
            }
            className="h-9 rounded-md border bg-background px-3 text-sm ring-primary/30 transition outline-none focus:ring-2"
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
            className="h-9 rounded-md border bg-background px-3 text-sm ring-primary/30 transition outline-none focus:ring-2"
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
          <p className="mt-2 text-2xl font-semibold">
            {totalInterviews} Interviews
          </p>
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
                    <span
                      className={
                        session.completed
                          ? scoreTone(session.technical)
                          : "text-muted-foreground"
                      }
                    >
                      {session.completed ? session.technical.toFixed(1) : "--"}
                    </span>
                  </p>
                  <p>
                    Communication:{" "}
                    <span
                      className={
                        session.completed
                          ? scoreTone(session.communication)
                          : "text-muted-foreground"
                      }
                    >
                      {session.completed
                        ? session.communication.toFixed(1)
                        : "--"}
                    </span>
                  </p>
                  <p>
                    Confidence:{" "}
                    <span
                      className={
                        session.completed
                          ? scoreTone(session.confidence)
                          : "text-muted-foreground"
                      }
                    >
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
                  <Button
                    size="sm"
                    asChild
                  >
                    <Link to={`/post-interview?sessionId=${session.id}`}>
                      View Report
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSessionId(session.id)}
                  >
                    Replay Transcript
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      to="/start-interview"
                      className="inline-flex items-center gap-1"
                    >
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
                  <p className="text-xs text-muted-foreground">
                    {session.dateLabel}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${session.completed ? scoreTone(session.score) : "text-muted-foreground"}`}
                  >
                    {session.completed
                      ? `${session.score.toFixed(1)} / 10`
                      : "Incomplete"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Sheet
        open={Boolean(selectedSession)}
        onOpenChange={(open) => !open && setSelectedSessionId(null)}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-xl"
        >
          {selectedSession ? (
            <>
              <SheetHeader>
                <SheetTitle>Interview Details</SheetTitle>
                <SheetDescription>
                  {selectedSession.title} · {selectedSession.type} ·{" "}
                  {selectedSession.dateLabel}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 px-6 pb-6">
                <section>
                  <h4 className="text-sm font-semibold">Transcript Replay</h4>
                  <div className="mt-3 space-y-2 rounded-xl border bg-background p-3">
                    {selectedSession.transcript.map((line, index) => (
                      <p key={`${line.speaker}-${index}`} className="text-sm">
                        <span className="font-medium">{line.speaker}:</span>{" "}
                        {line.line}
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
                    <p className="text-xs text-muted-foreground">
                      Technical Breakdown
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {selectedSession.completed
                        ? selectedSession.technical.toFixed(1)
                        : "--"}{" "}
                      / 10
                    </p>
                  </div>
                  <div className="rounded-xl border bg-background p-3">
                    <p className="text-xs text-muted-foreground">
                      Communication Analysis
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {selectedSession.completed
                        ? selectedSession.communication.toFixed(1)
                        : "--"}{" "}
                      / 10
                    </p>
                  </div>
                </section>

                <section className="rounded-xl border border-primary/25 bg-primary/5 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Sparkles className="size-4" />
                    Recommended Practice
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedSession.recommendation}
                  </p>
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
