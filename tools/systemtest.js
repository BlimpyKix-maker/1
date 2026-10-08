// System checks: puts a well-off, established player through every money and career system the computer offers,
// through the action log like clicks, and checks each one does what it says. Then lives a year and a half so the
// weekly side of each system runs, and replays the log to make sure the whole thing is deterministic.
// Usage: node tools/systemtest.js
const path = require('path');
function fresh() {
  delete require.cache[require.resolve('./harness.js')];
  const h = require('./harness.js');
  h.run(`newWorld(2027, 4242, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); S.log = []; S.me = null;`);
  return h;
}
const h = fresh(), r = c => h.run(c);
r(`doAct({ t: 'create', c: Object.assign(ccDefaults(), { name: 'System Test', role: 'producer', wealth: 'trust', edu: 'business', hub: 'hollywood' }) }); partyAuto();`);
// a head start, through the log so the replay sees it too
r(`doAct({ t: 'end', cal: S.me.cal.map(x => x.slice()), apps: [], train: 'pro', catchWith: null }); doAct({ t: 'end', cal: S.me.cal.map(x => x.slice()), apps: [], train: 'pro', catchWith: null });`);
r(`S.me.cash += usd(4000000); ME().standing = 60; ME().fame = 30; S.log.push({ t: '_boost' });`);
let pass = 0, fail = 0;
const check = (name, code, test) => {
  let res; try { res = r(code); } catch (e) { res = 'THREW ' + e.message; }
  let ok = false; try { ok = test(res); } catch (e) { ok = false; }
  if (ok) pass++; else fail++;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${ok ? '' : '  -> ' + JSON.stringify(res).slice(0, 300)}`);
};
const num = c => +r(c);
// ---- markets ----
const co = num(`S.companies.find(c => c.closed === null && c.owner === undefined && c.tier <= 2 && listedCos().includes(c)).id`);
check('buy shares', `(() => { const c0 = S.me.cash; const ok = doAct({ t: 'trade', co: ${co}, n: 100 }); return [ok, (S.me.port || {})[${co}], c0 - S.me.cash]; })()`, x => x[0] && x[1] === 100 && x[2] > 0);
check('sell shares', `(() => { const c0 = S.me.cash; const ok = doAct({ t: 'trade', co: ${co}, n: -40 }); return [ok, S.me.port[${co}], S.me.cash - c0]; })()`, x => x[0] && x[1] === 60 && x[2] > 0);
check('open a short', `(() => { const ok = doAct({ t: 'short', key: 'c${co}', n: 50, op: 'open' }); return [ok, (S.me.shorts || {})['c${co}']]; })()`, x => x[0] && x[1] && x[1].n === 50);
check('cover the short', `(() => { const ok = doAct({ t: 'short', key: 'c${co}', n: 50, op: 'cover' }); return [ok, ((S.me.shorts || {})['c${co}'] || { n: 0 }).n]; })()`, x => x[0] && x[1] === 0);
check('limit order placed', `(() => { const px = pxOf('c${co}'); const ok = doAct({ t: 'order', key: 'c${co}', n: 10, lim: Math.round(px * 1.5 * 100) / 100, kind: 'buy' }); return [ok, (S.me.orders || []).length]; })()`, x => x[0] && x[1] >= 1);
check('sector fund buy', `(() => { const s = Object.keys(SECTOR).find(k => sectorOpen(SECTOR[k])); const ok = doAct({ t: 'strade', s, n: 20 }); return [ok, (S.me.sport || {})[s]]; })()`, x => x[0] && x[1] === 20);
check('bank deposit', `(() => { const ok = doAct({ t: 'bank', k: 'deposit', amt: usd(50000) }); return [ok, bankOf(S.me).sav]; })()`, x => x[0] && x[1] > 0);
check('bank withdraw', `(() => { const s0 = bankOf(S.me).sav; const ok = doAct({ t: 'bank', k: 'withdraw', amt: usd(10000) }); return [ok, s0 - bankOf(S.me).sav]; })()`, x => x[0] && x[1] > 0);
// ---- your company ----
check('found a company', `(() => { const ok = doAct({ t: 'found', name: 'Test Pictures' }); return [ok, !!myCo()]; })()`, x => x[0] && x[1]);
check('invest in the company', `(() => { const c0 = myCo().cash; const ok = doAct({ t: 'invest', amount: usd(3000000) }); return [ok, myCo().cash > c0]; })()`, x => x[0] && x[1]);
check('department upgrade', `(() => doAct({ t: 'dept', k: 'dev' }))()`, x => x === true);
check('release strategy', `(() => doAct({ t: 'release', k: 'fest' }))()`, x => x === true);
check('write a script', `(() => { const n0 = (S.me.scripts || []).length; doAct({ t: 'newscript', genre: 'Drama', theme: 'family', tone: 'dark', premise: 'A ferryman refuses one last crossing.', hero: 'an old ferryman', setting: 'a flooded valley', notes: 'He is afraid of the water. The ending: he swims. '.repeat(30) }); return [(S.me.scripts || []).length - n0]; })()`, x => x[0] === 1);
// finish the draft by living some weeks of writing
r(`for (let w = 0; w < 14; w++) { for (const it of pending()) doAct({ t: 'pick', id: it.id, k: (it.choices.find(c => !c.dis) || it.choices[0]).k }); doAct({ t: 'end', cal: Array.from({ length: 7 }, () => ['write', 'write', 'home']), apps: [], train: 'wri', catchWith: null }); for (const it of pending()) doAct({ t: 'pick', id: it.id, k: (it.choices.find(c => !c.dis) || it.choices[0]).k }); }`);
check('script has a grade', `(S.me.scripts || []).filter(s => s.grade).length`, x => x >= 1);
check('make your own film', `(() => { const sc = S.me.scripts.find(x => x.grade && x.made === undefined); if (!sc) return 'no graded script'; const plan = finPlan(estBudget(sc.genre), { genre: sc.genre }); if (myCo().cash < plan.equity) doAct({ t: 'invest', amount: Math.round((plan.equity - myCo().cash) * 1e6) + usd(100000) }); const L = castOptions(sc.genre), D = dirOptions(sc.genre); const f0 = myFilms().length; const ok = doAct({ t: 'selffund', src: 'script', id: sc.id, lead: L.length ? L[0].id : undefined, dir: D.length ? D[0].id : undefined, dp: (crewOptions('dp', 'cam', sc.genre)[0] || {}).id, ed: (crewOptions('editor', 'edt', sc.genre)[0] || {}).id, inv: true }); const note = S.me.inbox.slice(-3).some(it => /investors pass|doesn't close/i.test(it.title)); return [ok, myFilms().length - f0, note]; })()`, x => x[0] && (x[1] === 1 || x[2]));   // the money can fall through on a roll: that's a result too
check('film has a finance plan', `(() => { const f = myFilms().slice(-1)[0]; return f ? !!f.fin : 'financing fell through'; })()`, x => x === true || x === 'financing fell through');
check("co-invest in someone else's film", `(() => { const f = S.active.map(i => S.films[i]).find(f => f.rel === null && f.stage >= 0 && f.stage <= 1 && !myFilms().includes(f)); if (!f) return 'none in development'; const ok = doAct({ t: 'coinv', f: f.id, p: 0 }); return [ok, (S.me.coinv || []).length]; })()`, x => x[0] && x[1] >= 1);
// ---- making things ----
check('start a song', `(() => { const ok = doAct({ t: 'startwork', type: 'song', title: 'Test Song' }); return [ok, !!S.me.make]; })()`, x => x[0] && x[1]);
r(`for (let i = 0; i < 12 && S.me.make && !S.me.make.ready; i++) { doAct({ t: 'session', score: 8 }); doAct({ t: 'end', cal: Array.from({ length: 7 }, () => ['make', 'make', 'home']), apps: [], train: 'mus', catchWith: null }); for (const it of pending()) doAct({ t: 'pick', id: it.id, k: (it.choices.find(c => !c.dis) || it.choices[0]).k }); }`);
check('release the song', `(() => { const n0 = (S.me.works || []).length; const ok = doAct({ t: 'releasework', promo: 1 }); return [ok, (S.me.works || []).length - n0]; })()`, x => x[0] && x[1] === 1);
check('buy an app', `(() => { const k = Object.keys(SHOP).find(k => !(S.me.owned2 || []).includes(k) && !(SHOP[k].from > S.year)); const ok = doAct({ t: 'buyapp', k }); return [ok, (S.me.owned2 || []).includes(k)]; })()`, x => x[0] && x[1]);
check('enter a contest', `(() => { const sc = (S.me.scripts || []).find(x => x.grade); const c = COMPS.find(c => compOpen(c) && !compEntered(c)); if (!c) return 'none open'; const ok = doAct({ t: 'compete', k: c.k, script: sc && sc.id }); return [ok, compEntered(c)]; })()`, x => x === 'none open' || (x[0] && x[1]));
// ---- life ----
check('buy furniture', `(() => { const it = FURNITURE.find(f => !S.me.home.items.includes(f.id) && usd(f.price) < S.me.cash); const ok = doAct({ t: 'furnish', id: it.id }); return [ok, S.me.home.items.includes(it.id)]; })()`, x => x[0] && x[1]);
check('book a weekend trip', `(() => { const T = tripsAvailable()[0]; if (!T) return 'none'; return doAct({ t: 'trip', k: T.k }); })()`, x => x === true || x === 'none');
check('bazaar purchase', `(() => { const L = typeof bzLots === 'function' ? bzLots() : []; const it = L.find(x => x.price === undefined || usd(x.price || 0) < S.me.cash); if (!it) return 'nothing on sale'; const n0 = (S.me.bz || []).length; const ok = doAct({ t: 'bazaar', k: 'buy', item: it.id }); return [ok, (S.me.bz || []).length - n0]; })()`, x => x === 'nothing on sale' || (x[0] && x[1] >= 1));
// ---- live a year and a half: weekly systems run (orders, dividends, film production, statements, arcs) ----
const t0 = Date.now();
r(`for (let w = 0; w < 78 && !S.me.over; w++) { const w0 = S.week; for (let g = 0; g < 60 && S.week === w0; g++) { for (const it of pending()) doAct({ t: 'pick', id: it.id, k: it.kind === 'offer' ? 'no' : (it.choices.find(c => !c.dis) || it.choices[0]).k }); doAct({ t: 'next' }); } }`);
console.log(`lived 78 weeks in ${Math.round((Date.now() - t0) / 1000)}s`);
check('own film made progress', `(() => { const f = myFilms().slice(-1)[0]; return f ? [f.stage, f.rel] : 'no film'; })()`, x => x === 'no film' || (Array.isArray(x) && (x[0] >= 2 || x[1] !== null)));
check('company still trading', `(() => { const c = myCo(); return c ? c.closed : 'none'; })()`, x => x === null);
check('story arcs happened', `(S.me.arcLog || []).length + arcActive().length`, x => x >= 3);
check('no NaN anywhere in you', `(() => { const me = ME(), bad = []; for (const [k, v] of Object.entries(me.sk).concat(Object.entries(me.mind), [['cash', S.me.cash], ['standing', me.standing], ['fame', me.fame], ['energy', S.me.energy], ['stress', S.me.stress], ['bank', bankOf(S.me).sav]])) if (typeof v !== 'number' || !isFinite(v)) bad.push(k); return bad; })()`, x => Array.isArray(x) && !x.length);
check('net worth adds up', `typeof osNetWorth === 'function' ? osNetWorth().total : 0`, x => typeof x === 'number' && isFinite(x));
// ---- determinism: replay the log into a fresh world ----
const A = r(`JSON.stringify({ w: S.week, cash: Math.round(S.me.cash), port: S.me.port, films: myFilms().map(f => f.id), rng: S.me.rng.s })`), log = r('JSON.stringify(S.log)');
const h2 = fresh(); h2.ctx.__log = JSON.parse(log);
h2.run(`for (const a of __log) { if (a.t === '_boost') { S.me.cash += usd(4000000); ME().standing = 60; ME().fame = 30; S.log.push(a); continue; } doAct(a); }`);
const B = h2.run(`JSON.stringify({ w: S.week, cash: Math.round(S.me.cash), port: S.me.port, films: myFilms().map(f => f.id), rng: S.me.rng.s })`);
if (A === B) { pass++; console.log('ok    replay identical'); } else { fail++; console.log('FAIL  replay differs\n  ' + A.slice(0, 300) + '\n  ' + B.slice(0, 300)); }
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
