"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Users, Trophy, ChevronRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const teams = [
  {
    name: "Urban 18U Premier",
    division: "18U",
    players: 12,
    maxPlayers: 12,
    record: "24-8",
    winRate: 75,
    nextEvent: "NCVA Far Western",
    nextEventDate: "Apr 16",
    status: "active",
    coaches: ["CA", "TM"],
  },
  {
    name: "Urban 16U Elite",
    division: "16U",
    players: 11,
    maxPlayers: 12,
    record: "18-6",
    winRate: 75,
    nextEvent: "Power League #4",
    nextEventDate: "Apr 20",
    status: "active",
    coaches: ["JD"],
  },
  {
    name: "Urban 15U Thunder",
    division: "15U",
    players: 12,
    maxPlayers: 12,
    record: "22-10",
    winRate: 69,
    nextEvent: "NCVA Far Western",
    nextEventDate: "Apr 16",
    status: "active",
    coaches: ["CA", "NK"],
  },
  {
    name: "Urban 14U Lightning",
    division: "14U",
    players: 10,
    maxPlayers: 12,
    record: "15-5",
    winRate: 75,
    nextEvent: "Regional Qualifier",
    nextEventDate: "Apr 23",
    status: "active",
    coaches: ["SM"],
  },
  {
    name: "Urban 13U Storm",
    division: "13U",
    players: 12,
    maxPlayers: 12,
    record: "12-4",
    winRate: 75,
    nextEvent: "Club Classic",
    nextEventDate: "Apr 27",
    status: "active",
    coaches: ["LP"],
  },
  {
    name: "Urban 12U Wave",
    division: "12U",
    players: 9,
    maxPlayers: 12,
    record: "8-2",
    winRate: 80,
    nextEvent: "Junior Cup",
    nextEventDate: "May 4",
    status: "recruiting",
    coaches: ["MR"],
  },
]

export function TeamsGrid() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Your Teams</CardTitle>
        <Button variant="outline" size="sm">
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {teams.map((team) => (
            <div key={team.name} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{team.name}</h3>
                    {team.status === "recruiting" && (
                      <Badge variant="secondary" className="text-xs bg-accent/10 text-accent">
                        Recruiting
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{team.division} Division</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Roster</DropdownMenuItem>
                    <DropdownMenuItem>Edit Team</DropdownMenuItem>
                    <DropdownMenuItem>Team Stats</DropdownMenuItem>
                    <DropdownMenuItem>Message Team</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{team.players}/{team.maxPlayers}</span>
                  <span className="text-muted-foreground">players</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{team.record}</span>
                  <span className="text-muted-foreground">record</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Win Rate</span>
                  <span className="text-foreground font-medium">{team.winRate}%</span>
                </div>
                <Progress value={team.winRate} className="h-1.5" />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Next Event</p>
                  <p className="text-sm font-medium text-foreground">{team.nextEvent}</p>
                  <p className="text-xs text-muted-foreground">{team.nextEventDate}</p>
                </div>
                <div className="flex -space-x-2">
                  {team.coaches.map((coach, i) => (
                    <Avatar key={i} className="w-7 h-7 border-2 border-card">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {coach}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
