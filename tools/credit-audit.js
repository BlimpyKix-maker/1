// Checks catalogue credits for things that can't be right, and lists filmographies that look thin.
// Writes data/audit/credits.tsv (problems) and data/audit/thin.tsv (people with few catalogue credits).
const fs = require('fs'), path = require('path');
const h = require('./harness.js');
const C = h.run('CATALOGUES');
const ROLES = ['dir', 'wri', 'cast', 'dp', 'mus', 'prod', 'pd', 'vfx', 'ed', 'cos'];
// credits that really did come after death (a score reused in a remake, say)
const POSTHUMOUS = new Set(['capefear91:herrmann', 'ivantheterriblepar58:eisenstein']);
const MIN_AGE = { dir: 17, wri: 16, cast: 2, dp: 17, mus: 14, prod: 18, pd: 18, vfx: 17, ed: 17, cos: 17 };
const people = {}, films = [], fseen = new Set();
for (const c of C) {
  for (const p of c.people || []) if (!people[p.id]) people[p.id] = { ...p, credits: [] };
  for (const f of c.films || []) { if (fseen.has(f.id)) { films.push({ dup: f.id }); continue; } fseen.add(f.id); films.push(f); }
}
const out = [], ids = (f, r) => [].concat(f[r] || []).filter(Boolean);
const titleYear = {};
for (const f of films) {
  if (f.dup) { out.push(['dup-id', f.dup, '', 'film id appears twice']); continue; }
  const ty = f.real.toLowerCase() + '|' + f.y;
  if (titleYear[ty]) out.push(['dup-film', f.id, titleYear[ty], `${f.real} (${f.y}) listed twice`]); else titleYear[ty] = f.id;
  for (const r of ROLES) for (const id of ids(f, r)) {
    const p = people[id];
    if (!p) { out.push(['missing-person', f.id, id, `${f.real} ${f.y}: ${r} '${id}' not in catalogue`]); continue; }
    p.credits.push({ f, r });
    if (p.b && f.y - p.b < MIN_AGE[r]) out.push(['too-young', f.id, id, `${p.real} b.${p.b} credited ${r} on ${f.real} (${f.y}) at ${f.y - p.b}`]);
    if (p.d && f.y > p.d + (r === 'cast' || r === 'mus' ? 3 : 2) && !POSTHUMOUS.has(f.id + ':' + id)) out.push(['after-death', f.id, id, `${p.real} d.${p.d} credited ${r} on ${f.real} (${f.y})`]);
  }
}
for (const p of Object.values(people)) {
  const byYear = {};
  for (const c of p.credits) if (c.r === 'dir') (byYear[c.f.y] = byYear[c.f.y] || []).push(c.f.real);
  for (const [y, t] of Object.entries(byYear)) if (t.length > 1) out.push(['two-in-a-year', '', p.id, `${p.real} directed ${t.length} in ${y}: ${t.join(' / ')}`]);
}
const thin = Object.values(people).filter(p => p.lv >= 2 && p.credits.length < (p.lv >= 3 ? 4 : 2))
  .map(p => [p.id, p.real, p.r, p.lv, p.b || '', p.d || '', p.credits.length, p.credits.map(c => `${c.f.real} ${c.f.y}`).join('; ')]);
const dir = path.join(__dirname, '..', 'data', 'audit'); fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'credits.tsv'), out.map(r => r.join('\t')).join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'thin.tsv'), thin.map(r => r.join('\t')).join('\n') + '\n');
const n = {}; for (const r of out) n[r[0]] = (n[r[0]] || 0) + 1;
console.log(n, 'thin filmographies:', thin.length);
