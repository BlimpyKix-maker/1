// Cash tracer: same bots as probe-paths.js, but also records every week in which the player's cash moved by more than $8,000
// (or the player's company by more than $0.4M), with that week's inbox titles and milestones, so you can see where money comes from.
// usage: node tools/probe-cash.js <mode> <seed> <years> <out.json>   (modes as in probe-paths.js)
// Path bots: test the parts of the game the career bots never touched.
// usage: node tools/probe-paths.js <mode> <seed> <years> <out.json>
//   mode = creator:song | creator:video | creator:blip | creator:podcast | creator:play | producer | trader:hold | trader:churn
// The producer and trader bots are given starting money directly (a test grant, not a game action), so their saves would not replay.
const [mode = 'creator:song', seed = 2027, years = 5, out = 'paths.json'] = process.argv.slice(2);
const h = require(require('path').join(__dirname, 'harness.js')); const r = c => h.run(c);
const [kind, sub] = mode.split(':');
const FIELD = { song: 'music', video: 'creator', blip: 'creator', podcast: 'podcast', play: 'stage' }[sub] || 'film';
const ROLE = kind === 'producer' ? 'producer' : kind === 'trader' ? 'producer' : FIELD === 'music' ? 'composer' : FIELD === 'stage' ? 'writer' : 'director';
r(`newWorld(2027, ${+seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); S.log = []; S.me = null;`);
r(`doAct({ t: 'create', c: Object.assign(ccDefaults(), { name: 'Path Bot', role: '${ROLE}', field: '${FIELD}', hub: 'hollywood', wealth: 'gettingby', salt: ${+seed % 97}, traits: ['Curious', 'Hustler'] }) })`);
for (let i = 0; i < 40 && !r('S.me.party.done'); i++) r(`(() => { const sc = partyScene(S.me.party); const L = sc.rooms || sc.opts; return doAct({ t: 'party', k: L[0].k }); })()`);
r(`doAct({ t: 'focus', day: '${kind === 'creator' ? 'make' : 'balanced'}', eve: 'quiet', auto: true });
globalThis.__decide = function () { for (let g = 0; g < 30; g++) { const P0 = pending(); if (!P0.length) break; for (const it of P0) { const L = (it.choices || []).filter(c => !c.dis); let k = (L[0] || it.choices[0]).k; if (it.kind === 'offer') { const y = L.find(c => c.k === 'yes'), n = L.find(c => c.k === 'no'); if (y && n) k = (jobDays() + ((it.post || {}).days || 0) <= ${kind === 'creator' ? 3 : 5}) ? 'yes' : 'no'; } doAct({ t: 'pick', id: it.id, k }); } } };
globalThis.__T = { q: [], films: [], nw: [], notes: [], jumps: [], cojumps: [] };`);
const GRANT = +(process.env.GRANT || (kind === 'producer' ? 600000 : 100000));
if (kind !== 'creator') r(`S.me.cash += ${GRANT}; ME().standing = Math.max(ME().standing, 18);`);
const weeks = +years * 52;
for (let w = 0; w < weeks && !r('S.me.over'); w++) {
  r(`__decide(); UI.apps = new Set(); if (lookingForWork() && jobDays() < ${kind === 'creator' ? 3 : 5}) for (const [p] of rankedFits(appSlots())) UI.apps.add(p.id); if (S.me.focus && S.me.focus.auto) S.me.cal = autoCal();`);
  if (kind === 'creator') r(`(() => { const M = S.me; if (M.make && M.make.ready) { if (!doAct({ t: 'releasework', promo: M.cash > usd(2000) ? 1 : 0 })) __T.notes.push([S.week, 'could not afford release']); } if (!M.make) doAct({ t: 'startwork', type: '${sub}' }); })()`);
  if (kind === 'producer') r(`(() => { const M = S.me, me = ME();
    if (M.company === undefined && canFound()) { doAct({ t: 'found', name: 'Path Pictures' }); doAct({ t: 'invest', amount: Math.floor(M.cash * .8) }); }
    const open = (M.holdings || []).filter(x => x.made === undefined && !x.lapsed);
    if (open.length < 2 && (M.market || []).length) { const best = M.market.slice().sort((a, b) => coverage(b) - coverage(a))[0]; if (coverage(best) >= 55) doAct({ t: 'optionspec', id: best.id }); }
    const c = myCo(); if (!c || c.closed !== null) return;
    const inflight = c.films.map(i => S.films[i]).filter(f => f.rel === null && f.stage >= 0).length;
    const hsrc = (M.holdings || []).find(x => x.made === undefined && !x.lapsed);
    if (hsrc && inflight < 2) { const L = castOptions(hsrc.genre), D = dirOptions(hsrc.genre); const micro = c.cash < estBudget(hsrc.genre) * .6;
      const ok = doAct({ t: 'selffund', src: 'holding', id: hsrc.id, direct: false, micro, lead: L.length ? L[Math.min(2, L.length - 1)].id : undefined, dir: D.length ? D[0].id : undefined, dp: (crewOptions('dp', 'cam', hsrc.genre)[0] || {}).id, ed: (crewOptions('editor', 'edt', hsrc.genre)[0] || {}).id, inv: true });
      __T.notes.push([S.week, 'selffund ' + hsrc.title + (micro ? ' (micro)' : '') + ' -> ' + ok + ' co cash ' + c.cash.toFixed(2)]); }
    for (const f of myFilms()) if (festEligible(f)) for (const F of FESTIVALS) doAct({ t: 'festival', film: f.id, k: F.k });
  })()`);
  if (kind === 'trader') r(`(() => { const M = S.me; const live = S.companies.filter(c => c.closed === null && c.owner === undefined && c.tier === 1 && mktPrice(c) > 0);
    if (S.week === S.me.startW + 2 || ('${sub}' === 'churn' && S.week % 4 === 0)) {
      if ('${sub}' === 'churn') for (const id in (M.port || {})) if (M.port[id] > 0) doAct({ t: 'trade', co: +id, n: -M.port[id] });
      const picks = '${sub}' === 'churn' ? live.slice().sort((a, b) => hashRand(a.id * 31 + S.week)() - hashRand(b.id * 31 + S.week)()).slice(0, 5) : live.slice().sort((a, b) => b.cash - a.cash).slice(0, 8);
      const per = Math.floor(Math.max(0, M.cash - 5000) / Math.max(1, picks.length)); for (const c of picks) { const n = Math.floor(per / mktPrice(c)); if (n > 0) { doAct({ t: 'trade', co: c.id, n }); __T.notes.push([S.week, 'buy ' + c.name + ' x' + n + ' @' + mktPrice(c).toFixed(2)]); } } } })()`);
  r(`(() => { const w0 = S.week; for (let g = 0; g < 80 && S.week === w0 && !S.me.over; g++) { __decide(); doAct(endWeekAct('next')); } })()`);
  r(`(() => { const M = S.me; const d = M.cash - (__T.c0 === undefined ? M.cash : __T.c0); if (Math.abs(d) > 8000) __T.jumps.push([S.week - M.startW, Math.round(d), M.inbox.filter(x => x.id > (__T.i0 || 0)).map(x => x.kind + ':' + (x.title || x.scene || '')).slice(0, 8), (M.milestones || []).slice(__T.m0 || 0).map(m => m.t), M.jobs.map(j => j.t + ' $' + Math.round(j.pay || j.wk || 0))]); const cc = myCo() ? myCo().cash : 0; const dco = cc - (__T.cc0 || 0); if (Math.abs(dco) > .4) __T.cojumps.push([S.week - M.startW, +dco.toFixed(2), M.inbox.filter(x => x.id > (__T.i0 || 0)).map(x => x.kind + ':' + (x.title || x.scene || '')).slice(0, 6), (M.milestones || []).slice(__T.m0 || 0).map(m => m.t).slice(0, 5)]); __T.cc0 = cc; __T.c0 = M.cash; __T.i0 = M.seq - 1; __T.m0 = (M.milestones || []).length; })()`);
  if (w % 13 === 12) r(`__T.q.push({ w: S.week - S.me.startW, cash: Math.round(S.me.cash), nw: Math.round(S.me.cash + Object.entries(S.me.port || {}).reduce((t, [id, n]) => t + (n > 0 && S.companies[+id].closed === null ? mktPrice(S.companies[+id]) * n : 0), 0) + (myCo() && myCo().closed === null ? myCo().cash * 1e6 : 0)), lvl: careerLevel(), stand: +ME().standing.toFixed(1), fame: +(ME().fame || 0).toFixed(1), credits: ME().credits.length, fol: Object.assign({}, S.me.fol || {}), co: myCo() ? +myCo().cash.toFixed(3) : null, coClosed: myCo() ? myCo().closed : null, held: Object.entries(S.me.port || {}).filter(([id, n]) => n > 0).map(([id, n]) => S.companies[+id].name + (S.companies[+id].closed !== null ? ' (closed)' : '')).length, heldClosed: Object.entries(S.me.port || {}).filter(([id, n]) => n > 0 && S.companies[+id].closed !== null).length })`);
}
const res = JSON.parse(r(`(() => { const M = S.me, c = myCo();
  const works = (M.works || []).map(w => ({ type: w.type, q: w.q, units: Math.round(w.units || 0), earned: Math.round(w.earned || 0), v0: w.v0, rel: w.rel - M.startW }));
  const films = c ? c.films.map(i => S.films[i]).map(f => ({ title: f.title, genre: f.genre, budget: +f.budget.toFixed(3), cost: +f.cost.toFixed(3), stage: f.stage, status: f.status, q: f.q === null ? null : Math.round(f.q), reviews: f.reviews, total: f.total ? +f.total.toFixed(3) : 0, rentals: f.rentals ? +f.rentals.toFixed(3) : 0, pa: f.pa ? +f.pa.toFixed(3) : 0, theatrical: f.theatrical !== undefined && f.theatrical !== null ? +(+f.theatrical).toFixed(3) : null, inv: f.investors ? { share: +f.investors.share.toFixed(2), amount: +f.investors.amount.toFixed(3), paid: f.investors.paid } : null, awards: (f.awards || []).length, fin: f.fin ? f.fin.over || null : null })) : [];
  return JSON.stringify({ cojumps: __T.cojumps, sv: Object.entries(M.port || {}).reduce((t, [id, n]) => t + (n > 0 && S.companies[+id].closed === null ? mktPrice(S.companies[+id]) * n : 0), 0), portNow: Object.entries(M.port || {}).filter(([id, n]) => n > 0).map(([id, n]) => [S.companies[+id].name, n, +mktPrice(S.companies[+id]).toFixed(2), S.companies[+id].closed]), coFilms: myCo() ? myCo().films.map(i => S.films[i]).map(f => f.title + ' | st ' + f.stage + ' | total ' + (f.total || 0).toFixed(1) + ' | cost ' + f.cost.toFixed(1)) : [], allMs: (M.milestones || []).map(m => m.t), jumps: __T.jumps, past: M.past.map(p => p.t + ' ' + (p.co || '') + ' $' + Math.round(p.earned || p.pay || 0)).slice(0, 60), over: !!M.over, works, films, q: __T.q, notes: __T.notes.slice(0, 60), milestones: (M.milestones || []).map(m => m.t).slice(-25), deal: M.deal || null, jobs: M.past.length, port: Object.entries(M.port || {}).filter(([id, n]) => n > 0).map(([id, n]) => [S.companies[+id].name, n, S.companies[+id].closed]) }); })()`));
res.cfg = { mode, seed: +seed, years: +years, grant: kind === 'creator' ? 0 : GRANT };
require('fs').writeFileSync(out, JSON.stringify(res));
const last = res.q[res.q.length - 1] || {};
console.log(`${mode} seed ${seed}: works ${res.works.length} films ${res.films.length} cash ${last.cash} netWorth ${last.nw} level ${last.lvl}${res.over ? ' (career ended)' : ''}`);
