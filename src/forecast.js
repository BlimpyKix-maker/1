// ---------------- The forecast desk ----------------
// Comparable-film forecasting, the way studios and lenders do it: find the closest released films (same market,
// genre and tier, a budget within half, the last five years), read their gross ÷ cost multiples, and turn the spread
// into a range (10th / median / 90th percentile) for this film's budget. Then layer what's known: tracking near
// release, the release date (season and crowding), and your own P&A and window plan. Every forecast shows its
// inputs and the gross the film needs to break even, and the desk keeps score: its median miss on last year's
// releases in your market, so you know how far to trust it. A Film Desk tab; works on your films, your unmade
// scripts, and the industry's biggest upcoming releases.
function fcPool(m, genre) { if (FC_P.w !== S.week) { FC_P.w = S.week; FC_P.c = {}; } const k = m + '|' + genre; return FC_P.c[k] || (FC_P.c[k] = S.films.filter(x => x.rel !== null && x.total > 0 && x.cost > 0 && x.m === m && x.genre === genre && S.year - yearOf(x.rel) <= 8)); }
const FC_P = { w: -1, c: {} };
function fcComps(o) {
  const lo = o.budget * .5, hi = o.budget * 1.5, y = S.year, pool = fcPool(o.m, o.genre);
  let L = pool.filter(x => Math.abs((x.tier || 3) - o.tier) <= 1 && x.budget >= lo && x.budget <= hi && y - yearOf(x.rel) <= 5 && x.id !== o.id);
  if (L.length < 4) L = pool.filter(x => x.id !== o.id);
  const sim = x => Math.abs(Math.log(x.budget / o.budget)) + (x.tier !== o.tier ? .5 : 0) + (y - yearOf(x.rel)) * .08;
  return L.sort((a, b) => sim(a) - sim(b)).slice(0, 8);
}
function fcQ(arr, p) { if (!arr.length) return 0; const A = arr.slice().sort((a, b) => a - b), i = (A.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return A[lo] + (A[hi] - A[lo]) * (i - lo); }
function fcRun(o) {
  const C = fcComps(o), mult = C.map(x => x.total / x.cost), med = fcQ(mult, .5) || 1.5, p10 = fcQ(mult, .1) || med * .4, p90 = fcQ(mult, .9) || med * 2;
  const base = o.budget * med, adj = [];
  let k = 1;
  // comps reach back five years, and a market can run hot or cold since: scale by how this year's films are doing
  { const asOf = o.asOf ?? S.week, R = fcRecent(o.m, asOf).filter(x => Math.abs(x.t - o.tier) <= 1 && x.id !== o.id).map(x => x.x);
    if (R.length >= 5 && C.length) { const tr = clamp(fcQ(R, .5) / med, .5, 2.5); k *= tr; adj.push(['Market now', tr]); } }
  if (o.f && o.f.rel === null && o.f.stage === 3 && o.f.tier <= 2 && typeof futTrack === 'function') { const tr = futTrack(o.f), w = .6; k *= Math.pow(tr / base, w); adj.push(['Tracking', Math.pow(tr / base, w)]); }
  else if (o.f && o.f.stage === 3 && typeof relMul === 'function') { const r = relMul(o.f, o.f.stageEnd); k *= Math.pow(r, .62); adj.push(['Release date', Math.pow(r, .62)]); }
  if (o.f && o.f.dplan && typeof dMul === 'function') { const d = Math.pow(dMul(o.f), .62); k *= d; adj.push(['Your P&A and window', d]); }
  if (o.hook) { const hk = Math.pow((o.hook || 50) / 55, .7); k *= hk; adj.push(['Hook', hk]); }
  const pa = o.budget * [0, .55, .4, .2][o.tier || 3] * (o.f && o.f.paMul || 1), cost = (o.f ? o.f.cost : o.budget) || o.budget, be = (cost + pa) / (.62 * .5 + .38 * .4);
  return { C, mult, med, lo: o.budget * p10 * k, mid: base * k, hi: o.budget * p90 * k, adj, be, pa, cost };
}
// the last twelve months of releases in a market, as gross ÷ cost multiples (cached by week)
function fcRecent(m, asOf) { const key = m + ':' + asOf; if (FC_R.w !== S.week) { FC_R.w = S.week; FC_R.c = {}; } return FC_R.c[key] || (FC_R.c[key] = S.films.filter(x => x.rel !== null && x.m === m && x.total > 0 && x.cost > 0 && x.rel < asOf && x.rel >= asOf - 52).map(x => ({ id: x.id, t: x.tier || 3, x: x.total / x.cost }))); }
const FC_R = { w: -1, c: {} };
// how good is the desk? last year's releases in your market, forecast from the comps available before each opened
function fcScore() {
  const C = FC_C.w === S.week ? FC_C : (FC_C.w = S.week, FC_C.v = null, FC_C); if (C.v) return C.v;
  const m = HUBS[S.me.hub].m, L = S.films.filter(f => f.rel !== null && f.m === m && f.total > 0 && f.cost > 0 && f.rel > S.week - 52 && (f.tier || 3) <= 3).slice(-40);
  const err = L.map(f => { const R = fcRun({ id: f.id, m: f.m, genre: f.genre, tier: f.tier || 3, budget: f.budget, asOf: f.rel }); return Math.abs(Math.log(Math.max(.01, R.mid) / f.total)); });
  return (C.v = { n: err.length, med: err.length ? Math.exp(fcQ(err, .5)) - 1 : null, hit: err.length ? err.filter(e => e < Math.log(1.5)).length / err.length : null });
}
const FC_C = { w: -1, v: null };
function fcTargets() {
  const M = S.me, c = typeof myCo === 'function' ? myCo() : null, out = [];
  if (c) for (const i of c.films) { const f = S.films[i]; if (f && f.rel === null && f.stage >= 0) out.push(['film', f.id, f.title + ' (yours)']); }
  for (const s of (M.scripts || []).filter(x => x.grade && x.made === undefined)) out.push(['script', s.id, s.title + ' (script)']);
  for (const f of (typeof futList === 'function' ? futList() : []).slice(0, 6)) out.push(['film', f.id, f.title]);
  return out;
}
function fcHTML() {
  const T = fcTargets(); if (!T.length) return '<p class="tk-foot">Nothing to forecast yet: the desk works on your films, your finished scripts, and the industry\'s next big releases.</p>';
  const cur = UI.fcSel && T.find(t => t[0] + ':' + t[1] === UI.fcSel) || T[0], M = S.me;
  let o;
  if (cur[0] === 'film') { const f = S.films[cur[1]]; o = { id: f.id, f, m: f.m, genre: f.genre, tier: f.tier || 3, budget: f.budget, hook: f.stage < 3 ? f.hook : null, title: f.title }; }
  else { const s = (M.scripts || []).find(x => x.id === cur[1]); o = { m: HUBS[M.hub].m, genre: s.genre, tier: 3, budget: estBudget(s.genre), hook: 40 + (s.score || 60) / 4, title: s.title, script: 1 }; }
  const R = fcRun(o), sc = fcScore(), W = 520, X = v => 10 + Math.min(1, v / Math.max(R.hi, R.be) / 1.08) * (W - 20);
  const svg = `<svg class="fc-range" viewBox="0 0 ${W} 46" width="${W}" style="width:${W}px;max-width:100%;height:auto"><rect x="${X(R.lo)}" y="14" width="${Math.max(2, X(R.hi) - X(R.lo))}" height="14" class="fc-band"/><line x1="${X(R.mid)}" y1="8" x2="${X(R.mid)}" y2="34" class="fc-mid"/><line x1="${X(R.be)}" y1="4" x2="${X(R.be)}" y2="40" class="fc-be"/><text x="${X(R.be) > W * .7 ? X(R.be) - 3 : X(R.be) + 3}" y="44" class="fc-t" text-anchor="${X(R.be) > W * .7 ? 'end' : 'start'}">break-even ${fmtM(R.be)}</text><text x="${X(R.mid) > W * .7 ? X(R.mid) - 3 : X(R.mid) + 3}" y="10" class="fc-t" text-anchor="${X(R.mid) > W * .7 ? 'end' : 'start'}">median ${fmtM(R.mid)}</text></svg>`;
  return `<p>${T.map(t => `<button class="tk-chip${t === cur ? ' on' : ''}" data-fd="fc:${t[0]}:${t[1]}">${esc(t[2])}</button>`).join('')}</p>
   <div class="tk-grid"><section class="tk-p tk-wide"><h4>${esc(o.title)} <span class="tk-sub">${esc(o.genre)} · ${esc(MARKETS[o.m].name)} · budget ${fmtM(o.budget)}${o.script ? ' (estimate)' : ''}</span></h4>
    <div class="tk-kpis"><div class="tk-kpi"><span>LOW (P10)</span><b class="tk-v">${fmtM(R.lo)}</b></div><div class="tk-kpi"><span>MEDIAN</span><b class="tk-v">${fmtM(R.mid)}</b></div><div class="tk-kpi"><span>HIGH (P90)</span><b class="tk-v">${fmtM(R.hi)}</b></div><div class="tk-kpi"><span>BREAK-EVEN</span><b class="tk-v ${R.mid >= R.be ? 'up' : 'dn'}">${fmtM(R.be)}</b></div></div>
    ${svg}<p class="tk-foot">Comps median ×${R.med.toFixed(2)} of budget${R.adj.map(([l, v]) => ` · ${esc(l)} ×${v.toFixed(2)}`).join('')}. Break-even covers cost and P&amp;A (${fmtM(R.pa)}) at home and foreign rental rates.</p></section>
   <section class="tk-p tk-wide"><h4>COMPARABLE FILMS <span class="tk-sub">closest by budget, tier and recency</span></h4><table class="tk-t"><thead><tr><th>Film</th><th class="n">Year</th><th class="n">Budget</th><th class="n">Gross</th><th class="n">×</th><th class="n">Critics</th></tr></thead><tbody>${R.C.map(x => `<tr><td>${fl(x.id)}</td><td class="n tk-mut">${yearOf(x.rel)}</td><td class="n">${fmtM(x.budget)}</td><td class="n">${fmtM(x.total)}</td><td class="n ${x.total / x.cost >= 1.6 ? 'up' : 'dn'}">${(x.total / x.cost).toFixed(2)}</td><td class="n tk-mut">${x.reviews || ''}</td></tr>`).join('') || '<tr><td class="tk-mut" colspan="6">No comparable films on file.</td></tr>'}</tbody></table></section>
   <section class="tk-p"><h4>THE DESK'S RECORD <span class="tk-sub">last year, ${esc(MARKETS[HUBS[M.hub].m].name)}</span></h4>${sc.n ? `<div class="tk-kpis"><div class="tk-kpi"><span>MEDIAN MISS</span><b class="tk-v">${Math.round(sc.med * 100)}%</b></div><div class="tk-kpi"><span>WITHIN 50%</span><b class="tk-v">${Math.round(sc.hit * 100)}%</b></div></div><p class="tk-foot">${sc.n} releases, each forecast from comps alone. Tracking narrows it near release; quality, reviews and weather are what no forecast sees.</p>` : '<p class="tk-foot">Not enough releases yet.</p>'}</section></div>`;
}
{ const _fd = fdHTML; fdHTML = function () {
  const t = UI.fdT || 'screen'; if (t !== 'forecast') return _fd().replace('<span class="tk-sp"></span>', '<span class="tk-sp"></span><button class="tk-chip" data-fd="tab:forecast">Forecast</button>');
  const h = _fd(); const i = h.indexOf('</div>', h.indexOf('class="tk-top"')); const head = h.slice(0, i).replace(/ on"/g, '"').replace('<span class="tk-sp"></span>', '<span class="tk-sp"></span><button class="tk-chip on" data-fd="tab:forecast">Forecast</button>') + '</div>';
  return head + fcHTML() + '</div>'; }; }
{ const _fc = fdClick; fdClick = function (t) { const d = t.dataset.fd; if (d && d.startsWith('fc:')) { const p = d.split(':'); UI.fcSel = p[1] + ':' + p[2]; render(true); return true; } return _fc(t); }; }
