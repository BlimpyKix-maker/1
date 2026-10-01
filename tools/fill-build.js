// Builds src/cat-fill.js, the filmography-completion batch, from data/fill/*.tsv.
//   people.tsv: real name | game name | born | died | role | hub | level | sex | note
//   films-*.tsv: real title | year | game title | hub | studio id | genre | directors | cast | quality | extras
//   cast-*.tsv: person's real name | real film title | year — adds a cast credit to a film already catalogued
// Directors and cast are real names separated by ';' and must exist in the catalogue or people.tsv.
// Extras are ';'-separated: list, cult=70, flop, wri=Name+Name, aw=Award text, note=Text.
// Films already in the catalogue (same real title and year) are skipped with a warning.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), dir = path.join(root, 'data', 'fill');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace(/\/\/ <cat-fill>\n[\s\S]*?\/\/ <\/cat-fill>\n/, '');
fs.writeFileSync(path.join(root, 'data', 'fill', '.base.html'), html);
process.env.APPLEBOX_HTML = path.join(root, 'data', 'fill', '.base.html');
const h = require('./harness.js');
fs.unlinkSync(process.env.APPLEBOX_HTML);
const C = h.run('CATALOGUES'), GENRES = h.run('GENRES'), HUBS = h.run('HUBS');
const byName = {}, ids = new Set(), have = new Set(), studios = new Set(), titles = new Set(), filmKey = {};
for (const c of C) {
  for (const p of c.people || []) { ids.add(p.id); (byName[p.real] = byName[p.real] || []).push(p.id); }
  for (const f of c.films || []) { have.add(f.real.toLowerCase() + '|' + f.y); have.add(f.real.toLowerCase() + '|' + f.dir[0]); ids.add(f.id); titles.add(f.t.toLowerCase()); filmKey[f.real.toLowerCase() + '|' + f.y] = f; }
  for (const s of c.studios || []) studios.add(s.id);
}
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18);
const uniq = base => { let id = base, i = 2; while (ids.has(id)) id = base + '_' + i++; ids.add(id); return id; };
const rows = f => fs.readFileSync(f, 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => l.split('\t').map(s => s.trim()));
const errs = [], people = [], films = [];
const pf = path.join(dir, 'people.tsv');
if (fs.existsSync(pf)) for (const [real, n, b, d, r, hub, lv, sx, note] of rows(pf)) {
  if (byName[real]) { errs.push(`person already in catalogue: ${real}`); continue; }
  if (!HUBS[hub]) errs.push(`bad hub ${hub} for ${real}`);
  const id = uniq(slug(real.split(' ').pop()) + '_' + slug(real.split(' ')[0]).slice(0, 3));
  byName[real] = [id];
  const p = { id, real, n, b: +b, r, hub, lv: +lv || 1 };
  if (d) p.d = +d; if (sx === 'F') p.sx = 'F'; if (note) p.note = note;
  people.push(p);
}
const who = (s, ctx) => s ? s.split(';').map(x => x.trim()).filter(Boolean).map(x => { const L = byName[x]; if (!L) { errs.push(`unknown person "${x}" in ${ctx}`); return null; } if (L.length > 1) errs.push(`ambiguous "${x}" in ${ctx}: ${L.join(',')}`); return L[0]; }).filter(Boolean) : [];
let skipped = 0;
for (const file of fs.readdirSync(dir).filter(f => /^films-.*\.tsv$/.test(f)).sort()) for (const [real, y, t, hub, st, g, dirs, cast, q, extra] of rows(path.join(dir, file))) {
  const ctx = `${real} (${y}) [${file}]`;
  const d0 = who((dirs || '').split(';')[0], ctx)[0];
  if (have.has(real.toLowerCase() + '|' + y) || have.has(real.toLowerCase() + '|' + d0)) { skipped++; if (process.env.SHOW_SKIPPED) console.log('skip', real, y); continue; }
  have.add(real.toLowerCase() + '|' + y); have.add(real.toLowerCase() + '|' + d0);
  if (titles.has(t.toLowerCase())) errs.push(`game title "${t}" already used: ${ctx}`); titles.add(t.toLowerCase());
  if (!HUBS[hub]) errs.push(`bad hub ${hub}: ${ctx}`);
  if (st && !studios.has(st)) errs.push(`bad studio ${st}: ${ctx}`);
  if (!GENRES.includes(g)) errs.push(`bad genre ${g}: ${ctx}`);
  const f = { id: uniq(slug(real) + String(y).slice(2)), real, t, y: +y, hub };
  if (st) f.st = st;
  f.g = g; f.dir = who(dirs, ctx);
  if (!f.dir.length) errs.push(`no director: ${ctx}`);
  const c = who(cast, ctx); if (c.length) f.cast = c;
  f.q = +q;
  const ni = (extra || '').indexOf('note=');   // a note runs to the end of the line and may hold semicolons
  if (ni >= 0) f.note = extra.slice(ni + 5).trim();
  for (const e of (ni >= 0 ? extra.slice(0, ni) : extra || '').split(';').map(s => s.trim()).filter(Boolean)) {
    const [k, ...v] = e.split('='), val = v.join('=');
    if (k === 'list' || k === 'flop') f[k] = true;
    else if (k === 'cult') f.cult = +val;
    else if (k === 'wri') f.wri = who(val.replace(/\+/g, ';'), ctx);
    else if (k === 'aw') (f.aw = f.aw || []).push(val);
    else errs.push(`bad extra ${e}: ${ctx}`);
  }
  films.push(f);
}
for (const f of films) filmKey[f.real.toLowerCase() + '|' + f.y] = f;
const castAdd = {};
for (const file of fs.readdirSync(dir).filter(f => /^cast-.*\.tsv$/.test(f)).sort()) for (const [name, real, y] of rows(path.join(dir, file))) {
  const ctx = `${name} in ${real} (${y}) [${file}]`, f = filmKey[real.toLowerCase() + '|' + y], pid = who(name, ctx)[0];
  if (!f) { errs.push(`film not catalogued: ${ctx}`); continue; }
  if (!pid || (f.cast || []).includes(pid) || f.dir.includes(pid)) continue;
  if (films.includes(f)) (f.cast = f.cast || []).push(pid);
  else if (!(castAdd[f.id] = castAdd[f.id] || []).includes(pid)) castAdd[f.id].push(pid);
}
const J = o => '  ' + JSON.stringify(o).replace(/"(\w+)":/g, '$1: ').replace(/,(?=\w+: )/g, ', ').replace(/^\{/, '{ ').replace(/\}$/, ' }');
const out = `// Filmography completion: real films missing from the era batches. Generated by tools/fill-build.js from data/fill/.
const CATFILL = {
batch: { id: 'fill' },
studios: [],
castAdd: ${JSON.stringify(castAdd)},
people: [
${people.map(J).join(',\n')}
],
films: [
${films.map(J).join(',\n')}
]
};
`;
fs.writeFileSync(path.join(root, 'src', 'cat-fill.js'), out);
console.log(`${people.length} people, ${films.length} films (${skipped} already in the catalogue), cast added to ${Object.keys(castAdd).length} films`);
if (errs.length) { console.log(errs.join('\n')); process.exitCode = 1; }
