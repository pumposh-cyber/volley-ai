import { GoogleGenAI } from "@google/genai"
import { NextRequest } from "next/server"

const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

interface TM2Match {
  status: string
  startTime: number
  opponent?: { name: string }
  court?: { name: string }
  result?: { ourSetWins: number; theirSetWins: number }
}

async function fetchLiveScheduleSummary(origin: string): Promise<string | undefined> {
  try {
    const res = await fetch(`${origin}/api/tm2`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return undefined
    const data = await res.json()
    if (!data.matches?.length) return undefined

    const lines: string[] = data.matches.map((m: TM2Match) => {
      const time = new Date(m.startTime * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Los_Angeles",
      })
      const opp = m.opponent?.name ?? "TBD"
      const court = m.court?.name ?? ""
      if (m.status === "win" || m.status === "loss") {
        const r = m.result!
        return `  ${time} vs ${opp} — ${m.status.toUpperCase()} ${r.ourSetWins}-${r.theirSetWins}`
      }
      return `  ${time} vs ${opp} @ ${court} [${m.status}]`
    })

    const eventName = data.team?.eventName ?? "Current Tournament"
    return `${eventName}:\n${lines.join("\n")}`
  } catch {
    return undefined
  }
}

function buildSystemPrompt(liveSchedule?: string): string {
  const coachName = process.env.COACH_NAME || "Coach"
  const clubName = process.env.CLUB_NAME || "the volleyball club"
  const tournamentContext = process.env.TOURNAMENT_CONTEXT || ""

  const liveSection = liveSchedule
    ? `\nLive match schedule:\n${liveSchedule}\n`
    : ""

  return `You are VolleyAI, an expert coach assistant for ${clubName}. You help ${coachName} manage teams, plan tournaments, communicate with parents, and run game days smoothly.

Your tone is concise, warm, and practical. Use **bold** for key info. Keep responses under 200 words unless more detail is truly needed. Use bullet points for lists.
${tournamentContext ? `\nCurrent tournament context:\n${tournamentContext}` : ""}${liveSection}
You can help with:
- Tournament prep and logistics (hotel, car, parking, food, packing)
- Match scheduling and court assignments
- Parent announcements and communication
- Team management and player rosters
- Power League rankings and strategy
- Packing checklists for upcoming tournaments
- Travel planning (road stops, directions, weather)
- Game Day operations`
}

export async function POST(req: NextRequest) {
  const { message, history, teamName, teamDivision } = await req.json()
  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: "No message" }), { status: 400 })
  }

  const liveSchedule = await fetchLiveScheduleSummary(req.nextUrl.origin)

  let systemPrompt = buildSystemPrompt(liveSchedule)
  if (teamName) {
    systemPrompt += `\n\nActive team: ${teamName}${teamDivision ? ` — ${teamDivision}` : ""}`
  }

  let prompt = systemPrompt + "\n\n"
  for (const h of (history ?? []).slice(-10)) {
    const role = h.role === "user" ? "Coach" : "VolleyAI"
    prompt += `${role}: ${h.content}\n`
  }
  prompt += `Coach: ${message.trim()}\nVolleyAI:`

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents: prompt,
        })
        for await (const chunk of response) {
          const text = chunk.text
          if (text) controller.enqueue(encoder.encode(text))
        }
      } catch {
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
