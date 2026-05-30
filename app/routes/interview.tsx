import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router"
import { Mic, MicOff, Send, Bot, User, Loader2 } from "lucide-react"

import { Button } from "~/components/ui/button"
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
import { Message, MessageAvatar, MessageContent } from "~/components/ui/message"
import { cn } from "~/lib/utils"

type ChatMessage = {
  id: string
  role: "user" | "ai"
  text: string
}

export default function LiveInterviewPage() {
  const location = useLocation()
  const config = location.state as { role?: string; focus?: string; difficulty?: string } | null

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      text: config
        ? `Hello! I am your AI interviewer. We'll be focusing on a ${config.difficulty} ${config.role} position, covering ${config.focus}. Let's get started. Could you tell me a little bit about yourself and your recent experience?`
        : "Hello! I am your AI interviewer. Let's get started. Could you tell me a little bit about yourself and your recent experience?",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<any>(null)

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
    if (!inputValue.trim() || isProcessing) return

    // Stop recording if active
    if (isRecording) {
      recognitionRef.current?.stop()
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: inputValue.trim(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsProcessing(true)

    // TODO: Integrate backend AI response here.
    // For now, simulate a mock response delay.
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "That sounds great! Can you elaborate on a specific challenge you faced during your last project and how you overcame it?",
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsProcessing(false)
    }, 2000)
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
                  {message.role === "ai" ? (
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                      <Bot className="size-5" />
                    </div>
                  ) : (
                    <div className="flex size-8 items-center justify-center rounded-full border bg-muted text-muted-foreground shadow-sm">
                      <User className="size-5" />
                    </div>
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
                  {message.text}
                </MessageContent>
              </Message>
            ))}

            {isProcessing && (
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

            <ChatContainerScrollAnchor />
          </ChatContainerContent>
        </ChatContainerRoot>
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t bg-background p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <PromptInput
            value={inputValue}
            onValueChange={setInputValue}
            onSubmit={handleSubmit}
            disabled={isProcessing}
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
                  disabled={!inputValue.trim() || isProcessing}
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
    </div>
  )
}
