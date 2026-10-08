// Reads longplay JSON reports and prints what repeats, what's quiet and how careers progress.
// Usage: node tools/longplay-report.js <report.json>... [--top N]
const fs = require('fs');
const args = process.argv.slice(2), TOP = args.includes('--top') ? +args[args.indexOf('--top') + 1] : 12;
const files = args.filter((a, i) => a.endsWith('.json'));
// a message's shape: names, titles and numbers blanked, so "Ana: coffee?" and "Bo: coffee?" count as one line
const shape = t => String(t).replace(/\$?[\d,.]+[kKmM%]?/g, '#').replace(/(^|[^.!?] )([A-Z][\w'’.-]*)( [A-Z][\w'’.-]*)*/g, '$1@').replace(/@( @)+/g, '@').toLowerCase().replace(/\s+/g, ' ').trim();
const all = {};
for (const f of files) {
  const R = JSON.parse(fs.readFileSync(f, 'utf8')), rec = R.rec, weeks = R.weekly.length, years = weeks / 52;
  console.log(`\n=== ${R.kind} (${R.T.role}, ${R.T.field}, ${R.T.wealth}) · ${weeks} weeks · ${R.errors.length} errors · ${Math.round(R.ms / 1000)}s`);
  for (const e of R.errors.slice(0, 5)) console.log('  ERROR w' + e.w + ': ' + e.msg + ' :: ' + e.stack);
  // progression
  console.log('  year  level  credits  works  standing  cash        hold/net      known  arcs  jobs');
  for (const s of R.snaps.filter((_, i) => i % 3 === 0 || i === R.snaps.length - 1)) console.log(`  ${s.y}  ${String(s.level).padEnd(5)}  ${String(s.credits).padEnd(7)}  ${String(s.works).padEnd(5)}  ${String(s.standing).padEnd(8)}  ${String(s.cash).padEnd(10)}  ${String(s.hold + '/' + s.holdNet).padEnd(12)}  ${String(s.known).padEnd(5)}  ${String(s.arcs).padEnd(4)}  ${s.jobs.join('; ').slice(0, 50)}`);
  // pacing
  const quiet = R.weekly.filter(w => w.n <= 2).length, nodec = R.weekly.filter(w => !w.dec).length;
  const perYear = []; for (let y = 0; y < Math.ceil(years); y++) { const W = R.weekly.slice(y * 52, y * 52 + 52); perYear.push([W.reduce((a, w) => a + w.dec, 0), W.reduce((a, w) => a + w.texts, 0), W.reduce((a, w) => a + w.mail, 0), W.reduce((a, w) => a + w.scenes, 0)]); }
  console.log(`  quiet weeks (≤2 messages): ${quiet}; weeks with no decision: ${nodec} of ${weeks}`);
  console.log('  per year [decisions, texts in, mail, scenes]: ' + perYear.map(x => x.join('/')).join('  '));
  // repetition per channel: share of messages whose shape was already seen in the previous 52 weeks
  const ch = {};
  for (const m of rec) { const c = ch[m.ch] = ch[m.ch] || { n: 0, shapes: new Map(), last: new Map(), rep: 0, ex: new Map() }; const s = m.key || shape(m.t); c.n++; if (c.last.has(s) && m.w - c.last.get(s) < 52) c.rep++; c.last.set(s, m.w); c.shapes.set(s, (c.shapes.get(s) || 0) + 1); if (!c.ex.has(s)) c.ex.set(s, m.t); }
  const rows = Object.entries(ch).sort((a, b) => b[1].n - a[1].n);
  console.log('  channel                 count   /yr   unique  repeat<1y');
  for (const [k, c] of rows) { console.log(`  ${k.padEnd(22)}  ${String(c.n).padEnd(6)}  ${String(Math.round(c.n / years)).padEnd(4)}  ${String(c.shapes.size).padEnd(6)}  ${Math.round(c.rep / c.n * 100)}%`); const a = all[k] = all[k] || { n: 0, shapes: new Map(), ex: new Map() }; a.n += c.n; for (const [s, v] of c.shapes) { a.shapes.set(s, (a.shapes.get(s) || 0) + v); if (!a.ex.has(s)) a.ex.set(s, c.ex.get(s)); } }
}
console.log(`\n=== most repeated lines across all careers (top ${TOP} per channel)`);
for (const [k, a] of Object.entries(all).sort((x, y) => y[1].n - x[1].n)) {
  if (a.n < 30) continue;
  console.log(`\n-- ${k}: ${a.n} messages, ${a.shapes.size} distinct`);
  for (const [s, v] of [...a.shapes].sort((x, y) => y[1] - x[1]).slice(0, TOP)) console.log(`  ${String(v).padStart(5)}×  ${String(a.ex.get(s)).slice(0, 150)}`);
}
