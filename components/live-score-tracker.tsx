"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Undo2, Volleyball } from "lucide-react"
import { useApp } from "@/contexts/app-context"

interface LiveScoreTrackerProps {
  teamName?: string
  opponent?: string
}

const SET_WIN = 25
const FINAL_SET_WIN = 15

function isSetWon(us: number, them: number, isFinalSet: boolean) {
  const target = isFinalSet ? FINAL_SET_WIN : SET_WIN
  return (us >= target || them >= target) && Math.abs(us - them) >= 2
}

export function LiveScoreTracker({ teamName, opponent }: LiveScoreTrackerProps) {
  const { state, dispatch, activeTeam } = useApp()
  const match = state.currentMatch

  // If we have an "Opponent TBD" match and a real opponent was passed as prop, update it
  useEffect(() => {
    if (
      opponent &&
      match?.opponentName === "Opponent TBD" &&
      state.activeTeamId
    ) {
      dispatch({
        type: "SCORE_RESET",
        payload: { teamId: state.activeTeamId, opponentName: opponent },
      })
    }
    // Only run when component mounts or opponent changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponent, state.activeTeamId])

  const displayTeamName = teamName ?? activeTeam?.name ?? "Our Team"
  const displayOpponent = match?.opponentName ?? opponent ?? "Opponent"

  if (!match) return null

  const { sets, currentSet, serving, matchOver, history } = match
  const isFinalSet = currentSet === 2
  const current = sets[currentSet] ?? { us: 0, them: 0 }

  const wonSets = (who: "us" | "them") =>
    sets.slice(0, currentSet).filter((s, i) => {
      const t = i === 2 ? FINAL_SET_WIN : SET_WIN
      return who === "us"
        ? s.us >= t && s.us - s.them >= 2
        : s.them >= t && s.them - s.us >= 2
    }).length

  const matchWinner = matchOver ? (wonSets("us") === 2 ? "us" : "them") : null

  return (
    <div className="flex flex-col gap-4">
      {/* Live indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
          </span>
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Live Match</span>
        </div>
        <span className="text-xs text-muted-foreground truncate max-w-[140px]">{displayOpponent}</span>
      </div>

      {/* Set score summary */}
      <div className="flex justify-center gap-3">
        {[0, 1, 2].map((setIdx) => {
          const s = sets[setIdx]
          const isCurrent = setIdx === currentSet
          const isFin = setIdx === 2
          const done = s && isSetWon(s.us, s.them, isFin)
          const label = setIdx === 2 ? "3rd" : setIdx === 0 ? "1st" : "2nd"
          return (
            <div
              key={setIdx}
              className={cn(
                "flex flex-col items-center px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                isCurrent && "border-primary bg-primary/5",
                !isCurrent && !s && "border-border opacity-30",
                done && !isCurrent && "border-accent/40 bg-accent/5"
              )}
            >
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">{label} Set</span>
              {s ? (
                <span className="font-bold">{s.us}–{s.them}</span>
              ) : (
                <span className="text-muted-foreground">–</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Main scoreboard */}
      <div className={cn(
        "rounded-2xl border-2 p-6",
        matchOver
          ? matchWinner === "us"
            ? "border-accent bg-accent/5"
            : "border-destructive bg-destructive/5"
          : "border-border bg-card"
      )}>
        {matchOver && (
          <div className="text-center mb-4">
            <div className={cn("text-lg font-bold", matchWinner === "us" ? "text-accent" : "text-destructive")}>
              {matchWinner === "us" ? "🏆 WIN!" : "Match Over"}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 items-center gap-4">
          {/* Our team */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Volleyball className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-center leading-tight text-foreground">
              {displayTeamName.split(" ").slice(-2).join(" ")}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(wonSets("us"))].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-accent" />
              ))}
              {[...Array(2 - wonSets("us"))].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-border" />
              ))}
            </div>
            {serving === "us" && (
              <Badge className="text-[10px] bg-primary/10 text-primary border-0 px-2 py-0">Serving</Badge>
            )}
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-5xl font-black tabular-nums tracking-tighter">
              <span className="text-foreground">{current.us}</span>
              <span className="text-muted-foreground text-3xl">–</span>
              <span className="text-foreground">{current.them}</span>
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {isFinalSet ? "Final Set (to 15)" : `Set ${currentSet + 1} (to 25)`}
            </span>
          </div>

          {/* Opponent */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
              <span className="text-sm font-bold text-muted-foreground">
                {displayOpponent[0]}
              </span>
            </div>
            <span className="text-xs font-semibold text-center leading-tight text-foreground">
              {displayOpponent.split(" ").slice(0, 2).join(" ")}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(wonSets("them"))].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-destructive" />
              ))}
              {[...Array(2 - wonSets("them"))].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-border" />
              ))}
            </div>
            {serving === "them" && (
              <Badge className="text-[10px] bg-muted text-muted-foreground border-0 px-2 py-0">Serving</Badge>
            )}
          </div>
        </div>

        {/* Score buttons */}
        {!matchOver && (
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              onClick={() => dispatch({ type: "SCORE_ADD_POINT", payload: "us" })}
              size="lg"
              className="h-16 text-xl font-bold bg-primary hover:bg-primary/90 active:scale-95 transition-transform rounded-xl"
            >
              +1 Us
            </Button>
            <Button
              onClick={() => dispatch({ type: "SCORE_ADD_POINT", payload: "them" })}
              size="lg"
              variant="outline"
              className="h-16 text-xl font-bold hover:bg-muted active:scale-95 transition-transform rounded-xl"
            >
              +1 Them
            </Button>
          </div>
        )}

        {matchOver && (
          <Button
            onClick={() =>
              dispatch({
                type: "SCORE_RESET",
                payload: { teamId: state.activeTeamId!, opponentName: "Opponent TBD" },
              })
            }
            className="w-full mt-4"
            variant="outline"
          >
            Start New Match
          </Button>
        )}
      </div>

      {/* Undo */}
      {history.length > 0 && !matchOver && (
        <Button
          variant="ghost"
          onClick={() => dispatch({ type: "SCORE_UNDO" })}
          className="w-full gap-2 text-muted-foreground"
        >
          <Undo2 className="w-4 h-4" />
          Undo last point
        </Button>
      )}
    </div>
  )
}
