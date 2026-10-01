// Lists catalogue names that sit too close to the real ones (see the naming rules in the design doc).
// Writes data/rename/todo-{people,films,studios}.tsv: id, real name, current name, context.
const fs = require('fs'), path = require('path');
const h = require('./harness.js');
const C = h.run('CATALOGUES');
const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, '');
const lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
const close = (r, n) => { const a = strip(r), b = strip(n), d = lev(a, b); return d <= 2 || d / Math.max(a.length, b.length) < .34; };
const last = s => strip(s).split(' ').pop();
const done = {};
for (const k of ['people', 'films', 'studios']) { done[k] = new Set(); const f = path.join(__dirname, '..', 'data', 'rename', `${k}.tsv`); if (fs.existsSync(f)) for (const l of fs.readFileSync(f, 'utf8').split('\n')) if (l.trim()) done[k].add(l.split('\t')[0]); }
const out = { people: [], films: [], studios: [] }, seen = new Set();
for (const c of C) {
  for (const p of c.people || []) { if (seen.has('p' + p.id) || done.people.has(p.id)) continue; seen.add('p' + p.id); if (close(p.real, p.n) || lev(last(p.real), last(p.n)) <= 2) out.people.push([p.id, p.real, p.n, `${p.r}${p.r2 ? '/' + p.r2 : ''} ${p.hub} ${p.b || ''}`]); }
  for (const f of c.films || []) { if (seen.has('f' + f.id) || done.films.has(f.id)) continue; seen.add('f' + f.id); if (close(f.real, f.t)) out.films.push([f.id, f.real, f.t, `${f.y} ${f.g} ${f.hub}`]); }
  for (const s of c.studios || []) { if (seen.has('s' + s.id) || done.studios.has(s.id)) continue; seen.add('s' + s.id); if (close(s.real, s.n)) out.studios.push([s.id, s.real, s.n, `${s.hub} ${s.f}`]); }
}
for (const k in out) fs.writeFileSync(path.join(__dirname, '..', 'data', 'rename', `todo-${k}.tsv`), out[k].map(r => r.join('\t')).join('\n') + '\n');
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length])));
