// Headless playtest: builds a world, plays a career with a simple bot, then replays the save into a fresh
// world and checks that it lands in exactly the same state. Usage: node tools/playtest.js [weeks] [depth]
const path = require('path');
const weeks = +(process.argv[2] || 52), depth = process.argv[3] || 'quick';
function fresh() {
  delete require.cache[require.resolve('./harness.js')];
  const h = require('./harness.js');
  h.run(`newWorld(2027, 2027, '${depth}'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); S.log = []; S.me = null;`);
  return h;
}
const h = fresh();
const r = c => h.run(c);
r(`doAct({ t: 'create', c: { name: 'Test Person', g: 'X', age: 23, hub: 'hollywood', role: 'dp', wealth: 'gettingby', edu: 'filmcam', arrival: 'plusone', build: 'rugged', quirk: 'rival', points: { cam: 4, edt: 2, dir: 2, act: 1, pro: 1 }, traits: ['Workhorse', 'Charming', 'Lucky'], love: ['Horror', 'Sci-fi'], hate: ['Musical'], favs: Object.keys(S.cat.allFilms).filter(id => S.cat.allFilms[id].g === 'Horror').slice(0, 3), look: defaultLook() } })`);
for (let i = 0; i < 20 && !r('S.me.party.done'); i++) r(`(() => { const sc = partyScene(S.me.party); return doAct({ t: 'party', k: sc.rooms ? sc.rooms[0].k : sc.opts[${i % 2}].k }); })()`);
console.log('party:', r(`S.me.party.log.map(l => l.title + ': ' + l.choice + (l.roll ? ' [' + rollText(l.roll) + ']' : '')).join(' | ')`));
console.log(r(`S.me.inbox.map(x => x.title + ': ' + x.text).join('\\n')`));
console.log('contacts after party:', r(`Object.keys(S.me.known).map(id => P(+id).name + ' [' + S.me.known[id].tags.join(', ') + '] ' + Math.round(opinion(+id))).join('; ')`));
const t0 = Date.now();
for (let w = 0; w < weeks; w++) {
  // decide everything pending: accept offers that fit, first choice otherwise
  r(`for (const it of pending()) { const k = it.kind === 'offer' ? (jobDays() + it.post.days <= 5 ? 'yes' : 'no') : (it.choices.find(c => !c.dis) || it.choices[it.choices.length - 1]).k; doAct({ t: 'pick', id: it.id, k }); }`);
  // plan: job hunt when not fully employed, otherwise write/rest
  r(`S.me.plan = jobDays() >= 5 ? ['hunt','hunt','hunt','hunt','hunt','rest','rest'] : ['hunt','hunt','network','train','hustle','rest','rest']; S.me.train = 'cam';`);
  // live the week; answer anything that comes up on the way
  const ok = r(`(() => { const apps = S.me.board.slice().sort((a, b) => (hireOdds(b) + (b.odd ? -.5 : 0)) - (hireOdds(a) + (a.odd ? -.5 : 0))).slice(0, appSlots()).map(p => p.id); const w0 = S.week;
    for (let g = 0; g < 40 && S.week === w0 && !S.me.over; g++) {
      for (const it of pending()) { const k = it.kind === 'offer' ? (jobDays() + it.post.days <= 5 ? 'yes' : 'no') : (it.choices.find(c => !c.dis) || it.choices[it.choices.length - 1]).k; doAct({ t: 'pick', id: it.id, k }); }
      doAct({ t: 'end', plan: S.me.plan.slice(), apps, train: S.me.train, catchWith: null }); }
    return S.week !== w0 || S.me.over; })()`);
  if (!ok) { console.log('week stuck at', w, r(`JSON.stringify(pending().map(x => x.kind))`), r('S.me.over')); break; }
}
const sum = c => r(`(() => { const M = S.me, me = ME(); return JSON.stringify({ week: S.week, cash: M.cash, energy: Math.round(M.energy), stress: Math.round(M.stress), standing: +me.standing.toFixed(3), cam: +me.c.cam.toFixed(4), credits: me.credits.length, known: Object.keys(M.known).length, apps: M.stats.apps, offers: M.stats.offers, weeksWorked: M.stats.weeks, jobs: M.jobs.map(j => j.t), past: M.past.length, log: S.log.length, films: S.films.length }); })()`);
const A = sum();
console.log(`played ${weeks} weeks in ${Date.now() - t0}ms\n`, A);
console.log('past jobs:', r(`S.me.past.map(p => p.t + (p.credited ? ' (credit)' : '') + (p.quit ? ' (quit)' : '')).join('; ')`));
console.log('last diary:', r(`S.me.diary.slice(-8).map(d => d.t).join(' | ')`));
// replay
const log = JSON.parse(r('JSON.stringify(S.log)'));
const h2 = fresh();
h2.ctx.__log = log;
const t1 = Date.now();
h2.run(`for (const a of __log) if (!applyAct(a)) throw new Error('replay refused ' + JSON.stringify(a).slice(0, 120)); S.log = __log;`);
const B = h2.run(`(() => { const M = S.me, me = ME(); return JSON.stringify({ week: S.week, cash: M.cash, energy: Math.round(M.energy), stress: Math.round(M.stress), standing: +me.standing.toFixed(3), cam: +me.c.cam.toFixed(4), credits: me.credits.length, known: Object.keys(M.known).length, apps: M.stats.apps, offers: M.stats.offers, weeksWorked: M.stats.weeks, jobs: M.jobs.map(j => j.t), past: M.past.length, log: S.log.length, films: S.films.length }); })()`);
console.log(`replayed in ${Date.now() - t1}ms: ${A === B ? 'IDENTICAL' : 'DIFFERENT\n ' + B}`);
console.log('inbox kinds:', r(`JSON.stringify(S.me.inbox.reduce((a, x) => (a[x.kind] = (a[x.kind] || 0) + 1, a), {}))`));
console.log('scenes seen:', r(`S.me.inbox.filter(x => x.kind === 'scene').map(x => x.scene + (x.result ? (x.result.ok === false ? '✗' : '✓') : '')).join(' ')`));
console.log('sample scene:', r(`(() => { const x = S.me.inbox.filter(x => x.kind === 'scene').pop(); return x ? x.title + ' — ' + x.text + ' → ' + (x.result && x.result.t) : 'none'; })()`));
console.log('known tags:', r(`JSON.stringify(Object.values(S.me.known).flatMap(k => k.tags).reduce((a, t) => (a[t] = (a[t] || 0) + 1, a), {}))`));
