"use client"

import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  MapPin,
  Clock,
  RefreshCw,
  Trophy,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Play,
  Wrench,
  Wifi,
  WifiOff,
} from "lucide-react"
import { useApp } from "@/contexts/app-context"

interface MatchResult {
  ourSetWins: number
  theirSetWins: number
  setScores: { us: number; them: number }[]
}

interface Match {
  id: number
  friendlyLabel: string
  startTime: number
  endTime: number
  timezone: string
  matchOrder: number
  court: { id: number; name: string; location: string }
  round: { id: number; name: string; type: string }
  poolBracketType: string
  status: "upcoming" | "in-progress" | "win" | "loss" | "work-team" | "done"
  isWorkTeam: boolean
  opponent: { id: number; name: string; state: string | null } | null
  result: MatchResult | null
}

interface Standing {
  teamId: number
  teamName: string
  isOurTeam: boolean
  wins: number
  losses: number
  setWins: number
  setLosses: number
  rank: number
}

interface TM2Data {
  team: {
    id: number
    name: string
    identifier: string
    seed: number
    division: string
    eventName: string
    eventDates: string
  }
  matches: Match[]
  standings: Standing[]
  fetchedAt: string
}

const REFRESH_INTERVAL = 60_000 // 60s

export function LiveSchedule() {
  const { state, dispatch, activeTeam } = useApp()
  const cached = state.scheduleCache

  const [data, setData] = useState<TM2Data | null>(
    cached?.data as TM2Data | null ?? null
  )
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(
    cached ? new Date(cached.cachedAt) : null
  )
  const [refreshing, setRefreshing] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isOfflineCache, setIsOfflineCache] = useState(false)

  const fetchData = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true)
    try {
      const res = await fetch("/api/tm2", { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: TM2Data = await res.json()
      setData(json)
      setError(null)
      setIsOfflineCache(false)
      setLastRefresh(new Date())
      // Persist to context/localStorage
      dispatch({
        type: "SCHEDULE_CACHE",
        payload: {
          teamId: activeTeam?.id ?? "uvac-15ts",
          data: json,
          cachedAt: new Date().toISOString(),
        },
      })
      // Auto-expand in-progress or next upcoming match
      const live = json.matches.find((m) => m.status === "in-progress")
      const next = json.matches.find((m) => m.status === "upcoming")
      if (live) setExpandedId(live.id)
      else if (next && !expandedId) setExpandedId(next.id)
    } catch (e) {
      // Fall back to cache if available
      if (cached) {
        setData(cached.data as TM2Data)
        setIsOfflineCache(true)
        setError(null)
      } else {
        setError(String(e))
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam?.id, dispatch])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <SkeletonPulse />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center">
        <WifiOff className="w-6 h-6 text-destructive mx-auto mb-2" />
        <p className="text-sm font-semibold text-destructive mb-1">Could not load TM2 data</p>
        <p className="text-xs text-muted-foreground mb-3">{error}</p>
        <Button size="sm" variant="outline" onClick={() => fetchData(true)}>
          Retry
        </Button>
      </div>
    )
  }

  const { team, matches, standings } = data
  const winsToday = matches.filter((m) => m.status === "win").length
  const lossesToday = matches.filter((m) => m.status === "loss").length

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {team.division} · {team.eventDates}
            </p>
            {isOfflineCache ? (
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <WifiOff className="w-3 h-3" />
                Cached
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-accent font-medium">
                <Wifi className="w-3 h-3" />
                Live
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-foreground mt-0.5 leading-tight">{team.name}</h2>
          <p className="text-xs text-muted-foreground">Seed #{team.seed} · {team.identifier}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="text-accent">{winsToday}W</span>
            <span className="text-muted-foreground">–</span>
            <span className="text-destructive">{lossesToday}L</span>
          </div>
          <button
            onClick={() => fetchData(true)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={cn("w-3 h-3", refreshing && "animate-spin")} />
            {lastRefresh
              ? `${Math.round((Date.now() - lastRefresh.getTime()) / 1000)}s ago`
              : "Refreshing…"}
          </button>
        </div>
      </div>

      {/* Match cards with past divider */}
      {(() => {
        const sorted = [...matches].filter((m) => !m.isWorkTeam).sort((a, b) => b.startTime - a.startTime)
        const isDone = (m: Match) => m.status === "win" || m.status === "loss" || m.status === "done"
        let dividerInserted = false
        return sorted.map((match, idx) => {
          const showDivider = !dividerInserted && isDone(match) && (idx === 0 || !isDone(sorted[idx - 1]))
          if (showDivider) dividerInserted = true
          return (
            <div key={match.id}>
              {showDivider && (
                <div className="flex items-center gap-3 py-3">
                  <div className="flex-1 h-px bg-muted-foreground/30" />
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                    ✓ Past Matches
                  </span>
                  <div className="flex-1 h-px bg-muted-foreground/30" />
                </div>
              )}
              <MatchCard
                match={match}
                expanded={expandedId === match.id}
                onExpand={() => setExpandedId(expandedId === match.id ? null : match.id)}
                matchNumber={idx + 1}
              />
            </div>
          )
        })
      })()}

      {/* Pool standings */}
      {standings.length > 0 && (
        <PoolStandings standings={standings} />
      )}

      <p className="text-[10px] text-center text-muted-foreground">
        Data from TM2 · auto-refreshes every 60s
      </p>
    </div>
  )
}

function MatchCard({
  match,
  expanded,
  onExpand,
  matchNumber,
}: {
  match: Match
  expanded: boolean
  onExpand: () => void
  matchNumber: number
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

  const statusConfig = {
    upcoming: {
      label: "Upcoming",
      badgeClass: "bg-muted/80 text-muted-foreground",
      borderClass: "border-border",
      icon: Circle,
    },
    "in-progress": {
      label: "LIVE",
      badgeClass: "bg-accent text-accent-foreground",
      borderClass: "border-accent/60 shadow-accent/15 shadow-lg",
      icon: Play,
    },
    win: {
      label: "WIN ✓",
      badgeClass: "bg-accent/15 text-accent border border-accent/30",
      borderClass: "border-accent/25",
      icon: CheckCircle2,
    },
    loss: {
      label: "LOSS",
      badgeClass: "bg-destructive/15 text-destructive border border-destructive/30",
      borderClass: "border-destructive/25",
      icon: CheckCircle2,
    },
    "work-team": {
      label: "Work Team",
      badgeClass: "bg-chart-3/15 text-chart-3",
      borderClass: "border-chart-3/25",
      icon: Wrench,
    },
    done: {
      label: "Done",
      badgeClass: "bg-muted/50 text-muted-foreground",
      borderClass: "border-border",
      icon: CheckCircle2,
    },
  }

  const cfg = statusConfig[match.status]

  return (
    <div
      className={cn(
        "rounded-xl border-2 overflow-hidden transition-all",
        cfg.borderClass
      )}
    >
      {match.status === "in-progress" && (
        <div className="flex items-center gap-2 bg-accent/10 px-4 py-1.5 border-b border-accent/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-xs font-bold text-accent uppercase tracking-wide">Match in progress</span>
        </div>
      )}

      <button
        onClick={onExpand}
        className="w-full flex items-center gap-3 p-4 bg-card hover:bg-muted/20 text-left transition-colors"
      >
        {/* Time column */}
        <div className="flex flex-col items-center min-w-[52px]">
          <span className="text-sm font-bold text-foreground">{timeStr}</span>
          <span className="text-[10px] text-muted-foreground">{dayStr.split(",")[0]}</span>
        </div>
        <div className="w-px h-10 bg-border shrink-0" />

        {/* Match info */}
        <div className="flex-1 min-w-0">
          {match.isWorkTeam ? (
            <div>
              <p className="font-semibold text-sm text-foreground">Work Team Duty</p>
              <p className="text-xs text-muted-foreground mt-0.5">{match.friendlyLabel}</p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-sm text-foreground truncate">
                vs {match.opponent?.name ?? "TBD"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {match.court.name}
                </span>
                <span className="text-xs text-muted-foreground">{match.friendlyLabel}</span>
              </div>
            </div>
          )}
        </div>

        {/* Result + Status */}
        <div className="flex items-center gap-2 shrink-0">
          {match.result && (
            <span className={cn(
              "text-sm font-bold",
              match.status === "win" ? "text-accent" : "text-destructive"
            )}>
              {match.result.ourSetWins}–{match.result.theirSetWins}
            </span>
          )}
          <Badge className={cn("text-[11px] font-bold border-0 px-2", cfg.badgeClass)}>
            {cfg.label}
          </Badge>
          {expanded
            ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
            : <ChevronRight className="w-4 h-4 text-muted-foreground" />
          }
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 bg-muted/20 border-t border-border space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Date & Time</p>
              <p className="font-medium text-foreground">{dayStr} · {timeStr}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Court</p>
              <p className="font-medium text-foreground">{match.court.name}</p>
            </div>
            {match.opponent && (
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Opponent</p>
                <p className="font-medium text-foreground">
                  {match.opponent.name}
                  {match.opponent.state && (
                    <span className="text-muted-foreground"> · {match.opponent.state}</span>
                  )}
                </p>
              </div>
            )}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Match ID</p>
              <p className="font-mono text-xs text-foreground">{match.friendlyLabel}</p>
            </div>
          </div>

          {/* Set scores */}
          {match.result && match.result.setScores.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Set Scores</p>
              <div className="flex gap-2">
                {match.result.setScores.map((s, i) => (
                  <div key={i} className="flex flex-col items-center px-3 py-2 rounded-lg bg-muted/50 min-w-[60px]">
                    <span className="text-[10px] text-muted-foreground mb-1">Set {i + 1}</span>
                    <span className={cn(
                      "font-bold text-sm",
                      s.us > s.them ? "text-accent" : "text-destructive"
                    )}>
                      {s.us}–{s.them}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {match.isWorkTeam && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wrench className="w-4 h-4 text-chart-3" />
              <span>Your team is assigned work team duty this match.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PoolStandings({ standings }: { standings: Standing[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Pool Standings</p>
        </div>
      </div>
      <div className="divide-y divide-border">
        {standings.map((s) => (
          <div
            key={s.teamId}
            className={cn(
              "flex items-center justify-between px-4 py-3 text-sm",
              s.isOurTeam && "bg-primary/5"
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                "w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-bold",
                s.rank === 1 ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
              )}>
                {s.rank}
              </span>
              <span className={cn(
                "font-medium",
                s.isOurTeam ? "text-primary" : "text-foreground"
              )}>
                {s.isOurTeam ? "⚡ " : ""}{s.teamName}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className={cn(
                "font-semibold",
                s.wins > s.losses ? "text-accent" : s.wins < s.losses ? "text-destructive" : "text-foreground"
              )}>
                {s.wins}W–{s.losses}L
              </span>
              <span className="text-muted-foreground">{s.setWins}–{s.setLosses} sets</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonPulse() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="h-4 w-12 bg-muted animate-pulse rounded" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-border p-4 space-y-2">
          <div className="flex gap-3">
            <div className="w-12 h-10 bg-muted animate-pulse rounded" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
