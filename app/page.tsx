"use client"

import { useState } from "react"
import Link from "next/link"
import { CoachSidebar } from "@/components/coach-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsOverview } from "@/components/stats-overview"
import { TeamsGrid } from "@/components/teams-grid"
import { UpcomingTournaments } from "@/components/upcoming-tournaments"
import { RecentActivity } from "@/components/recent-activity"
import { QuickActions } from "@/components/quick-actions"
import { AIChatPanel } from "@/components/ai-chat-panel"
import { Button } from "@/components/ui/button"
import { Zap, Trophy, RotateCw, BarChart3, ArrowRight, Sparkles, X, Megaphone } from "lucide-react"

export default function CoachDashboard() {
  const [chatOpen, setChatOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showGameDayBanner, setShowGameDayBanner] = useState(true)

  return (
    <div className="flex min-h-screen bg-background">
      <CoachSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onOpenChat={() => setChatOpen(true)} />

        {/* LIVE Game Day Banner */}
        {showGameDayBanner && (
          <div className="relative bg-gradient-to-r from-accent/90 to-primary/90 text-white px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <p className="text-sm font-semibold">
                LIVE NOW · UVAC 15 TS at NCVA Far Western Wk2 · Apr 17-19 · RSCC Reno
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/game-day">
                <Button size="sm" className="bg-white text-primary hover:bg-white/90 gap-1.5 font-bold">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Open Game Day
                </Button>
              </Link>
              <button onClick={() => setShowGameDayBanner(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Game Day Feature Callout */}
            <GameDayFeatureCard />

            {/* Team Board CTA */}
            <TeamBoardCard />

            <StatsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TeamsGrid />
                <UpcomingTournaments />
              </div>
              <div className="space-y-6">
                <QuickActions onOpenChat={() => setChatOpen(true)} />
                <RecentActivity />
              </div>
            </div>

            {/* Early Access CTA */}
            <EarlyAccessCard />
          </div>
        </main>
      </div>
      <AIChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}

function TeamBoardCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-chart-3/15 shrink-0">
          <Megaphone className="w-5 h-5 text-chart-3" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">Team Board</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Post schedule updates, court changes & announcements. Share one URL with all parents.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/board">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Megaphone className="w-3.5 h-3.5" />
            Open Board
          </Button>
        </Link>
        <Button
          size="sm"
          className="gap-1.5 bg-chart-3 hover:bg-chart-3/90 text-white"
          onClick={() => {
            const url = `${window.location.origin}/board`
            navigator.clipboard?.writeText(url).catch(() => null)
            if (navigator.share) {
              navigator.share({ title: "UVAC 15 TS — Tournament Board", url }).catch(() => null)
            }
          }}
        >
          Share Link
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}

function GameDayFeatureCard() {
  return (
    <div className="rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/15 shrink-0">
            <Zap className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Game Day Mode</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track live scores, manage rotations, and record player stats — all from your phone during a match.
            </p>
            <div className="flex items-center gap-4 mt-3">
              {[
                { icon: Trophy, label: "Live scoring" },
                { icon: RotateCw, label: "Rotation tracker" },
                { icon: BarChart3, label: "Player stats" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Icon className="w-4 h-4 text-accent" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link href="/game-day">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 shrink-0">
            <Zap className="w-4 h-4" />
            Launch Game Day
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

function EarlyAccessCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mx-auto mb-4">
        <Sparkles className="w-7 h-7 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Love what you see?</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        VolleyAI is the all-in-one platform for volleyball clubs — tournament management, live game tracking, team communication, and AI-powered planning. Join clubs already saving 10+ hours per tournament weekend.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="mailto:vishalraina@gmail.com?subject=VolleyAI%20Early%20Access%20Request&body=Hi!%20I%20coach%20at%20[club%20name]%20and%20I%27m%20interested%20in%20early%20access%20to%20VolleyAI.">
          <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 px-8">
            <Sparkles className="w-4 h-4" />
            Request Early Access
          </Button>
        </a>
        <Link href="/game-day">
          <Button size="lg" variant="outline" className="gap-2 px-8">
            <Zap className="w-4 h-4" />
            Try Game Day Mode
          </Button>
        </Link>
      </div>
      <p className="text-xs text-muted-foreground mt-4">Free during beta · No credit card required</p>
    </div>
  )
}
