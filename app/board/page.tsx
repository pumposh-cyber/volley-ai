"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Announcement } from "@/app/api/announcements/route"
import {
  Volleyball,
  MapPin,
  Clock,
  RefreshCw,
  Pin,
  PinOff,
  Trash2,
  Plus,
  X,
  Send,
  Trophy,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Wrench,
  LayoutDashboard,
} from "lucide-react"

// ─── TM2 types (mirrors the API response) ────────────────────────────────────
interface TM2Match {
  id: number
  friendlyLabel: string
  startTime: number
  endTime: number
  timezone: string
  court: { name: string; location: string }
  round: { name: string }
  status: "upcoming" | "in-progress" | "win" | "loss" | "work-team" | "done"
  isWorkTeam: boolean
  opponent: { name: string; state: string | null } | null
  result: { ourSetWins: number; theirSetWins: number; setScores: { us: number; them: number }[] } | null
}

interface TM2Data {
  team: { name: string; identifier: string; seed: number; division: string; eventName: string; eventDates: string }
  matches: TM2Match[]
  standings: { teamId: number; teamName: string; isOurTeam: boolean; wins: number; losses: number; setWins: number; setLosses: number; rank: number }[]
}

const ANNOUNCE_POLL = 15_000   // poll announcements every 15s
const SCHEDULE_POLL = 60_000   // refresh TM2 every 60s

type PostType = "info" | "alert" | "win" | "schedule"

const TYPE_CONFIG: Record<PostType, { label: string; icon: typeof Info; bg: string; text: string; border: string }> = {
  info:     { label: "Update",   icon: Info,         bg: "bg-primary/8",     text: "text-primary",     border: "border-primary/20" },
  alert:    { label: "Alert",    icon: AlertCircle,  bg: "bg-destructive/8", text: "text-destructive", border: "border-destructive/25" },
  win:      { label: "Win! 🏆",  icon: Trophy,       bg: "bg-accent/8",      text: "text-accent",      border: "border-accent/25" },
  schedule: { label: "Schedule", icon: Clock,        bg: "bg-chart-3/8",     text: "text-chart-3",     border: "border-chart-3/25" },
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BoardPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [tm2, setTm2] = useState<TM2Data | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  const [isCoach, setIsCoach] = useState(false)
  const [showCompose, setShowCompose] = useState(false)
  const [newText, setNewText] = useState("")
  const [newType, setNewType] = useState<PostType>("info")
  const [sending, setSending] = useState(false)
  const [tm2Loading, setTm2Loading] = useState(true)
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ── Fetch announcements ──────────────────────────────────────────────────
  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch("/api/announcements", { cache: "no-store" })
      if (res.ok) setAnnouncements(await res.json())
    } catch { /* silent */ }
  }, [])

  // ── Fetch TM2 schedule ───────────────────────────────────────────────────
  const fetchTM2 = useCallback(async () => {
    try {
      const res = await fetch("/api/tm2", { cache: "no-store" })
      if (res.ok) {
        setTm2(await res.json())
        setLastFetch(new Date())
      }
    } catch { /* silent */ }
    finally { setTm2Loading(false) }
  }, [])

  useEffect(() => {
    fetchAnnouncements()
    fetchTM2()
    const a = setInterval(fetchAnnouncements, ANNOUNCE_POLL)
    const t = setInterval(fetchTM2, SCHEDULE_POLL)
    return () => { clearInterval(a); clearInterval(t) }
  }, [fetchAnnouncements, fetchTM2])

  useEffect(() => {
    if (showCompose) textareaRef.current?.focus()
  }, [showCompose])

  // ── Post announcement ────────────────────────────────────────────────────
  const post = async () => {
    if (!newText.trim()) return
    setSending(true)
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText, type: newType, author: "Coach Tamara", pinned: false }),
      })
      if (res.ok) {
        setNewText("")
        setShowCompose(false)
        await fetchAnnouncements()
      }
    } finally { setSending(false) }
  }

  // ── Delete announcement ──────────────────────────────────────────────────
  const remove = async (id: string) => {
    await fetch(`/api/announcements?id=${id}`, { method: "DELETE" })
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
  }

  // ── Toggle pin ───────────────────────────────────────────────────────────
  const togglePin = async (id: string, pinned: boolean) => {
    await fetch(`/api/announcements?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !pinned }),
    })
    await fetchAnnouncements()
  }

  const pinned = announcements.filter((a) => a.pinned)
  const unpinned = announcements.filter((a) => !a.pinned)

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
              <Volleyball className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">UVAC 15 TS</h1>
              <p className="text-[10px] text-muted-foreground">Far Westerns Wk 2 · Apr 17-19</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCoach && (
              <Button
                size="sm"
                onClick={() => setShowCompose(true)}
                className="gap-1.5 bg-primary hover:bg-primary/90 h-8 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Post
              </Button>
            )}
            <button
              onClick={() => setIsCoach((v) => !v)}
              className={cn(
                "text-[10px] font-semibold px-2 py-1 rounded-md border transition-colors",
                isCoach
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {isCoach ? "Coach Mode" : "Switch to Coach"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4 pb-24">

        {/* ── Team strip ── */}
        {tm2 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-foreground">{tm2.team.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {tm2.team.division} · Seed #{tm2.team.seed} · {tm2.team.identifier}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Reno Sparks Convention Center</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="text-accent">
                    {tm2.matches.filter(m => m.status === "win").length}W
                  </span>
                  <span className="text-muted-foreground">–</span>
                  <span className="text-destructive">
                    {tm2.matches.filter(m => m.status === "loss").length}L
                  </span>
                </div>
                <button
                  onClick={fetchTM2}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1 hover:text-foreground"
                >
                  <RefreshCw className="w-3 h-3" />
                  {lastFetch ? `${Math.round((Date.now() - lastFetch.getTime()) / 1000)}s ago` : "…"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Pinned announcements ── */}
        {pinned.length > 0 && (
          <div className="space-y-2">
            {pinned.map((a) => (
              <AnnouncementCard key={a.id} a={a} isCoach={isCoach} onDelete={remove} onPin={togglePin} />
            ))}
          </div>
        )}

        {/* ── Live schedule ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Live Schedule</h2>
          </div>

          {tm2Loading ? (
            <ScheduleSkeleton />
          ) : tm2 ? (
            <div className="space-y-2">
              {tm2.matches.map((m) => (
                <ScheduleCard
                  key={m.id}
                  match={m}
                  expanded={expandedMatch === m.id}
                  onExpand={() => setExpandedMatch(expandedMatch === m.id ? null : m.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Could not load schedule — check connection
            </p>
          )}
        </div>

        {/* ── Pool standings ── */}
        {tm2 && tm2.standings.length > 0 && (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border">
              <Trophy className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Pool Standings</h2>
            </div>
            <div className="divide-y divide-border">
              {tm2.standings.map((s) => (
                <div key={s.teamId} className={cn(
                  "flex items-center justify-between px-4 py-3 text-sm",
                  s.isOurTeam && "bg-primary/5"
                )}>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-bold",
                      s.rank === 1 ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                    )}>{s.rank}</span>
                    <span className={cn("font-medium", s.isOurTeam ? "text-primary font-bold" : "text-foreground")}>
                      {s.isOurTeam ? "⚡ " : ""}{s.teamName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={cn(
                      "font-semibold",
                      s.wins > s.losses ? "text-accent" : s.wins < s.losses ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {s.wins}W–{s.losses}L
                    </span>
                    <span className="text-muted-foreground">{s.setWins}–{s.setLosses}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Recent announcements ── */}
        {unpinned.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Updates</h2>
            <div className="space-y-2">
              {unpinned.map((a) => (
                <AnnouncementCard key={a.id} a={a} isCoach={isCoach} onDelete={remove} onPin={togglePin} />
              ))}
            </div>
          </div>
        )}

        {announcements.length === 0 && !isCoach && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            No announcements yet — check back soon!
          </div>
        )}

        {/* ── Coach link ── */}
        <div className="text-center pt-2">
          <Link href="/game-day" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
            Coach dashboard →
          </Link>
        </div>
      </main>

      {/* ── Compose sheet ── */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-end bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl mx-auto bg-card rounded-t-2xl border border-border shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">Post an Update</h2>
              <button onClick={() => setShowCompose(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Type selector */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(Object.keys(TYPE_CONFIG) as PostType[]).map((t) => {
                const cfg = TYPE_CONFIG[t]
                return (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0 transition-all",
                      newType === t
                        ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                        : "border-border text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    <cfg.icon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </button>
                )
              })}
            </div>

            {/* Text input */}
            <textarea
              ref={textareaRef}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder={
                newType === "schedule" ? "Court change, time update, lineup…" :
                newType === "alert"    ? "Urgent — all families please note…" :
                newType === "win"      ? "Great win! Next match at…" :
                "Quick update for the team…"
              }
              rows={4}
              maxLength={500}
              className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{newText.length}/500</span>
              <Button
                onClick={post}
                disabled={!newText.trim() || sending}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
                {sending ? "Posting…" : "Post Update"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Announcement card ────────────────────────────────────────────────────────
function AnnouncementCard({
  a,
  isCoach,
  onDelete,
  onPin,
}: {
  a: Announcement
  isCoach: boolean
  onDelete: (id: string) => void
  onPin: (id: string, pinned: boolean) => void
}) {
  const cfg = TYPE_CONFIG[a.type as PostType] ?? TYPE_CONFIG.info
  const relTime = relativeTime(a.createdAt)

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all",
      cfg.bg, cfg.border,
      a.pinned && "shadow-sm"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 shrink-0", cfg.text)}>
          <cfg.icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {a.pinned && (
              <span className={cn("text-[10px] font-bold uppercase tracking-wide", cfg.text)}>
                📌 Pinned
              </span>
            )}
            <span className="text-xs text-muted-foreground">{a.author} · {relTime}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{a.text}</p>
        </div>
        {isCoach && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onPin(a.id, a.pinned)}
              className="p-1.5 rounded-lg hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
              title={a.pinned ? "Unpin" : "Pin to top"}
            >
              {a.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => onDelete(a.id)}
              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Schedule card ────────────────────────────────────────────────────────────
function ScheduleCard({
  match,
  expanded,
  onExpand,
}: {
  match: TM2Match
  expanded: boolean
  onExpand: () => void
}) {
  const startDate = new Date(match.startTime * 1000)
  const timeStr = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: match.timezone,
    hour12: true,
  })
  const dayStr = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: match.timezone,
  })

  const statusStyle = {
    upcoming:    { border: "border-border",        badge: "bg-muted/80 text-muted-foreground",   label: "Upcoming" },
    "in-progress": { border: "border-accent/50 shadow-accent/10 shadow-md", badge: "bg-accent text-accent-foreground animate-pulse", label: "LIVE" },
    win:         { border: "border-accent/25",     badge: "bg-accent/15 text-accent",            label: "WIN ✓" },
    loss:        { border: "border-destructive/25",badge: "bg-destructive/15 text-destructive",  label: "LOSS" },
    "work-team": { border: "border-chart-3/25",    badge: "bg-chart-3/15 text-chart-3",          label: "Work Team" },
    done:        { border: "border-border",        badge: "bg-muted/50 text-muted-foreground",   label: "Done" },
  }
  const s = statusStyle[match.status]

  return (
    <div className={cn("rounded-xl border-2 overflow-hidden bg-card", s.border)}>
      {match.status === "in-progress" && (
        <div className="flex items-center gap-2 bg-accent/10 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-xs font-bold text-accent uppercase tracking-wide">Match in progress</span>
        </div>
      )}

      <button onClick={onExpand} className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/20 transition-colors">
        <div className="flex flex-col items-center min-w-[52px]">
          <span className="text-sm font-bold text-foreground">{timeStr}</span>
          <span className="text-[10px] text-muted-foreground">{dayStr.split(",")[0]}</span>
        </div>
        <div className="w-px h-10 bg-border shrink-0" />
        <div className="flex-1 min-w-0">
          {match.isWorkTeam ? (
            <>
              <p className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-chart-3" /> Work Team Duty
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{match.court.name}</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-sm text-foreground truncate">
                vs {match.opponent?.name ?? "TBD"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {match.court.name} · {match.friendlyLabel ?? ""}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {match.result && (
            <span className={cn("text-sm font-bold", match.status === "win" ? "text-accent" : "text-destructive")}>
              {match.result.ourSetWins}–{match.result.theirSetWins}
            </span>
          )}
          <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", s.badge)}>{s.label}</span>
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 bg-muted/20 border-t border-border space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Time</p>
              <p className="font-medium text-foreground">{dayStr} · {timeStr}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Court</p>
              <p className="font-medium text-foreground">{match.court.name}</p>
            </div>
            {match.opponent && (
              <div className="col-span-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Opponent</p>
                <p className="font-medium text-foreground">{match.opponent.name}</p>
              </div>
            )}
          </div>
          {match.result && match.result.setScores.length > 0 && (
            <div className="flex gap-2">
              {match.result.setScores.map((sc, i) => (
                <div key={i} className="flex flex-col items-center px-3 py-2 rounded-lg bg-muted/50 min-w-[56px]">
                  <span className="text-[10px] text-muted-foreground mb-1">Set {i + 1}</span>
                  <span className={cn("font-bold text-sm", sc.us > sc.them ? "text-accent" : "text-destructive")}>
                    {sc.us}–{sc.them}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ScheduleSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-border p-4">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-10 bg-muted animate-pulse rounded" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return new Date(iso).toLocaleDateString()
}
