// World experiment probe: runs a world with no player and reports who is at the top, who gets cast, and which companies survive.
// Run it against the real game, or against a patched copy built by sandbox-variant.js, and compare.
// usage: [APPLEBOX_HTML=<patched html>] node tools/probe-world-exp.js <seed> <years> <out.json>
const [seed = 2027, years = 15, out = 'x.json'] = process.argv.slice(2);
const h = require(require('path').join(__dirname, 'harness.js')); const r = c => h.run(c);
r(`newWorld(2027, ${+seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm();`);
r(`globalThis.__w0 = S.week; globalThis.__n0 = S.people.length; globalThis.__c0 = S.companies.map(c => c.closed === null); globalThis.__top0 = S.people.filter(p => !p.dead && !p.retired).sort((a, b) => b.fame - a.fame).slice(0, 30).map(p => p.id);`);
r(`for (let i = 0; i < ${+years} * 52; i++) tick();`);
const res = JSON.parse(r(`(() => {
  const w0 = __w0, F = S.films.filter(f => f.rel !== null && f.rel > w0), US = F.filter(f => f.m === 'US');
  const live = S.people.filter(p => !p.dead && !p.retired);
  const topF = live.slice().sort((a, b) => b.fame - a.fame).slice(0, 30), topS = live.slice().sort((a, b) => b.standing - a.standing).slice(0, 30);
  const age = p => S.year - p.born, avg = a => +(a.reduce((s, v) => s + v, 0) / Math.max(1, a.length)).toFixed(1);
  const lead = {}, dir = {}; for (const f of US) { lead[f.cast[0]] = (lead[f.cast[0]] || 0) + 1; dir[f.dir] = (dir[f.dir] || 0) + 1; }
  const dirN = Object.values(dir), leadIds = Object.keys(lead).map(Number);
  const last5 = US.filter(f => f.ry >= S.year - 5), leadAges = last5.map(f => f.ry - P(f.cast[0]).born);
  const tot = US.map(f => f.total).sort((a, b) => b - a), sum = tot.reduce((s, v) => s + v, 0);
  const cos = S.companies;
  return JSON.stringify({ films: F.length, usFilms: US.length,
    top30fame_new: topF.filter(p => p.id >= __n0).length, top30fame_stillFromStartTop30: topF.filter(p => __top0.includes(p.id)).length, top30fame_avgAge: avg(topF.map(age)), top30fame_catalog: topF.filter(p => p.catId).length,
    top30stand_new: topS.filter(p => p.id >= __n0).length, top30stand_avgAge: avg(topS.map(age)),
    top10fame: topF.slice(0, 10).map(p => p.name + (p.catId ? '*' : p.id >= __n0 ? '+' : '') + ' ' + age(p) + ' ' + p.role.slice(0, 3) + ' f' + Math.round(p.fame)),
    leadAgeAvg_last5: avg(leadAges), leadsOver60share_last5: +(leadAges.filter(a => a > 60).length / Math.max(1, leadAges.length)).toFixed(2), leadsNew_last5: +(last5.filter(f => f.cast[0] >= __n0).length / Math.max(1, last5.length)).toFixed(2),
    dirs: dirN.length, dirsOneFilm: +(dirN.filter(n => n === 1).length / dirN.length).toFixed(2), filmsPerDir: +(US.length / dirN.length).toFixed(1), dirsNew: +(Object.keys(dir).filter(id => +id >= __n0).length / dirN.length).toFixed(2),
    top20share: +(tot.slice(0, Math.ceil(tot.length * .2)).reduce((s, v) => s + v, 0) / sum).toFixed(3), lossShare: +(US.filter(f => f.theatrical < 0).length / US.length).toFixed(3), qMean: avg(US.map(f => f.q)),
    closedOfStart: [1, 2, 3].map(t => [cos.filter((c, i) => __c0[i] && c.tier === t).length, cos.filter((c, i) => __c0[i] && c.tier === t && c.closed !== null).length]),
    aliveEnd: cos.filter(c => c.closed === null).length, newCos: cos.length - __c0.length,
    usTop5: cos.filter(c => c.closed === null && HUBS[c.hub].m === 'US').sort((a, b) => b.cash - a.cash).slice(0, 5).map(c => c.name + ' ' + Math.round(c.cash)),
    usT1strats: cos.filter(c => c.closed === null && HUBS[c.hub].m === 'US' && c.tier === 1).map(c => companyStrategy(c)).reduce((a, s) => (a[s] = (a[s] || 0) + 1, a), {}),
    filmsPerYear: Math.round(F.length / ${+years}) }); })()`));
res.seed = +seed; res.variant = (process.env.APPLEBOX_HTML || 'baseline').replace(/.*index_|\.html/g, '');
require('fs').writeFileSync(out, JSON.stringify(res, null, 1)); console.log('done', res.variant, seed);
