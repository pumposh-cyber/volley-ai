"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building } from "lucide-react"

export function VenueInfo() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium text-muted-foreground">CITY</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-foreground">Reno, NV</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium text-muted-foreground">VENUE</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-foreground">Reno-Sparks Convention Center</p>
        </CardContent>
      </Card>
    </div>
  )
}
