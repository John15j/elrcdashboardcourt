// WorldCupIQ Mock Adapter
// All match data below is copied verbatim from js/home.js — no values
// changed. home.js still holds its own copy for now and has not been
// wired to call this file yet (that's the next step, not done here).
//
// Implements the same interface DataSource expects from liveAdapter:
// getLiveMatches, getUpcomingMatches, getRecentMatches, getMatchById,
// getAiFeed, getMarketUrl.

/* ---------- TEAM DIRECTORY (verbatim from home.js) ---------- */
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

/* ---------- MATCH DATA (verbatim from home.js) ---------- */
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

/* ---------- MATCH POOL — every known match, keyed by id ----------
   Mirrors home.js's MATCH_POOL: Live + Upcoming + Recent + the two
   extra matches that only ever appeared via Saved Research (cro-ger,
   jpn-esp). getMatchById needs to resolve all of these, not just the
   three section arrays. */
const MATCH_POOL = {};
[...LIVE_MATCHES, ...UPCOMING_MATCHES, ...RECENT_MATCHES, ...SAVED_POOL_EXTRA].forEach(m => MATCH_POOL[m.id] = m);

/* ---------- seeded random (deterministic per match id) ----------
   Used only by getAiFeed below. Note: this does NOT reproduce the exact
   same numbers match.js's current inline generator shows today, because
   that generator burns 5 random draws on "edge" values before it gets to
   the feed — this adapter only generates the feed, so the draw sequence
   differs. Tags/shape/template style match exactly; the specific numbers
   in each match's feed will shift slightly once match.js is wired to call
   this instead of generating its own. Flagging this rather than silently
   matching — see status report. */
function hashStr(s){ let h=0; for(let i=0;i<s.length;i++){ h = Math.imul(31,h) + s.charCodeAt(i) | 0; } return h; }
function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function range(rnd, min, max){ return min + rnd()*(max-min); }

window.mockAdapter = {

    getLiveMatches() {
        return LIVE_MATCHES;
    },

    getUpcomingMatches() {
        return UPCOMING_MATCHES;
    },

    getRecentMatches() {
        return RECENT_MATCHES;
    },

    getMatchById(id) {
        return MATCH_POOL[id] || null;
    },

    getAiFeed(id) {
        const base = MATCH_POOL[id];
        if (!base) return [];

        const rnd = mulberry32(hashStr(id));
        const homeT = TEAMS[base.home], awayT = TEAMS[base.away];
        const favoured = rnd() > 0.5 ? homeT.name : awayT.name;

        return [
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
    },

    getMarketUrl(id) {
        // Mirrors today's actual behavior exactly: every Open Market button
        // currently opens this same fixed URL regardless of match id (see
        // home.js's data-openmarket handler and match.js's openMarket()).
        // marketMap.js's per-match table exists separately and is not
        // wired in here — that's a future decision for dataSource.js or
        // this adapter, not made as part of this extraction.
        return 'https://polymarket.com';
    }

};
