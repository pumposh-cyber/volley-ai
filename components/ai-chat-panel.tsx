"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIChatPanelProps {
  open: boolean
  onClose: () => void
}

const quickActions = [
  { icon: TrendingUp, label: "Season overview", prompt: "Give me an overview of all my teams' performance this season" },
  { icon: Calendar, label: "Schedule conflict", prompt: "Are there any scheduling conflicts for my teams this month?" },
  { icon: MessageSquare, label: "Draft announcement", prompt: "Help me draft a parent announcement for NCVA Far Western" },
  { icon: CheckSquare, label: "Tournament prep", prompt: "What's left to prepare for this weekend's tournament?" },
  { icon: Hotel, label: "Booking status", prompt: "Show me hotel booking status for all upcoming tournaments" },
  { icon: MapPin, label: "Travel logistics", prompt: "What travel logistics need attention this week?" },
]

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi Coach Andrew! I'm your VolleyAI assistant. I can see you have 3 tournaments coming up this month with 4 teams traveling. The NCVA Far Western is tomorrow - would you like me to review the prep status across all participating teams?",
    timestamp: new Date(),
  },
]

export function AIChatPanel({ open, onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "Give me an overview of all my teams' performance this season": 
          "**Season Overview - Urban VBC**\n\n**Overall Record:** 99-35 (74% win rate)\n\n**By Team:**\n- 18U Premier: 24-8 (75%) - Power League leaders\n- 16U Elite: 18-6 (75%) - Strong serving team\n- 15U Thunder: 22-10 (69%) - Improving defense\n- 14U Lightning: 15-5 (75%) - Best setter rotation\n- 13U Storm: 12-4 (75%) - Great ball control\n- 12U Wave: 8-2 (80%) - Our rising stars!\n\n**Top Areas to Address:**\n1. 15U serve receive (78% efficiency)\n2. 16U middle blocking\n3. Cross-team communication drills\n\nWant me to generate a practice plan?",
        "Are there any scheduling conflicts for my teams this month?":
          "I found 2 potential conflicts:\n\n**Conflict 1 - Apr 16-19:**\n- 18U Premier AND 15U Thunder at NCVA Far Western\n- You'll need to split coaching staff\n- Recommendation: Coach Nina with 15U, you with 18U\n\n**Conflict 2 - Apr 27:**\n- 13U Storm has Club Classic\n- 16U Elite practice scheduled same day\n- Recommendation: Move 16U practice to Apr 26\n\n**Clear Weekends:**\n- Apr 20-21: Only 16U competing\n- May 4: Only 12U competing\n\nWould you like me to adjust the schedules?",
        "Help me draft a parent announcement for NCVA Far Western":
          "Here's a draft announcement:\n\n---\n\n**NCVA Far Western - Final Reminders**\n\nHi Urban Families!\n\nWe're heading to Reno tomorrow! Quick reminders:\n\n**Logistics:**\n- Hotel check-in: 3:00 PM Thursday\n- Day 1 report time: 6:45 AM (7:00 AM wave)\n- Venue: Reno-Sparks Convention Center\n\n**Pack List:**\n- 2 full uniforms (required)\n- Court shoes + backup pair\n- Kneepads, water bottle\n\n**Weather Alert:**\n- Check Donner Pass conditions before departing\n- 4x4 recommended if snow forecast\n\nAll confirmation numbers are in the app. Text me or Coach Nina with questions!\n\nGo Urban!\n- Coach Andrew\n\n---\n\nSend to 18U & 15U parents?",
        "What's left to prepare for this weekend's tournament?":
          "**Tournament Prep Status:**\n\n**NCVA Far Western (Tomorrow!)**\n\n18U Premier - 68% ready\n- Hotel: Booked\n- Car Rental: Booked\n- Missing: 4 parent waivers, 2 medical forms\n\n15U Thunder - 72% ready\n- Hotel: Booked\n- Car Rental: Booked  \n- Missing: 3 parent waivers\n\n**Critical Items:**\n1. Collect outstanding waivers TODAY\n2. Confirm carpool assignments\n3. Send final parent announcement\n4. Check road conditions in morning\n\nWant me to send waiver reminders to parents?",
        "Show me hotel booking status for all upcoming tournaments":
          "**Hotel Status - All Teams**\n\n**NCVA Far Western (Apr 16-19, Reno)**\n- 18U: Booked - Conf #5601396408\n- 15U: Booked - Conf #5601396412\n\n**Power League #4 (Apr 20-21, San Jose)**\n- 16U: No hotel needed (local)\n\n**Regional Qualifier (Apr 23-25, Anaheim)**\n- 14U: NOT BOOKED\n- Recommend: Marriott Anaheim ($159/night)\n- Action needed by Apr 18 for team rate\n\n**Club Classic (Apr 27, Fresno)**\n- 13U: NOT BOOKED\n- Recommend: Day trip or Hampton Inn ($129/night)\n\nWant me to start booking requests?",
        "What travel logistics need attention this week?":
          "**Logistics Requiring Attention:**\n\n**Urgent (Today):**\n1. Car rental pickup - Tomorrow 12:00 PM\n2. Confirm 15U carpool drivers (2 families unassigned)\n3. Send parking instructions (Lot C, Gate 5-6)\n\n**This Week:**\n4. Book 14U hotel for Anaheim (Apr 23-25)\n5. Collect tournament fees - $1,480 outstanding\n6. Request team room block for Fresno\n\n**Carpool Status:**\n- 18U: 12/12 players assigned\n- 15U: 10/12 players assigned (need 2 more seats)\n\nI can send automated reminders to the 2 unassigned 15U families. Want me to do that?",
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[content] || "I can help you with tournament preparation, travel logistics, team communication, and performance tracking. What would you like to know?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
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
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                message.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              )}>
                {message.role === "assistant" ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  message.role === "user"
                    ? "rounded-tr-none bg-primary text-primary-foreground"
                    : "rounded-tl-none bg-secondary text-secondary-foreground"
                )}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-secondary px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            </div>
          )}
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
            />
            <Button type="submit" size="icon" className="h-12 w-12 rounded-xl" disabled={!input.trim() || isTyping}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
