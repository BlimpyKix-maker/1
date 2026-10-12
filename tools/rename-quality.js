// Checks the new names themselves: flags any where a word of the new name (hyphenated halves included) sits
// within two letters of the real surname, the whole name is within two letters of the real one, or the new
// surname is just the real one with letters bolted on (Dench → Denchley). Deliberate puns go in puns-kept.txt.
const fs = require('fs'), path = require('path');
const h = require('./harness.js');
const C = h.run('CATALOGUES');
const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9 -]/g, '').trim();
const lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
const kept = new Set(fs.readFileSync(path.join(__dirname, '..', 'data', 'rename', 'puns-kept.txt'), 'utf8').split('\n'));
const out = [], seen = new Set();
for (const c of C) for (const p of c.people || []) {
  if (seen.has(p.id)) continue; seen.add(p.id);
  const r = strip(p.real), n = strip(p.n);
  const rs = r.split(/[ ]+/).pop().replace(/-/g, ''), words = n.split(/[ -]+/).filter(w => w.length > 2);
  const ns = n.split(/[ ]+/).pop().replace(/-/g, '');
  const padded = rs.length >= 3 && ns !== rs && (ns.startsWith(rs) || ns.endsWith(rs) || (rs.length >= 5 && ns.length > rs.length && ns.startsWith(rs.slice(0, -1))));
  // the living (no death year) get a stricter test: no game-name word may share the real surname's first four
  // letters or contain it (Hoffman → Hoffner, Crystal → Crystalline), and a family-name-first name may not keep
  // both the family name and the first syllable of the given name (Park Chan-wook → Park Chan-yeol)
  const given = new Set(r.split(/[ ]+/).slice(0, -1)), rsw = rs.length >= 4 ? [rs, ...r.split(/[ ]+/).pop().split('-').filter(x => x.length >= 4)] : [];
  const pre4 = (a, b) => a.length >= 4 && b.length >= 4 && a.slice(0, 4) === b.slice(0, 4);
  const R = p.real.split(' '), N = p.n.split(' ');
  const living = !p.d && !p.real.includes('–') && (rsw.some(a => n.split(/[ -]+/).some(w => !given.has(w) && (pre4(a, w) || (w !== a && w.includes(a))))) ||
    (R.length === 2 && N.length === 2 && R[0] === N[0] && /^[A-Z][^-]*-/.test(R[1]) && R[R.length - 1].split('-')[0] === (N[N.length - 1].split('-')[0])));
  const bad = padded || living || lev(r, n) <= 2 || words.some(w => w.length >= 4 && rs.length >= 4 && lev(w, rs) <= (rs.length <= 5 ? 1 : 2));
  if (bad && !kept.has(p.id)) out.push([p.id, p.real, p.n].join('\t'));
}
fs.writeFileSync(path.join(__dirname, '..', 'data', 'rename', 'quality-people.tsv'), out.join('\n') + '\n');
console.log(out.length, 'people names still too close (', kept.size - 1, 'deliberate puns kept)');
