"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList } from "lucide-react"

export function CoachNotes() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium text-muted-foreground">COACH NOTES</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground leading-relaxed">
          Skip heavy camp setup — RSCC has tables & chairs inside. Report time 7:00 AM for AM wave. 
          Wear full uniform on Day 1.
        </p>
      </CardContent>
    </Card>
  )
}
