"use client"

import { cn } from "@/lib/utils"
import {
  MapPin,
  Utensils,
  ParkingCircle,
  Info,
  ExternalLink,
  Navigation,
  Coffee,
} from "lucide-react"

const FOOD_NEARBY = [
  { name: "In-N-Out Burger",   distance: "0.8 mi",  note: "Quick drive-thru — go early" },
  { name: "Raising Cane's",    distance: "1.0 mi",  note: "Chicken fingers, great for teams" },
  { name: "Chick-fil-A",       distance: "1.2 mi",  note: "Fastest breakfast / lunch option" },
  { name: "Chipotle",          distance: "1.1 mi",  note: "Good for post-match fuel" },
  { name: "Five Guys",         distance: "1.4 mi",  note: "2140 Daniels St" },
  { name: "Panda Express",     distance: "1.3 mi",  note: "1467 Hulsey Way" },
]

const COACH_TIPS = [
  { icon: "✅", text: "Free surface parking directly around the building — arrive 15 min early for weekend tournaments" },
  { icon: "✅", text: "Courtside Sports is fully indoor & climate controlled — no weather concerns" },
  { icon: "✅", text: "Pack lunch for Day 1 — nearby spots get crowded at peak hours" },
  { icon: "✅", text: "Courtside 2 & 3 are the main match courts for this event" },
  { icon: "🚗", text: "From Bay Area: I-580 E → I-205 E → CA-120 E → Airport Way, Manteca (~1h 20min)" },
]

export function VenueGuide() {
  return (
    <div className="flex flex-col gap-4">

      {/* Header + directions */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-bold text-foreground">Courtside Sports Manteca</p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">450 Commerce Ct, Manteca, CA 95336</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">(209) 399-2200</p>
          </div>
          <a
            href="https://maps.google.com/?q=Courtside+Sports+450+Commerce+Ct+Manteca+CA"
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
            href="https://maps.google.com/maps?saddr=current+location&daddr=450+Commerce+Ct+Manteca+CA+95336"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium"
          >
            <MapPin className="w-3 h-3" />
            Google Maps
          </a>
          <a
            href="https://waze.com/ul?q=Courtside+Sports+Manteca&navigate=yes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-accent/10 text-accent px-3 py-1.5 rounded-full font-medium"
          >
            <Navigation className="w-3 h-3" />
            Waze
          </a>
        </div>
      </div>

      {/* Parking */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center gap-2">
          <ParkingCircle className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Parking</p>
        </div>
        <div className="px-4 py-4 space-y-2">
          <div className="flex items-start gap-3 bg-accent/5 rounded-lg p-3">
            <span className="text-accent font-bold text-sm shrink-0">★ Free</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Facility Surface Lot</p>
              <p className="text-xs text-muted-foreground">Free parking around the building · arrive 15 min early on tournament mornings</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg p-3">
            <span className="text-muted-foreground font-bold text-sm shrink-0">+</span>
            <div>
              <p className="text-sm font-medium text-foreground">Commerce Ct Street Parking</p>
              <p className="text-xs text-muted-foreground">Additional overflow along Commerce Ct</p>
            </div>
          </div>
        </div>
      </div>

      {/* Food */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center gap-2">
          <Utensils className="w-4 h-4 text-accent" />
          <p className="text-sm font-semibold text-foreground">Food Nearby</p>
        </div>
        <div className="divide-y divide-border">
          {FOOD_NEARBY.map(({ name, distance, note }) => (
            <div key={name} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">{note}</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground shrink-0 ml-3">{distance}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-muted/20 border-t border-border">
          <p className="text-xs text-muted-foreground">⏰ Pack lunch for Day 1 — nearby spots get busy at tournament peak hours</p>
        </div>
      </div>

      {/* Venue info */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Inside the Venue</p>
        </div>
        <div className="divide-y divide-border">
          {[
            { icon: Info,   label: "Courts",        detail: "Indoor climate-controlled courts · Courtside 2 & 3 for this event", color: "text-primary" },
            { icon: Info,   label: "Seating",        detail: "Bleacher seating along court perimeters",                          color: "text-chart-3" },
            { icon: Info,   label: "Restrooms",      detail: "Located near main entrance",                                       color: "text-muted-foreground" },
            { icon: Coffee, label: "Concessions",    detail: "Check facility on-site — bring snacks & water as backup",         color: "text-accent" },
          ].map(({ icon: Icon, label, detail, color }) => (
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

      {/* Directions note */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold text-primary mb-2">Driving from Bay Area</p>
        <p className="text-sm text-muted-foreground mb-3">
          I-580 E → I-205 E → CA-120 E → Airport Way. About 1h 20min from the East Bay.
          No mountain passes — straightforward drive.
        </p>
        <div className="flex gap-2 flex-wrap">
          <a
            href="https://maps.google.com/maps?saddr=current+location&daddr=450+Commerce+Ct+Manteca+CA+95336"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium"
          >
            <Navigation className="w-3 h-3" />
            Get Directions
          </a>
          <a
            href="https://www.accuweather.com/en/us/manteca/95336/weather-forecast/339573"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full font-medium"
          >
            <Coffee className="w-3 h-3" />
            Manteca Weather
          </a>
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

    </div>
  )
}
