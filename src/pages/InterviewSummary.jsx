import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router"
import { CheckCircle2, Lightbulb, XCircle } from "lucide-react"
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { Badge } from "../../app/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../app/components/ui/card"
import { Skeleton } from "../../app/components/ui/skeleton"
import { cn } from "../../app/lib/utils"
import ScoreRing from "../components/analysis/ScoreRing"
import VerdictBadge from "../components/analysis/VerdictBadge"
import {
  formatDate,
  formatDimension,
  scoreToColor,
} from "../utils/scoreUtils"

function normalizeDimensions(scoreResult) {
  const raw = scoreResult?.dimensions
  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw.map((dimension) => ({
      key: dimension.key ?? dimension.name,
      score: dimension.score ?? 0,
      rationale: dimension.rationale ?? dimension.reason ?? "",
      flag: dimension.flag,
    }))
  }

  return Object.entries(raw).map(([key, value]) => ({
    key,
    score: value.score ?? 0,
    rationale: value.rationale ?? value.reason ?? "",
    flag: value.flag,
  }))
}

function DimensionCard({ dimension }) {
  const isInsufficient = dimension.flag === "insufficient_evidence"
  const colors = isInsufficient ? null : scoreToColor(dimension.score)

  return (
    <Card
      size="sm"
      className={cn(
        "gap-3 shadow-sm ring-1 ring-border/40",
        isInsufficient && "bg-muted/40 ring-muted-foreground/20"
      )}
    >
      <CardHeader className="gap-1 pb-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold">
            {formatDimension(dimension.key)}
          </CardTitle>
          {isInsufficient ? (
            <Badge variant="secondary" className="h-5 text-[11px]">
              Not assessed
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {!isInsufficient ? (
          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (dimension.score / 10) * 100)}%`,
                  backgroundColor: colors.bar,
                }}
              />
            </div>
            <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
              {dimension.score}/10
            </span>
          </div>
        ) : null}
        <CardDescription className="text-xs leading-relaxed">
          {dimension.rationale || "No rationale provided."}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

function SummarySkeleton() {
  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="size-16 rounded-full" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-2xl" />
          ))}
        </div>

        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  )
}

export default function InterviewSummary() {
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchSession() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/session/${sessionId}`)

        if (!response.ok) {
          throw new Error("Failed to load interview summary")
        }

        const data = await response.json()
        if (!cancelled) {
          setSession(data.data ?? data)
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load interview summary"
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    if (sessionId) {
      fetchSession()
    } else {
      setIsLoading(false)
      setError("Missing session ID")
    }

    return () => {
      cancelled = true
    }
  }, [sessionId])

  const scoreResult = session?.analysis?.scoreResult
  const dimensions = useMemo(
    () => normalizeDimensions(scoreResult),
    [scoreResult]
  )

  const chartData = useMemo(
    () =>
      dimensions.map((dimension) => ({
        dimension: formatDimension(dimension.key),
        score:
          dimension.flag === "insufficient_evidence" ? 0 : dimension.score,
        fullMark: 10,
      })),
    [dimensions]
  )

  if (isLoading) {
    return <SummarySkeleton />
  }

  if (error || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <Card className="max-w-md shadow-sm">
          <CardHeader>
            <CardTitle>Unable to load summary</CardTitle>
            <CardDescription>{error ?? "Session not found."}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const role = session.role ?? "Interview"
  const interviewType =
    session.interviewType ?? session.type ?? session.interview_type ?? "General"
  const dateIso =
    session.createdAt ?? session.completedAt ?? session.updatedAt ?? null
  const overall = scoreResult?.overall ?? 0
  const verdict = scoreResult?.verdict ?? "—"
  const analysis = session.analysis ?? {}
  const summary = analysis.summary ?? session.summary ?? ""
  const whatWorked = analysis.what_worked ?? analysis.whatWorked ?? ""
  const interviewerNote =
    analysis.interviewer_note ?? analysis.interviewerNote ?? ""
  const whatToFix = analysis.what_to_fix ?? analysis.whatToFix ?? []
  const nextSteps = analysis.next_steps ?? analysis.nextSteps ?? []
  const topicsCovered =
    analysis.topics_covered ?? analysis.topicsCovered ?? []
  const topicsMissed = analysis.topics_missed ?? analysis.topicsMissed ?? []
  const strengths = analysis.strengths ?? session.strengths ?? []
  const gaps = analysis.gaps ?? session.gaps ?? session.weaknesses ?? []

  const whatWorkedItems = Array.isArray(whatWorked)
    ? whatWorked
    : whatWorked
      ? [whatWorked]
      : []

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <section className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm ring-1 ring-border/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {role}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <Badge variant="secondary" className="h-5 text-[11px]">
                {interviewType}
              </Badge>
              {dateIso ? <span>{formatDate(dateIso)}</span> : null}
            </div>
            <VerdictBadge verdict={verdict} size="md" />
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1">
            <ScoreRing score={overall} size={80} strokeWidth={6} />
            <span className="text-[11px] text-muted-foreground">
              Overall score
            </span>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold tracking-tight">
            Dimension breakdown
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((dimension) => (
              <DimensionCard key={dimension.key} dimension={dimension} />
            ))}
          </div>
        </section>

        {chartData.length > 0 ? (
          <section>
            <h2 className="mb-3 text-base font-semibold tracking-tight">
              Performance radar
            </h2>
            <Card size="sm" className="gap-0 shadow-sm ring-1 ring-border/40">
              <CardContent className="pt-4">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis domain={[0, 10]} tickCount={6} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.4}
                      />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>
        ) : null}

        <section>
          <h2 className="mb-3 text-base font-semibold tracking-tight">
            Interview narrative
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              {summary ? (
                <blockquote className="rounded-r-xl border-l-2 border-primary/50 bg-muted/30 py-2.5 pl-3 pr-3 text-sm leading-relaxed text-foreground">
                  {summary}
                </blockquote>
              ) : null}

              {whatWorkedItems.length > 0 ? (
                <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                  <h3 className="text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
                    What worked
                  </h3>
                  {whatWorkedItems.length === 1 ? (
                    <p className="mt-2 text-sm leading-relaxed text-emerald-950/80 dark:text-emerald-100/80">
                      {whatWorkedItems[0]}
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-2 text-sm leading-relaxed text-emerald-950/80 dark:text-emerald-100/80">
                      {whatWorkedItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}

              {interviewerNote ? (
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                  <h3 className="text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">
                    Interviewer's note
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-amber-950/80 italic dark:text-amber-100/80">
                    {interviewerNote}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              {whatToFix.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    What to fix
                  </h3>
                  <ul className="space-y-3">
                    {whatToFix.map((item, index) => {
                      const area =
                        item.area ?? item.label ?? item.dimension ?? "General"
                      const observation =
                        item.observation ?? item.issue ?? item.note ?? ""
                      const action = item.action ?? item.tip ?? item.fix ?? ""

                      return (
                        <li
                          key={index}
                          className="rounded-xl border bg-card p-3 shadow-sm ring-1 ring-border/40"
                        >
                          <p className="text-sm font-medium">
                            {formatDimension(String(area))}
                          </p>
                          {observation ? (
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              {observation}
                            </p>
                          ) : null}
                          {action ? (
                            <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50/50 p-2.5 text-xs dark:border-amber-900/40 dark:bg-amber-950/20">
                              <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                              <span>{action}</span>
                            </div>
                          ) : null}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : null}

              {nextSteps.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Next steps
                  </h3>
                  <ol className="space-y-2">
                    {nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span
                          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/5 text-xs font-semibold tabular-nums text-primary"
                          aria-hidden="true"
                        >
                          {index + 1}
                        </span>
                        <span className="text-sm leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold tracking-tight">
            Topics coverage
          </h2>
          <Card size="sm" className="gap-4 shadow-sm ring-1 ring-border/40">
            <CardContent className="space-y-4 pt-4">
              {topicsCovered.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Covered
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {topicsCovered.map((topic, index) => (
                      <Badge
                        key={index}
                        className="h-5 border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {topicsMissed.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Missed
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {topicsMissed.map((topic, index) => (
                      <Badge
                        key={index}
                        className="h-5 border-red-200 bg-red-50 text-[11px] text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <Badge className="h-5 border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  Full coverage
                </Badge>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold tracking-tight">
            Strengths &amp; gaps
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Card size="sm" className="gap-3 shadow-sm ring-1 ring-border/40">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                  <CheckCircle2 className="size-4" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                {strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm leading-relaxed"
                      >
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No strengths recorded.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card size="sm" className="gap-3 shadow-sm ring-1 ring-border/40">
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-1.5 text-sm font-semibold text-red-600">
                  <XCircle className="size-4" />
                  Gaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gaps.length > 0 ? (
                  <ul className="space-y-2">
                    {gaps.map((gap, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm leading-relaxed"
                      >
                        <XCircle className="mt-0.5 size-3.5 shrink-0 text-red-600" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No gaps recorded.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
