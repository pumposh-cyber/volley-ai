"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { RotateCw, RefreshCw } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import type { Player } from "@/lib/types"

const ROLE_COLORS: Record<string, string> = {
  S:   "bg-primary/15 text-primary border-primary/30",
  OH:  "bg-accent/15 text-accent border-accent/30",
  MB:  "bg-chart-3/15 text-chart-3 border-chart-3/30",
  L:   "bg-chart-5/15 text-chart-5 border-chart-5/30",
  RS:  "bg-chart-4/15 text-chart-4 border-chart-4/30",
  OPP: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  DS:  "bg-chart-5/15 text-chart-5 border-chart-5/30",
}

const ROLE_LABELS: Record<string, string> = {
  S: "Setter", OH: "Outside", MB: "Middle",
  L: "Libero", RS: "Right Side", OPP: "Opposite", DS: "Defensive Spec.",
}

// Court layout: front row positions 4,3,2 (indices 3,2,1) | back row 5,6,1 (indices 4,5,0)
const COURT_LAYOUT = [[3, 2, 1], [4, 5, 0]]
const POS_LABELS = ["1", "2", "3", "4", "5", "6"]

export function CourtRotation() {
  const { state, dispatch, activePlayers } = useApp()
  const rotation = state.rotation
  const [selectedPos, setSelectedPos] = useState<number | null>(null)

  // Use first 6 players for the court (starters)
  const starters = activePlayers.slice(0, 6)
  const positions = rotation?.positions ?? [0, 1, 2, 3, 4, 5]
  const rotationNum = rotation?.rotationNum ?? 1

  const getPlayer = (posIdx: number): Player | undefined => starters[positions[posIdx]]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Court Rotation</p>
          <p className="text-lg font-bold text-foreground">Rotation {rotationNum}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { dispatch({ type: "ROTATION_RESET" }); setSelectedPos(null) }}
            className="gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </Button>
          <Button
            onClick={() => { dispatch({ type: "ROTATION_ROTATE" }); setSelectedPos(null) }}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <RotateCw className="w-4 h-4" />
            Rotate
          </Button>
        </div>
      </div>

      {/* Court visualization */}
      <div className="relative rounded-xl overflow-hidden border-2 border-border bg-gradient-to-b from-[oklch(0.96_0.08_145)] to-[oklch(0.92_0.08_145)] dark:from-[oklch(0.22_0.06_145)] dark:to-[oklch(0.18_0.06_145)]">
        <div className="px-3 pt-2 pb-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-foreground/60">← Attacking →</span>
        </div>

        {/* Front row: 4, 3, 2 */}
        <div className="grid grid-cols-3 gap-2 px-3 pb-2">
          {COURT_LAYOUT[0].map((posIdx) => (
            <PlayerCell
              key={posIdx}
              player={getPlayer(posIdx)}
              posLabel={POS_LABELS[posIdx]}
              selected={selectedPos === posIdx}
              onSelect={() => setSelectedPos(selectedPos === posIdx ? null : posIdx)}
            />
          ))}
        </div>

        {/* Net */}
        <div className="relative flex items-center mx-3 my-1">
          <div className="flex-1 h-0.5 bg-white/70 dark:bg-white/40" />
          <div className="flex gap-0.5 mx-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1.5 h-3 bg-white/60 dark:bg-white/30 rounded-sm" />
            ))}
          </div>
          <div className="flex-1 h-0.5 bg-white/70 dark:bg-white/40" />
          <span className="absolute left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-widest text-white/80 dark:text-white/50 -top-3">
            NET
          </span>
        </div>

        {/* Back row: 5, 6, 1 */}
        <div className="grid grid-cols-3 gap-2 px-3 pt-2 pb-3">
          {COURT_LAYOUT[1].map((posIdx) => (
            <PlayerCell
              key={posIdx}
              player={getPlayer(posIdx)}
              posLabel={POS_LABELS[posIdx]}
              selected={selectedPos === posIdx}
              onSelect={() => setSelectedPos(selectedPos === posIdx ? null : posIdx)}
            />
          ))}
        </div>
        <div className="px-3 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-foreground/60">← Serving →</span>
        </div>
      </div>

      {/* Selected player detail */}
      {selectedPos !== null && getPlayer(selectedPos) && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
            #{getPlayer(selectedPos)!.number}
          </div>
          <div>
            <p className="font-semibold text-foreground">{getPlayer(selectedPos)!.name}</p>
            <p className="text-sm text-muted-foreground">
              Position {POS_LABELS[selectedPos]} · {ROLE_LABELS[getPlayer(selectedPos)!.position] || getPlayer(selectedPos)!.position}
            </p>
          </div>
          <Badge className={cn("ml-auto text-xs border", ROLE_COLORS[getPlayer(selectedPos)!.position])}>
            {getPlayer(selectedPos)!.position}
          </Badge>
        </div>
      )}

      {/* Rotation dots */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5, 6].map((r) => (
          <div
            key={r}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              r === rotationNum ? "bg-primary w-4" : "bg-border"
            )}
          />
        ))}
      </div>
    </div>
  )
}

function PlayerCell({
  player,
  posLabel,
  selected,
  onSelect,
}: {
  player: Player | undefined
  posLabel: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 p-2 transition-all min-h-[72px]",
        "bg-white/80 dark:bg-card/80 backdrop-blur-sm",
        selected
          ? "border-primary shadow-lg shadow-primary/20 scale-105"
          : "border-white/60 dark:border-border hover:border-primary/50",
        player?.position === "L" && "border-dashed"
      )}
    >
      <span className="absolute top-1 left-1.5 text-[9px] font-bold text-muted-foreground">P{posLabel}</span>
      {player ? (
        <>
          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full border mb-1", ROLE_COLORS[player.position])}>
            {player.position}
          </span>
          <span className="text-xs font-semibold text-foreground text-center leading-tight">
            {player.name.split(" ")[0]}
          </span>
          <span className="text-[10px] text-muted-foreground">#{player.number}</span>
        </>
      ) : (
        <span className="text-xs text-muted-foreground">Empty</span>
      )}
    </button>
  )
}
