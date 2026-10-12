// World decision-makers probe (work orders 2 and 4-9): runs a world with no player and reports the pass marks.
// usage: [APPLEBOX_HTML=<page>] node tools/probe-world2.js <seed> <years> <out.json>
const [seed = 2027, years = 15, out = 'w2.json'] = process.argv.slice(2);
const h = require(require('path').join(__dirname, 'harness.js')); const r = c => h.run(c);
r(`newWorld(2027, ${+seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm();`);
r(`globalThis.__w0 = S.week; globalThis.__y0 = S.year; globalThis.__n0 = S.people.length; globalThis.__c0 = S.companies.map(c => c.closed === null); globalThis.__top0 = S.people.filter(p => !p.dead && !p.retired).sort((a, b) => b.fame - a.fame).slice(0, 30).map(p => p.id);
  globalThis.__gl = []; globalThis.__share = {}; globalThis.__strikeShoots = []; { const _g = greenlight; greenlight = function (hub, o) { const f = _g.apply(this, arguments); if (f && !o) __gl.push([S.week, hub, f.budget, (S.econ || {}).state || 'normal']); return f; }; }`);
for (let y = 0; y < +years; y++) {
  r(`for (let i = 0; i < 52; i++) { tick(); for (const e of (S.econ && S.econ.ev) || []) if (e.k === 'walkout' && e.from <= S.week && e.to > S.week) __strikeShoots.push(S.films.filter(f => f.rel === null && f.hub === e.hub && f.stage >= 1 && f.stage <= 2 && f.stageEnd === S.week + 1).length); }
    { const F = S.films.filter(f => f.rel !== null && f.ry === S.year - 1 && f.m === 'US'), tot = F.reduce((s, f) => s + f.total, 0), g = {}; for (const f of F) g[f.genre] = (g[f.genre] || 0) + f.total; __share[S.year - 1] = Object.fromEntries(Object.entries(g).map(([k, v]) => [k, +(v / tot * 100).toFixed(1)])); }`);
}
const res = JSON.parse(r(`(() => {
  const w0 = __w0, F = S.films.filter(f => f.rel !== null && f.rel > w0), US = F.filter(f => f.m === 'US');
  // release calendar: US gross by month
  const mon = Array(12).fill(0); for (const f of US) mon[dateOf(f.rel).getUTCMonth()] += f.gross.US || 0; const mx = Math.max(...mon), mn = Math.min(...mon);
  // genre share moves within a decade (US)
  const ys = Object.keys(__share).map(Number).sort(), moves = {}; for (const g of GENRES) { let best = 0; for (const a of ys) for (const b of ys) if (b > a && b - a <= 10) best = Math.max(best, Math.abs((__share[b][g] || 0) - (__share[a][g] || 0))); moves[g] = +best.toFixed(1); }
  // economy: greenlights and budgets in recession vs normal
  const by = st => __gl.filter(x => x[3] === st), avgB = L => L.length ? L.reduce((s, x) => s + x[2], 0) / L.length : 0, wk = st => { const s = new Set(__gl.filter(x => x[3] === st).map(x => x[0])); return s.size; };
  const econ = Object.fromEntries(['recession', 'normal', 'boom'].map(st => [st, { weeks: wk(st), perWeek: wk(st) ? +(by(st).length / wk(st)).toFixed(1) : 0, avgBudget: +avgB(by(st)).toFixed(1) }]));
  // awards: does the highest-quality film win Best Film?
  let yrs = 0, bestWins = 0; for (const k in (S.noms || {})) { const [m, y] = k.split(':'); if (+y <= __y0) continue; const L = S.films.filter(f => f.rel !== null && f.ry === +y - 1 && f.m === m); if (L.length < 2) continue; const top = L.reduce((a, b) => b.q > a.q ? b : a); yrs++; if (S.noms[k].win === top.id) bestWins++; }
  // companies
  const cos = S.companies, live = cos.filter(c => c.closed === null && c.owner === undefined), t1 = live.filter(c => c.tier === 1);
  const top3 = c => Object.entries(c.taste).filter(x => x[1] > 1.05).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]).sort().join(',') || 'none';
  const byM = {}; for (const c of t1) (byM[HUBS[c.hub].m] = byM[HUBS[c.hub].m] || []).push(top3(c)); let dupT = 0; for (const m in byM) dupT += byM[m].filter(x => x !== 'none').length - new Set(byM[m].filter(x => x !== 'none')).size;
  const strat = {}; for (const c of live) { const s = companyStrategy(c); strat[s] = (strat[s] || 0) + 1; }
  const usTop = live.filter(c => HUBS[c.hub].m === 'US').sort((a, b) => b.cash - a.cash).slice(0, 3).map(c => c.name);
  const startT = t => cos.filter((c, i) => __c0[i] && c.tier === t), shut = t => startT(t).filter(c => c.closed !== null && c.mergedInto === undefined).length, merged = t => startT(t).filter(c => c.mergedInto !== undefined).length, rescued = t => startT(t).filter(c => c.rescued).length;
  const live0 = __c0.filter(Boolean).length;
  // people
  const alive = S.people.filter(p => !p.dead && !p.retired), topF = alive.slice().sort((a, b) => b.fame - a.fame).slice(0, 30);
  const dir = {}; for (const f of US) dir[f.dir] = (dir[f.dir] || 0) + 1; const dirN = Object.values(dir);
  const last5 = US.filter(f => f.ry >= S.year - 5);
  return JSON.stringify({ seed: ${+seed}, years: ${+years}, films: F.length,
    monthGross: { busiestOverQuietest: +(mx / Math.max(1e-9, mn)).toFixed(2) },
    genreMoves8: Object.values(moves).filter(v => v >= 8).length, genreMoves: moves,
    econ, strikes: ((S.econ || {}).ev || []).filter(e => e.k === 'walkout').length, strikeHeldShoots: __strikeShoots.reduce((s, v) => s + v, 0),
    recasts: (S.npcRecasts || []).length, recastsPerMonth: +((S.npcRecasts || []).length / Math.max(1, Math.min(400, ${+years} * 12))).toFixed(2),
    awards: { years: yrs, bestQualityWins: bestWins, share: yrs ? +(bestWins / yrs).toFixed(2) : null },
    companies: { tier1DupTop3: dupT, strategies: strat, usTop3: usTop, tierClosedOutright: [1, 2, 3].map(t => [startT(t).length, shut(t), merged(t), rescued(t)]), activeStart: live0, activeEnd: live.length },
    people: { top30new: topF.filter(p => p.id >= __n0).length, top30fromStartTop30: topF.filter(p => __top0.includes(p.id)).length, dirsOneFilm: +(dirN.filter(n => n === 1).length / Math.max(1, dirN.length)).toFixed(2), leadsNewLast5: +(last5.filter(f => f.cast[0] >= __n0).length / Math.max(1, last5.length)).toFixed(2) } });
})()`));
require('fs').writeFileSync(out, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res));
