import { NextResponse } from "next/server"

const SHEET_ID = "1_Xog0a8Lqf6COYTfp0B8575teSsfQoy5"
const GID = "486749021"
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`

function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  for (const line of text.split("\n")) {
    if (!line.trim()) continue
    const cols: string[] = []
    let cur = ""
    let inQuote = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        inQuote = !inQuote
      } else if (ch === "," && !inQuote) {
        cols.push(cur.trim())
        cur = ""
      } else {
        cur += ch
      }
    }
    cols.push(cur.trim())
    rows.push(cols)
  }
  return rows
}

export async function GET() {
  try {
    const res = await fetch(CSV_URL, {
      next: { revalidate: 300 },
      headers: { "User-Agent": "Mozilla/5.0" },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const text = await res.text()
    const rows = parseCSV(text)
    if (rows.length < 2) return NextResponse.json({ headers: [], rows: [] })

    const headers = rows[0]
    const data = rows.slice(1)
      .filter((r) => r.some((c) => c.trim()))
      .map((r) => {
        const obj: Record<string, string> = {}
        headers.forEach((h, i) => { obj[h] = r[i] ?? "" })
        return obj
      })

    return NextResponse.json({ headers, rows: data, fetchedAt: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 })
  }
}
