// ---------------- A world with decision-makers ----------------
// The audit found the world's top frozen: nobody new ever reached the top thirty names, the same studios led every
// world, and most companies went under. This module holds the world-side rules that answer it, each with its own
// keyed dice (wstream) so the player's actions never shift them.
//  · Breakouts: every year each busy city has a newcomer or two everyone suddenly wants to work with (high potential,
//    few credits): their heat jumps, and casting and greenlights read heat.
//  · Busts: a star whose last two films flopped loses their heat and some standing. (Not for real people alive today.)

// ---- breakouts and busts ----
function breakoutYear() {
  for (const h of HUB_IDS) {
    const prod = hubProd(h, S.year); if (prod < 4) continue; R = wstream('breakout', h, S.year);
    const n = prod > 20 ? 3 : prod > 8 ? 2 : 1;
    const L = ROLES.filter(r => r === 'actor' || r === 'director' || r === 'writer').flatMap(r => S.pool[h][r]).map(P)
      .filter(p => p && !p.dead && !p.retired && !p.player && S.year - p.born < 33 && p.credits.length <= 3 && (p.heat || 0) < 40);
    const pot = p => { const subs = Object.keys(CRAFTS[MAIN[p.role]].subs); return avg(subs.map(k => p.pot[k] || 0)); };
    const cand = L.map(p => [p, pot(p) + rnd() * 4]).sort((a, b) => b[1] - a[1]).slice(0, 6);
    for (let i = 0; i < n && cand.length; i++) { const [p] = cand.splice(Math.floor(rnd() * Math.min(3, cand.length)), 1)[0];
      p.heat = Math.max(p.heat || 0, 70); p.standing = clamp(p.standing + 8, 0, 100); p.fame = clamp((p.fame || 0) + 22, 0, 100); p.breakout = S.year;
      news('People', `${p.name} is the ${ROLE_LABEL[p.role].toLowerCase()} everyone in ${HUBS[h].name} is suddenly talking about.`, { person: p.id }); }
  }
}
{ const _y = yearly; yearly = function () { const r = _y.apply(this, arguments); breakoutYear(); return r; }; }
{ const _rl = release; release = function (f) {
  const out = _rl.apply(this, arguments);
  if (f && f.rel !== null && f.cost > 0 && !f.flopSeen) { f.flopSeen = 1; const flop = (f.total || 0) < f.cost * .6, hit = (f.total || 0) >= f.cost * 2;
    for (const id of [f.cast[0], f.dir]) { const p = P(id); if (!p || p.player) continue;
      if (hit) p.flops = 0; else if (flop) p.flops = (p.flops || 0) + 1;
      if (id === f.dir && flop && p.credits.length <= 3) p.dirFlop = 1; else if (id === f.dir && hit) p.dirFlop = 0;   // a first film that flops rarely gets a second (two in three debut directors never make another)
      if (p.flops >= 2 && (p.fame || 0) > 50 && !(typeof realLiving === 'function' && realLiving(p))) { p.flops = 0; p.heat = 0; p.standing = clamp(p.standing - 4, 0, 100); p.fame = clamp(p.fame - 5, 0, 100); if (p.fame > 60) news('Career', `After two misses in a row, the offers for ${p.name} have gone quiet.`, { person: p.id }); } } }
  return out; }; }

// ---- companies with a character of their own ----
// Leaders double down on what they themselves made work; followers chase other people's hits; contrarians walk away
// from a crowded genre and into an empty one; specialists stay in their lane. Tastes are capped per company and a
// genre every company is chasing pays less to chase.
const CO_KINDS = ['leader', 'follower', 'follower', 'contrarian', 'specialist'];
function coDNA(c) {
  if (c.dna) return c.dna; const r = hashRand(((S.seed | 0) ^ (c.id * 2654435761)) >>> 0);
  const focus = Object.keys(c.taste || {}).slice(0, 2); while (focus.length < 2) focus.push(GENRES[Math.floor(r() * GENRES.length)]);
  const watch = GENRES.filter(() => r() < .4);   // the genres a follower keeps an eye on
  return (c.dna = { kind: CO_KINDS[Math.floor(r() * CO_KINDS.length)], risk: +(.2 + r() * .7).toFixed(2), focus, watch });
}
function genreCrowd(m, g) { const L = S.companies.filter(c => c.closed === null && c.owner === undefined && HUBS[c.hub].m === m); return L.length ? L.filter(c => (c.taste[g] || 1) > 1.6).length / L.length : 0; }
function companyTaste(c, recent, m) {
  const D = coDNA(c), cap = D.kind === 'specialist' ? 2.6 : 2.2;
  for (const g in c.taste) c.taste[g] = 1 + (c.taste[g] - 1) * (D.focus.includes(g) ? .995 : .97);
  for (const f of recent) { if (f.m !== m || !(f.hitRatio > 2)) continue; const g = f.genre, crowd = genreCrowd(m, g);
    if (D.kind === 'follower' && f.co !== c.id && (D.watch || GENRES).includes(g)) c.taste[g] = (c.taste[g] || 1) + .12 * (1 - crowd);
    else if (D.kind === 'leader' && f.co === c.id) c.taste[g] = (c.taste[g] || 1) + .15;
    else if (D.kind === 'specialist' && D.focus.includes(g)) c.taste[g] = (c.taste[g] || 1) + .1; }
  if (D.kind === 'contrarian') { const crowded = GENRES.filter(g => genreCrowd(m, g) > .45); for (const g of crowded) if (c.taste[g]) c.taste[g] = 1 + (c.taste[g] - 1) * .9;
    if (crowded.length) { const quiet = GENRES.filter(g => g !== 'Documentary').sort((a, b) => genreCrowd(m, a) - genreCrowd(m, b))[0]; c.taste[quiet] = (c.taste[quiet] || 1) + .06; } }
  for (const g in c.taste) c.taste[g] = Math.min(cap, c.taste[g]);
}

// ---- failure: a sale, a rescue, or (mostly for small companies) the end ----
// Big companies rarely just vanish: they are bought, or an investment group takes them over with new money. The
// smallest still close. Returns true if the company is gone.
function coFail(c, y, scale) {
  R = wstream('rescue', c.id, y); const base = [0, 40, 12, 3][c.tier] * scale;
  const buyer = S.companies.filter(b => b !== c && b.closed === null && b.owner === undefined && b.tier <= Math.max(1, c.tier) && b.cash > -c.cash * .5 + base * .2 && (c.tier === 1 || HUBS[b.hub].m === HUBS[c.hub].m)).sort((a, b) => b.cash - a.cash)[0];
  const pBuy = [0, .45, .3, .1][c.tier], pRescue = [0, .85, .35, .05][c.tier];
  if (buyer && rnd() < pBuy) {
    buyer.cash += c.cash * .5;
    for (const f of S.films) { if (f.owner === c.id) f.owner = buyer.id; if (f.co === c.id && f.rel === null) { f.co = buyer.id; buyer.films.push(f.id); } }
    for (const k in c.favors) buyer.favors[k] = (buyer.favors[k] || 0) + c.favors[k] * .5;
    c.closed = y; c.mergedInto = buyer.id; (buyer.acquired = buyer.acquired || []).push(c.id);
    news('Company', `${buyer.name} buys the troubled ${c.name}, library and all.`, { company: buyer.id }); return true;
  }
  if (rnd() < pRescue) {
    c.cash = base * .35; c.rescued = (c.rescued || 0) + 1; c.ownerChange = y; c.taste = Object.fromEntries(Object.keys(c.taste).map(g => [g, 1])); delete c.dna;
    news('Company', `An investment group takes over ${c.name}, clears its debts and promises "a new era". The slate is under review.`, { company: c.id }); return false;
  }
  c.closed = y; news('Company', `${c.name} (${HUBS[c.hub].name}) collapses under ${fmtM(-c.cash)} of debt.`, { company: c.id }); transferLibrary(c, false); return true;
}

// ---- audiences that respond: the calendar, the competition, the appetite ----
// Real box office swings with the calendar (summer and the holidays big, September small), and more than demand does,
// because studios put their biggest films in the best weeks (Einav). Here the underlying demand swings half as much
// as real grosses do, and studios' dating makes the rest. Big films opening the same week split the crowd. A hit
// raises the appetite for its genre; a glut of one genre lowers it.
const BOX_MONTH = [.84, .9, 1.02, .84, 1.14, 1.26, 1.32, .96, .66, .84, 1.02, 1.2];   // US monthly shares of the year, ×12
function demandMul(w) { const x = BOX_MONTH[dateOf(w).getUTCMonth()]; return 1 + (x - 1) * .5; }
function relCount(m, w) { const D = S.relWk = S.relWk || {}; return D[m + ':' + w] || [0, 0]; }
function boxCalendar(f) {
  const D = S.relWk = S.relWk || {};
  const A = S.relAvg = S.relAvg || {};
  for (const m in f.gross) { const [big, all] = relCount(m, f.rel), rival = big + (all - big) * .25, avgR = A[m] ?? rival, s = f.tier === 1 ? .12 : .06;
    const k = demandMul(f.rel) * (1 + s * avgR) / (1 + s * rival); f.gross[m] *= k;   // only a busier-than-usual weekend costs a film; a quiet one helps
    if (m === f.m) f.why = { month: +demandMul(f.rel).toFixed(2), rivals: +rival.toFixed(1), usual: +avgR.toFixed(1), k: +k.toFixed(2), econ: +econDemand(m).toFixed(2), state: (S.econ || {}).state || 'normal' };
    A[m] = avgR * .98 + rival * .02; }
  for (const m in f.gross) { const key = m + ':' + f.rel, v = D[key] || [0, 0]; v[1]++; if (f.tier === 1) v[0]++; D[key] = v; }
  if (S.week % 52 === 0) for (const k in D) if (+k.split(':')[1] < S.week - 8) delete D[k];   // keep only recent weeks
}
// studios date their films: tentpoles to summer or the holidays, prestige pictures to the autumn awards run, and
// everyone avoids a weekend already crowded with big films
const PRESTIGE_G = ['Drama', 'Period', 'Biopic', 'War'];
function dateFilm(f) {
  if (f.dated || f.rel !== null || (S.me && ((S.me.company !== undefined && f.co === S.me.company) || f.dir === S.me.id))) return; f.dated = 1;
  const t0 = f.stageEnd, prestige = PRESTIGE_G.includes(f.genre) && f.tier <= 2, tent = f.tier === 1 && !prestige;
  const want = tent ? [4, 5, 6, 10, 11] : prestige ? [9, 10, 11] : null, reach = tent ? 12 : prestige ? 16 : 4;
  let best = t0, bs = -1e9;
  for (let w = t0; w <= t0 + reach; w++) { const mo = dateOf(w).getUTCMonth(), [big, all] = relCount(f.m, w), D = S.dated = S.dated || {}, dd = D[f.m + ':' + w] || 0;
    const s = (want && want.includes(mo) ? 2 : 0) + demandMul(w) * 2 - (big + dd) * (f.tier === 1 ? 7 : 2) - all * .5 - (w - t0) * .35; if (s > bs) { bs = s; best = w; } }
  f.stageEnd = best; const D = S.dated = S.dated || {}, k = f.m + ':' + best; if (f.tier === 1) D[k] = (D[k] || 0) + 1;
}
{ const _adv = advance; advance = function () { const r = _adv.apply(this, arguments); for (const id of S.active) { const f = S.films[id]; if (f && f.stage === 3 && !f.dated) dateFilm(f); } if (S.dated && S.week % 52 === 0) for (const k in S.dated) if (+k.split(':')[1] < S.week) delete S.dated[k]; return r; }; }
// appetite: hits and gluts move what audiences want, a little at a time
{ const _rl = release; release = function (f) { const out = _rl.apply(this, arguments); if (f && f.rel !== null && S.app[f.m] && f.hitRatio > 2.5 && f.co !== null) S.app[f.m][f.genre] = clamp((S.app[f.m][f.genre] || 0) + .025, -.6, 1.5); return out; }; }
{ const _mo = monthly; monthly = function () { const r = _mo.apply(this, arguments);
  const rec = S.films.filter(f => f.rel !== null && S.week - f.rel < 26 && f.rel <= S.week), by = {};
  for (const f of rec) { const k = f.m; by[k] = by[k] || { n: 0, g: {} }; by[k].n++; by[k].g[f.genre] = (by[k].g[f.genre] || 0) + 1; }
  for (const m in by) { const B = by[m]; if (B.n < 20 || !S.app[m]) continue; const fair = B.n / GENRES.length;
    for (const g in B.g) if (B.g[g] > fair * 2.2) S.app[m][g] = clamp((S.app[m][g] || 0) - .012 * Math.min(3, B.g[g] / fair - 2.2 + 1), -.6, 1.5); }
  return r; }; }

// ---- one economy ----
// The market level the Bourse already runs on (macroAt: real crashes, fictional shocks, fading) is now the economy
// everyone shares. Below 0.9 it is a recession, above 1.1 a boom, and it moves together: how many films each city
// greenlights, their budgets, what audiences spend, the job board, rents and share prices. Strikes and tax credits are
// world events per city: a strike halts every shoot in the city, a tax credit brings productions in. The player's
// city's economy shows up in their own week as before, now because it is happening to everyone.
function econLevel() { return clamp(typeof macroAt === 'function' ? macroAt(S.week) : 1, .7, 1.25); }
function econEv(h) { const E = S.econ = S.econ || { ev: [] }; return E.ev.filter(e => e.hub === h && e.from <= S.week && e.to > S.week); }
function econGL(h) { const ev = econEv(h); if (ev.some(e => e.k === 'walkout')) return 0; return Math.pow(econLevel(), 1.2) * (ev.some(e => e.k === 'credits') ? 1.35 : 1); }
function econBudget() { return Math.pow(econLevel(), .5); }
function econDemand() { return Math.pow(econLevel(), .6); }
function econMonth() {
  const E = S.econ = S.econ || { ev: [] }; E.ev = E.ev.filter(e => e.to > S.week - 52);
  for (const h of HUB_IDS) { const prod = hubProd(h, S.year); if (prod < 3) continue; R = wstream('econ', h, S.week);
    const on = econEv(h);
    if (!on.some(e => e.k === 'walkout') && rnd() < .0007 * Math.min(3, prod / 10)) { const n = 8 + Math.floor(rnd() * 13); E.ev.push({ k: 'walkout', hub: h, from: S.week + 1, to: S.week + 1 + n }); news('Industry', `The crew and writers' unions in ${HUBS[h].name} walk out. Every production in the city stops shooting.`); }
    else if (!on.some(e => e.k === 'credits') && rnd() < .005) { const n = 26 + Math.floor(rnd() * 27); E.ev.push({ k: 'credits', hub: h, from: S.week + 1, to: S.week + 1 + n }); news('Industry', `${HUBS[h].name} announces generous tax credits for filming. Productions are moving in.`); }
  }
  const lv = econLevel(), was = E.state || 'normal', st = lv < .9 ? 'recession' : lv > 1.1 ? 'boom' : 'normal';
  if (st !== was) { E.state = st; E.since = S.week; news('Industry', st === 'recession' ? 'The economy turns down. Studios cut their slates and budgets; audiences stay home.' : st === 'boom' ? 'Money is everywhere: the studios are greenlighting and audiences are spending.' : 'The economy steadies.'); }
}
{ const _mo = monthly; monthly = function () { const r = _mo.apply(this, arguments); econMonth(); return r; }; }
// a strike stops every shoot in its city (for everyone, not just the player)
{ const _adv = advance; advance = function () { for (const e of (S.econ && S.econ.ev) || []) if (e.k === 'walkout' && e.from <= S.week && e.to > S.week) for (const id of S.active) { const f = S.films[id]; if (f && f.hub === e.hub && f.stage >= 1 && f.stage <= 2) f.stageEnd++; } return _adv.apply(this, arguments); }; }
// the player's week mirrors the world's economy: these events no longer roll for the player alone
for (const e of WORLD_EVENTS) if (['recession', 'boom', 'walkout', 'credits'].includes(e.k)) e.months = [];
{ const _ww = worldWeek; worldWeek = function () {
  const M = S.me, W = M.world = M.world || { ev: [] }, have = new Set(W.ev.filter(e => e.to > S.week).map(e => e.k));
  const add = (k, to) => { if (have.has(k)) return; const e = WORLD_EVENTS.find(x => x.k === k); W.ev.push({ k, from: S.week, to }); have.add(k); inbox('note', `In the world: ${e.t.toLowerCase()}`, e.d, { world: k }); };
  for (const e of econEv(M.hub)) add(e.k, e.to);
  const st = (S.econ || {}).state; if (st === 'recession' || st === 'boom') add(st, S.week + 8);
  return _ww.apply(this, arguments); }; }

// ---- lives that count ----
// Everyone's life goes on, not only the player's friends': people fall ill and can't work, difficult people get
// fired from films, and the people fired remember who fired them. When it happens on a film in production, someone
// is recast and the film page says so. (Real people alive today are spared all of this.)
const NPC_SLOTS = f => [...f.cast.map((id, i) => [id, 'actor', i]), [f.dp, 'dp', 'dp'], [f.ed, 'editor', 'ed'], ...Object.entries(f.crew || {}).map(([k, id]) => [id, (CREW.find(c => c.k === k) || {}).role, k])].filter(x => x[0] !== undefined && x[1]);
function npcRecast(f, id, role, slot, why) {
  const p = P(id), ex = new Set(keyIds(f)), D = P(f.dir), g = f.genre, craft = role === 'actor' ? 'act' : role === 'dp' ? 'cam' : role === 'editor' ? 'edt' : (CREW.find(c => c.k === slot) || {}).c || 'act';
  const nid = pickPerson(f.hub, role, q => q.standing * .4 + gcraft(q, craft, g) * 2 + tie(D, q) * .3 + rnd() * 20, ex, false); if (nid === undefined || nid === id) return false;
  if (typeof slot === 'number') f.cast[slot] = nid; else if (slot === 'dp') f.dp = nid; else if (slot === 'ed') f.ed = nid; else f.crew[slot] = nid;
  P(nid).busy = Math.max(P(nid).busy, f.stageEnd + 4); f.recast = (f.recast || 0) + 1;
  (f.events = f.events || []).push({ w: S.week, t: `${p.name} ${why}; ${P(nid).name} takes over.`, q: 0, recast: [id, nid] });
  (S.npcRecasts = S.npcRecasts || []).push({ w: S.week, f: f.id, out: id, in: nid, why }); if (S.npcRecasts.length > 400) S.npcRecasts.shift();
  return true;
}
function npcLivesMonth() {
  for (const fid of S.active) { const f = S.films[fid]; if (!f || f.stage < 1 || f.stage > 2 || (S.me && (f.co === S.me.company && S.me.company !== undefined || f.dir === S.me.id))) continue;
    R = wstream('npclife', f.rk || 'id' + fid, S.week);
    for (const [id, role, slot] of NPC_SLOTS(f)) { const p = P(id); if (!p || p.player || p.dead || (typeof realLiving === 'function' && realLiving(p))) continue;
      if (rnd() < .0025) { p.busy = Math.max(p.busy, S.week + 6 + Math.floor(rnd() * 14)); (p.life = p.life || []).push({ w: S.week, t: 'Was taken ill and had to leave a film' }); npcRecast(f, id, role, slot, 'falls ill and has to leave the film'); break; }
      if ((has(p, 'Difficult') || has(p, 'Volatile')) && rnd() < .006) { addTie(P(f.dir), p, -25); (p.life = p.life || []).push({ w: S.week, t: `Was let go from ${f.title}` }); npcRecast(f, id, role, slot, 'is let go after a row with the director'); break; } }
  }
}
{ const _mo = monthly; monthly = function () { const r = _mo.apply(this, arguments); npcLivesMonth(); return r; }; }

// ---- awards with voters ----
// Best Film is chosen by a voting body, not by the quality number. Five blocs (craft, prestige, popular, the critics'
// wing and the industry) each like different things; the nominees are the five films the body as a whole rates
// highest, campaigns included (the big studios campaign their well-reviewed films too); then sixty voters rank the
// nominees and the votes are counted by instant runoff, so a film that is everyone's second choice can beat the best-
// reviewed one.
const VOTE_BLOCS = [['craft', .2], ['prestige', .22], ['popular', .18], ['critics', .2], ['industry', .2]];
function voteUtil(f, b) {
  const q = f.q || 50;
  return b === 'craft' ? q : b === 'prestige' ? q * .6 + (PRESTIGE_G.includes(f.genre) ? 25 : 0) + (f.tier <= 2 ? 5 : 0)
    : b === 'popular' ? 50 + 20 * Math.log2(1 + (f.hitRatio || 0)) + q * .3 : b === 'critics' ? (f.reviews || q)
    : q * .5 + (f.tier === 1 ? 20 : f.tier === 2 ? 10 : 0) + (f.npcCamp || 0) * 1.5;
}
function awardVote(m, L) {
  const prev = R; R = wstream('vote', m, S.year);
  try {
    for (const f of L) f.npcCamp = f.co !== null && S.companies[f.co] && S.companies[f.co].tier === 1 && (f.reviews || 0) >= 70 && !(S.me && f.co === S.me.company) ? 6 : 0;
    const camp = f => (f.camp || 0) + (f.npcCamp || 0), score = f => VOTE_BLOCS.reduce((t, [b, w]) => t + w * voteUtil(f, b), 0) + camp(f);
    const nom = L.slice().sort((a, b) => score(b) - score(a)).slice(0, 5), ballots = [];
    for (const [b, w] of VOTE_BLOCS) for (let i = 0; i < Math.round(w * 60); i++) ballots.push(nom.map(f => [f, voteUtil(f, b) + camp(f) * .5 + gauss() * 11])
      .sort((x, y) => y[1] - x[1]).map(x => x[0]));
    const alive = new Set(nom), rounds = [];
    while (alive.size > 1) {
      const cnt = new Map([...alive].map(f => [f, 0])); for (const bl of ballots) { const t = bl.find(f => alive.has(f)); cnt.set(t, cnt.get(t) + 1); }
      const order = [...cnt].sort((a, b) => b[1] - a[1]); rounds.push(order.map(([f, n]) => [f.id, n]));
      if (order[0][1] > ballots.length / 2) { alive.clear(); alive.add(order[0][0]); break; }
      alive.delete(order[order.length - 1][0]);
    }
    const win = [...alive][0]; (S.noms = S.noms || {})[m + ':' + S.year] = { nom: nom.map(f => f.id), win: win.id, rounds };
    for (const f of nom) (f.noms = f.noms || []).push(`${ceremony(m)}: Best Film ${S.year}`);
    return win;
  } finally { R = prev; }
}

// ---- talent that chooses ----
// The director and the lead are asked, not assigned. Each weighs the offer: a grudge against the director, a star
// asked to work for small-company money, a veteran typecast in one genre asked to step outside it. When they say
// no, the next name on the list is asked, and the film page records who passed and why.
function genreIdentity(p) { const C = (p.credits || []).slice(-12).map(i => S.films[i]).filter(Boolean); if (C.length < 6) return null; const n = {}; for (const f of C) n[f.genre] = (n[f.genre] || 0) + 1; const top = Object.entries(n).sort((a, b) => b[1] - a[1])[0]; return top[1] / C.length >= .6 ? top[0] : null; }
function declineWhy(p, f, isDir) {
  if (!p || p.player) return null; const D = P(f.dir);
  if (!isDir && D && tie(D, p) <= -20) return `won't work with ${D.name} again`;
  if ((p.fame || 0) > 60 && f.tier === 3 && rnd() < .7) return 'the money isn\'t there';
  const id = genreIdentity(p); if (id && id !== f.genre && rnd() < .3) return `doesn't want to step outside ${id.toLowerCase()}`;
  return null;
}
{ const _gl = greenlight; greenlight = function (hub, o = {}) {
  const f = _gl.apply(this, arguments); if (!f || (o && (o.dir !== undefined || o.lead !== undefined || o.co !== undefined))) return f;   // the player's and scripted films keep their people
  const prev = R; R = wstream('asks', f.rk || 'id' + f.id);
  try {
    const ex = new Set(keyIds(f)), g = f.genre;
    for (const [slot, role, isDir] of [['dir', 'director', true], [0, 'actor', false]]) {
      for (let k = 0; k < 2; k++) { const id = slot === 'dir' ? f.dir : f.cast[0], p = P(id), why = declineWhy(p, f, isDir); if (!why) break;
        const D = P(f.dir), nid = pickPerson(hub, role, q => isDir ? q.standing * .5 + gcraft(q, 'dir', g) * 2.5 + q.mind.vis + rnd() * 25 : q.fame * (f.tier === 1 ? .45 : .2) + q.standing * .3 + gcraft(q, 'act', g) * 2 + (D ? tie(D, q) * .3 : 0) + rnd() * 25, ex, isDir);
        if (nid === undefined || nid === id) break; ex.add(nid); p.busy = Math.min(p.busy, S.week);
        if (slot === 'dir') { P(nid).busy = Math.max(P(nid).busy, P(id).busy, f.stageEnd + 40); f.dir = nid; } else { P(nid).busy = Math.max(P(nid).busy, f.stageEnd + 30); f.cast[0] = nid; }
        (f.declined = f.declined || []).push({ id, why }); (f.events = f.events || []).push({ w: S.week, t: `${p.name} passed on it (${why}); ${P(nid).name} said yes.`, q: 0 }); }
    }
  } finally { R = prev; }
  return f; }; }
// ---- careers that move: a change of craft, a move to a bigger city ----
const BIG_HUBS = ['hollywood', 'london', 'mumbai', 'newyork', 'paris', 'tokyo', 'seoul', 'beijing'];
function careerMovesYear() {
  R = wstream('moves', S.year);
  for (const p of S.people) { if (p.dead || p.retired || p.player || (typeof realLiving === 'function' && realLiving(p))) continue; const a = S.year - p.born;
    if ((p.role === 'actor' || p.role === 'writer' || p.role === 'editor' || p.role === 'dp') && a >= 32 && p.credits.length >= 6 && p.c.dir >= 11 && rnd() < .02) { const from = p.role; const L = S.pool[p.hub][from]; const i = L.indexOf(p.id); if (i >= 0) L.splice(i, 1); p.role = 'director'; S.pool[p.hub].director.push(p.id); p.craftMove = { from, y: S.year }; if (p.fame > 40 || p.standing > 55) news('People', `${p.name} steps behind the camera: their first film as a director is in development.`, { person: p.id }); }
    else if (!BIG_HUBS.includes(p.hub) && p.standing >= 55 && a < 50 && rnd() < .012) { const to = BIG_HUBS.find(h => HUBS[h] && HUBS[h].lang === HUBS[p.hub].lang) || 'hollywood'; if (!HUBS[to] || !S.pool[to]) continue; const L = S.pool[p.hub][p.role]; const i = L.indexOf(p.id); if (i >= 0) L.splice(i, 1); S.pool[to][p.role].push(p.id); p.moved = { from: p.hub, y: S.year }; p.hub = to; }
  }
}
{ const _y = yearly; yearly = function () { const r = _y.apply(this, arguments); careerMovesYear(); return r; }; }

// ---- studios make sequels to their hits ----
// A hit in a genre that travels gets a sequel a year or two later, with its director and lead if they're free.
// The second film opens bigger (a built-in audience); by the fourth the audience is tiring: each further sequel opens
// weaker and is made a little worse.
const SEQ_G = ['Action', 'Superhero', 'Sci-fi', 'Fantasy', 'Animation', 'Horror', 'Comedy', 'Thriller', 'Crime', 'Martial arts'];
// Most sequels get a subtitle, the way studios name them; only some get a plain number, and never "2 2".
const SEQ_SUB = {
  '*': ['Homecoming', 'The Long Way Back', 'Second Wind', 'Afterlight', 'The Return', 'Reckoning', 'Aftershock', 'Legacy', 'New Blood', 'The Last Stand', 'Into the Fire', 'Fault Lines', 'The Next Chapter', 'Undertow', 'Crossroads', 'Higher Ground', 'Breakpoint', 'The Reunion', 'No Way Out', 'Full Circle'],
  Action: ['Hard Target', 'Zero Hour', 'Dead Drop', 'Blackout', 'Redline', 'Firestorm', 'Point of Impact', 'Ground War', 'Overdrive', 'Final Strike'],
  Superhero: ['Rise of the Fallen', 'Shattered Sky', 'The Iron Pact', 'Eclipse', 'Dark Orbit', 'Worlds Apart', 'The Lost Order', 'Ascension'],
  'Sci-fi': ['Event Horizon Line', 'Dark Sector', 'The Outer Ring', 'Signal Lost', 'Colony', 'Ghost Orbit', 'First Light', 'Deep Field'],
  Fantasy: ['The Ember Crown', 'Kingdom of Ash', 'The Hollow Throne', 'Rise of the Thorn', 'The Glass Tower', 'The Winter Gate', 'Oathbreaker'],
  Animation: ['The Big Adventure', 'Out of the Woods', 'Party Animals', 'Lost and Found', 'The Great Escape', 'Summer Camp', 'Road Trip'],
  Horror: ['The Awakening', 'Bloodline', 'The Second Night', 'Origins', 'The Harvest', 'Possession', 'Below', 'The Visitation', 'Bad Blood'],
  Comedy: ['Back in Business', 'Road Trip', 'The Wedding', 'Twice the Trouble', 'Spring Break', 'Again!', 'Family Holiday', 'Even More'],
  Thriller: ['The Second Witness', 'Dead Reckoning', 'Cold Trail', 'Double Cross', 'Exit Wound', 'The Inside Man', 'Fallback'],
  Crime: ['Blood Money', 'The Last Job', 'Made Men', 'Cold Case', 'The Fixer', 'Turf War', 'The Long Con'],
  'Martial arts': ['The Final Round', 'Way of the Dragon Gate', 'Iron Fist Temple', 'The Last Master', 'Path of the Blade', 'Return of the Dragon Gate']
};
function seqParse(t) { const m = /^(.*\S) (\d{1,2})$/.exec(t || ''); return m ? [m[1], +m[2]] : [t, 1]; }
function seqTitle(f) {
  const [b0, n0] = seqParse(f.seqBase || f.title), base = f.seqBase ? f.seqBase : b0, n = Math.max((f.seqN || 1), n0) + 1;
  const r = hashRand(f.id * 911 + n * 37), pool = (SEQ_SUB[f.genre] || []).concat(SEQ_SUB['*']), x = r();
  if (x < .3 || /[:!?]/.test(base)) return `${base} ${n}`;                // a title with a colon already gets a number                                     // a plain number (30%)
  if (x < .4 && n <= 4) return `${base} ${['', '', 'II', 'III', 'IV'][n]}`; // a roman numeral
  const sub = pool[Math.floor(r() * pool.length)];
  return x < .55 && n === 2 ? `${base} Returns` : x < .85 ? `${base}: ${sub}` : `${base} ${n}: ${sub}`;
}
{ const _rl = release; release = function (f) { const out = _rl.apply(this, arguments);
  const c = f && f.co !== null ? S.companies[f.co] : null;
  if (c && c.closed === null && c.owner === undefined && !(S.me && c.id === S.me.company) && SEQ_G.includes(f.genre) && f.hitRatio > 2.5 && (f.seqN || 1) < 5 && !f.seqQueued && hashRand((f.id * 131 + 7) >>> 0)() < [0, 0, .18, .11, .07, .04][Math.min(5, Math.max((f.seqN || 1), seqParse(f.title)[1]) + 1)] * (f.real ? .45 : 1)) {
    f.seqQueued = 1; (c.seqQ = c.seqQ || []).push({ parent: f.id, w: S.week + 52 + Math.floor(hashRand((f.id * 97) >>> 0)() * 52) }); }
  return out; }; }
function sequelMonth() {
  for (const c of S.companies) { if (c.closed !== null || !c.seqQ || !c.seqQ.length) continue;
    for (const q of c.seqQ.filter(x => x.w <= S.week)) { c.seqQ = c.seqQ.filter(x => x !== q); const f = S.films[q.parent]; if (!f) continue;
      const free = id => id !== undefined && P(id) && !P(id).dead && !P(id).retired && available(id);
      GL_KEY = 'seq:' + f.id; R = wstream('film', GL_KEY);
      let g; try { g = greenlight(c.hub, { co: c.id, genre: f.genre, title: seqTitle(f), budget: f.budget * 1.3 * econBudget(), dir: free(f.dir) ? f.dir : undefined, lead: free(f.cast[0]) ? f.cast[0] : undefined }); } finally { GL_KEY = null; }
      if (!g) continue; g.seq = f.id; g.seqN = Math.max(f.seqN || 1, seqParse(f.title)[1]) + 1; g.seqBase = f.seqBase || seqParse(f.title)[0];
      const tired = Math.max(0, g.seqN - 2); g.hook = clamp(g.hook + 12 - tired * 9, 5, 99); g.qBonus = (g.qBonus || 0) - tired * 2;
      news('Company', `${c.name} greenlights ${g.title}${tired ? '. Not everyone is sure the audience wants another' : ', the sequel everyone expected'}.`, { company: c.id, film: g.id }); }
  }
}
{ const _mo = monthly; monthly = function () { const r = _mo.apply(this, arguments); sequelMonth(); return r; }; }

// ---- the money leaves the building, and new companies arrive ----
// Companies don't hoard: each year a company sitting on more than twice what its size needs pays a quarter of the
// surplus out to its owners. So the richest studio is the one doing well now, not the one with the oldest library.
// And when a city has fewer companies than it started with, new ones open to fill the gap.
function coYear() {
  const y = S.year, base0 = S.coBase = S.coBase || Object.fromEntries(HUB_IDS.map(h => [h, S.companies.filter(c => c.hub === h && c.closed === null && c.owner === undefined).length]));
  for (const c of S.companies) { if (c.closed !== null || c.owner !== undefined) continue; const need = [0, 40, 12, 3][c.tier] * budgetScale(y) * era(MARKETS[HUBS[c.hub].m].cost, y); if (c.cash > need * 2) { const out = (c.cash - need * 2) * .25; c.cash -= out; c.paidOut = (c.paidOut || 0) + out; } }
  for (const h of HUB_IDS) { R = wstream('founding2', h, y); const open = S.companies.filter(c => c.hub === h && c.closed === null && c.owner === undefined).length, gap = Math.round(base0[h] || 0) - open;
    for (let i = 0; i < Math.min(3, gap); i++) if (rnd() < .8) { const c = makeCompany(h, rnd() < .15 ? 2 : 3); news('Company', `${c.name} opens its doors in ${HUBS[h].name}.`, { company: c.id }); } }
}
{ const _y = yearly; yearly = function () { const r = _y.apply(this, arguments); coYear(); return r; }; }

// ---- why it did what it did ----
// Every released film says why its box office came out as it did: the pull it had (hook, names, marketing), how good
// it was (quality decides how long it lasts), the calendar and the competition that weekend, the economy, and the
// weather. And when it was up for Best Film, how the vote went, round by round.
function boxWhyHTML(f) {
  if (!f || f.rel === null || f.total === undefined) return '';
  const C = f.cast.map(P), d = P(f.dir), pr = P(f.prod), W = f.why || {}, legs = .5 + (f.q || 50) / 100;
  const stars = Math.round((C[0] ? C[0].fame : 0) * .5 + (C[1] ? C[1].fame : 0) * .25 + (C[2] ? C[2].fame : 0) * .15 + (d ? d.fame : 0) * .1), mkt = Math.round(clamp([0, 70, 45, 20][f.tier] + (pr ? pr.sk.mkt : 0), 0, 100));
  const row = (l, v, note) => `<div class="rep"><span>${esc(l)}</span><b>${v}</b><span class="muted small">${esc(note)}</span></div>`;
  const pct = x => `${x >= 1 ? '+' : '−'}${Math.abs(Math.round((x - 1) * 100))}%`;
  const N = Object.entries(S.noms || {}).filter(([, v]) => v.nom.includes(f.id));
  return `<section class="panel"><h3>Why it did what it did</h3><p class="muted small">What decided this film's gross. The pull is weighted 40% hook, 35% names and 25% marketing; quality sets how long it lasts in cinemas.</p>
   ${row('Hook', Math.round(f.hook || 0), 'how much the premise grabs people')}${row('Names', stars, 'the fame of the cast and the director')}${row('Marketing', mkt, 'the studio\'s reach and the producer\'s marketing skill')}
   ${row('Legs', '×' + legs.toFixed(2), `quality ${Math.round(f.q || 0)}: word of mouth keeps it in cinemas`)}
   ${W.month !== undefined ? row('The calendar', pct(W.month), `audiences in ${MON[dateOf(f.rel).getUTCMonth()]}`) + row('The competition', pct((1 + .12 * W.usual) / (1 + .12 * W.rivals)), `${W.rivals} rival weight that weekend, against a usual ${W.usual}`) + row('The economy', pct(W.econ), W.state === 'normal' ? 'a normal year' : `a ${W.state}`) : ''}
   ${N.length ? `<h4>The vote</h4>${N.map(([k, v]) => { const [m, y] = k.split(':'); return `<p class="small">${esc(ceremony(m))} ${y}, Best Film: ${v.win === f.id ? '<b>won</b>' : 'nominated'}. ${v.rounds.map((r, i) => `Round ${i + 1}: ${r.map(([id, n]) => `${esc(S.films[id].title)} ${n}`).join(', ')}`).join('. ')}.</p>`; }).join('')}<p class="muted small">Sixty voters in five blocs (craft, prestige, popular, critics, industry) rank the five nominees; the last place is dropped and its votes move on until one film has a majority.</p>` : ''}
   ${(f.declined || []).length ? `<p class="small">Turned it down: ${f.declined.map(x => `${pl(x.id)} (${esc(x.why)})`).join('; ')}.</p>` : ''}</section>`;
}
{ const _vf = viewFilm; viewFilm = function (id) { const h = _vf(id), f = S.films[id]; const x = boxWhyHTML(f); if (!x || typeof h !== 'string') return h; const i = h.indexOf('<section class="panel"><h3>Story of the production</h3>'); return i >= 0 ? h.slice(0, i) + x + h.slice(i) : h + x; }; }
