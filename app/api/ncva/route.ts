import { NextResponse } from "next/server"

const SHEET_ID = "1_Xog0a8Lqf6COYTfp0B8575teSsfQoy5"
const GID = "486749021"
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`

// CSV structure (row 4 is the real header row, rows 1-3 are title/section labels):
// Division | Place | Overall | | # | Team Name | Team Code |
// L1 Place | L1 PlaceDiv | L1 Division | L1 Points |
// L2 Place | L2 Division | L2 Points |
// L3 Place | L3 Division | L3 Points |
// Region Place | Region Division | Region Points |
// Total | Bid Notes | Far Westerns Bids

export interface NCVATeam {
  division: string   // Gold | American | Freedom
  place: number      // rank within division
  overall: number    // overall rank across all divisions
  name: string
  code: string
  l1Points: number
  l2Points: number
  l3Points: number
  regionPoints: number
  total: number
  bidNotes: string
}

function parseNum(s: string): number {
  return parseFloat(s.replace(/,/g, "")) || 0
}

function parseCSVLine(line: string): string[] {
  const cols: string[] = []
  let cur = ""
  let inQ = false
  for (const ch of line) {
    if (ch === '"') { inQ = !inQ }
    else if (ch === "," && !inQ) { cols.push(cur.trim()); cur = "" }
    else { cur += ch }
  }
  cols.push(cur.trim())
  return cols
}

export async function GET() {
  try {
    const res = await fetch(CSV_URL, {
      next: { revalidate: 300 },
      headers: { "User-Agent": "Mozilla/5.0" },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const text = await res.text()
    const lines = text.split("\n").filter((l) => l.trim())

    // Rows 0-2 are title/section labels; row 3 is the real header; data starts at row 4
    const teams: NCVATeam[] = []
    let currentDivision = ""

    for (let i = 4; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i])
      const name = cols[5]?.replace(/^"|"$/g, "") ?? ""
      if (!name) continue

      // Division label rows have content in col 0 but no team name sometimes;
      // carry forward the last seen division value
      if (cols[0] && cols[0] !== currentDivision) currentDivision = cols[0]

      teams.push({
        division: currentDivision || cols[0] || "Unknown",
        place: parseNum(cols[1]),
        overall: parseNum(cols[2]),
        name,
        code: cols[6] ?? "",
        l1Points: parseNum(cols[10]),
        l2Points: parseNum(cols[13]),
        l3Points: parseNum(cols[16]),
        regionPoints: parseNum(cols[19]),
        total: parseNum(cols[20]),
        bidNotes: cols[21]?.replace(/^"|"$/g, "") ?? "",
      })
    }

    return NextResponse.json({ teams, fetchedAt: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 })
  }
}
