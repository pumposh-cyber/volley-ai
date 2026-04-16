import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const activities = [
  {
    user: "Sarah M.",
    initials: "SM",
    action: "registered for",
    target: "NCVA Far Western",
    team: "15U Thunder",
    time: "2 hours ago",
    type: "registration",
  },
  {
    user: "Coach Tom",
    initials: "CT",
    action: "updated roster for",
    target: "16U Elite",
    team: null,
    time: "3 hours ago",
    type: "roster",
  },
  {
    user: "Mike P.",
    initials: "MP",
    action: "paid tournament fee",
    target: "$185.00",
    team: "14U Lightning",
    time: "5 hours ago",
    type: "payment",
  },
  {
    user: "Lisa K.",
    initials: "LK",
    action: "requested carpool to",
    target: "Reno, NV",
    team: "18U Premier",
    time: "6 hours ago",
    type: "logistics",
  },
  {
    user: "James W.",
    initials: "JW",
    action: "submitted medical form for",
    target: "Emma W.",
    team: "13U Storm",
    time: "Yesterday",
    type: "document",
  },
  {
    user: "Coach Nina",
    initials: "CN",
    action: "posted practice schedule",
    target: "Week of Apr 14",
    team: "15U Thunder",
    time: "Yesterday",
    type: "schedule",
  },
]

const typeColors: Record<string, string> = {
  registration: "bg-primary/10 text-primary",
  roster: "bg-chart-4/10 text-chart-4",
  payment: "bg-accent/10 text-accent",
  logistics: "bg-chart-3/10 text-chart-3",
  document: "bg-chart-5/10 text-chart-5",
  schedule: "bg-primary/10 text-primary",
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3">
            <Avatar className={`w-8 h-8 ${typeColors[activity.type]}`}>
              <AvatarFallback className="text-xs bg-transparent">
                {activity.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {activity.team && (
                  <span className="text-xs text-muted-foreground">{activity.team}</span>
                )}
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
