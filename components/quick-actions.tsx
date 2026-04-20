"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  UserPlus,
  CalendarPlus,
  Send,
  FileText,
  CreditCard,
  ClipboardList,
  Download,
} from "lucide-react"
import { FLAGS } from "@/lib/flags"

interface QuickActionsProps {
  onOpenChat: () => void
}

const actions = [
  { icon: UserPlus,      label: "Add Player",        financial: false },
  { icon: CalendarPlus,  label: "Add Tournament",     financial: false },
  { icon: Send,          label: "Send Announcement",  financial: false },
  { icon: FileText,      label: "Generate Report",    financial: false },
  { icon: ClipboardList, label: "Create Roster",      financial: false },
  { icon: CreditCard,    label: "Collect Fees",       financial: true  },
]

export function QuickActions({ onOpenChat }: QuickActionsProps) {
  const visible = actions.filter((a) => !a.financial || FLAGS.showFinancials)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={onOpenChat}
          className="w-full justify-start gap-3 h-12 bg-primary hover:bg-primary/90"
        >
          <div className="p-1.5 rounded bg-primary-foreground/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="font-medium">Ask AI Assistant</p>
            <p className="text-xs opacity-80">Get help with anything</p>
          </div>
        </Button>

        <div className="grid grid-cols-2 gap-2 pt-2">
          {visible.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto py-3 px-3 flex-col items-start gap-1 hover:bg-muted/50"
            >
              <action.icon className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>

        <Button variant="ghost" className="w-full mt-2 text-muted-foreground">
          <Download className="w-4 h-4 mr-2" />
          Export All Data
        </Button>
      </CardContent>
    </Card>
  )
}
