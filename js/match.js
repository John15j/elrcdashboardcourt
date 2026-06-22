"use strict";

/* ================================================================
   1. RESOLVE WHICH MATCH WE'RE SHOWING
   Falls back to the England v Croatia flagship match (full sample
   data) if no ?id= is given or the id isn't found — so opening
   match.html directly always shows a complete demo.
   ================================================================ */
const params = new URLSearchParams(window.location.search);
const requestedId = params.get("id");
const match = MATCH_DATA.find(m => m.id === requestedId) || MATCH_DATA.find(m => m.id === "eng-cro-2026");

if (!match) {
  document.querySelector(".page").innerHTML = "<p style='padding:60px 0;text-align:center;color:var(--text-secondary)'>Match not found.</p>";
  throw new Error("No match data available");
}

/* ================================================================
   2. SECTION 1 — MATCH HEADER
   ================================================================ */
function setFlagImg(imgEl, code, name) {
  imgEl.src = getFlagUrl(code);
  imgEl.alt = `${name} flag`;
  imgEl.onerror = function () {
    this.onerror = null;
    this.replaceWith(Object.assign(document.createElement("span"), {
      className: this.className + " flag-fallback",
      textContent: code.slice(0, 3).toUpperCase()
    }));
  };
}

/** Always reflects the real current state, even if the static `status`
    field in the data is stale (see getEffectiveStatus in home.js). */
function currentStatus() {
  return getEffectiveStatus(match);
}

function renderHeader() {
  document.getElementById("heroGroup").textContent = `Group ${match.group}`;
  document.getElementById("heroStage").textContent = match.stage;

  setFlagImg(document.getElementById("heroHomeFlag"), match.home.code, match.home.name);
  document.getElementById("heroHomeName").textContent = match.home.name;

  setFlagImg(document.getElementById("heroAwayFlag"), match.away.code, match.away.name);
  document.getElementById("heroAwayName").textContent = match.away.name;

  const scoreBlock = document.getElementById("heroScoreBlock");
  if (!match.score) {
    scoreBlock.innerHTML = `<span class="hero-vs">vs</span>`;
  } else if (currentStatus() === "upcoming") {
    scoreBlock.innerHTML = `<span class="hero-vs">vs</span>`;
  } else {
    scoreBlock.innerHTML = `
      <span class="hero-score">${match.score.home}</span>
      <span class="hero-sep">–</span>
      <span class="hero-score">${match.score.away}</span>`;
  }

  document.getElementById("heroStadium").textContent = match.stadium;
  document.getElementById("heroReferee").textContent = match.referee;

  const d = new Date(match.kickoff);
  const full = new Intl.DateTimeFormat("en-US", {
    weekday: "long", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit",
    timeZone: "America/New_York", timeZoneName: "short"
  }).format(d);
  document.getElementById("heroDate").textContent = full;
}

/** Small LIVE/HALFTIME badge in the header meta row — ticks alongside the status bar. */
function renderHeaderLiveBadge() {
  const tag = document.getElementById("heroLiveTag");
  const textEl = document.getElementById("heroLiveTagText");
  if (currentStatus() !== "live") {
    tag.hidden = true;
    return;
  }
  const min = getLiveMinute(match.kickoff);
  tag.hidden = false;
  textEl.textContent = min.phase === "half" ? "HALFTIME" : `LIVE ${min.label}`;
}

/* ================================================================
   3. SECTION 2 — COUNTDOWN / STATUS
   Re-runs every second via the interval at the bottom of this file.
   ================================================================ */
function renderStatusBar() {
  const bar = document.getElementById("statusBar");
  bar.className = "status-bar";
  const status = currentStatus();

  if (status === "upcoming") {
    const p = getCountdownParts(match.kickoff);
    if (!p) {
      // Defensive fallback only — getEffectiveStatus() should already have
      // classified a passed-kickoff match as "live" or "finished" by now.
      bar.innerHTML = `
        <div class="status-label">Kickoff</div>
        <div class="status-subtext">This match should be underway — refresh the page.</div>`;
      return;
    }
    bar.innerHTML = `
      <div class="status-label">Starts In</div>
      <div class="countdown-digits">
        <div class="digit-block"><span class="digit-value">${p.days}</span><span class="digit-unit">Days</span></div>
        <div class="digit-block"><span class="digit-value">${p.hours}</span><span class="digit-unit">Hours</span></div>
        <div class="digit-block"><span class="digit-value">${p.minutes}</span><span class="digit-unit">Minutes</span></div>
      </div>`;
    return;
  }

  if (status === "live") {
    const min = getLiveMinute(match.kickoff);
    if (min.phase === "half") {
      const secondHalfStart = new Date(match.kickoff).getTime() + 60 * 60000;
      const remainingMs = secondHalfStart - Date.now();
      const remMin = Math.max(0, Math.floor(remainingMs / 60000));
      const remSec = Math.max(0, Math.floor((remainingMs % 60000) / 1000));
      bar.className = "status-bar state-half";
      bar.innerHTML = `
        <div class="status-label">Halftime</div>
        <div class="live-minute-display">${remMin}:${String(remSec).padStart(2, "0")}</div>
        <div class="status-subtext">Until second half kicks off</div>`;
    } else {
      bar.className = "status-bar state-live";
      bar.innerHTML = `
        <div class="status-label"><span class="pulse-dot"></span>Live</div>
        <div class="live-minute-display">${min.label}</div>`;
    }
    return;
  }

  // finished (either genuinely finished, auto-archived by Feature 3,
  // or kickoff has passed with no live feed ever connected at all)
  if (!match.score) {
    bar.innerHTML = `
      <div class="status-label">No Result Connected</div>
      <div class="status-subtext">Kickoff has passed but no live score feed is connected for this match.</div>`;
    return;
  }
  const note = isAutoArchived(match)
    ? `<div class="status-subtext">Auto-archived after no live updates — score is the last known snapshot, not a confirmed final.</div>`
    : "";
  bar.innerHTML = `
    <div class="status-label">Full Time</div>
    <div class="live-minute-display">${match.home.name} ${match.score.home} – ${match.score.away} ${match.away.name}</div>
    ${note}`;
}

/* ================================================================
   4. SECTION 3 — AI MATCH SUMMARY
   ================================================================ */
function renderAiSummary() {
  const el = document.getElementById("aiSummaryText");
  if (match.intel && match.intel.aiSummary) {
    el.textContent = match.intel.aiSummary;
  } else {
    el.outerHTML = `<p class="panel-empty" id="aiSummaryText">AI summary isn't available yet for this match — check back once more match data is connected.</p>`;
  }
}

/* ================================================================
   5. SECTION 4 — LAST 5 MATCHES
   ================================================================ */
function renderLastFive() {
  const target = document.getElementById("lastFiveContent");
  const lf = match.intel && match.intel.lastFive;
  if (!lf) {
    target.innerHTML = `<p class="panel-empty">Recent form isn't available yet for these teams.</p>`;
    return;
  }
  document.getElementById("lastFiveSampleTag").hidden = !lf.sample;

  function column(teamName, rows) {
    const rowsHTML = rows.map(r => `
      <div class="form-row">
        <span class="form-opponent">vs ${r.opponent}</span>
        <span class="form-right"><span class="result-badge ${r.result}">${r.result}</span>${r.score}</span>
      </div>`).join("");
    return `<div><div class="form-team-label">${teamName}</div>${rowsHTML}</div>`;
  }

  target.innerHTML = `
    <div class="form-columns">
      ${column(match.home.name, lf.home)}
      ${column(match.away.name, lf.away)}
    </div>`;
}

/* ================================================================
   6. SECTION 5 — HEAD-TO-HEAD
   ================================================================ */
function renderH2H() {
  const target = document.getElementById("h2hContent");
  const h2h = match.intel && match.intel.h2h;
  if (!h2h) {
    target.innerHTML = `<p class="panel-empty">No previous meetings on record for these teams yet.</p>`;
    return;
  }
  document.getElementById("h2hSampleTag").hidden = !h2h.sample;
  target.innerHTML = h2h.meetings.map(m => `
    <div class="h2h-row">
      <span class="h2h-line">${m.line}</span>
      <span class="h2h-meta">${m.competition} · ${m.date}</span>
    </div>`).join("");
}

/* ================================================================
   FEATURE 1 — TEAM COMPARISON PANEL
   Side-by-side stat comparison with proportional bars, reusing the
   same home=blue/away=gold color language as the lineup pitch and
   Market Intelligence's win-probability bar.
   ================================================================ */
function compareBar(homeVal, awayVal) {
  const total = homeVal + awayVal;
  const homePct = total > 0 ? (homeVal / total) * 100 : 50;
  return `<div class="compare-bar"><span class="cb-home" style="width:${homePct}%"></span><span class="cb-away" style="width:${100 - homePct}%"></span></div>`;
}

function compareRow(label, homeDisplay, awayDisplay, barHomeVal, barAwayVal) {
  return `
    <div class="compare-row">
      <span class="compare-label">${label}</span>
      <div class="compare-values">
        <span class="compare-val home">${homeDisplay}</span>
        ${compareBar(barHomeVal, barAwayVal)}
        <span class="compare-val away">${awayDisplay}</span>
      </div>
    </div>`;
}

function formChipsRow(label, homeForm, awayForm) {
  const chips = (str) => str.split("").map(r => `<span class="form-chip ${r}">${r}</span>`).join("");
  return `
    <div class="compare-row">
      <span class="compare-label">${label}</span>
      <div class="compare-form-split">
        <div class="compare-chips">${chips(homeForm)}</div>
        <div class="compare-chips">${chips(awayForm)}</div>
      </div>
    </div>`;
}

function renderComparison() {
  const target = document.getElementById("comparisonContent");
  const c = match.intel && match.intel.comparison;
  if (!c) {
    target.innerHTML = `<p class="panel-empty">Team comparison data isn't connected for this match yet.</p>`;
    return;
  }
  document.getElementById("comparisonSampleTag").hidden = !c.sample;

  // FIFA ranking: lower is better, so invert for the bar (better team gets the bigger share).
  const rankBarHome = 1 / c.fifaRanking.home;
  const rankBarAway = 1 / c.fifaRanking.away;

  target.innerHTML = `
    <div class="compare-head-row">
      <span class="ch-home">${match.home.name}</span>
      <span class="ch-away">${match.away.name}</span>
    </div>
    ${compareRow("FIFA Ranking", `#${c.fifaRanking.home}`, `#${c.fifaRanking.away}`, rankBarHome, rankBarAway)}
    ${formChipsRow("Recent Form", c.recentForm.home, c.recentForm.away)}
    ${compareRow("Average Goals", c.avgGoals.home, c.avgGoals.away, c.avgGoals.home, c.avgGoals.away)}
    ${compareRow("Average Goals Allowed", c.avgGoalsAllowed.home, c.avgGoalsAllowed.away, c.avgGoalsAllowed.home, c.avgGoalsAllowed.away)}
    ${compareRow("Possession", `${c.possession.home}%`, `${c.possession.away}%`, c.possession.home, c.possession.away)}
    ${compareRow("Shots Per Match", c.shotsPerMatch.home, c.shotsPerMatch.away, c.shotsPerMatch.home, c.shotsPerMatch.away)}
  `;
}

/* ================================================================
   FEATURE 2 — MATCH RESEARCH TIMELINE
   Visual W/D/L chip row per team (not a text list), green/yellow/red
   per the brief, for fast at-a-glance scanning of recent form.
   ================================================================ */
function timelineRow(teamName, results) {
  const chips = results.map(r => `<span class="timeline-chip ${r}">${r}</span>`).join("");
  return `
    <div class="timeline-team">
      <div class="timeline-team-name">${teamName}</div>
      <div class="timeline-row">${chips}</div>
    </div>`;
}

function renderTimeline() {
  const target = document.getElementById("timelineContent");
  const t = match.intel && match.intel.last10;
  if (!t) {
    target.innerHTML = `<p class="panel-empty">Last-10 match history isn't connected for these teams yet.</p>`;
    return;
  }
  document.getElementById("timelineSampleTag").hidden = !t.sample;
  target.innerHTML = `
    ${timelineRow(match.home.name, t.home)}
    ${timelineRow(match.away.name, t.away)}
    <div class="timeline-legend">
      <span><span class="dot W"></span>Win</span>
      <span><span class="dot D"></span>Draw</span>
      <span><span class="dot L"></span>Loss</span>
    </div>`;
}

/* ================================================================
   7. PER-TEAM STANDING BUBBLE (replaces the old full standings table)
   Shows just this match's two teams — points + W-D-L record — as a
   compact pill under each team name in the header. Still backed by
   the same real STANDINGS_DATA; only the display changed.
   ================================================================ */
function bubbleHTML(row) {
  if (!row) return "";
  return `<span class="sb-pts">${row.points} PTS</span><span>${row.won}W-${row.drawn}D-${row.lost}L</span>`;
}

function renderStandingBubbles() {
  const homeBubble = document.getElementById("homeStandingBubble");
  const awayBubble = document.getElementById("awayStandingBubble");
  const group = STANDINGS_DATA[match.group];

  if (!group) {
    homeBubble.hidden = true;
    awayBubble.hidden = true;
    return;
  }

  const homeRow = group.find(r => r.code === match.home.code);
  const awayRow = group.find(r => r.code === match.away.code);

  if (homeRow) { homeBubble.innerHTML = bubbleHTML(homeRow); homeBubble.hidden = false; }
  if (awayRow) { awayBubble.innerHTML = bubbleHTML(awayRow); awayBubble.hidden = false; }
}

/** Tap-to-toggle tooltip explaining P/W/D/L/Pts — works on mobile, unlike hover. */
function setupStandingsTooltip() {
  const btn = document.getElementById("standingsInfoBtn");
  const tip = document.getElementById("standingsTooltip");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isHidden = tip.hidden;
    tip.hidden = !isHidden;
    btn.setAttribute("aria-expanded", String(isHidden));
  });
  document.addEventListener("click", (e) => {
    if (!tip.hidden && !tip.contains(e.target) && e.target !== btn) {
      tip.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

/* ================================================================
   8. SECTION 6 — LINEUPS / PITCH
   ================================================================ */
function posCategory(pos) {
  if (pos === "GK") return "GK";
  if (/B$/.test(pos)) return "DEF";
  if (/M$/.test(pos)) return "MID";
  return "FWD";
}

function groupByCategory(startingXI) {
  const groups = { GK: [], DEF: [], MID: [], FWD: [] };
  startingXI.forEach(p => groups[posCategory(p.pos)].push(p));
  return groups;
}

function initials(name) {
  const parts = name.split(" ");
  return ((parts[0] ? parts[0][0] : "") + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

/** Last name only, so the label fits on one line in a ~40-58px token — full name is still in the title tooltip. */
function shortName(name) {
  const parts = name.trim().split(" ");
  return parts[parts.length - 1];
}

function playerToken(p, side) {
  return `
    <div class="player-token ${side}" title="${p.name} · ${p.pos}">
      <div class="player-dot">${initials(p.name)}</div>
      <div class="player-name">${shortName(p.name)}</div>
      <div class="player-pos">${p.pos}</div>
    </div>`;
}

function renderLineups() {
  document.getElementById("homeFormationTag").textContent = "—";
  document.getElementById("awayFormationTag").textContent = "—";

  const intel = match.intel && match.intel.lineups;
  const pitch = document.getElementById("pitch");

  if (!intel) {
    pitch.innerHTML = `<p class="panel-empty" style="background:transparent;border-color:var(--pitch-line);color:var(--text-secondary)">Lineups haven't been confirmed for this match yet.</p>`;
    document.getElementById("subsHome").textContent = "—";
    document.getElementById("subsAway").textContent = "—";
    return;
  }

  document.getElementById("homeFormationTag").textContent = intel.home.formation;
  document.getElementById("awayFormationTag").textContent = intel.away.formation;

  const h = groupByCategory(intel.home.startingXI);
  const a = groupByCategory(intel.away.startingXI);

  function row(players, side) {
    return `<div class="pitch-row">${players.map(p => playerToken(p, side)).join("")}</div>`;
  }

  pitch.innerHTML = `
    <div class="pitch-half away-half">
      ${row([...a.GK, ...a.DEF], "away")}
      ${row(a.MID, "away")}
      ${row(a.FWD, "away")}
    </div>
    <div class="pitch-half home-half">
      ${row(h.FWD, "home")}
      ${row(h.MID, "home")}
      ${row([...h.DEF, ...h.GK], "home")}
    </div>`;

  document.getElementById("subsHome").innerHTML = intel.home.subs.map(s => `<b>${s}</b>`).join(", ");
  document.getElementById("subsAway").innerHTML = intel.away.subs.map(s => `<b>${s}</b>`).join(", ");
}

/* ================================================================
   9. SECTION 9 — MARKET INTELLIGENCE
   (Embed slot itself needs no JS — it's a static paste-in target
   already wired up responsively in match.css.)
   ================================================================ */
function renderMarketIntelligence() {
  const summary = document.getElementById("marketSummaryContent");
  const insight = document.getElementById("marketInsightContent");

  if (match.winProbability) {
    const wp = match.winProbability;
    const isPast = currentStatus() === "finished";
    const label = isPast ? "Pre-match model probability (match has since concluded)" : "Model win probability";
    summary.innerHTML = `
      <p style="font-size:12.5px;color:var(--text-secondary);margin:0 0 4px;">${label}</p>
      <div class="prob-bar">
        <span class="p-home" style="width:${wp.home}%"></span>
        <span class="p-draw" style="width:${wp.draw}%"></span>
        <span class="p-away" style="width:${wp.away}%"></span>
      </div>
      <div class="prob-legend">
        <span>${match.home.name} ${wp.home}%</span>
        <span>Draw ${wp.draw}%</span>
        <span>${match.away.name} ${wp.away}%</span>
      </div>`;
    insight.innerHTML = isPast
      ? `<p class="ai-summary-text" style="font-size:13px;">Going in, the model gave <b>${match.home.name}</b> a ${wp.home}% chance to win — see the AI Match Summary above for how it actually played out.</p>`
      : `<p class="ai-summary-text" style="font-size:13px;">The model gives <b>${match.home.name}</b> a ${wp.home}% chance heading into kickoff. Once you connect a live odds widget on the left, this card can also surface line movement and public betting splits automatically.</p>`;
  } else if (currentStatus() === "finished") {
    summary.innerHTML = `<p class="panel-empty">This match has concluded — no closing-line data connected.</p>`;
    insight.innerHTML = `<p class="panel-empty">Connect a market data source to show postgame market recap here.</p>`;
  } else {
    summary.innerHTML = `<p class="panel-empty">Live in-play market data isn't connected yet.</p>`;
    insight.innerHTML = `<p class="panel-empty">This card is wired and ready — it just needs a feed.</p>`;
  }
}

/* ================================================================
   10. SECTION 8 — FLOATING AI ASSISTANT
   ================================================================ */
const ASSISTANT_QUESTIONS = [
  "Show Last 10 Matches",
  "Show Goalscorers",
  "Show Team Strengths",
  "Show Team Weaknesses",
  "Show Recent Trends",
  "Show Tactical Analysis"
];

function answerQuestion(question) {
  const stats = match.intel && match.intel.teamStats;
  const lf = match.intel && match.intel.lastFive;
  const lineups = match.intel && match.intel.lineups;

  if (question === "Show Goalscorers") {
    if (match.intel && match.intel.keyEvents) {
      const list = match.intel.keyEvents.map(e => `${e.minute}' ${e.team === "home" ? match.home.name : match.away.name}`).join(", ");
      return `Goals — ${list}. (Player names aren't in this data source yet, only minute and team.)`;
    }
    return "No goal data available for this match yet.";
  }

  if (question === "Show Last 10 Matches") {
    const t = match.intel && match.intel.last10;
    if (t) {
      const note = t.sample ? " (sample data — see the Last 10 Match Timeline above)" : "";
      return `${match.home.name}: ${t.home.join(" ")}. ${match.away.name}: ${t.away.join(" ")}.${note}`;
    }
    return "Match history isn't connected for these teams yet.";
  }

  if (question === "Show Team Strengths") {
    if (stats) {
      const hAcc = stats.home.shotsTotal ? Math.round(stats.home.shotsOnTarget / stats.home.shotsTotal * 100) : 0;
      const aAcc = stats.away.shotsTotal ? Math.round(stats.away.shotsOnTarget / stats.away.shotsTotal * 100) : 0;
      return `${match.home.name}: controlled the ball (${stats.home.possession}% possession) and were clinical in front of goal — ${stats.home.shotsOnTarget} of ${stats.home.shotsTotal} shots on target (${hAcc}% accuracy). ${match.away.name}: still managed ${stats.away.shotsOnTarget} shots on target from ${stats.away.shotsTotal} attempts (${aAcc}%) despite seeing less of the ball.`;
    }
    if (match.winProbability) {
      return `Full team stats aren't connected for this match yet, but the model gives ${match.home.name} a ${match.winProbability.home}% win probability heading into kickoff — see Market Intelligence below for the full breakdown.`;
    }
    return "Team stats aren't connected for this match yet — strengths will populate automatically once they are.";
  }

  if (question === "Show Team Weaknesses") {
    if (stats) {
      const aAcc = stats.away.shotsTotal ? Math.round(stats.away.shotsOnTarget / stats.away.shotsTotal * 100) : 0;
      return `${match.home.name}: conceded twice despite dominating the match, suggesting some vulnerability defending in transition. ${match.away.name}: only ${aAcc}% shot accuracy (${stats.away.shotsOnTarget} of ${stats.away.shotsTotal}) and committed the most fouls (${stats.away.fouls}), pointing to discipline issues under pressure.`;
    }
    return "Team stats aren't connected for this match yet — weaknesses will populate automatically once they are.";
  }

  if (question === "Show Recent Trends") {
    if (lf) {
      const homeWins = lf.home.filter(r => r.result === "W").length;
      const awayLosses = lf.away.filter(r => r.result === "L").length;
      const note = lf.sample ? " (sample data — swap for a real results feed any time)" : "";
      return `${match.home.name} have won ${homeWins} of their last 5${note}. ${match.away.name} have lost ${awayLosses} of their last 5, with defensive struggles a recurring theme.`;
    }
    return "Recent match history isn't connected for these teams yet.";
  }

  if (question === "Show Tactical Analysis") {
    if (lineups && stats) {
      return `${match.home.name} lined up in a ${lineups.home.formation}, leaning on central control (${stats.home.possession}% possession) to generate ${stats.home.shotsTotal} shot attempts. ${match.away.name}'s ${lineups.away.formation} looked to play on the counter but only forced ${stats.away.shotsOnTarget} shots on target from ${stats.away.shotsTotal} attempts. ${match.home.name} committing ${stats.home.fouls} fouls hints at an aggressive press disrupting ${match.away.name}'s build-up.`;
    }
    return "Tactical analysis needs lineup and stats data, which isn't connected for this match yet.";
  }

  return "This needs a connected stats/scouting feed — planned for a future version of the Match Intelligence Page.";
}

function setupAssistant() {
  const fab = document.getElementById("assistantFab");
  const panel = document.getElementById("assistantPanel");
  const questionsEl = document.getElementById("assistantQuestions");
  const answerEl = document.getElementById("assistantAnswer");

  questionsEl.innerHTML = ASSISTANT_QUESTIONS.map(q => `<button class="assistant-q-btn" data-q="${q}">${q}</button>`).join("");

  fab.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    fab.setAttribute("aria-expanded", isOpen);
  });

  questionsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".assistant-q-btn");
    if (!btn) return;
    answerEl.innerHTML = `<div class="assistant-answer">${answerQuestion(btn.dataset.q)}</div>`;
  });
}

/* ================================================================
   RENDER + LIVE REFRESH
   ================================================================ */
function renderAll() {
  const steps = [
    renderHeader, renderHeaderLiveBadge, renderStatusBar, renderAiSummary,
    renderComparison, renderTimeline, renderLastFive, renderH2H,
    renderStandingBubbles, renderLineups, renderMarketIntelligence
  ];
  steps.forEach(fn => {
    try { fn(); } catch (err) { console.error(`Render step "${fn.name}" failed:`, err); }
  });
}

renderAll();
setupAssistant();
setupStandingsTooltip();

// Tick for any match that started as upcoming/live, since Feature 3's
// effective-status logic can flip it to live, then finished, over time.
// A match that was already statically "finished" never needs to tick.
if (match.status !== "finished") {
  setInterval(() => { renderStatusBar(); renderHeaderLiveBadge(); }, 1000);
}
