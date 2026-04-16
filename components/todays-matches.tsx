"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MapPin, Clock, ChevronRight, Play, CheckCircle2, Circle } from "lucide-react"

interface Match {
  id: string
  time: string
  court: string
  pool: string
  opponent: string
  result?: { us: number; them: number; sets: string }
  status: "upcoming" | "in-progress" | "done" | "win" | "loss"
}

const MATCHES: Match[] = [
  {
    id: "1",
    time: "8:00 AM",
    court: "Court 3",
    pool: "Pool A",
    opponent: "Bay Volleyball Club",
    result: { us: 2, them: 0, sets: "25-18, 25-21" },
    status: "win",
  },
  {
    id: "2",
    time: "10:30 AM",
    court: "Court 7",
    pool: "Pool A",
    opponent: "Gold Rush VBC",
    status: "in-progress",
  },
  {
    id: "3",
    time: "1:15 PM",
    court: "TBD",
    pool: "Pool A",
    opponent: "Sierra Volleyball",
    status: "upcoming",
  },
  {
    id: "4",
    time: "3:30 PM",
    court: "TBD",
    pool: "Gold Bracket",
    opponent: "TBD (Bracket Play)",
    status: "upcoming",
  },
]

interface TodaysMatchesProps {
  onStartMatch?: (matchId: string) => void
}

export function TodaysMatches({ onStartMatch }: TodaysMatchesProps) {
  const [expandedId, setExpandedId] = useState<string | null>("2")

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Today&apos;s Schedule</p>
          <p className="text-lg font-bold text-foreground">NCVA Far Western · Apr 16</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <span className="text-accent">1W</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">0L</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">3 remaining</span>
        </div>
      </div>

      {MATCHES.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          expanded={expandedId === match.id}
          onExpand={() => setExpandedId(expandedId === match.id ? null : match.id)}
          onStartMatch={onStartMatch}
        />
      ))}

      {/* Pool standings preview */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 mt-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Pool A Standings</p>
        <div className="space-y-2">
          {[
            { team: "Urban 18U Premier", w: 1, l: 0, pts: "2-0 sets", highlight: true },
            { team: "Gold Rush VBC", w: 1, l: 0, pts: "2-1 sets", highlight: false },
            { team: "Sierra Volleyball", w: 0, l: 1, pts: "0-2 sets", highlight: false },
            { team: "Bay Volleyball Club", w: 0, l: 1, pts: "0-2 sets", highlight: false },
          ].map((row, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between text-sm rounded-lg px-3 py-1.5",
                row.highlight && "bg-primary/10 font-semibold"
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn("text-xs w-4 text-center", row.highlight ? "text-primary font-bold" : "text-muted-foreground")}>
                  {i + 1}
                </span>
                <span className={row.highlight ? "text-primary" : "text-foreground"}>{row.team}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className={row.highlight ? "text-primary" : "text-muted-foreground"}>{row.w}W-{row.l}L</span>
                <span className="text-muted-foreground">{row.pts}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MatchCard({
  match,
  expanded,
  onExpand,
  onStartMatch,
}: {
  match: Match
  expanded: boolean
  onExpand: () => void
  onStartMatch?: (id: string) => void
}) {
  const statusConfig = {
    upcoming: { label: "Upcoming", color: "bg-muted text-muted-foreground", icon: Circle },
    "in-progress": { label: "LIVE", color: "bg-accent text-accent-foreground animate-pulse", icon: Play },
    done: { label: "Done", color: "bg-muted text-muted-foreground", icon: CheckCircle2 },
    win: { label: "WIN", color: "bg-accent/15 text-accent", icon: CheckCircle2 },
    loss: { label: "LOSS", color: "bg-destructive/15 text-destructive", icon: CheckCircle2 },
  }
  const cfg = statusConfig[match.status]

  return (
    <div
      className={cn(
        "rounded-xl border-2 overflow-hidden transition-all",
        match.status === "in-progress" && "border-accent/50 shadow-lg shadow-accent/10",
        match.status === "win" && "border-accent/30",
        match.status === "upcoming" && "border-border",
        match.status === "loss" && "border-destructive/30"
      )}
    >
      <button
        onClick={onExpand}
        className="w-full flex items-center gap-3 p-4 bg-card hover:bg-muted/30 transition-colors text-left"
      >
        {/* Time */}
        <div className="flex flex-col items-center min-w-[52px]">
          <span className="text-sm font-bold text-foreground">{match.time.split(" ")[0]}</span>
          <span className="text-[10px] text-muted-foreground">{match.time.split(" ")[1]}</span>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-border" />

        {/* Match info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">vs {match.opponent}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {match.court}
            </span>
            <span className="text-xs text-muted-foreground">{match.pool}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 shrink-0">
          {match.status === "win" && match.result && (
            <span className="text-sm font-bold text-accent">{match.result.us}-{match.result.them}</span>
          )}
          <Badge className={cn("text-xs font-bold border-0", cfg.color)}>
            {cfg.label}
          </Badge>
          <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", expanded && "rotate-90")} />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 bg-muted/20 border-t border-border space-y-3">
          {match.result && (
            <div className="pt-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">Set scores</p>
              <p className="text-sm font-semibold text-foreground">{match.result.sets}</p>
            </div>
          )}

          {match.status === "in-progress" && (
            <div className="pt-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                <p className="text-sm font-semibold text-accent">Match in progress</p>
              </div>
              <Button
                onClick={() => onStartMatch?.(match.id)}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Open Live Scoreboard
              </Button>
            </div>
          )}

          {match.status === "upcoming" && (
            <div className="pt-3 space-y-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Match starts at {match.time}</span>
              </div>
              <Button
                onClick={() => onStartMatch?.(match.id)}
                variant="outline"
                className="w-full gap-2"
              >
                <Play className="w-4 h-4" />
                Start Tracking This Match
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
