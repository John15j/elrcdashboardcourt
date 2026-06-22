"use strict";

/* ================================================================
   SHARED MATCH DATA
   This array is the single source of truth for both pages.
   match.html loads this file BEFORE match.js, so match.js can
   read window.MATCH_DATA without duplicating it.

   Seeded from real FIFA World Cup 2026 group-stage fixtures
   (live scores / kickoff times are real). Stadium and referee
   are placeholder sample values — swap in confirmed venues/
   officials when you have them, the structure won't change.

   `hasFullIntel: true` marks the one match (England v Croatia)
   that ships with complete sample data for every Match
   Intelligence section (lineups, last-5 form, head-to-head).
   Other matches render gracefully with "not yet available"
   placeholders for those sections — see match.js.
   ================================================================ */

const MATCH_DATA = [
  {
    id: "eng-cro-2026",
    status: "finished",
    kickoff: "2026-06-17T20:00:00Z",
    group: "L",
    stage: "Group Stage",
    stadium: "Lincoln Financial Field, Philadelphia",
    referee: "Referee TBA",
    home: { name: "England", code: "eng", flag: "gb-eng" },
    away: { name: "Croatia", code: "cro", flag: "hr" },
    score: { home: 4, away: 2 },
    hasFullIntel: true,
    /* Everything in `intel` below is real EXCEPT lastFive and h2h, which
       have no public API source here and are clearly sample placeholders
       (see `sample: true` flags) — swap them for a real history feed later. */
    intel: {
      aiSummary: "England controlled this one territorially, holding 54% possession and landing 12 shots on target to Croatia's five. The tie was level twice in the first half, but a goal either side of the break — in the 42nd and 47th minutes — broke Croatia's resistance, and a late strike in the 85th made the scoreline emphatic.",
      keyEvents: [
        { minute: 12, team: "home", type: "goal" },
        { minute: 36, team: "away", type: "goal" },
        { minute: 42, team: "home", type: "goal" },
        { minute: 45, team: "away", type: "goal" },
        { minute: 47, team: "home", type: "goal" },
        { minute: 85, team: "home", type: "goal" }
      ],
      teamStats: {
        home: { possession: 54, shotsTotal: 20, shotsOnTarget: 12, corners: 8, fouls: 10 },
        away: { possession: 46, shotsTotal: 11, shotsOnTarget: 5, corners: 2, fouls: 11 }
      },
      lastFive: {
        sample: true,
        home: [
          { opponent: "France", result: "W", score: "2-1" },
          { opponent: "Brazil", result: "W", score: "3-1" },
          { opponent: "Germany", result: "D", score: "1-1" },
          { opponent: "Portugal", result: "W", score: "2-0" },
          { opponent: "Netherlands", result: "W", score: "4-2" }
        ],
        away: [
          { opponent: "Argentina", result: "L", score: "1-3" },
          { opponent: "Belgium", result: "L", score: "0-2" },
          { opponent: "Japan", result: "D", score: "2-2" },
          { opponent: "Morocco", result: "L", score: "1-2" },
          { opponent: "Serbia", result: "W", score: "2-1" }
        ]
      },
      h2h: {
        sample: true,
        meetings: [
          { line: "England 2–1 Croatia", competition: "Friendly", date: "Mar 2025" },
          { line: "Croatia 1–0 England", competition: "Qualifier", date: "Oct 2024" },
          { line: "England 1–1 Croatia", competition: "Group Stage", date: "Jun 2023" }
        ]
      },
      lineups: {
        home: {
          formation: "4-3-3",
          startingXI: [
            { name: "Jordan Pickford", pos: "GK" },
            { name: "Reece James", pos: "RB" },
            { name: "John Stones", pos: "CB" },
            { name: "Ezri Konsa", pos: "CB" },
            { name: "Nico O'Reilly", pos: "LB" },
            { name: "Declan Rice", pos: "CM" },
            { name: "Jude Bellingham", pos: "CM" },
            { name: "Elliot Anderson", pos: "CM" },
            { name: "Noni Madueke", pos: "RW" },
            { name: "Harry Kane", pos: "ST" },
            { name: "Anthony Gordon", pos: "LW" }
          ],
          subs: ["James Trafford", "Djed Spence", "Kobbie Mainoo", "Morgan Rogers"]
        },
        away: {
          formation: "4-4-2",
          startingXI: [
            { name: "Dominik Livakovic", pos: "GK" },
            { name: "Josip Stanisic", pos: "RB" },
            { name: "Josko Gvardiol", pos: "CB" },
            { name: "Luka Vuskovic", pos: "CB" },
            { name: "Josip Sutalo", pos: "LB" },
            { name: "Martin Baturina", pos: "RM" },
            { name: "Luka Modric", pos: "CM" },
            { name: "Petar Sucic", pos: "CM" },
            { name: "Mario Pasalic", pos: "LM" },
            { name: "Ivan Perisic", pos: "ST" },
            { name: "Petar Musa", pos: "ST" }
          ],
          subs: ["Luka Sucic", "Igor Matanovic", "Nikola Moro", "Ante Budimir"]
        }
      },
      /* Feature 1 — Team Comparison Panel. No public FIFA-ranking/season-average
         API is connected here, so this is sample data like lastFive/h2h above. */
      comparison: {
        sample: true,
        fifaRanking: { home: 4, away: 12 },
        recentForm: { home: "WWWDW", away: "WLDWD" },
        avgGoals: { home: 2.1, away: 1.4 },
        avgGoalsAllowed: { home: 0.8, away: 1.2 },
        possession: { home: 58, away: 49 },
        shotsPerMatch: { home: 15, away: 11 }
      },
      /* Feature 2 — Match Research Timeline. Same sample-data caveat as above. */
      last10: {
        sample: true,
        home: ["W", "W", "D", "W", "L", "W", "W", "W", "D", "W"],
        away: ["W", "L", "D", "W", "D", "W", "L", "W", "W", "D"]
      }
    }
  },
  {
    id: "sco-mar-2026",
    status: "finished",
    kickoff: "2026-06-19T22:00:00Z",
    group: "C",
    stage: "Group Stage",
    stadium: "BMO Field, Toronto",
    referee: "Referee TBA",
    home: { name: "Scotland", code: "sco", flag: "gb-sct" },
    away: { name: "Morocco", code: "mar", flag: "ma" },
    score: { home: 0, away: 1 },
    hasFullIntel: true,
    intel: {
      aiSummary: "Morocco controlled this one from the second minute, taking an early lead and never letting go of the ball for long — 60% possession and 12 shots to Scotland's six. The most telling number: Scotland failed to register a single shot on target across the full 90 minutes, a sign of how comprehensively they were contained despite the narrow scoreline.",
      keyEvents: [
        { minute: 2, team: "away", type: "goal" }
      ],
      teamStats: {
        home: { possession: 40, shotsTotal: 6, shotsOnTarget: 0, corners: 2, fouls: 11 },
        away: { possession: 60, shotsTotal: 12, shotsOnTarget: 3, corners: 5, fouls: 8 }
      },
      comparison: {
        sample: true,
        fifaRanking: { home: 32, away: 13 },
        recentForm: { home: "LDLWD", away: "WWDWW" },
        avgGoals: { home: 1.1, away: 1.8 },
        avgGoalsAllowed: { home: 1.6, away: 0.7 },
        possession: { home: 45, away: 55 },
        shotsPerMatch: { home: 9, away: 13 }
      },
      last10: {
        sample: true,
        home: ["L", "D", "L", "W", "D", "L", "D", "W", "L", "D"],
        away: ["W", "W", "D", "W", "W", "D", "W", "L", "W", "W"]
      },
      lastFive: {
        sample: true,
        home: [
          { opponent: "Norway", result: "L", score: "0-2" },
          { opponent: "Iceland", result: "D", score: "1-1" },
          { opponent: "Denmark", result: "L", score: "0-1" },
          { opponent: "Israel", result: "W", score: "3-0" },
          { opponent: "Georgia", result: "D", score: "1-1" }
        ],
        away: [
          { opponent: "Senegal", result: "W", score: "2-0" },
          { opponent: "Tunisia", result: "W", score: "1-0" },
          { opponent: "Algeria", result: "D", score: "1-1" },
          { opponent: "Egypt", result: "W", score: "2-1" },
          { opponent: "Comoros", result: "W", score: "4-0" }
        ]
      },
      h2h: {
        sample: true,
        meetings: [
          { line: "Scotland 1–0 Morocco", competition: "Friendly", date: "Jun 2022" },
          { line: "Morocco 2–1 Scotland", competition: "Friendly", date: "Mar 2019" }
        ]
      },
      lineups: {
        home: {
          formation: "5-4-1",
          startingXI: [
            { name: "Angus Gunn", pos: "GK" },
            { name: "Nathan Patterson", pos: "RB" },
            { name: "Jack Hendry", pos: "CB" },
            { name: "Grant Hanley", pos: "CB" },
            { name: "Kieran Tierney", pos: "CB" },
            { name: "Andy Robertson", pos: "LB" },
            { name: "Ryan Christie", pos: "RM" },
            { name: "Lewis Ferguson", pos: "CM" },
            { name: "John McGinn", pos: "CM" },
            { name: "Scott Mctominay", pos: "LM" },
            { name: "Che Adams", pos: "ST" }
          ],
          subs: ["Ross Stewart", "Findlay Curtis", "Ben Gannon-Doak", "Tyler Fletcher"]
        },
        away: {
          formation: "4-5-1",
          startingXI: [
            { name: "Yassine Bounou", pos: "GK" },
            { name: "Achraf Hakimi", pos: "RB" },
            { name: "Issa Diop", pos: "CB" },
            { name: "Chadi Riad", pos: "CB" },
            { name: "Noussair Mazraoui", pos: "LB" },
            { name: "Neil El Aynaoui", pos: "CM" },
            { name: "Ayyoub Bouaddi", pos: "CM" },
            { name: "Azzedine Ounahi", pos: "CM" },
            { name: "Bilal El Khannouss", pos: "RM" },
            { name: "Ismael Saibari", pos: "LM" },
            { name: "Brahim Diaz", pos: "RW" }
          ],
          subs: ["Chemsdine Talbi", "Ayoube Amaimouni", "Amine Sbai", "Redouane Halhal"]
        }
      }
    }
  },
  {
    id: "bra-hti-2026",
    status: "finished",
    kickoff: "2026-06-20T00:30:00Z",
    group: "C",
    stage: "Group Stage",
    stadium: "Hard Rock Stadium, Miami",
    referee: "Referee TBA",
    home: { name: "Brazil", code: "bra", flag: "br" },
    away: { name: "Haiti", code: "hti", flag: "ht" },
    score: { home: 3, away: 0 },
    hasFullIntel: true,
    winProbability: { home: 87.9, away: 3.9, draw: 8.2 },
    intel: {
      aiSummary: "Brazil settled this one before halftime, scoring three times in a 22-minute spell (23rd, 36th, and 45th minutes) to put the game away early. To Haiti's credit, they matched Brazil's shot count almost evenly (8 to 9) and finished with four shots on target of their own — the scoreline reflects a ruthless finishing window more than a one-sided match throughout.",
      keyEvents: [
        { minute: 23, team: "home", type: "goal" },
        { minute: 36, team: "home", type: "goal" },
        { minute: 45, team: "home", type: "goal" }
      ],
      teamStats: {
        home: { possession: 57, shotsTotal: 9, shotsOnTarget: 5, corners: 4, fouls: 13 },
        away: { possession: 43, shotsTotal: 8, shotsOnTarget: 4, corners: 4, fouls: 15 }
      },
      comparison: {
        sample: true,
        fifaRanking: { home: 3, away: 86 },
        recentForm: { home: "WWWWD", away: "LLDLW" },
        avgGoals: { home: 2.6, away: 0.9 },
        avgGoalsAllowed: { home: 0.6, away: 2.3 },
        possession: { home: 61, away: 39 },
        shotsPerMatch: { home: 17, away: 7 }
      },
      last10: {
        sample: true,
        home: ["W", "W", "W", "W", "D", "W", "W", "W", "D", "W"],
        away: ["L", "L", "D", "L", "W", "L", "D", "L", "L", "D"]
      },
      lastFive: {
        sample: true,
        home: [
          { opponent: "Argentina", result: "W", score: "2-1" },
          { opponent: "Uruguay", result: "W", score: "3-0" },
          { opponent: "Colombia", result: "W", score: "1-0" },
          { opponent: "Peru", result: "D", score: "2-2" },
          { opponent: "Chile", result: "W", score: "4-1" }
        ],
        away: [
          { opponent: "Honduras", result: "L", score: "0-2" },
          { opponent: "Costa Rica", result: "L", score: "1-3" },
          { opponent: "Panama", result: "D", score: "1-1" },
          { opponent: "Jamaica", result: "L", score: "0-1" },
          { opponent: "Trinidad and Tobago", result: "W", score: "2-1" }
        ]
      },
      h2h: {
        sample: true,
        meetings: [
          { line: "Brazil 4–0 Haiti", competition: "Friendly", date: "Aug 2024" },
          { line: "Brazil 3–1 Haiti", competition: "Qualifier", date: "May 2022" }
        ]
      },
      lineups: {
        home: {
          formation: "4-3-3",
          startingXI: [
            { name: "Alisson", pos: "GK" },
            { name: "Danilo", pos: "RB" },
            { name: "Marquinhos", pos: "CB" },
            { name: "Gabriel Magalhaes", pos: "CB" },
            { name: "Douglas Santos", pos: "LB" },
            { name: "Lucas Paqueta", pos: "CM" },
            { name: "Bruno Guimaraes", pos: "CM" },
            { name: "Casemiro", pos: "CM" },
            { name: "Vinicius Junior", pos: "LW" },
            { name: "Matheus Cunha", pos: "ST" },
            { name: "Raphinha", pos: "RW" }
          ],
          subs: ["Igor Thiago", "Rayan", "Endrick", "Alex Sandro"]
        },
        away: {
          formation: "5-2-3",
          startingXI: [
            { name: "Johny Placide", pos: "GK" },
            { name: "Carlens Arcus", pos: "RB" },
            { name: "Ricardo Ade", pos: "CB" },
            { name: "Jean-Kevin Duverne", pos: "CB" },
            { name: "Hannes Delcroix", pos: "CB" },
            { name: "Martin Experience", pos: "LB" },
            { name: "Danley Jean Jacques", pos: "CM" },
            { name: "Jean-Ricner Bellegarde", pos: "CM" },
            { name: "Josue Casimir", pos: "RW" },
            { name: "Ruben Providence", pos: "LW" },
            { name: "Frantzdy Pierrot", pos: "ST" }
          ],
          subs: ["Alexandre Pierre", "Lenny Joseph", "Garven Metusala", "Dominique Simon"]
        }
      }
    }
  },
  {
    id: "tur-par-2026",
    status: "finished",
    kickoff: "2026-06-20T03:00:00Z",
    group: "D",
    stage: "Group Stage",
    stadium: "AT&T Stadium, Dallas",
    referee: "Referee TBA",
    home: { name: "Turkiye", code: "tur", flag: "tr" },
    away: { name: "Paraguay", code: "par", flag: "py" },
    score: { home: 0, away: 1 },
    hasFullIntel: false,
    winProbability: { home: 46.7, away: 25.4, draw: 27.9 }
  },
  {
    id: "ned-swe-2026",
    status: "live",
    kickoff: "2026-06-20T17:00:00Z",
    group: "F",
    stage: "Group Stage",
    stadium: "Lumen Field, Seattle",
    referee: "Referee TBA",
    home: { name: "Netherlands", code: "ned", flag: "nl" },
    away: { name: "Sweden", code: "swe", flag: "se" },
    score: { home: 2, away: 0 },
    hasFullIntel: false,
    winProbability: { home: 56.1, away: 20.6, draw: 23.3 }
  },
  {
    id: "ger-civ-2026",
    status: "upcoming",
    kickoff: "2026-06-20T20:00:00Z",
    group: "E",
    stage: "Group Stage",
    stadium: "Mercedes-Benz Stadium, Atlanta",
    referee: "Referee TBA",
    home: { name: "Germany", code: "ger", flag: "de" },
    away: { name: "Ivory Coast", code: "civ", flag: "ci" },
    score: null,
    hasFullIntel: false,
    winProbability: { home: 62.8, away: 16.3, draw: 20.9 }
  },
  {
    id: "ecu-cuw-2026",
    status: "upcoming",
    kickoff: "2026-06-21T00:00:00Z",
    group: "E",
    stage: "Group Stage",
    stadium: "NRG Stadium, Houston",
    referee: "Referee TBA",
    home: { name: "Ecuador", code: "ecu", flag: "ec" },
    away: { name: "Curacao", code: "cuw", flag: "cw" },
    score: null,
    hasFullIntel: false,
    winProbability: { home: 87.6, away: 3.5, draw: 8.9 }
  },
  {
    id: "tun-jpn-2026",
    status: "upcoming",
    kickoff: "2026-06-21T04:00:00Z",
    group: "F",
    stage: "Group Stage",
    stadium: "Levi's Stadium, Bay Area",
    referee: "Referee TBA",
    home: { name: "Tunisia", code: "tun", flag: "tn" },
    away: { name: "Japan", code: "jpn", flag: "jp" },
    score: null,
    hasFullIntel: false,
    winProbability: { home: 14.3, away: 62.6, draw: 23.1 }
  },
  {
    id: "esp-ksa-2026",
    status: "upcoming",
    kickoff: "2026-06-21T16:00:00Z",
    group: "H",
    stage: "Group Stage",
    stadium: "SoFi Stadium, Los Angeles",
    referee: "Referee TBA",
    home: { name: "Spain", code: "esp", flag: "es" },
    away: { name: "Saudi Arabia", code: "ksa", flag: "sa" },
    score: null,
    hasFullIntel: false,
    winProbability: { home: 88.7, away: 2.9, draw: 8.4 }
  },
  {
    id: "bel-irn-2026",
    status: "upcoming",
    kickoff: "2026-06-21T19:00:00Z",
    group: "G",
    stage: "Group Stage",
    stadium: "Gillette Stadium, Boston",
    referee: "Referee TBA",
    home: { name: "Belgium", code: "bel", flag: "be" },
    away: { name: "IR Iran", code: "irn", flag: "ir" },
    score: null,
    hasFullIntel: false,
    winProbability: { home: 67.5, away: 12.6, draw: 19.9 }
  },
  {
    id: "uru-cpv-2026",
    status: "upcoming",
    kickoff: "2026-06-21T22:00:00Z",
    group: "H",
    stage: "Group Stage",
    stadium: "Arrowhead Stadium, Kansas City",
    referee: "Referee TBA",
    home: { name: "Uruguay", code: "uru", flag: "uy" },
    away: { name: "Cape Verde", code: "cpv", flag: "cv" },
    score: null,
    hasFullIntel: false,
    winProbability: { home: 65.4, away: 12.3, draw: 22.3 }
  },
  {
    id: "nzl-egy-2026",
    status: "upcoming",
    kickoff: "2026-06-22T01:00:00Z",
    group: "G",
    stage: "Group Stage",
    stadium: "Estadio Azteca, Mexico City",
    referee: "Referee TBA",
    home: { name: "New Zealand", code: "nzl", flag: "nz" },
    away: { name: "Egypt", code: "egy", flag: "eg" },
    score: null,
    hasFullIntel: false,
    winProbability: { home: 16.6, away: 59.5, draw: 23.9 }
  }
];

window.MATCH_DATA = MATCH_DATA;

/* ================================================================
   STANDINGS DATA — real FIFA World Cup 2026 group tables.
   Only the groups used by MATCH_DATA are included to keep this
   lean. `played` is derived from won+drawn+lost since the source
   doesn't report it directly.
   ================================================================ */

const STANDINGS_DATA = {
  C: [
    { rank: 1, name: "Morocco", code: "mar", won: 1, drawn: 1, lost: 0, points: 4 },
    { rank: 2, name: "Scotland", code: "sco", won: 1, drawn: 0, lost: 1, points: 3 },
    { rank: 3, name: "Brazil", code: "bra", won: 0, drawn: 1, lost: 0, points: 1 },
    { rank: 4, name: "Haiti", code: "hti", won: 0, drawn: 0, lost: 1, points: 0 }
  ],
  D: [
    { rank: 1, name: "USA", code: "usa", won: 2, drawn: 0, lost: 0, points: 6 },
    { rank: 2, name: "Australia", code: "aus", won: 1, drawn: 0, lost: 1, points: 3 },
    { rank: 3, name: "Turkiye", code: "tur", won: 0, drawn: 0, lost: 1, points: 0 },
    { rank: 4, name: "Paraguay", code: "par", won: 0, drawn: 0, lost: 1, points: 0 }
  ],
  E: [
    { rank: 1, name: "Germany", code: "ger", won: 1, drawn: 0, lost: 0, points: 3 },
    { rank: 2, name: "Ivory Coast", code: "civ", won: 1, drawn: 0, lost: 0, points: 3 },
    { rank: 3, name: "Ecuador", code: "ecu", won: 0, drawn: 0, lost: 1, points: 0 },
    { rank: 4, name: "Curacao", code: "cuw", won: 0, drawn: 0, lost: 1, points: 0 }
  ],
  F: [
    { rank: 1, name: "Sweden", code: "swe", won: 1, drawn: 0, lost: 0, points: 3 },
    { rank: 2, name: "Japan", code: "jpn", won: 0, drawn: 1, lost: 0, points: 1 },
    { rank: 3, name: "Netherlands", code: "ned", won: 0, drawn: 1, lost: 0, points: 1 },
    { rank: 4, name: "Tunisia", code: "tun", won: 0, drawn: 0, lost: 1, points: 0 }
  ],
  G: [
    { rank: 1, name: "New Zealand", code: "nzl", won: 0, drawn: 1, lost: 0, points: 1 },
    { rank: 2, name: "IR Iran", code: "irn", won: 0, drawn: 1, lost: 0, points: 1 },
    { rank: 3, name: "Belgium", code: "bel", won: 0, drawn: 1, lost: 0, points: 1 },
    { rank: 4, name: "Egypt", code: "egy", won: 0, drawn: 1, lost: 0, points: 1 }
  ],
  H: [
    { rank: 1, name: "Uruguay", code: "uru", won: 0, drawn: 1, lost: 0, points: 1 },
    { rank: 2, name: "Saudi Arabia", code: "ksa", won: 0, drawn: 1, lost: 0, points: 1 },
    { rank: 3, name: "Spain", code: "esp", won: 0, drawn: 1, lost: 0, points: 1 },
    { rank: 4, name: "Cape Verde", code: "cpv", won: 0, drawn: 1, lost: 0, points: 1 }
  ],
  L: [
    { rank: 1, name: "England", code: "eng", won: 1, drawn: 0, lost: 0, points: 3 },
    { rank: 2, name: "Ghana", code: "gha", won: 1, drawn: 0, lost: 0, points: 3 },
    { rank: 3, name: "Panama", code: "pan", won: 0, drawn: 0, lost: 1, points: 0 },
    { rank: 4, name: "Croatia", code: "cro", won: 0, drawn: 0, lost: 1, points: 0 }
  ]
};

// Add `played` to every row (won+drawn+lost) without retyping the data above.
Object.values(STANDINGS_DATA).forEach(group =>
  group.forEach(row => { row.played = row.won + row.drawn + row.lost; })
);

window.STANDINGS_DATA = STANDINGS_DATA;

/* ================================================================
   SHARED UTILITIES
   Plain function declarations so match.js (loaded after this file)
   can call them directly.
   ================================================================ */

const FLAG_CODES = {
  eng: "gb-eng", sco: "gb-sct", cro: "hr", mar: "ma", bra: "br", hti: "ht",
  tur: "tr", par: "py", ned: "nl", swe: "se", ger: "de", civ: "ci",
  ecu: "ec", cuw: "cw", tun: "tn", jpn: "jp", esp: "es", ksa: "sa",
  bel: "be", irn: "ir", uru: "uy", cpv: "cv", nzl: "nz", egy: "eg",
  gha: "gh", pan: "pa", usa: "us", aus: "au", can: "ca", qat: "qa",
  mex: "mx", kor: "kr", col: "co", uzb: "uz", aut: "at", jor: "jo",
  por: "pt", cod: "cd", cze: "cz", rsa: "za", sui: "ch", bih: "ba"
};

function getFlagUrl(code) {
  const iso = FLAG_CODES[code] || "un";
  return `https://flagcdn.com/w80/${iso}.png`;
}

/** Returns a fallback flag emoji-style square if the CDN image 404s. */
function flagFallbackHTML(name) {
  return `<span class="flag flag-fallback" aria-hidden="true">${name.slice(0, 2).toUpperCase()}</span>`;
}

/** "Fri Jun 19 · 6:00 PM EDT" — auto-correct EST/EDT for the real date. */
function formatKickoff(iso) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/New_York" }).format(d);
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York", timeZoneName: "short" }).format(d);
  return `${date} · ${time}`;
}

/** Elapsed minutes since kickoff, with a rough halftime allowance. */
function getLiveMinute(iso) {
  const elapsedMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(elapsedMs / 60000);
  if (mins <= 45) return { label: `${Math.max(mins, 1)}'`, phase: "first" };
  if (mins <= 60) return { label: "HT", phase: "half" };
  if (mins <= 105) return { label: `${mins - 15}'`, phase: "second" };
  return { label: "90+'", phase: "end" };
}

/** Days/hours/minutes/seconds until kickoff. */
function getCountdownParts(iso) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return null;
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

/** Compact "1d 14h" style string for match cards. */
function formatCountdownShort(iso) {
  const p = getCountdownParts(iso);
  if (!p) return "Kicking off";
  if (p.days > 0) return `${p.days}d ${p.hours}h`;
  if (p.hours > 0) return `${p.hours}h ${p.minutes}m`;
  return `${p.minutes}m ${p.seconds}s`;
}

/* ================================================================
   FEATURE 3 FOUNDATION — MATCH ARCHIVE SYSTEM
   This is a personal site with no live polling, so the static
   `status` field on each match can go stale (a "live" match stays
   labeled "live" forever once kickoff has passed, even hours
   later). getEffectiveStatus() derives the REAL status from the
   kickoff timestamp vs. the viewer's clock, so:
     - an "upcoming" match whose kickoff has passed becomes "live"
     - a "live" match more than ~130 min past kickoff (full match +
       stoppage + a buffer) becomes "finished" automatically
   Both pages use this instead of the raw `status` field, so a
   match genuinely moves from Live -> Recent Matches on its own.
   ================================================================ */
function getEffectiveStatus(match) {
  if (match.status === "finished") return "finished";
  const elapsedMin = (Date.now() - new Date(match.kickoff).getTime()) / 60000;
  if (elapsedMin < 0) return "upcoming";
  // Kickoff has happened. If no score was ever connected for this match
  // (sample "upcoming" matches only carry a win-probability, not a live
  // score), there's nothing honest to show as "live" — archive it rather
  // than fabricate a result.
  if (!match.score) return "finished";
  if (elapsedMin >= 130) return "finished";
  return "live";
}

/** True when a match was auto-archived purely by clock drift (no live feed
    confirmed the real final score) — used to caveat the displayed score. */
function isAutoArchived(match) {
  return match.status !== "finished" && getEffectiveStatus(match) === "finished";
}

/* ================================================================
   HOME PAGE RENDERING
   Guarded so this file can be safely loaded on match.html too.
   ================================================================ */

if (document.body.dataset.page === "home") {

  let activeFilter = "all";
  let searchTerm = "";

  function teamFlagImg(team) {
    return `<img class="flag" src="${getFlagUrl(team.code)}" alt="${team.name} flag"
      onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'flag flag-fallback',textContent:'${team.code.slice(0,3).toUpperCase()}'}))">`;
  }

  function buildCard(match) {
    const status = getEffectiveStatus(match);
    const card = document.createElement("article");
    card.className = `match-card status-${status}`;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.dataset.id = match.id;

    let statusHTML = "";
    let centerHTML = "";

    if (status === "live") {
      const min = getLiveMinute(match.kickoff);
      statusHTML = `<span class="status-pill live"><span class="pulse-dot small"></span>${min.phase === "half" ? "HALFTIME" : "LIVE " + min.label}</span>`;
      centerHTML = `
        <span class="score">${match.score.home}</span>
        <span class="score-sep">–</span>
        <span class="score">${match.score.away}</span>`;
    } else if (status === "upcoming") {
      statusHTML = `<span class="status-pill upcoming">KICKOFF IN</span>`;
      centerHTML = `<span class="countdown-time" data-countdown="${match.kickoff}">${formatCountdownShort(match.kickoff)}</span>`;
    } else {
      if (!match.score) {
        statusHTML = `<span class="status-pill finished">No Result</span>`;
        centerHTML = `<span class="countdown-time">Not connected</span>`;
      } else {
        const ftLabel = isAutoArchived(match) ? "FT · last known" : "FT";
        statusHTML = `<span class="status-pill finished">${ftLabel}</span>`;
        centerHTML = `
        <span class="score">${match.score.home}</span>
        <span class="score-sep">–</span>
        <span class="score">${match.score.away}</span>`;
      }
    }

    card.innerHTML = `
      <div class="card-row-top">
        <span class="meta-tag">Group ${match.group} · ${match.stage}</span>
        ${statusHTML}
      </div>
      <div class="card-teams">
        <div class="team">${teamFlagImg(match.home)}<span class="team-name">${match.home.name}</span></div>
        <div class="score-block">${centerHTML}</div>
        <div class="team">${teamFlagImg(match.away)}<span class="team-name">${match.away.name}</span></div>
      </div>
      <div class="card-row-bottom">
        <span>${formatKickoff(match.kickoff)}</span>
        <span>${match.stadium.split(",")[0]}</span>
      </div>
    `;

    card.addEventListener("click", () => goToMatch(match.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToMatch(match.id); }
    });

    return card;
  }

  function goToMatch(id) {
    window.location.href = `match.html?id=${id}`;
  }

  function matchesFilter(match) {
    const status = getEffectiveStatus(match);
    if (activeFilter === "live" && status !== "live") return false;
    if (activeFilter === "upcoming" && status !== "upcoming") return false;
    if (activeFilter === "recent" && status !== "finished") return false;
    if (!searchTerm) return true;
    const haystack = `${match.home.name} ${match.away.name} ${match.group} ${match.stage}`.toLowerCase();
    return haystack.includes(searchTerm);
  }

  /* Feature 3 foundation: a cap for "Last 20 / Last 50 / tournament archive"
     later. Left null (no limit) intentionally — per the brief, only the
     foundation is built now, not those larger views. Set a number here
     later (e.g. 20) to cap the Recent Matches grid without touching
     any other logic. */
  const RECENT_MATCHES_DISPLAY_LIMIT = null;

  /** Safely set .innerHTML — does nothing (and warns once) instead of
      throwing if the element doesn't exist, e.g. from a stale HTML file
      paired with a newer home.js. Keeps one missing element from taking
      down the entire render(). */
  function safeSetHTML(id, html) {
    const el = document.getElementById(id);
    if (!el) { console.warn(`#${id} not found — is index.html out of date?`); return; }
    el.innerHTML = html;
  }
  function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (!el) { console.warn(`#${id} not found — is index.html out of date?`); return; }
    el.textContent = text;
  }
  function safeSetHidden(id, value) {
    const el = document.getElementById(id);
    if (!el) { console.warn(`#${id} not found — is index.html out of date?`); return; }
    el.hidden = value;
  }
  function safeAppend(id, node) {
    const el = document.getElementById(id);
    if (!el) return;
    el.appendChild(node);
  }

  function render() {
    safeSetHTML("liveGrid", "");
    safeSetHTML("upcomingGrid", "");
    safeSetHTML("recentGrid", "");

    const visible = MATCH_DATA.filter(matchesFilter);
    const live = visible.filter(m => getEffectiveStatus(m) === "live");
    const upcoming = visible.filter(m => getEffectiveStatus(m) === "upcoming");
    let recent = visible.filter(m => getEffectiveStatus(m) === "finished");
    // Most recently played first, so newly auto-archived matches surface at the top.
    recent = recent.slice().sort((a, b) => new Date(b.kickoff) - new Date(a.kickoff));
    if (RECENT_MATCHES_DISPLAY_LIMIT) recent = recent.slice(0, RECENT_MATCHES_DISPLAY_LIMIT);

    live.forEach(m => safeAppend("liveGrid", buildCard(m)));
    upcoming.forEach(m => safeAppend("upcomingGrid", buildCard(m)));
    recent.forEach(m => safeAppend("recentGrid", buildCard(m)));

    safeSetText("liveCount", live.length);
    safeSetText("upcomingCount", upcoming.length);
    safeSetText("recentCount", recent.length);
    safeSetHidden("liveSection", activeFilter === "upcoming" || activeFilter === "recent");
    safeSetHidden("upcomingSection", activeFilter === "live" || activeFilter === "recent");
    safeSetHidden("recentSection", activeFilter === "live" || activeFilter === "upcoming");

    safeSetHidden("emptyState", visible.length !== 0);

    renderTicker();
  }

  function renderTicker() {
    const liveMatches = MATCH_DATA.filter(m => getEffectiveStatus(m) === "live");
    const ticker = document.getElementById("liveTicker");
    const track = document.getElementById("tickerTrack");
    if (!ticker || !track) { console.warn("#liveTicker/#tickerTrack not found — is index.html out of date?"); return; }
    if (liveMatches.length === 0) { ticker.hidden = true; return; }
    ticker.hidden = false;
    track.innerHTML = liveMatches.map(m => {
      const min = getLiveMinute(m.kickoff);
      return `<span class="ticker-item">${m.home.name} <b>${m.score.home}–${m.score.away}</b> ${m.away.name} <span class="t-min">${min.label}</span></span>`;
    }).join("");
  }

  // Filter pills
  document.getElementById("filterPills").addEventListener("click", (e) => {
    const btn = e.target.closest(".pill");
    if (!btn) return;
    document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    render();
  });

  // Search
  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    render();
  });

  render();
  // Re-render every second. With only ~12 matches this is cheap, and it's
  // what makes Feature 3 (auto-archiving) actually visible live: a match
  // crossing the finished threshold visibly jumps from Live to Recent
  // without needing a page reload.
  setInterval(render, 1000);
}
