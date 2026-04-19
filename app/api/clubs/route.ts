import { NextResponse } from "next/server"
import { NCVA_CLUBS, type NCVAClub } from "@/lib/ncva-clubs"

// Set CLUBS_SHEET_ID in Vercel env vars to the Google Sheet ID.
// The sheet must be shared "Anyone with the link can view" and have these
// columns (row 1 = headers):
//   id, name, shortName, city, state, zip, address, phone, email, website, director, notes
//
// To bootstrap: GET /api/clubs?csv=1 returns a CSV you can paste into the sheet.

const SHEET_ID = process.env.CLUBS_SHEET_ID
const CSV_URL = SHEET_ID
  ? `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`
  : null

function parseCSV(text: string): NCVAClub[] {
  const lines = text.split("\n").filter((l) => l.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim())
  return lines.slice(1).map((line) => {
    const cols: string[] = []
    let cur = ""
    let inQ = false
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ }
      else if (ch === "," && !inQ) { cols.push(cur); cur = "" }
      else { cur += ch }
    }
    cols.push(cur)
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => { obj[h] = (cols[i] ?? "").replace(/^"|"$/g, "").trim() })
    return obj as unknown as NCVAClub
  }).filter((c) => c.id)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  // ?csv=1 — export seed CSV for pasting into Google Sheets
  if (searchParams.get("csv") === "1") {
    const { clubsToCSV } = await import("@/lib/ncva-clubs")
    return new Response(clubsToCSV(), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="ncva-clubs.csv"',
      },
    })
  }

  // If no sheet configured, return local fallback
  if (!CSV_URL) {
    return NextResponse.json({
      clubs: NCVA_CLUBS,
      source: "local",
    })
  }

  // Fetch from Google Sheets
  try {
    const res = await fetch(CSV_URL, {
      next: { revalidate: 3600 }, // re-fetch at most once per hour
      headers: { "User-Agent": "Mozilla/5.0" },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const text = await res.text()
    const clubs = parseCSV(text)
    if (clubs.length === 0) throw new Error("Sheet returned 0 rows")
    return NextResponse.json({ clubs, source: "sheet" })
  } catch (e) {
    // Fall back to local data so the app never breaks
    return NextResponse.json({
      clubs: NCVA_CLUBS,
      source: "local-fallback",
      error: String(e),
    })
  }
}
