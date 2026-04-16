"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useApp } from "@/contexts/app-context"
import type { TripPlan, TripHotel, TripCar } from "@/lib/types"
import {
  ArrowLeft,
  Hotel,
  Car,
  MapPin,
  Phone,
  FileText,
  Save,
  CheckCircle2,
  Copy,
  ExternalLink,
  Calendar,
  Hash,
} from "lucide-react"

function makeId() {
  return `trip-${Date.now()}`
}

const EMPTY_HOTEL: TripHotel = {
  name: "", address: "", confNumber: "", checkIn: "", checkOut: "", phone: "", notes: "",
}

const EMPTY_CAR: TripCar = {
  company: "", confNumber: "", pickupLocation: "", notes: "",
}

function emptyTrip(teamId: string): TripPlan {
  return {
    id: makeId(),
    teamId,
    tournamentName: "NCVA Far Westerns Wk 2",
    dates: "Apr 17-19, 2026",
    venue: "Reno Sparks Convention Center",
    hotel: { ...EMPTY_HOTEL },
    car: { ...EMPTY_CAR },
    notes: "",
  }
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (!value) return
    navigator.clipboard?.writeText(value).catch(() => null)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="text-muted-foreground hover:text-foreground transition-colors" title="Copy">
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  copyable,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  icon?: React.ReactNode
  copyable?: boolean
  hint?: string
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border border-border bg-muted/40 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40",
            icon ? "pl-9 pr-9" : "px-3",
            copyable && "pr-9"
          )}
        />
        {copyable && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CopyButton value={value} />
          </div>
        )}
      </div>
      {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}

export default function TripsPage() {
  const { state, dispatch, activeTeam } = useApp()
  const [saved, setSaved] = useState(false)

  // Get or create trip for active team
  const existingTrip = state.trips.find((t) => t.teamId === (state.activeTeamId ?? ""))
  const [trip, setTrip] = useState<TripPlan>(
    existingTrip ?? emptyTrip(state.activeTeamId ?? "")
  )

  // Sync if team changes
  useEffect(() => {
    const t = state.trips.find((t) => t.teamId === state.activeTeamId)
    setTrip(t ?? emptyTrip(state.activeTeamId ?? ""))
  }, [state.activeTeamId, state.trips])

  const save = () => {
    dispatch({ type: "TRIP_UPSERT", payload: { ...trip, teamId: state.activeTeamId ?? "" } })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateHotel = (field: keyof TripHotel, value: string) =>
    setTrip((t) => ({ ...t, hotel: { ...t.hotel, [field]: value } }))

  const updateCar = (field: keyof TripCar, value: string) =>
    setTrip((t) => ({ ...t, car: { ...t.car, [field]: value } }))

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
              <h1 className="text-sm font-bold text-foreground">Trip Planning</h1>
              <p className="text-[10px] text-muted-foreground">{activeTeam?.shortName ?? ""}</p>
            </div>
          </div>
          <Button size="sm" onClick={save} className="gap-1.5">
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save"}
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4 pb-16">

        {/* Tournament info */}
        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tournament</p>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Tournament Name"
              value={trip.tournamentName}
              onChange={(v) => setTrip((t) => ({ ...t, tournamentName: v }))}
              placeholder="NCVA Far Westerns Wk 2"
            />
            <Field
              label="Dates"
              value={trip.dates}
              onChange={(v) => setTrip((t) => ({ ...t, dates: v }))}
              placeholder="Apr 17-19, 2026"
              icon={<Calendar className="w-3.5 h-3.5" />}
            />
          </div>
          <Field
            label="Venue / Address"
            value={trip.venue}
            onChange={(v) => setTrip((t) => ({ ...t, venue: v }))}
            placeholder="Reno Sparks Convention Center"
            icon={<MapPin className="w-3.5 h-3.5" />}
            copyable
          />
          {trip.venue && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(trip.venue)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Maps
            </a>
          )}
        </section>

        {/* Hotel */}
        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Hotel className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hotel</p>
          </div>

          <Field
            label="Hotel Name"
            value={trip.hotel.name}
            onChange={(v) => updateHotel("name", v)}
            placeholder="Marriott Reno"
          />
          <Field
            label="Confirmation #"
            value={trip.hotel.confNumber}
            onChange={(v) => updateHotel("confNumber", v)}
            placeholder="ABC123456"
            icon={<Hash className="w-3.5 h-3.5" />}
            copyable
            hint="Tap the copy icon to quickly grab the conf number"
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Check-in"
              value={trip.hotel.checkIn}
              onChange={(v) => updateHotel("checkIn", v)}
              placeholder="Thu Apr 17 · 3PM"
              icon={<Calendar className="w-3.5 h-3.5" />}
            />
            <Field
              label="Check-out"
              value={trip.hotel.checkOut}
              onChange={(v) => updateHotel("checkOut", v)}
              placeholder="Sun Apr 20 · 12PM"
              icon={<Calendar className="w-3.5 h-3.5" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Hotel Phone"
              value={trip.hotel.phone}
              onChange={(v) => updateHotel("phone", v)}
              placeholder="+1 555-123-4567"
              type="tel"
              icon={<Phone className="w-3.5 h-3.5" />}
            />
            <Field
              label="Address"
              value={trip.hotel.address}
              onChange={(v) => updateHotel("address", v)}
              placeholder="123 Main St, Reno NV"
              icon={<MapPin className="w-3.5 h-3.5" />}
              copyable
            />
          </div>
          {trip.hotel.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(trip.hotel.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Directions to hotel
            </a>
          )}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
            <textarea
              value={trip.hotel.notes}
              onChange={(e) => updateHotel("notes", e.target.value)}
              placeholder="Parking lot behind hotel, free. Room block under UVAC."
              rows={2}
              className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>
        </section>

        {/* Car rental */}
        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Car Rental</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Company"
              value={trip.car.company}
              onChange={(v) => updateCar("company", v)}
              placeholder="Enterprise"
            />
            <Field
              label="Confirmation #"
              value={trip.car.confNumber}
              onChange={(v) => updateCar("confNumber", v)}
              placeholder="ENT-789012"
              icon={<Hash className="w-3.5 h-3.5" />}
              copyable
            />
          </div>
          <Field
            label="Pickup Location"
            value={trip.car.pickupLocation}
            onChange={(v) => updateCar("pickupLocation", v)}
            placeholder="Reno-Tahoe International Airport"
            icon={<MapPin className="w-3.5 h-3.5" />}
            copyable
          />
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
            <textarea
              value={trip.car.notes}
              onChange={(e) => updateCar("notes", e.target.value)}
              placeholder="Return with full tank. GPS included."
              rows={2}
              className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>
        </section>

        {/* General notes */}
        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">General Notes</p>
          </div>
          <textarea
            value={trip.notes}
            onChange={(e) => setTrip((t) => ({ ...t, notes: e.target.value }))}
            placeholder="Parking details, food options near venue, team meeting spots, emergency contacts…"
            rows={4}
            className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </section>

        {/* Quick summary card */}
        {(trip.hotel.confNumber || trip.car.confNumber) && (
          <section className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Quick Reference</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {trip.hotel.confNumber && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Hotel Conf #</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-semibold text-foreground">{trip.hotel.confNumber}</p>
                    <CopyButton value={trip.hotel.confNumber} />
                  </div>
                </div>
              )}
              {trip.car.confNumber && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Car Conf #</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-semibold text-foreground">{trip.car.confNumber}</p>
                    <CopyButton value={trip.car.confNumber} />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <Button onClick={save} className="w-full gap-2">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved to Device!" : "Save Trip Plan"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Saved locally on this device · works offline
        </p>
      </main>
    </div>
  )
}
