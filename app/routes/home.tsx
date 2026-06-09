import { Button } from "~/components/ui/button"
import { useAuth } from "~/contexts/auth-provider"
import { Link } from "react-router"
import {
  ArrowRight,
  Terminal,
  Mic,
  BrainCircuit,
  BarChart3,
  Play,
  Code,
  MessageSquare,
  Star,
  Sparkles,
} from "lucide-react"

export function meta() {
  return [
    { title: "Interview Royale - AI Mock Interviews" },
    {
      name: "description",
      content: "AI-powered mock interview platform for software engineers.",
    },
  ]
}

export default function Home() {
  const { user } = useAuth()
  const isLoggedIn = Boolean(user)

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight"
            >
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span>Interview Royale</span>
            </Link>
            <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
              <a
                href="#features"
                className="transition-colors hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="transition-colors hover:text-foreground"
              >
                How it Works
              </a>
              <a
                href="#interview-types"
                className="transition-colors hover:text-foreground"
              >
                Interview Types
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden text-sm font-medium hover:text-foreground/80 sm:block"
                >
                  Dashboard
                </Link>
                <Button asChild size="sm" className="rounded-full">
                  <Link to="/start-interview">
                    Start Interview <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden text-sm font-medium hover:text-foreground/80 sm:block"
                >
                  Log in
                </Link>
                <Button asChild size="sm" className="rounded-full">
                  <Link to="/login">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        {/* HERO SECTION */}
        <section className="container mx-auto px-4 pt-16 pb-24 text-center md:pt-24 md:pb-32">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Next-gen technical interview prep</span>
          </div>
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl">
            Master your technical interviews with{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              live AI
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Stop practicing with static question banks. Experience realistic,
            dynamic interviews that adapt to your answers with real-time
            feedback and long-term analytics.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-8 text-base"
            >
              <Link to={isLoggedIn ? "/start-interview" : "/login"}>
                {isLoggedIn ? "Start your first interview" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full px-8 text-base"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </section>

        {/* LIVE INTERVIEW PREVIEW */}
        <section className="container mx-auto px-4 py-12">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl">
            <div className="absolute top-0 right-0 left-0 flex h-12 items-center gap-2 border-b border-border/50 bg-muted/50 px-4">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto rounded-md border border-border/50 bg-background/50 px-2 py-1 font-mono text-xs text-muted-foreground">
                live-interview-session.tsx
              </div>
            </div>
            <div className="grid gap-8 p-6 pt-16 md:grid-cols-2">
              <div className="space-y-4 font-mono text-sm">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <BrainCircuit className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-xl rounded-tl-none border border-border/50 bg-muted p-4">
                    <p className="text-foreground">
                      Can you explain the difference between processes and
                      threads in an operating system?
                    </p>
                  </div>
                </div>
                <div className="flex flex-row-reverse gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                    <Terminal className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="rounded-xl rounded-tr-none border border-blue-500/20 bg-blue-500/10 p-4 text-right">
                    <p className="text-foreground">
                      A process is an executing program with its own memory
                      space, while threads are subsets of a process that share
                      the same memory space but can execute independently.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <BrainCircuit className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-xl rounded-tl-none border border-border/50 bg-muted p-4">
                    <p className="text-foreground">
                      Good. Since threads share memory, what potential issues
                      can arise, and how would you handle them in a
                      multithreaded environment?
                    </p>
                    <div className="mt-2 font-sans text-xs text-primary/70 italic">
                      Generating contextual follow-up...
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden flex-col justify-center space-y-6 border-l border-border/50 pl-8 md:flex">
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                    <Mic className="h-5 w-5 text-primary" />
                    Real-time interaction
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Answer via voice or text. The AI listens, understands, and
                    dynamically generates follow-up questions just like a human
                    interviewer.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                    <Code className="h-5 w-5 text-blue-500" />
                    Technical depth
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The AI is trained to probe deeper into your answers, testing
                    your fundamental understanding of complex engineering
                    concepts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="container mx-auto px-4 py-24">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">How it works</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Prepare for your next big role in three simple steps.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6">
              <div className="absolute -top-4 -right-2 text-6xl font-black text-muted/20">
                1
              </div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Upload your resume</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Our system parses your resume to extract your tech stack,
                experience level, and projects to tailor the interview to your
                specific background.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6">
              <div className="absolute -top-4 -right-2 text-6xl font-black text-muted/20">
                2
              </div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Conduct the interview</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Engage in a live, conversational interview focusing on data
                structures, system design, or domain-specific engineering
                concepts.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6">
              <div className="absolute -top-4 -right-2 text-6xl font-black text-muted/20">
                3
              </div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Get detailed analytics</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Receive an exhaustive breakdown of your technical accuracy,
                communication clarity, and areas for improvement on your
                dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* INTERVIEW TYPES */}
        <section
          id="interview-types"
          className="container mx-auto border-y border-border/50 bg-muted/30 px-4 py-24"
        >
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Tailored to your role</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Practice for the exact type of interview you are facing.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                title: "Frontend",
                desc: "React, DOM, CSS, Web Vitals",
                icon: <Code className="h-5 w-5" />,
              },
              {
                title: "Backend",
                desc: "APIs, Databases, Caching",
                icon: <Terminal className="h-5 w-5" />,
              },
              {
                title: "System Design",
                desc: "Scale, Microservices",
                icon: <BrainCircuit className="h-5 w-5" />,
              },
              {
                title: "DSA",
                desc: "Algorithms, Big O",
                icon: <BarChart3 className="h-5 w-5" />,
              },
            ].map((type, i) => (
              <div
                key={i}
                className="group cursor-pointer rounded-xl border border-border/50 bg-background p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-4 text-muted-foreground transition-colors group-hover:text-primary">
                  {type.icon}
                </div>
                <h4 className="mb-2 font-semibold">{type.title}</h4>
                <p className="text-xs text-muted-foreground">{type.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="container mx-auto px-4 py-24">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Trusted by engineers</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              See how Interview Royale has helped others land their dream roles.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "The system design follow-up questions were incredibly realistic. It pushed me to consider scaling issues I hadn't thought of.",
                author: "Sarah J.",
                role: "Senior Backend Engineer",
                company: "Tech Giant",
              },
              {
                quote:
                  "Unlike static leetcode practice, having an AI ask me 'why did you choose that data structure?' really prepared me for the actual onsite.",
                author: "David M.",
                role: "Frontend Developer",
                company: "Startup",
              },
              {
                quote:
                  "The post-interview analytics showed me I was rambling on behavioral questions. I tightened up my STAR method responses and got the offer.",
                author: "Alex K.",
                role: "Fullstack Engineer",
                company: "Fintech",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/50 bg-card p-6"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-foreground/80 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="text-sm font-semibold">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-primary/5 p-12 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to ace your next interview?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Join thousands of engineers who are practicing smarter, not just
              harder. Start your first mock interview today for free.
            </p>
            <Button asChild size="lg" className="h-12 rounded-full px-8">
              <Link to={isLoggedIn ? "/start-interview" : "/login"}>
                {isLoggedIn ? "Start Interview Now" : "Get Started Now"}{" "}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/50 bg-muted/20 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <Link
                to="/"
                className="mb-4 flex items-center gap-2 text-lg font-bold"
              >
                <BrainCircuit className="h-5 w-5 text-primary" />
                <span>Interview Royale</span>
              </Link>
              <p className="mb-4 text-xs text-muted-foreground">
                The next generation of AI-powered technical interview
                preparation for modern software engineers.
              </p>
              <div className="flex gap-4 text-muted-foreground">
                <a href="#" className="transition-colors hover:text-foreground">
                  Twitter
                </a>
                <a href="#" className="transition-colors hover:text-foreground">
                  GitHub
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-foreground"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-foreground"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-foreground"
                  >
                    Interview Types
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-foreground"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-foreground"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-foreground"
                  >
                    Engineering Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-foreground"
                  >
                    System Design Primer
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-foreground"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-foreground"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-foreground"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Interview Royale Inc. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
