import { useMemo, useState, useEffect } from "react"
import { ArrowUpRight, Search, Sparkles, TrendingUp, TrendingDown } from "lucide-react"
import { Link } from "react-router"
import { useAuth } from "~/contexts/auth-provider"

import { Button } from "~/components/ui/button"
import { authenticatedFetch } from "~/lib/api/api-client"
import { Input } from "~/components/ui/input"
import { getUserProfile } from "~/lib/api/users"
import { getProfileSkillOptions } from "~/lib/profile-skill-options"
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
type Difficulty =
  | "Easy"
  | "Medium"
  | "Hard"
  | "Junior"
  | "Senior"
  | "Mid-Level"
  | string
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

const selectClassName =
  "flex h-8 w-full min-w-0 rounded-3xl border border-input bg-background px-3 text-xs transition-all duration-200 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"

function scoreTone(score: number) {
  if (score >= 8) return "text-emerald-600"
  if (score >= 7) return "text-amber-600"
  return "text-muted-foreground"
}
export default function InterviewHistory() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [topicOptions, setTopicOptions] = useState<string[]>([])

  useEffect(() => {
    async function loadProfileFocusAreas() {
      if (!user) {
        setTopicOptions([])
        return
      }
      try {
        const profile = await getUserProfile()
        const { interviewFocusOptions } = getProfileSkillOptions(profile)
        setTopicOptions(interviewFocusOptions)
      } catch (error) {
        console.error("Failed to load profile configuration options:", error)
        setTopicOptions([])
      }
    }
    void loadProfileFocusAreas()
  }, [user])

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }
      try {
        const response = await authenticatedFetch(
          `/interview-sessions/user/${user.uid}`
        )
        const data = await response.json()
        if (data.success && data.data) {
          const mappedSessions: InterviewSession[] = data.data.map(
            (dbSession: any) => {
              const isCompleted = dbSession.status === "completed"
              const overallScore = dbSession.overallScore
                ? dbSession.overallScore / 10
                : 0

              const date = new Date(dbSession.createdAt || Date.now())
              const now = new Date()
              const diffTime = Math.abs(now.getTime() - date.getTime())
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              let dateGroup: "Last 7 days" | "Last month" | "All time" =
                "All time"
              if (diffDays <= 7) dateGroup = "Last 7 days"
              else if (diffDays <= 30) dateGroup = "Last month"

              return {
                id: dbSession.sessionId,
                title: `${dbSession.role || "General"} Interview`,
                type: dbSession.role || "General",
                topic: dbSession.keyFocusArea || "General",
                difficulty: dbSession.difficulty || "Medium",
                dateLabel: date.toLocaleDateString(),
                dateGroup,
                duration: "Completed",
                score: overallScore,
                technical: dbSession.scores?.technical ?? overallScore,
                communication: dbSession.scores?.communication ?? overallScore,
                confidence: dbSession.scores?.confidence ?? overallScore,
                weakAreas: dbSession.weaknesses || [],
                tags: isCompleted
                  ? overallScore >= 8
                    ? ["High Score"]
                    : ["Needs Review"]
                  : ["Incomplete Sessions"],
                completed: isCompleted,
                transcript: (dbSession.questionsAnswers || []).flatMap(
                  (qa: any) => [
                    { speaker: "AI", line: qa.question },
                    { speaker: "You", line: qa.answer },
                  ]
                ),
                recommendation:
                  dbSession.summary ||
                  "Complete the session to see recommendations.",
              }
            }
          )
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
  const [topicFilter, setTopicFilter] = useState<string>("All")
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

      const topicMatch =
        topicFilter === "All" ||
        session.topic.toLowerCase().includes(topicFilter.toLowerCase())
      const difficultyMatch =
        difficultyFilter === "All" || session.difficulty === difficultyFilter
      const performanceMatch =
        performanceFilter === "All" || session.tags.includes(performanceFilter)
      const dateMatch = dateFilter === "All" || session.dateGroup === dateFilter

      return (
        searchMatch &&
        topicMatch &&
        difficultyMatch &&
        performanceMatch &&
        dateMatch
      )
    })
  }, [
    dateFilter,
    difficultyFilter,
    performanceFilter,
    search,
    topicFilter,
    sessions,
  ])

  const selectedSession = useMemo(
    () =>
      filteredSessions.find((session) => session.id === selectedSessionId) ??
      null,
    [filteredSessions, selectedSessionId]
  )

  const completedSessions = sessions.filter((session) => session.completed)
  const totalInterviews = sessions.length
  const averageScore =
    completedSessions.length > 0
      ? (
          completedSessions.reduce((sum, session) => sum + session.score, 0) /
          completedSessions.length
        ).toFixed(1)
      : "0.0"

  let bestDomain = "--"
  if (completedSessions.length > 0) {
    const domainScores: Record<string, { total: number; count: number }> = {}
    completedSessions.forEach((session) => {
      const domain = session.topic
      if (!domainScores[domain]) {
        domainScores[domain] = { total: 0, count: 0 }
      }
      domainScores[domain].total += session.score
      domainScores[domain].count += 1
    })

    let highestAvg = -1
    for (const [domain, stats] of Object.entries(domainScores)) {
      const avg = stats.total / stats.count
      if (avg > highestAvg) {
        highestAvg = avg
        bestDomain = domain
      }
    }
  }

  let trendText = "--"
  let trendIsPositive = true
  if (completedSessions.length > 0) {
    const recentSessions = completedSessions.filter(
      (s) => s.dateGroup === "Last 7 days" || s.dateGroup === "Last month"
    )
    const olderSessions = completedSessions.filter(
      (s) => s.dateGroup === "All time"
    )

    if (recentSessions.length > 0 && olderSessions.length > 0) {
      const recentAvg =
        recentSessions.reduce((sum, s) => sum + s.score, 0) /
        recentSessions.length
      const olderAvg =
        olderSessions.reduce((sum, s) => sum + s.score, 0) /
        olderSessions.length

      const diff = recentAvg - olderAvg
      const percentChange = olderAvg > 0 ? (diff / olderAvg) * 100 : (diff > 0 ? 100 : 0)

      if (percentChange > 0) {
        trendText = `+${percentChange.toFixed(0)}% this month`
        trendIsPositive = true
      } else if (percentChange < 0) {
        trendText = `${percentChange.toFixed(0)}% this month`
        trendIsPositive = false
      } else {
        trendText = "0% this month"
        trendIsPositive = true
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5 bg-background p-4 sm:p-6">
      <section className="flex flex-col gap-3 rounded-2xl border bg-card px-4 py-4 shadow-sm ring-1 ring-border/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Interview History
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Review previous interviews and track progress across technical and
            communication skills.
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="shrink-0 transition-all duration-200"
        >
          <Link to="/start-interview">Start interview</Link>
        </Button>
      </section>

      <section className="rounded-2xl border bg-card px-4 py-3 shadow-sm ring-1 ring-border/40">
        <div className="grid gap-2 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-8 pl-8 text-xs"
              placeholder="Search interviews, topics, weak areas..."
            />
          </div>

          <select
            value={topicFilter}
            onChange={(event) => setTopicFilter(event.target.value)}
            className={selectClassName}
          >
            <option value="All">Topic: All</option>
            {topicOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(event) =>
              setDifficultyFilter(event.target.value as Difficulty | "All")
            }
            className={selectClassName}
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
            className={selectClassName}
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
            className={selectClassName}
          >
            {performanceFilters.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "Score: All" : option}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border bg-card px-4 py-3 shadow-sm ring-1 ring-border/40">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Total
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {totalInterviews}
          </p>
        </article>
        <article className="rounded-2xl border bg-card px-4 py-3 shadow-sm ring-1 ring-border/40">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Avg score
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {averageScore}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / 10
            </span>
          </p>
        </article>
        <article className="rounded-2xl border bg-card px-4 py-3 shadow-sm ring-1 ring-border/40">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Best domain
          </p>
          <p className="mt-1 text-xl font-semibold">{bestDomain}</p>
        </article>
        <article className="rounded-2xl border bg-card px-4 py-3 shadow-sm ring-1 ring-border/40">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Trend
          </p>
          <p className={`mt-1 flex items-center gap-1 text-xl font-semibold ${trendIsPositive ? "text-emerald-600" : "text-red-600"}`}>
            {trendIsPositive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
            {trendText}
          </p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          {filteredSessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-muted-foreground/20 bg-card px-6 py-8 text-center text-sm text-muted-foreground">
              No interviews match these filters. Try broadening your search.
            </div>
          ) : (
            filteredSessions.map((session) => (
              <article
                key={session.id}
                className="rounded-2xl border bg-card p-4 shadow-sm ring-1 ring-border/40 transition-all duration-200 hover:ring-primary/30"
              >
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span>{session.type}</span>
                  <span>•</span>
                  <span>{session.difficulty}</span>
                  <span>•</span>
                  <span>{session.dateLabel}</span>
                  <span>•</span>
                  <span>{session.duration}</span>
                </div>

                <h2 className="mt-1.5 text-base font-semibold">
                  {session.title}
                </h2>

                <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
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

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {session.weakAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {area}
                    </span>
                  ))}
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {session.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" asChild>
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
                      New Practice <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                  {!session.completed && (
                    <Button variant="default" size="sm" asChild>
                      <Link
                        to={`/interview?sessionId=${session.id}`}
                        className="inline-flex items-center gap-1"
                      >
                        Resume Interview <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm ring-1 ring-border/40">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Quick view
          </h3>
          <div className="mt-3 space-y-2">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-xl border bg-background px-3 py-2 text-xs transition-colors duration-200 hover:bg-muted/40"
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
