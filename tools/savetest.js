// Save round trip: play a career for N weeks, save, rebuild the world from the seed, load the save, and check that
// the world and the career came back (within a normal save's precision), then keep playing. Prints the save's size.
// usage: node tools/savetest.js [weeks=52] [seed=2027]      exit code 1 on failure
const zlib = require('zlib');
const [weeks = 52, seed = 2027] = process.argv.slice(2).map(Number);
const h = require(require('path').join(__dirname, 'harness.js')); const r = c => h.run(c);
const play = n => r(`for (let w = 0; w < ${n}; w++) { const w0 = S.week; for (let g = 0; g < 60 && S.week === w0; g++) { autoBeforeStep(); for (const it of pending()) { const L = (it.choices || []).filter(c => !c.dis); if (L[0]) doAct({ t: 'pick', id: it.id, k: L[0].k }); else it.done = true; } doAct(endWeekAct('next')); } }`);
r(`newWorld(2027, ${seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); snapBaseline();
  doAct({ t: 'create', c: Object.assign(ccDefaults(), { salt: ${seed} }) }); partyAuto();`);
play(weeks);
const sig = `JSON.stringify({ week: S.week, people: S.people.length, films: S.films.length, cos: S.companies.filter(c => c.closed === null).length,
  fame: Math.round(S.people.reduce((t, p) => t + (p.fame || 0), 0)), sk: Math.round(S.people.slice(0, 3000).reduce((t, p) => t + Object.values(p.sk || {}).reduce((a, b) => a + b, 0), 0)),
  ties: Math.round(S.people.slice(0, 3000).reduce((t, p) => t + Object.values(p.ties || {}).reduce((a, b) => a + b, 0), 0)), gross: Math.round(S.films.reduce((t, f) => t + (f.total || 0), 0)),
  cash: S.me.cash, name: ME().name, news: S.news.length, cat: Object.keys(S.cat.films || {}).length })`;
const before = JSON.parse(r(sig));
const t0 = Date.now(); r(`globalThis.__save = snapData();`); const ms = Date.now() - t0;
const str = r('__save'), raw = str.length, gz = zlib.gzipSync(str).length;
r(`newWorld(2027, ${seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); snapBaseline(); snapApply(__save);`);
const after = JSON.parse(r(sig));
const bad = [];
for (const k in before) { const a = before[k], b = after[k]; if (typeof a === 'number' && Math.abs(a - b) > Math.max(2, Math.abs(a) * .001)) bad.push(`${k}: ${a} -> ${b}`); else if (typeof a !== 'number' && a !== b) bad.push(`${k}: ${a} -> ${b}`); }
let cont = 'ok'; try { play(8); } catch (e) { cont = 'error: ' + e.message; }
console.log(JSON.stringify({ weeks, seed, rawKB: Math.round(raw / 1024), gzKB: Math.round(gz / 1024), saveMs: ms, before, after, bad, continued: cont, weekNow: r('S.week') }));
if (bad.length || cont !== 'ok') process.exitCode = 1;
