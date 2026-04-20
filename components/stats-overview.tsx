import { Card, CardContent } from "@/components/ui/card"
import { Users, Trophy, Calendar, TrendingUp, DollarSign, MapPin } from "lucide-react"
import { FLAGS } from "@/lib/flags"

const stats = [
  {
    label: "Active Players",
    value: "72",
    change: "+8",
    changeLabel: "from last season",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
    emoji: "🏐",
    financial: false,
  },
  {
    label: "Teams",
    value: "6",
    change: "+1",
    changeLabel: "new this season",
    icon: Trophy,
    color: "text-accent",
    bgColor: "bg-accent/10",
    emoji: "🏆",
    financial: false,
  },
  {
    label: "Upcoming Events",
    value: "12",
    change: "3",
    changeLabel: "this month",
    icon: Calendar,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    emoji: "📅",
    financial: false,
  },
  {
    label: "Win Rate",
    value: "68%",
    change: "+5%",
    changeLabel: "vs last season",
    icon: TrendingUp,
    color: "text-accent",
    bgColor: "bg-accent/10",
    emoji: "📈",
    financial: false,
  },
  {
    label: "Revenue",
    value: "$42.5K",
    change: "+12%",
    changeLabel: "this quarter",
    icon: DollarSign,
    color: "text-primary",
    bgColor: "bg-primary/10",
    emoji: "💰",
    financial: true,
  },
  {
    label: "Cities Covered",
    value: "8",
    change: "CA, NV, AZ",
    changeLabel: "",
    icon: MapPin,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    emoji: "📍",
    financial: false,
  },
]

export function StatsOverview() {
  const visible = stats.filter((s) => !s.financial || FLAGS.showFinancials)

  return (
    <div className={`grid gap-4 ${visible.length === 5 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"}`}>
      {visible.map((stat) => (
        <Card key={stat.label} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-lg">{stat.emoji}</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xs">
                <span className={stat.color}>{stat.change}</span>
                {stat.changeLabel && (
                  <span className="text-muted-foreground"> {stat.changeLabel}</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
