import { NextResponse } from "next/server"

const TM2_BASE = "https://tm2sign.com/api/public"
const EVENT_ID = 2170
const DIVISION_ID = 10559
const OUR_TEAM_ID = 266815

interface TM2Match {
  id: number
  friendly_label: string
  start_time: number
  end_time: number
  timezone: string
  scheduler_court_id: number
  scheduler_round_id: number
  scheduler_pool_bracket_id: number
  pool_bracket_type: string
  position_one_scheduler_team_id: number | null
  position_two_scheduler_team_id: number | null
  work_team_scheduler_team_id: number | null
  winning_scheduler_team_id: number | null
  losing_scheduler_team_id: number | null
  completed_time: string | null
  position_one_match_set_wins: number | null
  position_one_match_set_losses: number | null
  position_two_match_set_wins: number | null
  position_two_match_set_losses: number | null
  position_one_score_one: number | null
  position_one_score_two: number | null
  position_one_score_three: number | null
  position_two_score_one: number | null
  position_two_score_two: number | null
  position_two_score_three: number | null
  match_order: number
  is_score_sheet_checked_out: boolean
}

interface TM2Team {
  id: number
  name: string
  alternate_identifier: string
  state: string | null
  starting_seed_number: number | null
  final_finish_position_number: number | null
}

interface TM2Court {
  id: number
  name: string
  custom_name: string
  abbreviation: string
  location: string
}

async function fetchTM2<T>(path: string): Promise<T> {
  const res = await fetch(`${TM2_BASE}/${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 }, // cache 30s
  })
  if (!res.ok) throw new Error(`TM2 API error ${res.status}: ${path}`)
  return res.json()
}

export async function GET() {
  try {
    // Fetch matches for our team
    const [matches, allTeams, courts, rounds] = await Promise.all([
      fetchTM2<TM2Match[]>(
        `scheduler-matches?filter%5Bevent_id%5D=${EVENT_ID}&filter%5Bteam_id%5D=${OUR_TEAM_ID}`
      ),
      fetchTM2<TM2Team[]>(
        `scheduler-teams?filter%5Bevent_id%5D=${EVENT_ID}&filter%5Bevent_division_id%5D=${DIVISION_ID}`
      ),
      fetchTM2<TM2Court[]>(
        `scheduler-courts?filter%5Bevent_id%5D=${EVENT_ID}`
      ),
      fetchTM2<{ id: number; name: string; abbreviation: string; round_type: string }[]>(
        `scheduler-rounds?filter%5Bevent_id%5D=${EVENT_ID}&filter%5Bevent_division_id%5D=${DIVISION_ID}`
      ),
    ])

    // Build lookup maps
    const teamMap = new Map(allTeams.map((t) => [t.id, t]))
    const courtMap = new Map(courts.map((c) => [c.id, c]))

    const ourTeam = teamMap.get(OUR_TEAM_ID)

    // Build pool standings for teams in same pool bracket
    const poolBracketIds = new Set(matches.map((m) => m.scheduler_pool_bracket_id))

    // Get all matches in the same pool(s) for standings
    let poolMatches: TM2Match[] = []
    if (poolBracketIds.size > 0) {
      const bracketId = [...poolBracketIds][0]
      const bracketMatches = await fetchTM2<TM2Match[]>(
        `scheduler-matches?filter%5Bevent_id%5D=${EVENT_ID}&filter%5Bscheduler_pool_bracket_id%5D=${bracketId}`
      ).catch(() => [] as TM2Match[])
      poolMatches = bracketMatches
    }

    // Compute standings from pool matches
    const standingsMap = new Map<number, { wins: number; losses: number; setWins: number; setLosses: number }>()
    for (const m of poolMatches) {
      if (m.pool_bracket_type !== "pool") continue
      const p1 = m.position_one_scheduler_team_id
      const p2 = m.position_two_scheduler_team_id
      if (!p1 || !p2) continue
      if (!standingsMap.has(p1)) standingsMap.set(p1, { wins: 0, losses: 0, setWins: 0, setLosses: 0 })
      if (!standingsMap.has(p2)) standingsMap.set(p2, { wins: 0, losses: 0, setWins: 0, setLosses: 0 })

      if (m.winning_scheduler_team_id) {
        const winner = m.winning_scheduler_team_id
        const loser = winner === p1 ? p2 : p1
        standingsMap.get(winner)!.wins++
        standingsMap.get(loser)!.losses++
      }
      // Set wins
      const p1s = m.position_one_match_set_wins ?? 0
      const p2s = m.position_two_match_set_wins ?? 0
      standingsMap.get(p1)!.setWins += p1s
      standingsMap.get(p1)!.setLosses += p2s
      standingsMap.get(p2)!.setWins += p2s
      standingsMap.get(p2)!.setLosses += p1s
    }

    const standings = [...standingsMap.entries()]
      .map(([teamId, record]) => {
        const team = teamMap.get(teamId)
        return {
          teamId,
          teamName: team?.name ?? `Team ${teamId}`,
          isOurTeam: teamId === OUR_TEAM_ID,
          ...record,
        }
      })
      .sort((a, b) => b.wins - a.wins || b.setWins - a.setWins)
      .map((s, i) => ({ ...s, rank: i + 1 }))

    // Shape the matches for the UI
    const shapedMatches = matches.map((m) => {
      const isP1 = m.position_one_scheduler_team_id === OUR_TEAM_ID
      const isP2 = m.position_two_scheduler_team_id === OUR_TEAM_ID
      const isWorkTeam = m.work_team_scheduler_team_id === OUR_TEAM_ID
      const opponentId = isP1
        ? m.position_two_scheduler_team_id
        : isP2
        ? m.position_one_scheduler_team_id
        : null
      const opponent = opponentId ? teamMap.get(opponentId) : null
      const court = courtMap.get(m.scheduler_court_id)

      // Our scores
      const ourSetWins = isP1 ? m.position_one_match_set_wins : m.position_two_match_set_wins
      const theirSetWins = isP1 ? m.position_two_match_set_wins : m.position_one_match_set_wins
      const ourScores = isP1
        ? [m.position_one_score_one, m.position_one_score_two, m.position_one_score_three]
        : [m.position_two_score_one, m.position_two_score_two, m.position_two_score_three]
      const theirScores = isP1
        ? [m.position_two_score_one, m.position_two_score_two, m.position_two_score_three]
        : [m.position_one_score_one, m.position_one_score_two, m.position_one_score_three]

      // Determine status
      let status: "upcoming" | "in-progress" | "win" | "loss" | "work-team" | "done"
      if (isWorkTeam) {
        status = "work-team"
      } else if (m.completed_time) {
        status =
          m.winning_scheduler_team_id === OUR_TEAM_ID
            ? "win"
            : "loss"
      } else if (m.is_score_sheet_checked_out) {
        status = "in-progress"
      } else {
        status = "upcoming"
      }

      const roundInfo = rounds.find((r) => r.id === m.scheduler_round_id)

      return {
        id: m.id,
        friendlyLabel: m.friendly_label,
        startTime: m.start_time,
        endTime: m.end_time,
        timezone: m.timezone,
        matchOrder: m.match_order,
        court: {
          id: m.scheduler_court_id,
          name: court?.custom_name ?? court?.name ?? `Court ${m.scheduler_court_id}`,
          location: court?.location ?? "",
        },
        round: {
          id: m.scheduler_round_id,
          name: roundInfo?.name ?? "",
          type: roundInfo?.round_type ?? "",
        },
        poolBracketType: m.pool_bracket_type,
        status,
        isWorkTeam,
        opponent: opponent
          ? { id: opponent.id, name: opponent.name, state: opponent.state }
          : null,
        result:
          m.completed_time
            ? {
                ourSetWins: ourSetWins ?? 0,
                theirSetWins: theirSetWins ?? 0,
                setScores: ourScores
                  .map((s, i) => ({ us: s, them: theirScores[i] }))
                  .filter((s) => s.us !== null) as { us: number; them: number }[],
              }
            : null,
      }
    }).sort((a, b) => a.startTime - b.startTime)

    return NextResponse.json({
      team: {
        id: OUR_TEAM_ID,
        name: ourTeam?.name ?? "UVAC Urban Volleyball 15 TS",
        identifier: ourTeam?.alternate_identifier ?? "G15UVBAC1NC",
        seed: ourTeam?.starting_seed_number,
        division: "15 No Dinx",
        eventName: "2026 No Dinx/NCVA Girls Far Western Nat'l Qualifier - Wk 2",
        eventDates: "Apr 17-19, 2026",
      },
      matches: shapedMatches,
      standings,
      fetchedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error("[TM2 API]", err)
    return NextResponse.json(
      { error: "Failed to fetch TM2 data", message: String(err) },
      { status: 500 }
    )
  }
}
