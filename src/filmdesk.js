// ---------------- The Film Desk: test screenings, the film markets, the awards race ----------------
// Three ways to steer a film you control after the cameras stop, in one app:
//  1. Test screenings. Once a film is in post-production you can show it to a recruited audience. The cards give a
//     top-two-box score ("excellent" or "very good"), a definite-recommend score and a read on the opening, middle
//     and ending. What they react to is the cut as it stands (the film's quality without the luck of release
//     night). Then: recut the weakest part, reshoot the ending, cut a new trailer, or lock it. Every fix costs weeks
//     and money and can go wrong, and a disastrous screening can leak.
//  2. Pre-sales at the film markets. Four markets a year (Berlin in February, Cannes in May, Toronto in September,
//     the AFM in November). Go yourself or send a sales agent, and buyers make offers territory by territory: a
//     minimum guarantee (MG), 10% on signing and 90% on delivery. Accept, counter (they may walk), or pass. A sold
//     territory's box office belongs to its buyer, who pays you half of anything past 125% of the MG. Offers follow
//     the territory's size, the genre's travel, the lead's international fame and a good test screening.
//  3. The awards race. Live odds for each category in your market, critics' circles in December (precursors that
//     voters notice), a publicist (paid per nomination), weekly trade-ad buys with diminishing returns, and which
//     category you push. Ceremonies now announce nominations, and a nomination or a win brings a re-release bump.
OS_EXTRA.filmdesk = ['🎞️', 'Film Desk', 'Test screenings, the film markets, the awards race, the release plan and streaming'];
OS_VIEWS.filmdesk = () => fdHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'Make'); if (g && !g[1].includes('filmdesk')) g[1].push('filmdesk'); }
function fdMyCo() { return typeof myCo === 'function' ? myCo() : null; }
function fdOwn(f) { const c = fdMyCo(); return !!(f && ((c && f.co === c.id) || (S.me && f.dir === S.me.id))); }
function fdPay(f, amt) { const c = fdMyCo(); if (c && f.co === c.id) { if (c.cash < amt) return false; c.cash -= amt; return true; } f.cost += amt; return true; }   // the studio pays on a film you only direct
// ---- 1. test screenings ----
function previewQ(f) {
  const g0 = gauss, bd = f.bd; gauss = () => 0; let q; try { q = computeQuality(f); } finally { gauss = g0; f.bd = bd; }
  return q;
}
function screenCards(f) {
  const n = (f.scr || {}).n || 0, pq = previewQ(f), h = (k, s = 1) => (gH(f.id, n, k) - .5) * 2 * s;
  const t2b = Math.round(clamp(35 + (pq - 50) * 1.1 + ((f.hook || 50) - 50) * .25 + h('t', 6), 5, 97));
  const rec = Math.round(clamp(t2b * .72 + h('r', 5), 3, 95));
  const parts = { opening: pq + h('o', 8), middle: pq + h('m', 8) - 2, ending: pq + h('e', 9) };
  const weak = Object.entries(parts).sort((a, b) => a[1] - b[1])[0][0];
  return { t2b, rec, parts, weak, pq };
}
function fdScreen(a) {
  const f = S.films[+a.film]; if (!f || !fdOwn(f) || f.rel !== null || f.stage !== 3) return false;
  const st = f.scr = f.scr || { n: 0, log: [] }, k = a.k;
  if (k === 'run') { if (st.n >= 4 || !fdPay(f, f.budget * .004)) return false; const C = screenCards(f); st.n++; st.last = C; st.lastW = S.week;
    st.log.push({ w: S.week, t: `Screening ${st.n}: top-two-box ${C.t2b}%, definite recommend ${C.rec}%. Weakest: the ${C.weak}.` });
    if (C.t2b < 45 && gH(f.id, st.n, 'leak') < .3) { f.hook = clamp((f.hook || 50) - 5, 5, 99); news('Industry', `Word from a rough test screening of ${f.title}: the ${C.weak} isn't working.`, { film: f.id }); st.log.push({ w: S.week, t: 'It leaks. The trades have the scores by Friday.' }); }
    if (C.t2b >= 75) f.hook = clamp((f.hook || 50) + 2, 5, 99);
    return true; }
  if (!st.last || st.fixN === st.n) return false;   // one fix per screening
  if (k === 'recut') { if (!fdPay(f, f.budget * .01)) return false; f.stageEnd += 2; const ok = roll('tas', 12), r = S.me.lastRoll; const v = ok ? (r && r.crit > 0 ? 3 : 2) : .5; f.qBonus = (f.qBonus || 0) + v; st.fixN = st.n;
    st.log.push({ w: S.week, t: `Recut the ${st.last.weak}${ok ? ': it plays' : ': hard to tell'} (two weeks).`, ok }); return true; }
  if (k === 'reshoot') { if (!fdPay(f, f.budget * .06)) return false; f.stageEnd += 5; const ok = roll('orig', 13); const v = ok ? 4 : -1; f.qBonus = (f.qBonus || 0) + v; st.fixN = st.n;
    st.log.push({ w: S.week, t: ok ? 'Reshot the ending. The new one lands (five weeks).' : 'Reshot the ending. Now nobody can agree which version was better (five weeks).', ok }); return true; }
  if (k === 'trailer') { if (!fdPay(f, f.budget * .01)) return false; f.hook = clamp((f.hook || 50) + 6, 5, 99); st.fixN = st.n; st.log.push({ w: S.week, t: 'New trailer, new poster: the campaign leans on what the audience liked.' }); return true; }
  if (k === 'lock') { st.locked = 1; st.fixN = st.n; st.log.push({ w: S.week, t: 'Picture lock.' }); return true; }
  return false;
}
// ---- 2. the film markets ----
const FILM_MKTS = [{ k: 'efm', n: 'the European Film Market (Berlin)', wk: [5, 6] }, { k: 'cannes', n: 'the Marché du Film (Cannes)', wk: [19, 20] }, { k: 'tiff', n: 'the Toronto sales market', wk: [36, 37] }, { k: 'afm', n: 'the American Film Market', wk: [44, 45] }];
function mktNow(w = S.week) { const k = woy(w); return FILM_MKTS.find(m => k >= m.wk[0] && k <= m.wk[1]) || null; }
function mktNext() { const k = woy(); const L = FILM_MKTS.map(m => [m, (m.wk[0] - k + 52) % 52]).sort((a, b) => a[1] - b[1]); return L[0]; }
function salesTerrs(f) { const y = S.year; return Object.keys(MARKETS).filter(m => m !== f.m && HUB_IDS.some(h => HUBS[h].m === m)).map(m => [m, marketSize(m, y) * era(MARKETS[m].imp, y)]).sort((a, b) => b[1] - a[1]).slice(0, 8); }
function salesAppeal(f) {
  const lead = P((f.cast || [])[0]), d = P(f.dir), sc = (f.scr || {}).last;
  return clamp(.35 + (lead ? (lead.intl || 0) / 120 : 0) + (d ? d.standing / 300 : 0) + ((TRAVEL || {})[f.genre] || 0) + ((f.hook || 50) - 50) / 400 + (sc ? (sc.t2b - 55) / 200 : 0), .12, 1.2) * (S.year >= 2015 ? .85 : 1);
}
// what a buyer expects the territory to return them (comparable films' gross ÷ cost × budget, the foreign share, the
// territory's slice of it, rentals), scaled by the package's appeal: a fair MG is a bit under that
function salesEst(f, m) { const T = salesTerrs(f), tot = T.reduce((t, x) => t + x[1], 0), w = (T.find(x => x[0] === m) || [0, 0])[1], comps = typeof futComps === 'function' ? Math.min(3, futComps(f)) : 2; return f.budget * comps * .45 * .4 * (tot ? w / tot : 0) * salesAppeal(f); }
function salesOK(f) { return f && fdOwn(f) && f.co !== undefined && f.co !== null && fdMyCo() && f.co === fdMyCo().id && f.rel === null && f.stage >= 0 && !f.streamSold && !(f.dist && f.dist.intl); }
function fdMkt(a) {
  const M = S.me, mk = mktNow(); if (!mk) return false; const key = S.year + mk.k;
  if (a.k === 'attend' || a.k === 'agent') { if (M.mktGo === key) return false; if (a.k === 'attend') { if (M.cash < usd(2500)) return false; M.cash -= usd(2500); M.energy = clamp(M.energy - 15, 0, 100); } M.mktGo = key; M.mktHow = a.k;
    const c = fdMyCo(); const L = c ? c.films.map(i => S.films[i]).filter(salesOK) : [];
    for (const f of L) { f.sales = f.sales || {}; for (const [m] of salesTerrs(f)) { const s = f.sales[m]; if (s && s.st === 'sold') continue; const est = salesEst(f, m); if (est < .005) continue;
      const buyer = S.companies.filter(x => x.closed === null && x.owner === undefined && HUBS[x.hub].m === m).sort((x, y) => gH(x.id, f.id, key) - gH(y.id, f.id, key))[0];
      if (!buyer || gH(f.id, m, key, 'want') > .55 + salesAppeal(f) * .4) { f.sales[m] = { st: 'none', key }; continue; }
      f.sales[m] = { st: 'offer', key, mg: est * (.75 + gH(f.id, m, key) * .35) * (a.k === 'agent' ? .92 : 1), buyer: buyer.id }; } }
    return true; }
  const f = S.films[+a.film], s = f && f.sales && f.sales[a.terr]; if (!f || !salesOK(f) || !s || s.key !== key || !['offer', 'firm'].includes(s.st)) return false;
  const c = fdMyCo(), fee = M.mktHow === 'agent' ? .12 : 0;
  const sell = () => { s.st = 'sold'; s.w = S.week; c.cash += s.mg * .1 * (1 - fee); s.fee = fee; (f.fin = f.fin || { log: [] }).log = f.fin.log || []; f.fin.log.push({ w: S.week, t: `Sold ${MARKETS[a.terr].name} to ${S.companies[s.buyer].name}: ${fmtM(s.mg)} MG, 10% now.`, tone: 'good' }); };
  if (a.k === 'accept') { sell(); return true; }
  if (a.k === 'pass') { s.st = 'passed'; return true; }
  if (a.k === 'counter' && s.st === 'offer' && M.mktHow === 'attend') { const ok = roll('pack', 13 + (s.mg > salesEst(f, a.terr) ? 2 : 0));
    if (ok) { s.mg *= 1.15; sell(); s.counter = 'won'; } else if (gH(f.id, a.terr, 'walk', S.week) < .45) { s.st = 'walked'; } else { s.st = 'firm'; }
    return true; }
  return false;
}
// delivery: the buyers pay the rest, and keep their territory's box office
{ const _rl = release; release = function (f) {
  const out = _rl.apply(this, arguments); if (!f.sales || f.salesDone) return out; f.salesDone = 1;
  const c = f.co !== undefined && f.co !== null ? S.companies[f.co] : null; if (!c) return out;
  for (const [m, s] of Object.entries(f.sales)) { if (s.st !== 'sold') continue; const rT = (f.gross[m] || 0) * .4, over = Math.max(0, rT - s.mg * 1.25) * .5;
    c.cash += -rT + s.mg * .9 * (1 - (s.fee || 0)) + over; s.rT = rT; s.over = over;
    if (f.fin && f.fin.log) f.fin.log.push({ w: S.week, t: `${MARKETS[m].name}: ${S.companies[s.buyer] ? S.companies[s.buyer].name : 'the buyer'} pays the last 90% of its ${fmtM(s.mg)} MG${over > 0 ? ` and ${fmtM(over)} in overages` : ''}; the territory took ${fmtM(f.gross[m] || 0)}.` }); }
  return out; }; }
// ---- 3. the awards race ----
// how voters see a film in one category: the ceremony's own formula, plus campaign, precursors and the category pushed
function raceScore(f, cat) {
  const c = f.camp || 0, p = f.prec || 0, foc = f.campF === cat ? c * .5 : 0;
  return cat === 'film' ? f.q + c + p + foc : cat === 'perf' ? (P(f.cast[0]) ? P(f.cast[0]).c.act : 10) + f.q / 10 + c / 3 + p / 3 + foc : (f.bd ? f.bd.S : 0) + c / 2 + p / 2 + foc;
}
function raceScores(m, cat, y = S.year) {
  return S.films.filter(x => x.rel !== null && x.ry === y && x.m === m && !x.real && x.q !== null && x.cast && x.cast.length).map(f => [f, raceScore(f, cat)]).sort((a, b) => b[1] - a[1]);
}
function raceOdds(m, cat) { const R = raceScores(m, cat).slice(0, 8), T = cat === 'film' ? 3 : cat === 'perf' ? 1.2 : 1.5; const e = R.map(([f, s]) => [f, Math.exp((s - (R[0] ? R[0][1] : 0)) / T)]), t = e.reduce((a, x) => a + x[1], 0) || 1; return e.map(([f, v]) => [f, v / t]); }
function fdCamp(a) {
  const M = S.me, f = S.films[+a.film]; if (!f || !campaignSeason() || !campaignFilms().includes(f)) return false;
  if (a.k === 'focus') { if (!['film', 'perf', 'scr'].includes(a.v)) return false; f.campF = a.v; return true; }
  if (a.k === 'pub') { if (f.campPub || M.cash < usd(5000)) return false; M.cash -= usd(5000); f.campPub = 1; f.camp = clamp((f.camp || 0) + 2.5, -6, 12); return true; }
  if (a.k === 'ads') { if (f.adsW === S.week || M.cash < usd(2500)) return false; M.cash -= usd(2500); f.adsW = S.week; f.adsN = (f.adsN || 0) + 1; f.camp = clamp((f.camp || 0) + .9 / (1 + (f.adsN - 1) * .35), -6, 12); return true; }
  return false;
}
// critics' circles in December: the precursors voters notice
function precursorWeek() {
  if (!S.me || woy() !== 49 || S.precY === S.year) return; S.precY = S.year;
  for (const m of ['US', 'UK', 'FR', HUBS[S.me.hub].m].filter((x, i, A) => A.indexOf(x) === i)) {
    const L = S.films.filter(x => x.rel !== null && x.ry === S.year && x.m === m && !x.real && x.q !== null); if (L.length < 3) continue;
    const top = L.map(f => [f, f.q + (f.reviews || 50) / 10 + (f.camp || 0) / 2 + (gH(f.id, S.year, 'prec') - .5) * 6]).sort((a, b) => b[1] - a[1]).slice(0, 2);
    top.forEach(([f], i) => { f.prec = (f.prec || 0) + (i ? .8 : 1.6); });
    news('Award', `The ${MARKETS[m].name} critics' circles name ${top[0][0].title} the film of the year${top[1] ? `; ${top[1][0].title} is runner-up` : ''}.`, { film: top[0][0].id });
    for (const [f] of top) if (campaignFilms().includes(f)) inbox('note', `${f.title} wins with the critics`, `A precursor prize: the critics' circles ${f === top[0][0] ? 'name it the film of the year' : 'make it their runner-up'}. Voters notice these.`, { film: f.id });
  }
}
// the ceremony: nominations, category campaigns, precursors, and the bump that follows
{ const _na = nationalAwards; nationalAwards = function (films) {
  if (!S.me) return _na(films);
  const y = S.year - 1, myF = new Set((S.films.filter(f => f.ry === y && (fdOwn(f) || (ME().credits || []).includes(f.id))).map(f => f.id)));
  const by = {}; for (const f of films) (by[f.m] = by[f.m] || []).push(f);
  for (const m in by) { if (by[m].length < 2) continue;
    for (const cat of ['film', 'perf', 'scr']) { const R = raceScores(m, cat, y).slice(0, 5); for (const [f] of R) { (f.noms = f.noms || []).push(`${ceremony(m)}: ${({ film: 'Best Film', perf: 'Best Performance', scr: 'Best Screenplay' })[cat]} ${y}`);
      if (myF.has(f.id)) { ME().standing = clamp(ME().standing + .4, 0, 100); if (f.campPub) S.me.cash -= usd(2000); f.after = f.after || {}; const b = f.total * .015; f.after['Nomination bump'] = (f.after['Nomination bump'] || 0) + b; f.afterTotal = (f.afterTotal || 0) + b; const c = f.co !== null && f.co !== undefined ? S.companies[f.co] : null; if (c && c.closed === null) c.cash += b * .5;
        inbox('note', `Nominated: ${f.title}`, `${ceremony(m)}, ${({ film: 'Best Film', perf: 'Best Performance', scr: 'Best Screenplay' })[cat]}.${f.campPub ? ' Your publicist sends an invoice for the nomination bonus.' : ''}`, { film: f.id }); } } }
  }
  // the votes, category by category (the same formulas as before, with campaign focus and precursors)
  const n0 = S.awards.length;
  for (const m in by) { const L = by[m]; if (L.length < 2) continue;
    const best = L.reduce((a, b) => (raceScore(b, 'film') + gauss() * 3 > raceScore(a, 'film') ? b : a)); award(best, `${ceremony(m)}: Best Film`, [best.dir, best.prod]);
    const act = L.reduce((a, b) => (raceScore(b, 'perf') > raceScore(a, 'perf') ? b : a)); award(act, `${ceremony(m)}: Best Performance`, [act.cast[0]]);
    const scr = L.reduce((a, b) => (raceScore(b, 'scr') > raceScore(a, 'scr') ? b : a)); award(scr, `${ceremony(m)}: Best Screenplay`, scr.wri);
    if (['US', 'UK', 'FR', 'JP', 'IN', 'HK', 'IT'].includes(m)) news('Award', `${best.title} wins Best Film at the ${ceremony(m)}.`, { film: best.id }); }
  const out = undefined;
  for (const a of S.awards.slice(n0)) { const f = S.films[a.film]; if (!f || !/Best Film/.test(a.name)) continue; const b = f.total * .06; f.after = f.after || {}; f.after['Awards re-release'] = (f.after['Awards re-release'] || 0) + b; f.afterTotal = (f.afterTotal || 0) + b; const c = f.co !== null && f.co !== undefined ? S.companies[f.co] : null; if (c && c.closed === null) c.cash += b * .5; }
  return out; }; }
// ---- the app ----
function fdHTML() {
  const t = UI.fdT || 'screen', tabs = [['screen', 'Test screenings'], ['sales', 'Film markets'], ['awards', 'Awards race']].map(([k, l]) => `<button class="tk-chip${t === k ? ' on' : ''}" data-fd="tab:${k}">${l}</button>`).join('');
  return `<div class="tk tk-${UI.tkTheme || 'amber'} lg"><div class="tk-top"><span class="tk-brand">FILM DESK</span><span class="tk-sub">${esc(fmtDate(S.week, true))}</span><span class="tk-sp"></span>${tabs}</div>${t === 'sales' ? fdSalesHTML() : t === 'awards' ? fdAwardsHTML() : fdScreenHTML()}</div>`;
}
function fdScreenHTML() {
  const c = fdMyCo(), L = S.films.filter(f => f.rel === null && f.stage === 3 && fdOwn(f));
  if (!L.length) return `<p class="tk-foot">No film of yours is in post-production. Screenings open once a film you produce or direct finishes shooting.</p>`;
  return `<div class="tk-grid">${L.map(f => { const st = f.scr || { n: 0, log: [] }, C = st.last, can = st.last && st.fixN !== st.n && !st.locked;
    const bar = (l, v) => `<div class="tk-bar"><span>${l}</span><i style="width:${clamp(v, 0, 100)}%"></i><b>${Math.round(v)}</b><span></span></div>`;
    return `<section class="tk-p tk-wide"><h4>${fl(f.id)} <span class="tk-sub">${esc(f.genre)} · ${fmtM(f.budget)} · release ${esc(fmtDate(f.stageEnd, true))}${st.locked ? ' · locked' : ''}</span></h4>
     ${C ? `<div class="tk-kpis"><div class="tk-kpi"><span>TOP-TWO-BOX</span><b class="tk-v ${C.t2b >= 70 ? 'up' : C.t2b < 50 ? 'dn' : ''}">${C.t2b}%</b></div><div class="tk-kpi"><span>DEFINITE RECOMMEND</span><b class="tk-v">${C.rec}%</b></div><div class="tk-kpi"><span>SCREENINGS</span><b class="tk-v">${st.n}/4</b></div><div class="tk-kpi"><span>WEAKEST</span><b class="tk-v dn">${C.weak}</b></div></div>
      <div class="tk-bars">${bar('Opening', C.parts.opening)}${bar('Middle', C.parts.middle)}${bar('Ending', C.parts.ending)}</div>` : '<p class="tk-foot">No screenings yet. The first tells you how the cut is playing; it can\'t see how the critics will be on the night.</p>'}
     <p>${!st.locked && st.n < 4 ? `<button class="tk-chip" data-fd="screen:${f.id}:run">Screen it (${fmtM(f.budget * .004)})</button>` : ''}
      ${can ? `<button class="tk-chip" data-fd="screen:${f.id}:recut">Recut the ${C.weak} (+2 wks, ${fmtM(f.budget * .01)}, taste 12)</button><button class="tk-chip" data-fd="screen:${f.id}:reshoot">Reshoot the ending (+5 wks, ${fmtM(f.budget * .06)}, originality 13)</button><button class="tk-chip" data-fd="screen:${f.id}:trailer">New trailer (${fmtM(f.budget * .01)})</button><button class="tk-chip" data-fd="screen:${f.id}:lock">Lock picture</button>` : ''}</p>
     ${st.log.length ? `<ul class="plain small">${st.log.slice(-5).reverse().map(x => `<li><span class="tk-mut">${esc(fmtDate(x.w, true))}</span> ${esc(x.t)}</li>`).join('')}</ul>` : ''}</section>`; }).join('')}</div>`;
}
function fdSalesHTML() {
  const M = S.me, mk = mktNow(), c = fdMyCo(), L = c ? c.films.map(i => S.films[i]).filter(salesOK) : [], key = mk ? S.year + mk.k : '';
  const head = mk ? (M.mktGo === key ? `<p class="tk-foot">You're at ${esc(mk.n)}${M.mktHow === 'agent' ? ' through a sales agent (12% commission, no countering)' : ''}. Offers stand until the market closes.</p>` : `<p><b>${esc(mk.n)} is on.</b> <button class="tk-chip" data-fd="mkt:attend">Fly out and sell it yourself (${fmtCash(usd(2500))})</button> <button class="tk-chip" data-fd="mkt:agent">Send a sales agent (12% of sales)</button></p>`) : (() => { const [n, w] = mktNext(); return `<p class="tk-foot">No market on. Next: ${esc(n.n)} in ${w} week${w === 1 ? '' : 's'}.</p>`; })();
  if (!L.length) return head + '<p class="tk-foot">Pre-sales need a film your company is making that hasn\'t been sold abroad already (or to a streamer).</p>';
  return head + `<div class="tk-grid">${L.map(f => { const T = salesTerrs(f), S2 = f.sales || {}, sold = Object.values(S2).filter(s => s.st === 'sold').reduce((t, s) => t + s.mg, 0);
    return `<section class="tk-p tk-wide"><h4>${fl(f.id)} <span class="tk-sub">appeal ${salesAppeal(f).toFixed(2)} · sold ${fmtM(sold)} of ${fmtM(f.budget)} budget</span></h4><table class="tk-t"><thead><tr><th>Territory</th><th class="n">Estimate</th><th>Buyer</th><th class="n">Offer (MG)</th><th>Status</th><th></th></tr></thead><tbody>${T.map(([m]) => { const s = S2[m] || {}, live = s.key === key && ['offer', 'firm'].includes(s.st);
      return `<tr><td>${esc(MARKETS[m].name)}</td><td class="n tk-mut">${fmtM(salesEst(f, m))}</td><td>${s.buyer !== undefined && S.companies[s.buyer] ? esc(S.companies[s.buyer].name) : ''}</td><td class="n">${s.mg ? fmtM(s.mg) : ''}</td><td>${s.st === 'sold' ? '<span class="up">sold</span>' : s.st === 'walked' ? '<span class="dn">walked</span>' : s.st === 'none' && s.key === key ? '<span class="tk-mut">no interest</span>' : s.st === 'firm' ? 'final offer' : s.st === 'passed' ? '<span class="tk-mut">passed</span>' : live ? 'offer' : ''}</td><td class="nowrap">${live ? `<button class="tk-chip" data-fd="sale:${f.id}:${m}:accept">accept</button>${s.st === 'offer' && M.mktHow === 'attend' ? `<button class="tk-chip" data-fd="sale:${f.id}:${m}:counter">counter +15%</button>` : ''}<button class="tk-chip" data-fd="sale:${f.id}:${m}:pass">pass</button>` : ''}</td></tr>`; }).join('')}</tbody></table></section>`; }).join('')}</div>
   <p class="tk-foot">A minimum guarantee pays 10% on signing and 90% on delivery. The buyer keeps that territory's box office and pays you half of anything past 125% of the MG. Counter-offers need the deal-making roll (13, 15 against a strong offer); a failed counter can make the buyer walk.</p>`;
}
function fdAwardsHTML() {
  const M = S.me, m = HUBS[M.hub].m, on = campaignSeason(), mine = on ? campaignFilms() : [];
  const cats = [['film', 'Best Film'], ['perf', 'Best Performance'], ['scr', 'Best Screenplay']];
  const board = cats.map(([k, l]) => `<section class="tk-p"><h4>${l.toUpperCase()} <span class="tk-sub">${esc(ceremony(m))}</span></h4><table class="tk-t"><tbody>${raceOdds(m, k).slice(0, 6).map(([f, p]) => `<tr${mine.includes(f) ? ' class="tk-mine"' : ''}><td>${fl(f.id)}${k === 'perf' && P(f.cast[0]) ? ` <span class="tk-mut">${esc(P(f.cast[0]).name)}</span>` : ''}${f.prec ? ' <span class="tk-warn">critics</span>' : ''}</td><td class="n">${Math.round(p * 100)}%</td></tr>`).join('') || '<tr><td class="tk-mut">No eligible films yet.</td></tr>'}</tbody></table></section>`).join('');
  const ctl = mine.map(f => `<section class="tk-p tk-wide"><h4>${fl(f.id)} <span class="tk-sub">campaign ${(f.camp || 0).toFixed(1)}${f.prec ? ` · precursors +${f.prec.toFixed(1)}` : ''}${f.campPub ? ' · publicist hired' : ''}</span></h4><p>Push for: ${cats.map(([k, l]) => `<button class="tk-chip${f.campF === k ? ' on' : ''}" data-fd="camp:${f.id}:focus:${k}">${l}</button>`).join('')}
    ${f.campPub ? '' : `<button class="tk-chip" data-fd="camp:${f.id}:pub">Hire a publicist (${fmtCash(usd(5000))} + ${fmtCash(usd(2000))} per nomination)</button>`}
    <button class="tk-chip" data-fd="camp:${f.id}:ads" ${f.adsW === S.week ? 'disabled' : ''}>Trade ads this week (${fmtCash(usd(2500))}, +${(.9 / (1 + (f.adsN || 0) * .35)).toFixed(2)})</button></p><p class="tk-foot">The one-off moves (screeners, Q&amp;As, the party) are on the Create tab's awards panel.</p></section>`).join('');
  return `${on ? '' : '<p class="tk-foot">Campaign season runs October to December; the ceremonies are in January. Odds below are the race so far.</p>'}<div class="tk-grid">${board}${ctl}</div><p class="tk-foot">Odds are how the race looks to voters now: quality, campaign, precursors and the category you push. Critics' circles vote in early December. A nomination brings a small re-release bump; Best Film a bigger one.</p>`;
}
function fdClick(t) {
  const d = t.dataset.fd; if (!d) return false; const p = d.split(':'); let ok = true;
  if (p[0] === 'tab') UI.fdT = p[1];
  else if (p[0] === 'screen') ok = doAct({ t: 'screen', film: +p[1], k: p[2] });
  else if (p[0] === 'mkt') ok = doAct({ t: 'mkt', k: p[1] });
  else if (p[0] === 'sale') ok = doAct({ t: 'mkt', film: +p[1], terr: p[2], k: p[3] });
  else if (p[0] === 'camp') ok = doAct({ t: 'camp2', film: +p[1], k: p[2], v: p[3] });
  if (!ok) inbox('note', 'Not now', 'That isn\'t possible right now: check the money, the timing, or whether it\'s already done.');
  render(true); if (S.me && S.me.lastRoll && ['screen', 'sale'].includes(p[0]) && typeof showRollOverlay === 'function' && /recut|reshoot|counter/.test(d)) showRollOverlay(S.me.lastRoll); return true;
}
// a film entering post-production is ready to screen
function fdWeek() {
  if (!S.me) return; precursorWeek();
  for (const f of S.active.map(i => S.films[i]).filter(f => f && f.rel === null && f.stage === 3 && fdOwn(f) && !f.scrAsk)) { f.scrAsk = 1; inbox('note', `${f.title} is in the cutting room`, 'It\'s ready to show to an audience. Test screenings are on the Film Desk, under Make.', { film: f.id }); }
  const mk = mktNow(); if (mk && woy() === mk.wk[0]) { const c = fdMyCo(); if (c && c.films.some(i => salesOK(S.films[i]))) inbox('note', `${mk.n[0].toUpperCase() + mk.n.slice(1)} opens`, 'Buyers from every territory, two weeks of meetings. Take your films to market from the Film Desk.'); }
}
