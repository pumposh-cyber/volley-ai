"use client"

import { useState, useEffect } from "react"
import { Trophy, RefreshCw, ExternalLink, WifiOff } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { cn } from "@/lib/utils"

interface NCVAData {
  headers: string[]
  rows: Record<string, string>[]
  fetchedAt?: string
  error?: string
}

const OUR_TEAM_KEYWORDS = ["uvac", "urban volleyball", "urban vbc"]

function isOurTeam(row: Record<string, string>): boolean {
  const val = Object.values(row).join(" ").toLowerCase()
  return OUR_TEAM_KEYWORDS.some((kw) => val.includes(kw))
}

export function TeamRankings() {
  const { state } = useApp()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const standings: any[] = (state.scheduleCache?.data as any)?.standings ?? []

  const [ncva, setNcva] = useState<NCVAData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)

  async function fetchNcva(manual = false) {
    if (manual) setRefreshing(true)
    try {
      const res = await fetch("/api/ncva")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: NCVAData = await res.json()
      setNcva(data)
      setLastFetch(new Date())
    } catch (e) {
      setNcva({ headers: [], rows: [], error: String(e) })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchNcva() }, [])

  return (
    <div className="flex flex-col gap-4">

      {/* TM2 Pool Standings */}
      {standings.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Pool Standings · Far Westerns Wk 2</p>
          </div>
          <div className="divide-y divide-border">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {standings.map((s: any) => (
              <div
                key={s.teamId}
                className={cn(
                  "flex items-center justify-between px-4 py-3 text-sm",
                  s.isOurTeam && "bg-primary/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-bold shrink-0",
                    s.rank === 1 ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                  )}>
                    {s.rank}
                  </span>
                  <span className={cn(
                    "font-medium leading-tight",
                    s.isOurTeam ? "text-primary font-bold" : "text-foreground"
                  )}>
                    {s.isOurTeam ? "⚡ " : ""}{s.teamName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <span className={cn(
                    "font-semibold",
                    s.wins > s.losses ? "text-accent" : s.wins < s.losses ? "text-destructive" : "text-foreground"
                  )}>
                    {s.wins}W–{s.losses}L
                  </span>
                  <span className="text-muted-foreground">{s.setWins}–{s.setLosses}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 bg-muted/20 border-t border-border">
            <p className="text-[10px] text-muted-foreground">Live pool play · auto-refreshes via TM2</p>
          </div>
        </div>
      )}

      {/* NCVA Power League */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-chart-4" />
            <div>
              <p className="text-sm font-semibold text-foreground">NCVA Power League Points</p>
              {lastFetch && (
                <p className="text-[10px] text-muted-foreground">
                  Updated {Math.round((Date.now() - lastFetch.getTime()) / 1000)}s ago
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchNcva(true)}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className={cn("w-3 h-3", refreshing && "animate-spin")} />
              Refresh
            </button>
            <a
              href="https://ncva.com/girls-power-league-points/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Open NCVA site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {loading && <NCVASkeleton />}

        {!loading && ncva?.error && (
          <div className="p-6 text-center">
            <WifiOff className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-sm text-destructive font-medium mb-1">Could not load NCVA data</p>
            <p className="text-xs text-muted-foreground mb-3">{ncva.error}</p>
            <button
              onClick={() => fetchNcva(true)}
              className="text-xs text-primary underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && ncva && !ncva.error && ncva.rows.length > 0 && (
          <NCVATable headers={ncva.headers} rows={ncva.rows} />
        )}

        {!loading && ncva && !ncva.error && ncva.rows.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No data found in spreadsheet.
          </div>
        )}
      </div>

    </div>
  )
}

function NCVATable({ headers, rows }: { headers: string[]; rows: Record<string, string>[] }) {
  // Pick the most useful columns (skip empty-looking headers)
  const visibleHeaders = headers.filter((h) => h.trim())

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/20">
            {visibleHeaders.map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap first:sticky first:left-0 first:bg-muted/20 first:z-10"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => {
            const mine = isOurTeam(row)
            return (
              <tr
                key={i}
                className={cn(
                  "transition-colors",
                  mine ? "bg-primary/5" : "hover:bg-muted/20"
                )}
              >
                {visibleHeaders.map((h) => (
                  <td
                    key={h}
                    className={cn(
                      "px-3 py-2.5 whitespace-nowrap first:sticky first:left-0 first:z-10",
                      mine ? "first:bg-primary/5 font-semibold text-primary" : "text-foreground first:bg-card"
                    )}
                  >
                    {mine && h === visibleHeaders[0] ? `⚡ ${row[h]}` : row[h]}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function NCVASkeleton() {
  return (
    <div className="p-4 space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-4 w-6 bg-muted animate-pulse rounded" />
          <div className="h-4 flex-1 bg-muted animate-pulse rounded" />
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  )
}
