import { Link } from "react-router"
import { CircleHelp } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import type { Route } from "./+types/faq"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FAQs | Interview Royale" },
    { name: "description", content: "Frequently Asked Questions about Interview Royale" },
  ]
}

const faqs = [
  {
    question: "What is Interview Royale?",
    answer:
      "Interview Royale is your ultimate platform to practice, conduct, and review interviews to help you land your dream job or find the perfect candidate.",
    value: "item-1",
  },
  {
    question: "How do I start a mock interview?",
    answer:
      "Navigate to the 'Start Interview' section from the sidebar, select your preferred settings (role, difficulty, and focus area), and begin your session instantly.",
    value: "item-2",
  },
  {
    question: "Can I review my past interviews?",
    answer:
      "Yes! All your completed sessions are saved. You can access recordings, transcripts, and detailed performance summaries under the 'Interview History' tab in the sidebar.",
    value: "item-3",
  },
  {
    question: "I found a bug, how do I report it?",
    answer:
      "You can report any issues by clicking the 'Report a Bug' link in the sidebar under the Tools section, where you can submit details and optional screenshots.",
    value: "item-4",
  },
]

export default function FAQ() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 p-8 pt-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center space-x-2">
        <CircleHelp className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Find answers to common questions about Interview Royale's features and settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>FAQ Guide</CardTitle>
            <CardDescription>
              Quickly get up to speed with mock interviews, session history, and reporting issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.value} value={faq.value}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Support CTA */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div>
              <h3 className="font-semibold text-foreground">Still have questions?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Can't find the answer you're looking for? Let our support team help you.
              </p>
            </div>
            <Button asChild shrink-0="true">
              <Link to="/dashboard/report-bug">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
