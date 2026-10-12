// World-only probe: no player. Runs N years from 2027 and measures variety and reactivity of the world sim.
// usage: node tools/probe-world.js <seed> <years> <out.json>
const [seed = 2027, years = 15, out = 'world.json'] = process.argv.slice(2);
const h = require(require('path').join(__dirname, 'harness.js'));
const r = c => h.run(c);
const t0 = Date.now();
r(`newWorld(2027, ${+seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm();`);
const build = Date.now() - t0;
r(`globalThis.__w0 = S.week; globalThis.__snap = { stand: S.people.map(p => p.standing), cash: S.companies.map(c => c.cash), n: S.people.length, nf: S.films.length, nc: S.companies.length, app: JSON.parse(JSON.stringify(S.app)) }; globalThis.__appHist = []; globalThis.__tickMs = [];`);
const t1 = Date.now();
r(`for (let i = 0; i < ${+years} * 52; i++) { const a = Date.now(); tick(); if (i % 52 === 0) { __tickMs.push(Date.now() - a); __appHist.push({ y: S.year, US: Object.assign({}, S.app.US) }); } }`);
const run = Date.now() - t1;
const res = JSON.parse(r(`(() => {
  const w0 = __w0, F = S.films.filter(f => f.rel !== null && f.rel > w0 && f.rel <= S.week);
  const byY = {}, mon = Array(12).fill(0);
  for (const f of F) { const y = f.ry; (byY[y] = byY[y] || []).push(f); mon[dateOf(f.rel).getUTCMonth()]++; }
  const genreShare = {}, topGross = {};
  for (const y in byY) {
    const L = byY[y].filter(f => f.m === 'US'); const g = {}, gg = {};
    for (const f of L) { g[f.genre] = (g[f.genre] || 0) + 1; gg[f.genre] = (gg[f.genre] || 0) + f.total; }
    genreShare[y] = Object.fromEntries(Object.entries(g).map(([k, v]) => [k, +(v / L.length).toFixed(3)]));
    topGross[y] = Object.entries(gg).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
  }
  const US = F.filter(f => f.m === 'US');
  const tot = US.map(f => f.total).sort((a, b) => b - a), sum = tot.reduce((s, v) => s + v, 0);
  const share = p => +(tot.slice(0, Math.ceil(tot.length * p)).reduce((s, v) => s + v, 0) / sum).toFixed(3);
  const corr = (a, b) => { const n = a.length, ma = a.reduce((s, v) => s + v, 0) / n, mb = b.reduce((s, v) => s + v, 0) / n; let x = 0, y = 0, z = 0; for (let i = 0; i < n; i++) { x += (a[i] - ma) * (b[i] - mb); y += (a[i] - ma) ** 2; z += (b[i] - mb) ** 2; } return +(x / Math.sqrt(y * z)).toFixed(3); };
  const lg = v => Math.log(Math.max(1e-4, v));
  const stats = {
    n: US.length, top10: share(.1), top20: share(.2), lossShare: +(US.filter(f => f.theatrical < 0).length / US.length).toFixed(3),
    corr_q_gross: corr(US.map(f => f.q), US.map(f => lg(f.total))), corr_budget_gross: corr(US.map(f => lg(f.budget)), US.map(f => lg(f.total))),
    corr_reviews_gross: corr(US.map(f => f.reviews), US.map(f => lg(f.total))), corr_hook_gross: corr(US.map(f => f.hook), US.map(f => lg(f.total))),
    roiMedian: US.map(f => f.total / f.cost).sort((a, b) => a - b)[Math.floor(US.length / 2)],
    roiByTier: [1, 2, 3].map(t => { const L = US.filter(f => f.tier === t).map(f => f.rentals / (f.cost + f.pa)).sort((a, b) => a - b); return L.length ? [L.length, +L[Math.floor(L.length * .25)].toFixed(2), +L[Math.floor(L.length / 2)].toFixed(2), +L[Math.floor(L.length * .75)].toFixed(2), +L[Math.floor(L.length * .95)].toFixed(2)] : null; }),
    qMean: +(US.reduce((s, f) => s + f.q, 0) / US.length).toFixed(1), qSd: +Math.sqrt(US.reduce((s, f) => s + (f.q - US.reduce((s, f) => s + f.q, 0) / US.length) ** 2, 0) / US.length).toFixed(1),
    eventsPerFilm: +(US.reduce((s, f) => s + f.events.length, 0) / US.length).toFixed(2)
  };
  // people
  const dirCount = {}, actCount = {}, leadCount = {};
  for (const f of US) { dirCount[f.dir] = (dirCount[f.dir] || 0) + 1; f.cast.forEach((c, i) => { actCount[c] = (actCount[c] || 0) + 1; if (!i) leadCount[c] = (leadCount[c] || 0) + 1; }); }
  const top = o => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([id, n]) => P(+id).name + ':' + n + (P(+id).catId ? '*' : ''));
  const hw = S.people.filter(p => p.hub === 'hollywood' && !p.dead && !p.retired);
  const topStand = hw.slice().sort((a, b) => b.standing - a.standing).slice(0, 30);
  const topFame = hw.slice().sort((a, b) => b.fame - a.fame).slice(0, 30);
  const people = {
    alive: S.people.filter(p => !p.dead && !p.retired).length, total: S.people.length, newSince: S.people.length - __snap.n,
    topDirs: top(dirCount), topLeads: top(leadCount), distinctDirs: Object.keys(dirCount).length, distinctLeads: Object.keys(leadCount).length,
    top30stand_catalog: topStand.filter(p => p.catId).length, top30stand_newSince: topStand.filter(p => p.id >= __snap.n).length, top30standNames: topStand.slice(0, 12).map(p => p.name + (p.catId ? '*' : '') + ' ' + Math.round(p.standing) + ' ' + p.role + ' ' + (S.year - p.born)),
    top30fame_catalog: topFame.filter(p => p.catId).length, top30fame_newSince: topFame.filter(p => p.id >= __snap.n).length,
    standMean: +(hw.reduce((s, p) => s + p.standing, 0) / hw.length).toFixed(1),
    neverWorked: +(hw.filter(p => p.credits.length === 0).length / hw.length).toFixed(3),
    roleChanges: 0, hubMoves: 0
  };
  // companies
  const cos = S.companies;
  const companies = {
    total: cos.length, newSince: cos.length - __snap.nc, closedSince: cos.filter(c => c.closed !== null && c.closed >= 2027).length, merged: cos.filter(c => c.mergedInto !== undefined && c.closed >= 2027).length,
    usTop: cos.filter(c => c.closed === null && HUBS[c.hub].m === 'US').sort((a, b) => b.cash - a.cash).slice(0, 8).map(c => c.name + ' t' + c.tier + ' ' + Math.round(c.cash)),
    usTier1: cos.filter(c => c.closed === null && HUBS[c.hub].m === 'US' && c.tier === 1).map(c => c.name + ' cash ' + Math.round(c.cash) + ' films ' + c.films.filter(i => S.films[i].rel > w0).length + ' strat ' + companyStrategy(c)),
    tasteTop: cos.filter(c => c.closed === null && HUBS[c.hub].m === 'US' && c.tier <= 2).slice(0, 10).map(c => c.name + ': ' + Object.entries(c.taste).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([g, v]) => g + ' ' + v.toFixed(2)).join(', '))
  };
  const newsKinds = {}; for (const n of S.news) if (n.w > w0) newsKinds[n.k || n.kind || n.type] = (newsKinds[n.k || n.kind || n.type] || 0) + 1;
  return JSON.stringify({ year: S.year, films: F.length, perYear: Object.fromEntries(Object.entries(byY).map(([y, L]) => [y, L.length])), mon, genreShare, topGross, stats, people, companies, newsKinds, appHist: __appHist, tickMs: __tickMs, newsSample: S.news.slice(-12).map(n => JSON.stringify(n).slice(0, 160)), heap: 0, active: S.active.length, filmsTotal: S.films.length });
})()`));
res.seed = +seed; res.buildMs = build; res.runMs = run; res.heapMB = Math.round(process.memoryUsage().heapUsed / 1e6);
require('fs').writeFileSync(out, JSON.stringify(res, null, 1));
console.log('seed', seed, 'done', build, run, 'ms; films', res.films, 'heap', res.heapMB);
