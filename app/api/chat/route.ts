import Anthropic from "@anthropic-ai/sdk"
import { NextRequest } from "next/server"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Static tournament context matching the NCVA Far Western 2026 booking
const TOURNAMENT_CONTEXT = `
Tournament: NCVA Far Western Week 2
Dates: Apr 17-19, 2026 (Fri-Sun)
City: Reno, NV
Venue: Reno-Sparks Convention Center (RSCC)

Hotel: Extended Stay America Suites
Address: 9795 Gateway Drive, Reno, NV 89521
Phone: 775-852-5611
Check-in: Thu Apr 16 · 3:00 PM
Check-out: Sun Apr 19 · 11:00 AM
Confirmation: 5601396408 | PIN: 4389 | Priceline: 267-464-443-96
Perks: Breakfast included, Free parking, Free WiFi, Full kitchen
Cancel deadline: Thu Apr 16 at 5:59 PM (29% penalty after)

Car: Alamo Full-size SUV AWD/4×4 (Chevy Tahoe / Ford Expedition)
Location: SJC – 1659 Airport Blvd, San Jose, CA
Pick-up: Thu Apr 16 · 12:00 PM | Drop-off: Mon Apr 20 · 12:00 PM
Total: $420.31 | Conf: ALM-99284756 | Unlimited mileage + AWD/4×4

Parking: Lot C (916 spaces, Gates 5 & 6) is largest and closest. Arrive before 6:45 AM for AM wave parking.
Food: Food court in Section B: pizza, burgers, chicken tenders. Pack lunch for Day 1 — lines are long opening morning.
Coach notes: Skip heavy camp setup — RSCC has tables & chairs inside. Report time 7:00 AM for AM wave. Wear full uniform on Day 1.

Packing checklist categories: Player Volleyball Gear, Player Personal & Recovery, Parent Tournament Day, Parent Logistics, Family Car & Hotel, Day-Before Checklist.
Key items: 2-3 jerseys (home + away + backup), court shoes + backup, knee pads, athletic tape, water bottle, electrolyte packets, snacks, foam roller, reusable ice packs, toiletries, hotel confirmation, carpool plan, portable charger.
`

const SYSTEM_PROMPT = `You are VolleyAI, an expert coach assistant for UVAC Urban Volleyball Club. You help Coach Andrew manage teams, plan tournaments, communicate with parents, and run game days smoothly.

Your tone is concise, warm, and practical. Use **bold** for key info. Keep responses under 200 words unless more detail is truly needed. Use bullet points for lists.

Current context:
${TOURNAMENT_CONTEXT}

You can help with:
- Tournament prep and logistics (hotel, car, parking, food, packing)
- Match scheduling and court assignments
- Parent announcements and communication
- Team management and player rosters
- Power League rankings and strategy
- Packing checklists for upcoming tournaments
- Travel planning (road stops, directions, weather)
- Game Day operations`

export async function POST(req: NextRequest) {
  const { message, history, teamName, teamDivision } = await req.json()
  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: "No message" }), { status: 400 })
  }

  const systemWithTeam = teamName
    ? SYSTEM_PROMPT + `\n\nActive team: ${teamName}${teamDivision ? ` — ${teamDivision}` : ""}`
    : SYSTEM_PROMPT

  const messages: Anthropic.MessageParam[] = [
    ...(history ?? []).slice(-10).map((h: { role: string; content: string }) => ({
      role: h.role === "user" ? ("user" as const) : ("assistant" as const),
      content: h.content,
    })),
    { role: "user" as const, content: message.trim() },
  ]

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 512,
          system: systemWithTeam,
          messages,
          stream: true,
        })
        for await (const chunk of response) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode("I'm having trouble connecting right now. Please try again.")
        )
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
