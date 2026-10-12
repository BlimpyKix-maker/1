// Diagnostic: replays the p01 setup (seed 2027, 'first' policy) and logs: within-week energy/stress extremes, where cash comes from, and roll outcomes by kind.
const weeks = +(process.argv[2] || 170), policy = process.argv[3] || 'first';
const h = require(require('path').join(__dirname, 'harness.js')); const r = c => h.run(c);
r(`newWorld(2027, 2027, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); S.log = []; S.me = null;`);
r(`doAct({ t: 'create', c: Object.assign(ccDefaults(), { name: 'Probe Person', role: 'director', field: 'film', hub: 'hollywood', wealth: 'gettingby', salt: 1, traits: ['Curious', 'Hustler'] }) })`);
let rs = 99 + 7919; h.ctx.__brnd = () => (rs = (rs * 16807) % 2147483647) / 2147483647; h.ctx.__policy = policy;
r(`globalThis.__D = { minE: [], maxS: [], cash: [], rolls: [], late: [], money: [] };
globalThis.__pickK = function (it) { const L = (it.choices || []).filter(c => !c.dis); if (!L.length) return it.choices[it.choices.length - 1].k;
  if (it.kind === 'offer') { const y = L.find(c => c.k === 'yes'), n = L.find(c => c.k === 'no'); if (y && n) return (jobDays() + ((it.post || {}).days || 0) <= 5) ? 'yes' : 'no'; }
  const p = __policy; if (p === 'first') return L[0].k; if (p === 'last') return L[L.length - 1].k; return L[Math.floor(__brnd() * L.length)].k; };
globalThis.__decide = function () { for (let g = 0; g < 30; g++) { const P0 = pending(); if (!P0.length) break; for (const it of P0) { const k = __pickK(it), c0 = S.me.cash; const lab = (it.choices.find(c => c.k === k) || {}).label; doAct({ t: 'pick', id: it.id, k });
  const it2 = S.me.inbox.find(x => x.id === it.id) || it; const res = it2.result || {};
  __D.rolls.push([it.kind, it.scene || it.title, k, res.ok === undefined ? 'n/a' : res.ok ? 'ok' : 'fail', res.roll ? 'rolled' : 'noroll']);
  if (it.kind === 'late' || Math.abs(S.me.cash - c0) > 3000) __D.late.push([S.week, it.kind, it.title, lab, Math.round(S.me.cash - c0), (res.t || '').slice(0, 90)]); } } };`);
for (let i = 0; i < 40 && !r('S.me.party.done'); i++) r(`(() => { const sc = partyScene(S.me.party); const L = sc.rooms || sc.opts; return doAct({ t: 'party', k: L[0].k }); })()`);
r(`doAct({ t: 'focus', day: 'balanced', eve: 'quiet', auto: true })`);
for (let w = 0; w < weeks && !r('S.me.over'); w++) {
  r(`__decide(); UI.apps = new Set(); if (lookingForWork() && jobDays() < 5) for (const [p] of rankedFits(appSlots())) UI.apps.add(p.id); if (S.me.focus && S.me.focus.auto) S.me.cal = autoCal();`);
  if (w % 3 === 0) r(`(() => { const ids = aliveKnown().sort((a, b) => opinion(b) - opinion(a)); const s = upcomingSlots(8)[2]; if (ids.length && s) doAct(Object.assign({ t: 'text', id: ids[S.week % Math.min(4, ids.length)], kind: ['coffee', 'drinks', 'hi'][S.week % 3] }, s)); })()`);
  r(`(() => { const w0 = S.week; let mn = 100, mx = 0; const c0 = S.me.cash; for (let g = 0; g < 80 && S.week === w0 && !S.me.over; g++) { __decide(); doAct(endWeekAct('next')); mn = Math.min(mn, S.me.energy); mx = Math.max(mx, S.me.stress); }
    __D.minE.push(Math.round(mn)); __D.maxS.push(Math.round(mx)); __D.cash.push(Math.round(S.me.cash)); const d = S.me.diary.filter(x => x.w >= w0 && /Money|\\$/.test(x.t)).map(x => x.t); if (Math.abs(S.me.cash - c0) > 3000) __D.money.push([w0, Math.round(S.me.cash - c0), d.join(' // ').slice(0, 400)]); })()`);
}
const D = JSON.parse(r('JSON.stringify(__D)'));
const pct = (a, p) => a.slice().sort((x, y) => x - y)[Math.floor(a.length * p)];
console.log('min energy within week p10/p50/p90:', pct(D.minE, .1), pct(D.minE, .5), pct(D.minE, .9), ' max stress within week p10/p50/p90:', pct(D.maxS, .1), pct(D.maxS, .5), pct(D.maxS, .9));
const rc = {}; for (const [k, s, pk, ok, rl] of D.rolls) { const key = k + ':' + ok; rc[key] = (rc[key] || 0) + 1; } console.log('outcomes by kind:', JSON.stringify(rc));
console.log('sample scene outcomes:', D.rolls.filter(x => x[0] === 'scene').slice(0, 14).map(x => x.slice(1).join('/')).join(' | '));
console.log('cash every 13 weeks:', D.cash.filter((_, i) => i % 13 === 12).join(', '));
console.log('big cash weeks:'); for (const m of D.money.slice(0, 40)) console.log('  ', m.join(' | '));
console.log('late/big picks:'); for (const m of D.late.slice(0, 70)) console.log('  ', m.join(' | '));
