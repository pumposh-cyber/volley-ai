"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import {
  Hotel,
  Car,
  Copy,
  CheckCircle2,
  MapPin,
  Phone,
  ExternalLink,
  FileText,
  Luggage,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const CHECKLIST_ITEMS = [
  { id: "hotel_conf",   label: "Hotel conf # saved",            category: "bookings",  critical: true  },
  { id: "car_conf",     label: "Car rental confirmed",          category: "bookings",  critical: true  },
  { id: "cancel_noted",label: "Cancel deadline noted",          category: "bookings",  critical: true  },
  { id: "fees_paid",   label: "Entry fees paid",                category: "bookings",  critical: false },
  { id: "road_check",  label: "I-80 / Donner Summit checked",   category: "travel",    critical: true  },
  { id: "gas",         label: "Gas up the car",                 category: "travel",    critical: false },
  { id: "snacks",      label: "Snacks & drinks packed",         category: "travel",    critical: false },
  { id: "charger",     label: "Car charger & phone mount",      category: "travel",    critical: false },
  { id: "offline_maps",label: "Download offline maps",          category: "travel",    critical: false },
  { id: "uniform",     label: "Full uniform (2 sets)",          category: "gear",      critical: true  },
  { id: "shoes",       label: "2 pairs of court shoes",         category: "gear",      critical: true  },
  { id: "kneepads",    label: "Kneepads",                       category: "gear",      critical: true  },
  { id: "water",       label: "Water bottle (filled)",          category: "gear",      critical: false },
  { id: "tape",        label: "Athletic tape / first aid",      category: "gear",      critical: false },
  { id: "chairs",      label: "Folding chairs / bleacher cushion", category: "parent", critical: false },
  { id: "cash",        label: "Cash for food & parking",        category: "parent",    critical: false },
  { id: "sunscreen",   label: "Sunscreen & layers",             category: "parent",    critical: false },
  { id: "powerbank",   label: "Phone charger / power bank",     category: "parent",    critical: false },
  { id: "aes_app",     label: "AES app / bracket ready",        category: "parent",    critical: false },
  { id: "whatsapp",    label: "WhatsApp notifications on",      category: "parent",    critical: false },
  { id: "snack_contribution", label: "Team snack contribution", category: "parent",   critical: false },
  { id: "fees_entry",  label: "Entry passes / wristbands",      category: "parent",    critical: true  },
]

const CATEGORY_CONFIG = {
  bookings: { label: "Bookings",         emoji: "✅", color: "text-accent"     },
  travel:   { label: "Travel Prep",      emoji: "🚗", color: "text-primary"    },
  gear:     { label: "Player Gear",      emoji: "🏐", color: "text-chart-3"    },
  parent:   { label: "Parent Essentials",emoji: "👜", color: "text-chart-4"    },
}

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(value).catch(() => null)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="ml-2 text-muted-foreground hover:text-foreground transition-colors">
      {copied
        ? <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
        : <Copy className="w-3.5 h-3.5" />
      }
    </button>
  )
}

export function TripQuickReference() {
  const { state } = useApp()
  const trip = state.trips.find((t) => t.teamId === state.activeTeamId)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }))

  const total = CHECKLIST_ITEMS.length
  const done = CHECKLIST_ITEMS.filter((item) => checked[item.id]).length
  const pct = Math.round((done / total) * 100)

  const categories = Object.keys(CATEGORY_CONFIG) as (keyof typeof CATEGORY_CONFIG)[]

  return (
    <div className="flex flex-col gap-4">

      {/* Trip bookings */}
      {trip && (trip.hotel.confNumber || trip.car.confNumber || trip.hotel.name) ? (
        <div className="flex flex-col gap-3">

          {/* Hotel */}
          {trip.hotel.name && (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Hotel className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Hotel</p>
              </div>
              <p className="font-medium text-foreground">{trip.hotel.name}</p>
              {trip.hotel.confNumber && (
                <div className="flex items-center mt-2 p-2 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Conf #</p>
                    <p className="font-mono font-bold text-foreground">{trip.hotel.confNumber}</p>
                  </div>
                  <CopyBtn value={trip.hotel.confNumber} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                {trip.hotel.checkIn && (
                  <div>
                    <p className="text-muted-foreground">Check-in</p>
                    <p className="font-medium text-foreground">{trip.hotel.checkIn}</p>
                  </div>
                )}
                {trip.hotel.checkOut && (
                  <div>
                    <p className="text-muted-foreground">Check-out</p>
                    <p className="font-medium text-foreground">{trip.hotel.checkOut}</p>
                  </div>
                )}
              </div>
              {trip.hotel.phone && (
                <a href={`tel:${trip.hotel.phone}`} className="flex items-center gap-1.5 text-xs text-primary mt-2">
                  <Phone className="w-3 h-3" />{trip.hotel.phone}
                </a>
              )}
              {trip.hotel.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(trip.hotel.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mt-1"
                >
                  <MapPin className="w-3 h-3" />
                  {trip.hotel.address}
                  <ExternalLink className="w-2.5 h-2.5 ml-auto" />
                </a>
              )}
            </div>
          )}

          {/* Car */}
          {(trip.car.company || trip.car.confNumber) && (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Rental Car</p>
              </div>
              {trip.car.company && <p className="font-medium text-foreground">{trip.car.company}</p>}
              {trip.car.confNumber && (
                <div className="flex items-center mt-2 p-2 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Conf #</p>
                    <p className="font-mono font-bold text-foreground">{trip.car.confNumber}</p>
                  </div>
                  <CopyBtn value={trip.car.confNumber} />
                </div>
              )}
              {trip.car.pickupLocation && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(trip.car.pickupLocation)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mt-2"
                >
                  <MapPin className="w-3 h-3" />
                  {trip.car.pickupLocation}
                </a>
              )}
            </div>
          )}

          {/* General notes */}
          {trip.notes && (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">Notes</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{trip.notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <Luggage className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-foreground mb-1">No trip details yet</p>
          <p className="text-xs text-muted-foreground mb-3">Add hotel & car conf numbers for quick access here.</p>
          <Link href="/trips">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Luggage className="w-3.5 h-3.5" />
              Open Trip Planner
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Pre-trip checklist */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Pre-Trip Readiness</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{done}/{total}</span>
            <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  pct === 100 ? "bg-accent" : "bg-primary"
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {categories.map((cat) => {
          const cfg = CATEGORY_CONFIG[cat]
          const items = CHECKLIST_ITEMS.filter((i) => i.category === cat)
          return (
            <div key={cat} className="border-b border-border last:border-0">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/20">
                <span>{cfg.emoji}</span>
                <p className={cn("text-xs font-semibold uppercase tracking-wide", cfg.color)}>{cfg.label}</p>
              </div>
              {items.map((item) => (
                <label
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-muted/20 transition-colors",
                    checked[item.id] && "opacity-60"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={!!checked[item.id]}
                    onChange={() => toggle(item.id)}
                    className="w-4 h-4 rounded accent-primary shrink-0"
                  />
                  <span className={cn(
                    "text-sm flex-1",
                    checked[item.id] ? "line-through text-muted-foreground" : "text-foreground"
                  )}>
                    {item.label}
                  </span>
                  {item.critical && !checked[item.id] && (
                    <span className="text-[10px] font-semibold text-destructive border border-destructive/30 px-1.5 py-0.5 rounded">
                      Critical
                    </span>
                  )}
                </label>
              ))}
            </div>
          )
        })}

        {pct === 100 && (
          <div className="flex items-center gap-2 px-4 py-3 bg-accent/10 border-t border-accent/20">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <p className="text-sm font-semibold text-accent">You're all set! Have a great tournament!</p>
          </div>
        )}
      </div>

    </div>
  )
}
