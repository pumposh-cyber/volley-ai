"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RotateCcw } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import type { StatKey, PlayerStatEntry } from "@/lib/types"

const STAT_BUTTONS: { key: StatKey; label: string; color: string; shortDesc: string }[] = [
  { key: "K",  label: "Kill",    color: "bg-accent hover:bg-accent/90 text-accent-foreground",        shortDesc: "+pt" },
  { key: "A",  label: "Ace",     color: "bg-primary hover:bg-primary/90 text-primary-foreground",     shortDesc: "+pt" },
  { key: "B",  label: "Block",   color: "bg-chart-4 hover:bg-chart-4/90 text-white",                 shortDesc: "+pt" },
  { key: "D",  label: "Dig",     color: "bg-chart-3/80 hover:bg-chart-3/90 text-white",              shortDesc: "" },
  { key: "E",  label: "Err",     color: "bg-destructive/80 hover:bg-destructive text-white",          shortDesc: "-pt" },
  { key: "SE", label: "Svc Err", color: "bg-destructive/60 hover:bg-destructive/80 text-white",      shortDesc: "-pt" },
]

function getEfficiency(s: PlayerStatEntry): number | null {
  const total = s.K + s.E + s.A + s.B + s.D + s.SE
  if (total === 0) return null
  return Math.round(((s.K + s.A + s.B - s.E - s.SE) / total) * 100)
}

export function PlayerStatsPanel() {
  const { state, dispatch, activePlayers } = useApp()
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)
  const [flashPlayer, setFlashPlayer] = useState<number | null>(null)

  const stats = state.matchStats?.stats ?? {}
  const lastEntry = state.lastStatEntry

  const recordStat = (stat: StatKey) => {
    if (selectedPlayer === null) return
    dispatch({ type: "STATS_RECORD", payload: { playerNumber: selectedPlayer, stat } })
    setFlashPlayer(selectedPlayer)
  }

  // Flash animation clears after 800ms
  useEffect(() => {
    if (flashPlayer === null) return
    const t = setTimeout(() => {
      setFlashPlayer(null)
      dispatch({ type: "STATS_CLEAR_LAST" })
    }, 800)
    return () => clearTimeout(t)
  }, [flashPlayer, dispatch])

  const undoLast = () => {
    dispatch({ type: "STATS_UNDO" })
    setFlashPlayer(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">Select a player, then tap a stat to record it.</p>

      {/* Player selector */}
      <div className="grid grid-cols-2 gap-2">
        {activePlayers.map((player) => {
          const s = stats[player.number] ?? { K: 0, E: 0, A: 0, B: 0, D: 0, SE: 0 }
          const eff = getEfficiency(s)
          const isSelected = selectedPlayer === player.number
          const isFlashing = flashPlayer === player.number

          return (
            <button
              key={player.number}
              onClick={() => setSelectedPlayer(isSelected ? null : player.number)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/40 bg-card",
                isFlashing && "animate-pulse border-accent bg-accent/10"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm shrink-0",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                #{player.number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{player.name}</p>
                <p className="text-xs text-muted-foreground">
                  {s.K}K · {s.A}A · {s.B}B · {s.D}D
                  {eff !== null && (
                    <span className={cn("ml-1 font-medium", eff >= 0 ? "text-accent" : "text-destructive")}>
                      ({eff > 0 ? "+" : ""}{eff}%)
                    </span>
                  )}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Stat buttons */}
      <div className={cn(
        "rounded-xl border-2 p-4 transition-all",
        selectedPlayer !== null ? "border-primary/30 bg-primary/2" : "border-dashed border-border opacity-50"
      )}>
        {selectedPlayer !== null ? (
          <div>
            <p className="text-sm font-semibold text-foreground mb-3 text-center">
              Recording stats for{" "}
              <span className="text-primary">
                {activePlayers.find((p) => p.number === selectedPlayer)?.name}
              </span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {STAT_BUTTONS.map(({ key, label, color, shortDesc }) => (
                <button
                  key={key}
                  onClick={() => recordStat(key)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl py-3 px-2 font-bold transition-all active:scale-95",
                    color
                  )}
                >
                  <span className="text-lg font-black">{label}</span>
                  {shortDesc && <span className="text-[10px] opacity-80">{shortDesc}</span>}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-2">
            ← Select a player above to record stats
          </p>
        )}
      </div>

      {/* Undo */}
      {lastEntry && (
        <Button variant="ghost" onClick={undoLast} className="gap-2 text-muted-foreground w-full">
          <RotateCcw className="w-4 h-4" />
          Undo last entry
        </Button>
      )}

      {/* Summary table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-8 bg-muted/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="col-span-2">Player</span>
          <span className="text-center">K</span>
          <span className="text-center">A</span>
          <span className="text-center">B</span>
          <span className="text-center">D</span>
          <span className="text-center">E</span>
          <span className="text-center">Eff</span>
        </div>
        {activePlayers.map((player, i) => {
          const s = stats[player.number] ?? { K: 0, E: 0, A: 0, B: 0, D: 0, SE: 0 }
          const eff = getEfficiency(s)
          return (
            <div
              key={player.number}
              className={cn(
                "grid grid-cols-8 px-3 py-2 text-sm items-center",
                i % 2 === 0 ? "bg-card" : "bg-muted/20",
                selectedPlayer === player.number && "bg-primary/5"
              )}
            >
              <span className="col-span-2 font-medium text-foreground truncate text-xs">
                {player.name.split(" ")[0]}
              </span>
              <span className="text-center font-bold text-accent">{s.K || "–"}</span>
              <span className="text-center font-bold text-primary">{s.A || "–"}</span>
              <span className="text-center">{s.B || "–"}</span>
              <span className="text-center">{s.D || "–"}</span>
              <span className="text-center text-destructive">{(s.E + s.SE) || "–"}</span>
              <span className={cn(
                "text-center text-xs font-semibold",
                eff === null ? "text-muted-foreground" : eff >= 0 ? "text-accent" : "text-destructive"
              )}>
                {eff === null ? "–" : `${eff > 0 ? "+" : ""}${eff}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
