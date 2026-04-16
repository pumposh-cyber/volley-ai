"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hash, ParkingCircle, Utensils } from "lucide-react"

export function ConfirmationNumbers() {
  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium text-muted-foreground">CONFIRMATION NUMBERS</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">HOTEL CONF #</p>
              <p className="font-mono font-semibold text-foreground">5601396408 · PIN 4389</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">PRICELINE #</p>
              <p className="font-mono font-semibold text-foreground">267-464-443-96</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">CAR RENTAL CONF #</p>
              <p className="font-mono font-semibold text-foreground">ALM-99284756</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">HOTEL PHONE</p>
              <p className="font-mono font-semibold text-foreground">775-852-5611</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ParkingCircle className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium text-muted-foreground">PARKING TIPS</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed">
              Lot C (916 spaces, Gates 5 & 6) is largest and closest. Arrive before 6:45 AM for AM wave parking.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium text-muted-foreground">FOOD NOTES</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed">
              Food court in Section B: pizza, burgers, chicken tenders. Pack lunch for Day 1 — lines are long opening morning.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
