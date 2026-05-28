import { Button } from "~/components/ui/button"
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
  Sparkles
} from "lucide-react"

export function meta() {
  return [
    { title: "Interview Royale - AI Mock Interviews" },
    { name: "description", content: "AI-powered mock interview platform for software engineers." },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span>Interview Royale</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
              <a href="#interview-types" className="hover:text-foreground transition-colors">Interview Types</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hidden sm:block text-sm font-medium hover:text-foreground/80">
              Log in
            </Link>
            <Button asChild size="sm" className="rounded-full">
              <Link to="/start-interview">
                Start Interview <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        {/* HERO SECTION */}
        <section className="container mx-auto px-4 pt-12 pb-24 md:pt-24 md:pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Next-gen technical interview prep</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto mb-6 leading-tight">
            Master your technical interviews with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">live AI</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop practicing with static question banks. Experience realistic, dynamic interviews that adapt to your answers with real-time feedback and long-term analytics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full h-12 px-8 text-base">
              <Link to="/start-interview">
                Start your first interview
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full h-12 px-8 text-base">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </section>

        {/* LIVE INTERVIEW PREVIEW */}
        <section className="container mx-auto px-4 py-12">
          <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden shadow-2xl mx-auto max-w-5xl">
            <div className="absolute top-0 left-0 right-0 h-12 bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto bg-background/50 text-muted-foreground text-xs px-2 py-1 rounded-md font-mono border border-border/50">
                live-interview-session.tsx
              </div>
            </div>
            <div className="p-6 pt-16 grid md:grid-cols-2 gap-8">
              <div className="space-y-4 font-mono text-sm">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <BrainCircuit className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-4 rounded-xl rounded-tl-none border border-border/50">
                    <p className="text-foreground">Can you explain the difference between processes and threads in an operating system?</p>
                  </div>
                </div>
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Terminal className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-xl rounded-tr-none border border-blue-500/20 text-right">
                    <p className="text-foreground">A process is an executing program with its own memory space, while threads are subsets of a process that share the same memory space but can execute independently.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <BrainCircuit className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-4 rounded-xl rounded-tl-none border border-border/50">
                    <p className="text-foreground">Good. Since threads share memory, what potential issues can arise, and how would you handle them in a multithreaded environment?</p>
                    <div className="mt-2 text-xs text-primary/70 font-sans italic">Generating contextual follow-up...</div>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex flex-col justify-center border-l border-border/50 pl-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Mic className="h-5 w-5 text-primary" />
                    Real-time interaction
                  </h3>
                  <p className="text-sm text-muted-foreground">Answer via voice or text. The AI listens, understands, and dynamically generates follow-up questions just like a human interviewer.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-500" />
                    Technical depth
                  </h3>
                  <p className="text-sm text-muted-foreground">The AI is trained to probe deeper into your answers, testing your fundamental understanding of complex engineering concepts.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Prepare for your next big role in three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border/50 rounded-2xl p-6 relative overflow-hidden">
              <div className="text-6xl font-black text-muted/20 absolute -top-4 -right-2">1</div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Upload your resume</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our system parses your resume to extract your tech stack, experience level, and projects to tailor the interview to your specific background.
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-6 relative overflow-hidden">
              <div className="text-6xl font-black text-muted/20 absolute -top-4 -right-2">2</div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Conduct the interview</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Engage in a live, conversational interview focusing on data structures, system design, or domain-specific engineering concepts.
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-6 relative overflow-hidden">
              <div className="text-6xl font-black text-muted/20 absolute -top-4 -right-2">3</div>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Get detailed analytics</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Receive an exhaustive breakdown of your technical accuracy, communication clarity, and areas for improvement on your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* INTERVIEW TYPES */}
        <section id="interview-types" className="container mx-auto px-4 py-24 bg-muted/30 border-y border-border/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tailored to your role</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Practice for the exact type of interview you are facing.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { title: "Frontend", desc: "React, DOM, CSS, Web Vitals", icon: <Code className="h-5 w-5" /> },
              { title: "Backend", desc: "APIs, Databases, Caching", icon: <Terminal className="h-5 w-5" /> },
              { title: "System Design", desc: "Scale, Microservices", icon: <BrainCircuit className="h-5 w-5" /> },
              { title: "DSA", desc: "Algorithms, Big O", icon: <BarChart3 className="h-5 w-5" /> },
            ].map((type, i) => (
              <div key={i} className="bg-background border border-border/50 rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="text-muted-foreground group-hover:text-primary transition-colors mb-4">
                  {type.icon}
                </div>
                <h4 className="font-semibold mb-1">{type.title}</h4>
                <p className="text-xs text-muted-foreground">{type.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by engineers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">See how Interview Royale has helped others land their dream roles.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                quote: "The system design follow-up questions were incredibly realistic. It pushed me to consider scaling issues I hadn't thought of.",
                author: "Sarah J.",
                role: "Senior Backend Engineer",
                company: "Tech Giant"
              },
              {
                quote: "Unlike static leetcode practice, having an AI ask me 'why did you choose that data structure?' really prepared me for the actual onsite.",
                author: "David M.",
                role: "Frontend Developer",
                company: "Startup"
              },
              {
                quote: "The post-interview analytics showed me I was rambling on behavioral questions. I tightened up my STAR method responses and got the offer.",
                author: "Alex K.",
                role: "Fullstack Engineer",
                company: "Fintech"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-primary text-primary" />)}
                </div>
                <p className="text-sm italic mb-6 text-foreground/80 leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-sm">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-12">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to ace your next interview?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of engineers who are practicing smarter, not just harder. Start your first mock interview today for free.
            </p>
            <Button asChild size="lg" className="rounded-full h-12 px-8">
              <Link to="/start-interview">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/50 bg-muted/20 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-5xl mx-auto">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-4">
                <BrainCircuit className="h-5 w-5 text-primary" />
                <span>Interview Royale</span>
              </Link>
              <p className="text-xs text-muted-foreground mb-4">
                The next generation of AI-powered technical interview preparation for modern software engineers.
              </p>
              <div className="flex gap-4 text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
                <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Interview Types</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Engineering Guides</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">System Design Primer</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground border-t border-border/50 pt-8">
            &copy; {new Date().getFullYear()} Interview Royale Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
