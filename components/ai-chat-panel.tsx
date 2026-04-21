"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  X,
  Send,
  Sparkles,
  MapPin,
  Calendar,
  TrendingUp,
  CheckSquare,
  Hotel,
  MessageSquare,
  User,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/contexts/app-context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface AIChatPanelProps {
  open: boolean
  onClose: () => void
}

const quickActions = [
  { icon: CheckSquare,  label: "Packing list",      prompt: "Give me the full packing checklist for NCVA Far Western this weekend" },
  { icon: Hotel,        label: "Hotel details",      prompt: "What are our hotel details for Far Western? Confirmation number, address, check-in time." },
  { icon: MapPin,       label: "Venue & parking",    prompt: "Where should we park at RSCC Reno and what's the report time?" },
  { icon: Calendar,     label: "Tournament prep",    prompt: "What do I still need to do to prepare for this weekend's tournament?" },
  { icon: TrendingUp,   label: "Season overview",    prompt: "Give me a quick overview of our team's season so far" },
  { icon: MessageSquare,label: "Parent announcement",prompt: "Draft a parent announcement for NCVA Far Western with key logistics" },
]

const WELCOME: Message = {
  id: "0",
  role: "assistant",
  content: "Hi Coach! I'm your VolleyAI assistant. NCVA Far Western is Apr 17-19 at RSCC Reno — hotel is booked at Extended Stay America (conf 5601396408), car pickup Thu 12 PM at SJC Alamo. Ask me anything about prep, logistics, or your teams.",
}

function renderMarkdown(text: string) {
  const parts: React.ReactNode[] = []
  const lines = text.split("\n")
  let key = 0
  for (const line of lines) {
    if (line.startsWith("- ") || line.startsWith("• ")) {
      const content = line.replace(/^[-•]\s/, "")
      parts.push(
        <li key={key++} className="ml-4 list-disc">
          {inlineMd(content)}
        </li>
      )
    } else if (line.trim() === "") {
      parts.push(<div key={key++} className="h-2" />)
    } else {
      parts.push(<p key={key++}>{inlineMd(line)}</p>)
    }
  }
  return <>{parts}</>
}

function inlineMd(text: string): React.ReactNode {
  const segments = text.split(/(\*\*[^*]+\*\*)/g)
  return segments.map((seg, i) =>
    seg.startsWith("**") && seg.endsWith("**")
      ? <strong key={i}>{seg.slice(2, -2)}</strong>
      : seg
  )
}

export function AIChatPanel({ open, onClose }: AIChatPanelProps) {
  const { activeTeam } = useApp()
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (content: string) => {
    const text = content.trim()
    if (!text || streaming) return

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text }
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "" }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput("")
    setStreaming(true)

    const history = messages.map((m) => ({ role: m.role, content: m.content }))
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          teamName: activeTeam?.shortName,
          teamDivision: activeTeam?.division,
        }),
        signal: abortRef.current.signal,
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error("No stream")

      let accumulated = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const snap = accumulated
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: snap } : m))
        )
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Sorry, I couldn't connect. Check that ANTHROPIC_API_KEY is set." }
              : m
          )
        )
      }
    } finally {
      setStreaming(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="flex h-[90vh] max-h-[700px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">VolleyAI Assistant</h2>
              <p className="text-xs text-muted-foreground">Tournament planning & prep</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMessages([WELCOME])}
              title="Clear chat"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "")}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  message.role === "assistant"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                )}
              >
                {message.role === "assistant" ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  message.role === "user"
                    ? "rounded-tr-none bg-primary text-primary-foreground"
                    : "rounded-tl-none bg-secondary text-secondary-foreground"
                )}
              >
                {message.content ? (
                  <div className="space-y-0.5">{renderMarkdown(message.content)}</div>
                ) : (
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="border-t border-border px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="flex-shrink-0 gap-1.5 text-xs"
                onClick={() => handleSend(action.prompt)}
                disabled={streaming}
              >
                <action.icon className="h-3 w-3" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend(input)
          }}
          className="border-t border-border p-4"
        >
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your tournament, travel, or team..."
              className="flex-1 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={streaming}
            />
            <Button
              type="submit"
              size="icon"
              className="h-12 w-12 rounded-xl"
              disabled={!input.trim() || streaming}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
