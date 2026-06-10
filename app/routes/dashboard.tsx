import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import {
  Activity,
  ArrowRight,
  Award,
  ChevronRight,
  Clock,
  Filter,
  MessageSquare,
  Play,
  TrendingUp,
  TrendingDown,
  Trophy,
  Zap,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { useAuth } from "~/contexts/auth-provider"
import { getPersonalizedGreeting } from "~/lib/user-display"
import { getUserProfile } from "~/lib/api/users"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState<{
    targetRole?: string
    currentStreak?: number
  } | null>(null)
  const [stats, setStats] = useState({
    averageScore: 0,
    totalInterviews: 0,
    bestSkill: { name: "-", score: 0 },
    worstSkill: { name: "-", score: 0 },
  })
  const [recentInterviews, setRecentInterviews] = useState<any[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [strongAreas, setStrongAreas] = useState<
    { topic: string; score: number }[]
  >([])
  const [weakAreas, setWeakAreas] = useState<
    { topic: string; score: number }[]
  >([])
  const [chartData, setChartData] = useState<any[]>([])
  const [activeTopics, setActiveTopics] = useState<string[]>([])
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [activeMetrics, setActiveMetrics] = useState({
    technical: true,
    communication: true,
    problemSolving: true,
    confidence: true,
    systemDesign: true,
  })
  const [recommendedTopic, setRecommendedTopic] = useState<{
    name: string
    type: "strong" | "weak" | "neutral"
    message: string
    difficulty: string
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!user) return

      let profile: any = null
      try {
        profile = await getUserProfile(user.uid).catch(() => null)
      } catch (e) {
        console.error("Failed to fetch profile", e)
      }

      let newStrongAreas: { topic: string; score: number }[] = []
      let newWeakAreas: { topic: string; score: number }[] = []

      try {
        const response = await fetch(`/api/interview-sessions/user/${user.uid}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            const sessions = result.data
            const completed = sessions.filter(
              (s: any) => s.status === "completed"
            )

            let avgScore = 0
            let bSkill = { name: "-", score: 0 }
            let wSkill = { name: "-", score: 0 }

            if (completed.length > 0) {
              const totalScore = completed.reduce(
                (sum: number, s: any) => sum + (s.overallScore || 0),
                0
              )
              avgScore = Math.round(totalScore / completed.length) / 10

              const skillSums: Record<string, number> = {
                Technical: 0,
                Communication: 0,
                "Problem Solving": 0,
                Confidence: 0,
                "System Design": 0,
              }

              const topicStats: Record<
                string,
                { totalScore: number; count: number }
              > = {}

              completed.forEach((s: any) => {
                if (s.scores) {
                  skillSums["Technical"] += s.scores.technical || 0
                  skillSums["Communication"] += s.scores.communication || 0
                  skillSums["Problem Solving"] += s.scores.problemSolving || 0
                  skillSums["Confidence"] += s.scores.confidence || 0
                  skillSums["System Design"] += s.scores.systemDesign || 0
                }

                const topic = s.keyFocusArea || "General"
                if (!topicStats[topic]) {
                  topicStats[topic] = { totalScore: 0, count: 0 }
                }
                topicStats[topic].totalScore += s.overallScore || 0
                topicStats[topic].count += 1
              })

              const skillAverages = Object.entries(skillSums).map(
                ([name, sum]) => ({
                  name,
                  score: sum / completed.length,
                })
              )

              skillAverages.sort((a, b) => a.score - b.score)

              wSkill = {
                name: skillAverages[0].name,
                score: Math.round(skillAverages[0].score * 10) / 10,
              }
              bSkill = {
                name: skillAverages[skillAverages.length - 1].name,
                score:
                  Math.round(
                    skillAverages[skillAverages.length - 1].score * 10
                  ) / 10,
              }

              // Calculate strong and weak areas
              const topicAverages = Object.entries(topicStats).map(
                ([topic, stats]) => ({
                  topic,
                  score: Math.round(stats.totalScore / stats.count),
                })
              )

              topicAverages.sort((a, b) => b.score - a.score)

              newStrongAreas = topicAverages
                .filter((t) => t.score >= 50)
                .slice(0, 3)
              const strongTopics = new Set(newStrongAreas.map((t) => t.topic))
              newWeakAreas = topicAverages
                .filter((t) => !strongTopics.has(t.topic))
                .slice(-3)
                .sort((a, b) => a.score - b.score)

              setStrongAreas(newStrongAreas)
              setWeakAreas(newWeakAreas)

              const allTopics = Array.from(new Set(completed.map((s: any) => s.keyFocusArea || "General"))) as string[]
              setAvailableTopics(allTopics)
              setActiveTopics(allTopics)

              const formattedChartData = [...completed]
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((s) => {
                  const date = new Date(s.createdAt)
                  return {
                    dateLabel: `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString("en-GB", { month: "short" })}, ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`,
                    topic: s.keyFocusArea || "General",
                    technical: s.scores?.technical || 0,
                    communication: s.scores?.communication || 0,
                    problemSolving: s.scores?.problemSolving || 0,
                    confidence: s.scores?.confidence || 0,
                    systemDesign: s.scores?.systemDesign || 0,
                  }
                })
              setChartData(formattedChartData)
            }

            setStats({
              averageScore: avgScore,
              totalInterviews: completed.length,
              bestSkill: bSkill,
              worstSkill: wSkill,
            })

            setRecentInterviews(sessions.slice(0, 5))
          }
        }
      } catch (error) {
        console.error("Failed to fetch interview history:", error)
      } finally {
        setIsLoadingStats(false)
      }

      const userSkills = profile ? [...(profile.technologies || [])] : []
      let recommendation = null

      if (userSkills.length > 0) {
        const randomSkill =
          userSkills[Math.floor(Math.random() * userSkills.length)]

        let type: "strong" | "weak" | "neutral" = "neutral"
        let difficulty = "Medium"
        let message = `Expand your knowledge in ${randomSkill}. It's a great time to practice and solidify your understanding!`

        const isStrong = newStrongAreas.some(
          (area) => area.topic.toLowerCase() === randomSkill.toLowerCase()
        )
        const isWeak = newWeakAreas.some(
          (area) => area.topic.toLowerCase() === randomSkill.toLowerCase()
        )

        if (isStrong) {
          type = "strong"
          const difficulties = ["Mixed", "Medium", "Hard"]
          difficulty =
            difficulties[Math.floor(Math.random() * difficulties.length)]
          message = `You are doing great in ${randomSkill}. Let's try some advanced questions to push your boundaries!`
        } else if (isWeak) {
          type = "weak"
          const difficulties = ["Easy", "Mixed"]
          difficulty =
            difficulties[Math.floor(Math.random() * difficulties.length)]
          message = `Based on your recent performance, reviewing ${randomSkill} will help boost your overall score. Let's practice!`
        }

        recommendation = { name: randomSkill, type, message, difficulty }
      } else {
        recommendation = {
          name: "General Practice",
          type: "neutral" as "strong" | "weak" | "neutral",
          message:
            "Ready for another session? Let's dive into some general interview questions to keep you sharp.",
          difficulty: "Medium",
        }
      }

      setRecommendedTopic(recommendation)

      if (profile) {
        setProfileData({
          targetRole: profile.targetRole,
          currentStreak: profile.currentStreak,
        })
      }
    }
    fetchData()
  }, [user])

  const filteredChartData = chartData.filter((d) => activeTopics.includes(d.topic))

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
      {/* 1. Welcome Banner */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {getPersonalizedGreeting(user)}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Target Role:{" "}
            <span className="font-medium text-foreground">
              {profileData?.targetRole || "Not Set"}
            </span>
          </p>
          {profileData?.currentStreak !== undefined &&
            profileData.currentStreak > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                You are on a {profileData.currentStreak}-day streak! Keep up the
                momentum to improve your skills.
              </p>
            )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate("/start-interview")}
          >
            <Play className="mr-2 size-4" /> Start Interview
          </Button>
        </div>
      </div>

      {/* 2. Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-primary" />
            <h3 className="text-sm font-medium">Average Score</h3>
          </div>
          <p className="mt-4 text-3xl font-bold">
            {isLoadingStats ? "-" : stats.averageScore}
            <span className="text-sm font-normal text-muted-foreground">
              /10
            </span>
          </p>
          <p className="mt-1 flex items-center text-xs text-muted-foreground">
            Lifetime average
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <h3 className="text-sm font-medium">Interviews</h3>
          </div>
          <p className="mt-4 text-3xl font-bold">
            {isLoadingStats ? "-" : stats.totalInterviews}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Total completed</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-primary" />
            <h3 className="text-sm font-medium">Best Skill</h3>
          </div>
          <p className="mt-4 truncate text-2xl font-bold">
            {isLoadingStats ? "-" : stats.bestSkill.name}
          </p>
          <p className="mt-1 flex items-center text-xs text-green-500">
            <TrendingUp className="mr-1 size-3" />{" "}
            {isLoadingStats ? "-" : stats.bestSkill.score}/10 avg score
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingDown className="size-4 text-primary" />
            <h3 className="text-sm font-medium">Worst Skill</h3>
          </div>
          <p className="mt-4 truncate text-2xl font-bold">
            {isLoadingStats ? "-" : stats.worstSkill.name}
          </p>
          <p className="mt-1 flex items-center text-xs text-orange-500">
            <TrendingDown className="mr-1 size-3" />{" "}
            {isLoadingStats ? "-" : stats.worstSkill.score}/10 avg score
          </p>
        </div>
      </div>

      {/* 3. Continue Practice (Large Primary Card) */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Recommended Practice
            </div>
            <h2 className="text-2xl font-bold">
              {recommendedTopic?.name || "General Practice"}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Zap className="size-3" /> Difficulty:{" "}
                {recommendedTopic?.difficulty || "Medium"}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="size-3" /> ~20 mins
              </span>
            </div>
            {recommendedTopic?.name !== "General Practice" && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Focus Area:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md border bg-background px-2 py-1 text-xs shadow-sm">
                    {recommendedTopic?.name}
                  </span>
                </div>
              </div>
            )}
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              <span
                className={`font-medium ${
                  recommendedTopic?.type === "strong"
                    ? "text-green-500"
                    : recommendedTopic?.type === "weak"
                      ? "text-orange-500"
                      : "text-primary"
                }`}
              >
                AI Insight:{" "}
              </span>
              {recommendedTopic?.message ||
                "Ready for another session? Let's dive into some general interview questions to keep you sharp."}
            </p>
          </div>
          <div className="mt-4 shrink-0 md:mt-0">
            <Button
              size="lg"
              className="w-full md:w-auto"
              onClick={() => navigate("/start-interview")}
            >
              Start Recommended Session <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Strong & Weak Areas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strong Areas */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Strong Areas</h3>
          <div className="space-y-4">
            {strongAreas.length > 0 ? (
              strongAreas.map((area, idx) => (
                <div key={idx}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{area.topic}</span>
                    <span className="text-green-500">{area.score}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${area.score}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {isLoadingStats
                  ? "Loading..."
                  : "Complete interviews to see your strong areas."}
              </p>
            )}
          </div>
          {strongAreas.length > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Praise:</span> You
              are doing great in these topics! Keep it up.
            </p>
          )}
        </div>

        {/* Weak Areas */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Weak Areas</h3>
          <div className="space-y-4">
            {weakAreas.length > 0 ? (
              weakAreas.map((area, idx) => (
                <div key={idx}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{area.topic}</span>
                    <span className="text-orange-500">{area.score}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${area.score}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {isLoadingStats
                  ? "Loading..."
                  : "No weak areas identified yet. Great job!"}
              </p>
            )}
          </div>
          {weakAreas.length > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Guidance:</span>{" "}
              Review these topics to improve your overall performance.
            </p>
          )}
        </div>
      </div>

      {/* 5. Performance Trend Chart */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Performance Trend</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 size-4" /> Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56">
              <div className="space-y-4">
                <h4 className="font-medium leading-none">Chart Metrics</h4>
                <div className="grid gap-2">
                  {[
                    { key: "technical", label: "Technical" },
                    { key: "communication", label: "Communication" },
                    { key: "problemSolving", label: "Problem Solving" },
                    { key: "confidence", label: "Confidence" },
                    { key: "systemDesign", label: "System Design" },
                  ].map((metric) => (
                    <div
                      key={metric.key}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={metric.key}
                        checked={activeMetrics[metric.key as keyof typeof activeMetrics]}
                        onCheckedChange={(checked) =>
                          setActiveMetrics((prev) => ({
                            ...prev,
                            [metric.key]: !!checked,
                          }))
                        }
                      />
                      <Label htmlFor={metric.key}>{metric.label}</Label>
                    </div>
                  ))}
                </div>
                {availableTopics.length > 0 && (
                  <>
                    <h4 className="mt-4 font-medium leading-none">Topics</h4>
                    <div className="grid gap-2">
                      {availableTopics.map((topic) => (
                        <div key={topic} className="flex items-center space-x-2">
                          <Checkbox
                            id={`topic-${topic.replace(/\s+/g, "-")}`}
                            checked={activeTopics.includes(topic)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setActiveTopics((prev) => [...prev, topic])
                              } else {
                                setActiveTopics((prev) =>
                                  prev.filter((t) => t !== topic)
                                )
                              }
                            }}
                          />
                          <Label htmlFor={`topic-${topic.replace(/\s+/g, "-")}`}>{topic}</Label>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="mt-4 h-[300px] w-full">
          {filteredChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredChartData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                {activeMetrics.technical && (
                  <Line
                    type="monotone"
                    dataKey="technical"
                    name="Technical"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                )}
                {activeMetrics.communication && (
                  <Line
                    type="monotone"
                    dataKey="communication"
                    name="Communication"
                    stroke="#10b981"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                )}
                {activeMetrics.problemSolving && (
                  <Line
                    type="monotone"
                    dataKey="problemSolving"
                    name="Problem Solving"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                )}
                {activeMetrics.confidence && (
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    name="Confidence"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                )}
                {activeMetrics.systemDesign && (
                  <Line
                    type="monotone"
                    dataKey="systemDesign"
                    name="System Design"
                    stroke="#ef4444"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-muted-foreground/20 bg-muted/10">
              <div className="flex flex-col items-center text-muted-foreground">
                <TrendingUp className="mb-2 size-8 opacity-50" />
                <p className="text-sm">Not enough data to show chart</p>
                <p className="mt-1 text-xs">
                  Complete more interviews to see your trend
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Recently Attempted Interviews */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">
            Recently Attempted Interviews
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentInterviews.length > 0 ? (
                recentInterviews.map((session: any) => (
                  <tr
                    key={session.sessionId}
                    className="bg-card transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 font-medium">{session.role}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {session.status === "completed" ? "Completed" : "Active"}
                    </td>
                    <td className="px-6 py-4">
                      {session.status === "completed" ? (
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            (session.overallScore || 0) >= 80
                              ? "bg-green-500/10 text-green-500 ring-green-500/20"
                              : (session.overallScore || 0) >= 70
                                ? "bg-orange-500/10 text-orange-500 ring-orange-500/20"
                                : "bg-red-500/10 text-red-500 ring-red-500/20"
                          }`}
                        >
                          {((session.overallScore || 0) / 10).toFixed(1)}/10
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {session.status === "completed" ? (
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to={`/post-interview?sessionId=${session.sessionId}`}
                          >
                            View Report <ChevronRight className="ml-1 size-3" />
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/interview/${session.sessionId}`}>
                            Continue <ChevronRight className="ml-1 size-3" />
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No interviews found. Start one today!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
