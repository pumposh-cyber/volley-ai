"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LiveScoreTracker } from "@/components/live-score-tracker"
import { LiveSchedule } from "@/components/live-schedule"
import { VenueGuide } from "@/components/venue-guide"
import { TeamRankings } from "@/components/team-rankings"
import {
  ArrowLeft,
  Volleyball,
  Megaphone,
  Trophy,
  Calendar,
  MapPin,
  Share2,
  Sparkles,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function GameDayPage() {
  const [activeTab, setActiveTab] = useState("schedule")
  const [showShareBanner, setShowShareBanner] = useState(false)
  // null = loading (don't show either state), true = active, false = completed
  const [tournamentActive, setTournamentActive] = useState<boolean | null>(null)
  const [tournamentMeta, setTournamentMeta] = useState<{ division: string; eventDates: string; eventName: string } | null>(null)

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
              <p className="text-[10px] text-muted-foreground">
                {tournamentMeta ? `${tournamentMeta.division} · ${tournamentMeta.eventDates}` : "UVAC 15 TS"}
              </p>
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

        {/* Live status strip — driven by TM2 match data */}
        {tournamentActive !== null && (
          <div className={cn(
            "flex items-center justify-between border-t px-4 py-2",
            tournamentActive
              ? "bg-accent/10 border-accent/20"
              : "bg-muted/40 border-border"
          )}>
            <div className="flex items-center gap-2">
              {tournamentActive ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                </span>
              ) : (
                <span className="inline-flex rounded-full h-2.5 w-2.5 bg-muted-foreground/40" />
              )}
              <span className={cn(
                "text-xs font-semibold",
                tournamentActive ? "text-accent" : "text-muted-foreground"
              )}>
                {tournamentActive ? "LIVE" : "COMPLETED"} · {tournamentMeta?.division ?? "15 No Dinx"} · {tournamentMeta?.eventDates ?? ""}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{tournamentMeta?.eventName ?? "UVAC 15 TS"}</span>
          </div>
        )}
      </header>

      {/* Share toast */}
      {showShareBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-sm font-medium px-4 py-2 rounded-full shadow-xl animate-in fade-in slide-in-from-top-2">
          Link copied to clipboard!
        </div>
      )}

      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="sticky top-[calc(56px+36px)] z-30 bg-card border-b border-border overflow-x-auto scrollbar-hide">
          <TabsList className="w-max min-w-full rounded-none bg-transparent h-12 flex px-0 gap-0">
            {[
              { value: "schedule", icon: Calendar,  label: "Schedule" },
              { value: "venue",    icon: MapPin,    label: "Venue"    },
              { value: "score",    icon: Trophy,    label: "Score"    },
              { value: "rankings", icon: BarChart3, label: "Rankings" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  "flex items-center gap-1.5 text-xs px-5 shrink-0",
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
          <TabsContent value="schedule" className="p-4 mt-0 focus-visible:outline-none">
            <LiveSchedule onStatusChange={(active, meta) => {
              setTournamentActive(active)
              if (meta) setTournamentMeta(meta)
            }} />
          </TabsContent>

          <TabsContent value="venue" className="p-4 mt-0 focus-visible:outline-none">
            <VenueGuide />
          </TabsContent>

          <TabsContent value="score" className="p-4 mt-0 focus-visible:outline-none">
            <LiveScoreTracker
              teamName="UVAC Urban Volleyball 15 TS"
              opponent="LAVA West 15 Premier CA"
            />
            <TeamMatchupCard meta={tournamentMeta} />
          </TabsContent>

          <TabsContent value="rankings" className="p-4 mt-0 focus-visible:outline-none">
            <TeamRankings />
          </TabsContent>
        </div>
      </Tabs>

      {/* Bottom CTA */}
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

function TeamMatchupCard({ meta }: { meta: { division: string; eventDates: string; eventName: string } | null }) {
  const rows = [
    { label: "Tournament", value: meta?.eventName ?? "—" },
    { label: "Dates",      value: meta?.eventDates ?? "—" },
    { label: "Venue",      value: "Courtside Sports, Manteca" },
    { label: "Division",   value: meta?.division ?? "—"    },
    { label: "Format",     value: "Best of 3 Sets"          },
  ]
  return (
    <div className="mt-4 rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Match Details</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {rows.map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
