"use client"

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import type {
  AppState,
  AppAction,
  Team,
  Player,
  MatchScore,
  MatchStats,
  RotationState,
  SetScore,
} from "@/lib/types"
import { loadState, saveState } from "@/lib/storage"

// ─── Seed data ────────────────────────────────────────────────────────────────

export const DEFAULT_TEAM: Team = {
  id: "uvac-15ts",
  name: "UVAC Urban Volleyball 15 TS",
  shortName: "UVAC 15 TS",
  division: "15 No Dinx",
  coachName: "Tamara Robertson",
  tm2EventId: 2170,
  tm2DivisionId: 10559,
  tm2TeamId: 266815,
}

export const DEFAULT_PLAYERS: Player[] = [
  { id: "p4",  teamId: "uvac-15ts", name: "Gabriela C.", number: 4,  position: "OH",  guardians: [] },
  { id: "p5",  teamId: "uvac-15ts", name: "Tam D.",      number: 5,  position: "S",   guardians: [] },
  { id: "p7",  teamId: "uvac-15ts", name: "Sophia M.",   number: 7,  position: "OH",  guardians: [] },
  { id: "p9",  teamId: "uvac-15ts", name: "Allison C.",  number: 9,  position: "MB",  guardians: [] },
  { id: "p10", teamId: "uvac-15ts", name: "Elizabeth C.",number: 10, position: "L",   guardians: [] },
  { id: "p11", teamId: "uvac-15ts", name: "Samantha B.", number: 11, position: "MB",  guardians: [] },
  { id: "p13", teamId: "uvac-15ts", name: "Tiya R.",     number: 13, position: "MB",  guardians: [] },
  { id: "p15", teamId: "uvac-15ts", name: "Danijela G.", number: 15, position: "OH",  guardians: [] },
  { id: "p16", teamId: "uvac-15ts", name: "Julisa L.",   number: 16, position: "DS",  guardians: [] },
  { id: "p17", teamId: "uvac-15ts", name: "Yixuan W.",   number: 17, position: "S",   guardians: [] },
  { id: "p19", teamId: "uvac-15ts", name: "Leila S.",    number: 19, position: "OH",  guardians: [] },
  { id: "p21", teamId: "uvac-15ts", name: "Claire J.",   number: 21, position: "RS",  guardians: [] },
  { id: "p24", teamId: "uvac-15ts", name: "Ariha S.",    number: 24, position: "OPP", guardians: [] },
  { id: "p31", teamId: "uvac-15ts", name: "Nishka M.",   number: 31, position: "MB",  guardians: [] },
]

const INITIAL_STATE: AppState = {
  teams: [DEFAULT_TEAM],
  activeTeamId: "uvac-15ts",
  players: DEFAULT_PLAYERS,
  currentMatch: null,
  matchStats: null,
  lastStatEntry: null,
  rotation: null,
  scheduleCache: null,
  trips: [],
}

// ─── Score helpers ────────────────────────────────────────────────────────────

const SET_WIN = 25
const FINAL_SET_WIN = 15

function isSetWon(us: number, them: number, isFinalSet: boolean): boolean {
  const target = isFinalSet ? FINAL_SET_WIN : SET_WIN
  return (us >= target || them >= target) && Math.abs(us - them) >= 2
}

function countSetWins(sets: SetScore[], upTo: number, who: "us" | "them"): number {
  return sets.slice(0, upTo).filter((s, i) => {
    const t = i === 2 ? FINAL_SET_WIN : SET_WIN
    return who === "us"
      ? s.us >= t && s.us - s.them >= 2
      : s.them >= t && s.them - s.us >= 2
  }).length
}

function makeEmptyMatch(teamId: string, opponentName: string): MatchScore {
  return {
    id: `match-${Date.now()}`,
    teamId,
    opponentName,
    date: new Date().toISOString(),
    sets: [{ us: 0, them: 0 }],
    currentSet: 0,
    serving: "us",
    matchOver: false,
    history: [],
  }
}

function makeEmptyStats(matchId: string, teamId: string, players: Player[]): MatchStats {
  const stats: MatchStats["stats"] = {}
  for (const p of players) {
    if (p.teamId === teamId) {
      stats[p.number] = { K: 0, E: 0, A: 0, B: 0, D: 0, SE: 0 }
    }
  }
  return { matchId, teamId, stats }
}

function makeDefaultRotation(teamId: string, matchId: string): RotationState {
  return { teamId, matchId, positions: [0, 1, 2, 3, 4, 5], rotationNum: 1 }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {

    case "HYDRATE":
      return { ...state, ...action.payload }

    // ── Teams ────────────────────────────────────────────────────────────────
    case "SET_ACTIVE_TEAM": {
      if (action.payload === state.activeTeamId) return state
      return {
        ...state,
        activeTeamId: action.payload,
        currentMatch: null,
        matchStats: null,
        lastStatEntry: null,
        rotation: null,
      }
    }

    case "ADD_TEAM":
      return { ...state, teams: [...state.teams, action.payload] }

    case "UPDATE_TEAM":
      return {
        ...state,
        teams: state.teams.map((t) => t.id === action.payload.id ? action.payload : t),
      }

    // ── Players ──────────────────────────────────────────────────────────────
    case "UPSERT_PLAYER": {
      const exists = state.players.some((p) => p.id === action.payload.id)
      return {
        ...state,
        players: exists
          ? state.players.map((p) => p.id === action.payload.id ? action.payload : p)
          : [...state.players, action.payload],
      }
    }

    case "DELETE_PLAYER":
      return { ...state, players: state.players.filter((p) => p.id !== action.payload) }

    // ── Scoring ──────────────────────────────────────────────────────────────
    case "SCORE_RESET": {
      const match = makeEmptyMatch(action.payload.teamId, action.payload.opponentName)
      const stats = makeEmptyStats(match.id, action.payload.teamId, state.players)
      const rotation = makeDefaultRotation(action.payload.teamId, match.id)
      return { ...state, currentMatch: match, matchStats: stats, rotation, lastStatEntry: null }
    }

    case "SCORE_ADD_POINT": {
      const match = state.currentMatch
      if (!match || match.matchOver) return state
      const { sets, currentSet, serving } = match
      const isFinalSet = currentSet === 2
      const who = action.payload
      const newServing: "us" | "them" = who !== serving ? who : serving

      const newHistory = [
        ...match.history,
        { sets: sets.map((s) => ({ ...s })), setIndex: currentSet, serving },
      ]
      const newSets = sets.map((s, i) =>
        i === currentSet ? { ...s, [who]: s[who] + 1 } : s
      )
      const newScore = newSets[currentSet]

      if (isSetWon(newScore.us, newScore.them, isFinalSet)) {
        const wonUs = countSetWins(newSets, currentSet + 1, "us")
        const wonThem = countSetWins(newSets, currentSet + 1, "them")

        if (wonUs === 2 || wonThem === 2) {
          return {
            ...state,
            currentMatch: { ...match, sets: newSets, serving: newServing, history: newHistory, matchOver: true },
          }
        }
        if (currentSet < 2) {
          return {
            ...state,
            currentMatch: {
              ...match,
              sets: [...newSets, { us: 0, them: 0 }],
              currentSet: currentSet + 1,
              serving: "us",
              history: newHistory,
            },
          }
        }
      }
      return { ...state, currentMatch: { ...match, sets: newSets, serving: newServing, history: newHistory } }
    }

    case "SCORE_UNDO": {
      const match = state.currentMatch
      if (!match || match.history.length === 0) return state
      const last = match.history[match.history.length - 1]
      return {
        ...state,
        currentMatch: {
          ...match,
          sets: last.sets,
          currentSet: last.setIndex,
          serving: last.serving,
          history: match.history.slice(0, -1),
          matchOver: false,
        },
      }
    }

    // ── Stats ────────────────────────────────────────────────────────────────
    case "STATS_RECORD": {
      const { playerNumber, stat } = action.payload
      const prevStats = state.matchStats?.stats ?? {}
      const prev = prevStats[playerNumber] ?? { K: 0, E: 0, A: 0, B: 0, D: 0, SE: 0 }
      const newMatchStats: MatchStats = {
        matchId: state.currentMatch?.id ?? "current",
        teamId: state.activeTeamId ?? "",
        stats: { ...prevStats, [playerNumber]: { ...prev, [stat]: prev[stat] + 1 } },
      }
      return { ...state, matchStats: newMatchStats, lastStatEntry: { playerNumber, stat } }
    }

    case "STATS_UNDO": {
      const entry = state.lastStatEntry
      if (!entry || !state.matchStats) return { ...state, lastStatEntry: null }
      const { playerNumber, stat } = entry
      const prev = state.matchStats.stats[playerNumber] ?? { K: 0, E: 0, A: 0, B: 0, D: 0, SE: 0 }
      return {
        ...state,
        lastStatEntry: null,
        matchStats: {
          ...state.matchStats,
          stats: {
            ...state.matchStats.stats,
            [playerNumber]: { ...prev, [stat]: Math.max(0, prev[stat] - 1) },
          },
        },
      }
    }

    case "STATS_CLEAR_LAST":
      return { ...state, lastStatEntry: null }

    // ── Rotation ─────────────────────────────────────────────────────────────
    case "ROTATION_ROTATE": {
      const prev = state.rotation?.positions ?? [0, 1, 2, 3, 4, 5]
      const next = [...prev]
      const last = next[5]
      next[5] = next[4]; next[4] = next[3]; next[3] = next[2]
      next[2] = next[1]; next[1] = next[0]; next[0] = last
      return {
        ...state,
        rotation: {
          teamId: state.activeTeamId ?? "",
          matchId: state.currentMatch?.id ?? "current",
          positions: next,
          rotationNum: ((state.rotation?.rotationNum ?? 0) % 6) + 1,
        },
      }
    }

    case "ROTATION_RESET":
      return {
        ...state,
        rotation: makeDefaultRotation(
          state.activeTeamId ?? "",
          state.currentMatch?.id ?? "current"
        ),
      }

    // ── Schedule cache ────────────────────────────────────────────────────────
    case "SCHEDULE_CACHE":
      return { ...state, scheduleCache: action.payload }

    // ── Trips ─────────────────────────────────────────────────────────────────
    case "TRIP_UPSERT": {
      const exists = state.trips.some((t) => t.id === action.payload.id)
      return {
        ...state,
        trips: exists
          ? state.trips.map((t) => t.id === action.payload.id ? action.payload : t)
          : [...state.trips, action.payload],
      }
    }

    case "TRIP_DELETE":
      return { ...state, trips: state.trips.filter((t) => t.id !== action.payload) }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  activeTeam: Team | null
  activePlayers: Player[]
}

const AppContext = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const hydrationGuard = useRef(false)
  const [hasHydrated, setHasHydrated] = useState(false)

  // Hydrate from localStorage on first mount
  useEffect(() => {
    if (hydrationGuard.current) return
    hydrationGuard.current = true
    const saved = loadState()
    if (saved) {
      dispatch({ type: "HYDRATE", payload: saved })
    }
    setHasHydrated(true)
  }, [])

  // Auto-save on every state change — only after hydration to avoid
  // overwriting localStorage with the blank INITIAL_STATE before HYDRATE fires.
  useEffect(() => {
    if (!hasHydrated) return
    saveState(state)
  }, [state, hasHydrated])

  // Ensure a current match exists for the active team — but only after
  // hydration, otherwise this fires before HYDRATE and resets the live score.
  useEffect(() => {
    if (!hasHydrated) return
    if (!state.activeTeamId) return
    if (!state.currentMatch || state.currentMatch.teamId !== state.activeTeamId) {
      dispatch({
        type: "SCORE_RESET",
        payload: { teamId: state.activeTeamId, opponentName: "Opponent TBD" },
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeTeamId, hasHydrated])

  const activeTeam = state.teams.find((t) => t.id === state.activeTeamId) ?? null
  const activePlayers = state.players.filter((p) => p.teamId === state.activeTeamId)

  return (
    <AppContext.Provider value={{ state, dispatch, activeTeam, activePlayers }}>
      {children}
    </AppContext.Provider>
  )
}
