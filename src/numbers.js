// ---------------- Industry by numbers: the real record, next to this world's ----------------
// This world's own figures. (An earlier version set them beside statistics derived from a third-party dataset;
// those were removed. Real comparisons can return from open data, such as Wikidata, which is CC0.)
let NUMC = null;
// This world's own figures, worked out from its released films (display only; cached for the week).
function worldNumbers() {
  if (NUMC && NUMC.S === S && NUMC.w === S.week) return NUMC;
  const F = S.films.filter(f => f.rel !== null && f.rel <= S.week), by = {}, gen = {}, rev = {};
  let acts = 0, fem = 0;
  for (const f of F) {
    const d = Math.floor(yearOf(f.rel) / 10) * 10, b = by[d] = by[d] || { n: 0, g: {}, aut: 0, w: [0, 0, 0, 0], co: 0, fem: 0, acts: 0 };
    b.n++; b.g[f.genre] = (b.g[f.genre] || 0) + 1;
    const nw = (f.wri || []).length; b.w[Math.min(3, nw)]++;
    if ((f.wri || []).includes(f.dir)) b.aut++;
    if (f.codir && f.codir.length) b.co++;
    for (const c of f.cast || []) { const p = P(c); if (p) { b.acts++; acts++; if (p.g === 'F') { b.fem++; fem++; } } }
    const r = rev[f.genre] = rev[f.genre] || [0, 0]; r[0] += f.reviews || 0; r[1]++;
  }
  return NUMC = { S, w: S.week, n: F.length, by, rev, fem: acts ? fem / acts : 0 };
}
const numPct = (a, b) => b ? Math.round(a / b * 1000) / 10 : 0;
function numBars(rows, max, cls = '') { return `<div class="nb ${cls}">${rows.map(([label, v, txt, v2, txt2]) => `<div class="nb-r"><span class="nb-l">${esc(label)}</span><span class="nb-t"><i style="width:${Math.max(.5, v / max * 100)}%"></i>${v2 !== undefined ? `<b style="width:${Math.max(.5, v2 / max * 100)}%"></b>` : ''}</span><span class="nb-v">${txt}${txt2 !== undefined ? ` <em>${txt2}</em>` : ''}</span></div>`).join('')}</div>`; }
const numFmt = n => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'k' : String(n);
function numbersHTML() {
  const W = worldNumbers(), decs = Object.keys(W.by).map(Number).sort((a, b) => a - b), dsel = decs.includes(+UI.numDec) ? +UI.numDec : decs[decs.length - 1];
  if (!W.n) return '<p class="muted">No films have been released in this world yet.</p>';
  const wb = W.by[dsel] || { n: 0, g: {}, aut: 0, w: [0, 0, 0, 0], co: 0, fem: 0, acts: 0 };
  const wMax = Math.max(1, ...decs.map(d => W.by[d].n));
  const out = decs.map(d => [d + 's', W.by[d].n / wMax * 100, W.by[d].n.toLocaleString()]);
  const gRows = GENRES.map(g => [g, numPct(wb.g[g] || 0, wb.n), numPct(wb.g[g] || 0, wb.n) + '%']).filter(r => r[1] > 0).sort((a, b) => b[1] - a[1]);
  const wTot = wb.w.reduce((a, b) => a + b, 0) || 1;
  const wRows = [['One writer', 1], ['Two writers', 2], ['Three or more', 3]].map(([l, i]) => [l, numPct(wb.w[i], wTot), numPct(wb.w[i], wTot) + '%']);
  const aRows = decs.map(d => { const b = W.by[d], v = numPct(b.aut, b.n); return [d + 's', v, v + '%']; });
  const fRows = decs.map(d => { const b = W.by[d], v = b.acts ? numPct(b.fem, b.acts) : 0; return [d + 's', v, b.acts ? v + '%' : '–']; });
  const rg = Object.entries(W.rev).map(([g, r]) => [g, r[0] / r[1], Math.round(r[0] / r[1]) + ' / 100']).sort((a, b) => b[1] - a[1]);
  return `<div class="nums"><p class="muted small">This world's ${W.n.toLocaleString()} released films, measured. Use it to see where the business is crowded and where it is thin.</p>
   <section><h4>Feature films released, by decade</h4>${numBars(out, 100)}</section>
   <section><h4>The genre mix</h4><div class="nb-chips">${decs.map(d => `<button class="lib-f${d === dsel ? ' on' : ''}" data-numdec="${d}">${d}s</button>`).join('')}</div>${numBars(gRows, Math.max(1, ...gRows.map(r => r[1])))}</section>
   <section><h4>Who gets the credit</h4><h5>Women's share of acting credits</h5>${numBars(fRows, 60)}</section>
   <section><h4>Directors and writers</h4><h5>How many writers a film credits (${dsel}s)</h5>${numBars(wRows, 100)}<h5>The director also wrote it</h5>${numBars(aRows, 100)}</section>
   <section><h4>What critics score, by genre</h4>${numBars(rg, 100)}</section></div>`;
}
function numClick(t) { if (t.dataset.numdec) { UI.numDec = t.dataset.numdec; render(true); return true; } return false; }
// The real size of the business. The world simulates a few thousand named people; this says how many real workers each
// one stands for, so headcounts and applicant pools read at real scale. Rough global film, TV and music workforce,
// interpolated by year from industry employment estimates (US film and TV alone is about 2.4M jobs today).
const WORKFORCE = [[1900, 5e3], [1920, 1.2e5], [1950, 7e5], [1980, 1.6e6], [2000, 3.2e6], [2025, 6.5e6], [2100, 9e6]];
function workforceAt(y) { for (let i = 1; i < WORKFORCE.length; i++) { const [y1, v1] = WORKFORCE[i]; if (y <= y1) { const [y0, v0] = WORKFORCE[i - 1]; return v0 + (v1 - v0) * (y - y0) / (y1 - y0); } } return WORKFORCE[WORKFORCE.length - 1][1]; }
let WFC = null;
function namedWorking() { if (WFC && WFC.S === S && WFC.w === S.week) return WFC.n; const n = S.people.filter(p => !p.retired && !p.dead && p.debut !== null).length; WFC = { S, w: S.week, n }; return n; }
function workforceScale() { return Math.max(1, workforceAt(S.year) / Math.max(1, namedWorking())); }
