// Producer lab: does a company-level system change how a producer's company does? A bot founds a company and keeps
// making films (a new script whenever nothing is in the pipeline); each variant switches on one system. Same seed,
// same salt, same money, so differences are the system's.
// Usage: node tools/prodlab.js <base|screen|presale|plan|pkg|star|loc|np|slate|all> (star = the package's people without the package) <seedIndex> [years]
const [FEAT = 'base', SI = '0', YEARS = 3.5] = process.argv.slice(2);
const seed = 5100 + (+SI) * 41, on = f => FEAT === f || FEAT === 'all';
const h = require('./harness.js'), r = s => h.run(s);
r(`newWorld(2027, ${seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); S.log = []; S.me = null;`);
r(`doAct({ t: 'create', c: Object.assign(ccDefaults(), { name: 'Lab', role: 'producer', wealth: 'trust', edu: 'business', hub: 'hollywood', salt: ${seed} }) }); partyAuto();
  S.me.cash += usd(4e6); ME().standing = 55; ME().fame = 30; doAct({ t: 'found', name: 'Lab Pictures' }); myCo().cash += 40; S.me.labN = 0;`);
const C0 = +r(`S.me.cash + myCo().cash * 1e6`);
// keep a film in the pipeline
const MAKE = `(() => { const c = myCo(); if (!c || c.films.filter(i => { const f = S.films[i]; return f && f.rel === null && f.stage >= 0; }).length >= 2) return;
  const G = ['Thriller', 'Drama', 'Comedy', 'Horror', 'Action', 'Romance'], g = G[(S.me.labN++) % G.length];
  doAct({ t: 'newscript', genre: g, theme: 'family', tone: 'dark', premise: 'p', hero: 'h', setting: 's', notes: 'n '.repeat(200) }); const sc = S.me.scripts[S.me.scripts.length - 1]; if (!sc) return; sc.grade = 'B'; sc.score = 60 + Math.floor(gH(sc.id, 'lab') * 20);
  const L = castOptions(g), D = dirOptions(g); const a = { t: 'selffund', src: 'script', id: sc.id, lead: L[0] && L[0].id, dir: D[0] && D[0].id, inv: true, rb: true, micro: false };
  if (${on('pkg')} || ${FEAT === 'star'}) { const o = pkgOffers(g)[0]; if (o) { if (${on('pkg')}) a.pkg = o.ag; a.dir = o.dir; a.lead = o.lead; } }   // star: the same people, no package deal
  if (${on('loc')}) { const best = HUB_IDS.filter(hb => hb !== S.me.hub && incentiveOf(hb) > 0 && capOpen(hb)).sort((x, y) => incentiveOf(y) - incentiveOf(x) + crewSave(y) - crewSave(x))[0]; if (best && incentiveOf(best) > incentiveOf(S.me.hub)) a.loc = best; }
  if (${on('np')}) a.np = true;
  doAct(a); })()`;
const STEER = `(() => { const c = myCo(); if (!c) return; for (const i of c.films) { const f = S.films[i]; if (!f || f.rel !== null || f.stage < 0) continue;
  if (${on('screen')} && f.stage === 3 && (!f.scr || (f.scr.n < 2 && !f.scr.locked))) { doAct({ t: 'screen', film: f.id, k: 'run' }); const L = f.scr && f.scr.last; if (L) doAct({ t: 'screen', film: f.id, k: L.t2b < 70 ? 'recut' : 'trailer' }); }
  if (${on('plan')} && f.stage >= 2 && !f.labPlan) { f.labPlan = 1; const mix = Object.keys(PA_MIX).find(k => PA_MIX[k][1].includes(f.genre)); if (mix) doAct({ t: 'dist', film: f.id, k: 'mix', v: mix });
    const pa = Object.keys(PA_SIZE).map(k => [k, dForecast(f, k, dPlan(f).mix, dPlan(f).win).net]).sort((x, y) => y[1] - x[1])[0][0]; doAct({ t: 'dist', film: f.id, k: 'pa', v: pa });
    const win = Object.keys(WINDOWS).filter(k => S.year >= WINDOWS[k].from && !(k === 'dnd' && f.streamSold)).map(k => [k, dForecast(f, dPlan(f).pa, dPlan(f).mix, k).net]).sort((x, y) => y[1] - x[1])[0][0]; doAct({ t: 'dist', film: f.id, k: 'win', v: win }); }
  if (${on('presale')} && mktNow()) { if (S.me.mktGo !== S.year + mktNow().k) doAct({ t: 'mkt', k: 'attend' }); for (const [m, s] of Object.entries(f.sales || {})) if (s.st === 'offer' || s.st === 'firm') doAct({ t: 'mkt', film: f.id, terr: m, k: 'accept' }); } } })()`;
const PICK = `for (const it of pending()) { const L = (it.choices || []).filter(c => !c.dis); let c = L.find(c => c.k !== 'sell') || L[0];
  if (it.kind === 'slatedeal') c = L.find(x => x.k === (${on('slate')} ? 'sl_full' : 'sl_no')) || c;
  if (c) doAct({ t: 'pick', id: it.id, k: c.k }); else it.done = true; }`;
const t0 = Date.now();
for (let w = 0; w < YEARS * 52; w++) {
  try { r(MAKE); r(STEER); r(`(() => { ${PICK} const w0 = S.week; for (let g = 0; g < 60 && S.week === w0; g++) { autoBeforeStep(); if (pending().length) { ${PICK} } doAct(endWeekAct('next')); } })()`); }
  catch (e) { console.error('ERR', w, e.message); break; }
}
const out = JSON.parse(r(`JSON.stringify((() => { const c = myCo(), F = c ? c.films.map(i => S.films[i]).filter(Boolean) : [], R = F.filter(f => f.rel !== null);
  const slate = S.me.slate ? S.me.slate.films.reduce((t, x) => t + (x.paid ? x.back - x.amt : 0), 0) : 0;
  return { feat: '${FEAT}', si: ${SI}, worth: Math.round(S.me.cash + (c ? c.cash * 1e6 : 0)), made: F.length, released: R.length, collapsed: F.filter(f => f.stage < 0).length,
    gross: Math.round(R.reduce((t, f) => t + f.total, 0) * 10) / 10, q: R.length ? Math.round(R.reduce((t, f) => t + f.q, 0) / R.length) : 0, standing: +ME().standing.toFixed(1), slatePnl: Math.round(slate) }; })())`));
out.gain = out.worth - Math.round(C0); out.sec = Math.round((Date.now() - t0) / 1000);
console.log(JSON.stringify(out));
