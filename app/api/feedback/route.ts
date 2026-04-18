import { NextRequest, NextResponse } from "next/server"

const REPO = "pumposh-cyber/volley-ai"

export async function POST(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 })
  }

  const { category, message, page } = await req.json()

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "message is required" }, { status: 400 })
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "message too long (max 2000 chars)" }, { status: 400 })
  }

  const labelMap: Record<string, string> = {
    bug: "bug",
    feature: "enhancement",
    general: "feedback",
  }
  const label = labelMap[category] ?? "feedback"

  const title = `[${category ?? "feedback"}] ${message.slice(0, 72)}${message.length > 72 ? "…" : ""}`
  const body = [
    `**Category:** ${category ?? "general"}`,
    `**Page:** ${page ?? "unknown"}`,
    `**Submitted:** ${new Date().toISOString()}`,
    "",
    "---",
    "",
    message.trim(),
  ].join("\n")

  const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body, labels: [label, "user-feedback"] }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("GitHub issue creation failed:", err)
    return NextResponse.json({ error: "Failed to create issue" }, { status: 502 })
  }

  const issue = await res.json()
  return NextResponse.json({ url: issue.html_url }, { status: 201 })
}
