"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Calendar, 
  Users, 
  ChevronRight,
  Hotel,
  Car,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

const tournaments = [
  {
    name: "NCVA Far Western",
    location: "Reno, NV",
    venue: "Reno-Sparks Convention Center",
    dates: "Apr 16-19, 2026",
    teams: ["18U Premier", "15U Thunder"],
    status: "upcoming",
    daysAway: 1,
    logistics: {
      hotel: true,
      car: true,
      checklist: 68,
    },
  },
  {
    name: "Power League #4",
    location: "San Jose, CA",
    venue: "San Jose Convention Center",
    dates: "Apr 20-21, 2026",
    teams: ["16U Elite"],
    status: "upcoming",
    daysAway: 5,
    logistics: {
      hotel: false,
      car: false,
      checklist: 25,
    },
  },
  {
    name: "Regional Qualifier",
    location: "Anaheim, CA",
    venue: "Anaheim Convention Center",
    dates: "Apr 23-25, 2026",
    teams: ["14U Lightning"],
    status: "upcoming",
    daysAway: 8,
    logistics: {
      hotel: false,
      car: false,
      checklist: 10,
    },
  },
]

export function UpcomingTournaments() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Upcoming Tournaments</CardTitle>
        <Button variant="outline" size="sm">
          View Calendar
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {tournaments.map((tournament) => (
          <div
            key={tournament.name}
            className="p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{tournament.name}</h3>
                  <Badge 
                    variant="secondary" 
                    className={
                      tournament.daysAway <= 2 
                        ? "bg-destructive/10 text-destructive" 
                        : "bg-primary/10 text-primary"
                    }
                  >
                    {tournament.daysAway === 1 ? "Tomorrow" : `In ${tournament.daysAway} days`}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {tournament.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {tournament.dates}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-2">
                {tournament.teams.map((team) => (
                  <Badge key={team} variant="secondary" className="text-xs">
                    {team}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-3 border-t border-border">
              <div className="flex items-center gap-1.5 text-sm">
                <Hotel className={`w-4 h-4 ${tournament.logistics.hotel ? "text-accent" : "text-muted-foreground"}`} />
                <span className={tournament.logistics.hotel ? "text-foreground" : "text-muted-foreground"}>
                  {tournament.logistics.hotel ? "Hotel Booked" : "No Hotel"}
                </span>
                {tournament.logistics.hotel && <CheckCircle2 className="w-3.5 h-3.5 text-accent" />}
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Car className={`w-4 h-4 ${tournament.logistics.car ? "text-accent" : "text-muted-foreground"}`} />
                <span className={tournament.logistics.car ? "text-foreground" : "text-muted-foreground"}>
                  {tournament.logistics.car ? "Car Reserved" : "No Car"}
                </span>
                {tournament.logistics.car && <CheckCircle2 className="w-3.5 h-3.5 text-accent" />}
              </div>
              <div className="flex items-center gap-1.5 text-sm ml-auto">
                {tournament.logistics.checklist < 50 ? (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                )}
                <span className="text-foreground font-medium">{tournament.logistics.checklist}%</span>
                <span className="text-muted-foreground">ready</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
