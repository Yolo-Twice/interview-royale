import {
  Activity,
  ArrowRight,
  Award,
  ChevronRight,
  Clock,
  MessageSquare,
  Play,
  TrendingUp,
  Zap,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { useAuth } from "~/contexts/auth-provider"
import { getPersonalizedGreeting } from "~/lib/user-display"

export default function Dashboard() {
  const { user } = useAuth()

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
              Frontend Engineer
            </span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            You are on a 3-day streak! Keep up the momentum to improve your
            React skills.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="w-full sm:w-auto">
            Continue Last Session
          </Button>
          <Button className="w-full sm:w-auto">
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
            8.4
            <span className="text-sm font-normal text-muted-foreground">
              /10
            </span>
          </p>
          <p className="mt-1 flex items-center text-xs text-green-500">
            <TrendingUp className="mr-1 size-3" /> +0.2 from last week
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <h3 className="text-sm font-medium">Interviews</h3>
          </div>
          <p className="mt-4 text-3xl font-bold">12</p>
          <p className="mt-1 text-xs text-muted-foreground">
            4 completed this week
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-primary" />
            <h3 className="text-sm font-medium">Streak</h3>
          </div>
          <p className="mt-4 text-3xl font-bold">
            3
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              days
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Next milestone: 5 days
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-primary" />
            <h3 className="text-sm font-medium">Communication</h3>
          </div>
          <p className="mt-4 text-3xl font-bold">Excellent</p>
          <p className="mt-1 text-xs text-muted-foreground">Top 15% of peers</p>
        </div>
      </div>

      {/* 3. Continue Practice (Large Primary Card) */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Recommended Practice
            </div>
            <h2 className="text-2xl font-bold">
              React Performance Optimization
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Zap className="size-3" /> Difficulty: Medium
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" /> ~20 mins
              </span>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium">Focus Areas:</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md border bg-background px-2 py-1 text-xs shadow-sm">
                  Memoization
                </span>
                <span className="rounded-md border bg-background px-2 py-1 text-xs shadow-sm">
                  Rendering
                </span>
                <span className="rounded-md border bg-background px-2 py-1 text-xs shadow-sm">
                  useCallback
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              <span className="font-medium text-foreground">AI Insight: </span>
              Based on your last interview, you struggled slightly with
              explaining when to use useMemo vs useCallback. This session
              focuses heavily on those concepts.
            </p>
          </div>
          <div className="mt-4 shrink-0 md:mt-0">
            <Button size="lg" className="w-full md:w-auto">
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
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">React Fundamentals</span>
                <span className="text-green-500">92%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-green-500" style={{ width: "92%" }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">Async JavaScript</span>
                <span className="text-green-500">88%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-green-500" style={{ width: "88%" }} />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">API Design</span>
                <span className="text-green-500">85%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-green-500" style={{ width: "85%" }} />
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Praise:</span> You
            consistently demonstrate strong architectural thinking and clean
            code practices.
          </p>
        </div>

        {/* Weak Areas */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Weak Areas</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">SQL Joins</span>
                <span className="text-orange-500">45%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: "45%" }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">System Scalability</span>
                <span className="text-orange-500">52%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: "52%" }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">React Reconciliation</span>
                <span className="text-orange-500">60%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: "60%" }}
                />
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Guidance:</span>{" "}
            Review database normalization and complex query structures before
            your next full-stack interview.
          </p>
        </div>
      </div>

      {/* 5. Performance Trend Chart */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Performance Trend</h3>
        <div className="flex h-[250px] w-full items-center justify-center rounded-md border border-dashed border-muted-foreground/20 bg-muted/10">
          <div className="flex flex-col items-center text-muted-foreground">
            <TrendingUp className="mb-2 size-8 opacity-50" />
            <p className="text-sm">Chart visualization goes here</p>
            <p className="text-xs">
              Technical vs Communication scores over time
            </p>
          </div>
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
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Score</th>
                <th className="px-6 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="bg-card transition-colors hover:bg-muted/50">
                <td className="px-6 py-4 font-medium">Frontend Engineer</td>
                <td className="px-6 py-4 text-muted-foreground">Today</td>
                <td className="px-6 py-4 text-muted-foreground">27 min</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-green-500/20 ring-inset">
                    8.2/10
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm">
                    View Report <ChevronRight className="ml-1 size-3" />
                  </Button>
                </td>
              </tr>
              <tr className="bg-card transition-colors hover:bg-muted/50">
                <td className="px-6 py-4 font-medium">Full Stack Developer</td>
                <td className="px-6 py-4 text-muted-foreground">2 days ago</td>
                <td className="px-6 py-4 text-muted-foreground">45 min</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-green-500/20 ring-inset">
                    7.8/10
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm">
                    View Report <ChevronRight className="ml-1 size-3" />
                  </Button>
                </td>
              </tr>
              <tr className="bg-card transition-colors hover:bg-muted/50">
                <td className="px-6 py-4 font-medium">
                  System Design (Backend)
                </td>
                <td className="px-6 py-4 text-muted-foreground">Last week</td>
                <td className="px-6 py-4 text-muted-foreground">30 min</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-500 ring-1 ring-orange-500/20 ring-inset">
                    6.5/10
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm">
                    View Report <ChevronRight className="ml-1 size-3" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
