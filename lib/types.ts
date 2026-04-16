export type PlayerPosition = "OH" | "MB" | "S" | "L" | "RS" | "OPP" | "DS"
export type StatKey = "K" | "E" | "A" | "B" | "D" | "SE"

export interface Team {
  id: string
  name: string
  shortName: string
  division: string
  coachName: string
  tm2EventId?: number
  tm2DivisionId?: number
  tm2TeamId?: number
}

export interface Guardian {
  id: string
  name: string
  phone?: string
  email?: string
  relation: "parent" | "guardian"
}

export interface Player {
  id: string
  teamId: string
  name: string
  number: number
  position: PlayerPosition
  guardians: Guardian[]
}

export interface SetScore {
  us: number
  them: number
}

export interface MatchHistoryEntry {
  sets: SetScore[]
  setIndex: number
  serving: "us" | "them"
}

export interface MatchScore {
  id: string
  teamId: string
  opponentName: string
  date: string
  sets: SetScore[]
  currentSet: number
  serving: "us" | "them"
  matchOver: boolean
  history: MatchHistoryEntry[]
}

export interface PlayerStatEntry {
  K: number
  E: number
  A: number
  B: number
  D: number
  SE: number
}

export interface MatchStats {
  matchId: string
  teamId: string
  stats: Record<number, PlayerStatEntry>
}

export interface RotationState {
  teamId: string
  matchId: string
  positions: number[]
  rotationNum: number
}

export interface TripHotel {
  name: string
  address: string
  confNumber: string
  checkIn: string
  checkOut: string
  phone: string
  notes: string
}

export interface TripCar {
  company: string
  confNumber: string
  pickupLocation: string
  notes: string
}

export interface TripPlan {
  id: string
  teamId: string
  tournamentName: string
  dates: string
  venue: string
  hotel: TripHotel
  car: TripCar
  notes: string
}

export interface TM2Cache {
  teamId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  cachedAt: string
}

export interface AppState {
  teams: Team[]
  activeTeamId: string | null
  players: Player[]
  currentMatch: MatchScore | null
  matchStats: MatchStats | null
  lastStatEntry: { playerNumber: number; stat: StatKey } | null
  rotation: RotationState | null
  scheduleCache: TM2Cache | null
  trips: TripPlan[]
}

export type AppAction =
  | { type: "HYDRATE"; payload: Partial<AppState> }
  | { type: "SET_ACTIVE_TEAM"; payload: string }
  | { type: "ADD_TEAM"; payload: Team }
  | { type: "UPDATE_TEAM"; payload: Team }
  | { type: "UPSERT_PLAYER"; payload: Player }
  | { type: "DELETE_PLAYER"; payload: string }
  | { type: "SCORE_ADD_POINT"; payload: "us" | "them" }
  | { type: "SCORE_UNDO" }
  | { type: "SCORE_RESET"; payload: { opponentName: string; teamId: string } }
  | { type: "STATS_RECORD"; payload: { playerNumber: number; stat: StatKey } }
  | { type: "STATS_UNDO" }
  | { type: "STATS_CLEAR_LAST" }
  | { type: "ROTATION_ROTATE" }
  | { type: "ROTATION_RESET" }
  | { type: "SCHEDULE_CACHE"; payload: TM2Cache }
  | { type: "TRIP_UPSERT"; payload: TripPlan }
  | { type: "TRIP_DELETE"; payload: string }
