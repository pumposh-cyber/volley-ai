"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LiveScoreTracker } from "@/components/live-score-tracker"
import { CourtRotation } from "@/components/court-rotation"
import { PlayerStatsPanel } from "@/components/player-stats-panel"
import { TodaysMatches } from "@/components/todays-matches"
import { LiveSchedule } from "@/components/live-schedule"
import { VenueGuide } from "@/components/venue-guide"
import { TripQuickReference } from "@/components/trip-quick-reference"
import {
  ArrowLeft,
  Volleyball,
  Trophy,
  Megaphone,
  BarChart3,
  RotateCw,
  Calendar,
  Sparkles,
  Share2,
  MapPin,
  Luggage,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function GameDayPage() {
  const [activeTab, setActiveTab] = useState("score")
  const [showShareBanner, setShowShareBanner] = useState(false)

  const handleShare = () => {
    setShowShareBanner(true)
    setTimeout(() => setShowShareBanner(false), 3000)
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: "VolleyAI - Urban VBC Game Day",
        text: "Track our live match at NCVA Far Western!",
        url: window.location.href,
      }).catch(() => null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Game Day Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
              <Volleyball className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-sm font-bold text-foreground leading-tight">Game Day Mode</h1>
              <p className="text-[10px] text-muted-foreground">UVAC · Far Westerns Wk 2</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link href="/board">
              <Button variant="ghost" size="icon" title="Team Board">
                <Megaphone className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Live status strip */}
        <div className="flex items-center justify-between bg-accent/10 border-t border-accent/20 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
            <span className="text-xs font-semibold text-accent">LIVE · 15 No Dinx · Apr 17-19</span>
          </div>
          <span className="text-xs text-muted-foreground">UVAC 15 TS</span>
        </div>
      </header>

      {/* Share toast */}
      {showShareBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm font-medium px-4 py-2 rounded-full shadow-xl animate-in fade-in slide-in-from-top-2">
          Link copied to clipboard!
        </div>
      )}

      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Horizontally scrollable tab bar for 6 tabs on mobile */}
        <div className="sticky top-[calc(56px+36px)] z-30 bg-card border-b border-border overflow-x-auto scrollbar-hide">
          <TabsList className="w-max min-w-full rounded-none bg-transparent h-12 flex px-0 gap-0">
            {[
              { value: "score",    icon: Trophy,   label: "Score"    },
              { value: "rotation", icon: RotateCw, label: "Rotation" },
              { value: "stats",    icon: BarChart3, label: "Stats"   },
              { value: "schedule", icon: Calendar, label: "Schedule" },
              { value: "venue",    icon: MapPin,   label: "Venue"    },
              { value: "trip",     icon: Luggage,  label: "Trip"     },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  "flex items-center gap-1.5 text-xs px-4 shrink-0",
                  "data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary",
                  "rounded-none h-full border-b-2 border-transparent"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="score" className="p-4 mt-0 focus-visible:outline-none">
            <LiveScoreTracker
              teamName="UVAC Urban Volleyball 15 TS"
              opponent="LAVA West 15 Premier CA"
            />
            <TeamMatchupCard />
          </TabsContent>

          <TabsContent value="rotation" className="p-4 mt-0 focus-visible:outline-none">
            <CourtRotation />
            <RotationTip />
          </TabsContent>

          <TabsContent value="stats" className="p-4 mt-0 focus-visible:outline-none">
            <PlayerStatsPanel />
          </TabsContent>

          <TabsContent value="schedule" className="p-4 mt-0 focus-visible:outline-none">
            <LiveSchedule />
          </TabsContent>

          <TabsContent value="venue" className="p-4 mt-0 focus-visible:outline-none">
            <VenueGuide />
          </TabsContent>

          <TabsContent value="trip" className="p-4 mt-0 focus-visible:outline-none">
            <TripQuickReference />
          </TabsContent>
        </div>
      </Tabs>

      {/* Bottom CTA for new clubs */}
      <div className="sticky bottom-0 z-30 bg-gradient-to-t from-card to-transparent pt-6 pb-4 px-4">
        <button
          onClick={() => {
            window.open("mailto:vishalraina@gmail.com?subject=VolleyAI%20Early%20Access&body=Hi!%20I%27m%20interested%20in%20VolleyAI%20for%20my%20club.", "_blank")
          }}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Get Early Access for Your Club
        </button>
      </div>
    </div>
  )
}

function TeamMatchupCard() {
  return (
    <div className="mt-4 rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Match Details</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          { label: "Tournament", value: "NCVA Far Westerns Wk 2" },
          { label: "Dates", value: "Apr 17-19, 2026" },
          { label: "Venue", value: "RSCC 47, Reno" },
          { label: "Division", value: "15 No Dinx" },
          { label: "Format", value: "Best of 3 Sets" },
          { label: "Head Coach", value: "Tamara Robertson" },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RotationTip() {
  return (
    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <p className="text-xs font-semibold text-primary mb-1">Pro Tip</p>
      <p className="text-sm text-muted-foreground">
        Tap <strong className="text-foreground">Rotate</strong> after winning a sideout to shift positions clockwise.
        Tap any player on the court to highlight them.
      </p>
    </div>
  )
}
