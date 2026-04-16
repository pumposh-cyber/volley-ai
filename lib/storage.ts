import type { AppState } from "@/lib/types"

const STORAGE_KEY = "volleyai_v1"

export function loadState(): Partial<AppState> | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Partial<AppState>) : null
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return
  try {
    // Omit undo history from persistence to keep storage compact
    const toSave: AppState = {
      ...state,
      currentMatch: state.currentMatch
        ? { ...state.currentMatch, history: [] }
        : null,
      lastStatEntry: null,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch {
    // Quota exceeded — silently ignore
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
