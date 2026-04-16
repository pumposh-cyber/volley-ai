"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { PreTripChecklist } from "@/components/pre-trip-checklist"
import { BookingCards } from "@/components/booking-cards"
import { CoachNotes } from "@/components/coach-notes"
import { Announcements } from "@/components/announcements"
import { ConfirmationNumbers } from "@/components/confirmation-numbers"
import { VenueInfo } from "@/components/venue-info"
import { Button } from "@/components/ui/button"
import { Pencil, Ban, Trash2 } from "lucide-react"

export function TournamentDetail() {
  return (
    <div className="space-y-6">
      {/* Saved notice */}
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">8 announcements saved.</p>
      </div>

      {/* Back link and title */}
      <div>
        <Link 
          href="#" 
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Schedule
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">NCVA Far Western</h1>
          <Badge className="bg-primary/20 text-primary border-0">UPCOMING</Badge>
        </div>
      </div>

      {/* Pre-trip checklist */}
      <PreTripChecklist />

      {/* Booking cards and coach notes grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BookingCards />
          <ConfirmationNumbers />
          <VenueInfo />
        </div>
        <div className="space-y-6">
          <CoachNotes />
          <Announcements />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="h-4 w-4" />
          Edit Booking Details
        </Button>
        <div className="flex gap-2 ml-auto">
          <Button variant="secondary" size="sm">Edit</Button>
          <Button variant="outline" size="sm" className="text-amber-500 border-amber-500/50 hover:bg-amber-500/10 gap-1.5">
            <Ban className="h-4 w-4" />
            Cancel Tournament
          </Button>
          <Button variant="destructive" size="sm" className="gap-1.5">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground py-4 border-t border-border">
        UVAC Urban Volleyball 15 TS | <Link href="#" className="text-primary hover:underline">NCVA</Link> | <Link href="#" className="text-primary hover:underline">Power League Standings</Link>
      </footer>
    </div>
  )
}
