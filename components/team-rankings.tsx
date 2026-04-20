"use client"

import { useState, useEffect } from "react"
import { Trophy, RefreshCw, ExternalLink, WifiOff, Search, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { cn } from "@/lib/utils"
import type { NCVATeam } from "@/app/api/ncva/route"

const OUR_TEAM = "UVAC Urban Volleyball 15 TS"

const DIVISION_STYLE: Record<string, { label: string; bg: string; text: string; border: string }> = {
  Gold:     { label: "Gold",     bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-400/40" },
  American: { label: "American", bg: "bg-blue-500/10",   text: "text-blue-600 dark:text-blue-400",     border: "border-blue-400/40"   },
  Freedom:  { label: "Freedom",  bg: "bg-rose-500/10",   text: "text-rose-600 dark:text-rose-400",     border: "border-rose-400/40"   },
}

function divStyle(div: string) {
  return DIVISION_STYLE[div] ?? { label: div, bg: "bg-muted", text: "text-muted-foreground", border: "border-border" }
}

/** Simple inline SVG sparkline for tournament points trend */
function Sparkline({ points }: { points: number[] }) {
  const active = points.filter((p) => p > 0)
  if (active.length < 2) {
    return <span className="text-[10px] text-muted-foreground">—</span>
  }
  const w = 56, h = 24, pad = 2
  const min = Math.min(...active)
  const max = Math.max(...active)
  const range = max - min || 1
  const xs = active.map((_, i) => pad + (i / (active.length - 1)) * (w - pad * 2))
  const ys = active.map((p) => h - pad - ((p - min) / range) * (h - pad * 2))
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ")
  const last = active[active.length - 1]
  const prev = active[active.length - 2]
  const trend = last > prev ? "up" : last < prev ? "down" : "flat"

  return (
    <div className="flex items-center gap-1">
      <svg width={w} height={h} className="overflow-visible">
        <path d={d} fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className={cn(
            trend === "up" ? "text-accent" : trend === "down" ? "text-destructive" : "text-muted-foreground"
          )}
        />
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]} r="2" fill="currentColor"
            className={cn(
              trend === "up" ? "text-accent" : trend === "down" ? "text-destructive" : "text-muted-foreground"
            )}
          />
        ))}
      </svg>
      {trend === "up"   && <TrendingUp   className="w-3 h-3 text-accent" />}
      {trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
      {trend === "flat" && <Minus        className="w-3 h-3 text-muted-foreground" />}
    </div>
  )
}

function TeamCard({ team, rank }: { team: NCVATeam; rank: number }) {
  const isUs = team.name === OUR_TEAM
  const ds = divStyle(team.division)
  const tournamentPoints = [team.l1Points, team.l2Points, team.l3Points].filter(Boolean)

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors",
      isUs && "bg-primary/5"
    )}>
      {/* Rank */}
      <div className={cn(
        "flex flex-col items-center justify-center min-w-[36px] h-9 rounded-lg font-bold tabular-nums",
        isUs ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        <span className="text-xs leading-none text-muted-foreground/70">{isUs ? "⚡" : "#"}</span>
        <span className={cn("text-sm leading-tight", isUs && "text-primary-foreground")}>{rank}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold truncate leading-tight", isUs && "text-primary")}>
          {team.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {/* Division badge */}
          <span className={cn(
            "inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border",
            ds.bg, ds.text, ds.border
          )}>
            {ds.label}
          </span>
          {/* Division place */}
          <span className="text-[10px] text-muted-foreground">
            #{team.place} in {team.division}
          </span>
          {/* Bid note */}
          {team.bidNotes && (
            <span className="text-[10px] font-medium text-accent truncate max-w-[100px]" title={team.bidNotes}>
              {team.bidNotes}
            </span>
          )}
        </div>
      </div>

      {/* Right side: points + sparkline */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={cn(
          "text-sm font-bold tabular-nums",
          isUs ? "text-primary" : "text-foreground"
        )}>
          {team.total > 0 ? team.total.toLocaleString(undefined, { maximumFractionDigits: 1 }) : "—"}
        </span>
        <Sparkline points={tournamentPoints} />
      </div>
    </div>
  )
}

export function TeamRankings() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { state } = useApp()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const poolStandings: any[] = (state.scheduleCache?.data as any)?.standings ?? []

  const [teams, setTeams] = useState<NCVATeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  const [search, setSearch] = useState("")
  const [divFilter, setDivFilter] = useState<string>("All")

  async function fetchTeams(manual = false) {
    if (manual) setRefreshing(true)
    try {
      const res = await fetch("/api/ncva")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setTeams(data.teams ?? [])
      setLastFetch(new Date())
      setError(null)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchTeams() }, [])

  const divisions = ["All", ...Array.from(new Set(teams.map((t) => t.division))).filter(Boolean)]
  const ourTeam = teams.find((t) => t.name === OUR_TEAM)

  const filtered = teams.filter((t) => {
    if (divFilter !== "All" && t.division !== divFilter) return false
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col gap-4">

      {/* Our team highlight card */}
      {ourTeam && (
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Our Team</p>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-foreground leading-tight">{ourTeam.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={cn(
                  "inline-flex text-[10px] font-bold px-1.5 py-0.5 rounded border",
                  divStyle(ourTeam.division).bg, divStyle(ourTeam.division).text, divStyle(ourTeam.division).border
                )}>
                  {ourTeam.division}
                </span>
                <span className="text-xs text-muted-foreground">#{ourTeam.place} in division</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-black text-primary tabular-nums">#{ourTeam.overall}</p>
              <p className="text-[10px] text-muted-foreground">Overall</p>
            </div>
          </div>
          {/* Points per tournament */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              { label: "L1", val: ourTeam.l1Points },
              { label: "L2", val: ourTeam.l2Points },
              { label: "L3", val: ourTeam.l3Points },
              { label: "Total", val: ourTeam.total },
            ].map(({ label, val }) => (
              <div key={label} className="bg-card rounded-lg p-2 text-center border border-border">
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <p className="text-sm font-bold text-foreground tabular-nums">
                  {val > 0 ? val.toLocaleString(undefined, { maximumFractionDigits: 1 }) : "—"}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Sparkline points={[ourTeam.l1Points, ourTeam.l2Points, ourTeam.l3Points]} />
            <span className="text-[10px] text-muted-foreground">Tournament trend (L1 → L2 → L3)</span>
          </div>
        </div>
      )}

      {/* Pool standings from TM2 */}
      {poolStandings.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Pool Play · Far Westerns Wk 2</p>
          </div>
          <div className="divide-y divide-border">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {poolStandings.map((s: any) => (
              <div key={s.teamId} className={cn(
                "flex items-center justify-between px-4 py-2.5 text-sm",
                s.isOurTeam && "bg-primary/5"
              )}>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-bold",
                    s.rank === 1 ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                  )}>{s.rank}</span>
                  <span className={cn("font-medium", s.isOurTeam && "text-primary font-bold")}>
                    {s.isOurTeam ? "⚡ " : ""}{s.teamName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <span className={cn("font-semibold",
                    s.wins > s.losses ? "text-accent" : s.wins < s.losses ? "text-destructive" : "text-foreground"
                  )}>{s.wins}W–{s.losses}L</span>
                  <span className="text-muted-foreground">{s.setWins}–{s.setLosses} sets</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NCVA Power League full standings */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-chart-4" />
            <div>
              <p className="text-sm font-semibold text-foreground">NCVA Power League · 15U Girls</p>
              {lastFetch && (
                <p className="text-[10px] text-muted-foreground">
                  {Math.round((Date.now() - lastFetch.getTime()) / 1000)}s ago
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => fetchTeams(true)}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
              <RefreshCw className={cn("w-3 h-3", refreshing && "animate-spin")} />
              Refresh
            </button>
            <a href="https://ncva.com/girls-power-league-points/" target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Column legend */}
        {!loading && teams.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Rank · Team · Division Place
            </div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Total · Trend
            </div>
          </div>
        )}

        {/* Search + division filter */}
        {!loading && teams.length > 0 && (
          <div className="flex gap-2 px-4 py-2.5 border-b border-border bg-card">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teams…"
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex gap-1">
              {divisions.map((d) => (
                <button key={d} onClick={() => setDivFilter(d)}
                  className={cn(
                    "px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors",
                    divFilter === d
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground"
                  )}>
                  {d === "All" ? "All" : d.slice(0, 4)}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <RankingSkeleton />}

        {!loading && error && (
          <div className="p-6 text-center">
            <WifiOff className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-sm text-destructive font-medium mb-1">Could not load NCVA data</p>
            <button onClick={() => fetchTeams(true)} className="text-xs text-primary underline mt-2">Retry</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">No teams match your filter.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div>
            {filtered.map((team) => (
              <TeamCard key={team.code || team.name} team={team} rank={team.overall} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RankingSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 bg-muted animate-pulse rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
          </div>
          <div className="w-12 h-8 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  )
}
