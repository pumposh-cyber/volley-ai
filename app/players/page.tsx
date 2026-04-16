"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useApp } from "@/contexts/app-context"
import type { Player, Guardian, PlayerPosition } from "@/lib/types"
import {
  ArrowLeft,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit2,
  X,
  Save,
  Users,
  Phone,
  Mail,
  UserCircle,
} from "lucide-react"

const POSITIONS: PlayerPosition[] = ["OH", "MB", "S", "L", "RS", "OPP", "DS"]

const POSITION_LABELS: Record<PlayerPosition, string> = {
  OH: "Outside Hitter", MB: "Middle Blocker", S: "Setter",
  L: "Libero", RS: "Right Side", OPP: "Opposite", DS: "Defensive Spec.",
}

const POSITION_COLORS: Record<PlayerPosition, string> = {
  S:   "bg-primary/15 text-primary",
  OH:  "bg-accent/15 text-accent",
  MB:  "bg-chart-3/15 text-chart-3",
  L:   "bg-chart-5/15 text-chart-5",
  RS:  "bg-chart-4/15 text-chart-4",
  OPP: "bg-chart-4/15 text-chart-4",
  DS:  "bg-chart-5/15 text-chart-5",
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function emptyPlayer(teamId: string): Player {
  return {
    id: makeId(),
    teamId,
    name: "",
    number: 0,
    position: "OH",
    guardians: [],
  }
}

function emptyGuardian(): Guardian {
  return { id: makeId(), name: "", phone: "", email: "", relation: "parent" }
}

export default function PlayersPage() {
  const { state, dispatch, activeTeam, activePlayers } = useApp()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [draft, setDraft] = useState<Player | null>(null)

  const startAdd = () => {
    const p = emptyPlayer(state.activeTeamId ?? "")
    setDraft(p)
    setShowAddPlayer(true)
  }

  const startEdit = (player: Player) => {
    setDraft({ ...player, guardians: player.guardians.map((g) => ({ ...g })) })
    setEditingPlayer(player)
    setShowAddPlayer(true)
  }

  const savePlayer = () => {
    if (!draft || !draft.name.trim()) return
    dispatch({ type: "UPSERT_PLAYER", payload: { ...draft, name: draft.name.trim() } })
    setDraft(null)
    setEditingPlayer(null)
    setShowAddPlayer(false)
  }

  const deletePlayer = (id: string) => {
    dispatch({ type: "DELETE_PLAYER", payload: id })
    if (expandedId === id) setExpandedId(null)
  }

  const addGuardian = () => {
    if (!draft) return
    setDraft({ ...draft, guardians: [...draft.guardians, emptyGuardian()] })
  }

  const updateGuardian = (idx: number, field: keyof Guardian, value: string) => {
    if (!draft) return
    const updated = draft.guardians.map((g, i) =>
      i === idx ? { ...g, [field]: value } : g
    )
    setDraft({ ...draft, guardians: updated })
  }

  const removeGuardian = (idx: number) => {
    if (!draft) return
    setDraft({ ...draft, guardians: draft.guardians.filter((_, i) => i !== idx) })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-sm font-bold text-foreground">Players & Contacts</h1>
              <p className="text-[10px] text-muted-foreground">{activeTeam?.shortName ?? ""}</p>
            </div>
          </div>
          <Button size="sm" onClick={startAdd} className="gap-1.5">
            <Plus className="w-4 h-4" />
            Add Player
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-3 pb-16">
        {/* Roster summary */}
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{activePlayers.length} Players</p>
            <p className="text-xs text-muted-foreground">
              {activePlayers.filter((p) => p.guardians.length > 0).length} with contact info
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Coach</p>
            <p className="text-sm font-medium text-foreground">{activeTeam?.coachName}</p>
          </div>
        </div>

        {/* Player list */}
        {activePlayers
          .slice()
          .sort((a, b) => a.number - b.number)
          .map((player) => {
            const isOpen = expandedId === player.id
            return (
              <div key={player.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setExpandedId(isOpen ? null : player.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                    #{player.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{player.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {POSITION_LABELS[player.position]}
                      {player.guardians.length > 0 && ` · ${player.guardians.length} contact${player.guardians.length > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <span className={cn("text-xs font-bold px-2 py-1 rounded-full", POSITION_COLORS[player.position])}>
                    {player.position}
                  </span>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t border-border space-y-3 bg-muted/20">
                    {/* Contacts */}
                    {player.guardians.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Contacts</p>
                        {player.guardians.map((g) => (
                          <div key={g.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                            <UserCircle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground">{g.name}</p>
                              <p className="text-[10px] text-muted-foreground capitalize">{g.relation}</p>
                              {g.phone && (
                                <a href={`tel:${g.phone}`} className="flex items-center gap-1 text-xs text-primary mt-1">
                                  <Phone className="w-3 h-3" />{g.phone}
                                </a>
                              )}
                              {g.email && (
                                <a href={`mailto:${g.email}`} className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                  <Mail className="w-3 h-3" />{g.email}
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No contacts added yet.</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => startEdit(player)}>
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
                        onClick={() => deletePlayer(player.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

        {activePlayers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No players yet</p>
            <p className="text-sm mt-1">Tap "Add Player" to build your roster.</p>
          </div>
        )}
      </main>

      {/* Add/Edit sheet */}
      {showAddPlayer && draft && (
        <div className="fixed inset-0 z-50 flex items-end bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl mx-auto bg-card rounded-t-2xl border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Sheet header */}
            <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between px-5 py-4">
              <h2 className="font-bold text-foreground">
                {editingPlayer ? "Edit Player" : "Add Player"}
              </h2>
              <button onClick={() => { setShowAddPlayer(false); setDraft(null); setEditingPlayer(null) }}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Basic info */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Player Info</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      placeholder="First Last"
                      className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Jersey #</label>
                    <input
                      type="number"
                      value={draft.number || ""}
                      onChange={(e) => setDraft({ ...draft, number: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Position</label>
                  <div className="flex flex-wrap gap-2">
                    {POSITIONS.map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setDraft({ ...draft, position: pos })}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                          draft.position === pos
                            ? cn(POSITION_COLORS[pos], "border-current")
                            : "border-border text-muted-foreground hover:border-primary/30"
                        )}
                      >
                        {pos} <span className="hidden sm:inline">· {POSITION_LABELS[pos].split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Guardians */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Parents & Guardians
                  </p>
                  {draft.guardians.length < 4 && (
                    <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs" onClick={addGuardian}>
                      <Plus className="w-3 h-3" />
                      Add
                    </Button>
                  )}
                </div>

                {draft.guardians.map((g, idx) => (
                  <div key={g.id} className="rounded-lg border border-border p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">Contact {idx + 1}</p>
                      <button onClick={() => removeGuardian(idx)}>
                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>

                    {/* Relation */}
                    <div className="flex gap-2">
                      {(["parent", "guardian"] as const).map((rel) => (
                        <button
                          key={rel}
                          onClick={() => updateGuardian(idx, "relation", rel)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize",
                            g.relation === rel
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground"
                          )}
                        >
                          {rel}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={g.name}
                      onChange={(e) => updateGuardian(idx, "name", e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="tel"
                        value={g.phone ?? ""}
                        onChange={(e) => updateGuardian(idx, "phone", e.target.value)}
                        placeholder="Phone"
                        className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <input
                        type="email"
                        value={g.email ?? ""}
                        onChange={(e) => updateGuardian(idx, "email", e.target.value)}
                        placeholder="Email"
                        className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </div>
                ))}

                {draft.guardians.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No contacts yet — tap Add to add parents or guardians.
                  </p>
                )}
              </div>

              {/* Save */}
              <Button
                onClick={savePlayer}
                disabled={!draft.name.trim()}
                className="w-full gap-2"
              >
                <Save className="w-4 h-4" />
                {editingPlayer ? "Save Changes" : "Add to Roster"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
