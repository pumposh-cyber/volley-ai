"use client"

import { useState, useRef } from "react"
import { MessageSquarePlus, X, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  { value: "bug", label: "Bug / Something broken" },
  { value: "feature", label: "Feature request" },
  { value: "general", label: "General feedback" },
]

type Status = "idle" | "loading" | "success" | "error"

export function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState("general")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleOpen() {
    setOpen(true)
    setStatus("idle")
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  function handleClose() {
    if (status === "loading") return
    setOpen(false)
    setMessage("")
    setCategory("general")
    setStatus("idle")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim() || status === "loading") return
    setStatus("loading")
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          message,
          page: window.location.pathname,
        }),
      })
      if (!res.ok) throw new Error("failed")
      setStatus("success")
      setMessage("")
      setTimeout(handleClose, 1800)
    } catch {
      setStatus("error")
    }
  }

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={handleOpen}
        aria-label="Send feedback"
        className={cn(
          "fixed bottom-20 right-4 z-50 flex items-center gap-1.5",
          "bg-card border border-border shadow-lg rounded-full px-3 py-2",
          "text-xs font-medium text-muted-foreground hover:text-foreground",
          "hover:shadow-xl transition-all active:scale-95",
          open && "opacity-0 pointer-events-none"
        )}
      >
        <MessageSquarePlus className="w-3.5 h-3.5" />
        Feedback
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      {/* Sheet / bottom drawer on mobile */}
      <div
        className={cn(
          "fixed z-50 bottom-0 left-0 right-0 bg-card rounded-t-2xl border-t border-border shadow-2xl",
          "transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-full pointer-events-none"
        )}
      >
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Handle + header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Send Feedback</h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                  category === c.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Message */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind? Be as specific as you like…"
            rows={4}
            maxLength={2000}
            disabled={status === "loading"}
            className={cn(
              "w-full resize-none rounded-xl border border-border bg-muted/30 px-3 py-2.5",
              "text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "disabled:opacity-50"
            )}
          />

          {/* Status messages */}
          {status === "success" && (
            <p className="text-xs text-accent font-medium text-center">
              Thanks! Logged as a GitHub issue.
            </p>
          )}
          {status === "error" && (
            <p className="text-xs text-destructive font-medium text-center">
              Something went wrong — try again.
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!message.trim() || status === "loading"}
            className={cn(
              "flex items-center justify-center gap-2 w-full py-3 rounded-xl",
              "bg-primary text-primary-foreground text-sm font-semibold",
              "hover:bg-primary/90 active:scale-[0.98] transition-all",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Submit
          </button>
        </form>
      </div>
    </>
  )
}
