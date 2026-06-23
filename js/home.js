/* ============================================================
   WORLDCUPIQ — HOME LOGIC
   Static demo data only. No backend / API calls yet — this file
   renders the UI exactly as it will behave once data is wired up.
   ============================================================ */

/* ---------- TEAM DIRECTORY ---------- */
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

/* ---------- MATCH DATA (illustrative) ---------- */
const LIVE_MATCHES = [
  {id:'arg-fra', state:'live', home:'ARG', away:'FRA', comp:'FIFA World Cup 2026', group:'Group A', stage:'Group Stage',
    minute:67, half:'2nd Half', score:[2,1], possession:[58,42], shots:[14,9], aiConfidence:78, sentiment:6},
  {id:'bra-ned', state:'live', home:'BRA', away:'NED', comp:'FIFA World Cup 2026', group:'Group D', stage:'Round of 16',
    minute:34, half:'1st Half', score:[1,1], possession:[64,36], shots:[9,5], aiConfidence:71, sentiment:3},
];

const UPCOMING_MATCHES = [
  {id:'usa-mex', state:'upcoming', home:'USA', away:'MEX', comp:'FIFA World Cup 2026', group:'Group C', stage:'Group Stage',
    kickoff:hrs(5), tag:'Today', formHome:'W-W-D-W-L', formAway:'W-D-W-W-W', aiConfidence:64, sentiment:2},
  {id:'por-mar', state:'upcoming', home:'POR', away:'MAR', comp:'FIFA World Cup 2026', group:'Group H', stage:'Group Stage',
    kickoff:hrs(27), tag:'Tomorrow', formHome:'W-W-W-D-W', formAway:'D-W-L-W-W', aiConfidence:69, sentiment:-4},
];

const SAVED_POOL_EXTRA = [
  {id:'cro-ger', state:'upcoming', home:'CRO', away:'GER', comp:'FIFA World Cup 2026', group:'Group F', stage:'Group Stage',
    kickoff:hrs(31), tag:'Tomorrow', formHome:'D-W-W-L-W', formAway:'W-W-D-W-W', aiConfidence:55, sentiment:-2},
  {id:'jpn-esp', state:'finished', home:'JPN', away:'ESP', comp:'FIFA World Cup 2026', group:'Group E', stage:'Group Stage',
    score:[0,3], possession:[39,61], shots:[6,17], aiConfidence:74, sentiment:9, playedOn:'Jun 19'},
];

const RECENT_MATCHES = [
  {id:'col-uru', state:'finished', home:'COL', away:'URU', comp:'FIFA World Cup 2026', group:'Group G', stage:'Group Stage',
    score:[2,0], possession:[52,48], shots:[11,8], aiConfidence:62, sentiment:5, playedOn:'Jun 20'},
  {id:'bel-ita', state:'finished', home:'BEL', away:'ITA', comp:'FIFA World Cup 2026', group:'Group B', stage:'Group Stage',
    score:[1,1], possession:[49,51], shots:[10,12], aiConfidence:58, sentiment:-1, playedOn:'Jun 20'},
];

const MARKET_MOVERS = [
  {name:'England', change:12, spark:[40,42,45,44,50,55,58,64,70,78]},
  {name:'Brazil',  change:8,  spark:[55,53,57,58,60,59,62,64,66,68]},
  {name:'France',  change:6,  spark:[60,61,59,62,63,62,64,65,66,67]},
  {name:'Croatia', change:-9, spark:[50,48,47,44,42,40,38,35,33,31]},
  {name:'Argentina', change:4, spark:[62,63,62,64,65,64,66,67,67,68]},
  {name:'Morocco', change:-5, spark:[44,43,42,43,41,40,39,38,37,36]},
];

/* ---------- MATCH POOL — every known match, keyed by id ----------
   Live/Upcoming/Recent each render their own fixed 2-card section;
   Saved Research is dynamic and draws from this whole pool based on
   whatever the visitor has saved (from any section, on either page). */
const MATCH_POOL = {};
[...LIVE_MATCHES, ...UPCOMING_MATCHES, ...RECENT_MATCHES, ...SAVED_POOL_EXTRA].forEach(m => MATCH_POOL[m.id] = m);

/* ---------- saved-state: persisted to localStorage, shared with match.html ---------- */
const SAVED_STORAGE_KEY = 'worldcupiq:savedMatches';
function loadSavedIds(){
  try{
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if(raw) return new Set(JSON.parse(raw));
  }catch(e){ /* localStorage unavailable — fall through to default */ }
  return new Set(['cro-ger','jpn-esp']);
}
function persistSaved(){
  try{ localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(Array.from(savedState))); }catch(e){}
}
const savedState = loadSavedIds();

/* ============================================================ HELPERS ============================================================ */
function fmtSigned(n){ return (n>0?'+':'') + n + '%'; }

function sentimentBadge(n){
  const cls = n>=0 ? 'badge-up' : 'badge-down';
  const arrow = n>=0 ? '▲' : '▼';
  return `<span class="badge ${cls}">${arrow} ${Math.abs(n)}%</span>`;
}

function confidenceRing(pct, size=38){
  return `<div class="confidence-ring" style="--pct:0;width:${size}px;height:${size}px" data-ring="${pct}"><span>${pct}</span></div>`;
}

function sparklinePath(values, w=120, h=34){
  const min = Math.min(...values), max = Math.max(...values);
  const range = (max-min)||1;
  const pts = values.map((v,i)=>{
    const x = (i/(values.length-1))*w;
    const y = h - ((v-min)/range)*h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return pts;
}

function timeLeft(ts){
  let diff = Math.max(0, ts - Date.now());
  const h = Math.floor(diff/3600000);
  const m = Math.floor((diff%3600000)/60000);
  return `${h}h ${m}m`;
}

const clockSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mc-countdown-clock" style="width:12px;height:12px"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`;
const bookmarkSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
const arrowUpRightSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M7 17L17 7M7 7h10v10"/></svg>`;
const archiveSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`;
const trashSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v4M14 11v4"/></svg>`;

/* ============================================================ CARD BUILDERS ============================================================ */
function teamBlock(code, side){
  const t = TEAMS[code];
  return `<div class="mc-team ${side}"><span class="mc-flag">${t.flag}</span><span class="mc-team-name">${t.name}</span></div>`;
}

function metaLine(m){
  return `<div class="mc-comp"><b>${m.comp}</b> · ${m.group} · ${m.stage}</div>`;
}

function statCell(label, valueHtml, extraClass=''){
  return `<div class="mc-stat ${extraClass}"><div class="mc-stat-label">${label}</div><div class="mc-stat-val">${valueHtml}</div></div>`;
}

function actionsRow(m){
  const isSaved = savedState.has(m.id);
  return `
  <div class="mc-actions">
    <button class="btn btn-ghost save-toggle ${isSaved?'is-saved':''}" data-save="${m.id}">
      ${bookmarkSvg.replace('<svg ', '<svg style="width:14px;height:14px" ')} ${isSaved?'Saved':'Save'}
    </button>
    <button class="btn btn-gold" data-openmarket="${m.id}">
      Open Market ${arrowUpRightSvg.replace('<svg ', '<svg style="width:13px;height:13px" ')}
    </button>
  </div>`;
}

function savedActionsRow(m){
  return `
  <div class="saved-actions" style="margin-top:10px;">
    <button class="icon-only" data-archive="${m.id}" title="Archive match">${archiveSvg}</button>
    <button class="icon-only danger" data-delete="${m.id}" title="Delete match">${trashSvg}</button>
  </div>`;
}

function cardLive(m, savedContext=false){
  return `
  <article class="match-card is-live reveal" data-card="${m.id}">
    <div class="mc-top">
      ${metaLine(m)}
      <span class="badge badge-live"><span class="live-dot"></span> LIVE</span>
    </div>
    <div class="mc-teams">
      ${teamBlock(m.home,'home')}
      <div class="mc-score">${m.score[0]}<span class="dash">:</span>${m.score[1]}</div>
      ${teamBlock(m.away,'away')}
    </div>
    <div class="mc-subline is-live"><span class="live-dot"></span> ${m.minute}' · ${m.half}</div>
    <div class="mc-stats">
      ${statCell('Possession', `${m.possession[0]}%`)}
      ${statCell('Shots', `${m.shots[0]}–${m.shots[1]}`)}
      ${statCell('AI Confidence', `<div class="mc-stat-ring">${confidenceRing(m.aiConfidence,28)}</div>`)}
      ${statCell('Market', sentimentBadge(m.sentiment))}
    </div>
    <div class="mc-possession">
      <span class="mc-poss-label mono">${m.possession[0]}%</span>
      <div class="mc-poss-bar"><div class="mc-poss-fill" data-width="${m.possession[0]}"></div></div>
      <span class="mc-poss-label mono">${m.possession[1]}%</span>
    </div>
    ${actionsRow(m)}
    ${savedContext?savedActionsRow(m):''}
  </article>`;
}

function cardUpcoming(m, savedContext=false){
  return `
  <article class="match-card is-upcoming reveal" data-card="${m.id}">
    <div class="mc-top">
      ${metaLine(m)}
      <span class="badge badge-neutral ${m.tag==='Today'?'mc-tag-today':'mc-tag-tomorrow'}">${m.tag}</span>
    </div>
    <div class="mc-teams">
      ${teamBlock(m.home,'home')}
      <span class="mc-vs">VS</span>
      ${teamBlock(m.away,'away')}
    </div>
    <div class="mc-subline is-upcoming">${clockSvg} <span data-countdown="${m.kickoff}">Kicks off in ${timeLeft(m.kickoff)}</span></div>
    <div class="mc-stats">
      ${statCell('Form · Home', `<span class="mono" style="font-size:12px">${m.formHome}</span>`)}
      ${statCell('Form · Away', `<span class="mono" style="font-size:12px">${m.formAway}</span>`)}
      ${statCell('AI Confidence', `<div class="mc-stat-ring">${confidenceRing(m.aiConfidence,28)}</div>`)}
      ${statCell('Market', sentimentBadge(m.sentiment))}
    </div>
    ${actionsRow(m)}
    ${savedContext?savedActionsRow(m):''}
  </article>`;
}

function cardFinished(m, savedContext=false){
  return `
  <article class="match-card is-finished reveal" data-card="${m.id}">
    <div class="mc-top">
      ${metaLine(m)}
      <span class="badge badge-neutral">FT</span>
    </div>
    <div class="mc-teams">
      ${teamBlock(m.home,'home')}
      <div class="mc-score">${m.score[0]}<span class="dash">:</span>${m.score[1]}</div>
      ${teamBlock(m.away,'away')}
    </div>
    <div class="mc-subline muted mono">Full time · ${m.playedOn}</div>
    <div class="mc-stats">
      ${statCell('Possession', `${m.possession[0]}%`)}
      ${statCell('Shots', `${m.shots[0]}–${m.shots[1]}`)}
      ${statCell('AI Confidence', `<div class="mc-stat-ring">${confidenceRing(m.aiConfidence,28)}</div>`)}
      ${statCell('Market Close', sentimentBadge(m.sentiment))}
    </div>
    <div class="mc-possession">
      <span class="mc-poss-label mono">${m.possession[0]}%</span>
      <div class="mc-poss-bar"><div class="mc-poss-fill" data-width="${m.possession[0]}"></div></div>
      <span class="mc-poss-label mono">${m.possession[1]}%</span>
    </div>
    ${actionsRow(m)}
    ${savedContext?savedActionsRow(m):''}
  </article>`;
}

function buildCard(m, savedContext=false){
  if(m.state==='live') return cardLive(m, savedContext);
  if(m.state==='upcoming') return cardUpcoming(m, savedContext);
  return cardFinished(m, savedContext);
}

/* ============================================================ MOVER CARD ============================================================ */
function buildMover(mv){
  const isUp = mv.change >= 0;
  const pts = sparklinePath(mv.spark);
  return `
  <div class="mover-card reveal">
    <div class="mover-top">
      <span class="mover-name">${mv.name}</span>
      <span class="mover-chg ${isUp?'up':'down'}" data-countup="${mv.change}">${isUp?'+':''}0%</span>
    </div>
    <div class="mover-sub">Win Probability</div>
    <svg class="mover-spark" viewBox="0 0 120 34" preserveAspectRatio="none">
      <polyline points="${pts}" fill="none" stroke="${isUp?'var(--up)':'var(--down)'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>`;
}

/* ============================================================ RENDER ============================================================ */
function renderAll(){
  document.getElementById('liveMatches').innerHTML = LIVE_MATCHES.map(m=>buildCard(m)).join('') || emptyState('No live matches right now.');
  document.getElementById('upcomingMatches').innerHTML = UPCOMING_MATCHES.map(m=>buildCard(m)).join('');
  document.getElementById('recentMatches').innerHTML = RECENT_MATCHES.map(m=>buildCard(m)).join('');
  document.getElementById('marketMovers').innerHTML = MARKET_MOVERS.map(buildMover).join('');
  document.getElementById('heroTicker').innerHTML = tickerHtml();
  renderSaved();
}

/* Saved Research is fully dynamic: draws from the shared pool based on
   whatever is currently in savedState, capped at 2 per the spec. Called
   on first load and again after every save / unsave / archive / delete. */
function renderSaved(animateNow=false){
  const ids = Array.from(savedState).filter(id => MATCH_POOL[id]).slice(0,2);
  const container = document.getElementById('savedMatches');
  container.innerHTML = ids.length
    ? ids.map(id => buildCard(MATCH_POOL[id], true)).join('')
    : emptyState('Save a match to build your research list.');
  document.getElementById('savedCount').textContent = savedState.size;
  if(animateNow){
    container.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
    animateRings(container);
  } else {
    container.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
  }
}

function emptyState(msg){ return `<div class="empty-state">${msg}</div>`; }

function tickerHtml(){
  const items = MARKET_MOVERS.map(mv=>`<span class="ticker-item"><span class="t-name">${mv.name}</span><span class="t-chg ${mv.change>=0?'up':'down'}">${fmtSigned(mv.change)}</span></span>`).join('');
  return items + items; /* duplicated for seamless loop */
}

/* ============================================================ INTERACTIVITY ============================================================ */
function wireEvents(){
  document.body.addEventListener('click', (e)=>{
    const saveBtn = e.target.closest('[data-save]');
    if(saveBtn){
      const id = saveBtn.dataset.save;
      if(savedState.has(id)) savedState.delete(id); else savedState.add(id);
      persistSaved();
      const nowSaved = savedState.has(id);
      saveBtn.classList.toggle('is-saved', nowSaved);
      saveBtn.innerHTML = `${bookmarkSvg.replace('<svg ', '<svg style="width:14px;height:14px" ')} ${nowSaved?'Saved':'Save'}`;
      renderSaved(true);
      return;
    }
    const marketBtn = e.target.closest('[data-openmarket]');
    if(marketBtn){
      e.stopPropagation();
      window.open('https://polymarket.com', '_blank', 'noopener');
      return;
    }
    const archiveBtn = e.target.closest('[data-archive]');
    if(archiveBtn){
      const id = archiveBtn.dataset.archive;
      savedState.delete(id);
      persistSaved();
      const card = archiveBtn.closest('.match-card');
      card.style.transition='opacity .3s, transform .3s';
      card.style.opacity='0'; card.style.transform='translateX(12px)';
      setTimeout(()=>renderSaved(true), 300);
      return;
    }
    const deleteBtn = e.target.closest('[data-delete]');
    if(deleteBtn){
      const id = deleteBtn.dataset.delete;
      savedState.delete(id);
      persistSaved();
      const card = deleteBtn.closest('.match-card');
      card.style.transition='opacity .3s, transform .3s';
      card.style.opacity='0'; card.style.transform='translateX(12px)';
      setTimeout(()=>renderSaved(true), 300);
      return;
    }
    const card = e.target.closest('.match-card');
    if(card){
      window.location.href = `match.html?id=${card.dataset.card}`;
    }
  });

  document.getElementById('navSaved').addEventListener('click', ()=>{
    document.getElementById('section-saved').scrollIntoView({behavior:'smooth', block:'start'});
  });
  document.getElementById('navSettings').addEventListener('click', ()=>{
    alert('Settings panel — coming soon.');
  });

  document.getElementById('searchInput').addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      const q = e.target.value.trim();
      if(q) document.getElementById('section-live').scrollIntoView({behavior:'smooth'});
    }
  });
}

/* ---------- animated number rings / bars / count-ups on reveal ---------- */
function animateRings(scope=document){
  scope.querySelectorAll('.confidence-ring[data-ring]').forEach(ring=>{
    const target = parseInt(ring.dataset.ring, 10);
    let cur = 0;
    const span = ring.querySelector('span');
    const step = Math.max(1, Math.round(target/30));
    const iv = setInterval(()=>{
      cur += step;
      if(cur >= target){ cur = target; clearInterval(iv); }
      ring.style.setProperty('--pct', cur);
      span.textContent = cur;
    }, 16);
  });
  scope.querySelectorAll('.mc-poss-fill[data-width]').forEach(bar=>{
    requestAnimationFrame(()=>{ bar.style.width = bar.dataset.width + '%'; });
  });
  scope.querySelectorAll('[data-countup]').forEach(el=>{
    const target = parseInt(el.dataset.countup, 10);
    const isUp = target >= 0;
    let cur = 0;
    const step = Math.max(1, Math.round(Math.abs(target)/20));
    const iv = setInterval(()=>{
      cur += step;
      if(cur >= Math.abs(target)){ cur = Math.abs(target); clearInterval(iv); }
      el.textContent = `${isUp?'+':'-'}${cur}%`;
    }, 18);
  });
}

/* ---------- reveal on scroll (shared observer so dynamically-added cards can reuse it) ---------- */
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('in');
      animateRings(en.target);
      revealObserver.unobserve(en.target);
    }
  });
}, {threshold:0.15});

function setupReveal(){
  document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
}

/* ---------- live countdown ticking ---------- */
function tickCountdowns(){
  document.querySelectorAll('[data-countdown]').forEach(el=>{
    const ts = parseInt(el.dataset.countdown, 10);
    el.textContent = `Kicks off in ${timeLeft(ts)}`;
  });
}

/* ============================================================ INIT ============================================================ */
document.addEventListener('DOMContentLoaded', ()=>{
  renderAll();
  wireEvents();
  setupReveal();
  setInterval(tickCountdowns, 60000);
});
