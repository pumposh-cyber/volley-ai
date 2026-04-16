"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Car, Check, AlertCircle } from "lucide-react"

export function BookingCards() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Hotel Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium text-muted-foreground">HOTEL</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">CHECK-IN</span>
              <span className="font-medium text-foreground">Thu Apr 16 · 3:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CHECK-OUT</span>
              <span className="font-medium text-foreground">Sun Apr 19 · 11:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CONF #</span>
              <span className="font-mono font-medium text-foreground">5601396408 · PIN: 4389</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PRICELINE #</span>
              <span className="font-mono font-medium text-foreground">267-464-443-96</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 gap-1">
              <Check className="h-3 w-3" />
              Breakfast included
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 gap-1">
              <Check className="h-3 w-3" />
              Free parking
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 gap-1">
              <Check className="h-3 w-3" />
              Free WiFi
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 gap-1">
              <Check className="h-3 w-3" />
              Full kitchen
            </Badge>
          </div>

          <div className="flex items-center gap-2 pt-2 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Cancel by: Thu Apr 16 at 5:59 PM · 29% penalty after</span>
          </div>
        </CardContent>
      </Card>

      {/* Car Rental Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium text-muted-foreground">CAR RENTAL</CardTitle>
            </div>
            <span className="text-sm text-muted-foreground">San Jose, CA</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">PICK-UP</span>
              <span className="font-medium text-foreground">Thu Apr 16 · 12:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">DROP-OFF</span>
              <span className="font-medium text-foreground">Mon Apr 20 · 12:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TOTAL</span>
              <span className="font-bold text-lg text-foreground">$420.31</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CONF #</span>
              <span className="font-mono font-medium text-foreground">ALM-99284756</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 gap-1">
              <Check className="h-3 w-3" />
              Unlimited mileage
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 gap-1">
              <Check className="h-3 w-3" />
              AWD/4x4
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
