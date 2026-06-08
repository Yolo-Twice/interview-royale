import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Clock, 
  Calendar, 
  Target, 
  BrainCircuit, 
  MessageSquare, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  ChevronRight,
  RefreshCw,
  BookOpen
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Progress } from "~/components/ui/progress"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "~/components/ui/accordion"
import { Skeleton } from "~/components/ui/skeleton"

// Type Definitions
type ScoreTag = "Excellent" | "Good" | "Average" | "Needs Improvement"

interface QuestionFeedback {
  id: string
  question: string
  score: number
  summary: string
  detailedFeedback: string
}

interface PracticeRecommendation {
  id: string
  topic: string
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime: string
}

interface InterviewReport {
  id: string
  title: string
  role: string
  difficulty: string
  date: string
  duration: string
  overallScore: number
  performanceLabel: ScoreTag
  aiSummary: string
  scores: {
    technical: number
    communication: number
    problemSolving: number
    confidence: number
    systemDesign: number
  }
  strengths: string[]
  weaknesses: string[]
  questions: QuestionFeedback[]
  recommendations: PracticeRecommendation[]
  transcript: Array<{ speaker: "AI" | "You"; line: string }>
}

// Mock Data
const MOCK_REPORT: InterviewReport = {
  id: "rep-12345",
  title: "Frontend Engineering Round",
  role: "Senior React Developer",
  difficulty: "Hard",
  date: new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
  duration: "45 mins",
  overallScore: 8.4,
  performanceLabel: "Good",
  aiSummary: "You demonstrated strong fundamentals in React and solid problem-solving skills. Your communication is clear, though you can improve on articulating deep architectural decisions like state management trade-offs.",
  scores: {
    technical: 8.5,
    communication: 8.0,
    problemSolving: 8.2,
    confidence: 8.8,
    systemDesign: 7.0,
  },
  strengths: [
    "Strong React fundamentals",
    "Good communication structure",
    "Clear problem-solving process"
  ],
  weaknesses: [
    "Improve System Design depth",
    "Explain trade-offs more clearly",
    "Reduce filler words"
  ],
  questions: [
    {
      id: "q1",
      question: "How would you optimize a large React application experiencing slow renders?",
      score: 9.0,
      summary: "Excellent answer covering useMemo, useCallback, and virtualized lists.",
      detailedFeedback: "You correctly identified common bottlenecks and suggested practical solutions. Discussing React DevTools profiling would have made this a perfect answer."
    },
    {
      id: "q2",
      question: "Design a state management solution for a collaborative editing feature.",
      score: 6.5,
      summary: "Missed key concepts around conflict resolution (e.g., CRDTs).",
      detailedFeedback: "While Redux/Zustand handles local state well, you didn't adequately address the real-time collaboration aspect. Consider learning about Operational Transformation or CRDTs."
    }
  ],
  recommendations: [
    {
      id: "rec1",
      topic: "React Performance Optimization",
      difficulty: "Medium",
      estimatedTime: "20 mins"
    },
    {
      id: "rec2",
      topic: "Real-time Architecture Patterns",
      difficulty: "Hard",
      estimatedTime: "45 mins"
    }
  ],
  transcript: [
    { speaker: "AI", line: "Welcome! Let's start with React performance. How would you optimize a large React application experiencing slow renders?" },
    { speaker: "You", line: "I'd start by looking at component re-renders using the React DevTools..." },
    { speaker: "AI", line: "Great. Now let's move to system design. Design a state management solution for a collaborative editing feature." },
    { speaker: "You", line: "I would use Redux to keep a global store of the document..." }
  ]
}

// Helper for score colors
function getScoreColor(score: number) {
  if (score >= 8) return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30"
  if (score >= 6) return "text-amber-600 bg-amber-100 dark:bg-amber-900/30"
  return "text-destructive bg-destructive/10"
}

function getPerformanceLabel(score: number): ScoreTag {
  if (score >= 80) return "Excellent"
  if (score >= 60) return "Good"
  if (score >= 40) return "Average"
  return "Needs Improvement"
}

export default function PostInterviewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [report, setReport] = useState<InterviewReport | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      const sessionId = searchParams.get("sessionId") || sessionStorage.getItem("interviewSessionId")
      if (!sessionId) {
        setReport(MOCK_REPORT)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/interview-sessions/${sessionId}`)
        const json = await response.json()
        
        if (json.success && json.data) {
          const data = json.data
          const formattedReport: InterviewReport = {
            id: data.sessionId,
            title: `${data.role} Interview`,
            role: data.role,
            difficulty: data.difficulty,
            date: new Date(data.createdAt || Date.now()).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
            duration: "Completed",
            overallScore: (data.overallScore || 0) / 10,
            performanceLabel: getPerformanceLabel(data.overallScore || 0),
            aiSummary: data.summary || "No summary available.",
            scores: {
              technical: data.scores?.technical ?? ((data.overallScore || 0) / 10),
              communication: data.scores?.communication ?? ((data.overallScore || 0) / 10),
              problemSolving: data.scores?.problemSolving ?? ((data.overallScore || 0) / 10),
              confidence: data.scores?.confidence ?? ((data.overallScore || 0) / 10),
              systemDesign: data.scores?.systemDesign ?? ((data.overallScore || 0) / 10),
            },
            strengths: data.strengths || [],
            weaknesses: data.weaknesses || [],
            questions: (data.questionsAnswers || []).map((qa: any, index: number) => ({
              id: `q${index}`,
              question: qa.question,
              score: (data.overallScore || 0) / 10,
              summary: "Answer submitted",
              detailedFeedback: qa.answer
            })),
            recommendations: [],
            transcript: (data.questionsAnswers || []).flatMap((qa: any) => [
              { speaker: "AI", line: qa.question },
              { speaker: "You", line: qa.answer }
            ])
          }
          setReport(formattedReport)
        } else {
          setReport(MOCK_REPORT)
        }
      } catch (error) {
        console.error("Failed to fetch report:", error)
        setReport(MOCK_REPORT)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [navigate, searchParams])

  if (isLoading) {
    return <ReportSkeleton />
  }

  if (!report) return null

  return (
    <div className="flex min-h-screen flex-col bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" disabled className="gap-2">
              <Download className="size-4" />
              Download Report
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-6 py-8 sm:px-8">
        
        {/* SECTION 1: Hero Summary */}
        <section className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm sm:flex-row sm:items-start sm:p-8">
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="font-normal">{report.role}</Badge>
                <span>•</span>
                <span className="flex items-center gap-1"><Target className="size-3" /> {report.difficulty}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar className="size-3" /> {report.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="size-3" /> {report.duration}</span>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight">{report.title}</h1>
            </div>
            <p className="max-w-2xl text-muted-foreground leading-relaxed">
              {report.aiSummary}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-muted/30 p-6 min-w-[160px]">
            <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
            <p className="mt-2 flex items-baseline gap-1 text-5xl font-bold tracking-tighter">
              {report.overallScore}<span className="text-2xl text-muted-foreground">/10</span>
            </p>
            <Badge className={`mt-3 border-none ${getScoreColor(report.overallScore)}`}>
              {report.performanceLabel}
            </Badge>
          </div>
        </section>

        {/* SECTION 2: Performance Breakdown */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight">Performance Breakdown</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <ScoreCard icon={BrainCircuit} title="Technical" score={report.scores.technical} />
            <ScoreCard icon={MessageSquare} title="Communication" score={report.scores.communication} />
            <ScoreCard icon={Lightbulb} title="Problem Solving" score={report.scores.problemSolving} />
            <ScoreCard icon={Sparkles} title="Confidence" score={report.scores.confidence} />
            <ScoreCard icon={Target} title="System Design" score={report.scores.systemDesign} />
          </div>
        </section>

        <div className="grid gap-8 md:grid-cols-2 pt-4">
          {/* SECTION 3: Strengths */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-emerald-600">
              <CheckCircle2 className="size-5" />
              Key Strengths
            </h3>
            <ul className="mt-4 space-y-3">
              {report.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg bg-emerald-50/50 p-3 text-sm dark:bg-emerald-900/10">
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-600 shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SECTION 4: Areas For Improvement */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-amber-600">
              <ShieldAlert className="size-5" />
              Areas For Improvement
            </h3>
            <ul className="mt-4 space-y-3">
              {report.weaknesses.map((weakness, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg bg-amber-50/50 p-3 text-sm dark:bg-amber-900/10">
                  <XCircle className="mt-0.5 size-4 text-amber-600 shrink-0" />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* SECTION 5: Question Breakdown */}
        <section className="pt-4">
          <h2 className="text-xl font-semibold tracking-tight">Question Breakdown</h2>
          <div className="mt-6">
            <Accordion type="multiple" className="border-none rounded-none shadow-none w-full flex flex-col">
              {report.questions.map((q) => (
                <AccordionItem 
                  key={q.id} 
                  value={q.id} 
                  className="border-b border-border/40 last:border-b-0 bg-transparent data-open:bg-transparent px-0 py-1 shadow-none"
                >
                  <AccordionTrigger className="px-0 py-4 hover:no-underline border-none">
                    <div className="flex flex-1 items-center justify-between pr-4 text-left">
                      <p className="font-medium text-base text-foreground/90 pr-4">{q.question}</p>
                      <Badge variant="outline" className={`shrink-0 ${getScoreColor(q.score)}`}>
                        {q.score.toFixed(1)}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-6 pt-0">
                    <div className="space-y-3 text-sm text-muted-foreground max-w-3xl">
                      <p className="font-medium text-foreground">{q.summary}</p>
                      <p className="leading-relaxed">{q.detailedFeedback}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* SECTION 6: Recommended Practice */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight">Recommended Practice</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {report.recommendations.map((rec) => (
              <div key={rec.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-5 transition hover:bg-muted/50">
                <div>
                  <h4 className="font-medium">{rec.topic}</h4>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="font-normal">{rec.difficulty}</Badge>
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {rec.estimatedTime}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" asChild>
                  <a href="/start-interview" className="gap-1">Start <ChevronRight className="size-4" /></a>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: Transcript Preview */}
        <section className="pt-4">
          <Accordion type="single" collapsible className="border-none rounded-none shadow-none w-full">
            <AccordionItem value="transcript" className="border-none bg-transparent data-open:bg-transparent px-0 shadow-none">
              <AccordionTrigger className="px-0 hover:no-underline py-2 border-none">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  <h2 className="text-xl font-semibold tracking-tight">Interview Transcript</h2>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pt-6 pb-2">
                <div className="space-y-6 pl-4 border-l border-border/50">
                  {report.transcript.map((msg, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${
                          msg.speaker === 'AI' ? 'text-primary' : 'text-foreground/80'
                        }`}>
                          {msg.speaker}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-sm max-w-3xl">
                        {msg.line}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* SECTION 8: Action Area */}
        <section className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button size="lg" className="gap-2 px-8" asChild>
            <a href="/start-interview">
              <RefreshCw className="size-4" />
              Retake Interview
            </a>
          </Button>
          <Button size="lg" variant="outline" className="gap-2 px-8" asChild>
            <a href="/dashboard">
              Back to Dashboard
            </a>
          </Button>
        </section>

      </main>
    </div>
  )
}

function ScoreCard({ icon: Icon, title, score }: { icon: any, title: string, score: number }) {
  const percentage = (score / 10) * 100
  
  return (
    <div className="rounded-xl bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <Icon className="size-4" />
        <span className="text-xs font-medium">{title}</span>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-2xl font-bold tracking-tight">{score.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground mb-1">/ 10</span>
      </div>
      <Progress value={percentage} className="h-1.5" />
    </div>
  )
}

function ReportSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-12">
      <header className="sticky top-0 z-10 border-b bg-card px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-6 py-8 sm:px-8">
        <div className="h-48 rounded-2xl bg-card border p-6 shadow-sm">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </main>
    </div>
  )
}
