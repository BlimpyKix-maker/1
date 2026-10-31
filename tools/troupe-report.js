// Reads the troupe's reports and prints what they found, grouped.
// Usage: node tools/troupe-report.js <dir>
// Sections:
//   - bugs, deduplicated with how many players hit each;
//   - actions the game refused most often;
//   - a viability table per player;
//   - how each path did: schooling, labs, festivals, shorts, competitions, making work;
//   - fun signals per play style;
//   - the opinions the players voiced, counted.
const fs = require('fs'), path = require('path');
const dir = process.argv[2] || '.';
const R = fs.readdirSync(dir).filter(f => /^troupe-\d+\.json$/.test(f)).map(f => JSON.parse(fs.readFileSync(path.join(dir, f)))).sort((a, b) => a.idx - b.idx);
const pct = x => Math.round(x * 100) + '%', avg = L => L.length ? L.reduce((t, x) => t + x, 0) / L.length : 0;
console.log(`${R.length} players\n`);
// bugs
const B = {}; for (const r of R) for (const b of r.bugs) { const k = b.kind + ' ' + String(b.msg).replace(/\d+/g, '#').slice(0, 160); (B[k] = B[k] || { n: 0, who: new Set(), ex: b }).n++; B[k].who.add(r.idx); }
console.log('== BUGS'); for (const [k, v] of Object.entries(B).sort((a, b) => b[1].who.size - a[1].who.size)) console.log(`${v.who.size} players, ${v.n}x: ${k}${v.ex.where ? ' [' + v.ex.where + ']' : ''}${v.ex.stack ? '\n    ' + v.ex.stack.slice(0, 200) : ''}`);
// refused actions
const A = {}; for (const r of R) for (const [k, a] of Object.entries(r.acts)) { const x = A[k] = A[k] || { n: 0, ok: 0, players: 0 }; x.n += a.n; x.ok += a.ok; x.players++; }
console.log('\n== ACTIONS (tries, success rate, players)'); for (const [k, a] of Object.entries(A).filter(([k]) => !/^decide/.test(k)).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n)) console.log(`${k.padEnd(18)} ${String(a.n).padStart(6)} ${pct(a.ok / a.n).padStart(5)}  ${a.players}`);
// viability
console.log('\n== PLAYERS (dream/style: level by year | credits | cash | rung | works | quiet | dec/wk | broke)');
for (const r of R) { const s = r.snaps; console.log(`#${String(r.idx).padStart(3)} ${(r.T.dream + '/' + r.T.style + (r.T.prog ? '/' + r.T.prog : '') + (r.T.uni ? '/' + r.T.uni : '') + (r.T.labs ? '/labs' : '')).padEnd(30)} L ${s.map(x => x.level).join('>').padEnd(10)} cr ${String(r.final.credits).padStart(3)} $${String(r.final.cash).padStart(9)} rung ${s.map(x => x.rung).join('>').padEnd(8)} w ${String(r.final.works.length).padStart(3)} q ${pct(r.quiet).padStart(4)} d ${r.decPW.toFixed(2)} b ${pct(r.broke)}${r.final.over ? ' GAME OVER' : ''}`); }
// paths
console.log('\n== PATHS');
const by = f => R.filter(f);
const sch = by(r => r.T.prog || r.T.uni); console.log(`school players ${sch.length}: still enrolled ${sch.filter(r => r.final.school).length}, graduated ${sch.filter(r => r.final.milestones.some(m => /graduat|certificate|degree|diploma|qualified|finished the/i.test(m))).length}, applied ${sch.filter(r => r.final.schoolApps).length}`);
for (const r of sch) console.log(`   ${(r.T.prog || r.T.uni).padEnd(10)} school=${r.final.school} apps=${r.final.schoolApps} ${JSON.stringify(r.acts[Object.keys(r.acts).find(k => /^(enrol|school)/.test(k))] || {})} | ${r.final.milestones.filter(m => /school|graduat|enrol|course|degree|certificate|class/i.test(m)).slice(0, 3).join('; ')}`);
const lab = by(r => r.final.labs.tried); console.log(`labs: ${lab.length} players tried, ${lab.filter(r => r.final.labs.done || r.final.labs.now).length} got in; avg tries ${avg(lab.map(r => r.final.labs.tried)).toFixed(1)}`);
const fe = by(r => r.T.style === 'festival'); console.log(`festival players ${fe.length}: shorts made ${fe.map(r => r.final.shorts.made).join(',')}; short subs ${fe.map(r => r.final.shorts.subs).join(',')}; selected ${fe.map(r => r.final.shorts.sel + r.final.shorts.laurels).join(',')}; feature fests ${fe.map(r => r.final.fests.n + '/' + r.final.fests.sel).join(',')}`);
const co = by(r => r.final.comps.n); const pl = {}; for (const r of co) for (const p of r.final.comps.places) pl[p] = (pl[p] || 0) + 1; console.log(`competitions: ${co.length} players entered ${co.reduce((t, r) => t + r.final.comps.n, 0)}; results ${JSON.stringify(pl)}`);
const wk = {}; for (const r of R) for (const w of r.final.works) wk[w] = (wk[w] || 0) + 1; console.log(`works made: ${JSON.stringify(wk)}`);
// fun by style
console.log('\n== STYLES (quiet weeks, decisions/wk, broke weeks, final level)');
const st = {}; for (const r of R) (st[r.T.style] = st[r.T.style] || []).push(r);
for (const [k, L] of Object.entries(st)) console.log(`${k.padEnd(10)} n=${L.length} quiet ${pct(avg(L.map(r => r.quiet)))} dec ${avg(L.map(r => r.decPW)).toFixed(2)} broke ${pct(avg(L.map(r => r.broke)))} level ${avg(L.map(r => r.final.level)).toFixed(1)} over ${L.filter(r => r.final.over).length}`);
// opinions
console.log('\n== OPINIONS (how many players said it)');
const O = {}; for (const r of R) for (const o of r.opinions) { const k = o.replace(/\d+/g, '#'); (O[k] = O[k] || []).push(r.idx); }
for (const [k, L] of Object.entries(O).sort((a, b) => b[1].length - a[1].length).slice(0, 60)) console.log(`${String(L.length).padStart(3)}  ${k}`);
console.log('\n== PRAISE'); const G = {}; for (const r of R) for (const o of r.praise) { const k = o.replace(/\d+/g, '#'); G[k] = (G[k] || 0) + 1; } for (const [k, n] of Object.entries(G).sort((a, b) => b[1] - a[1])) console.log(`${String(n).padStart(3)}  ${k}`);
