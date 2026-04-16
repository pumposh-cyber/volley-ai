import { NextRequest, NextResponse } from "next/server"

export interface Announcement {
  id: string
  text: string
  type: "info" | "alert" | "win" | "schedule"
  author: string
  createdAt: string
  pinned: boolean
}

// In-memory store — persists for the lifetime of the server process.
// Perfect for single-day tournament use on a local network.
// Replace with a real DB (Upstash, Vercel KV, etc.) for production.
declare global {
  // eslint-disable-next-line no-var
  var __announcements: Announcement[] | undefined
}

function getStore(): Announcement[] {
  if (!global.__announcements) {
    global.__announcements = []
  }
  return global.__announcements
}

// GET  /api/announcements        — list all
// GET  /api/announcements?since= — poll for updates
export async function GET(req: NextRequest) {
  const since = req.nextUrl.searchParams.get("since")
  const store = getStore()
  const items = since
    ? store.filter((a) => a.createdAt > since)
    : [...store]
  return NextResponse.json(items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ))
}

// POST /api/announcements
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { text, type = "info", author = "Coach", pinned = false } = body

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "text is required" }, { status: 400 })
  }
  if (text.length > 500) {
    return NextResponse.json({ error: "text too long (max 500 chars)" }, { status: 400 })
  }

  const announcement: Announcement = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text: text.trim(),
    type,
    author,
    createdAt: new Date().toISOString(),
    pinned: Boolean(pinned),
  }

  getStore().push(announcement)
  return NextResponse.json(announcement, { status: 201 })
}

// DELETE /api/announcements?id=xxx
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const store = getStore()
  const idx = store.findIndex((a) => a.id === id)
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 })
  store.splice(idx, 1)
  return NextResponse.json({ ok: true })
}

// PATCH /api/announcements?id=xxx  — toggle pin
export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const store = getStore()
  const item = store.find((a) => a.id === id)
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 })
  const body = await req.json()
  if (typeof body.pinned === "boolean") item.pinned = body.pinned
  if (typeof body.text === "string") item.text = body.text.trim()
  return NextResponse.json(item)
}
