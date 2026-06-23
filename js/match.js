/* ============================================================
   WORLDCUPIQ — MATCH INTELLIGENCE LOGIC
   This file synthesizes a full "match detail" view-model from a
   lightweight base record — the same shape a future API-Football /
   Football-Data.org / Cloudflare AI Worker response would fill.
   Swap `buildDetail()` for a real fetch later; rendering stays put.
   ============================================================ */

/* ---------- TEAM DIRECTORY (duplicated from home.js — static site) ---------- */
const TEAMS = {
  ARG:{name:'Argentina',flag:'🇦🇷'}, FRA:{name:'France',flag:'🇫🇷'},
  BRA:{name:'Brazil',flag:'🇧🇷'},    NED:{name:'Netherlands',flag:'🇳🇱'},
  USA:{name:'USA',flag:'🇺🇸'},       MEX:{name:'Mexico',flag:'🇲🇽'},
  POR:{name:'Portugal',flag:'🇵🇹'},  MAR:{name:'Morocco',flag:'🇲🇦'},
  CRO:{name:'Croatia',flag:'🇭🇷'},   GER:{name:'Germany',flag:'🇩🇪'},
  JPN:{name:'Japan',flag:'🇯🇵'},     ESP:{name:'Spain',flag:'🇪🇸'},
  COL:{name:'Colombia',flag:'🇨🇴'},  URU:{name:'Uruguay',flag:'🇺🇾'},
  BEL:{name:'Belgium',flag:'🇧🇪'},   ITA:{name:'Italy',flag:'🇮🇹'},
};

const now = Date.now();
const hrs = h => now + h*3600*1000;

/* ---------- BASE MATCH RECORDS (duplicated from home.js) ---------- */
const MATCHES = {
  'arg-fra':{id:'arg-fra', state:'live', home:'ARG', away:'FRA', comp:'FIFA World Cup 2026', group:'Group A', stage:'Group Stage',
    minute:67, half:'2nd Half', score:[2,1], possession:[58,42], shots:[14,9], aiConfidence:78, sentiment:6},
  'bra-ned':{id:'bra-ned', state:'live', home:'BRA', away:'NED', comp:'FIFA World Cup 2026', group:'Group D', stage:'Round of 16',
    minute:34, half:'1st Half', score:[1,1], possession:[64,36], shots:[9,5], aiConfidence:71, sentiment:3},
  'usa-mex':{id:'usa-mex', state:'upcoming', home:'USA', away:'MEX', comp:'FIFA World Cup 2026', group:'Group C', stage:'Group Stage',
    kickoff:hrs(5), aiConfidence:64, sentiment:2},
  'por-mar':{id:'por-mar', state:'upcoming', home:'POR', away:'MAR', comp:'FIFA World Cup 2026', group:'Group H', stage:'Group Stage',
    kickoff:hrs(27), aiConfidence:69, sentiment:-4},
  'cro-ger':{id:'cro-ger', state:'upcoming', home:'CRO', away:'GER', comp:'FIFA World Cup 2026', group:'Group F', stage:'Group Stage',
    kickoff:hrs(31), aiConfidence:55, sentiment:-2},
  'jpn-esp':{id:'jpn-esp', state:'finished', home:'JPN', away:'ESP', comp:'FIFA World Cup 2026', group:'Group E', stage:'Group Stage',
    score:[0,3], possession:[39,61], shots:[6,17], aiConfidence:74, sentiment:9, playedOn:'Jun 19'},
  'col-uru':{id:'col-uru', state:'finished', home:'COL', away:'URU', comp:'FIFA World Cup 2026', group:'Group G', stage:'Group Stage',
    score:[2,0], possession:[52,48], shots:[11,8], aiConfidence:62, sentiment:5, playedOn:'Jun 20'},
  'bel-ita':{id:'bel-ita', state:'finished', home:'BEL', away:'ITA', comp:'FIFA World Cup 2026', group:'Group B', stage:'Group Stage',
    score:[1,1], possession:[49,51], shots:[10,12], aiConfidence:58, sentiment:-1, playedOn:'Jun 20'},
};

/* ============================================================ SEEDED RANDOM (stable per match id) ============================================================ */
function hashStr(s){ let h=0; for(let i=0;i<s.length;i++){ h = Math.imul(31,h) + s.charCodeAt(i) | 0; } return h; }
function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function pick(rnd, arr){ return arr[Math.floor(rnd()*arr.length)]; }
function range(rnd, min, max){ return min + rnd()*(max-min); }

/* ---------- generic name pools (fictional, for demo data only) ---------- */
const SURNAMES = ['Silva','Rossi','Garcia','Mueller','Dubois','Nakamura','Costa','Novak','Hernandez','Okafor','Petrov','Andersson','Larsson','Moreno','Ferreira','Kowalski','Santos','Bianchi','Kovac','Ibrahim'];
const INITIALS = ['M','J','L','K','R','T','A','D','S','N','P','E'];
function genName(rnd){ return `${pick(rnd,INITIALS)}. ${pick(rnd,SURNAMES)}`; }

const FORMATIONS = ['4-3-3','4-2-3-1','3-4-3','4-4-2','5-3-2','3-5-2'];
const FORMATION_POS = {
  '4-3-3': [{x:50,y:92,gk:1},{x:18,y:72},{x:38,y:74},{x:62,y:74},{x:82,y:72},{x:30,y:50},{x:50,y:52},{x:70,y:50},{x:20,y:22},{x:50,y:18},{x:80,y:22}],
  '4-2-3-1':[{x:50,y:92,gk:1},{x:18,y:72},{x:38,y:74},{x:62,y:74},{x:82,y:72},{x:38,y:56},{x:62,y:56},{x:20,y:36},{x:50,y:34},{x:80,y:36},{x:50,y:14}],
  '3-4-3': [{x:50,y:92,gk:1},{x:28,y:74},{x:50,y:76},{x:72,y:74},{x:15,y:50},{x:38,y:52},{x:62,y:52},{x:85,y:50},{x:20,y:22},{x:50,y:18},{x:80,y:22}],
  '4-4-2': [{x:50,y:92,gk:1},{x:18,y:72},{x:38,y:74},{x:62,y:74},{x:82,y:72},{x:18,y:50},{x:38,y:52},{x:62,y:52},{x:82,y:50},{x:38,y:20},{x:62,y:20}],
  '5-3-2': [{x:50,y:94,gk:1},{x:12,y:76},{x:30,y:78},{x:50,y:80},{x:70,y:78},{x:88,y:76},{x:28,y:50},{x:50,y:52},{x:72,y:50},{x:38,y:20},{x:62,y:20}],
  '3-5-2': [{x:50,y:94,gk:1},{x:28,y:78},{x:50,y:80},{x:72,y:78},{x:12,y:52},{x:32,y:54},{x:50,y:50},{x:68,y:54},{x:88,y:52},{x:38,y:20},{x:62,y:20}],
};

const FEED_ICONS = {
  trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
  tactic:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  goals:'<circle cx="12" cy="12" r="9"/><path d="M12 3v6l5 3"/>',
  injury:'<path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>',
  market:'<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 6-6"/>',
};

/* ---------- saved-state: shared with home.js via localStorage ---------- */
const SAVED_STORAGE_KEY = 'worldcupiq:savedMatches';
function loadSavedIds(){
  try{
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if(raw) return new Set(JSON.parse(raw));
  }catch(e){ /* localStorage unavailable — fall through to default */ }
  return new Set(['cro-ger','jpn-esp']);
}
function persistSaved(set){
  try{ localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(Array.from(set))); }catch(e){}
}

/* ============================================================ DETAIL GENERATOR ============================================================ */
function buildDetail(base){
  const rnd = mulberry32(hashStr(base.id));
  const homeT = TEAMS[base.home], awayT = TEAMS[base.away];

  /* --- edges --- */
  const edgeDefs = ['Attack Edge','Defense Edge','Form Edge','Experience Edge','Market Edge'];
  const edges = edgeDefs.map(name => ({name, value: Math.round(range(rnd,38,94))}));
  const overall = Math.round(edges.reduce((s,e)=>s+e.value,0)/edges.length);
  edges.push({name:'Overall Edge', value:overall, overall:true});

  /* --- AI feed --- */
  const favoured = rnd() > 0.5 ? homeT.name : awayT.name;
  const feed = [
    {tag:'trend', title:`${homeT.name} unbeaten in ${Math.round(range(rnd,3,7))} of their last matches`, time:`${Math.round(range(rnd,2,40))}m ago`,
      body:`${homeT.name} have controlled midfield tempo in recent fixtures, generating more final-third entries than their opponents on average.`},
    {tag:'tactic', title:`${awayT.name} likely to sit in a mid-to-low block`, time:`${Math.round(range(rnd,40,90))}m ago`,
      body:`Recent setups suggest ${awayT.name} will defend compactly and look to break quickly through the wide channels.`},
    {tag:'goals', title:`Over 2.5 goals in ${Math.round(range(rnd,2,5))} of the last 6 head-to-heads`, time:`${Math.round(range(rnd,1,3))}h ago`,
      body:`Recent meetings between these two sides have trended toward open, high-tempo matches with goals at both ends.`},
    {tag:'injury', title:`Fitness watch on a rotation-risk starter`, time:`${Math.round(range(rnd,3,6))}h ago`,
      body:`A regular starter is carrying a minor knock from the last fixture — squad depth should cover the gap if rotated out.`},
    {tag:'market', title:`Sentiment has moved toward ${favoured} in the last 24h`, time:`${Math.round(range(rnd,6,12))}h ago`,
      body:`Probability pricing has drifted toward this side following team news and recent form signals.`},
  ];

  /* --- match-specific market movers (outcome row) --- */
  let homeP = Math.round(range(rnd,30,58)), drawP = Math.round(range(rnd,16,26));
  let awayP = 100 - homeP - drawP;
  if(awayP < 8){ awayP = 10; homeP = 100 - awayP - drawP; }
  const outcomes = [
    {label:`${homeT.name} Win`, pct:homeP, chg: Math.round(range(rnd,-8,9))},
    {label:'Draw', pct:drawP, chg: Math.round(range(rnd,-5,5))},
    {label:`${awayT.name} Win`, pct:awayP, chg: Math.round(range(rnd,-9,8))},
  ].map(o=>({...o, spark: Array.from({length:9},(_,i)=> o.pct - o.chg + (o.chg*(i/8)) + range(rnd,-3,3))}));

  /* --- key trends --- */
  const trends = [
    {val:`${Math.round(range(rnd,4,9))}`, label:'Match unbeaten streak (combined)'},
    {val:`${range(rnd,1.8,3.2).toFixed(1)}`, label:'Goals per match, last 6 h2h'},
    {val:`${Math.round(range(rnd,40,68))}%`, label:'Goals scored after halftime'},
    {val:`${Math.round(range(rnd,2,5))}/6`, label:'Clean sheets in last 6'},
  ];

  /* --- scorer trends --- */
  function scorerFor(teamName){
    return {name:genName(rnd), team:teamName, goals:Math.round(range(rnd,3,9)), gpm:range(rnd,0.4,1.15)};
  }
  const scorers = [scorerFor(homeT.name), scorerFor(awayT.name), scorerFor(rnd()>0.5?homeT.name:awayT.name)]
    .sort((a,b)=>b.goals-a.goals);

  /* --- risks --- */
  const risks = [
    {sev:'high', title:`${awayT.name} concede from set-pieces`, body:`${Math.round(range(rnd,30,48))}% of goals conceded this tournament have come from corners or free kicks.`},
    {sev:'med', title:`Rotation risk in midfield`, body:`A key central midfielder is managing a knock — a like-for-like swap would change build-up tempo.`},
    {sev:'low', title:`Travel & rest disadvantage`, body:`${homeT.name} have one fewer rest day than usual between fixtures — limited historical impact on this matchup.`},
  ];

  /* --- tactical matchup --- */
  const homeForm = pick(rnd, FORMATIONS), awayForm = pick(rnd, FORMATIONS);
  const tactical = {
    home:{formation:homeForm,
      strengths:[`Quick transition through ${pick(rnd,['the right channel','central overloads','the left half-space'])}`, `Set-piece delivery from wide areas`],
      weaknesses:[`Exposed to pace in behind the back line`, `Drops deep late, inviting pressure`]},
    away:{formation:awayForm,
      strengths:[`Compact defensive shape, low xG conceded`, `Direct counters off turnovers`],
      weaknesses:[`Struggles against high press`, `Aerial vulnerability at set pieces`]},
    midfieldAdv: Math.round(range(rnd,30,70)), // % favouring home
    wingAdv: Math.round(range(rnd,30,70)),     // % favouring home
  };

  /* --- team comparison --- */
  function pair(min,max){ const h = Math.round(range(rnd,min,max)); const a = Math.round(range(rnd,min,max)); return [h,a]; }
  const compareDefs = ['Possession %','Shots on Target','Pass Accuracy %','Aerial Duels Won','Big Chances Created','Tackles Won'];
  const compareRanges = [[40,62],[3,9],[72,90],[8,22],[1,6],[10,24]];
  const compare = compareDefs.map((label,i)=>{ const [h,a] = pair(...compareRanges[i]); return {label, h, a}; });

  /* --- last 10 timeline (home team form) --- */
  const timeline = Array.from({length:10}, ()=>{
    const r = rnd();
    const result = r > 0.62 ? 'W' : (r > 0.32 ? 'D' : 'L');
    const opp = pick(rnd, Object.values(TEAMS).map(t=>t.name).filter(n=>n!==homeT.name));
    const gf = Math.round(range(rnd,0,3)), ga = result==='W' ? Math.round(range(rnd,0,gf)) : (result==='L' ? Math.round(range(rnd,gf+1,gf+3)) : gf);
    return {result, opp, score:`${gf}-${ga}`};
  });

  /* --- match facts --- */
  const venues = ['Estadio Azteca, Mexico City','MetLife Stadium, New Jersey','SoFi Stadium, Los Angeles','BMO Field, Toronto','AT&T Stadium, Dallas'];
  const referees = ['A. Diallo','M. Petersen','R. Castillo','K. Whitmore','J. Brandao'];
  const h2hW = Math.round(range(rnd,2,9)), h2hD = Math.round(range(rnd,1,4)), h2hL = Math.round(range(rnd,2,9));
  const facts = [
    {label:'Referee', val:pick(rnd,referees)},
    {label:'Venue', val:pick(rnd,venues)},
    {label:'Attendance (est.)', val:`${Math.round(range(rnd,58,82))},${Math.round(range(rnd,100,990))}`},
    {label:'Head-to-Head', val:`${h2hW}W – ${h2hD}D – ${h2hL}L`},
    {label:'Avg Goals, H2H', val:range(rnd,1.8,3.4).toFixed(1)},
    {label:'Kickoff Temp (est.)', val:`${Math.round(range(rnd,21,33))}°C`},
  ];

  /* --- lineups --- */
  function lineup(formation){
    const positions = FORMATION_POS[formation];
    const starters = positions.map((p,i)=>({num:i+1, name: i===0 ? genName(rnd)+' (GK)' : genName(rnd), pos:p}));
    const subs = Array.from({length:7}, (_,i)=>({num:12+i, name:genName(rnd)}));
    return {formation, starters, subs};
  }
  const lineups = {home: lineup(homeForm), away: lineup(awayForm)};

  /* --- top performer --- */
  const top = scorers[0];
  const performer = {
    name: top.name, team: top.team, rating: range(rnd,7.2,9.4).toFixed(1),
    goals: top.goals, assists: Math.round(range(rnd,1,6)), keyStat: `${Math.round(range(rnd,68,94))}% pass accuracy`,
  };

  return {edges, feed, outcomes, trends, scorers, risks, tactical, compare, timeline, facts, lineups, performer,
          venue: facts[1].val};
}

/* ============================================================ SMALL UI HELPERS ============================================================ */
function sparkPoints(values, w=120, h=40){
  const min = Math.min(...values), max = Math.max(...values), range_ = (max-min)||1;
  return values.map((v,i)=>`${(i/(values.length-1)*w).toFixed(1)},${(h-((v-min)/range_)*h).toFixed(1)}`).join(' ');
}
function sentimentBadge(n){
  const cls = n>=0 ? 'badge-up' : 'badge-down';
  return `<span class="badge ${cls}">${n>=0?'▲':'▼'} ${Math.abs(n)}%</span>`;
}

/* ============================================================ RENDER: 1. MATCH HEADER BAND ============================================================ */
function renderBand(m, d){
  const homeT = TEAMS[m.home], awayT = TEAMS[m.away];
  document.title = `${homeT.name} vs ${awayT.name} — WorldCupIQ`;
  document.getElementById('crumbLabel').textContent = `${homeT.name} vs ${awayT.name}`;

  let statusHtml = '';
  if(m.state === 'live'){
    statusHtml = `<span class="badge badge-live"><span class="live-dot"></span> LIVE</span><span>${m.minute}' · ${m.half}</span>`;
  } else if(m.state === 'upcoming'){
    statusHtml = `<span class="badge badge-neutral">Kickoff in <span id="bandCountdown">--</span></span>`;
  } else {
    statusHtml = `<span class="badge badge-neutral">Full Time · ${m.playedOn}</span>`;
  }

  const scoreHtml = m.state === 'upcoming'
    ? `<div class="band-score mono" style="font-size:30px;color:var(--ink-700)">VS</div>`
    : `<div class="band-score">${m.score[0]}<span class="dash">:</span>${m.score[1]}</div>`;

  document.getElementById('matchBand').innerHTML = `
    <div class="band-top">
      <span class="band-comp"><b>${m.comp}</b> · ${m.group} · ${m.stage}</span>
      <span class="band-comp">${d.venue}</span>
    </div>
    <div class="band-main">
      <div class="band-team"><span class="band-flag">${homeT.flag}</span><span class="band-team-name">${homeT.name}</span></div>
      <div class="band-center">${scoreHtml}<div class="band-status">${statusHtml}</div></div>
      <div class="band-team"><span class="band-flag">${awayT.flag}</span><span class="band-team-name">${awayT.name}</span></div>
    </div>
    <div class="band-meta">
      <span>AI Confidence: <b>${m.aiConfidence}%</b></span><span class="sep">|</span>
      <span>Market Sentiment: ${sentimentBadge(m.sentiment)}</span>
    </div>
    <div class="band-actions">
      <button class="btn btn-gold" id="bandOpenMarket">Open Market</button>
      <button class="btn btn-ghost" id="bandSave">Save Match</button>
      <button class="btn btn-outline" id="bandShare">Share</button>
    </div>`;

  if(m.state === 'upcoming'){
    const el = document.getElementById('bandCountdown');
    const tick = ()=>{
      let diff = Math.max(0, m.kickoff - Date.now());
      const h = Math.floor(diff/3600000), mi = Math.floor((diff%3600000)/60000);
      el.textContent = `${h}h ${mi}m`;
    };
    tick(); setInterval(tick, 60000);
  }
}

/* ============================================================ RENDER: 2. RESEARCH SNAPSHOT (compass + edges) ============================================================ */
function renderSnapshot(d){
  const c = d.edges.find(e=>e.overall);
  const others = d.edges.filter(e=>!e.overall);
  const cx=140, cy=140, r=104;
  const n = others.length;
  const pts = others.map((e,i)=>{
    const ang = (Math.PI*2*i/n) - Math.PI/2;
    const rr = r * (e.value/100);
    return `${(cx+rr*Math.cos(ang)).toFixed(1)},${(cy+rr*Math.sin(ang)).toFixed(1)}`;
  }).join(' ');
  const axisLines = others.map((e,i)=>{
    const ang = (Math.PI*2*i/n) - Math.PI/2;
    return `<line x1="${cx}" y1="${cy}" x2="${(cx+r*Math.cos(ang)).toFixed(1)}" y2="${(cy+r*Math.sin(ang)).toFixed(1)}" stroke="var(--line)" stroke-width="1"/>`;
  }).join('');
  const labels = others.map((e,i)=>{
    const ang = (Math.PI*2*i/n) - Math.PI/2;
    const lx = cx + (r+22)*Math.cos(ang), ly = cy + (r+22)*Math.sin(ang);
    return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" fill="var(--ink-500)" font-size="9" font-family="JetBrains Mono">${e.value}</text>`;
  }).join('');

  document.getElementById('compassWrap').innerHTML = `
    <svg viewBox="0 0 280 280" width="280" height="280">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--line)"/>
      <circle cx="${cx}" cy="${cy}" r="${r*0.66}" fill="none" stroke="var(--line-soft)"/>
      <circle cx="${cx}" cy="${cy}" r="${r*0.33}" fill="none" stroke="var(--line-soft)"/>
      ${axisLines}
      <polygon points="${pts}" fill="rgba(212,175,55,0.18)" stroke="var(--gold-300)" stroke-width="2"/>
      <g class="compass-sweep"><path d="M${cx},${cy} L${cx},${cy-r}" stroke="var(--gold-300)" stroke-width="1" opacity="0.7"/></g>
      ${labels}
      <circle cx="${cx}" cy="${cy}" r="30" fill="var(--bg-panel)" stroke="var(--gold-500)" stroke-width="1.5"/>
      <text x="${cx}" y="${cy-2}" text-anchor="middle" fill="var(--gold-300)" font-size="20" font-weight="700" font-family="Space Grotesk">${c.value}</text>
      <text x="${cx}" y="${cy+14}" text-anchor="middle" fill="var(--ink-700)" font-size="8" font-family="JetBrains Mono">OVERALL</text>
    </svg>`;

  document.getElementById('edgeList').innerHTML = d.edges.map(e=>`
    <div class="edge-item ${e.overall?'is-overall':''}">
      <div class="edge-label"><span>${e.name}</span><b>${e.value}</b></div>
      <div class="edge-bar"><div class="edge-bar-fill" data-w="${e.value}"></div></div>
    </div>`).join('');
}

/* ============================================================ RENDER: 3. AI RESEARCH FEED ============================================================ */
function renderFeed(d){
  document.getElementById('feedList').innerHTML = d.feed.map((f,i)=>`
    <div class="feed-card" style="animation-delay:${i*0.09}s">
      <div class="feed-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${FEED_ICONS[f.tag]}</svg></div>
      <div style="flex:1;min-width:0;">
        <div class="feed-toprow"><span class="feed-title">${f.title}</span><span class="feed-time">${f.time}</span></div>
        <div class="feed-body">${f.body}</div>
      </div>
    </div>`).join('');
}

/* ============================================================ RENDER: 4. MATCH MARKET MOVERS ============================================================ */
function renderOutcomes(d){
  document.getElementById('outcomeRow').innerHTML = d.outcomes.map(o=>{
    const up = o.chg >= 0;
    return `
    <div class="outcome-card">
      <div class="outcome-top"><span class="outcome-label">${o.label}</span><span class="badge ${up?'badge-up':'badge-down'}">${up?'▲':'▼'} ${Math.abs(o.chg)}%</span></div>
      <div class="outcome-pct">${Math.round(o.pct)}%</div>
      <svg class="outcome-spark" viewBox="0 0 120 40" preserveAspectRatio="none">
        <polyline points="${sparkPoints(o.spark)}" fill="none" stroke="${up?'var(--up)':'var(--down)'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`;
  }).join('');
}

/* ============================================================ RENDER: 5. KEY TRENDS ============================================================ */
function renderTrends(d){
  document.getElementById('trendGrid').innerHTML = d.trends.map(t=>`
    <div class="trend-tile"><div class="trend-tile-val">${t.val}</div><div class="trend-tile-label">${t.label}</div></div>`).join('');
}

/* ============================================================ RENDER: 6. GOAL SCORER TRENDS ============================================================ */
function renderScorers(d){
  const maxGoals = Math.max(...d.scorers.map(s=>s.goals));
  document.getElementById('scorerList').innerHTML = d.scorers.map((s,i)=>`
    <div class="scorer-row">
      <span class="scorer-rank">${i+1}</span>
      <div style="flex:1;"><span class="scorer-name">${s.name}</span> <span class="scorer-team">${s.team}</span></div>
      <span class="mono" style="font-size:11px;color:var(--ink-500)">${s.gpm.toFixed(2)} / match</span>
      <div class="scorer-bar-shell"><div class="scorer-bar-fill" data-w="${(s.goals/maxGoals*100).toFixed(0)}"></div></div>
      <span class="scorer-goals">${s.goals}</span>
    </div>`).join('');
}

/* ============================================================ RENDER: 7. MATCH RISKS ============================================================ */
function renderRisks(d){
  document.getElementById('riskList').innerHTML = d.risks.map(r=>`
    <div class="risk-card sev-${r.sev}">
      <span class="risk-sev">${r.sev}</span>
      <div><div class="risk-title">${r.title}</div><div class="risk-body">${r.body}</div></div>
    </div>`).join('');
}

/* ============================================================ RENDER: 8. TACTICAL MATCHUP ============================================================ */
function pitchSVG(formation, color){
  const pts = FORMATION_POS[formation];
  const dots = pts.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="${p.gk?3.6:3.2}" fill="${p.gk?'var(--ink-300)':color}" stroke="var(--bg-void)" stroke-width="0.8"/>`).join('');
  return `<svg class="pitch-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="1" y="1" width="98" height="98" rx="3" fill="var(--bg-panel)" stroke="var(--line)" stroke-width="0.6"/>
    <line x1="1" y1="50" x2="99" y2="50" stroke="var(--line)" stroke-width="0.5"/>
    <circle cx="50" cy="50" r="10" fill="none" stroke="var(--line)" stroke-width="0.5"/>
    ${dots}
  </svg>`;
}
function renderTactical(d){
  const t = d.tactical;
  document.getElementById('tacticalGrid').innerHTML = `
    <div class="pitch-card">
      <div class="pitch-head"><span class="pitch-team">Home</span><span class="pitch-formation">${t.home.formation}</span></div>
      ${pitchSVG(t.home.formation, 'var(--gold-300)')}
      <div class="tactic-notes">
        ${t.home.strengths.map(s=>`<div class="tactic-note strength">${s}</div>`).join('')}
        ${t.home.weaknesses.map(s=>`<div class="tactic-note weakness">${s}</div>`).join('')}
      </div>
    </div>
    <div class="pitch-card">
      <div class="pitch-head"><span class="pitch-team">Away</span><span class="pitch-formation">${t.away.formation}</span></div>
      ${pitchSVG(t.away.formation, '#9fb4e0')}
      <div class="tactic-notes">
        ${t.away.strengths.map(s=>`<div class="tactic-note strength">${s}</div>`).join('')}
        ${t.away.weaknesses.map(s=>`<div class="tactic-note weakness">${s}</div>`).join('')}
      </div>
    </div>`;
  document.getElementById('advMeters').innerHTML = `
    <div class="adv-row"><div class="adv-label"><span>Midfield Control</span><span>${t.midfieldAdv}% / ${100-t.midfieldAdv}%</span></div>
      <div class="adv-bar"><div class="adv-bar-fill" data-w="${t.midfieldAdv}"></div></div></div>
    <div class="adv-row"><div class="adv-label"><span>Wing Play</span><span>${t.wingAdv}% / ${100-t.wingAdv}%</span></div>
      <div class="adv-bar"><div class="adv-bar-fill" data-w="${t.wingAdv}"></div></div></div>`;
}

/* ============================================================ RENDER: 9. TEAM COMPARISON ============================================================ */
function renderCompare(d){
  document.getElementById('compareList').innerHTML = d.compare.map(row=>{
    const total = row.h + row.a || 1;
    const hPct = (row.h/total*100).toFixed(1), aPct = (row.a/total*100).toFixed(1);
    return `
    <div class="compare-row">
      <div class="compare-label">${row.label}</div>
      <span class="compare-val-left">${row.h}</span>
      <div class="bar-left"><div class="compare-fill gold" data-w="${hPct}"></div></div>
      <div class="bar-right"><div class="compare-fill steel" data-w="${aPct}"></div></div>
      <span class="compare-val-right">${row.a}</span>
    </div>`;
  }).join('');
}

/* ============================================================ RENDER: 10. LAST 10 TIMELINE ============================================================ */
function renderTimeline(d){
  document.getElementById('timelineRow').innerHTML = d.timeline.map(t=>`
    <div class="timeline-pip ${t.result}">${t.result}
      <div class="tip">vs ${t.opp} · ${t.score}</div>
    </div>`).join('');
}

/* ============================================================ RENDER: 11. MATCH FACTS ============================================================ */
function renderFacts(d){
  document.getElementById('factsGrid').innerHTML = d.facts.map(f=>`
    <div class="fact-cell"><div class="fact-label">${f.label}</div><div class="fact-val">${f.val}</div></div>`).join('');
}

/* ============================================================ RENDER: 12. LINEUPS ============================================================ */
function renderLineups(m, d){
  const homeT = TEAMS[m.home], awayT = TEAMS[m.away];
  function col(team, lu){
    return `
    <div class="lineup-col">
      <div class="lineup-col-head"><span>${team.flag}</span><span>${team.name}</span></div>
      <div class="lineup-formation">${lu.formation}</div>
      ${lu.starters.map(s=>`<div class="lineup-player"><span class="num">${s.num}</span><span>${s.name}</span></div>`).join('')}
      <div class="lineup-subs-head">Substitutes</div>
      ${lu.subs.map(s=>`<div class="lineup-player"><span class="num">${s.num}</span><span>${s.name}</span></div>`).join('')}
    </div>`;
  }
  document.getElementById('lineupBody').innerHTML = col(homeT, d.lineups.home) + col(awayT, d.lineups.away);
}

/* ============================================================ RENDER: 13. TOP PERFORMER ============================================================ */
function renderPerformer(d){
  const p = d.performer;
  document.getElementById('performerCard').innerHTML = `
    <div class="performer-rating" style="--pct:${p.rating*10}"><span>${p.rating}</span></div>
    <div class="performer-info">
      <div class="performer-name">${p.name}</div>
      <div class="performer-team">${p.team}</div>
    </div>
    <div class="performer-stats">
      <div><div class="performer-stat-val">${p.goals}</div><div class="performer-stat-label">Goals</div></div>
      <div><div class="performer-stat-val">${p.assists}</div><div class="performer-stat-label">Assists</div></div>
      <div><div class="performer-stat-val" style="font-size:14px;color:var(--ink-300)">${p.keyStat}</div><div class="performer-stat-label">Key Stat</div></div>
    </div>`;
}

/* ============================================================ RENDER: 14. ACTION CENTER ============================================================ */
function renderActions(){
  document.getElementById('actionCenter').innerHTML = `
    <button class="action-btn primary" id="actOpenMarket">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
      <span class="a-title">Open Market</span><span class="a-sub">View live odds for this match</span>
    </button>
    <button class="action-btn" id="actSaveMatch">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      <span class="a-title">Save Match</span><span class="a-sub">Add to your research list</span>
    </button>
    <button class="action-btn" id="actReviewMatch">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      <span class="a-title">Review Match</span><span class="a-sub">Flag for post-match analysis</span>
    </button>`;
}

/* ============================================================ ANIMATION HELPERS ============================================================ */
function animateFillsIn(scope){
  scope.querySelectorAll('[data-w]').forEach(el=>{
    requestAnimationFrame(()=>{ el.style.width = el.dataset.w + '%'; });
  });
}
function setupReveal(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('in');
        animateFillsIn(en.target);
        io.unobserve(en.target);
      }
    });
  }, {threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

/* ---------- scroll-spy for subnav ---------- */
function setupSubnavSpy(){
  const links = Array.from(document.querySelectorAll('#subnav a'));
  const sections = links.map(l=>document.querySelector(l.getAttribute('href')));
  function onScroll(){
    const offset = 140;
    let activeIdx = 0;
    sections.forEach((sec,i)=>{ if(sec && sec.getBoundingClientRect().top - offset <= 0) activeIdx = i; });
    links.forEach((l,i)=>l.classList.toggle('active', i===activeIdx));
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

/* ---------- lineup accordion ---------- */
function setupLineupToggle(){
  const btn = document.getElementById('lineupToggle');
  const body = document.getElementById('lineupBody');
  btn.addEventListener('click', ()=>{
    const open = body.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.querySelector('span').textContent = open ? 'Hide starting XI & substitutes' : 'Show starting XI & substitutes';
  });
}

/* ---------- action center + band button behaviour ---------- */
function setupActions(m){
  let saved = loadSavedIds().has(m.id);
  let reviewed = false;
  const saveBtnIds = ['bandSave', 'actSaveMatch'];

  function applySaveVisual(){
    saveBtnIds.forEach(id=>{
      const el = document.getElementById(id);
      if(!el) return;
      el.classList.toggle('is-active', saved);
      const titleEl = el.querySelector('.a-title');
      if(titleEl) titleEl.textContent = saved ? 'Saved' : 'Save Match';
      else el.textContent = saved ? 'Saved ✓' : 'Save Match';
    });
  }
  function toggleSave(){
    const ids = loadSavedIds();
    saved = !saved;
    if(saved) ids.add(m.id); else ids.delete(m.id);
    persistSaved(ids);
    applySaveVisual();
  }
  function openMarket(){
    /* Backend will later map this match id to its exact market URL */
    window.open('https://polymarket.com', '_blank', 'noopener');
  }

  applySaveVisual();
  document.getElementById('bandOpenMarket').addEventListener('click', openMarket);
  document.getElementById('actOpenMarket').addEventListener('click', openMarket);
  document.getElementById('bandSave').addEventListener('click', toggleSave);
  document.getElementById('actSaveMatch').addEventListener('click', toggleSave);
  document.getElementById('bandShare').addEventListener('click', ()=>{
    if(navigator.share){ navigator.share({title:document.title, url:location.href}); }
    else { navigator.clipboard?.writeText(location.href); alert('Match link copied to clipboard.'); }
  });
  document.getElementById('actReviewMatch').addEventListener('click', (e)=>{
    reviewed = !reviewed;
    const btn = e.currentTarget;
    btn.classList.toggle('is-active', reviewed);
    btn.querySelector('.a-title').textContent = reviewed ? 'Marked for Review' : 'Review Match';
  });
  document.getElementById('navSettings').addEventListener('click', ()=>alert('Settings panel — coming soon.'));
}

/* ============================================================ INIT ============================================================ */
document.addEventListener('DOMContentLoaded', ()=>{
  const id = new URLSearchParams(location.search).get('id');
  const m = MATCHES[id] || MATCHES['arg-fra'];
  const d = buildDetail(m);

  renderBand(m, d);
  renderSnapshot(d);
  renderFeed(d);
  renderOutcomes(d);
  renderTrends(d);
  renderScorers(d);
  renderRisks(d);
  renderTactical(d);
  renderCompare(d);
  renderTimeline(d);
  renderFacts(d);
  renderLineups(m, d);
  renderPerformer(d);
  renderActions();

  setupActions(m);
  setupLineupToggle();
  setupSubnavSpy();
  setupReveal();
});
