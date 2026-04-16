"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp, Briefcase, Car, Shirt, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChecklistItem {
  id: string
  label: string
  checked: boolean
  status?: "done" | "critical" | "optional"
}

interface ChecklistSection {
  id: string
  title: string
  icon: React.ReactNode
  items: ChecklistItem[]
}

const initialSections: ChecklistSection[] = [
  {
    id: "bookings",
    title: "BOOKINGS",
    icon: <Briefcase className="h-4 w-4" />,
    items: [
      { id: "hotel", label: "Hotel reserved", checked: true, status: "done" },
      { id: "car", label: "Car rental confirmed", checked: true, status: "done" },
      { id: "hotelconf", label: "Hotel conf # saved", checked: false, status: "critical" },
      { id: "cancel", label: "Cancel deadline noted", checked: false, status: "critical" },
      { id: "entry", label: "Entry fees paid", checked: false },
    ],
  },
  {
    id: "travel",
    title: "TRAVEL PREP",
    icon: <Car className="h-4 w-4" />,
    items: [
      { id: "road", label: "Check road / CalTrans conditions", checked: false, status: "critical" },
      { id: "gas", label: "Gas up the car", checked: false },
      { id: "snacks", label: "Snacks & drinks packed", checked: false },
      { id: "charger", label: "Car charger & phone mount", checked: false },
      { id: "maps", label: "Download offline maps", checked: false, status: "optional" },
    ],
  },
  {
    id: "gear",
    title: "PLAYER GEAR",
    icon: <Shirt className="h-4 w-4" />,
    items: [
      { id: "uniform", label: "Full uniform (2 sets)", checked: false, status: "critical" },
      { id: "shoes", label: "2 pairs of court shoes", checked: false, status: "critical" },
      { id: "kneepads", label: "Kneepads", checked: false, status: "critical" },
      { id: "water", label: "Water bottle (filled)", checked: false },
      { id: "firstaid", label: "Athletic tape / first aid", checked: false },
    ],
  },
  {
    id: "parent",
    title: "PARENT ESSENTIALS",
    icon: <Users className="h-4 w-4" />,
    items: [
      { id: "chairs", label: "Folding chairs / bleacher cushion", checked: false },
      { id: "cash", label: "Cash for food & parking", checked: false },
      { id: "sunscreen", label: "Sunscreen & layers", checked: false },
      { id: "powerbank", label: "Phone charger / power bank", checked: false },
      { id: "aes", label: "AES app / bracket ready", checked: false },
      { id: "whatsapp", label: "WhatsApp notifications on", checked: false },
      { id: "snackcontrib", label: "Team snack contribution", checked: false, status: "optional" },
    ],
  },
]

export function PreTripChecklist() {
  const [sections, setSections] = useState(initialSections)
  const [isExpanded, setIsExpanded] = useState(true)

  const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0)
  const completedItems = sections.reduce(
    (acc, section) => acc + section.items.filter((item) => item.checked).length,
    0
  )
  const progressPercent = (completedItems / totalItems) * 100

  const toggleItem = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : section
      )
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader 
        className="flex flex-row items-center justify-between cursor-pointer py-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Pre-Trip Readiness</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">
              {completedItems} / {totalItems} complete
            </span>
            <Progress value={progressPercent} className="w-24 h-2" />
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-primary">{section.icon}</span>
                  <h3 className="text-xs font-semibold text-muted-foreground tracking-wider">
                    {section.title}
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-2.5">
                      <Checkbox
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(section.id, item.id)}
                        className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor={item.id}
                        className={cn(
                          "text-sm leading-tight cursor-pointer",
                          item.checked ? "line-through text-muted-foreground" : "text-foreground"
                        )}
                      >
                        {item.label}
                      </label>
                      {item.status === "done" && (
                        <Badge className="ml-auto bg-primary/20 text-primary text-[10px] px-1.5 py-0">
                          DONE
                        </Badge>
                      )}
                      {item.status === "critical" && (
                        <Badge className="ml-auto bg-destructive/20 text-destructive text-[10px] px-1.5 py-0">
                          CRITICAL
                        </Badge>
                      )}
                      {item.status === "optional" && (
                        <Badge variant="outline" className="ml-auto text-muted-foreground text-[10px] px-1.5 py-0">
                          OPTIONAL
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
