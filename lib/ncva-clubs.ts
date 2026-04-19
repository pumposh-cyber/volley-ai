// Club directory for NCVA 15U Girls Power League
// Source of truth: Google Sheet (fetched via /api/clubs)
// This file is the fallback / seed when the sheet is unavailable.

export interface NCVAClub {
  id: string
  name: string           // full official name
  shortName: string      // prefix used in team names (e.g. "Red Rock", "MVVC")
  city: string
  state: string
  zip?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  director?: string
  notes?: string
  isOurs?: boolean
}

// ─── Unique clubs extracted from all 136 teams in the 2025-26 Power League ────
// Teams from same club share the same shortName prefix.
// Blanks = not yet confirmed; fill in Google Sheet.

export const NCVA_CLUBS: NCVAClub[] = [
  // ── Our club ────────────────────────────────────────────────────────────────
  {
    id: "uvac",
    name: "Urban Volleyball Athletic Club",
    shortName: "UVAC",
    address: "1970 Morrill Ave",
    city: "San Jose",
    state: "CA",
    zip: "95132",
    website: "urbanvolleyballac.com",
    isOurs: true,
  },

  // ── A ───────────────────────────────────────────────────────────────────────
  {
    id: "absolute",
    name: "Absolute Volleyball Club",
    shortName: "Absolute",
    address: "2145 Francisco Blvd E",
    city: "San Rafael",
    state: "CA",
    zip: "94901",
    phone: "(415) 902-5511",
    website: "absolutevb.com",
    notes: "Teams: 15 Black, 15 Pink, 15 White",
  },
  {
    id: "abv-flash",
    name: "ABV Flash Volleyball",
    shortName: "ABV Flash",
    city: "",
    state: "CA",
    notes: "Teams: ABV Flash 15s - Dave",
  },
  {
    id: "academy",
    name: "Academy Volleyball Club",
    shortName: "Academy",
    address: "3151 Edison Way",
    city: "Redwood City",
    state: "CA",
    zip: "94063",
    phone: "(650) 384-9440",
    website: "academyvolleyball.com",
    notes: "Teams: North 15 National, West 15 National, West HP-1/2/3, North HP-1/2/3, West Gold-1. Also trains in Burlingame.",
  },
  {
    id: "aftershock",
    name: "Aftershock Volleyball Club",
    shortName: "Aftershock",
    address: "PO Box 8023",
    city: "Santa Rosa",
    state: "CA",
    zip: "95407",
    phone: "(707) 479-9645",
    email: "craig@aftershockvolleyball.com",
    website: "aftershockvolleyball.com",
    director: "Craig Hardisty",
    notes: "Teams: 15 Black, 15 Red",
  },

  // ── B ───────────────────────────────────────────────────────────────────────
  {
    id: "bay-area-eagles",
    name: "Bay Area Eagles Volleyball Club",
    shortName: "Bay Area Eagles",
    address: "427 Alvarado St",
    city: "San Leandro",
    state: "CA",
    zip: "94577",
    website: "bayareaeagles.com",
    notes: "Teams: 15U Mariah, 15U Oliver, 15U Juan. Trains at John Muir MS.",
  },
  {
    id: "blue-banner-bbv",
    name: "Blue Banner Beach Volleyball",
    shortName: "Blue Banner BBV",
    city: "",
    state: "CA",
    notes: "Teams: 15 - Abby, 15 - Lucky",
  },
  {
    id: "805-elite",
    name: "805 Elite Volleyball Club",
    shortName: "805 Elite",
    city: "Ventura",
    state: "CA",
    website: "805elite.com",
    notes: "805 = Ventura/Santa Barbara area code. Teams: 15 National",
  },

  // ── C ───────────────────────────────────────────────────────────────────────
  {
    id: "city-beach",
    name: "City Beach Volleyball Club",
    shortName: "City Beach",
    address: "4020 Technology Pl",
    city: "Fremont",
    state: "CA",
    zip: "94538",
    phone: "(408) 654-9330",
    website: "citybeachvb.com",
    notes: "Teams: 15-Black. Also has Santa Clara location.",
  },
  {
    id: "club-solano",
    name: "Club Solano Volleyball",
    shortName: "Club Solano",
    address: "PO Box 336",
    city: "Suisun City",
    state: "CA",
    zip: "94585",
    website: "clubsolano.com",
    notes: "Teams: 15 Maroon, 15 Black",
  },
  {
    id: "club-prime",
    name: "Club Prime Volleyball",
    shortName: "Prime",
    city: "Elk Grove",
    state: "CA",
    website: "clubprimevball.com",
    notes: "Teams: Prime 15 Morgan. Non-profit. Galt/Lodi/Elk Grove/Sacramento/Stockton area.",
  },

  // ── D ───────────────────────────────────────────────────────────────────────
  {
    id: "danville",
    name: "Danville Volleyball Club",
    shortName: "Danville",
    city: "Danville",
    state: "CA",
    notes: "Teams: Danville 15 Jenn",
  },
  {
    id: "delta-valley",
    name: "Delta Valley Volleyball Club",
    shortName: "Delta Valley",
    address: "PO Box 8322",
    city: "Stockton",
    state: "CA",
    zip: "95208",
    phone: "(209) 629-5898",
    email: "deltavalleyvb@gmail.com",
    website: "deltavalleyvbc.net",
    notes: "Teams: 15 Blue. Trains at 1230 S Central Ave, Lodi.",
  },
  {
    id: "diablo",
    name: "Diablo Valley Volleyball Club",
    shortName: "Diablo",
    address: "PO Box 69",
    city: "Concord",
    state: "CA",
    zip: "94522",
    phone: "(925) 451-6581",
    email: "info@diablovolleyball.org",
    website: "diablovolleyball.org",
    notes: "Teams: 15-1 Black, 15-2 Brentwood, 15-3 Green. Trains at Tice Valley Gym, Walnut Creek.",
  },
  {
    id: "dynamix",
    name: "Dynamix Volleyball Club",
    shortName: "Dynamix",
    city: "",
    state: "CA",
    notes: "Teams: Dynamix 15 Black",
  },

  // ── E ───────────────────────────────────────────────────────────────────────
  {
    id: "encore",
    name: "Encore Volleyball Club",
    shortName: "ENCORE",
    address: "2575 E Bayshore Rd",
    city: "Redwood City",
    state: "CA",
    zip: "94063",
    phone: "(650) 512-2304",
    email: "encoreleadership@encorevolleyball.com",
    website: "encorevolleyball.com",
    notes: "Teams: 15 Navy, 15 Red, 15 White",
  },
  {
    id: "evolve",
    name: "Evolve Volleyball Club",
    shortName: "Evolve",
    city: "",
    state: "CA",
    notes: "Teams: Evolve 15 Red",
  },

  // ── F ───────────────────────────────────────────────────────────────────────
  {
    id: "fpvc",
    name: "Foothill Pacific Volleyball Club",
    shortName: "FPVC",
    city: "",
    state: "CA",
    notes: "Teams: 15 REN Girls, 15 REN 2, 15 Jason, 15 Ferd",
  },

  // ── G ───────────────────────────────────────────────────────────────────────
  {
    id: "golden-bear",
    name: "Golden Bear Volleyball Club",
    shortName: "Golden Bear",
    address: "951-2 Old County Rd #161",
    city: "Belmont",
    state: "CA",
    zip: "94002",
    website: "goldenbearvolleyball.com",
    notes: "Teams: 15 Nike, 15 Blue",
  },
  {
    id: "golden-state",
    name: "Golden State Volleyball Club",
    shortName: "Golden State",
    city: "Manteca",
    state: "CA",
    email: "goldenstatevbc@gmail.com",
    website: "goldenstatevolleyballclub.com",
    notes: "Teams: Golden State 15 Black",
  },

  // ── H ───────────────────────────────────────────────────────────────────────
  {
    id: "high-tide",
    name: "High Tide Volleyball Club",
    shortName: "High Tide",
    city: "",
    state: "CA",
    notes: "Teams: High Tide 15 Ava",
  },

  // ── I ───────────────────────────────────────────────────────────────────────
  {
    id: "imua",
    name: "IMUA Volleyball Club",
    shortName: "IMUA",
    address: "266F Reservation Rd #505",
    city: "Marina",
    state: "CA",
    zip: "93933",
    website: "imuavbc.com",
    notes: "Teams: 15 National Veronica, 15 Felipe. Indoor, beach & grass. Founded 1988.",
  },
  {
    id: "itvc",
    name: "ITVC Volleyball",
    shortName: "ITVC",
    city: "",
    state: "CA",
    notes: "Teams: ITVC 15's",
  },

  // ── K ───────────────────────────────────────────────────────────────────────
  {
    id: "kalani",
    name: "Kalani Volleyball Club",
    shortName: "Kalani",
    city: "",
    state: "CA",
    notes: "Teams: Kalani 14/15s - ileana",
  },
  {
    id: "kamikaze",
    name: "Kamikaze Volleyball Club",
    shortName: "Kamikaze",
    city: "",
    state: "CA",
    notes: "Teams: Kamikaze 15 Andoni",
  },

  // ── L ───────────────────────────────────────────────────────────────────────
  {
    id: "lakas",
    name: "Lakas Volleyball Club",
    shortName: "Lakas",
    address: "3532 Arden Rd",
    city: "Hayward",
    state: "CA",
    zip: "94545",
    email: "lakasvb@gmail.com",
    website: "lakasvb.com",
    notes: "Teams: 15 Elite, 15 Power. Trains at House of Hustle. Mailing: 4082 Polonius Cir, Fremont 94555.",
  },
  {
    id: "lava-west",
    name: "LAVA West Volleyball Club",
    shortName: "LAVA West",
    city: "Los Angeles",
    state: "CA",
    website: "lavavolleyball.com",
    notes: "SoCal club",
  },
  {
    id: "legacy-one",
    name: "Legacy One Volleyball Club",
    shortName: "Legacy One",
    city: "",
    state: "CA",
    notes: "Teams: Legacy One 15-1",
  },
  {
    id: "legend",
    name: "Legend Volleyball Club",
    shortName: "Legend",
    city: "",
    state: "CA",
    notes: "Teams: Legend 15",
  },

  // ── M ───────────────────────────────────────────────────────────────────────
  {
    id: "main-beach",
    name: "Main Beach Volleyball Club",
    shortName: "Main Beach",
    city: "",
    state: "CA",
    notes: "Teams: 15 Elite, 15 Power",
  },
  {
    id: "mango-tide",
    name: "MANGO TIDE Volleyball",
    shortName: "MANGO TIDE",
    city: "",
    state: "CA",
    notes: "Teams: MANGO TIDE 15 BREEZE",
  },
  {
    id: "manteca-flight",
    name: "Manteca Flight Volleyball Club",
    shortName: "Manteca Flight",
    city: "Manteca",
    state: "CA",
    notes: "Teams: U14/U15 CASH, U14/U15 DAVID",
  },
  {
    id: "marin",
    name: "Marin Juniors Volleyball Club",
    shortName: "MARIN",
    address: "PO Box 151674",
    city: "San Rafael",
    state: "CA",
    zip: "94915",
    phone: "(415) 250-7480",
    website: "marinjuniors.com",
    notes: "Teams: 15 Black, 15 Green, 15 Slate. Trains at Pickleweed Community Center & Marin Academy HS.",
  },
  {
    id: "mvvc",
    name: "Mountain View Volleyball Club",
    shortName: "MVVC",
    address: "477 N Mathilda Ave",
    city: "Sunnyvale",
    state: "CA",
    zip: "94085",
    phone: "(408) 329-0488",
    website: "mvvclub.com",
    director: "Mike Rubin",
    email: "mikerubin@mvvclub.com",
    notes: "Teams: G 15 Red, G 15 Black, G 15 White, G 15 Pink, G 15 Purple",
  },

  // ── N ───────────────────────────────────────────────────────────────────────
  {
    id: "ncvc",
    name: "NCVC Volleyball Club",
    shortName: "NCVC",
    city: "",
    state: "CA",
    notes: "Teams: NCVC 15-Mizuno",
  },
  {
    id: "norcal",
    name: "NorCal Volleyball Club",
    shortName: "NorCal",
    address: "789 N Canyons Pkwy",
    city: "Livermore",
    state: "CA",
    zip: "94551",
    phone: "(925) 708-4654",
    email: "mhnorcal@gmail.com",
    website: "norcalvbc.com",
    notes: "Teams: 15-1 Black, 15-2 Blue, 15-3 White",
  },
  {
    id: "norstar",
    name: "NorStar Volleyball Club",
    shortName: "NorStar",
    city: "",
    state: "CA",
    notes: "Teams: NorStar 15-1",
  },
  {
    id: "north-coast",
    name: "North Coast Volleyball Club",
    shortName: "North Coast",
    city: "",
    state: "CA",
    notes: "Teams: North Coast 15 Orange",
  },
  {
    id: "nsdvb",
    name: "NSDVB Volleyball",
    shortName: "NSDVB",
    city: "",
    state: "CA",
    notes: "Teams: NSDVB 15's",
  },

  // ── O ───────────────────────────────────────────────────────────────────────
  {
    id: "omni",
    name: "OMNI Volleyball Club",
    shortName: "OMNI",
    city: "",
    state: "CA",
    notes: "Teams: 15 National, 15 Elite",
  },
  {
    id: "ova",
    name: "OVA Volleyball Club",
    shortName: "OVA",
    city: "",
    state: "CA",
    notes: "Teams: 15 National Dani/Veronica, 15 Elite Tisha/Donald, 15 Power Ginger",
  },

  // ── P ───────────────────────────────────────────────────────────────────────
  {
    id: "panda",
    name: "Panda Volleyball Club",
    shortName: "Panda",
    address: "1071 Del Cambre Dr",
    city: "San Jose",
    state: "CA",
    zip: "95129",
    phone: "(408) 685-1589",
    email: "pandavolleyball2022@gmail.com",
    website: "pandavolleyballclub.net",
    director: "Yilin Shangguan",
    notes: "Teams: 15-1. Also trains at 4120 Middlefield Rd, Palo Alto.",
  },
  {
    id: "prism",
    name: "PRISM Volleyball Club",
    shortName: "PRISM",
    city: "",
    state: "CA",
    notes: "Teams: PRISM 15 - Gab",
  },
  {
    id: "pulse",
    name: "Pulse Volleyball Club",
    shortName: "Pulse",
    city: "",
    state: "CA",
    notes: "Teams: 15 Black, 15 Pink",
  },

  // ── R ───────────────────────────────────────────────────────────────────────
  {
    id: "rage",
    name: "RAGE Volleyball Club",
    shortName: "RAGE",
    address: "811 W River Rd",
    city: "Ripon",
    state: "CA",
    zip: "95366",
    website: "ragevball.com",
    notes: "Teams: 15 CARMELO, 15 MIKA, 15 KAYLA, 15 CAT. Also in Lodi and Livermore.",
  },
  {
    id: "red-rock",
    name: "Red Rock Volleyball Club",
    shortName: "Red Rock",
    address: "3151 Edison Way",
    city: "Redwood City",
    state: "CA",
    zip: "94063",
    phone: "(650) 868-1832",
    email: "travel@redrockvolleyball.com",
    website: "redrockvolleyball.com",
    notes: "Teams: Chi/Campbell, Jamie/Walnut Creek, Harley/Redwood City, Jason/SF, Matt/Walnut Creek, Devin HYBRID/Redwood City, Joey/Redwood City, Leandro/Redwood City, Halsey/Walnut Creek, Alissa/Martinez",
  },

  // ── S ───────────────────────────────────────────────────────────────────────
  {
    id: "samba",
    name: "Samba Volleyball Club",
    shortName: "Samba",
    city: "",
    state: "CA",
    notes: "Teams: Samba 15",
  },
  {
    id: "sand",
    name: "SAND Volleyball Club",
    shortName: "SAND",
    city: "",
    state: "CA",
    notes: "Teams: 15-Gold, 15-Black",
  },
  {
    id: "sand-santa-cruz",
    name: "Sand Santa Cruz",
    shortName: "Sand Santa Cruz",
    city: "Santa Cruz",
    state: "CA",
    notes: "Teams: Sand Santa Cruz 15 Luccionna",
  },
  {
    id: "sf-elite",
    name: "SF Elite Volleyball Club",
    shortName: "SF Elite",
    address: "1422 San Mateo Ave",
    city: "South San Francisco",
    state: "CA",
    zip: "94080",
    phone: "(650) 273-1055",
    email: "info@elitesportscenters.com",
    website: "sfelitevbc.com",
    notes: "Teams: 15 Saga, 15 Manalo, 15 Zahra",
  },
  {
    id: "sf-juniors",
    name: "SF Juniors Volleyball Club",
    shortName: "SF Juniors",
    city: "San Francisco",
    state: "CA",
    notes: "Teams: SF Juniors 15 Black",
  },
  {
    id: "sf-stars",
    name: "SF Stars Volleyball Club",
    shortName: "SF Stars",
    city: "San Francisco",
    state: "CA",
    notes: "Teams: SF STARS 15",
  },
  {
    id: "sf-tremors",
    name: "SF Tremors Volleyball Club",
    shortName: "SF TREMORS",
    address: "999 Brotherhood Way",
    city: "San Francisco",
    state: "CA",
    zip: "94132",
    website: "sftremors.com",
    notes: "Teams: SF TREMORS 15 WOLVERINES. Trains at Holy Trinity Gym.",
  },
  {
    id: "slainte",
    name: "Slainte Volleyball Club",
    shortName: "Slainte",
    address: "601 Van Ness Ave Ste E730",
    city: "San Francisco",
    state: "CA",
    zip: "94109",
    phone: "(650) 755-1707",
    website: "slaintevolleyball.org",
    notes: "Teams: 15-NATIONAL, 15-BLACK, 15-FOREST, 15-WHITE",
  },
  {
    id: "spark",
    name: "Spark Volleyball Club",
    shortName: "Spark",
    city: "Lodi",
    state: "CA",
    zip: "95242",
    phone: "(209) 401-7418",
    email: "svcmail88@gmail.com",
    website: "sparkvolleyball.com",
    director: "Juan Martinez",
    notes: "Teams: 15-1 Natalie, 15-2 Anthony",
  },
  {
    id: "spvc",
    name: "SPVC Volleyball Club",
    shortName: "SPVC",
    city: "",
    state: "CA",
    notes: "Teams: SPVC 15 Adidas",
  },
  {
    id: "stingray",
    name: "Stingray Volleyball Club",
    shortName: "Stingray",
    city: "",
    state: "CA",
    notes: "Teams: Stingray 15 Black",
  },
  {
    id: "synergy-force",
    name: "SynergyForce Volleyball Club",
    shortName: "SynergyForce",
    address: "10050 Foothills Blvd",
    city: "Roseville",
    state: "CA",
    zip: "95747",
    phone: "(916) 250-8130",
    website: "synergyforcevbc.com",
    notes: "Teams: G 15-1 Natl, G 15-2 Natl",
  },

  // ── T ───────────────────────────────────────────────────────────────────────
  {
    id: "tropical-touch",
    name: "Tropical Touch Volleyball Club",
    shortName: "Tropical Touch",
    city: "",
    state: "CA",
    notes: "Teams: 15 Teine Matalasi, 15 Fealofani",
  },
  {
    id: "tstreet-sn",
    name: "T-Street Southern Nevada",
    shortName: "Tstreet SN",
    city: "Henderson",
    state: "NV",
    notes: "Teams: 15-Jackson, 15-Sydney",
  },
  {
    id: "tuoco-elite",
    name: "TuoCo Elite Volleyball",
    shortName: "TuoCo Elite",
    city: "",
    state: "CA",
    notes: "Teams: TuoCo Elite 15s",
  },
  {
    id: "turlock-crush",
    name: "Turlock Crush Volleyball Club",
    shortName: "Turlock Crush",
    address: "2882 Ahlem Ave",
    city: "Turlock",
    state: "CA",
    zip: "95382",
    phone: "(209) 535-5512",
    email: "TurlockCrush@gmail.com",
    website: "turlockcrushvolleyball.com",
    notes: "Teams: Turlock Crush 15 Dave",
  },

  // ── U ───────────────────────────────────────────────────────────────────────
  {
    id: "uva",
    name: "UVA Volleyball Club",
    shortName: "UVA",
    city: "",
    state: "CA",
    notes: "Teams: UVA 15 Jonah, UVA 15 Andrew",
  },

  // ── V ───────────────────────────────────────────────────────────────────────
  {
    id: "vibe",
    name: "Vibe Volleyball Club",
    shortName: "Vibe",
    address: "2640 Shadelands Dr",
    city: "Walnut Creek",
    state: "CA",
    zip: "94598",
    phone: "(925) 300-6166",
    email: "info@vbvibe.com",
    website: "vbvibe.com",
    notes: "Teams: 15's-Black, 15's-Ed/Steve, 15's-Riot, 15's-Voltage, 15's-Onyx, 15's-Blue Thunder. Also trains in Danville/Orinda.",
  },
  {
    id: "vision",
    name: "Vision Volleyball Club",
    shortName: "Vision",
    address: "1742 Stone Ave",
    city: "San Jose",
    state: "CA",
    zip: "95128",
    website: "visionvolleyball.com",
    notes: "Teams: 15 Gold, 15 Blue, 15 White. Also has Los Gatos location.",
  },
  {
    id: "vva",
    name: "VVA Volleyball Club",
    shortName: "VVA",
    city: "",
    state: "CA",
    notes: "Teams: VVA 15-Rita",
  },

  // ── W ───────────────────────────────────────────────────────────────────────
  {
    id: "white-stone",
    name: "White Stone Volleyball Club",
    shortName: "White Stone",
    city: "",
    state: "CA",
    notes: "Teams: White Stone U15 Power",
  },

  // ── X ───────────────────────────────────────────────────────────────────────
  {
    id: "x-team",
    name: "X TEAM Volleyball",
    shortName: "X TEAM",
    city: "",
    state: "CA",
    notes: "Teams: X TEAM 15",
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getClubById(id: string): NCVAClub | undefined {
  return NCVA_CLUBS.find((c) => c.id === id)
}

/** Match a team name string (e.g. "Red Rock 15 Chi - Campbell") to its club */
export function getClubByTeamName(teamName: string): NCVAClub | undefined {
  const t = teamName.toLowerCase()
  return NCVA_CLUBS.find((c) => t.startsWith(c.shortName.toLowerCase()))
}

export function searchClubs(query: string): NCVAClub[] {
  const q = query.toLowerCase()
  return NCVA_CLUBS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.notes?.toLowerCase().includes(q)
  )
}

export function getClubFullAddress(club: NCVAClub): string {
  return [club.address, club.city, `${club.state} ${club.zip ?? ""}`.trim()]
    .filter(Boolean)
    .join(", ")
}

/** Generate CSV row for Google Sheets export */
export function clubsToCSV(): string {
  const headers = ["id","name","shortName","city","state","zip","address","phone","email","website","director","notes"]
  const escape = (v: string = "") => `"${v.replace(/"/g, '""')}"`
  const rows = NCVA_CLUBS.map((c) =>
    headers.map((h) => escape((c as unknown as Record<string, string | undefined>)[h] ?? "")).join(",")
  )
  return [headers.join(","), ...rows].join("\n")
}
