import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router"
import { Mic, MicOff, Send, Bot, Loader2, LogOut } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "~/components/ui/chat-container"
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "~/components/ui/prompt-input"
import { Message, MessageContent } from "~/components/ui/message"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { cn } from "~/lib/utils"

import { useAuth } from "~/contexts/auth-provider"
import { getUserProfile } from "~/lib/api/users"
import {
  ApiRateLimitError,
  authenticatedFetch,
  INTERVIEW_RATE_LIMIT_MESSAGE,
} from "~/lib/api/api-client"
import { getUserInitials } from "~/lib/user-display"

type ChatMessage = {
  id: string
  role: "assistant" | "user"
  content: string
}

function getInterviewErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiRateLimitError) {
    return INTERVIEW_RATE_LIMIT_MESSAGE
  }

  return fallback
}

export default function LiveInterviewPage() {
  const { user } = useAuth()
  const location = useLocation()
  const config = location.state as {
    interviewFocus?: string
    technology?: string
    difficulty?: string
  } | null

  const [interviewId, setInterviewId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isEndingSession, setIsEndingSession] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)

  const navigate = useNavigate()
  const userDisplayName = user?.displayName || user?.email || "User"

  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)
  const isStarted = useRef(false)

  useEffect(() => {
    if (!user) return

    if (user.photoURL) {
      setProfilePictureUrl(user.photoURL)
      return
    }

    let isMounted = true

    void getUserProfile()
      .then((profile) => {
        if (!isMounted) return
        setProfilePictureUrl(profile?.profilePictureUrl || profile?.photoURL || null)
      })
      .catch((error) => {
        console.debug("No profile photo available for interview avatar:", error)
      })

    return () => {
      isMounted = false
    }
  }, [user])

  // Start Interview API call
  useEffect(() => {
    if (isStarted.current || !user) return
    isStarted.current = true

    const startInterview = async () => {
      setIsTyping(true)
      try {
        const response = await authenticatedFetch("/interviews/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interviewFocus: config?.interviewFocus || "React",
            technology: config?.technology || "JavaScript",
            difficulty: config?.difficulty || "Mid-Level",
            userId: user.uid,
          }),
        })
        const data = await response.json()
        setInterviewId(data.sessionId)
        sessionStorage.setItem("interviewSessionId", data.sessionId)
        setMessages([
          {
            id: Date.now().toString(),
            role: "assistant",
            content:
              data.firstQuestion || "Welcome! Let's begin the interview.",
          },
        ])
      } catch (error) {
        console.error("Failed to start interview:", error)
        setMessages([
          {
            id: Date.now().toString(),
            role: "assistant",
            content: getInterviewErrorMessage(
              error,
              "Sorry, I couldn't connect to the server. Please try again."
            ),
          },
        ])
      } finally {
        setIsTyping(false)
      }
    }

    startInterview()
  }, [config, user])

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        let currentTranscript = ""

        recognitionRef.current.onstart = () => {
          currentTranscript = inputValue
        }

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }

          if (finalTranscript) {
            currentTranscript +=
              (currentTranscript ? " " : "") + finalTranscript
            setInputValue(currentTranscript)
          } else if (interimTranscript) {
            // For a smoother UX, we could show interim, but appending directly to final is safer.
            // We'll just update the value with the interim appended.
            setInputValue(
              currentTranscript +
                (currentTranscript ? " " : "") +
                interimTranscript
            )
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          setIsRecording(false)
        }

        recognitionRef.current.onend = () => {
          setIsRecording(false)
        }
      } else {
        console.warn("Speech Recognition API is not supported in this browser.")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop()
    } else {
      setInputValue((prev) => prev.trim()) // Clean up before starting
      try {
        recognitionRef.current?.start()
        setIsRecording(true)
      } catch (e) {
        console.error("Failed to start recording:", e)
      }
    }
  }

  const handleSubmit = async () => {
    if (!inputValue.trim() || isTyping || isCompleted || !interviewId) return

    // Stop recording if active
    if (isRecording) {
      recognitionRef.current?.stop()
    }

    const answer = inputValue.trim()
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: answer,
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await authenticatedFetch("/interviews/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId,
          answer,
        }),
      })
      const data = await response.json()

      if (data.status === "completed") {
        setIsCompleted(true)
      } else if (data.nextQuestion || data.message) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            data.nextQuestion ||
            data.message ||
            "Thank you for your answer. Let's move on.",
        }
        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (error) {
      console.error("Failed to send answer:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getInterviewErrorMessage(
          error,
          "Sorry, I encountered an error while processing your answer."
        ),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleEndSession = async () => {
    setIsSubmitting(true)

    // Stop recording if active
    if (isRecording) {
      recognitionRef.current?.stop()
    }

    const steps = [
      "Processing Interview...",
      "Generating Feedback...",
      "Preparing Report...",
    ]

    // Start fake loading progression
    const loadingInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev))
    }, 1500)

    let shouldNavigate = true

    try {
      const questionsAnswers = []
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].role === "assistant") {
          const question = messages[i].content
          const answer =
            i + 1 < messages.length && messages[i + 1].role === "user"
              ? messages[i + 1].content
              : ""
          if (question && answer) {
            questionsAnswers.push({ question, answer })
          }
        }
      }

      await authenticatedFetch(`/interview-sessions/${interviewId}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionsAnswers }),
      })
    } catch (error) {
      console.error("Failed to complete interview:", error)
      if (error instanceof ApiRateLimitError) {
        shouldNavigate = false
        setIsEndingSession(false)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: INTERVIEW_RATE_LIMIT_MESSAGE,
          },
        ])
      }
    } finally {
      clearInterval(loadingInterval)
      setIsSubmitting(false)
      if (shouldNavigate) {
        navigate(`/post-interview?sessionId=${interviewId}`)
      }
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-2 border-b bg-card px-6 py-4 shadow-sm">
        <Bot className="size-6 text-primary" />
        <h1 className="text-lg font-semibold tracking-tight">
          AI Interview Session
        </h1>
        {isRecording && (
          <div className="ml-auto flex animate-pulse items-center gap-2 text-sm font-medium text-destructive">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-destructive"></span>
            </span>
            Listening...
          </div>
        )}

        <div
          className={cn("flex items-center gap-2", !isRecording && "ml-auto")}
        >
          <Dialog open={isEndingSession} onOpenChange={setIsEndingSession}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <LogOut className="size-4" />
                End Interview
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>End Interview Session?</DialogTitle>
                <DialogDescription>
                  Your interview will be submitted and analyzed. You can review
                  the results once processing is complete.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 gap-2 sm:gap-0">
                <Button
                  variant="ghost"
                  onClick={() => setIsEndingSession(false)}
                  disabled={isSubmitting}
                >
                  Continue Interview
                </Button>
                <Button
                  onClick={handleEndSession}
                  disabled={isSubmitting}
                  className="w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Submit
                    </>
                  ) : (
                    "End & Submit"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Chat Area */}
      <div className="relative flex-1 overflow-hidden">
        <ChatContainerRoot className="absolute inset-0 px-4 py-6 sm:px-8">
          <ChatContainerContent className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <Message
                key={message.id}
                className={cn(
                  "max-w-[85%]",
                  message.role === "user"
                    ? "ml-auto flex-row-reverse"
                    : "mr-auto"
                )}
              >
                <div className="flex shrink-0 items-end">
                  {message.role === "assistant" ? (
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                      <Bot className="size-5" />
                    </div>
                  ) : (
                    <Avatar size="default" className="size-8">
                      {profilePictureUrl ? (
                        <AvatarImage
                          src={profilePictureUrl}
                          alt={userDisplayName}
                        />
                      ) : null}
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <MessageContent
                  markdown
                  className={cn(
                    message.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </MessageContent>
              </Message>
            ))}

            {isTyping && (
              <Message className="mr-auto">
                <div className="flex shrink-0 items-end">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                    <Bot className="size-5" />
                  </div>
                </div>
                <MessageContent className="flex items-center gap-2 rounded-bl-sm bg-muted text-foreground">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </MessageContent>
              </Message>
            )}

            {isCompleted && (
              <div className="mx-auto mt-4 rounded-md bg-muted p-4 text-center text-sm font-medium text-foreground">
                Interview Completed. Generating Feedback...
              </div>
            )}

            <ChatContainerScrollAnchor />
          </ChatContainerContent>
        </ChatContainerRoot>

        {/* Full-screen Loading Overlay when submitting */}
        {isSubmitting && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <Loader2 className="mb-4 size-8 animate-spin text-primary" />
            <h2 className="text-xl font-semibold tracking-tight">
              {
                [
                  "Processing Interview...",
                  "Generating Feedback...",
                  "Preparing Report...",
                ][loadingStep]
              }
            </h2>
          </div>
        )}
      </div>

      {/* Input Area */}
      {!isCompleted && (
        <div className="shrink-0 border-t bg-background p-4 sm:p-6">
          <div className="mx-auto max-w-3xl">
            <PromptInput
              value={inputValue}
              onValueChange={setInputValue}
              onSubmit={handleSubmit}
              disabled={isTyping}
              className="flex-col border-border pb-2 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50"
            >
              <PromptInputTextarea
                placeholder={
                  isRecording
                    ? "Listening..."
                    : "Type your response or use voice input..."
                }
                className="text-base"
              />
              <div className="flex items-center justify-between pt-2">
                <PromptInputActions>
                  <PromptInputAction
                    tooltip={isRecording ? "Stop Recording" : "Use Microphone"}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={toggleRecording}
                      className={cn(
                        "rounded-full transition-colors",
                        isRecording &&
                          "bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                      )}
                    >
                      {isRecording ? (
                        <MicOff className="size-5" />
                      ) : (
                        <Mic className="size-5" />
                      )}
                    </Button>
                  </PromptInputAction>
                </PromptInputActions>

                <PromptInputAction tooltip="Send Message">
                  <Button
                    type="button"
                    size="icon"
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || isTyping}
                    className="size-9 rounded-full shadow-sm"
                  >
                    <Send className="size-4" />
                  </Button>
                </PromptInputAction>
              </div>
            </PromptInput>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              Use your microphone or type your response to interact with the AI
              interviewer.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
