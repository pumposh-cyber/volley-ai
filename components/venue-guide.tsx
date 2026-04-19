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
  Tent,
  Coffee,
  ShoppingCart,
} from "lucide-react"

const PARKING_LOTS = [
  { name: "Lot C ⭐ Best",    spaces: "916", note: "Gates 5 & 6 · Largest lot",          best: true  },
  { name: "Lot B / B1 / B2", spaces: "751", note: "West side · Peckham Ln",              best: false },
  { name: "Lot E / F",       spaces: "378", note: "East side · Gate 4",                  best: false },
  { name: "Lot A",           spaces: "111", note: "Gate 1 · South Virginia St",          best: false },
]

const FOOD_ONSITE = [
  { item: "Pizza",            where: "Section B Food Court" },
  { item: "Burgers & Hotdogs",where: "Section B Food Court" },
  { item: "Chicken Tenders",  where: "Section B Food Court" },
]

const FOOD_NEARBY = [
  { name: "In-N-Out Burger",  distance: "0.5 mi",  note: "705 S Virginia St · drive-thru" },
  { name: "Starbucks",        distance: "0.3 mi",  note: "4825 Kietzke Ln" },
  { name: "Costco Food Court",distance: "1.2 mi",  note: "Bulk snacks for the team" },
  { name: "Raising Cane's",   distance: "0.8 mi",  note: "S Virginia St" },
  { name: "Panda Express",    distance: "0.6 mi",  note: "S Virginia St" },
]

const TAILGATE_SPOTS = [
  {
    name: "Lot C – North End",
    note: "Best tailgate zone · Gates 5 & 6 · Space for chairs, canopies, and team camp setup",
    best: true,
  },
  {
    name: "Convention Center Plaza",
    note: "Main entrance area · Covered outdoor seating · Good for parents between matches",
    best: false,
  },
  {
    name: "Lot B East Side",
    note: "Quieter area · Peckham Ln entrance · Some shade",
    best: false,
  },
]

const VENUE_SECTIONS = [
  { icon: Info,         label: "Registration & Tickets",  detail: "Hall 1-2-3 zone · Main Entrance off South Virginia St",                     color: "text-primary"       },
  { icon: Users,        label: "Players Lounge",           detail: "Section E (yellow on map) · Tables & chairs, first-come",                   color: "text-chart-3"       },
  { icon: Navigation,   label: "Coaches Hospitality",      detail: "Section D (orange on map)",                                                  color: "text-chart-4"       },
  { icon: Users,        label: "Parents Lounge",           detail: "Upper level via elevator (purple dot on map)",                               color: "text-chart-5"       },
  { icon: Stethoscope,  label: "Medical Stations",         detail: "Near Court 40 area & near Courts 21–22 (red dots on map)",                  color: "text-destructive"   },
  { icon: PackageSearch,label: "Lost & Found",             detail: "Registration Lobby area (green dot on map)",                                 color: "text-muted-foreground" },
  { icon: Bus,          label: "Bus / Taxi Drop-off",      detail: "South side of building",                                                     color: "text-muted-foreground" },
]

const COACH_TIPS = [
  { icon: "✅", text: "Lot C is the go-to — arrive before 6:45 AM for AM wave parking" },
  { icon: "✅", text: "Set up team camp in Lot C north end; bring canopy and folding chairs" },
  { icon: "✅", text: "Food court on-site (pizza, burgers, chicken tenders) · Cash & card" },
  { icon: "⚠️", text: "Check Donner Summit / I-80 road conditions the night before" },
  { icon: "🚗", text: "AWD/4×4 recommended if snow is forecast on summit" },
]

export function VenueGuide() {
  return (
    <div className="flex flex-col gap-4">

      {/* Header + directions */}
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
            Google Maps
          </a>
          <a
            href="https://waze.com/ul?q=Reno+Sparks+Convention+Center&navigate=yes"
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
                <p className={cn("text-sm font-semibold", lot.best ? "text-accent" : "text-foreground")}>
                  {lot.name}
                </p>
                <p className="text-xs text-muted-foreground">{lot.note}</p>
              </div>
              <p className={cn("text-sm font-bold tabular-nums shrink-0", lot.best ? "text-accent" : "text-muted-foreground")}>
                {lot.spaces}
              </p>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-muted/20 border-t border-border">
          <p className="text-xs text-muted-foreground font-medium">⏰ Arrive before 6:45 AM for AM wave parking</p>
        </div>
      </div>

      {/* Food */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center gap-2">
          <Utensils className="w-4 h-4 text-accent" />
          <p className="text-sm font-semibold text-foreground">Food</p>
        </div>

        {/* On-site */}
        <div className="px-4 py-3 bg-muted/10 border-b border-border">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Inside Venue · Section B</p>
          <div className="flex flex-wrap gap-2">
            {FOOD_ONSITE.map(({ item }) => (
              <span key={item} className="text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full font-medium">
                {item}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Cash & card accepted</p>
        </div>

        {/* Nearby */}
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
      </div>

      {/* Tailgate */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center gap-2">
          <Tent className="w-4 h-4 text-chart-3" />
          <p className="text-sm font-semibold text-foreground">Team Camp / Tailgate</p>
        </div>
        <div className="divide-y divide-border">
          {TAILGATE_SPOTS.map((spot) => (
            <div
              key={spot.name}
              className={cn("px-4 py-3", spot.best && "bg-chart-3/5")}
            >
              <p className={cn("text-sm font-semibold", spot.best ? "text-chart-3" : "text-foreground")}>
                {spot.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{spot.note}</p>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-muted/20 border-t border-border">
          <p className="text-xs text-muted-foreground">Bring: canopy tent · folding chairs · cooler · team snacks</p>
        </div>
      </div>

      {/* Venue quick reference */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Inside the Venue</p>
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

      {/* Road conditions */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-semibold text-primary mb-2">Road Conditions · I-80</p>
        <p className="text-sm text-muted-foreground mb-3">
          Check Donner Summit conditions before driving. AWD/4×4 recommended if snow is forecast.
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
            <Coffee className="w-3 h-3" />
            Reno Weather
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
