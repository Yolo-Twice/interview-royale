import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { ChevronDown, Filter, Search, X } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label as RechartsLabel,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "../../app/components/ui/badge"
import { Button } from "../../app/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../app/components/ui/card"
import { Checkbox } from "../../app/components/ui/checkbox"
import { Input } from "../../app/components/ui/input"
import { Label } from "../../app/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../app/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../app/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../app/components/ui/sheet"
import { Skeleton } from "../../app/components/ui/skeleton"
import { Slider } from "../../app/components/ui/slider"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../app/components/ui/tabs"
import { useAuth } from "../../app/contexts/auth-provider"
import { useIsMobile } from "../../app/hooks/use-mobile"
import { cn } from "../../app/lib/utils"
import ScoreRing from "../components/analysis/ScoreRing"
import VerdictBadge from "../components/analysis/VerdictBadge"
import {
  calcAverage,
  formatDimension,
  mostCommonVerdict,
  relativeDate,
  scoreToColor,
  truncate,
  verdictToColor,
} from "../utils/scoreUtils"

const VERDICT_OPTIONS = ["Strong hire", "Hire", "Borderline", "No hire"]
const SENIORITY_OPTIONS = ["Intern", "Junior", "Mid", "Senior", "Lead"]
const TYPE_OPTIONS = ["All", "Technical", "HR"]
const DATE_PRESETS = ["Today", "Last 7 days", "Last 30 days", "All time"]
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "score-asc", label: "Score ↑" },
  { value: "score-desc", label: "Score ↓" },
]

const DEFAULT_FILTERS = {
  type: "All",
  verdicts: [],
  scoreRange: [0, 100],
  datePreset: "All time",
  roleSearch: "",
  seniority: [],
  stackTags: [],
}

const CARDS_PER_PAGE = 6

const SCORE_BUCKETS = [
  { label: "0-20", min: 0, max: 20, color: "#ef4444" },
  { label: "21-40", min: 21, max: 40, color: "#f97316" },
  { label: "41-60", min: 41, max: 60, color: "#f59e0b" },
  { label: "61-80", min: 61, max: 80, color: "#84cc16" },
  { label: "81-100", min: 81, max: 100, color: "#10b981" },
]

const CHART_HEIGHT = 320

function getSessionId(session) {
  return session.sessionId ?? session.id ?? ""
}

function getSessionType(session) {
  const raw =
    session.interviewType ??
    session.type ??
    session.interview_type ??
    ""
  const normalized = String(raw).toLowerCase()
  if (normalized.includes("hr") || normalized.includes("behavioral")) {
    return "HR"
  }
  return "Technical"
}

function getSessionScore(session) {
  return session.analysis?.scoreResult?.overall ?? 0
}

function getSessionVerdict(session) {
  return session.analysis?.scoreResult?.verdict ?? null
}

function getSessionRole(session) {
  return session.parsedJD?.role ?? session.role ?? ""
}

function getSessionSeniority(session) {
  const raw =
    session.parsedJD?.seniority ??
    session.seniority ??
    session.parsedJD?.level ??
    ""
  return String(raw)
}

function getSessionStackTags(session) {
  const jd = session.parsedJD ?? {}
  const stack =
    jd.stack ??
    jd.techStack ??
    jd.technologies ??
    jd.tags ??
    session.stack ??
    []

  if (Array.isArray(stack)) return stack.map(String)
  if (typeof stack === "string" && stack.trim()) return [stack]
  return []
}

function getSessionDate(session) {
  const iso =
    session.createdAt ?? session.completedAt ?? session.updatedAt ?? null
  return iso ? new Date(iso) : null
}

function getSessionStrengths(session) {
  return session.analysis?.strengths ?? session.strengths ?? []
}

function getSessionSummary(session) {
  return session.analysis?.summary ?? session.summary ?? ""
}

function countActiveFilters(filters, debouncedRoleSearch) {
  let count = 0
  if (filters.type !== "All") count += 1
  if (filters.verdicts.length > 0) count += 1
  if (filters.scoreRange[0] !== 0 || filters.scoreRange[1] !== 100) count += 1
  if (filters.datePreset !== "All time") count += 1
  if (debouncedRoleSearch.trim()) count += 1
  if (filters.seniority.length > 0) count += 1
  if (filters.stackTags.length > 0) count += 1
  return count
}

function buildActiveFilterChips(filters, debouncedRoleSearch, setFilters, setScoreDraft) {
  const chips = []

  if (filters.type !== "All") {
    chips.push({
      id: "type",
      label: filters.type,
      onRemove: () => setFilters((prev) => ({ ...prev, type: "All" })),
    })
  }

  for (const verdict of filters.verdicts) {
    chips.push({
      id: `verdict-${verdict}`,
      label: verdict,
      onRemove: () =>
        setFilters((prev) => ({
          ...prev,
          verdicts: prev.verdicts.filter((item) => item !== verdict),
        })),
    })
  }

  if (filters.scoreRange[0] !== 0 || filters.scoreRange[1] !== 100) {
    chips.push({
      id: "score",
      label: `Score ${filters.scoreRange[0]}–${filters.scoreRange[1]}`,
      onRemove: () => {
        setFilters((prev) => ({ ...prev, scoreRange: [0, 100] }))
        setScoreDraft([0, 100])
      },
    })
  }

  if (filters.datePreset !== "All time") {
    chips.push({
      id: "date",
      label: filters.datePreset,
      onRemove: () =>
        setFilters((prev) => ({ ...prev, datePreset: "All time" })),
    })
  }

  if (debouncedRoleSearch.trim()) {
    chips.push({
      id: "role",
      label: `Role: ${debouncedRoleSearch.trim()}`,
      onRemove: () =>
        setFilters((prev) => ({ ...prev, roleSearch: "" })),
    })
  }

  for (const level of filters.seniority) {
    chips.push({
      id: `seniority-${level}`,
      label: level,
      onRemove: () =>
        setFilters((prev) => ({
          ...prev,
          seniority: prev.seniority.filter((item) => item !== level),
        })),
    })
  }

  for (const tag of filters.stackTags) {
    chips.push({
      id: `stack-${tag}`,
      label: tag,
      onRemove: () =>
        setFilters((prev) => ({
          ...prev,
          stackTags: prev.stackTags.filter((item) => item !== tag),
        })),
    })
  }

  return chips
}

function FilterPanel({ open, onOpenChange, isMobile, activeCount, children }) {
  const trigger = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5 transition-all duration-200"
    >
      <Filter className="size-3.5" />
      Filters
      {activeCount > 0 ? (
        <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">
          {activeCount}
        </Badge>
      ) : null}
    </Button>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent side="left" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-sm">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="text-sm font-semibold">Filters</SheetTitle>
          </SheetHeader>
          <div className="px-4 py-4">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-[min(20rem,calc(100vw-2rem))] max-h-[min(28rem,70vh)] gap-0 overflow-y-auto p-0"
        align="end"
        sideOffset={8}
      >
        <p className="border-b px-4 py-3 text-sm font-semibold">Filters</p>
        <div className="p-4">{children}</div>
      </PopoverContent>
    </Popover>
  )
}

function ActiveFilterChips({ chips, onClearAll }) {
  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((chip) => (
        <Badge
          key={chip.id}
          variant="secondary"
          className="h-6 gap-1 pr-1 pl-2"
        >
          <span className="max-w-[10rem] truncate">{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="rounded-full p-0.5 transition-colors duration-200 hover:bg-muted-foreground/20"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className="h-6 text-muted-foreground"
        onClick={onClearAll}
      >
        Clear all
      </Button>
    </div>
  )
}

function formatChartDate(date) {
  const day = String(date.getDate()).padStart(2, "0")
  const month = date.toLocaleString("en-GB", { month: "short" })
  return `${day} ${month}`
}

function normalizeDimensions(scoreResult) {
  const raw = scoreResult?.dimensions
  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw.map((dimension) => ({
      key: dimension.key ?? dimension.name,
      score: dimension.score ?? 0,
      flag: dimension.flag,
    }))
  }

  return Object.entries(raw).map(([key, value]) => ({
    key,
    score: value.score ?? 0,
    flag: value.flag,
  }))
}

function ChartTooltip({ active, payload, label, children }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/5">
      {label ? (
        <p className="mb-1 font-medium text-foreground">{label}</p>
      ) : null}
      {children ?? (
        <div className="space-y-0.5 text-muted-foreground">
          {payload.map((entry) => (
            <p key={entry.name ?? entry.dataKey}>
              <span className="text-foreground">{entry.name ?? entry.dataKey}</span>
              {": "}
              {entry.value}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function ChartEmptyState({ message }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl border border-dashed border-muted-foreground/20 bg-muted/20 px-4 text-center text-sm text-muted-foreground"
      style={{ height: CHART_HEIGHT }}
    >
      {message}
    </div>
  )
}

function DashboardCharts({ sessions }) {
  const navigate = useNavigate()
  const [visibleDimensions, setVisibleDimensions] = useState(new Set())

  const progressData = useMemo(() => {
    return [...sessions]
      .filter((session) => getSessionDate(session))
      .sort(
        (a, b) =>
          (getSessionDate(a)?.getTime() ?? 0) -
          (getSessionDate(b)?.getTime() ?? 0)
      )
      .map((session) => {
        const date = getSessionDate(session)
        return {
          dateLabel: formatChartDate(date),
          score: getSessionScore(session),
          sessionId: getSessionId(session),
          role: getSessionRole(session) || "Interview",
        }
      })
  }, [sessions])

  const dimensionChart = useMemo(() => {
    const recentSessions = [...sessions]
      .filter((session) => getSessionDate(session))
      .sort(
        (a, b) =>
          (getSessionDate(b)?.getTime() ?? 0) -
          (getSessionDate(a)?.getTime() ?? 0)
      )
      .slice(0, 6)

    const roleCounts = new Map()
    const chartData = recentSessions.map((session) => {
      const role = getSessionRole(session) || "Interview"
      const count = (roleCounts.get(role) ?? 0) + 1
      roleCounts.set(role, count)
      const roleLabel =
        count > 1 ? `${truncate(role, 12)} (${count})` : truncate(role, 12)

      const row = {
        roleLabel,
        sessionId: getSessionId(session),
      }

      for (const dimension of normalizeDimensions(
        session.analysis?.scoreResult
      )) {
        if (dimension.flag !== "insufficient_evidence") {
          row[dimension.key] = dimension.score
        }
      }

      return row
    })

    const dimensionKeys = new Set()
    for (const row of chartData) {
      for (const key of Object.keys(row)) {
        if (key !== "roleLabel" && key !== "sessionId") {
          dimensionKeys.add(key)
        }
      }
    }

    return {
      chartData,
      dimensionKeys: [...dimensionKeys],
      totalFiltered: sessions.length,
      showingCount: recentSessions.length,
    }
  }, [sessions])

  const dimensionKeysKey = dimensionChart.dimensionKeys.join("|")

  useEffect(() => {
    setVisibleDimensions(new Set(dimensionChart.dimensionKeys))
  }, [dimensionKeysKey, dimensionChart.dimensionKeys])

  const histogramData = useMemo(() => {
    return SCORE_BUCKETS.map((bucket) => ({
      range: bucket.label,
      count: sessions.filter((session) => {
        const score = getSessionScore(session)
        return score >= bucket.min && score <= bucket.max
      }).length,
      color: bucket.color,
    }))
  }, [sessions])

  const verdictData = useMemo(() => {
    const counts = new Map()

    for (const session of sessions) {
      const verdict = getSessionVerdict(session)
      if (!verdict) continue
      counts.set(verdict, (counts.get(verdict) ?? 0) + 1)
    }

    const total = [...counts.values()].reduce((sum, count) => sum + count, 0)

    return {
      total,
      segments: [...counts.entries()].map(([verdict, count]) => ({
        verdict,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: verdictToColor(verdict),
      })),
    }
  }, [sessions])

  const toggleDimension = (key) => {
    setVisibleDimensions((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const activeDimensions = dimensionChart.dimensionKeys.filter((key) =>
    visibleDimensions.has(key)
  )

  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm ring-1 ring-border/40">
      <h2 className="mb-3 text-base font-semibold tracking-tight">Analytics</h2>

      <Tabs defaultValue="progress" className="gap-3">
        <TabsList className="h-8 w-full justify-start">
          <TabsTrigger value="progress" className="h-6 px-2.5 text-xs">
            Progress
          </TabsTrigger>
          <TabsTrigger value="dimensions" className="h-6 px-2.5 text-xs">
            Dimensions
          </TabsTrigger>
          <TabsTrigger value="distribution" className="h-6 px-2.5 text-xs">
            Distribution
          </TabsTrigger>
          <TabsTrigger value="verdicts" className="h-6 px-2.5 text-xs">
            Verdicts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          {progressData.length < 2 ? (
            <ChartEmptyState message="Complete at least 2 interviews to see your trend" />
          ) : (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <LineChart
                data={progressData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip
                  content={({ active, payload, label }) => (
                    <ChartTooltip active={active} label={label} payload={payload}>
                      {payload?.[0] ? (
                        <div className="space-y-0.5 text-muted-foreground">
                          <p>
                            <span className="text-foreground">Score</span>:{" "}
                            {payload[0].value}
                          </p>
                          <p>
                            <span className="text-foreground">Role</span>:{" "}
                            {payload[0].payload.role}
                          </p>
                        </div>
                      ) : null}
                    </ChartTooltip>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Score"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props
                    if (cx == null || cy == null) return null

                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill="#10b981"
                        stroke="#fff"
                        strokeWidth={2}
                        className="cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/interview/${payload.sessionId}/summary`
                          )
                        }
                      />
                    )
                  }}
                  activeDot={(props) => {
                    const { cx, cy, payload } = props
                    if (cx == null || cy == null) return null

                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={7}
                        fill="#10b981"
                        stroke="#fff"
                        strokeWidth={2}
                        className="cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/interview/${payload.sessionId}/summary`
                          )
                        }
                      />
                    )
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </TabsContent>

        <TabsContent value="dimensions">
          {dimensionChart.chartData.length === 0 ? (
            <ChartEmptyState message="No interviews with dimension scores in your filtered set" />
          ) : dimensionChart.dimensionKeys.length === 0 ? (
            <ChartEmptyState message="No dimension breakdown available for these interviews" />
          ) : (
            <div className="space-y-4">
              {dimensionChart.totalFiltered > 6 ? (
                <p className="text-xs text-muted-foreground">
                  Showing {dimensionChart.showingCount} most recent of{" "}
                  {dimensionChart.totalFiltered} filtered interviews
                </p>
              ) : null}

              <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                <BarChart
                  data={dimensionChart.chartData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="roleLabel"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => (
                      <ChartTooltip active={active} label={label} payload={payload}>
                        <div className="space-y-0.5 text-muted-foreground">
                          {payload?.map((entry) => (
                            <p key={entry.dataKey}>
                              <span className="text-foreground">
                                {formatDimension(String(entry.dataKey))}
                              </span>
                              {": "}
                              {entry.value} / 10
                            </p>
                          ))}
                        </div>
                      </ChartTooltip>
                    )}
                  />
                  {activeDimensions.map((dimensionKey) => (
                    <Bar
                      key={dimensionKey}
                      dataKey={dimensionKey}
                      name={formatDimension(dimensionKey)}
                    >
                      {dimensionChart.chartData.map((row, index) => {
                        const score = row[dimensionKey] ?? 0
                        return (
                          <Cell
                            key={`${dimensionKey}-${index}`}
                            fill={scoreToColor(score).bar}
                          />
                        )
                      })}
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>

              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {dimensionChart.dimensionKeys.map((dimensionKey) => (
                  <label
                    key={dimensionKey}
                    className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Checkbox
                      checked={visibleDimensions.has(dimensionKey)}
                      onCheckedChange={() => toggleDimension(dimensionKey)}
                    />
                    <span>{formatDimension(dimensionKey)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="distribution">
          {sessions.length === 0 ? (
            <ChartEmptyState message="No interviews in your filtered set to chart" />
          ) : (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart
                data={histogramData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null
                    const count = payload[0].value
                    return (
                      <ChartTooltip active={active} payload={payload}>
                        <p className="text-muted-foreground">
                          <span className="text-foreground">{count}</span>{" "}
                          interview{count === 1 ? "" : "s"} in this range
                        </p>
                      </ChartTooltip>
                    )
                  }}
                />
                <Bar dataKey="count" name="Interviews" radius={[6, 6, 0, 0]}>
                  {histogramData.map((bucket) => (
                    <Cell key={bucket.range} fill={bucket.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </TabsContent>

        <TabsContent value="verdicts">
          {verdictData.segments.length === 0 ? (
            <ChartEmptyState message="No verdict data available for your filtered interviews" />
          ) : (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                <PieChart>
                  <Pie
                    data={verdictData.segments}
                    dataKey="count"
                    nameKey="verdict"
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {verdictData.segments.map((segment) => (
                      <Cell key={segment.verdict} fill={segment.color} />
                    ))}
                    <RechartsLabel
                      content={({ viewBox }) => {
                        if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                          return null
                        }

                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {verdictData.total}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) + 18}
                              className="fill-muted-foreground text-xs"
                            >
                              interviews
                            </tspan>
                          </text>
                        )
                      }}
                      position="center"
                    />
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null
                      const segment = payload[0].payload
                      return (
                        <ChartTooltip active={active} payload={payload}>
                          <div className="space-y-0.5 text-muted-foreground">
                            <p>
                              <span className="text-foreground">
                                {segment.verdict}
                              </span>
                            </p>
                            <p>
                              {segment.count} interview
                              {segment.count === 1 ? "" : "s"} (
                              {segment.percentage}%)
                            </p>
                          </div>
                        </ChartTooltip>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <Legend
                verticalAlign="bottom"
                content={() => (
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-2">
                    {verdictData.segments.map((segment) => (
                      <div
                        key={segment.verdict}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        <span
                          className="size-3 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span>
                          {segment.verdict} ({segment.count})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  )
}

function matchesDatePreset(date, preset) {
  if (!date || preset === "All time") return true

  const now = new Date()
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (preset === "Today") return diffDays === 0
  if (preset === "Last 7 days") return diffDays >= 0 && diffDays <= 6
  if (preset === "Last 30 days") return diffDays >= 0 && diffDays <= 29
  return true
}

function FilterBarContent({
  filters,
  setFilters,
  scoreDraft,
  setScoreDraft,
  onScoreCommit,
  uniqueStackTags,
}) {
  const toggleVerdict = (verdict) => {
    setFilters((prev) => ({
      ...prev,
      verdicts: prev.verdicts.includes(verdict)
        ? prev.verdicts.filter((item) => item !== verdict)
        : [...prev.verdicts, verdict],
    }))
  }

  const toggleSeniority = (level) => {
    setFilters((prev) => ({
      ...prev,
      seniority: prev.seniority.includes(level)
        ? prev.seniority.filter((item) => item !== level)
        : [...prev.seniority, level],
    }))
  }

  const toggleStackTag = (tag) => {
    setFilters((prev) => ({
      ...prev,
      stackTags: prev.stackTags.includes(tag)
        ? prev.stackTags.filter((item) => item !== tag)
        : [...prev.stackTags, tag],
    }))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Type
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {TYPE_OPTIONS.map((option) => (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={filters.type === option ? "default" : "outline"}
              onClick={() =>
                setFilters((prev) => ({ ...prev, type: option }))
              }
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Verdict
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-full justify-between gap-2 text-xs transition-all duration-200"
            >
              {filters.verdicts.length > 0
                ? `${filters.verdicts.length} selected`
                : "All verdicts"}
              <ChevronDown className="size-3.5 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-3" align="start">
            <div className="space-y-2">
              {VERDICT_OPTIONS.map((verdict) => (
                <label
                  key={verdict}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={filters.verdicts.includes(verdict)}
                    onCheckedChange={() => toggleVerdict(verdict)}
                  />
                  <span>{verdict}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Score{" "}
          <span className="normal-case tracking-normal">
            {scoreDraft[0]}–{scoreDraft[1]}
          </span>
        </Label>
        <Slider
          min={0}
          max={100}
          step={1}
          value={scoreDraft}
          onValueChange={setScoreDraft}
          onValueCommit={onScoreCommit}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Date
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {DATE_PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              size="sm"
              variant={filters.datePreset === preset ? "default" : "outline"}
              onClick={() =>
                setFilters((prev) => ({ ...prev, datePreset: preset }))
              }
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Role
        </Label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.roleSearch}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                roleSearch: event.target.value,
              }))
            }
            className="h-8 pl-8 text-xs"
            placeholder="Search by role..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Seniority
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {SENIORITY_OPTIONS.map((level) => {
            const selected = filters.seniority.includes(level)
            return (
              <Button
                key={level}
                type="button"
                size="sm"
                variant={selected ? "default" : "outline"}
                onClick={() => toggleSeniority(level)}
              >
                {level}
              </Button>
            )
          })}
        </div>
      </div>

      {uniqueStackTags.length > 0 ? (
        <div className="space-y-2">
          <Label className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Stack
          </Label>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {uniqueStackTags.map((tag) => {
              const selected = filters.stackTags.includes(tag)
              return (
                <Button
                  key={tag}
                  type="button"
                  size="sm"
                  variant={selected ? "default" : "outline"}
                  className="shrink-0"
                  onClick={() => toggleStackTag(tag)}
                >
                  {tag}
                </Button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SessionCard({ session }) {
  const sessionId = getSessionId(session)
  const role = getSessionRole(session) || "Interview"
  const seniority = getSessionSeniority(session)
  const type = getSessionType(session)
  const score = getSessionScore(session)
  const verdict = getSessionVerdict(session)
  const strengths = getSessionStrengths(session).slice(0, 2)
  const summary = truncate(getSessionSummary(session), 80)
  const dateIso =
    session.createdAt ?? session.completedAt ?? session.updatedAt

  return (
    <Card
      size="sm"
      className="gap-4 shadow-sm ring-1 ring-border/40 transition-all duration-200 hover:ring-border/80"
    >
      <CardHeader className="gap-2 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <CardTitle className="truncate text-base font-semibold">
              {role}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-1.5">
              {seniority ? (
                <Badge variant="secondary" className="h-5 text-[11px]">
                  {seniority}
                </Badge>
              ) : null}
              <Badge variant="outline" className="h-5 text-[11px]">
                {type}
              </Badge>
              {dateIso ? (
                <span className="text-[11px] text-muted-foreground">
                  {relativeDate(dateIso)}
                </span>
              ) : null}
            </div>
          </div>
          <ScoreRing score={score} size={52} strokeWidth={4} />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <VerdictBadge verdict={verdict} />

        {strengths.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {strengths.map((strength) => (
              <Badge
                key={strength}
                variant="outline"
                className="h-5 border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
              >
                {strength}
              </Badge>
            ))}
          </div>
        ) : null}

        {summary ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {summary}
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-7 text-xs transition-all duration-200"
        >
          <Link to={`/interview/${sessionId}/summary`}>View details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const isMobile = useIsMobile()

  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [scoreDraft, setScoreDraft] = useState([0, 100])
  const [debouncedRoleSearch, setDebouncedRoleSearch] = useState("")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedRoleSearch(filters.roleSearch)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [filters.roleSearch])

  useEffect(() => {
    let cancelled = false

    async function fetchSessions() {
      if (authLoading) return

      setIsLoading(true)

      try {
        const userId = user?.uid
        if (!userId) {
          if (!cancelled) setSessions([])
          return
        }

        const response = await fetch(`/api/sessions?userId=${userId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch sessions")
        }

        const data = await response.json()
        const raw = Array.isArray(data) ? data : (data.data ?? data.sessions ?? [])
        if (!cancelled) {
          setSessions(raw)
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error)
        if (!cancelled) setSessions([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchSessions()
    return () => {
      cancelled = true
    }
  }, [user?.uid, authLoading])

  const uniqueStackTags = useMemo(() => {
    const tags = new Set()
    for (const session of sessions) {
      for (const tag of getSessionStackTags(session)) {
        if (tag) tags.add(tag)
      }
    }
    return [...tags].sort((a, b) => a.localeCompare(b))
  }, [sessions])

  const filteredSessions = useMemo(() => {
    const query = debouncedRoleSearch.trim().toLowerCase()

    return sessions.filter((session) => {
      if (filters.type !== "All" && getSessionType(session) !== filters.type) {
        return false
      }

      const verdict = getSessionVerdict(session)
      if (
        filters.verdicts.length > 0 &&
        (!verdict || !filters.verdicts.includes(verdict))
      ) {
        return false
      }

      const score = getSessionScore(session)
      if (score < filters.scoreRange[0] || score > filters.scoreRange[1]) {
        return false
      }

      const date = getSessionDate(session)
      if (!matchesDatePreset(date, filters.datePreset)) {
        return false
      }

      const role = getSessionRole(session).toLowerCase()
      if (query && !role.includes(query)) {
        return false
      }

      if (filters.seniority.length > 0) {
        const seniority = getSessionSeniority(session)
        const matchesSeniority = filters.seniority.some(
          (level) => seniority.toLowerCase() === level.toLowerCase()
        )
        if (!matchesSeniority) return false
      }

      if (filters.stackTags.length > 0) {
        const sessionTags = getSessionStackTags(session)
        const matchesStack = filters.stackTags.some((tag) =>
          sessionTags.some(
            (sessionTag) => sessionTag.toLowerCase() === tag.toLowerCase()
          )
        )
        if (!matchesStack) return false
      }

      return true
    })
  }, [sessions, filters, debouncedRoleSearch])

  const sortedSessions = useMemo(() => {
    const copy = [...filteredSessions]

    copy.sort((a, b) => {
      if (sort === "score-asc") {
        return getSessionScore(a) - getSessionScore(b)
      }
      if (sort === "score-desc") {
        return getSessionScore(b) - getSessionScore(a)
      }

      const dateA = getSessionDate(a)?.getTime() ?? 0
      const dateB = getSessionDate(b)?.getTime() ?? 0
      return sort === "oldest" ? dateA - dateB : dateB - dateA
    })

    return copy
  }, [filteredSessions, sort])

  const totalPages = Math.max(1, Math.ceil(sortedSessions.length / CARDS_PER_PAGE))

  useEffect(() => {
    setPage(1)
  }, [filters, debouncedRoleSearch, sort])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const paginatedSessions = useMemo(() => {
    const start = (page - 1) * CARDS_PER_PAGE
    return sortedSessions.slice(start, start + CARDS_PER_PAGE)
  }, [sortedSessions, page])

  const activeFilterCount = countActiveFilters(filters, debouncedRoleSearch)
  const averageScore = calcAverage(filteredSessions)
  const commonVerdict = mostCommonVerdict(filteredSessions)

  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setScoreDraft([0, 100])
    setDebouncedRoleSearch("")
  }, [])

  const onScoreCommit = useCallback((value) => {
    setFilters((prev) => ({ ...prev, scoreRange: value }))
  }, [])

  const filterBarProps = {
    filters,
    setFilters,
    scoreDraft,
    setScoreDraft,
    onScoreCommit,
    uniqueStackTags,
  }

  const activeFilterChips = buildActiveFilterChips(
    filters,
    debouncedRoleSearch,
    setFilters,
    setScoreDraft
  )

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 sm:p-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Browse and filter your past interview sessions.
          </p>
        </div>

        <FilterPanel
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          isMobile={isMobile}
          activeCount={activeFilterCount}
        >
          <FilterBarContent {...filterBarProps} />
        </FilterPanel>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border bg-card px-4 py-3 shadow-sm ring-1 ring-border/40">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredSessions.length} of {sessions.length} interviews
            </span>
            {filteredSessions.length > 0 ? (
              <>
                <span className="mx-1.5 text-border">·</span>
                Avg{" "}
                <span className="font-medium text-foreground">
                  {Math.round(averageScore)}
                </span>
                {commonVerdict ? (
                  <>
                    <span className="mx-1.5 text-border">·</span>
                    Top verdict{" "}
                    <span className="font-medium text-foreground">
                      {commonVerdict}
                    </span>
                  </>
                ) : null}
              </>
            ) : null}
          </p>

          <div
            className="inline-flex h-8 items-center gap-0.5 self-start rounded-3xl bg-muted/60 p-0.5"
            role="group"
            aria-label="Sort interviews"
          >
            {SORT_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="xs"
                variant={sort === option.value ? "default" : "ghost"}
                className={cn(
                  "h-7 rounded-3xl px-2.5 text-xs transition-all duration-200",
                  sort !== option.value && "text-muted-foreground"
                )}
                onClick={() => setSort(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <ActiveFilterChips
          chips={activeFilterChips}
          onClearAll={clearAllFilters}
        />
      </section>

      {!isLoading && !authLoading ? (
        <DashboardCharts sessions={filteredSessions} />
      ) : null}

      {isLoading || authLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : paginatedSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-muted-foreground/20 bg-card px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No interviews match your filters
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="transition-all duration-200"
            onClick={clearAllFilters}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedSessions.map((session) => (
              <SessionCard
                key={getSessionId(session)}
                session={session}
              />
            ))}
          </div>

          {totalPages > 1 ? (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                    className={cn(page === 1 && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={page === pageNumber}
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                    disabled={page === totalPages}
                    className={cn(
                      page === totalPages && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </>
      )}
    </div>
  )
}
