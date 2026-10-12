const zlib = require('zlib');
const h = require(require('path').join(__dirname, 'harness.js')); const r = c => h.run(c);
const mem = () => { if (global.gc) global.gc(); return Math.round(process.memoryUsage().heapUsed / 1e6); };
r(`newWorld(2027, 2027, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); S.log = []; S.me = null;`);
console.log('heap after world build (MB, after GC):', mem());
r(`if (typeof snapBaseline === 'function') snapBaseline();`);
r(`doAct({ t: 'create', c: Object.assign(ccDefaults(), { name: 'Probe Person', salt: 1 }) })`);
for (let i = 0; i < 40 && !r('S.me.party.done'); i++) r(`(() => { const sc = partyScene(S.me.party); const L = sc.rooms || sc.opts; return doAct({ t: 'party', k: L[0].k }); })()`);
r(`doAct({ t: 'focus', day: 'balanced', eve: 'quiet', auto: true })`);
const size = () => { try { const s = r(`(() => { const d = snapData(); return typeof d === 'string' ? d : JSON.stringify(d); })()`); return [Math.round(s.length / 1024), Math.round(zlib.gzipSync(s).length / 1024)]; } catch (e) { return ['err ' + e.message.slice(0, 80)]; } };
for (const y of [1, 2, 5, 10]) {
  const target = y * 52;
  r(`(() => { while (S.week - S.me.startW < ${target} && !S.me.over) { for (let g = 0; g < 30; g++) { const P0 = pending(); if (!P0.length) break; for (const it of P0) { const L = it.choices.filter(c => !c.dis); doAct({ t: 'pick', id: it.id, k: (L[0] || it.choices[0]).k }); } } if (S.me.focus && S.me.focus.auto) S.me.cal = autoCal(); doAct(endWeekAct('next')); } })()`);
  const s = size();
  console.log(`year ${y}: heap ${mem()} MB; snapshot ${s[0]} KB raw, ${s[1]} KB gzipped; action log ${r('S.log.length')} entries (${Math.round(r('JSON.stringify(S.log).length') / 1024)} KB); people ${r('S.people.length')}, films ${r('S.films.length')}, news ${r('S.news.length')}`);
}
