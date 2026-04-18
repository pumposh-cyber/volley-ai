"use client"

import { cn } from "@/lib/utils"
import {
  MapPin,
  Utensils,
  ParkingCircle,
  Stethoscope,
  Info,
  Bus,
  Users,
  PackageSearch,
  ExternalLink,
  Navigation,
} from "lucide-react"

const VENUE_SECTIONS = [
  {
    icon: Info,
    label: "Registration",
    detail: "Guest Registration & Tickets area (Hall 1-2-3 zone) · Main Entrance off South Virginia St",
    color: "text-primary",
  },
  {
    icon: Utensils,
    label: "Food Court",
    detail: "Section B · Pizza, burgers, hotdogs, chicken tenders · Cash & card",
    color: "text-accent",
  },
  {
    icon: Users,
    label: "Players Lounge",
    detail: "Section E (yellow on map) · Tables & chairs first-come",
    color: "text-chart-3",
  },
  {
    icon: Navigation,
    label: "Coaches Hospitality",
    detail: "Section D (orange on map)",
    color: "text-chart-4",
  },
  {
    icon: Users,
    label: "Parents Lounge",
    detail: "Via elevator (purple dot on map) · upper level",
    color: "text-chart-5",
  },
  {
    icon: Stethoscope,
    label: "Medical Stations",
    detail: "2 locations: near Court 40 area & near Courts 21–22 (red dots)",
    color: "text-destructive",
  },
  {
    icon: PackageSearch,
    label: "Lost & Found",
    detail: "Registration Lobby area (green dot)",
    color: "text-muted-foreground",
  },
  {
    icon: Bus,
    label: "Bus / Taxi",
    detail: "Loading/unloading on south side of building",
    color: "text-muted-foreground",
  },
]

const PARKING_LOTS = [
  { name: "Lot A",      spaces: "111",  note: "Gate 1 · South Virginia",    best: false },
  { name: "Lot B/B1/B2",spaces: "751",  note: "West side · Peckham Ln",     best: false },
  { name: "Lot C ⭐",   spaces: "916",  note: "Largest · Gates 5 & 6",      best: true  },
  { name: "Lot E/F",    spaces: "378",  note: "East side · Gate 4",          best: false },
]

const COACH_TIPS = [
  { icon: "✅", text: "Skip heavy camp setup — RSCC has tables & chairs inside" },
  { icon: "✅", text: "Food court on-site (pizza, burgers, chicken tenders)" },
  { icon: "⚠️", text: "Check Donner Summit / I-80 conditions the night before" },
  { icon: "🚗", text: "AWD/4×4 recommended if snow forecast on summit" },
  { icon: "🕐", text: "Drive home 3.5–10 hrs depending on traffic/weather" },
  { icon: "⏰", text: "Arrive before 6:45 AM for AM wave parking" },
]

export function VenueGuide() {
  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-bold text-foreground">Reno-Sparks Convention Center</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">4590 S Virginia St, Reno, NV 89502</span>
            </div>
          </div>
          <a
            href="https://maps.google.com/?q=Reno+Sparks+Convention+Center"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary shrink-0 mt-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Maps
          </a>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <a
            href="https://maps.google.com/maps?saddr=current+location&daddr=Reno+Sparks+Convention+Center"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium"
          >
            <MapPin className="w-3 h-3" />
            Google Maps Directions
          </a>
          <a
            href="https://waze.com/ul?q=Reno+Sparks+Convention+Center&navigate=yes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-accent/10 text-accent px-3 py-1.5 rounded-full font-medium"
          >
            <MapPin className="w-3 h-3" />
            Waze
          </a>
        </div>
      </div>

      {/* Venue quick reference */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Venue Quick Reference</p>
        </div>
        <div className="divide-y divide-border">
          {VENUE_SECTIONS.map(({ icon: Icon, label, detail, color }) => (
            <div key={label} className="flex items-start gap-3 px-4 py-3">
              <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", color)} />
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parking */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border">
          <div className="flex items-center gap-2">
            <ParkingCircle className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Parking Guide</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {PARKING_LOTS.map((lot) => (
            <div
              key={lot.name}
              className={cn(
                "flex items-center justify-between px-4 py-3",
                lot.best && "bg-accent/5"
              )}
            >
              <div>
                <p className={cn("text-sm font-medium", lot.best ? "text-accent" : "text-foreground")}>
                  {lot.name}
                </p>
                <p className="text-xs text-muted-foreground">{lot.note}</p>
              </div>
              <p className={cn("text-sm font-semibold tabular-nums", lot.best ? "text-accent" : "text-muted-foreground")}>
                {lot.spaces}
              </p>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-muted/20 border-t border-border">
          <p className="text-xs text-muted-foreground">⏰ Arrive before 6:45 AM for AM wave parking</p>
        </div>
      </div>

      {/* Coach tips */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Coach Tips</p>
        <div className="space-y-2">
          {COACH_TIPS.map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-2 text-sm">
              <span className="shrink-0 text-base leading-5">{icon}</span>
              <span className="text-muted-foreground leading-relaxed">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Road conditions */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold text-primary mb-2">Road Conditions</p>
        <p className="text-sm text-muted-foreground mb-3">
          Check I-80 / Donner Summit conditions before driving to/from Reno.
        </p>
        <div className="flex gap-2 flex-wrap">
          <a
            href="https://quickmap.dot.ca.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium"
          >
            <Navigation className="w-3 h-3" />
            CalTrans QuickMap
          </a>
          <a
            href="https://www.accuweather.com/en/us/reno/89501/weather-forecast/330699"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full font-medium"
          >
            <ExternalLink className="w-3 h-3" />
            Reno Weather
          </a>
        </div>
      </div>

    </div>
  )
}

