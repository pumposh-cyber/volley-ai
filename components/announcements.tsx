"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Pin, Clock, Settings2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Announcement {
  id: string
  author: string
  timestamp: string
  message: string
  isPinned?: boolean
}

const announcements: Announcement[] = [
  {
    id: "1",
    author: "Andrew",
    timestamp: "Apr 13, 2:20 PM",
    message: "Also, a couple of the freeways were closed yesterday and some of the families took a chance and drove home, some came home between 5-6 hrs and some closer to 10hrs. Please be on the look out for the weather. If the forecast is snowing, I strongly recommend you take a 4x4 vehicle as the 20 miles stretch up the summit can be dangerous. I hope the weather is better next week for the 15s.",
    isPinned: true,
  },
  {
    id: "2",
    author: "Coach T",
    timestamp: "Apr 14, 12:38 PM",
    message: "Hello Urban Fam we are still waiting for the schedule to be posted...just fyi once it is up myself or Coach Andrew will post",
    isPinned: true,
  },
  {
    id: "3",
    author: "Nia",
    timestamp: "Apr 13, 2:22 PM",
    message: "Does anyone have our schedule yet?",
  },
  {
    id: "4",
    author: "Coach T",
    timestamp: "Apr 13, 2:22 PM",
    message: "Looking it up now",
  },
  {
    id: "5",
    author: "Andrew",
    timestamp: "Apr 13, 2:23 PM",
    message: "it's not out yet...I think it's coming out tomorrow.",
  },
]

export function Announcements() {
  const pinnedAnnouncements = announcements.filter((a) => a.isPinned)
  const recentAnnouncements = announcements.filter((a) => !a.isPinned)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium text-muted-foreground">ANNOUNCEMENTS</CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pinned */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Pin className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">PINNED</span>
          </div>
          <ScrollArea className="h-48">
            <div className="space-y-3 pr-3">
              {pinnedAnnouncements.map((announcement) => (
                <div key={announcement.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{announcement.author}</span>
                    <span className="text-xs text-muted-foreground">{announcement.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{announcement.message}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Recent */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">RECENT</span>
          </div>
          <div className="space-y-3">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{announcement.author}</span>
                  <span className="text-xs text-muted-foreground">{announcement.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{announcement.message}</p>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full text-sm" size="sm">
          <Settings2 className="h-4 w-4 mr-1.5" />
          Manage & Import
        </Button>
      </CardContent>
    </Card>
  )
}
