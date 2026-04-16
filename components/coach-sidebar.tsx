"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Volleyball,
  Zap,
  Megaphone,
  Luggage,
  ChevronDown,
} from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useState } from "react"

interface CoachSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",  href: "/" },
  { icon: Zap,             label: "Game Day",   href: "/game-day", badge: "LIVE", badgeColor: "bg-accent text-accent-foreground" },
  { icon: Megaphone,       label: "Team Board", href: "/board" },
  { icon: Users,           label: "Players",    href: "/players" },
  { icon: Luggage,         label: "Trip Plan",  href: "/trips" },
  { icon: Trophy,          label: "Tournaments",href: "#", badge: "3" },
  { icon: Calendar,        label: "Schedule",   href: "#" },
  { icon: BarChart3,       label: "Analytics",  href: "#" },
  { icon: Settings,        label: "Settings",   href: "#" },
]

export function CoachSidebar({ collapsed, onToggle }: CoachSidebarProps) {
  const pathname = usePathname()
  const { state, dispatch, activeTeam } = useApp()
  const [showTeamPicker, setShowTeamPicker] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col bg-card border-r border-border transition-all duration-300 shrink-0 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo + team selector */}
      <div className="flex items-center h-16 px-4 border-b border-border gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
          <Volleyball className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <button
            onClick={() => setShowTeamPicker((v) => !v)}
            className="flex-1 flex items-center justify-between gap-1 min-w-0 group"
          >
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm truncate leading-tight">
                {activeTeam?.shortName ?? "VolleyAI"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{activeTeam?.division ?? "Club Dashboard"}</p>
            </div>
            <ChevronDown className={cn(
              "w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform group-hover:text-foreground",
              showTeamPicker && "rotate-180"
            )} />
          </button>
        )}
      </div>

      {/* Team picker dropdown */}
      {!collapsed && showTeamPicker && (
        <div className="border-b border-border bg-muted/30">
          {state.teams.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                dispatch({ type: "SET_ACTIVE_TEAM", payload: team.id })
                setShowTeamPicker(false)
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-muted/50 transition-colors",
                team.id === state.activeTeamId && "bg-primary/8 text-primary font-medium"
              )}
            >
              <span className={cn(
                "w-2 h-2 rounded-full shrink-0",
                team.id === state.activeTeamId ? "bg-primary" : "bg-border"
              )} />
              <div className="min-w-0">
                <p className="truncate leading-tight">{team.shortName}</p>
                <p className="text-[10px] text-muted-foreground">{team.division}</p>
              </div>
            </button>
          ))}
          <Link href="/players">
            <button
              onClick={() => setShowTeamPicker(false)}
              className="w-full text-left px-4 py-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 border-t border-border"
            >
              <Users className="w-3 h-3" />
              Manage teams &amp; players
            </button>
          </Link>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href !== "#" && (
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          )
          const isGameDay = item.href === "/game-day"

          return (
            <Link key={item.label} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  collapsed && "justify-center px-2",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                  isGameDay && !isActive && "text-accent hover:text-accent hover:bg-accent/10",
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isGameDay && !isActive && "text-accent")} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "px-2 py-0.5 text-xs font-medium rounded-full",
                        item.badgeColor ?? "bg-primary/10 text-primary"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </aside>
  )
}
