// ================= Representation like the real business (Round 27) =================
// The old list was a scatter of cute names with one-word personalities. Real representation has a shape, and the
// game now follows it (every name below is invented):
//  - a handful of giant full-service agencies with offices around the world and departments for film talent,
//    literary, television, below-the-line crafts, music, creators, brands and books; they represent most of the
//    famous, package films, and a newcomer there is one name on a junior agent's list;
//  - mid-size agencies: several departments, a real client list, more attention per client;
//  - specialist boutiques: talent, literary, or below-the-line crafts (DPs, editors, designers), small lists and
//    partners who answer the phone;
//  - management companies: managers aren't licensed to negotiate deals, take 15% rather than 10%, shape the whole
//    career (notes, "generals", which jobs to turn down) and often produce.
// Each agency shows its type, offices, departments, roughly how many clients it has, who some of them are (real people
// from this world), its commission and how it works. Signing gives you a team: your own agent at a rank that fits your
// standing, and the departments that cover you.
const AG_TYPES = {
  giant: { label: 'Full-service agency', d: 'One of the giants: offices in several countries and a department for everything. They represent most of the famous and put films together from their own lists. You will be one name among thousands.' },
  mid: { label: 'Mid-size agency', d: 'A real agency with several departments and a strong list, small enough that the partners know your name.' },
  talent: { label: 'Talent boutique', d: 'Actors only: a small, careful list, strong with casting directors and theatre.' },
  lit: { label: 'Literary boutique', d: 'Writers and directors: they read everything, send scripts out wide and get you into rooms with producers.' },
  crafts: { label: 'Below-the-line agency', d: 'Heads of department and crew: cinematographers, editors, designers, composers. They know every line producer in town.' },
  mgmt: { label: 'Management company', d: 'Managers, not agents: they shape the career, give notes, set up general meetings and often produce. They take 15%, and work alongside an agent or a lawyer for the deals.' }
};
const AG_DEPTS = {
  giant: ['Film talent', 'Film literary', 'Television', 'Below-the-line', 'Music', 'Creators & digital', 'Brand partnerships', 'Unscripted', 'Books', 'Comedy', 'Voice'],
  mid: ['Talent', 'Literary', 'Television', 'Comedy', 'Voice & commercials', 'Theatre'],
  talent: ['Film & TV talent', 'Theatre', 'Commercials'], lit: ['Screenwriters', 'Directors', 'Books to film'],
  crafts: ['Cinematographers', 'Editors', 'Production design', 'Costume', 'Composers & music supervisors', 'Hair & make-up'], mgmt: ['Talent management', 'Literary management', 'Production']
};
// [name, tier, focus, style, type, size (clients), founded, offices ('*' = every big city)]
const AG_ROSTER = [
  ['Halcyon Artists Group', 3, 'all', 'packager', 'giant', 5200, 1975, '*'], ['Vantage Creative Agency', 3, 'all', 'shark', 'giant', 4600, 1898, '*'], ['Granite Talent & Literary', 3, 'all', 'packager', 'giant', 3900, 1991, '*'],
  ['Ashby Rowe Agency', 2, 'all', 'nurturer', 'mid', 820, 1949, 'hollywood,newyork,london'], ['Kestrel & Lane', 2, 'all', 'shark', 'mid', 640, 1987, 'hollywood,newyork'], ['Northgate Artists', 2, 'all', 'quiet', 'mid', 560, 1962, 'london,paris,berlin'],
  ['Corvel Morrison Agency', 2, 'all', 'nurturer', 'mid', 480, 1978, 'hollywood,toronto,sydney'], ['Bellweather International', 2, 'all', 'packager', 'mid', 700, 1983, 'mumbai,london,dubai,singapore'], ['Orient Pearl Artists', 2, 'all', 'shark', 'mid', 610, 1994, 'beijing,hongkong,shanghai,seoul,tokyo'],
  ['Hollis Bright Talent', 1, 'talent', 'boutique', 'talent', 140, 2004, 'hollywood,newyork'], ['Penrose Talent', 2, 'talent', 'nurturer', 'talent', 260, 1971, 'london,newyork'], ['Marlowe Street Actors', 1, 'talent', 'boutique', 'talent', 90, 1999, 'local'],
  ['Saltmarsh & Pell', 1, 'talent', 'quiet', 'talent', 120, 1989, 'local'], ['Ledger & Quill Literary', 2, 'lit', 'boutique', 'lit', 180, 1993, 'hollywood,newyork,london'], ['Fernhill Literary', 1, 'lit', 'nurturer', 'lit', 75, 2008, 'local'],
  ['Brightline Writers & Directors', 2, 'lit', 'shark', 'lit', 220, 1999, 'hollywood,london'], ['Framewright Crafts', 2, 'crew', 'nurturer', 'crafts', 310, 1985, 'hollywood,newyork,atlanta,london,vancouver'], ['Sightline Artists', 1, 'crew', 'boutique', 'crafts', 140, 2001, 'local'],
  ['Key & Fill Crafts Agency', 1, 'crew', 'shark', 'crafts', 160, 2011, 'local'], ['Underscore Artists', 1, 'crew', 'boutique', 'crafts', 85, 1997, 'hollywood,london,mumbai'], ['Lantern House Management', 2, 'all', 'manager', 'mgmt', 150, 1996, 'hollywood,newyork,london'],
  ['Overland Management & Production', 2, 'all', 'manager', 'mgmt', 110, 2005, 'hollywood,newyork'], ['Thistle & Crane Management', 1, 'all', 'manager', 'mgmt', 45, 2014, 'local'], ['Second Draft Management', 1, 'lit', 'manager', 'mgmt', 40, 2010, 'local']
];
AG_STYLE.manager = { label: 'Manager', d: 'Takes 15%. Shapes the whole career: notes on your work, general meetings, which jobs to turn down. Patient, and often produces.', cut: .15, pitch: 0, pay: 0, patience: 52, refs: 1, fit: 1 };
if (typeof AG_BOOK !== 'undefined') AG_BOOK.manager = .02;
AGENCY_NAMES.length = 0; for (const a of AG_ROSTER) AGENCY_NAMES.push([a[0], a[1], a[2], a[3]]);
const BIG_AG_HUBS = new Set(['hollywood', 'newyork', 'london', 'paris', 'mumbai', 'tokyo', 'seoul', 'beijing', 'berlin', 'toronto', 'sydney', 'hongkong']);
function agenciesIn(hub) {
  const big = BIG_AG_HUBS.has(hub), r = hashRand([...hub].reduce((a, c) => a * 31 + c.charCodeAt(0), 11) >>> 0), out = [];
  const here = A => A[7] === '*' ? true : A[7] === 'local' ? true : A[7].split(',').includes(hub);
  // the giants are everywhere big; a smaller city gets one giant's local office
  const giants = AG_ROSTER.filter(A => A[4] === 'giant'), rest = AG_ROSTER.filter(A => A[4] !== 'giant' && here(A)).slice();
  for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
  const G = big ? giants : [giants[Math.floor(r() * giants.length)]];
  const mids = rest.filter(A => A[7] !== 'local' && A[4] === 'mid').slice(0, big ? 3 : 1), others = rest.filter(A => !mids.includes(A) && A[4] !== 'mid');
  const byT = ['lit', 'talent', 'crafts', 'mgmt'].map(t => others.filter(A => A[4] === t)), sp = [];
  for (let k = 0; sp.length < Math.max(0, 11 - G.length - mids.length) && byT.some(L => L.length); k++) { const L = byT[k % 4]; if (L.length) sp.push(L.shift()); }
  const pick = G.concat(mids).concat(sp);
  pick.forEach((A, i) => { const [n, tier, focus, style, type, size, founded, offices] = A;
    const local = offices === 'local', name = local && hub !== 'hollywood' ? `${n} ${hubName(hub)}` : n;
    out.push({ i, name, tier, focus, style, type, size: Math.round(size * (local ? .5 + r() * .5 : big ? 1 : .35)), founded: local ? Math.max(founded, 1990 + Math.floor(r() * 30)) : founded, offices: offices === '*' ? 'Every major city' : local ? hubName(hub) + ' only' : offices.split(',').map(h => HUBS[h] ? hubName(h) : h).join(', '), depts: AG_DEPTS[type], base: n }); });
  return out;
}
// everyone of note has representation; working people further down have boutiques and managers
{ const _ao = agencyOf; agencyOf = function (p) {
  const a = _ao.apply(this, arguments); if (a || !p || p.dead || p.player) return a;
  if (p.standing < 22 && (p.fame || 0) < 12) return null;
  const fits = x => x.focus === 'all' || (x.focus === 'talent' ? p.role === 'actor' : x.focus === 'lit' ? ['writer', 'director', 'producer'].includes(p.role) : x.focus === 'crew' ? !['actor', 'writer', 'director', 'producer'].includes(p.role) : true);
  const L = agenciesIn(p.hub).filter(x => x.tier <= 2 && x.type !== 'giant' && fits(x)); if (!L.length) return null;
  return L[Math.floor(gH(p.id, 'agency2') * L.length)];
}; }
function agClients(ag, hub, n = 4) {
  const ids = []; for (const role of ['actor', 'director', 'writer', 'producer', 'dp', 'editor', 'composer', 'designer']) for (const id of (S.pool[hub] || {})[role] || []) ids.push(id);
  const L = ids.map(P).filter(p => p && !p.dead && !p.retired && !p.player && (agencyOf(p) || {}).name === ag.name);
  L.sort((a, b) => (b.fame || 0) + b.standing / 2 - (a.fame || 0) - a.standing / 2);
  return { n: L.length, top: L.slice(0, n) };
}
function agRank(ag, me) {
  const s = me.standing + (me.fame || 0) / 2;
  if (ag.type === 'mgmt') return s < 40 ? 'Manager' : 'Senior manager';
  if (ag.tier === 3) return s < 30 ? 'Junior agent (newly promoted from an assistant\'s desk)' : s < 55 ? 'Agent' : s < 75 ? 'Senior agent' : 'Partner';
  if (ag.tier === 2) return s < 25 ? 'Agent' : s < 60 ? 'Senior agent' : 'Partner';
  return s < 50 ? 'Partner' : 'Founding partner';
}
// the departments that cover you, by what you do
function agTeam(ag, role) {
  const D = ag.depts || [], want = role === 'actor' ? /talent|theatre|commercial|voice|television|comedy/i : ['writer', 'director', 'producer'].includes(role) ? /literary|writer|director|books|television|unscripted|production/i : /below|cinemat|editor|design|costume|composer|crafts|make-up|music/i;
  return D.filter(d => want.test(d)).slice(0, 4);
}
{ const _sa = signAgent; signAgent = function (ag, why) {
  const r = _sa.apply(this, arguments), M = S.me; if (!M.agent || !ag) return r;
  const full = agenciesIn(M.hub).find(a => a.name === ag.name) || ag, me = ME(), rank = agRank(full, me);
  M.agent.type = full.type; M.agent.rank = rank; M.agent.team = agTeam(full, me.role);
  const q = P(M.agent.id); if (q) q.occ = (full.type === 'mgmt' ? 'Manager' : rank.replace(/ \(.*\)$/, '')) + ' at ' + full.name;
  return r; }; }
// a senior agent at a big agency gets more done; a junior one less
{ const _bo = agentBookOdds; agentBookOdds = function () { const v = _bo.apply(this, arguments), A = S.me && S.me.agent; if (!A || !A.rank) return v; return clamp(v + (/Partner/.test(A.rank) ? .02 : /Senior/.test(A.rank) ? .01 : /Junior/.test(A.rank) ? -.015 : 0), .01, .25); }; }

function agCard(a, M) {
  const T = AG_TYPES[a.type] || AG_TYPES.mid, st = AG_STYLE[a.style] || AG_STYLE.nurturer, fits = agFits(a), p = Math.round(queryOdds(a) * 100), wait = (M.queried || {})[a.i] > S.week - 12, C = agClients(a, M.hub, 3);
  return `<article class="ag-card${fits ? '' : ' nofit'}"><header><b>${esc(a.name)}</b><span class="ag-stars" title="Tier">${'★'.repeat(a.tier)}${'☆'.repeat(3 - a.tier)}</span></header>
   <p class="ag-meta">${esc(T.label)} · ${a.size.toLocaleString()} clients · since ${a.founded} · ${esc(a.offices)}</p>
   <p class="ag-depts">${a.depts.map(d => `<span>${esc(d)}</span>`).join('')}</p>
   <p class="small">${esc(st.label)}: ${esc(st.d)}</p>
   <p class="small muted">${C.top.length ? 'Represents ' + C.top.map(x => pl(x.id)).join(', ') + (C.n > C.top.length ? ` and ${C.n - C.top.length} more here` : '') : 'No one you would know yet.'}</p>
   <footer>${fits ? `<span class="oddsbar"><span class="ob-t"><i style="width:${p}%" class="${p < 35 ? 'lo' : p < 65 ? 'mid' : 'hi'}"></i></span><b>${p}%</b></span>${wait ? '<span class="muted small">Queried: wait twelve weeks</span>' : `<button class="btn-s ghost" data-query="${a.i}">Send a query</button>`}` : `<span class="muted small">Represents ${esc(AG_FOCUS[a.focus])}</span>`}</footer></article>`;
}
function representationHTML() {
  const M = S.me, me = ME(), ags = agenciesIn(M.hub);
  if (M.agent) {
    const full = ags.find(a => a.name === M.agent.name), st = AG_STYLE[M.agent.style || 'nurturer'], quiet = S.week - M.agent.lastBook, team = M.agent.team || (full ? agTeam(full, me.role) : []);
    return `<div class="ag-mine"><p><b>${esc(M.agent.name)}</b> ${'★'.repeat(M.agent.tier)} <span class="muted">${esc((AG_TYPES[M.agent.type || (full && full.type)] || {}).label || '')}</span></p>
     <p>${M.agent.type === 'mgmt' ? 'Your manager' : 'Your agent'}: ${pl(M.agent.id)}, ${esc((M.agent.rank || 'Agent').toLowerCase())}. ${esc(st.label)}: ${esc(st.d)}</p>
     ${team.length ? `<p class="small">Covering you: ${team.map(d => `<span class="chip">${esc(d)}</span>`).join(' ')}</p>` : ''}
     <p class="small">Commission ${Math.round(M.agent.cut * 100)}% · ${M.agent.books || 0} direct booking${M.agent.books === 1 ? '' : 's'} · last booking ${quiet} week${quiet === 1 ? '' : 's'} ago${quiet > st.patience - 10 ? ' <span class="bad">(they\'re getting restless)</span>' : ''}</p>
     <p><button class="linkish" data-fireagent="1">Leave ${M.agent.type === 'mgmt' ? 'your manager' : 'your agent'}</button></p></div>`;
  }
  const groups = [['The big agencies', a => a.type === 'giant'], ['Mid-size agencies', a => a.type === 'mid'], ['Specialists', a => ['talent', 'lit', 'crafts'].includes(a.type)], ['Management companies', a => a.type === 'mgmt']];
  return `<div class="ag-how"><p><b>How representation works.</b> Agents find you work and negotiate the deals for 10% of what you earn. Managers take 15%, can't negotiate deals themselves, and shape the career instead. The giants represent most of the famous, but a newcomer there is one name on a junior agent's list; a boutique has fewer doors and more attention. Send a query (each agency looks at you once every twelve weeks), or get some credits and they will call you.</p></div>
   ${groups.map(([h, f]) => { const L = ags.filter(f).sort((x, y) => agFits(y) - agFits(x)); return L.length ? `<h4 class="ag-h">${h}</h4><div class="ag-grid">${L.map(a => agCard(a, M)).join('')}</div>` : ''; }).join('')}`;
}
{ const _pp = pathsPanel; pathsPanel = function () { const h = _pp.apply(this, arguments); const i = h.indexOf('<h3>Representation</h3>'); if (i < 0) return h; try { return h.slice(0, i) + '<h3>Representation</h3>' + representationHTML() + '</section>'; } catch (e) { return h; } }; }
(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.ag-how{padding:10px 12px;border-left:3px solid var(--accent,#c84);background:color-mix(in srgb,var(--accent,#c84) 7%,transparent);border-radius:0 8px 8px 0;margin:6px 0 10px}.ag-how p{margin:0;font-size:13px}
.ag-h{margin:14px 0 6px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted,#777)}
.ag-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}
.ag-card{border:1px solid var(--line,#ddd);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:4px;background:var(--panel,#fff)}.ag-card.nofit{opacity:.62}
.ag-card header{display:flex;justify-content:space-between;gap:8px;align-items:baseline}.ag-card header b{font-size:15px}.ag-stars{color:#c9a227;letter-spacing:1px;font-size:12px}
.ag-card p{margin:0}.ag-meta{font-size:12px;color:var(--muted,#777)}.ag-depts{display:flex;flex-wrap:wrap;gap:4px}.ag-depts span{font-size:11px;padding:1px 7px;border-radius:9px;background:color-mix(in srgb,var(--ink,#111) 7%,transparent)}
.ag-card footer{margin-top:auto;padding-top:6px;display:flex;gap:10px;align-items:center;justify-content:space-between}.ag-card .oddsbar{flex:1}
.ag-mine{border:1px solid var(--line,#ddd);border-radius:10px;padding:10px 14px}.ag-mine p{margin:4px 0}`; document.head.appendChild(st); })();
